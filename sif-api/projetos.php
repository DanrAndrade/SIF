<?php
require_once 'db.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM projetos WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1';
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
        $active = $_POST['active'] ?? 1;
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
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            return str_replace('\\', '/', $target);
        }
        return null;
    }

    function uploadProjetoPdf($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/projetos_pdf/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf') return null;
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
    $description = $_POST['description'] ?? '';
    $tag         = $_POST['tag']         ?? '';
    $lab         = $_POST['lab']         ?? '';
    $status      = $_POST['status']      ?? 'Em Andamento';
    $data_limite = !empty($_POST['data_limite']) ? $_POST['data_limite'] : null;
    $link_url    = $_POST['link_url']    ?? '';
    $tabs        = isset($_POST['tabs']) ? json_encode(json_decode($_POST['tabs'], true)) : '[]';
    $active      = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    $extra_data  = $_POST['extra_data']  ?? null;
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
             data_limite=?, link_url=?, tabs=?, active=?, extra_data=?,
             image_url = CASE WHEN ? IS NOT NULL THEN ? ELSE image_url END,
             pdf_url   = CASE WHEN ? IS NOT NULL THEN ? ELSE pdf_url   END
             WHERE id=?"
        );
        $stmt->execute([
            $slug, $title, $description, $tag, $lab, $status,
            $data_limite, $link_url, $tabs, $active, $extra_data,
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
