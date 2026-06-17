<?php
require_once 'db.php';
require_once 'image_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────
// HELPER — Upload para pasta organizada por tipo
// ─────────────────────────────────────────────────────────
function uploadInstitucionalFile($file, string $subdir, bool $compress = true): ?string {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;

    $dir = "uploads/pages/institucional/{$subdir}/";
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $ext    = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name   = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;

    if (!move_uploaded_file($file['tmp_name'], $target)) return null;

    // Converte para WebP; se não der, mantém o original comprimido.
    $webp = $compress ? convertToWebp($target) : null;
    if ($webp) return $webp;

    if ($compress && in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        compressImage($target);
    }

    return str_replace('\\', '/', $target);
}

// ─────────────────────────────────────────────────────────
// ROTEADOR POR RECURSO
// GET/POST /institucional.php?resource=config
// GET/POST/PUT/DELETE /institucional.php?resource=team
// GET/POST/PUT/DELETE /institucional.php?resource=timeline
// GET/POST/PUT/DELETE /institucional.php?resource=documents
// ─────────────────────────────────────────────────────────
$resource = trim($_GET['resource'] ?? 'config');

// ══════════════════════════════════════════════════════════
// RESOURCE: config — Dados gerais da página Institucional
// ══════════════════════════════════════════════════════════
if ($resource === 'config') {

    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = 'institucional_geral'");
        $stmt->execute();
        $row  = $stmt->fetch(PDO::FETCH_ASSOC);
        $data = ($row && $row['config_json']) ? (json_decode($row['config_json'], true) ?? []) : [];
        echo json_encode($data);
        exit;
    }

    if ($method === 'POST') {
        $current = [];
        $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = 'institucional_geral'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['config_json']) $current = json_decode($row['config_json'], true) ?? [];

        if (!empty($_POST['content_json'])) {
            $incoming = json_decode($_POST['content_json'], true);
            if (is_array($incoming)) $current = array_merge($current, $incoming);
        }

        // Imagem do hero
        if (isset($_FILES['hero_image']) && $_FILES['hero_image']['error'] === UPLOAD_ERR_OK) {
            $url = uploadInstitucionalFile($_FILES['hero_image'], 'hero');
            if ($url) $current['hero_image'] = $url;
        }

        // Imagem da seção "Quem Somos"
        if (isset($_FILES['quem_somos_image']) && $_FILES['quem_somos_image']['error'] === UPLOAD_ERR_OK) {
            $url = uploadInstitucionalFile($_FILES['quem_somos_image'], 'quem-somos');
            if ($url) $current['quem_somos_image'] = $url;
        }

        $json = json_encode($current, JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("
            INSERT INTO page_configs (page_key, config_json)
            VALUES ('institucional_geral', ?)
            ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)
        ");
        $stmt->execute([$json]);

        echo json_encode(['success' => true, 'data' => $current]);
        exit;
    }
}

