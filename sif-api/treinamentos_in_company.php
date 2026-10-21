<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM treinamentos_in_company WHERE slug = ?" . (sif_is_admin() ? '' : ' AND active = 1'));
        $stmt->execute([$_GET['slug']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) { http_response_code(404); echo json_encode(['error' => 'Não encontrado']); exit; }
        echo json_encode($item);
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin(); // itens ocultos só com login
        if ($adminMode) {
            $stmt = $pdo->query("SELECT * FROM treinamentos_in_company ORDER BY created_at DESC");
        } else {
            $stmt = $pdo->query("SELECT * FROM treinamentos_in_company WHERE active = 1 ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

if ($method == 'POST') {

    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = ((int)($_POST['active'] ?? 1)) ? 1 : 0;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE treinamentos_in_company SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["status" => "success"]);
        exit;
    }

    function uploadFile($file, $subpath) {
        if (!isset($file) || $file['error'] !== 0) return null;
        $dir = "uploads/{$subpath}/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        // Extensão pelo tipo real do arquivo e nome novo (antes usava o nome
        // original inteiro — "x.php" virava "123_x.php")
        $ext = sif_safe_ext($file['tmp_name'], 'image', $file['name']);
        if (!$ext) return null;
        $name = sif_safe_name($ext);
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }
        return null;
    }

    $id          = $_POST['id']          ?? null;
    $slug        = $_POST['slug']        ?? '';
    $title       = $_POST['title']       ?? '';
    $description = sif_clean_html($_POST['description'] ?? '');
    $segment     = $_POST['segment']     ?? '';
    $hours       = $_POST['hours']       ?? '';
    $location    = $_POST['location']    ?? '';
    $video_url   = $_POST['video_url']   ?? '';
    $active      = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    // Na edição, se o formulário não mandar 'active', mantém o estado atual (não republica item oculto)
    $activeUpd  = isset($_POST['active']) ? (int)$_POST['active'] : null;
    $extra_data  = sif_clean_json($_POST['extra_data']  ?? null);
    $image_url_fallback = $_POST['image_url'] ?? '';

    if (empty($title) && empty($description)) {
        echo json_encode(["status" => "error", "message" => "Requisição vazia."]);
        exit;
    }

    $image_url = uploadFile($_FILES['image'] ?? null, 'images');
    if (!$image_url && $image_url_fallback) {
        $image_url = $image_url_fallback;
    }

    if ($id) {
        $stmt = $pdo->prepare(
            "UPDATE treinamentos_in_company SET slug=?, title=?, description=?, segment=?, hours=?, location=?,
             video_url=?, active=COALESCE(?, active), extra_data=?, image_url=COALESCE(?, image_url) WHERE id=?"
        );
        $stmt->execute([$slug, $title, $description, $segment, $hours, $location, $video_url, $activeUpd, $extra_data, $image_url, $id]);
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO treinamentos_in_company (slug, title, description, segment, hours, location, video_url, image_url, active, extra_data)
             VALUES (?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$slug, $title, $description, $segment, $hours, $location, $video_url, $image_url, $active, $extra_data]);
    }
    // Botão "remover imagem" do painel (só quando não veio imagem nova)
    if (!empty($id) && ($_POST['remove_image'] ?? '') === '1' && empty($_FILES['image']['tmp_name'])) {
        $pdo->prepare("UPDATE treinamentos_in_company SET image_url = '' WHERE id = ?")->execute([$id]);
    }
    echo json_encode(["status" => "success"]);
    exit;
}

if ($method == 'DELETE') {
    if (empty($_GET['id'])) {
        echo json_encode(["status" => "error", "message" => "ID não informado."]);
        exit;
    }
    $pdo->prepare("DELETE FROM treinamentos_in_company WHERE id = ?")->execute([$_GET['id']]);
    echo json_encode(["status" => "success"]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
