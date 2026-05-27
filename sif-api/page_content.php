<?php
require_once 'db.php';
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

    $ext    = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name   = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;

    if (!move_uploaded_file($file['tmp_name'], $target)) return null;

    // Comprime apenas imagens
    if ($compress && in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        compressImage($target);
    }

    return str_replace('\\', '/', $target);
}

// ─────────────────────────────────────────────────────────
// GET: Retorna config de uma página
// GET /page_content.php?page=home
// ─────────────────────────────────────────────────────────
if ($method === 'GET') {
    $page = trim($_GET['page'] ?? '');
    if (!$page) {
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

    echo json_encode($data);
    exit;
}

// ─────────────────────────────────────────────────────────
// POST: Salva config de uma página
// POST com FormData: page=home + content_json='{...}'
//   OU com imagens: page=home + hero_image (file)
// ─────────────────────────────────────────────────────────
if ($method === 'POST') {
    $page = trim($_POST['page'] ?? '');
    if (!$page) {
        http_response_code(400);
        echo json_encode(['error' => 'Campo "page" obrigatório.']);
        exit;
    }

    // Lê a config atual do banco
    $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = ?");
    $stmt->execute([$page]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $current = ($row && $row['config_json']) ? (json_decode($row['config_json'], true) ?? []) : [];

    // Merge com o JSON recebido (campo content_json)
    if (!empty($_POST['content_json'])) {
        $incoming = json_decode($_POST['content_json'], true);
        if (is_array($incoming)) {
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

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
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

    echo json_encode(['success' => true, 'data' => $current]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
?>
