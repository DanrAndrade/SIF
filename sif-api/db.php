<?php
// FORÇA O NAVEGADOR A NÃO GUARDAR CACHE
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Configurações de Cookie
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false, // FIX: Set to true in production with HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

// Erros visíveis e limites aumentados
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '256M');
ini_set('max_execution_time', '300');

// FIX: Increased upload limits
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '12M');

// FIX: Better CORS handling
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // FIX: Default to localhost:5173 if origin not in allowed list
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Mata a requisição de verificação (OPTIONS) aqui mesmo
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// FIX: Use environment variables in production
$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'sif_db';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // FIX: Use prepared statements by default
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    
    // FIX: Set proper character set
    $pdo->exec("SET NAMES utf8mb4");
    
} catch (PDOException $e) {
    http_response_code(500);
    
    // FIX: Don't expose database details in production
    if (getenv('APP_ENV') === 'production') {
        echo json_encode(["error" => "Erro de conexão com o banco de dados."]);
    } else {
        echo json_encode(["error" => "Conexão falhou: " . $e->getMessage()]);
    }
    exit;
}
?>