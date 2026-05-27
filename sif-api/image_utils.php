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
