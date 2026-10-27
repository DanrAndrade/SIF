<?php
/**
 * Entrega uma imagem do site no tamanho certo para onde ela aparece.
 *
 *   img.php?src=uploads/pages/home/images/foto.webp&w=800
 *
 * - Reduz a largura (nunca aumenta), converte para WebP (ou JPEG, se o
 *   servidor não tiver WebP) e guarda o resultado em cache/img/.
 * - Só aceita arquivos de imagem dentro de uploads/ e banners/ desta pasta e
 *   de nossa-gente/ (fotos da equipe, na pasta do site, ao lado de sif-api/).
 * - Sem a extensão GD no servidor, redireciona para a imagem original
 *   (o site continua funcionando, só fica mais pesado).
 */

$ALLOWED_W = [160, 320, 480, 640, 800, 1024, 1280, 1600, 1920];

$src = isset($_GET['src']) ? (string) $_GET['src'] : '';
$w   = isset($_GET['w']) ? (int) $_GET['w'] : 800;

// Largura: usa a mais próxima da lista (evita gerar mil versões)
$wanted = $w;
foreach ($ALLOWED_W as $opt) { $w = $opt; if ($opt >= $wanted) break; }

$src = ltrim(str_replace('\\', '/', $src), '/');
// letras com acento são aceitas (nomes de arquivo da equipe: "Serviços", "Ângela"...)
if ($src === '' || strpos($src, '..') !== false || !preg_match('#^(uploads|banners|nossa-gente)/[\p{L}\p{N}_\-./ ]+\.(jpe?g|png|webp|gif)$#iu', $src)) {
    http_response_code(400);
    exit;
}

// nossa-gente/ (fotos da equipe) fica na pasta do site, ao lado de sif-api/;
// uploads/ e banners/ ficam aqui dentro. O arquivo precisa estar DENTRO da pasta certa.
$inSite = strpos($src, 'nossa-gente/') === 0;
$base = $inSite ? realpath(dirname(__DIR__) . '/nossa-gente') : realpath(__DIR__);
$file = realpath(($inSite ? dirname(__DIR__) : __DIR__) . '/' . $src);
if (!$base) { http_response_code(404); exit; }
if (!$file || strpos(str_replace('\\', '/', $file), str_replace('\\', '/', $base) . '/') !== 0 || !is_file($file)) {
    http_response_code(404);
    exit;
}

// original (para quando o servidor não consegue reduzir), relativo a esta pasta
$origUrl = $inSite ? '../' . implode('/', array_map('rawurlencode', explode('/', $src))) : $src;
$canWebp = extension_loaded('gd') && function_exists('imagewebp');
$canJpeg = extension_loaded('gd') && function_exists('imagejpeg');
if (!$canWebp && !$canJpeg) {
    header('Location: ' . $origUrl, true, 302);
    exit;
}

$ext      = $canWebp ? 'webp' : 'jpg';
$mtime    = filemtime($file);
$key      = sha1($src . '|' . $mtime . '|' . $w);
$cacheDir = __DIR__ . '/cache/img';
$cached   = $cacheDir . '/' . $key . '.' . $ext;

$send = function (string $path, string $type) use ($key) {
    $etag = '"' . $key . '"';
    header('Content-Type: ' . $type);
    header('Cache-Control: public, max-age=15552000, immutable');
    header('ETag: ' . $etag);
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
};

$type = $canWebp ? 'image/webp' : 'image/jpeg';
if (is_file($cached)) $send($cached, $type);

$info = @getimagesize($file);
if (!$info || $info[0] < 1 || $info[1] < 1) { header('Location: ' . $origUrl, true, 302); exit; }
[$ow, $oh] = $info;

// Proteção de memória (GD usa ~4 bytes por pixel, origem + destino)
$limit = (function () {
    $v = trim((string) ini_get('memory_limit'));
    if ($v === '' || $v === '-1') return 0;
    $n = (int) $v; $u = strtolower(substr($v, -1));
    return $u === 'g' ? $n << 30 : ($u === 'm' ? $n << 20 : ($u === 'k' ? $n << 10 : $n));
})();
if ($limit > 0 && $ow * $oh * 4 * 2.3 > $limit * 0.7) { header('Location: ' . $origUrl, true, 302); exit; }

switch ($info['mime']) {
    case 'image/jpeg': $im = @imagecreatefromjpeg($file); break;
    case 'image/png':  $im = @imagecreatefrompng($file);  break;
    case 'image/gif':  $im = @imagecreatefromgif($file);  break;
    case 'image/webp': $im = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($file) : false; break;
    default: $im = false;
}
if (!$im) { header('Location: ' . $origUrl, true, 302); exit; }

$nw = min($w, $ow);
$nh = (int) max(1, round($oh * $nw / $ow));
$dst = imagecreatetruecolor($nw, $nh);
if ($ext === 'webp') {
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagefilledrectangle($dst, 0, 0, $nw, $nh, imagecolorallocatealpha($dst, 255, 255, 255, 127));
} else {
    imagefilledrectangle($dst, 0, 0, $nw, $nh, imagecolorallocate($dst, 255, 255, 255));
}
imagecopyresampled($dst, $im, 0, 0, 0, 0, $nw, $nh, $ow, $oh);
imagedestroy($im);

if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$tmp = $cached . '.' . getmypid() . '.tmp';
$ok = $ext === 'webp' ? @imagewebp($dst, $tmp, 78) : @imagejpeg($dst, $tmp, 80);
imagedestroy($dst);
if ($ok && @rename($tmp, $cached)) $send($cached, $type);

// Não conseguiu gravar o cache: entrega direto (sem guardar)
@unlink($tmp);
header('Location: ' . $origUrl, true, 302);
