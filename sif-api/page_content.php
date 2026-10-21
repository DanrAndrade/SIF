<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Upload de arquivo genérico para subpasta organizada.
 * $module  = ex: 'associadas', 'institucional', 'home'
 * $subdir  = ex: 'logos', 'team', 'timeline'
 * $file    = $_FILES[...]
 * $compress = comprime se for imagem
 */
function uploadFile($file, string $module, string $subdir, bool $compress = true): ?string {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;

    $dir = "uploads/{$module}/{$subdir}/";
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $ext    = sif_safe_ext($file['tmp_name'], 'image,pdf', $file['name']); // tipo real
    if (!$ext) return null;
    $name   = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;

    if (!move_uploaded_file($file['tmp_name'], $target)) return null;

    // Converte imagens para WebP; PDFs e o que não converter, mantém.
    if ($compress) {
        $webp = convertToWebp($target);
        if ($webp) return $webp;
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) compressImage($target);
    }

    return str_replace('\\', '/', $target);
}

/**
 * Grava o conteúdo da página num arquivo de cache que o index.php lê para
 * injetar window.__BOOT__ no HTML inicial (1ª visita rápida, sem tocar o banco).
 * Best-effort: qualquer erro é ignorado (o site funciona sem o cache).
 */
function writeBootCache(string $page, array $data): void {
    try {
        $dir = __DIR__ . '/cache';
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        $safe = preg_replace('/[^a-z0-9_]/i', '', $page);
        if ($safe === '') return;
        // HEX_TAG/AMP: o JSON vai dentro de <script> no index.php — "<" e "&" não quebram o HTML
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);
        $file = $dir . '/boot_' . $safe . '.json';
        // Só grava quando mudou (antes gravava a cada visita)
        if (!is_file($file) || @file_get_contents($file) !== $json) @file_put_contents($file, $json, LOCK_EX);
    } catch (\Throwable $e) { /* cache é opcional */ }
}

// ─────────────────────────────────────────────────────────
// GET: Retorna config de uma página
// GET /page_content.php?page=home
// ─────────────────────────────────────────────────────────
if ($method === 'GET') {
    $page = trim($_GET['page'] ?? '');
    if (!preg_match('/^[a-z0-9][a-z0-9_]{0,63}$/i', $page)) {
        http_response_code(400);
        echo json_encode(['error' => 'Parâmetro "page" obrigatório.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = ?");
    $stmt->execute([$page]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && $row['config_json']) {
        $data = json_decode($row['config_json'], true) ?? [];
    } else {
        $data = [];
    }

    // Mantém o cache de boot atualizado (usado pelo index.php na 1ª visita).
    // Só para páginas que existem — evita criar arquivos para nomes inventados.
    if ($row) writeBootCache($page, $data);

    // ETag: permite que o navegador receba 304 (sem corpo) quando nada mudou,
    // e o conteúdo novo assim que o admin editar. Conteúdo público — sem login.
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $etag = '"' . md5($json) . '"';
    header('Cache-Control: no-cache, must-revalidate'); // sobrescreve o no-store do db.php
    header('ETag: ' . $etag);
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }

    echo $json;
    exit;
}

// ─────────────────────────────────────────────────────────
// POST: Salva config de uma página
// POST com FormData: page=home + content_json='{...}'
//   OU com imagens: page=home + hero_image (file)
// ─────────────────────────────────────────────────────────
if ($method === 'POST') {
    $page = trim($_POST['page'] ?? '');
    // Só letras, números e "_": o nome entra no caminho da pasta de upload
    if (!preg_match('/^[a-z0-9][a-z0-9_]{0,63}$/i', $page)) {
        http_response_code(400);
        echo json_encode(['error' => 'Campo "page" obrigatório.']);
        exit;
    }
    // Permissão: página → módulo (páginas sem módulo, só administrador)
    $pageModule = sif_page_module($page);
    if ($pageModule === null ? !sif_is_superadmin() : !sif_can($pageModule)) sif_deny();

    // Lê a config atual do banco
    $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = ?");
    $stmt->execute([$page]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $current = ($row && $row['config_json']) ? (json_decode($row['config_json'], true) ?? []) : [];

    // Merge com o JSON recebido (campo content_json)
    if (!empty($_POST['content_json'])) {
        $incoming = json_decode($_POST['content_json'], true);
        if (is_array($incoming)) {
            $incoming = sif_clean_deep($incoming); // textos com HTML: sem scripts/eventos
            $current = array_merge($current, $incoming);
        }
    }

    // ── Processa uploads de imagem por campo ──────────────
    // Campos de imagem são enviados como: hero_image, hero_bg, about_image, etc.
    // Mapeia campo -> subpasta por módulo
    $imageDirs = [
        'home'    => 'hero',
        'hero_bg' => 'hero',
        // Aceita qualquer campo de imagem e salva em "pages/{$page}/images"
    ];

    foreach ($_FILES as $fieldName => $file) {
        if ($file['error'] !== UPLOAD_ERR_OK) continue;

        $ext = sif_safe_ext($file['tmp_name'], 'image,pdf', $file['name']); // tipo real
        if (!$ext) continue;
        $isPdf = ($ext === 'pdf');
        $subdir = $isPdf ? 'docs' : 'images';

        $url = uploadFile($file, "pages/{$page}", $subdir, !$isPdf);
        if (!$url) continue;

        // Padrões nested:
        //   <section>_card_<idx>_image -> $current[section][cards][idx][image]
        //   <section>_step_<idx>_img   -> $current[section][steps][idx][img]
        if (preg_match('/^([a-z_]+)_card_(\d+)_image$/', $fieldName, $m)) {
            $section = $m[1]; $idx = (int)$m[2];
            if (!isset($current[$section]) || !is_array($current[$section])) $current[$section] = [];
            if (!isset($current[$section]['cards']) || !is_array($current[$section]['cards'])) $current[$section]['cards'] = [];
            if (!isset($current[$section]['cards'][$idx]) || !is_array($current[$section]['cards'][$idx])) $current[$section]['cards'][$idx] = [];
            $current[$section]['cards'][$idx]['image'] = $url;
        } elseif (preg_match('/^([a-z_]+)_step_(\d+)_img$/', $fieldName, $m)) {
            $section = $m[1]; $idx = (int)$m[2];
            if (!isset($current[$section]) || !is_array($current[$section])) $current[$section] = [];
            if (!isset($current[$section]['steps']) || !is_array($current[$section]['steps'])) $current[$section]['steps'] = [];
            if (!isset($current[$section]['steps'][$idx]) || !is_array($current[$section]['steps'][$idx])) $current[$section]['steps'][$idx] = [];
            $current[$section]['steps'][$idx]['img'] = $url;
        } else {
            // Padrão simples (hero_image, hero_bg, quem_somos_image, contact_photo, etc.)
            $current[$fieldName] = $url;
        }
    }

    // Grava no banco (INSERT OR UPDATE)
    $json = json_encode($current, JSON_UNESCAPED_UNICODE);
    $stmt = $pdo->prepare("
        INSERT INTO page_configs (page_key, config_json)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)
    ");
    $stmt->execute([$page, $json]);

    // Regenera o cache de boot com o conteúdo recém-salvo
    writeBootCache($page, $current);

    echo json_encode(['success' => true, 'data' => $current]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
?>
