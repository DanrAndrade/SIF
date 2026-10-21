<?php
/**
 * SEO do site com conteúdo dinâmico.
 *
 * sif_seo_build($pdo)  → lista de todas as páginas públicas (fixas + eventos,
 *                         treinamentos, GTs, projetos, posts...) com título,
 *                         descrição, imagem, data e tipo (para JSON-LD).
 * sif_seo_write_cache  → grava cache/seo_index.json. É chamado depois de
 *                         qualquer gravação no painel (api_guard.php), então
 *                         o SEO acompanha o conteúdo sozinho.
 *
 * Quem usa: public/index.php (metatags na 1ª carga), sitemap.php, llms.php.
 * Tudo aqui é tolerante a falha: se uma tabela não existir, ela é pulada.
 */

const SIF_SEO_CACHE = __DIR__ . '/cache/seo_index.json';

function sif_seo_text(?string $html, int $max = 160): string {
    // Treinamentos antigos guardam a descrição como JSON {"presentation": "..."}
    $raw = trim((string)$html);
    if ($raw !== '' && $raw[0] === '{') { $j = json_decode($raw, true); if (is_array($j)) $html = $j['presentation'] ?? $j['description'] ?? implode(' ', array_filter($j, 'is_string')); }
    $t = html_entity_decode(strip_tags((string)$html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = trim(preg_replace('/\s+/u', ' ', $t));
    if (mb_strlen($t) <= $max) return $t;
    $cut = mb_substr($t, 0, $max - 1);
    $cut = preg_replace('/\s+\S*$/u', '', $cut);
    return rtrim($cut, " ,.;:-") . '…';
}

function sif_seo_rows(PDO $pdo, string $sql): array {
    try { return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: []; } catch (Throwable $e) { return []; }
}

function sif_seo_page_cfg(PDO $pdo, string $key): array {
    try {
        $st = $pdo->prepare("SELECT config_json FROM page_configs WHERE page_key = ?");
        $st->execute([$key]);
        $j = $st->fetchColumn();
        $d = $j ? json_decode($j, true) : null;
        return is_array($d) ? $d : [];
    } catch (Throwable $e) { return []; }
}

// Título/descrição de uma página fixa a partir do cabeçalho editado no painel
function sif_seo_hero(array $cfg, string $fallbackTitle, string $fallbackDesc): array {
    $title = trim(trim($cfg['hero_title_line1'] ?? '') . ' ' . trim($cfg['hero_title_highlight'] ?? ''));
    $desc = sif_seo_text($cfg['hero_subtitle'] ?? '');
    return [
        'title' => $title !== '' ? $title : $fallbackTitle,
        'description' => $desc !== '' ? $desc : $fallbackDesc,
        'image' => $cfg['hero_image'] ?? '',
    ];
}

function sif_seo_build(PDO $pdo): array {
    $out = [];
    $add = function (string $path, array $e) use (&$out) {
        $out[$path] = array_merge(['path' => $path, 'type' => 'WebPage', 'image' => '', 'lastmod' => null, 'priority' => 0.6], $e);
    };

    // --- Páginas fixas
    $home = sif_seo_page_cfg($pdo, 'home');
    $heroH = $home['hero'] ?? [];
    $add('', [
        'title' => 'SIF | Sociedade de Investigações Florestais',
        'description' => sif_seo_text($heroH['subtitle'] ?? '') ?: 'Referência nacional em ciência, pesquisa e tecnologia para o setor florestal brasileiro, em parceria com a UFV.',
        'image' => $home['hero_bg'] ?? '', 'priority' => 1.0, 'type' => 'WebSite',
    ]);
    $inst = sif_seo_page_cfg($pdo, 'institucional_geral');
    $static = [
        'institucional'           => [$inst, 'Institucional', 'História, equipe, estatuto e áreas de atuação da SIF.', 0.9],
        'associadas'              => [sif_seo_page_cfg($pdo, 'associadas'), 'Empresas Associadas', 'Empresas do setor florestal que fazem parte da rede da SIF.', 0.8],
        'produtos-servicos'       => [sif_seo_page_cfg($pdo, 'produtos'), 'Produtos e Serviços', 'Serviços, boletins técnicos e programas da SIF para o setor florestal.', 0.8],
        'eventos'                 => [sif_seo_page_cfg($pdo, 'eventos'), 'Eventos', 'Eventos técnicos e científicos promovidos pela SIF.', 0.8],
        'treinamentos'            => [sif_seo_page_cfg($pdo, 'treinamentos'), 'Treinamentos', 'Cursos e treinamentos para profissionais do setor florestal.', 0.8],
        'treinamentos-in-company' => [sif_seo_page_cfg($pdo, 'treinamentos_in_company'), 'Treinamentos In-Company', 'Treinamentos sob medida dentro da sua empresa.', 0.7],
        'grupos-tematicos'        => [sif_seo_page_cfg($pdo, 'gt'), 'Grupos Temáticos', 'Grupos de cooperação técnica entre empresas associadas e pesquisadores.', 0.8],
        'projetos'                => [sif_seo_page_cfg($pdo, 'projetos'), 'Projetos', 'Projetos de pesquisa, desenvolvimento e inovação da SIF.', 0.8],
        'projetos-sif-embrapii'   => [sif_seo_page_cfg($pdo, 'embrapii'), 'Projetos SIF e EMBRAPII', 'Unidade EMBRAPII Fibras Florestais: pesquisa em parceria com empresas.', 0.7],
        'blog'                    => [sif_seo_page_cfg($pdo, 'blog'), 'Blog e Notícias', 'Notícias, artigos e novidades da SIF e do setor florestal.', 0.8],
        'trabalhe-conosco'        => [sif_seo_page_cfg($pdo, 'jobs'), 'Trabalhe Conosco', 'Vagas na SIF, nas empresas associadas e no programa Germinar.', 0.6],
        'contato'                 => [sif_seo_page_cfg($pdo, 'contato'), 'Fale Conosco', 'Telefone, e-mail, endereço e formulário de contato da SIF.', 0.6],
    ];
    foreach ($static as $path => [$cfg, $t, $d, $prio]) {
        $h = sif_seo_hero($cfg, $t, $d);
        $add($path, ['title' => $t, 'heading' => $h['title'], 'description' => $h['description'], 'image' => $h['image'], 'priority' => $prio]);
    }
    $eincol = sif_seo_rows($pdo, "SELECT * FROM eincol_config LIMIT 1");
    if ($eincol) $add('eincol', ['title' => 'EINCOL', 'description' => 'Encontro técnico promovido pela SIF.', 'priority' => 0.6]);

    // --- Conteúdo dinâmico
    foreach (sif_seo_rows($pdo, "SELECT slug, title, description, image_url, date, event_date, location, created_at FROM eventos WHERE active = 1") as $r) {
        $add('eventos/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($r['description']) ?: 'Evento promovido pela SIF.',
            'image' => $r['image_url'], 'type' => 'Event', 'lastmod' => $r['created_at'], 'priority' => 0.7,
            'event' => ['start' => $r['event_date'] ?: $r['date'], 'location' => $r['location']],
        ]);
    }
    foreach (sif_seo_rows($pdo, "SELECT slug, title, description, image_url, start_date, end_date, location, created_at FROM treinamentos WHERE active = 1") as $r) {
        $add('treinamentos/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($r['description']) ?: 'Treinamento oferecido pela SIF.',
            'image' => $r['image_url'], 'type' => 'Course', 'lastmod' => $r['created_at'], 'priority' => 0.7,
        ]);
    }
    foreach (sif_seo_rows($pdo, "SELECT slug, title, description, image_url, created_at FROM treinamentos_in_company WHERE active = 1") as $r) {
        $add('treinamentos-in-company/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($r['description']) ?: 'Treinamento in-company da SIF.',
            'image' => $r['image_url'], 'type' => 'Course', 'lastmod' => $r['created_at'], 'priority' => 0.6,
        ]);
    }
    foreach (sif_seo_rows($pdo, "SELECT slug, title, description, image_url, extra_data, created_at FROM gt WHERE active = 1") as $r) {
        $extra = json_decode((string)$r['extra_data'], true) ?: [];
        $add('grupos-tematicos/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($extra['summary'] ?? '') ?: (sif_seo_text($r['description']) ?: 'Grupo Temático da SIF.'),
            'image' => $r['image_url'], 'lastmod' => $r['created_at'], 'priority' => 0.7,
        ]);
    }
    foreach (sif_seo_rows($pdo, "SELECT slug, title, description, image_url, created_at FROM projetos WHERE active = 1") as $r) {
        $add('projetos/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($r['description']) ?: 'Projeto de P&D da SIF.',
            'image' => $r['image_url'], 'lastmod' => $r['created_at'], 'priority' => 0.6,
        ]);
    }
    foreach (sif_seo_rows($pdo, "SELECT slug, title, content, image_url, created_at, updated_at FROM blog_posts WHERE active = 1") as $r) {
        $add('blog/' . $r['slug'], [
            'title' => $r['title'], 'description' => sif_seo_text($r['content']) ?: 'Publicação do blog da SIF.',
            'image' => $r['image_url'], 'type' => 'Article', 'lastmod' => $r['updated_at'] ?: $r['created_at'],
            'published' => $r['created_at'], 'priority' => 0.6,
        ]);
    }
    return $out;
}

