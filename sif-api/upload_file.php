<?php
/**
 * Envio de arquivos para baixar (bloco "Arquivos e documentos" das páginas).
 * Aceita: PDF, Word (doc/docx), Excel (xls/xlsx), PowerPoint (ppt/pptx),
 * OpenDocument (odt/ods), CSV e imagens. Nada de executáveis nem zip.
 * O tipo é conferido pelo CONTEÚDO do arquivo (sif_safe_ext), não pelo nome.
 * Limite: 20 MB. Grava em uploads/files/.
 *
 *   POST file=<arquivo>  → {success, url, ext, size, name}
 */
require_once 'db.php';
require_once 'api_guard.php'; // exige login para gravar
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}
// Só quem tem alguma área do painel liberada (ou é responsável por GT)
$me = sif_user();
if (!sif_is_superadmin() && !($me['modules'] ?? []) && !($me['gt_ids'] ?? [])) sif_deny();

$fail = function (string $m, int $code = 400) { http_response_code($code); echo json_encode(['success' => false, 'message' => $m]); exit; };

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $err = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    $msgs = [
        UPLOAD_ERR_INI_SIZE  => 'Arquivo maior que o limite do servidor (20 MB).',
        UPLOAD_ERR_FORM_SIZE => 'Arquivo maior que o limite (20 MB).',
        UPLOAD_ERR_PARTIAL   => 'O envio foi interrompido. Tente de novo.',
        UPLOAD_ERR_NO_FILE   => 'Nenhum arquivo enviado.',
    ];
    $fail($msgs[$err] ?? 'Erro no envio do arquivo.');
}

$file = $_FILES['file'];
if ($file['size'] > 20 * 1024 * 1024) $fail('Arquivo muito grande. O máximo é 20 MB.');

$ext = sif_safe_ext($file['tmp_name'], 'files,image', $file['name']);
if (!$ext) {
    $fail('Tipo de arquivo não permitido. Envie PDF, Word, Excel, PowerPoint, OpenDocument (ODT/ODS), CSV ou imagem (JPG, PNG, WebP, GIF).');
}

$dir = 'uploads/files/';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) $fail('Erro ao criar a pasta de envio.', 500);

$target = $dir . time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], $target)) $fail('Erro ao salvar o arquivo no servidor.', 500);

// Nome amigável sugerido (o painel deixa editar): nome original sem extensão
$name = pathinfo((string)$file['name'], PATHINFO_FILENAME);
$name = trim(preg_replace('/[_]+/', ' ', strip_tags($name)));
echo json_encode([
    'success' => true,
    'url'     => str_replace('\\', '/', $target),
    'ext'     => $ext,
    'size'    => (int)filesize($target),
    'name'    => mb_substr($name, 0, 150),
]);
