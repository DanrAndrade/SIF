<?php
require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

function uploadEincolFile($file, $subdir) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
    $dir = "uploads/eincol/$subdir/";
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;
    if (move_uploaded_file($file['tmp_name'], $target)) {
        return str_replace('\\', '/', $target);
    }
    return null;
}

// --- GET: Retorna a configuração singleton ---
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM eincol_config WHERE id = 1");
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($data) {
        // Decodifica os JSON armazenados
        $data['tabs']     = $data['tabs_json']     ? json_decode($data['tabs_json'], true)     : [];
        $data['sections'] = $data['sections_json'] ? json_decode($data['sections_json'], true) : [];
        echo json_encode($data);
    } else {
        echo json_encode(["id" => 1, "tabs" => [], "sections" => []]);
    }
    exit;
}

// --- POST: Atualiza a configuração ---
if ($method === 'POST') {
    $fields = [];
    $values = [];

    // Campos de texto simples
    $textFields = ['hero_title','hero_subtitle','main_content','planta_url',
                   'pdf1_url','pdf1_title','pdf2_url','pdf2_title','pdf3_url','pdf3_title',
                   'tabs_json','sections_json','active'];
    foreach ($textFields as $f) {
        if (isset($_POST[$f])) {
            $fields[] = "$f = ?";
            $values[] = $_POST[$f];
        }
    }

    // Upload de imagens
    $imageFields = [
        'hero_image'   => 'hero',
        'render_image' => 'renders',
        'planta_image' => 'plantas',
    ];
    foreach ($imageFields as $field => $subdir) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
            $url = uploadEincolFile($_FILES[$field], $subdir);
            if ($url) {
                $fields[] = "$field = ?";
                $values[] = $url;
            }
        } elseif (isset($_POST[$field]) && $_POST[$field] === '') {
            $fields[] = "$field = ?";
            $values[] = '';
        }
    }

    // Upload de PDFs
    $pdfSlots = ['pdf1_file' => 'pdf1_url', 'pdf2_file' => 'pdf2_url', 'pdf3_file' => 'pdf3_url'];
    foreach ($pdfSlots as $fileKey => $urlField) {
        if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
            $url = uploadEincolFile($_FILES[$fileKey], 'pdfs');
            if ($url) {
                $fields[] = "$urlField = ?";
                $values[] = $url;
            }
        }
    }

    if (!empty($fields)) {
        $sql = "UPDATE eincol_config SET " . implode(', ', $fields) . " WHERE id = 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
    }

    echo json_encode(["success" => true]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
?>