// ══════════════════════════════════════════════════════════
// RESOURCE: team — Membros da equipe (Nossa Gente)
// ══════════════════════════════════════════════════════════
if ($resource === 'team') {

    // GET — Lista todos os membros (opcionalmente por grupo)
    if ($method === 'GET') {
        $group = trim($_GET['group'] ?? '');
        if ($group) {
            $stmt = $pdo->prepare("SELECT * FROM team_members WHERE group_name = ? ORDER BY sort_order ASC, id ASC");
            $stmt->execute([$group]);
        } else {
            $stmt = $pdo->query("SELECT * FROM team_members ORDER BY group_name ASC, sort_order ASC, id ASC");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // POST — Cria novo membro (apenas se NÃO for um PUT tunelado via _method)
    if ($method === 'POST' && empty($_POST['_method'])) {
        $name       = trim($_POST['name'] ?? '');
        $group_name = trim($_POST['group_name'] ?? '');

        if (!$name || !$group_name) {
            http_response_code(400);
            echo json_encode(['error' => 'Nome e grupo são obrigatórios.']);
            exit;
        }

        $maxOrder = $pdo->prepare("SELECT COALESCE(MAX(sort_order), 0) FROM team_members WHERE group_name = ?");
        $maxOrder->execute([$group_name]);
        $maxOrder = $maxOrder->fetchColumn();

        $photoUrl = null;
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $photoUrl = uploadInstitucionalFile($_FILES['photo'], 'team');
        } elseif (!empty($_POST['photo_url'])) {
            // Aceita URL/path direto (ex: /nossa-gente/...) para seed inicial
            $photoUrl = trim($_POST['photo_url']);
        }

        $stmt = $pdo->prepare("
            INSERT INTO team_members (group_name, name, role, photo_url, link_whatsapp, link_email, sort_order, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $group_name,
            $name,
            trim($_POST['role'] ?? ''),
            $photoUrl,
            preg_replace('/\D/', '', $_POST['link_whatsapp'] ?? ''),
            trim($_POST['link_email'] ?? ''),
            $maxOrder + 1
        ]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        exit;
    }

    // PUT — Atualiza membro (via POST + _method=PUT)
    if ($method === 'PUT' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID inválido.']);
            exit;
        }

        $fields = [];
        $values = [];

        $textFields = ['name', 'role', 'group_name', 'link_email'];
        foreach ($textFields as $f) {
            if (isset($_POST[$f])) {
                $fields[] = "$f = ?";
                $values[] = trim($_POST[$f]);
            }
        }

        if (isset($_POST['link_whatsapp'])) {
            $fields[] = 'link_whatsapp = ?';
            $values[] = preg_replace('/\D/', '', $_POST['link_whatsapp']);
        }

        if (isset($_POST['active'])) {
            $fields[] = 'active = ?';
            $values[] = intval($_POST['active']);
        }

        if (isset($_POST['sort_order'])) {
            $fields[] = 'sort_order = ?';
            $values[] = intval($_POST['sort_order']);
        }

        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $url = uploadInstitucionalFile($_FILES['photo'], 'team');
            if ($url) {
                // Remove foto antiga
                $old = $pdo->prepare("SELECT photo_url FROM team_members WHERE id = ?");
                $old->execute([$id]);
                $oldRow = $old->fetch(PDO::FETCH_ASSOC);
                if ($oldRow && $oldRow['photo_url'] && file_exists($oldRow['photo_url'])) {
                    @unlink($oldRow['photo_url']);
                }
                $fields[] = 'photo_url = ?';
                $values[] = $url;
            }
        }

        if (!empty($fields)) {
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE team_members SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($values);
        }

        echo json_encode(['success' => true]);
        exit;
    }

    // DELETE
    if ($method === 'DELETE') {
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID inválido.']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT photo_url FROM team_members WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['photo_url'] && file_exists($row['photo_url'])) {
            @unlink($row['photo_url']);
        }

        $stmt = $pdo->prepare("DELETE FROM team_members WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
        exit;
    }
}

// ══════════════════════════════════════════════════════════
// RESOURCE: timeline — Marcos históricos
// ══════════════════════════════════════════════════════════
if ($resource === 'timeline') {

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM timeline_items ORDER BY sort_order ASC, id ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($method === 'POST' && empty($_POST['_method'])) {
        $year  = trim($_POST['year'] ?? '');
        $title = trim($_POST['title'] ?? '');

        if (!$year || !$title) {
            http_response_code(400);
            echo json_encode(['error' => 'Ano e título são obrigatórios.']);
            exit;
        }

        $maxOrder = $pdo->query("SELECT COALESCE(MAX(sort_order), 0) FROM timeline_items")->fetchColumn();

        $imageUrl = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imageUrl = uploadInstitucionalFile($_FILES['image'], 'timeline');
        } elseif (!empty($_POST['image_url'])) {
            $imageUrl = trim($_POST['image_url']);
        }

        $stmt = $pdo->prepare("
            INSERT INTO timeline_items (year, title, content, image_url, layout, sort_order, active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $year,
            $title,
            trim($_POST['content'] ?? ''),
            $imageUrl,
            in_array($_POST['layout'] ?? '', ['image-left', 'image-right']) ? $_POST['layout'] : 'image-left',
            $maxOrder + 1
        ]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'PUT' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID inválido.']);
            exit;
        }

        $fields = [];
        $values = [];

        foreach (['year', 'title', 'content', 'layout'] as $f) {
            if (isset($_POST[$f])) {
                $fields[] = "$f = ?";
                $values[] = trim($_POST[$f]);
            }
        }

        if (isset($_POST['sort_order'])) {
            $fields[] = 'sort_order = ?';
            $values[] = intval($_POST['sort_order']);
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $url = uploadInstitucionalFile($_FILES['image'], 'timeline');
            if ($url) { $fields[] = 'image_url = ?'; $values[] = $url; }
        } elseif (isset($_POST['image_url'])) {
            $fields[] = 'image_url = ?';
            $values[] = trim($_POST['image_url']);
        }

        if (!empty($fields)) {
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE timeline_items SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($values);
        }

        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        $id = intval($_GET['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID inválido.']); exit; }

        $stmt = $pdo->prepare("DELETE FROM timeline_items WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        exit;
    }
}

