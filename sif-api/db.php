<?php
// =====================================================================
//  CONFIGURAÇÃO DO BANCO DE DADOS
// ---------------------------------------------------------------------
//  >> HOSTGATOR: preencha o bloco 'producao' abaixo com os dados do
//     banco MySQL criado no painel (cPanel > Bancos de Dados MySQL).
//     No HostGator o host quase sempre é 'localhost'.
//  >> DESENVOLVIMENTO (XAMPP local): não precisa mexer no bloco 'local'.
//  A detecção é automática pelo domínio da requisição.
// =====================================================================
$DB_CONFIG = [
    'local' => [
        'host' => 'localhost',
        'name' => 'sif_db',
        'user' => 'root',
        'pass' => '',
    ],
    'producao' => [
        'host' => 'localhost',                 // HostGator normalmente é 'localhost'
        'name' => 'PREENCHER_NOME_DO_BANCO',   // <-- TROCAR (ex: cpaneluser_sifdb)
        'user' => 'PREENCHER_USUARIO_BANCO',   // <-- TROCAR (ex: cpaneluser_sif)
        'pass' => 'PREENCHER_SENHA_BANCO',     // <-- TROCAR
    ],
];

// Detecta o ambiente pelo host da requisição
$host_atual = $_SERVER['HTTP_HOST'] ?? 'localhost';
$is_local = (strpos($host_atual, 'localhost') !== false || strpos($host_atual, '127.0.0.1') !== false);
$cfg = $is_local ? $DB_CONFIG['local'] : $DB_CONFIG['producao'];

// Detecta HTTPS (para cookie seguro em produção)
$is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
         || (($_SERVER['SERVER_PORT'] ?? null) == 443)
         || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

// FORÇA O NAVEGADOR A NÃO GUARDAR CACHE
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Configurações de Cookie de sessão
// domain vazio = o navegador usa o host atual (funciona em localhost E em sif.org.br)
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => $is_https,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

// Erros: visíveis em dev, ocultos em produção (não vazar detalhes)
if ($is_local) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

ini_set('memory_limit', '256M');
ini_set('max_execution_time', '300');
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '12M');

// CORS — origens permitidas (em produção é same-origin, mas mantemos por segurança)
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://sif.org.br',
    'https://www.sif.org.br',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($is_local) {
    // Em dev, default para o Vite
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
// Em produção com origin desconhecida: não seta header (same-origin não precisa)

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Mata a requisição de verificação (OPTIONS) aqui mesmo
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    $pdo = new PDO(
        "mysql:host={$cfg['host']};dbname={$cfg['name']};charset=utf8mb4",
        $cfg['user'],
        $cfg['pass']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $pdo->exec("SET NAMES utf8mb4");
} catch (PDOException $e) {
    http_response_code(500);
    if ($is_local) {
        echo json_encode(["error" => "Conexão falhou: " . $e->getMessage()]);
    } else {
        echo json_encode(["error" => "Erro de conexão com o banco de dados."]);
    }
    exit;
}
?>
