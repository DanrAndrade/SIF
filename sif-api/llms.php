<?php
/**
 * llms.txt — resumo do site em texto simples para assistentes de IA
 * (ChatGPT, Gemini, Perplexity...): quem é a SIF e onde está cada assunto.
 * Gerado do banco, então acompanha o conteúdo publicado no painel.
 */
require 'db.php';
require_once 'seo_lib.php';

$base = rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/') . '/';
$site = sif_seo_site_url($base);
$pages = sif_seo_build($pdo);

$groups = [
    'Páginas principais' => fn($p) => strpos($p['path'], '/') === false,
    'Grupos Temáticos'   => fn($p) => strpos($p['path'], 'grupos-tematicos/') === 0,
    'Eventos'            => fn($p) => strpos($p['path'], 'eventos/') === 0,
    'Treinamentos'       => fn($p) => strpos($p['path'], 'treinamentos/') === 0 || strpos($p['path'], 'treinamentos-in-company/') === 0,
    'Projetos'           => fn($p) => strpos($p['path'], 'projetos/') === 0,
    'Blog'               => fn($p) => strpos($p['path'], 'blog/') === 0,
];

header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: public, max-age=3600');
$home = $pages[''] ?? ['description' => ''];
echo "# SIF - Sociedade de Investigações Florestais\n\n";
echo "> " . ($home['description'] ?: 'Instituição de referência em ciência, pesquisa e tecnologia para o setor florestal brasileiro, ligada à Universidade Federal de Viçosa (UFV).') . "\n\n";
echo "A SIF conecta a universidade (Departamento de Engenharia Florestal da UFV, em Viçosa/MG) às empresas do setor florestal: pesquisa aplicada, grupos temáticos de cooperação, eventos, treinamentos, projetos de P&D e a unidade EMBRAPII Fibras Florestais.\n\n";
echo "Contato: contato@sif.org.br · (31) 3612-3950 · " . $site . "contato\n\n";
foreach ($groups as $title => $match) {
    $items = array_filter($pages, $match);
    if (!$items) continue;
    echo "## {$title}\n\n";
    foreach ($items as $p) {
        $name = $p['path'] === '' ? 'Início' : ($p['title'] ?? $p['path']);
        echo "- [{$name}]({$site}{$p['path']})" . (!empty($p['description']) ? ": {$p['description']}" : '') . "\n";
    }
    echo "\n";
}
