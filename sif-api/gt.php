<?php
/**
 * Grupos Temáticos.
 *   GET  ?slug=...         → um GT (com "responsavel": dados públicos do usuário responsável)
 *   GET  (lista)           → GTs ativos; ?admin=1 (logado) → todos, inclusive ocultos;
 *                            ?admin=1&mine=1 → só os que o usuário pode editar
 *   POST                   → cria/edita (FormData). toggle_active=1 → publicar/ocultar
 *   DELETE ?id=            → exclui
 *
 * Permissões:
 *   - módulo "gt" (ou administrador): tudo, inclusive criar/excluir, publicar/ocultar
 *     e escolher/criar o responsável.
 *   - responsável pelo GT (admins.gt_ids): edita só o conteúdo dos SEUS grupos
 *     (texto, blocos, imagens, arquivos) e o próprio perfil público.
 *
 * Responsável (só quem tem o módulo "gt"): campo responsavel_mode
 *   'keep'     → não mexe (padrão)
 *   'none'     → GT fica sem responsável
 *   'existing' → responsavel_id = usuário já cadastrado
 *   'new'      → cria um usuário (editor, sem módulos) com resp_name, resp_cargo,
 *                resp_email, resp_password, resp_photo, resp_whatsapp, resp_link, resp_link_label
 * Perfil público do responsável (resp_* acima, sem e-mail/senha) com resp_profile=1:
 * quem tem o módulo "gt" altera o de qualquer não-administrador; cada um altera o seu.
 */
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

// Junta o responsável (dados públicos) em cada GT. Responsável inativo não aparece.
function sif_gt_attach_resp(PDO $pdo, array $items): array {
    $ids = array_values(array_unique(array_filter(array_map(fn($g) => (int)($g['responsavel_id'] ?? 0), $items))));
    $map = [];
    if ($ids) {
        try {
            $in = implode(',', array_fill(0, count($ids), '?'));
            $st = $pdo->prepare("SELECT * FROM admins WHERE id IN ($in) AND COALESCE(active,1) = 1");
            $st->execute($ids);
            foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $a) $map[(int)$a['id']] = sif_gt_public_profile($a);
        } catch (Throwable $e) { /* colunas novas ainda não criadas */ }
    }
    foreach ($items as &$g) $g['responsavel'] = $map[(int)($g['responsavel_id'] ?? 0)] ?? null;
    return $items;
}