function sif_seo_write_cache(PDO $pdo): void {
    try {
        $dir = dirname(SIF_SEO_CACHE);
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        $data = sif_seo_build($pdo);
        @file_put_contents(SIF_SEO_CACHE . '.tmp', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        @rename(SIF_SEO_CACHE . '.tmp', SIF_SEO_CACHE);
    } catch (Throwable $e) {
        error_log('[sif-api] seo cache: ' . $e->getMessage());
    }
}

function sif_seo_read_cache(): array {
    $j = @file_get_contents(SIF_SEO_CACHE);
    $d = $j ? json_decode($j, true) : null;
    return is_array($d) ? $d : [];
}

// URL pública do site (ex.: https://sif.org.br/ ou https://sif.org.br/sif-novo-h7k2x9/)
// a partir do pedido atual. $base = pasta do site (com barra no fim).
function sif_seo_site_url(string $base): string {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $host = preg_replace('/[^a-z0-9.:\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'sif.org.br');
    return ($https ? 'https' : 'http') . '://' . $host . $base;
}

// Endereço de imagem salvo no banco → URL absoluta
function sif_seo_img(string $img, string $siteUrl): string {
    if ($img === '') return '';
    if (preg_match('#^https?://#', $img)) return $img;
    if (preg_match('#^/(nossa-gente|logos|docs|img)/#', $img)) return rtrim($siteUrl, '/') . $img;
    return $siteUrl . 'sif-api/' . ltrim($img, '/');
}