// ══════════════════════════════════════════════════════════
// RESOURCE: documents — PDFs / Estatutos
// ══════════════════════════════════════════════════════════
if ($resource === 'documents') {

    if ($method === 'GET') {
        $pageKey = trim($_GET['page_key'] ?? 'institucional');
        $stmt = $pdo->prepare("SELECT * FROM documents WHERE page_key = ? ORDER BY sort_order ASC");
        $stmt->execute([$pageKey]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    if ($method === 'POST' && empty($_POST['_method'])) {
        $title   = trim($_POST['title'] ?? '');
        $pageKey = trim($_POST['page_key'] ?? 'institucional');
        if (!$title) {
            http_response_code(400);
            echo json_encode(['error' => 'Título é obrigatório.']);
            exit;
        }

        $maxOrder = $pdo->prepare("SELECT COALESCE(MAX(sort_order), 0) FROM documents WHERE page_key = ?");
        $maxOrder->execute([$pageKey]);
        $maxOrder = $maxOrder->fetchColumn();

        $pdfUrl = trim($_POST['pdf_url'] ?? '');
        if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
            $uploaded = uploadInstitucionalFile($_FILES['pdf_file'], 'docs', false);
            if ($uploaded) $pdfUrl = $uploaded;
        }

        $stmt = $pdo->prepare("
            INSERT INTO documents (page_key, title, description, pdf_url, icon_type, sort_order, active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $pageKey,
            $title,
            trim($_POST['description'] ?? ''),
            $pdfUrl,
            trim($_POST['icon_type'] ?? 'FileText'),
            $maxOrder + 1
        ]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'PUT' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
        $id = intval($_POST['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID inválido.']); exit; }

        $fields = [];
        $values = [];

        foreach (['title', 'description', 'icon_type'] as $f) {
            if (isset($_POST[$f])) { $fields[] = "$f = ?"; $values[] = trim($_POST[$f]); }
        }

        if (isset($_POST['active'])) { $fields[] = 'active = ?'; $values[] = intval($_POST['active']); }
        if (isset($_POST['sort_order'])) { $fields[] = 'sort_order = ?'; $values[] = intval($_POST['sort_order']); }

        if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
            $url = uploadInstitucionalFile($_FILES['pdf_file'], 'docs', false);
            if ($url) { $fields[] = 'pdf_url = ?'; $values[] = $url; }
        } elseif (isset($_POST['pdf_url'])) {
            $fields[] = 'pdf_url = ?';
            $values[] = trim($_POST['pdf_url']);
        }

        if (!empty($fields)) {
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE documents SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($values);
        }

        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        $id = intval($_GET['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID inválido.']); exit; }

        $stmt = $pdo->prepare("SELECT pdf_url FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Só remove arquivo se for do uploads (não links externos ou /docs)
        if ($row && $row['pdf_url'] && str_starts_with($row['pdf_url'], 'uploads/') && file_exists($row['pdf_url'])) {
            @unlink($row['pdf_url']);
        }

        $stmt = $pdo->prepare("DELETE FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['error' => 'Recurso não encontrado. Use: config, team, timeline, documents']);
?>
