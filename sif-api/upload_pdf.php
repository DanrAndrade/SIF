<?php
require_once 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errMap = [
        UPLOAD_ERR_INI_SIZE  => 'Arquivo excede o limite do servidor.',
        UPLOAD_ERR_FORM_SIZE => 'Arquivo excede o limite do formulário.',
        UPLOAD_ERR_PARTIAL   => 'Upload incompleto.',
        UPLOAD_ERR_NO_FILE   => 'Nenhum arquivo enviado.',
        UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária não encontrada.',
        UPLOAD_ERR_CANT_WRITE => 'Falha ao gravar no disco.',
    ];
    $err = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $errMap[$err] ?? 'Erro no upload.']);
    exit;
}

$file = $_FILES['file'];

// Validate MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if ($mime !== 'application/pdf') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Apenas arquivos PDF são permitidos.']);
    exit;
}

// 20 MB max
if ($file['size'] > 20 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Arquivo muito grande. Máximo: 20 MB.']);
    exit;
}

$dir = 'uploads/pdfs/';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao criar diretório de upload.']);
    exit;
}

$safeName = time() . '_' . bin2hex(random_bytes(8)) . '.pdf';
$target   = $dir . $safeName;

if (move_uploaded_file($file['tmp_name'], $target)) {
    echo json_encode(['success' => true, 'url' => str_replace('\\', '/', $target)]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar arquivo no servidor.']);
}
