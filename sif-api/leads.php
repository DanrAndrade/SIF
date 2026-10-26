<?php
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar

$method = $_SERVER['REQUEST_METHOD'];
// Colunas novas (origem, empresa, cargo): garante antes de ler/gravar, mesmo
// que ninguém do painel tenha entrado depois da atualização (1 consulta rápida).
sif_ensure_schema($pdo);

// Duas caixas de mensagens, cada uma com sua permissão no painel:
//   site     → formulário da página Contato        (módulo "leads")
//   embrapii → formulário da página EMBRAPII        (módulo "leads_embrapii")
const LEAD_SOURCES = ['site' => 'leads', 'embrapii' => 'leads_embrapii'];
$sourceOf = fn($v) => array_key_exists((string)$v, LEAD_SOURCES) ? (string)$v : 'site';
$guard = function (string $source) {
    if (!sif_can(LEAD_SOURCES[$source])) {
        if (sif_is_admin()) sif_deny();
        http_response_code(401); exit;
    }
};

// RESTRITO: lista de mensagens de uma origem
if ($method === 'GET') {
    $source = $sourceOf($_GET['source'] ?? 'site');
    $guard($source);
    $stmt = $pdo->prepare("SELECT * FROM leads WHERE COALESCE(source, 'site') = ? ORDER BY created_at DESC");
    $stmt->execute([$source]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

elseif ($method === 'POST') {
    $data = json_decode(sif_raw_input(), true);

    // RESTRITO: atualizar status (vale a permissão da caixa da mensagem)
    if (isset($data['id']) && isset($data['status'])) {
        $st = $pdo->prepare("SELECT COALESCE(source, 'site') FROM leads WHERE id = ?");
        $st->execute([(int)$data['id']]);
        $guard($sourceOf($st->fetchColumn()));
        if (!in_array($data['status'], ['unread', 'read', 'contacted'], true)) {
            http_response_code(400); echo json_encode(['success' => false]); exit;
        }
        $stmt = $pdo->prepare("UPDATE leads SET status=? WHERE id=?");
        $stmt->execute([$data['status'], (int)$data['id']]);
        echo json_encode(['success' => true]);
    }
    // PÚBLICO: nova mensagem (formulário do site)
    else {
        // Campo escondido: robôs preenchem, pessoas não veem
        if (is_array($data) && trim((string)($data['website'] ?? '')) !== '') { echo json_encode(['success' => true]); exit; }
        // Limite por IP: até 8 mensagens por hora (evita spam em massa)
        if (sif_attempts($pdo, 'lead', sif_client_ip(), 60) >= 8) {
            http_response_code(429);
            echo json_encode(['success' => false, 'message' => 'Muitas mensagens seguidas. Tente novamente mais tarde.']);
            exit;
        }
        sif_attempt_add($pdo, 'lead', sif_client_ip());
        // Valida e limita o tamanho dos campos (evita lead vazio e erro de
        // "campo grande demais" no banco)
        $f = fn($k, $max) => mb_substr(trim((string)($data[$k] ?? '')), 0, $max);
        $source = $sourceOf($data['source'] ?? 'site');
        $name = $f('name', 100); $email = $f('email', 100); $phone = $f('phone', 20);
        $subject = $f('subject', 50); $message = $f('message', 5000);
        $empresa = $f('empresa', 120); $cargo = $f('cargo', 120);
        if ($source === 'embrapii') $subject = 'EMBRAPII Fibras Florestais';
        $ok = is_array($data) && $name !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) && $message !== '';
        if ($source === 'embrapii') $ok = $ok && $empresa !== '' && $cargo !== '';
        if (!$ok) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $source === 'embrapii'
                ? 'Preencha nome, e-mail válido, empresa, cargo e mensagem.'
                : 'Preencha nome, e-mail válido e mensagem.']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO leads (name, email, phone, subject, message, source, empresa, cargo) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([$name, $email, $phone, $subject, $message, $source, $empresa ?: null, $cargo ?: null]);
        echo json_encode(['success' => true]);
    }
}
?>
