<?php
/**
 * robots.txt (o .htaccess do site aponta /robots.txt para cá).
 * Enquanto o site estiver na pasta de homologação, pede para NÃO indexar.
 * Quando estiver na raiz do domínio, libera e indica o sitemap.
 */
$base = rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/') . '/';
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
$host = preg_replace('/[^a-z0-9.:\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'sif.org.br');
$site = ($https ? 'https' : 'http') . '://' . $host . $base;
$indexavel = ($base === '/');

header('Content-Type: text/plain; charset=UTF-8');
echo "User-agent: *\n";
if (!$indexavel) {
    echo "Disallow: /\n";
} else {
    echo "Allow: /\n";
    echo "Disallow: /admin\n";
    echo "Disallow: /sif-api/\n";
    echo "Allow: /sif-api/uploads/\n";
    echo "\nSitemap: {$site}sitemap.xml\n";
}
