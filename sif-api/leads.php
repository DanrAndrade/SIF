<?php
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar

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
    $data = json_decode(sif_raw_input(), true);
    
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
        // Valida e limita o tamanho dos campos (evita lead vazio e erro de
        // "campo grande demais" no banco)
        $f = fn($k, $max) => mb_substr(trim((string)($data[$k] ?? '')), 0, $max);
        $name = $f('name', 100); $email = $f('email', 100); $phone = $f('phone', 20);
        $subject = $f('subject', 50); $message = $f('message', 5000);
        if (!is_array($data) || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Preencha nome, e-mail válido e mensagem.']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO leads (name, email, phone, subject, message) VALUES (?,?,?,?,?)");
        $stmt->execute([$name, $email, $phone, $subject, $message]);
        echo json_encode(['success' => true]);
    }
}
?>