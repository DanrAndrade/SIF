<?php
require_once 'db.php';
require_once 'image_utils.php';

// Endpoint dedicado para upload de imagens de dentro do editor de texto (Quill)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Check if file was uploaded
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'Arquivo excede o tamanho máximo permitido pelo servidor.',
                UPLOAD_ERR_FORM_SIZE => 'Arquivo excede o tamanho máximo do formulário.',
                UPLOAD_ERR_PARTIAL => 'Upload parcial do arquivo.',
                UPLOAD_ERR_NO_FILE => 'Nenhum arquivo foi enviado.',
                UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária não encontrada.',
                UPLOAD_ERR_CANT_WRITE => 'Falha ao gravar arquivo no disco.',
                UPLOAD_ERR_EXTENSION => 'Upload bloqueado por extensão.'
            ];
            
            $error = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
            $message = $errorMessages[$error] ?? 'Erro desconhecido no upload.';
            
            http_response_code(400);
            echo json_encode(["success" => false, "message" => $message]);
            exit;
        }

        $file = $_FILES['image'];
        
        // Validate file type using mime type
        $allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'image/bmp', 'image/x-ms-bmp', 'image/avif', 'image/heic', 'image/heif',
            'image/tiff', 'image/svg+xml'
        ];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Tipo de arquivo não permitido: {$mimeType}. Use JPG, PNG, GIF, WebP, BMP, AVIF, HEIC ou SVG."
            ]);
            exit;
        }
        
        // Validate file size (10MB max for editor images)
        if ($file['size'] > 10 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Arquivo muito grande. Tamanho máximo: 10MB."
            ]);
            exit;
        }
        
        $dir = "uploads/editor/";
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                http_response_code(500);
                echo json_encode([
                    "success" => false, 
                    "message" => "Erro ao criar diretório de upload."
                ]);
                exit;
            }
        }

        // Generate secure filename
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $target = $dir . $safeName;

        if (move_uploaded_file($file['tmp_name'], $target)) {
            // Converte para WebP (mais leve). Se não der, mantém o original comprimido.
            $webp = convertToWebp($target);
            if ($webp) {
                $webPath = $webp;
            } else {
                compressImage($target);
                $webPath = str_replace('\\', '/', $target);
            }

            // IMPORTANTE: Retorna apenas o caminho relativo (uploads/editor/arquivo.webp)
            // O frontend vai adicionar a URL base usando getImageUrl()
            echo json_encode(["success" => true, "url" => $webPath]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Falha ao gravar arquivo no servidor."
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Erro no servidor: " . $e->getMessage()
        ]);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(["success" => false, "message" => "Método não permitido"]);
?>