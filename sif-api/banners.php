<?php
require 'db.php';

// Garante que o PHP devolva JSON limpo e UTF-8
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// --- GET: Listar Banners ---
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM banners ORDER BY created_at DESC");
    $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($banners, JSON_UNESCAPED_SLASHES);
}

// --- POST: Criar OU Editar Banner ---
elseif ($method === 'POST') {
    
    if (!isset($_SESSION['admin_logged_in'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }

    $id = $_POST['id'] ?? null;
    $linkUrl = $_POST['link_url'] ?? '';
    // Aceita '1', 'true' ou 1
    $active = (isset($_POST['active']) && filter_var($_POST['active'], FILTER_VALIDATE_BOOLEAN)) ? 1 : 0;
    
    // --- MUDANÇA AQUI: Pasta 'banners' ---
    $uploadDir = 'banners/';
    
    // Cria a pasta se não existir (segurança extra)
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $imagePath = null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        
        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Formato inválido. Use JPG, PNG ou WEBP.']);
            exit;
        }

        $newFilename = 'banner_' . time() . '_' . rand(1000,9999) . '.' . $ext;
        $destination = $uploadDir . $newFilename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
            // Salva no banco o caminho relativo: "banners/banner_xyz.jpg"
            $imagePath = $destination; 
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salvar arquivo na pasta banners.']);
            exit;
        }
    }

    try {
        if ($id) {
            // UPDATE
            if ($imagePath) {
                // Atualiza imagem e dados
                $sql = "UPDATE banners SET image_url=?, link_url=?, active=? WHERE id=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$imagePath, $linkUrl, $active, $id]);
            } else {
                // Mantém imagem antiga, atualiza dados
                $sql = "UPDATE banners SET link_url=?, active=? WHERE id=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$linkUrl, $active, $id]);
            }
            echo json_encode(['success' => true, 'message' => 'Banner atualizado!']);

        } else {
            // INSERT
            if (!$imagePath) {
                http_response_code(400);
                echo json_encode(['error' => 'Imagem é obrigatória.']);
                exit;
            }
            $sql = "INSERT INTO banners (image_url, link_url, active) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$imagePath, $linkUrl, $active]);
            echo json_encode(['success' => true, 'message' => 'Banner criado!']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro no Banco: ' . $e->getMessage()]);
    }
}

// --- PUT: Toggle Status ---
elseif ($method === 'PUT') {
    if (!isset($_SESSION['admin_logged_in'])) { http_response_code(401); exit; }
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'] ?? $data['id'] ?? null;
    $active = $data['active'] ?? null;

    if ($id && isset($active)) {
        $isActive = filter_var($active, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        $stmt = $pdo->prepare("UPDATE banners SET active = ? WHERE id = ?");
        $stmt->execute([$isActive, $id]);
        echo json_encode(['success' => true]);
    }
}

// --- DELETE ---
elseif ($method === 'DELETE') {
    if (!isset($_SESSION['admin_logged_in'])) { http_response_code(401); exit; }
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT image_url FROM banners WHERE id = ?");
        $stmt->execute([$id]);
        $banner = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Tenta apagar o arquivo físico
        if ($banner && file_exists($banner['image_url'])) {
            @unlink($banner['image_url']);
        }
        
        $pdo->prepare("DELETE FROM banners WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
    }
}
?>