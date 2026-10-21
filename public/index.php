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
 * SEO: com sif-api/cache/seo_index.json (atualizado a cada gravação no painel)
 * troca título, descrição, Open Graph, canonical e robots de CADA rota, põe
 * dados estruturados (JSON-LD) e um resumo em texto dentro do #root para
 * robôs que não rodam JavaScript (Google, redes sociais e assistentes de IA).
 * O React substitui esse resumo ao carregar.
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
                // Recodifica com HEX_TAG/AMP: texto do painel não consegue quebrar o <script>
                $safeJson = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);
                $inject .= '<script>window.__BOOT_PAGE__=' . json_encode($pageKey)
                         . ';window.__BOOT__=' . $safeJson . ';</script>';

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

    // ---------------------------------------------------------------- SEO
    $seoFile = __DIR__ . '/sif-api/cache/seo_index.json';
    $seoAll = is_file($seoFile) ? json_decode((string)@file_get_contents($seoFile), true) : null;
    if (is_array($seoAll)) {
        $h = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $hostName = preg_replace('/[^a-z0-9.:\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'sif.org.br');
        $site = ($https ? 'https' : 'http') . '://' . $hostName . $base;
        $img = function ($p) use ($site) {
            if (!$p) return $site . 'favicon.svg';
            if (preg_match('#^https?://#', $p)) return $p;
            if (preg_match('#^/(nossa-gente|logos|docs|img)/#', $p)) return rtrim($site, '/') . $p;
            return $site . 'sif-api/' . ltrim($p, '/');
        };
        $indexavel = ($base === '/'); // homologação (subpasta) não entra no Google
        $e = $seoAll[$path] ?? null;

        // Rota de detalhe que não está no índice (oculta/excluída): não indexar
        $isDetail = preg_match('#^(eventos|treinamentos|treinamentos-in-company|grupos-tematicos|projetos|blog)/#', $path);
        if (!$e && $isDetail) header('X-Robots-Tag: noindex');

        if ($e) {
            $title = $path === '' ? $e['title'] : ($e['title'] . ' | SIF');
            $desc = $e['description'] ?? '';
            $url = $site . $path;
            $image = $img($e['image'] ?? '');

            $html = preg_replace('#<title>.*?</title>#is', '<title>' . $h($title) . '</title>', $html, 1);
            $set = function ($attr, $key, $val) use (&$html, $h) {
                $tag = '<meta ' . $attr . '="' . $key . '" content="' . $h($val) . '" />';
                $re = '#<meta\s+' . $attr . '="' . preg_quote($key, '#') . '"[^>]*>#i';
                $html = preg_match($re, $html) ? preg_replace($re, $tag, $html, 1) : preg_replace('#</head>#i', $tag . '</head>', $html, 1);
            };
            $set('name', 'description', $desc);
            $set('name', 'robots', $indexavel ? 'index, follow' : 'noindex, nofollow');
            $set('property', 'og:title', $title);
            $set('property', 'og:description', $desc);
            $set('property', 'og:url', $url);
            $set('property', 'og:image', $image);
            $set('property', 'og:type', ($e['type'] ?? '') === 'Article' ? 'article' : 'website');
            $set('name', 'twitter:title', $title);
            $set('name', 'twitter:description', $desc);
            $set('name', 'twitter:image', $image);
            $html = preg_replace('#<link\s+rel="canonical"[^>]*>#i', '<link rel="canonical" href="' . $h($url) . '" />', $html, 1);

            // Dados estruturados (JSON-LD)
            $org = ['@type' => 'Organization', 'name' => 'SIF - Sociedade de Investigações Florestais', 'url' => $site,
                    'logo' => $site . 'favicon.svg', 'email' => 'contato@sif.org.br', 'telephone' => '+55 31 3612-3950',
                    'address' => ['@type' => 'PostalAddress', 'streetAddress' => 'Av. P.H. Rolfs, s/n - Campus da UFV, Departamento de Engenharia Florestal',
                                  'addressLocality' => 'Viçosa', 'addressRegion' => 'MG', 'postalCode' => '36570-900', 'addressCountry' => 'BR']];
            $graph = [];
            if ($path === '') {
                $graph[] = $org;
                $graph[] = ['@type' => 'WebSite', 'name' => 'SIF', 'url' => $site, 'inLanguage' => 'pt-BR'];
            } else {
                $type = $e['type'] ?? 'WebPage';
                $node = ['@type' => $type === 'WebSite' ? 'WebPage' : $type, 'name' => $e['title'], 'description' => $desc, 'url' => $url, 'image' => $image];
                if ($type === 'Article') {
                    $node += ['headline' => $e['title'], 'datePublished' => $e['published'] ?? null, 'dateModified' => $e['lastmod'] ?? null, 'publisher' => $org];
                } elseif ($type === 'Event') {
                    $ev = $e['event'] ?? [];
                    if (!empty($ev['start'])) $node['startDate'] = $ev['start'];
                    if (!empty($ev['location'])) $node['location'] = ['@type' => 'Place', 'name' => $ev['location']];
                    $node['organizer'] = $org;
                } elseif ($type === 'Course') {
                    $node['provider'] = $org;
                }
                $graph[] = $node;
                // Trilha (Início › Seção › Página)
                $crumbs = [['Início', $site]];
                $parts = explode('/', $path);
                if (count($parts) > 1 && isset($seoAll[$parts[0]])) $crumbs[] = [$seoAll[$parts[0]]['title'], $site . $parts[0]];
                $crumbs[] = [$e['title'], $url];
                $graph[] = ['@type' => 'BreadcrumbList', 'itemListElement' => array_map(fn($c, $i) => ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $c[0], 'item' => $c[1]], $crumbs, array_keys($crumbs))];
            }
            $ld = json_encode(['@context' => 'https://schema.org', '@graph' => $graph], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $inject .= '<script type="application/ld+json">' . str_replace('</', '<\/', $ld) . '</script>';

            // Resumo em texto no #root (o React troca pelo site ao carregar)
            $links = '';
            foreach ($seoAll as $p => $it) {
                if (strpos($p, '/') !== false || $p === '') continue;
                $links .= '<li><a href="' . $h($base . $p) . '">' . $h($it['title']) . '</a></li>';
            }
            $children = '';
            if (strpos($path, '/') === false) {
                $prefix = $path === '' ? '' : $path . '/';
                $n = 0;
                foreach ($seoAll as $p => $it) {
                    if ($prefix === '' || strpos($p, $prefix) !== 0 || $p === $path) continue;
                    if (++$n > 30) break;
                    $children .= '<li><a href="' . $h($base . $p) . '">' . $h($it['title']) . '</a> ' . $h($it['description'] ?? '') . '</li>';
                }
            }
            $ssr = '<header><a href="' . $h($base) . '">SIF - Sociedade de Investigações Florestais</a><nav><ul>' . $links . '</ul></nav></header>'
                 . '<main><h1>' . $h($e['heading'] ?? $e['title']) . '</h1><p>' . $h($desc) . '</p>'
                 . ($children ? '<ul>' . $children . '</ul>' : '') . '</main>';
            $html = preg_replace('#<div id="root"></div>#', '<div id="root"><div class="sif-ssr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">' . $ssr . '</div></div>', $html, 1);
        } elseif (!$indexavel) {
            $html = preg_replace('#<meta\s+name="robots"[^>]*>#i', '<meta name="robots" content="noindex, nofollow" />', $html, 1);
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
