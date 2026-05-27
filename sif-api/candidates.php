<?php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Listar candidatos (Só Admin)
if ($method === 'GET') {
    if (!isset($_SESSION['admin_logged_in'])) {
        http_response_code(401); 
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }
    // Agora buscamos também o status
    $stmt = $pdo->query("SELECT * FROM candidates ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// POST: Criar (Público) OU Atualizar Status (Admin)
elseif ($method === 'POST') {
    
    // Verificamos se é um upload de arquivo (Candidatura do Site)
    if (isset($_FILES['cv']) || isset($_POST['job_title'])) {
        // ... Lógica de Upload (CÓDIGO ORIGINAL MANTIDO ABAIXO) ...
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $linkedin = $_POST['linkedin'] ?? '';
        $jobTitle = $_POST['job_title'] ?? 'Banco de Talentos';
        $jobId = $_POST['job_id'] ?? null;
        if ($jobId === 'banco') $jobId = null;

        $cvFilename = null;
        if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $ext = pathinfo($_FILES['cv']['name'], PATHINFO_EXTENSION);
            $cleanName = preg_replace('/[^a-zA-Z0-9]/', '', $name);
            $newFilename = time() . "_" . $cleanName . "." . $ext;
            if (move_uploaded_file($_FILES['cv']['tmp_name'], $uploadDir . $newFilename)) {
                $cvFilename = $newFilename;
            }
        }

        try {
            // Inserimos com status padrão 'unread'
            $sql = "INSERT INTO candidates (job_id, job_title, name, email, phone, linkedin, cv_filename, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$jobId, $jobTitle, $name, $email, $phone, $linkedin, $cvFilename]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } 
    // Se não for upload, é o Admin atualizando o STATUS (JSON)
    else {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($_SESSION['admin_logged_in'])) {
            http_response_code(401); exit;
        }

        if (isset($data['id']) && isset($data['status'])) {
            $stmt = $pdo->prepare("UPDATE candidates SET status=? WHERE id=?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
        }
    }
}
?>