<?php
// Login do painel. Traz a conexão $pdo, os headers de CORS e inicia a sessão.
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + usuários/permissões

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(sif_raw_input(), true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    // Força bruta: 5 erros por e-mail ou 20 por IP em 15 min → espera
    $ip = sif_client_ip();
    if (sif_attempts($pdo, 'login', 'e:' . strtolower($email), 15) >= 5 || sif_attempts($pdo, 'login', 'ip:' . $ip, 15) >= 20) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Muitas tentativas de login. Aguarde 15 minutos e tente de novo.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Usuário desativado no painel não entra (mesmo com a senha certa)
    $inactive = $user && isset($user['active']) && (int)$user['active'] !== 1;

    if ($user && !$inactive && password_verify($password, $user['password'])) {
        // Novo ID de sessão (evita reaproveitar sessão antiga)
        session_regenerate_id(true);
        sif_attempts_clear($pdo, 'login', 'e:' . strtolower($email));

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
        // Senha errada: registra a tentativa (bloqueio acima) e espera pouco
        sif_attempt_add($pdo, 'login', 'e:' . strtolower($email));
        sif_attempt_add($pdo, 'login', 'ip:' . $ip);
        usleep(400000);
        echo json_encode(['success' => false, 'message' => 'E-mail ou senha incorretos.']);
    }
}
