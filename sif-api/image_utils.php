<?php
/**
 * Image compression and resize utility.
 * Compresses the image at $filePath in-place.
 * Max width 1920px, JPEG quality 82 (or PNG compression level 7).
 */
function compressImage(string $filePath, int $maxWidth = 1920, int $quality = 82): bool {
    if (!extension_loaded('gd')) return false;
    $info = @getimagesize($filePath);
    if (!$info) return false;

    $mime = $info['mime'];
    $origW = $info[0];
    $origH = $info[1];

    switch ($mime) {
        case 'image/jpeg': $src = @imagecreatefromjpeg($filePath); break;
        case 'image/png':  $src = @imagecreatefrompng($filePath);  break;
        case 'image/webp': $src = @imagecreatefromwebp($filePath); break;
        case 'image/gif':  $src = @imagecreatefromgif($filePath);  break;
        default: return false;
    }
    if (!$src) return false;

    if ($origW > $maxWidth) {
        $newW = $maxWidth;
        $newH = (int) round($origH * ($maxWidth / $origW));
    } else {
        $newW = $origW;
        $newH = $origH;
    }

    $dst = imagecreatetruecolor($newW, $newH);
    if (!$dst) { imagedestroy($src); return false; }

    if ($mime === 'image/png') {
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
        imagefilledrectangle($dst, 0, 0, $newW, $newH, $transparent);
    }

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
    imagedestroy($src);

    if ($mime === 'image/png') {
        $pngLevel = max(0, min(9, (int) round(9 - ($quality / 11))));
        $result = imagepng($dst, $filePath, $pngLevel);
    } else {
        $result = imagejpeg($dst, $filePath, $quality);
    }

    imagedestroy($dst);
    return $result;
}

/**
 * Converte uma imagem para WebP (qualidade ~80, largura máx. 1920px),
 * salvando como .webp e apagando o original. Retorna o NOVO caminho (.webp)
 * em caso de sucesso, ou NULL se não puder converter (mantém o original).
 *
 * Tolerante a falha: se GD/imagewebp não existir, ou o formato não for
 * convertível (SVG/AVIF/HEIC), retorna NULL e o chamador mantém o original.
 */
function convertToWebp(string $filePath, int $maxWidth = 1920, int $quality = 80): ?string {
    if (!extension_loaded('gd') || !function_exists('imagewebp')) return null;

    $info = @getimagesize($filePath);
    if (!$info) return null;

    $mime  = $info['mime'];
    $origW = $info[0];
    $origH = $info[1];
    if ($origW < 1 || $origH < 1) return null;

    // Proteção de memória: GD usa ~4 bytes/pixel (origem + destino + folga).
    // Se a imagem for grande demais para a memória disponível, NÃO converte
    // (retorna null e o chamador mantém o original) — evita erro fatal.
    $limitBytes = (function () {
        $v = trim(ini_get('memory_limit'));
        if ($v === '' || $v === '-1') return 0;
        $unit = strtolower(substr($v, -1));
        $num = (int) $v;
        if ($unit === 'g') return $num * 1024 * 1024 * 1024;
        if ($unit === 'm') return $num * 1024 * 1024;
        if ($unit === 'k') return $num * 1024;
        return $num;
    })();
    if ($limitBytes > 0) {
        $estimado = $origW * $origH * 4 * 2.3;
        if ($estimado > $limitBytes * 0.7) return null;
    }

    switch ($mime) {
        case 'image/jpeg': $src = @imagecreatefromjpeg($filePath); break;
        case 'image/png':  $src = @imagecreatefrompng($filePath);  break;
        case 'image/gif':  $src = @imagecreatefromgif($filePath);  break;
        case 'image/webp': return str_replace('\\', '/', $filePath); // já é webp
        case 'image/bmp':
        case 'image/x-ms-bmp':
            if (!function_exists('imagecreatefrombmp')) return null;
            $src = @imagecreatefrombmp($filePath);
            break;
        default: return null; // svg/avif/heic/tiff: não converte
    }
    if (!$src) return null;

    if ($origW > $maxWidth) {
        $newW = $maxWidth;
        $newH = (int) round($origH * ($maxWidth / $origW));
    } else {
        $newW = $origW;
        $newH = $origH;
    }

    $dst = imagecreatetruecolor($newW, $newH);
    if (!$dst) { imagedestroy($src); return null; }

    // Preserva transparência (PNG/GIF)
    imagealphablending($dst, false);
    imagesavealpha($dst, true);

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
    imagedestroy($src);

    $webpPath = preg_replace('/\.[^.\/\\\\]+$/', '', $filePath) . '.webp';
    $ok = @imagewebp($dst, $webpPath, $quality);
    imagedestroy($dst);

    if (!$ok) return null;

    // Remove o original se o nome mudou (ex.: .jpg -> .webp)
    $webpPath = str_replace('\\', '/', $webpPath);
    $origNorm = str_replace('\\', '/', $filePath);
    if ($webpPath !== $origNorm && is_file($filePath)) @unlink($filePath);

    return $webpPath;
}
