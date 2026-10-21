<?php
/**
 * Upload de vídeo (MP4/WebM) — usado no vídeo de fundo do topo da Home.
 * O tipo é conferido pelo CONTEÚDO do arquivo, não pelo nome.
 * Limite: 40 MB (o PHP da hospedagem também pode limitar; vídeo de fundo
 * curto e sem áudio costuma ficar entre 3 e 10 MB).
 */
require_once 'db.php';
require_once 'api_guard.php'; // exige login para gravar
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}
if (!sif_can('home')) sif_deny();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    $msg = in_array($err, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
        ? 'O vídeo passou do limite do servidor. Use um vídeo menor (até 40 MB).'
        : 'Não foi possível receber o vídeo. Tente de novo.';
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

$file = $_FILES['file'];
$ext = sif_safe_ext($file['tmp_name'], 'video', $file['name']);
if (!$ext) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Envie um vídeo MP4 ou WebM.']);
    exit;
}
if ($file['size'] > 40 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vídeo muito grande. Máximo: 40 MB (ideal: menos de 10 MB).']);
    exit;
}

$dir = 'uploads/videos/';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao criar a pasta de vídeos.']);
    exit;
}

$target = $dir . sif_safe_name($ext);
if (move_uploaded_file($file['tmp_name'], $target)) {
    echo json_encode(['success' => true, 'url' => $target]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar o vídeo no servidor.']);
}
