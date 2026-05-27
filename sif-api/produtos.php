<?php
require_once 'db.php';
require_once 'image_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

function uploadProdutosFile($file, string $subdir, bool $compress = true): ?string {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
    $dir = "uploads/pages/produtos/{$subdir}/";
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $ext    = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name   = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;
    if (!move_uploaded_file($file['tmp_name'], $target)) return null;
    if ($compress && in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) compressImage($target);
    return str_replace('\\', '/', $target);
}

// GET — Retorna config completa de produtos (uma linha por page_key='produtos')
if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = 'produtos'");
    $stmt->execute();
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);
    $data = ($row && $row['config_json']) ? (json_decode($row['config_json'], true) ?? []) : [];
    echo json_encode($data);
    exit;
}

// POST — Salva config de produtos (merge)
if ($method === 'POST') {
    $stmt = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = 'produtos'");
    $stmt->execute();
    $row     = $stmt->fetch(PDO::FETCH_ASSOC);
    $current = ($row && $row['config_json']) ? (json_decode($row['config_json'], true) ?? []) : [];

    if (!empty($_POST['content_json'])) {
        $incoming = json_decode($_POST['content_json'], true);
        if (is_array($incoming)) $current = array_merge($current, $incoming);
    }

    // Upload de imagem hero
    if (isset($_FILES['hero_image']) && $_FILES['hero_image']['error'] === UPLOAD_ERR_OK) {
        $url = uploadProdutosFile($_FILES['hero_image'], 'hero');
        if ($url) $current['hero_image'] = $url;
    }

    $json = json_encode($current, JSON_UNESCAPED_UNICODE);
    $stmt = $pdo->prepare("
        INSERT INTO page_configs (page_key, config_json)
        VALUES ('produtos', ?)
        ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)
    ");
    $stmt->execute([$json]);

    echo json_encode(['success' => true, 'data' => $current]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
?>
