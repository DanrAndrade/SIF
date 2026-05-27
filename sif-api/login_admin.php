<?php
// 1. Importamos o db.php
// Isto trae a conexión $pdo, os headers de CORS correctos e inicia a sesión
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    // Pequena pausa para evitar ataques de forza bruta (Brute Force)
    // usleep(200000); // 0.2 segundos (opcional)

    // Busca o usuario polo e-mail
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifica se o usuario existe e se a contrasinal coincide co hash
    if ($user && password_verify($password, $user['password'])) {
        
        // Rexenera o ID da sesión para seguridade extra
        session_regenerate_id(true);

        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $user['id'];

        echo json_encode([
            'success' => true, 
            'user' => [
                'id' => $user['id'],
                'email' => $user['email']
            ]
        ]);
    } else {
        // Se a contrasinal falla, forzamos unha espera de 2 segundos
        // Isto fai que ataques de robots sexan moi lentos
        sleep(2); 

        echo json_encode(['success' => false, 'message' => 'Credenciais incorrectas']);
    }
}
?>