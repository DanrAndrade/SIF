<?php
require_once 'db.php';
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM gt WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1';
        if ($adminMode) {
            $stmt = $pdo->query("SELECT * FROM gt ORDER BY title ASC");
        } else {
            $stmt = $pdo->query("SELECT * FROM gt WHERE active = 1 ORDER BY title ASC");
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
            echo json_encode(["success" => false, "error" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE gt SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    function uploadGtImage($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/gt/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }
        return null;
    }

    $id               = $_POST['id']               ?? null;
    $slug             = $_POST['slug']             ?? '';
    $title            = $_POST['title']            ?? '';
    $description      = $_POST['description']      ?? '';
    $icon             = $_POST['icon']             ?? 'Target';
    $color            = $_POST['color']            ?? '#059669';
    $bg_color         = $_POST['bg_color']         ?? '#ECFDF5';
    $content_title    = $_POST['content_title']    ?? null;
    $content_subtitle = $_POST['content_subtitle'] ?? null;
    $active           = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    $extra_data       = $_POST['extra_data']       ?? null;

    $image_url = uploadGtImage($_FILES['image'] ?? null);

    if ($id) {
        if ($image_url) {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 image_url=?, content_title=?, content_subtitle=?, active=?, extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $image_url, $content_title, $content_subtitle, $active, $extra_data, $id]);
        } else {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 content_title=?, content_subtitle=?, active=?, extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $content_title, $content_subtitle, $active, $extra_data, $id]);
        }
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO gt (slug, title, description, icon, color, bg_color, image_url, content_title, content_subtitle, active, extra_data)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
            $image_url, $content_title, $content_subtitle, $active, $extra_data]);
    }
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $pdo->prepare("DELETE FROM gt WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "ID não fornecido"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
