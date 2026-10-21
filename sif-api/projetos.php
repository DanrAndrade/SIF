<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM projetos WHERE slug = ?" . (sif_is_admin() ? '' : ' AND active = 1'));
        $stmt->execute([$_GET['slug']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) { http_response_code(404); echo json_encode(['error' => 'Não encontrado']); exit; }
        echo json_encode($item);
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin(); // itens ocultos só com login
        if ($adminMode) {
            $stmt = $pdo->query("SELECT * FROM projetos ORDER BY created_at DESC");
        } else {
            $stmt = $pdo->query("SELECT * FROM projetos WHERE active = 1 ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

if ($method === 'POST') {

    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = ((int)($_POST['active'] ?? 1)) ? 1 : 0;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE projetos SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["status" => "success"]);
        exit;
    }

    function uploadProjetoImage($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/projetos/";
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

    function uploadProjetoPdf($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/projetos_pdf/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (sif_safe_ext($file['tmp_name'], 'pdf', $file['name']) !== 'pdf') return null; // tipo real
        $name = time() . '_' . bin2hex(random_bytes(6)) . '.pdf';
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            return str_replace('\\', '/', $target);
        }
        return null;
    }

    $id          = $_POST['id']          ?? null;
    $slug        = $_POST['slug']        ?? '';
    $title       = $_POST['title']       ?? '';
    $description = sif_clean_html($_POST['description'] ?? '');
    $tag         = $_POST['tag']         ?? '';
    $lab         = $_POST['lab']         ?? '';
    $status      = $_POST['status']      ?? 'Em Andamento';
    $data_limite = !empty($_POST['data_limite']) ? $_POST['data_limite'] : null;
    $link_url    = $_POST['link_url']    ?? '';
    $tabs        = isset($_POST['tabs']) ? json_encode(json_decode($_POST['tabs'], true)) : '[]';
    $active      = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    // Na edição, se o formulário não mandar 'active', mantém o estado atual (não republica item oculto)
    $activeUpd  = isset($_POST['active']) ? (int)$_POST['active'] : null;
    $extra_data  = sif_clean_json($_POST['extra_data']  ?? null);
    $image_url_fallback = $_POST['image_url'] ?? '';
    $pdf_url_fallback   = $_POST['pdf_url']   ?? '';

    if (empty($title)) {
        echo json_encode(["status" => "error", "message" => "Título obrigatório."]);
        exit;
    }

    $image_url = uploadProjetoImage($_FILES['image'] ?? null);
    if (!$image_url && $image_url_fallback) $image_url = $image_url_fallback;

    $pdf_url = uploadProjetoPdf($_FILES['pdf'] ?? null);
    if (!$pdf_url && $pdf_url_fallback) $pdf_url = $pdf_url_fallback;

    if ($id) {
        $stmt = $pdo->prepare(
            "UPDATE projetos SET slug=?, title=?, description=?, tag=?, lab=?, status=?,
             data_limite=?, link_url=?, tabs=?, active=COALESCE(?, active), extra_data=?,
             image_url = CASE WHEN ? IS NOT NULL THEN ? ELSE image_url END,
             pdf_url   = CASE WHEN ? IS NOT NULL THEN ? ELSE pdf_url   END
             WHERE id=?"
        );
        $stmt->execute([
            $slug, $title, $description, $tag, $lab, $status,
            $data_limite, $link_url, $tabs, $activeUpd, $extra_data,
            $image_url, $image_url, $pdf_url, $pdf_url, $id
        ]);
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO projetos (slug, title, description, tag, lab, status, data_limite, link_url, image_url, pdf_url, tabs, active, extra_data)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $slug, $title, $description, $tag, $lab, $status,
            $data_limite, $link_url, $image_url, $pdf_url, $tabs, $active, $extra_data
        ]);
    }
    // Botão "remover imagem" do painel (só quando não veio imagem nova)
    if (!empty($id) && ($_POST['remove_image'] ?? '') === '1' && empty($_FILES['image']['tmp_name'])) {
        $pdo->prepare("UPDATE projetos SET image_url = '' WHERE id = ?")->execute([$id]);
    }
    echo json_encode(["status" => "success"]);
    exit;
}

if ($method === 'DELETE') {
    if (empty($_GET['id'])) {
        echo json_encode(["status" => "error", "message" => "ID não informado."]);
        exit;
    }
    $pdo->prepare("DELETE FROM projetos WHERE id = ?")->execute([$_GET['id']]);
    echo json_encode(["status" => "success"]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
