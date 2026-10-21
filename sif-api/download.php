<?php
require 'db.php'; // Isso já inicia a session_start() se estiver configurado no db.php
require_once 'api_guard.php';

// 1. SEGURANÇA: logado e com acesso a Candidatos
if (!sif_can('candidates')) {
    header('Content-Type: text/plain; charset=utf-8');
    http_response_code(403);
    die("Acesso Negado. Você precisa estar logado.");
}

// 2. SEGURANÇA: Limpa o nome do arquivo para evitar invasão (Path Traversal)
// O basename impede que alguém tente baixar "../db.php"
$file = basename((string)($_GET['file'] ?? ''));
if ($file === '' || !preg_match('/^[A-Za-z0-9._-]+\.(pdf|docx?)$/i', $file)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    die('Arquivo inválido.');
}

// Currículos novos ficam em uploads/cvs/ (protegida). Fallback para uploads/
// raiz cobre currículos antigos cadastrados antes da mudança (o .htaccess
// bloqueia o acesso direto a eles).
$filepath = 'uploads/cvs/' . $file;
if (!is_file($filepath)) {
    $filepath = 'uploads/' . $file;
}

// 3. Verifica se o arquivo existe e entrega
if (is_file($filepath)) {
    // Define os cabeçalhos para forçar o download
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream'); // Tipo genérico binário
    header('Content-Disposition: attachment; filename="' . $file . '"'); // Força baixar com o nome certo
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filepath));
    
    // Lê o arquivo protegido e joga para o navegador do admin
    readfile($filepath);
    exit;
} else {
    http_response_code(404);
    echo "Arquivo não encontrado no servidor.";
}
?>