<?php
// Login do painel. Traz a conexão $pdo, os headers de CORS e inicia a sessão.
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + usuários/permissões

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(sif_raw_input(), true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Usuário desativado no painel não entra (mesmo com a senha certa)
    $inactive = $user && isset($user['active']) && (int)$user['active'] !== 1;

    if ($user && !$inactive && password_verify($password, $user['password'])) {
        // Novo ID de sessão (evita reaproveitar sessão antiga)
        session_regenerate_id(true);

        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $user['id'];

        // Estrutura do banco em dia (usuários/permissões) e último acesso
        sif_ensure_schema($pdo);
        try { $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?")->execute([$user['id']]); } catch (Throwable $e) {}

        $me = sif_user(true); // relê: a sessão acabou de mudar de usuário
        echo json_encode([
            'success' => true,
            'user' => $me ?: ['id' => (int)$user['id'], 'email' => $user['email']],
        ]);
    } else {
        // Senha errada: espera 2 s (deixa ataques de robô muito lentos)
        sleep(2);
        echo json_encode(['success' => false, 'message' => 'E-mail ou senha incorretos.']);
    }
}
