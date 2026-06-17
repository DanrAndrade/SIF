<?php
/**
 * SPA loader com injeção de dados (SSR-lite).
 *
 * Lê o index.html gerado pelo Vite e injeta, antes de </head>:
 *   - <script>window.__BOOT__ = {config da página}</script>
 *   - <link rel="preload" as="image" fetchpriority="high"> do hero
 *
 * Os dados vêm de sif-api/cache/boot_<page>.json (gerado pelo page_content.php
 * ao ler/salvar a página). NÃO toca no banco de dados.
 *
 * 100% tolerante a falha: qualquer erro -> serve o index.html puro, e o React
 * busca pela API como sempre fez (nada quebra).
 */

$INDEX = __DIR__ . '/index.html';

try {
    $html = @file_get_contents($INDEX);
    if ($html === false || $html === '') { @readfile($INDEX); exit; }

    // Base da instalação (ex.: "/sif-novo-h7k2x9/"; na raiz vira "/")
    $base = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
    $base = rtrim($base, '/') . '/';

    // Caminho da rota, sem a base
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if (!is_string($uriPath)) $uriPath = '/';
    $path = $uriPath;
    if ($base !== '/' && strpos($path, $base) === 0) {
        $path = substr($path, strlen($base));
    }
    $path = trim($path, '/');

    // Mapa rota -> page_key (apenas páginas que usam page_content).
    // Só rotas de 1º nível recebem boot; páginas de detalhe usam a API (fallback).
    $map = [
        ''                         => 'home',
        'eventos'                  => 'eventos',
        'treinamentos'             => 'treinamentos',
        'treinamentos-in-company'  => 'treinamentos_in_company',
        'projetos'                 => 'projetos',
        'grupos-tematicos'         => 'gt',
        'produtos-servicos'        => 'produtos',
        'associadas'               => 'associadas',
        'contato'                  => 'contato',
        'trabalhe-conosco'         => 'jobs',
        'blog'                     => 'blog',
    ];
    $pageKey = (strpos($path, '/') === false && isset($map[$path])) ? $map[$path] : null;

    $inject = '';
    if ($pageKey) {
        $cacheFile = __DIR__ . '/sif-api/cache/boot_' . $pageKey . '.json';
        if (is_file($cacheFile)) {
            $json = @file_get_contents($cacheFile);
            $data = $json ? json_decode($json, true) : null;
            if (is_array($data)) {
                $inject .= '<script>window.__BOOT_PAGE__=' . json_encode($pageKey)
                         . ';window.__BOOT__=' . $json . ';</script>';

                // Imagem do hero (hero_image nas páginas; hero_bg na home)
                $img = '';
                if (!empty($data['hero_image'])) $img = $data['hero_image'];
                elseif (!empty($data['hero_bg'])) $img = $data['hero_bg'];

                if ($img) {
                    if (strpos($img, 'http') === 0 || strpos($img, 'data:') === 0) {
                        $imgUrl = $img;
                    } elseif (preg_match('#^/(nossa-gente|logos|docs|img)/#', $img)) {
                        $imgUrl = rtrim($base, '/') . $img;
                    } else {
                        $imgUrl = rtrim($base, '/') . '/sif-api/' . ltrim($img, '/');
                    }
                    $inject .= '<link rel="preload" as="image" fetchpriority="high" href="'
                             . htmlspecialchars($imgUrl, ENT_QUOTES) . '">';
                }
            }
        }
    }

    if ($inject !== '') {
        $html = preg_replace('#</head>#i', $inject . '</head>', $html, 1);
    }

    header('Content-Type: text/html; charset=UTF-8');
    echo $html;
} catch (\Throwable $e) {
    @readfile($INDEX);
}
