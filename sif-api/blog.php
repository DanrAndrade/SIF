<?php
require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

// --- BUSCAR POSTS ---
if ($method === 'GET') {
    try {
        if (isset($_GET['slug'])) {
            $slug = trim($_GET['slug']);
            
            // Validate slug format
            if (empty($slug) || !preg_match('/^[a-z0-9-]+$/', $slug)) {
                http_response_code(400);
                echo json_encode(["error" => "Slug inválido"]);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE slug = ?");
            $stmt->execute([$slug]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Return proper response when not found
            if (!$post) {
                http_response_code(404);
                echo json_encode(["error" => "Post não encontrado"]);
                exit;
            }
            
            echo json_encode($post);
        } else {
            $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1';
            if ($adminMode) {
                $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
            } else {
                $stmt = $pdo->query("SELECT * FROM blog_posts WHERE active = 1 ORDER BY created_at DESC");
            }
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Erro ao buscar posts: " . $e->getMessage()]);
    }
    exit;
}

// --- CRIAR OU EDITAR (POST) ---
if ($method === 'POST') {
    // Improved file upload function with validation
    function uploadFile($file, $subpath) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            return ["error" => "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP."];
        }
        
        // Validate file size (10MB max)
        if ($file['size'] > 10 * 1024 * 1024) {
            return ["error" => "Arquivo muito grande. Tamanho máximo: 10MB."];
        }
        
        $dir = "uploads/" . $subpath . "/";
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                return ["error" => "Erro ao criar diretório de upload."];
            }
        }
        
        // Sanitize filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $target = $dir . $safeName;
        
        if (move_uploaded_file($file['tmp_name'], $target)) {
            // FIX: Return path in consistent format
            return str_replace('\\', '/', $target);
        }
        
        return ["error" => "Erro ao fazer upload do arquivo."];
    }

    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = $_POST['active'] ?? 1;
        if (!$id) {
            echo json_encode(["success" => false, "error" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE blog_posts SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    try {
        $id         = $_POST['id']         ?? null;
        $title      = trim($_POST['title'] ?? '');
        $active     = isset($_POST['active']) ? (int)$_POST['active'] : 1;
        $content    = $_POST['content']    ?? '';
        $tags       = trim($_POST['tags']  ?? '');
        $extra_data = $_POST['extra_data'] ?? null;
        
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "O título é obrigatório."]);
            exit;
        }

        $hasContent    = !empty($content) && $content !== '<p><br></p>';
        $hasExtraData  = !empty($extra_data);
        if (!$hasContent && !$hasExtraData) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "O conteúdo é obrigatório."]);
            exit;
        }
        
        // Validate title length
        if (strlen($title) > 200) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Título muito longo (máximo 200 caracteres)."]);
            exit;
        }
        
        // Generate slug from title
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        // Ensure slug is unique (except for current post if editing)
        $slugCheckSql = $id 
            ? "SELECT id FROM blog_posts WHERE slug = ? AND id != ?" 
            : "SELECT id FROM blog_posts WHERE slug = ?";
        $slugCheckParams = $id ? [$slug, $id] : [$slug];
        $slugCheck = $pdo->prepare($slugCheckSql);
        $slugCheck->execute($slugCheckParams);
        
        if ($slugCheck->fetch()) {
            $slug = $slug . '-' . time();
        }

        $image_url = uploadFile($_FILES['image'] ?? null, 'images');
        
        // Check for upload errors
        if (is_array($image_url) && isset($image_url['error'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $image_url['error']]);
            exit;
        }

        if ($id) {
            // Validate ID
            if (!is_numeric($id) || $id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "ID inválido"]);
                exit;
            }
            
            // FIX: If updating with new image, delete old image
            if ($image_url) {
                // Get old image path
                $oldStmt = $pdo->prepare("SELECT image_url FROM blog_posts WHERE id = ?");
                $oldStmt->execute([$id]);
                $oldPost = $oldStmt->fetch(PDO::FETCH_ASSOC);
                
                // Delete old image file if it exists
                if ($oldPost && !empty($oldPost['image_url']) && file_exists($oldPost['image_url'])) {
                    @unlink($oldPost['image_url']);
                }
                
                $stmt = $pdo->prepare("UPDATE blog_posts SET title=?, content=?, tags=?, slug=?, image_url=?, extra_data=?, updated_at=NOW() WHERE id=?");
                $stmt->execute([$title, $content, $tags, $slug, $image_url, $extra_data, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE blog_posts SET title=?, content=?, tags=?, slug=?, extra_data=?, updated_at=NOW() WHERE id=?");
                $stmt->execute([$title, $content, $tags, $slug, $extra_data, $id]);
            }
        } else {
            $stmt = $pdo->prepare("INSERT INTO blog_posts (title, slug, content, image_url, tags, active, extra_data) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $content, $image_url, $tags, $active, $extra_data]);
        }

        echo json_encode(["success" => true, "slug" => $slug]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Erro ao salvar post: " . $e->getMessage()]);
    }
    exit;
}

// --- EXCLUIR (DELETE) ---
if ($method === 'DELETE') {
    try {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            
            // Validate ID
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "ID inválido"]);
                exit;
            }
            
            // Check if post exists before deleting
            $checkStmt = $pdo->prepare("SELECT id, image_url, content FROM blog_posts WHERE id = ?");
            $checkStmt->execute([$id]);
            $post = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$post) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Post não encontrado"]);
                exit;
            }
            
            // FIX: Delete cover image
            if (!empty($post['image_url']) && file_exists($post['image_url'])) {
                @unlink($post['image_url']);
            }
            
            // FIX: Delete images from content (editor images)
            if (!empty($post['content'])) {
                // Extract image URLs from content
                preg_match_all('/<img[^>]+src="([^"]+)"/', $post['content'], $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $imgUrl) {
                        // Only delete if it's a local upload (starts with uploads/)
                        if (strpos($imgUrl, 'uploads/') === 0 && file_exists($imgUrl)) {
                            @unlink($imgUrl);
                        }
                    }
                }
            }
            
            $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
            if ($stmt->execute([$id])) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Falha ao excluir."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID não fornecido"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Erro ao excluir post: " . $e->getMessage()]);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
?>