if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM gt WHERE slug = ?" . (sif_is_admin() ? '' : ' AND active = 1'));
        $stmt->execute([$_GET['slug']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) { http_response_code(404); echo json_encode(['error' => 'Não encontrado']); exit; }
        echo json_encode(sif_gt_attach_resp($pdo, [$item])[0]);
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin(); // itens ocultos só com login
        if ($adminMode) {
            sif_ensure_schema($pdo);
            $rows = $pdo->query("SELECT * FROM gt ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
            // Tela de GTs do painel (mine=1): responsável sem o módulo "gt" vê só os seus grupos
            if (isset($_GET['mine']) && !sif_can('gt')) $rows = array_values(array_filter($rows, fn($g) => sif_gt_can_edit($g['id'])));
        } else {
            $rows = $pdo->query("SELECT * FROM gt WHERE active = 1 ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode(sif_gt_attach_resp($pdo, $rows));
    }
    exit;
}

$full = sif_can('gt');
$fail = function (string $m, int $code = 400) { http_response_code($code); echo json_encode(['success' => false, 'status' => 'error', 'message' => $m]); exit; };

// Foto do perfil: só caminho de upload do próprio site
function sif_gt_clean_photo($p): string {
    $p = trim((string)$p);
    if ($p === '') return '';
    if (strpos($p, '..') !== false || !preg_match('#^uploads/[A-Za-z0-9_\-/]+\.(webp|jpe?g|png|gif|avif)$#i', $p)) return '';
    return $p;
}
function sif_gt_profile_fields(): array {
    $wa = preg_replace('/[^0-9+]/', '', (string)($_POST['resp_whatsapp'] ?? ''));
    $link = trim((string)($_POST['resp_link'] ?? ''));
    if ($link !== '' && !preg_match('#^https?://#i', $link)) $link = 'https://' . $link;
    if ($link !== '' && !filter_var($link, FILTER_VALIDATE_URL)) $link = '';
    $cEmail = strtolower(trim((string)($_POST['resp_contact_email'] ?? '')));
    if ($cEmail !== '' && !filter_var($cEmail, FILTER_VALIDATE_EMAIL)) $cEmail = '';
    return [
        'name'          => mb_substr(trim((string)($_POST['resp_name'] ?? '')), 0, 120),
        'cargo'         => mb_substr(trim((string)($_POST['resp_cargo'] ?? '')), 0, 120),
        'photo'         => sif_gt_clean_photo($_POST['resp_photo'] ?? ''),
        'whatsapp'      => substr($wa, 0, 40),
        'link'          => substr($link, 0, 500),
        'link_label'    => mb_substr(trim((string)($_POST['resp_link_label'] ?? '')), 0, 80),
        'contact_email' => substr($cEmail, 0, 190),
    ];
}

if ($method === 'POST') {

    if (isset($_POST['toggle_active'])) {
        if (!$full) sif_deny('Só quem administra os Grupos Temáticos pode publicar ou ocultar um grupo.');
        $id     = $_POST['id']     ?? null;
        $active = ((int)($_POST['active'] ?? 1)) ? 1 : 0;
        if (!$id) {
            echo json_encode(["success" => false, "error" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE gt SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    $id = (int)($_POST['id'] ?? 0) ?: null;
    // Criar: só com o módulo. Editar: módulo ou responsável por ESTE grupo.
    if (!$id && !$full) sif_deny('Só quem administra os Grupos Temáticos pode criar um grupo.');
    if ($id && !sif_gt_can_edit($id)) sif_deny('Você só pode editar os grupos temáticos pelos quais é responsável.');
    sif_ensure_schema($pdo);

    $prev = null;
    if ($id) {
        $st = $pdo->prepare("SELECT * FROM gt WHERE id = ?");
        $st->execute([$id]);
        $prev = $st->fetch(PDO::FETCH_ASSOC);
        if (!$prev) $fail('Grupo temático não encontrado.', 404);
    }

    // ---- responsável: valida ANTES de gravar o GT (erro não deixa nada pela metade)
    $mode = $_POST['responsavel_mode'] ?? 'keep';
    if (!in_array($mode, ['keep', 'none', 'existing', 'new'], true)) $mode = 'keep';
    if (!$full) $mode = 'keep'; // responsável não troca o responsável
    $me = sif_user();
    $respId = null;
    if ($mode === 'existing') {
        $respId = (int)($_POST['responsavel_id'] ?? 0);
        $st = $pdo->prepare("SELECT id FROM admins WHERE id = ? AND COALESCE(active,1) = 1");
        $st->execute([$respId]);
        if (!$respId || !$st->fetch()) $fail('Escolha um usuário ativo como responsável.');
    }
    $newUser = null;
    if ($mode === 'new') {
        $newUser = sif_gt_profile_fields();
        $email = strtolower(trim((string)($_POST['resp_email'] ?? '')));
        $pass  = (string)($_POST['resp_password'] ?? '');
        if ($newUser['name'] === '') $fail('Informe o nome do responsável.');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $fail('E-mail do responsável inválido.');
        if (strlen($pass) < 8) $fail('A senha inicial do responsável precisa ter pelo menos 8 caracteres.');
        $dup = $pdo->prepare("SELECT id FROM admins WHERE LOWER(email) = ?");
        $dup->execute([$email]);
        if ($dup->fetch()) $fail('Já existe um usuário com esse e-mail. Escolha-o na lista de usuários.');
        $newUser['email'] = $email;
        $newUser['password'] = password_hash($pass, PASSWORD_DEFAULT);
    }
    // Perfil público de um usuário existente
    $profileTarget = null;
    if (($_POST['resp_profile'] ?? '') === '1' && in_array($mode, ['keep', 'existing'], true)) {
        $profileTarget = $mode === 'existing' ? $respId : (int)($prev['responsavel_id'] ?? 0);
        if ($profileTarget) {
            $st = $pdo->prepare("SELECT role FROM admins WHERE id = ?");
            $st->execute([$profileTarget]);
            $tRole = $st->fetchColumn();
            $allowed = $profileTarget === $me['id'] || sif_is_superadmin() || ($full && $tRole !== 'admin');
            if (!$allowed) $profileTarget = null; // sem permissão: só não altera o perfil
        }
    }

    function uploadGtImage($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/gt/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext  = sif_safe_ext($file['tmp_name'], 'image', $file['name']); // tipo real, não o nome
        if (!$ext) return null;
        $name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }
        return null;
    }

    // Endereço (slug): quem não administra os GTs não muda o link do grupo
    $slug             = ($id && !$full) ? $prev['slug'] : ($_POST['slug'] ?? '');
    if ($id && trim((string)$slug) === '') $slug = $prev['slug']; // edição sem slug: mantém o link atual
    $title            = $_POST['title']            ?? '';
    $description      = sif_clean_html($_POST['description']      ?? '');
    $icon             = $_POST['icon']             ?? 'Target';
    $color            = $_POST['color']            ?? '#059669';
    $bg_color         = $_POST['bg_color']         ?? '#ECFDF5';
    $content_title    = $_POST['content_title']    ?? null;
    $content_subtitle = $_POST['content_subtitle'] ?? null;
    $active           = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    // Na edição, se o formulário não mandar 'active', mantém o estado atual (não republica item oculto)
    $activeUpd  = ($full && isset($_POST['active'])) ? (int)$_POST['active'] : null;
    $extra_data       = sif_clean_json($_POST['extra_data']       ?? null);

    $image_url = uploadGtImage($_FILES['image'] ?? null);
    // Arquivo enviado mas recusado (tipo/tamanho): avisa em vez de salvar sem a imagem
    if (!$image_url && isset($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        echo json_encode(["status" => "error", "success" => false, "message" => "A imagem não foi aceita. Use JPG, PNG, WebP ou GIF de até 10 MB."]);
        exit;
    }

    if ($id) {
        if ($image_url) {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 image_url=?, content_title=?, content_subtitle=?, active=COALESCE(?, active), extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $image_url, $content_title, $content_subtitle, $activeUpd, $extra_data, $id]);
        } else {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 content_title=?, content_subtitle=?, active=COALESCE(?, active), extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $content_title, $content_subtitle, $activeUpd, $extra_data, $id]);
        }
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO gt (slug, title, description, icon, color, bg_color, image_url, content_title, content_subtitle, active, extra_data)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
            $image_url, $content_title, $content_subtitle, $active, $extra_data]);
        $id = (int)$pdo->lastInsertId();
    }
    // Botão "remover imagem" do painel (só quando não veio imagem nova)
    if (!empty($id) && ($_POST['remove_image'] ?? '') === '1' && empty($_FILES['image']['tmp_name'])) {
        $pdo->prepare("UPDATE gt SET image_url = '' WHERE id = ?")->execute([$id]);
    }

    // ---- responsável
    if ($mode === 'new') {
        $pdo->prepare("INSERT INTO admins (name, cargo, email, password, role, modules, gt_ids, active, photo, whatsapp, link, link_label, contact_email)
                       VALUES (?,?,?,?, 'editor', '[]', '[]', 1, ?,?,?,?,?)")
            ->execute([$newUser['name'], $newUser['cargo'], $newUser['email'], $newUser['password'],
                $newUser['photo'], $newUser['whatsapp'], $newUser['link'], $newUser['link_label'], $newUser['contact_email']]);
        $respId = (int)$pdo->lastInsertId();
    }
    if ($mode === 'new' || $mode === 'existing') sif_gt_set_responsavel($pdo, (int)$id, $respId);
    if ($mode === 'none') sif_gt_set_responsavel($pdo, (int)$id, null);
    if ($profileTarget) {
        $f = sif_gt_profile_fields();
        $sets = ['cargo=?', 'photo=?', 'whatsapp=?', 'link=?', 'link_label=?', 'contact_email=?'];
        $vals = [$f['cargo'], $f['photo'], $f['whatsapp'], $f['link'], $f['link_label'], $f['contact_email']];
        if ($f['name'] !== '') { $sets[] = 'name=?'; $vals[] = $f['name']; }
        $vals[] = $profileTarget;
        $pdo->prepare("UPDATE admins SET " . implode(', ', $sets) . " WHERE id = ?")->execute($vals);
    }

    $st = $pdo->prepare("SELECT * FROM gt WHERE id = ?");
    $st->execute([$id]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "id" => (int)$id, "item" => $row ? sif_gt_attach_resp($pdo, [$row])[0] : null]);
    exit;
}

if ($method === 'DELETE') {
    if (!$full) sif_deny('Só quem administra os Grupos Temáticos pode excluir um grupo.');
    $id = (int)($_GET['id'] ?? 0);
    if ($id) {
        $pdo->prepare("DELETE FROM gt WHERE id = ?")->execute([$id]);
        sif_gt_set_responsavel($pdo, $id, null); // tira o grupo da lista do responsável
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "ID não fornecido"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
