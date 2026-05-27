<?php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// RESTRITO: Só admin vê as mensagens
if ($method === 'GET') {
    if (!isset($_SESSION['admin_logged_in'])) {
        http_response_code(401); exit;
    }
    $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // RESTRITO: Atualizar status (só admin pode)
    if (isset($data['id']) && isset($data['status'])) {
        if (!isset($_SESSION['admin_logged_in'])) {
            http_response_code(401); exit;
        }
        $stmt = $pdo->prepare("UPDATE leads SET status=? WHERE id=?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['success' => true]);
    } 
    // PÚBLICO: Enviar nova mensagem (formulário do site)
    else {
        $stmt = $pdo->prepare("INSERT INTO leads (name, email, phone, subject, message) VALUES (?,?,?,?,?)");
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['subject'], $data['message']]);
        echo json_encode(['success' => true]);
    }
}
?>