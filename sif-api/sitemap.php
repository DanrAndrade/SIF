<?php
/**
 * sitemap.xml gerado do banco (o .htaccess do site aponta /sitemap.xml para cá).
 * Sempre atualizado: cada página publicada no painel entra sozinha.
 */
require 'db.php';
require_once 'seo_lib.php';

$base = rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/') . '/';
$site = sif_seo_site_url($base);
$pages = sif_seo_build($pdo);
sif_seo_write_cache($pdo); // aproveita para renovar o índice

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
foreach ($pages as $p) {
    $loc = htmlspecialchars($site . $p['path'], ENT_XML1);
    echo "  <url>\n    <loc>{$loc}</loc>\n";
    if (!empty($p['lastmod']) && ($t = strtotime($p['lastmod']))) echo '    <lastmod>' . date('Y-m-d', $t) . "</lastmod>\n";
    echo '    <priority>' . number_format((float)$p['priority'], 1) . "</priority>\n";
    if (!empty($p['image'])) {
        echo '    <image:image><image:loc>' . htmlspecialchars(sif_seo_img($p['image'], $site), ENT_XML1) . "</image:loc></image:image>\n";
    }
    echo "  </url>\n";
}
echo "</urlset>\n";
