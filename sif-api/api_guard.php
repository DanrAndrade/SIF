<?php
/**
 * Incluído por todos os endpoints logo após o db.php, ANTES de ler $_POST.
 * Faz duas coisas:
 *
 * 1) DECODIFICA o que o site envia codificado (ver src/utils/apiInterceptor.js).
 *    O firewall da HostGator (ModSecurity) bloqueia envios com HTML/links
 *    (ex.: "https://www.instagram.com/...", "<p><br></p>"). Por isso o front
 *    manda os textos em base64url e aqui eles voltam ao original:
 *      - $_POST: valores "__sifb64:<base64url>" são decodificados (inclusive em arrays)
 *      - JSON:   use sif_raw_input() no lugar de file_get_contents('php://input')
 *    Valores sem o prefixo passam intactos (compatível com envios antigos).
 *
 * 2) EXIGE LOGIN DO PAINEL para qualquer gravação (POST/PUT/DELETE) e
 *    confere a PERMISSÃO do usuário para a área (perfis: admin / editor).
 *    Leitura (GET) continua pública, pois o site precisa dela.
 *    Exceções: login e os formulários públicos (contato e candidatura),
 *    que já checam o login sozinhos nas partes restritas.
 */

// ---------------------------------------------------------------- 0) respostas sempre em JSON
// Padrão JSON (endpoints que devolvem outro tipo, ex.: download, sobrescrevem).
if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');

// Qualquer erro não tratado (ex.: falha de SQL) vira JSON com mensagem —
// antes saía página vazia/HTML e o painel só mostrava "Erro de conexão".
set_exception_handler(function ($e) {
    error_log('[sif-api] ' . $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    $msg = 'Erro no servidor ao processar o pedido.';
    if ($e instanceof PDOException) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            $msg = 'Já existe um item com esse mesmo endereço (título/slug). Altere o título e tente de novo.';
        } elseif (stripos($e->getMessage(), 'Incorrect string value') !== false) {
            $msg = 'O texto contém um caractere que o banco não aceita (ex.: emoji). Remova e tente de novo.';
        } elseif (stripos($e->getMessage(), 'Data too long') !== false) {
            $msg = 'Um dos campos ficou grande demais para ser salvo.';
        } else {
            $msg = 'Erro ao gravar no banco de dados.';
        }
    }
    echo json_encode(['success' => false, 'status' => 'error', 'message' => $msg]);
});

// ---------------------------------------------------------------- 1) decodificação
const SIF_B64_MARK = '__sifb64:';

function sif_b64url_decode(string $s) {
    return base64_decode(strtr($s, '-_', '+/'));
}

function sif_waf_decode($value) {
    if (is_array($value)) return array_map('sif_waf_decode', $value);
    if (is_string($value) && strncmp($value, SIF_B64_MARK, strlen(SIF_B64_MARK)) === 0) {
        $decoded = sif_b64url_decode(substr($value, strlen(SIF_B64_MARK)));
        return $decoded === false ? $value : $decoded;
    }
    return $value;
}

$_POST = sif_waf_decode($_POST);

// Corpo bruto da requisição (JSON), já decodificado se veio no envelope {"__sif_b64": "..."}.
function sif_raw_input(): string {
    static $raw = null;
    if ($raw !== null) return $raw;
    $raw = (string) file_get_contents('php://input');
    $json = json_decode($raw, true);
    if (is_array($json) && count($json) === 1 && isset($json['__sif_b64']) && is_string($json['__sif_b64'])) {
        $decoded = sif_b64url_decode($json['__sif_b64']);
        if ($decoded !== false) $raw = $decoded;
    }
    return $raw;
}

// ---------------------------------------------------------------- 1b) upload seguro
// Define a extensão do arquivo enviado pelo TIPO REAL do conteúdo (não pelo
// nome que veio do computador do usuário). Assim ninguém consegue gravar
// um ".php" ou um SVG com script disfarçado de imagem. Retorna null se o
// tipo não for permitido.
//   $kinds: 'image', 'pdf', 'doc', 'video', 'files' ou combinação ('image,pdf')
//   'files' = documentos para baixar (bloco "Arquivos e documentos"): PDF,
//   Word, Excel, PowerPoint, OpenDocument e CSV. Sem executáveis e sem zip.
function sif_safe_ext(string $tmpPath, string $kinds, string $originalName = ''): ?string {
    if (!is_file($tmpPath)) return null;
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $tmpPath);
    finfo_close($finfo);
    $origExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    $map = [
        'image' => [
            'image/jpeg' => 'jpg', 'image/pjpeg' => 'jpg', 'image/png' => 'png',
            'image/gif' => 'gif', 'image/webp' => 'webp', 'image/bmp' => 'bmp',
            'image/x-ms-bmp' => 'bmp', 'image/avif' => 'avif',
            'image/heic' => 'heic', 'image/heif' => 'heif',
        ],
        'pdf' => ['application/pdf' => 'pdf'],
        'video' => ['video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/x-matroska' => 'webm', 'video/quicktime' => 'mov'],
        'doc' => [
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        ],
        'files' => [
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            'application/vnd.ms-powerpoint' => 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
            'application/vnd.oasis.opendocument.text' => 'odt',
            'application/vnd.oasis.opendocument.spreadsheet' => 'ods',
        ],
    ];
    foreach (explode(',', $kinds) as $k) {
        $k = trim($k);
        if (isset($map[$k][$mime])) return $map[$k][$mime];
    }
    // .docx às vezes é identificado só como "zip"
    if (strpos($kinds, 'doc') !== false && $mime === 'application/zip'
        && $origExt === 'docx') {
        return 'docx';
    }
    if (strpos($kinds, 'files') !== false) {
        // Office novo / OpenDocument identificados só como zip: confere por dentro
        // (precisa ter a estrutura do Office/ODF; zip comum é recusado).
        $zipLike = ['application/zip', 'application/octet-stream', 'application/x-zip-compressed'];
        if (in_array($mime, $zipLike, true) && in_array($origExt, ['docx', 'xlsx', 'pptx', 'odt', 'ods'], true)) {
            $fh = @fopen($tmpPath, 'rb'); $head = $fh ? fread($fh, 4) : ''; if ($fh) fclose($fh);
            if ($head !== "PK\x03\x04") return null;
            if (!class_exists('ZipArchive')) { // sem a extensão zip: procura a estrutura pelo nome interno
                $raw = (string)@file_get_contents($tmpPath);
                return strpos($raw, in_array($origExt, ['odt', 'ods'], true) ? 'mimetypeapplication/vnd.oasis' : '[Content_Types].xml') !== false ? $origExt : null;
            }
            $z = new ZipArchive();
            if ($z->open($tmpPath) !== true) return null;
            $okOffice = $z->locateName('[Content_Types].xml') !== false;
            $odfMime = $z->getFromName('mimetype');
            $z->close();
            if (in_array($origExt, ['odt', 'ods'], true)) {
                $want = $origExt === 'odt' ? 'application/vnd.oasis.opendocument.text' : 'application/vnd.oasis.opendocument.spreadsheet';
                return trim((string)$odfMime) === $want ? $origExt : null;
            }
            return $okOffice ? $origExt : null;
        }
        // Office antigo (doc/xls/ppt) às vezes vem como "contêiner OLE" genérico
        if (in_array($mime, ['application/CDFV2', 'application/x-ole-storage', 'application/vnd.ms-office', 'application/octet-stream'], true)
            && in_array($origExt, ['doc', 'xls', 'ppt'], true)) {
            $fh = @fopen($tmpPath, 'rb'); $head = $fh ? fread($fh, 8) : ''; if ($fh) fclose($fh);
            return $head === "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1" ? $origExt : null;
        }
        // CSV: texto puro, só com o nome .csv (sem tags HTML/script)
        if (in_array($mime, ['text/csv', 'text/plain', 'application/csv', 'text/x-csv'], true) && $origExt === 'csv') {
            $sample = (string)@file_get_contents($tmpPath, false, null, 0, 8192);
            if (preg_match('#<\s*(script|html|body|iframe|svg|\?php)#i', $sample)) return null;
            return 'csv';
        }
    }
    return null;
}

// Nome de arquivo novo e seguro: <timestamp>_<aleatório>.<ext>
function sif_safe_name(string $ext): string {
    return time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
}

// ---------------------------------------------------------------- 1c) migração do banco
// Ajustes de estrutura, idempotentes e versionados. Rodam uma única vez
// (a versão aplicada fica em page_configs, chave "_schema"). Chamado pelo
// session.php/login quando o admin entra — não pesa nas visitas do site.
// Cada comando roda sozinho: se um falhar (ex.: banco antigo), fica no log
// e os outros continuam — uma falha não trava as versões seguintes.
const SIF_SCHEMA_VERSION = 6;

function sif_ensure_schema(PDO $pdo): void {
    static $done = false;
    if ($done) return;
    $done = true;
    try {
        $row = $pdo->query("SELECT config_json FROM page_configs WHERE page_key = '_schema'")->fetch(PDO::FETCH_ASSOC);
        $current = $row ? (int)(json_decode($row['config_json'], true)['version'] ?? 0) : 0;
        if ($current >= SIF_SCHEMA_VERSION) return;

        $db = $pdo->query("SELECT DATABASE()")->fetchColumn();
        $colType = function ($table, $col) use ($pdo, $db) {
            $st = $pdo->prepare("SELECT DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?");
            $st->execute([$db, $table, $col]);
            return $st->fetchColumn(); // false se não existe
        };
        $tableExists = function ($table) use ($pdo, $db) {
            $st = $pdo->prepare("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?");
            $st->execute([$db, $table]);
            return (int)$st->fetchColumn() > 0;
        };
        $run = function (string $sql) use ($pdo) {
            try { $pdo->exec($sql); }
            catch (Throwable $e) { error_log('[sif-api] migração: "' . substr($sql, 0, 120) . '" falhou: ' . $e->getMessage()); }
        };
        $addCol = function (string $t, string $c, string $def) use ($tableExists, $colType, $run) {
            if ($tableExists($t) && $colType($t, $c) === false) $run("ALTER TABLE `$t` ADD COLUMN `$c` $def");
        };

        if ($current < 1) {
            // a) Tabelas antigas em utf8 (3 bytes) → utf8mb4 (aceita emoji)
            foreach (['eventos', 'gt', 'treinamentos'] as $t) {
                if (!$tableExists($t)) continue;
                $st = $pdo->prepare("SELECT TABLE_COLLATION FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?");
                $st->execute([$db, $t]);
                if (strpos((string)$st->fetchColumn(), 'utf8mb4') !== 0) {
                    $run("ALTER TABLE `$t` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                }
            }
            // b) Conteúdo rico/JSON em TEXT (64 KB) → LONGTEXT (sem corte)
            $toLong = [
                'gt' => ['extra_data', 'description'],
                'treinamentos' => ['extra_data', 'description'],
                'projetos' => ['extra_data', 'description'],
                'blog_posts' => ['extra_data', 'content'],
                'eventos' => ['description'],
                'faqs' => ['answer'],
                'timeline_items' => ['content'],
            ];
            foreach ($toLong as $t => $cols) {
                foreach ($cols as $c) {
                    if (in_array($colType($t, $c), ['text', 'tinytext', 'mediumtext'], true)) $run("ALTER TABLE `$t` MODIFY `$c` LONGTEXT NULL");
                }
            }
            // c) Status manual dos eventos (o painel tinha o campo, mas não gravava)
            $addCol('eventos', 'status', 'VARCHAR(40) NULL');
        }

        if ($current < 2) {
            // Vagas por categoria: Interna / Associadas / Germinar (antes: enum Interna/Externa)
            if ($tableExists('jobs') && $colType('jobs', 'tipo_vaga') === 'enum') {
                $run("ALTER TABLE jobs MODIFY tipo_vaga VARCHAR(30) NOT NULL DEFAULT 'Interna'");
                $run("UPDATE jobs SET tipo_vaga = 'Associadas' WHERE tipo_vaga = 'Externa'");
            }
        }

        if ($current < 3) {
            // Usuários e permissões: perfil, módulos liberados e GTs pelos quais responde.
            // Quem já existia vira administrador (DEFAULT 'admin').
            foreach ([
                'name' => "VARCHAR(120) NULL", 'cargo' => "VARCHAR(120) NULL",
                'role' => "VARCHAR(20) NOT NULL DEFAULT 'admin'", 'modules' => "TEXT NULL", 'gt_ids' => "TEXT NULL",
                'active' => "TINYINT(1) NOT NULL DEFAULT 1", 'last_login' => "DATETIME NULL",
                'created_at' => "TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP",
            ] as $col => $def) $addCol('admins', $col, $def);
            // Blog: grupo temático do post, responsáveis (vários) e quem criou
            $addCol('blog_posts', 'gt_id', 'INT NULL');
            $addCol('blog_posts', 'responsavel_ids', 'TEXT NULL');
            $addCol('blog_posts', 'created_by', 'INT NULL');
        }

        if ($current < 4) {
            // Colunas que antes eram conferidas a CADA visita (associadas/treinamentos)
            $addCol('associadas', 'website', 'VARCHAR(500) NULL');
            $addCol('treinamentos', 'date', 'VARCHAR(100) NULL');
            $addCol('treinamentos', 'start_date', 'DATE NULL');
            $addCol('treinamentos', 'end_date', 'DATE NULL');
            // Tentativas de login (bloqueio contra força bruta)
            $run("CREATE TABLE IF NOT EXISTS login_attempts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    kind VARCHAR(20) NOT NULL,
                    ident VARCHAR(190) NOT NULL,
                    created_at DATETIME NOT NULL,
                    INDEX idx_login_attempts (kind, ident, created_at)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        }

        if ($current < 5) {
            // Responsável por GT = usuário do painel. Perfil público no próprio usuário
            // (aparece no card "Responsável pelo grupo") e o GT guarda quem responde por ele.
            foreach ([
                'photo' => 'VARCHAR(500) NULL', 'whatsapp' => 'VARCHAR(40) NULL', 'link' => 'VARCHAR(500) NULL',
                'link_label' => 'VARCHAR(80) NULL', 'contact_email' => 'VARCHAR(190) NULL',
            ] as $col => $def) $addCol('admins', $col, $def);
            $addCol('gt', 'responsavel_id', 'INT NULL');
            // Quem já tinha GT marcado no cadastro vira o responsável (se o GT ainda não tem)
            try {
                foreach ($pdo->query("SELECT id, gt_ids FROM admins WHERE gt_ids IS NOT NULL AND gt_ids <> '' AND gt_ids <> '[]'")->fetchAll(PDO::FETCH_ASSOC) as $a) {
                    foreach (array_map('intval', sif_json_list($a['gt_ids'])) as $g) {
                        $pdo->prepare("UPDATE gt SET responsavel_id = ? WHERE id = ? AND responsavel_id IS NULL")->execute([(int)$a['id'], $g]);
                    }
                }
            } catch (Throwable $e) { error_log('[sif-api] migração v5: ' . $e->getMessage()); }
        }

        if ($current < 6) {
            // Mensagens: origem do formulário (site = Contato, embrapii = página EMBRAPII)
            // e os campos extras do formulário da EMBRAPII.
            $addCol('leads', 'source', "VARCHAR(20) NOT NULL DEFAULT 'site'");
            $addCol('leads', 'empresa', 'VARCHAR(120) NULL');
            $addCol('leads', 'cargo', 'VARCHAR(120) NULL');
        }

        $pdo->prepare("INSERT INTO page_configs (page_key, config_json) VALUES ('_schema', ?)
                       ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)")
            ->execute([json_encode(['version' => SIF_SCHEMA_VERSION, 'applied_at' => date('c')])]);
    } catch (Throwable $e) {
        error_log('[sif-api] migração do banco falhou: ' . $e->getMessage());
    }
}

// ---------------------------------------------------------------- 1d) segurança de arquivos e HTML
// Apaga um arquivo SÓ se ele estiver dentro de sif-api/uploads/ ou banners/ (caminhos
// vindos do banco/formulário nunca apagam código ou configuração).
function sif_safe_unlink(?string $path): bool {
    if (!is_string($path) || $path === '' || strpos($path, '..') !== false) return false;
    $path = ltrim(str_replace('\\', '/', $path), '/');
    // Só dentro de uploads/ ou banners/ (imagens dos banners da Home)
    $base = strpos($path, 'uploads/') === 0 ? 'uploads' : (strpos($path, 'banners/') === 0 ? 'banners' : null);
    if ($base === null) return false;
    $root = realpath(__DIR__ . '/' . $base);
    $real = realpath(__DIR__ . '/' . $path);
    if (!$root || !$real || !is_file($real)) return false;
    $root = rtrim(str_replace('\\', '/', $root), '/') . '/';
    if (strpos(str_replace('\\', '/', $real), $root) !== 0) return false;
    return @unlink($real);
}

// Limpa HTML vindo do editor: tira <script>, <style>, eventos (onclick...),
// links javascript: e iframes que não sejam de YouTube/Vimeo.
function sif_clean_html(?string $html): string {
    $html = (string)$html;
    if ($html === '' || !preg_match('#<\s*/?[a-z!][^>]*>#i', $html)) return $html; // texto sem tag fica como está
    if (!class_exists('DOMDocument')) {
        // Sem a extensão DOM: limpeza básica por expressão regular
        $html = preg_replace('#<(script|style|object|embed|form|meta|link|base)\b[^>]*>.*?</\1\s*>#is', '', $html);
        $html = preg_replace('#<(script|style|object|embed|form|meta|link|base)\b[^>]*/?>#is', '', $html);
        $html = preg_replace('#\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)#i', '', $html);
        return preg_replace('#(href|src|xlink:href|action|formaction)\s*=\s*(["\']?)\s*(javascript|vbscript|data):#i', '$1=$2#', $html);
    }
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="__sif">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    $xp = new DOMXPath($doc);
    foreach (iterator_to_array($xp->query('//script|//style|//object|//embed|//form|//meta|//link|//base|//svg|//math')) as $n) $n->parentNode->removeChild($n);
    foreach (iterator_to_array($xp->query('//iframe')) as $n) {
        $src = $n->getAttribute('src');
        if (!preg_match('#^(https?:)?//((www|m)\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be|player\.vimeo\.com|vimeo\.com)/#i', $src)) $n->parentNode->removeChild($n);
    }
    foreach (iterator_to_array($xp->query('//@*')) as $attr) {
        $name = strtolower($attr->nodeName);
        $val = strtolower(preg_replace('/[\s\x00-\x1f]+/', '', $attr->nodeValue));
        if (strpos($name, 'on') === 0 || $name === 'srcdoc' || $name === 'style' && preg_match('/expression|url\s*\(\s*["\']?\s*javascript/i', $attr->nodeValue)
            || (in_array($name, ['href', 'src', 'xlink:href', 'action', 'formaction', 'poster', 'background'], true) && preg_match('/^(javascript|vbscript|data:text)/', $val))) {
            $attr->ownerElement->removeAttributeNode($attr);
        }
    }
    $root = $doc->getElementById('__sif');
    $out = '';
    if ($root) foreach ($root->childNodes as $c) $out .= $doc->saveHTML($c);
    return $out;
}

// Aplica sif_clean_html em todos os textos com HTML de uma estrutura (JSON das seções)
function sif_clean_deep($v) {
    if (is_array($v)) { foreach ($v as $k => $x) $v[$k] = sif_clean_deep($x); return $v; }
    return (is_string($v) && preg_match('#<\s*/?[a-z!][^>]*>#i', $v)) ? sif_clean_html($v) : $v;
}

// Mesmo, para um JSON em texto (extra_data, content_json)
function sif_clean_json(?string $json): ?string {
    if ($json === null || $json === '') return $json;
    $d = json_decode($json, true);
    if (!is_array($d)) return $json;
    return json_encode(sif_clean_deep($d), JSON_UNESCAPED_UNICODE);
}

// ---------------------------------------------------------------- 1e) tentativas (força bruta / spam)
// Conta tentativas recentes por tipo + identificador (e-mail, IP).
function sif_attempts(PDO $pdo, string $kind, string $ident, int $minutes): int {
    try {
        $st = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE kind = ? AND ident = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)");
        $st->execute([$kind, substr($ident, 0, 190), $minutes]);
        return (int)$st->fetchColumn();
    } catch (Throwable $e) { return 0; } // tabela ainda não existe: não bloqueia
}
function sif_attempt_add(PDO $pdo, string $kind, string $ident): void {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (id INT AUTO_INCREMENT PRIMARY KEY, kind VARCHAR(20) NOT NULL, ident VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, INDEX idx_login_attempts (kind, ident, created_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (Throwable $e) {}
    try {
        $pdo->prepare("INSERT INTO login_attempts (kind, ident, created_at) VALUES (?, ?, NOW())")->execute([$kind, substr($ident, 0, 190)]);
        if (random_int(1, 50) === 1) $pdo->exec("DELETE FROM login_attempts WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)");
    } catch (Throwable $e) {}
}
function sif_attempts_clear(PDO $pdo, string $kind, string $ident): void {
    try { $pdo->prepare("DELETE FROM login_attempts WHERE kind = ? AND ident = ?")->execute([$kind, substr($ident, 0, 190)]); } catch (Throwable $e) {}
}
function sif_client_ip(): string { return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'); }

// ---------------------------------------------------------------- 2) login para gravar
// ---------------------------------------------------------------- 3) usuários e permissões
// Perfis:  admin  → tudo, inclusive cadastrar usuários
//          editor → só os módulos marcados no cadastro (coluna modules)
// Responsável por GT (coluna gt_ids): pode publicar no blog dos seus grupos,
// mesmo sem o módulo "blog" completo. Ver sif_blog_* no blog.php.
const SIF_MODULES = [
    'leads', 'leads_embrapii', 'candidates', 'banners', 'jobs', 'blog', 'eventos', 'treinamentos',
    'gt', 'projetos', 'embrapii', 'home', 'institucional', 'associadas',
    'produtos', 'in_company', 'contato', 'rodape', 'eincol',
];

function sif_json_list($v): array {
    $a = is_array($v) ? $v : json_decode((string)$v, true);
    return is_array($a) ? array_values($a) : [];
}

// Usuário logado (lido do banco a cada pedido: desativar/alterar vale na hora).
function sif_user(bool $refresh = false): ?array {
    static $cache = null; // só guarda quando achou (o login cria a sessão no meio do pedido)
    if ($refresh) $cache = null;
    if ($cache !== null) return $cache;
    if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['admin_id'])) return null;
    global $pdo;
    if (!isset($pdo)) return null;
    $st = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
    $st->execute([(int)$_SESSION['admin_id']]);
    $u = $st->fetch(PDO::FETCH_ASSOC);
    if (!$u || (isset($u['active']) && (int)$u['active'] !== 1)) return null;
    $cache = [
        'id'      => (int)$u['id'],
        'email'   => $u['email'],
        'name'    => $u['name'] ?? '',
        'cargo'   => $u['cargo'] ?? '',
        'role'    => ($u['role'] ?? 'editor') === 'admin' ? 'admin' : 'editor', // valor estranho = editor (nunca admin)
        'modules' => array_values(array_intersect(sif_json_list($u['modules'] ?? null), SIF_MODULES)),
        'gt_ids'  => array_map('intval', sif_json_list($u['gt_ids'] ?? null)),
    ];
    return $cache;
}

function sif_is_admin(): bool { return sif_user() !== null; }               // = está logado no painel
function sif_is_superadmin(): bool { $u = sif_user(); return $u && $u['role'] === 'admin'; }
function sif_can(string $module): bool {
    $u = sif_user();
    if (!$u) return false;
    return $u['role'] === 'admin' || in_array($module, $u['modules'], true);
}
function sif_deny(string $msg = 'Seu usuário não tem permissão para alterar esta área do painel. Fale com um administrador.'): void {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'sem_permissao', 'message' => $msg]);
    exit;
}
function sif_require(string $module): void { if (!sif_can($module)) sif_deny(); }

// ---------------------------------------------------------------- 3b) responsável por GT
// Cada GT tem UM responsável (gt.responsavel_id), que é um usuário do painel.
// admins.gt_ids é a lista espelhada (usada nas permissões do blog e do GT).
// Estas funções mantêm as duas coisas sempre iguais.
function sif_gt_can_edit($gtId): bool {
    $u = sif_user();
    if (!$u) return false;
    return sif_can('gt') || ($gtId && in_array((int)$gtId, $u['gt_ids'], true));
}

// Define (ou tira, com null) o responsável de um GT.
function sif_gt_set_responsavel(PDO $pdo, int $gtId, ?int $userId): void {
    $pdo->prepare("UPDATE gt SET responsavel_id = ? WHERE id = ?")->execute([$userId ?: null, $gtId]);
    // Tira o GT de quem tinha e coloca no novo responsável
    foreach ($pdo->query("SELECT id, gt_ids FROM admins")->fetchAll(PDO::FETCH_ASSOC) as $a) {
        $ids = array_map('intval', sif_json_list($a['gt_ids']));
        $has = in_array($gtId, $ids, true);
        $want = $userId && (int)$a['id'] === $userId;
        if ($has === $want) continue;
        $ids = $want ? array_merge($ids, [$gtId]) : array_values(array_diff($ids, [$gtId]));
        $pdo->prepare("UPDATE admins SET gt_ids = ? WHERE id = ?")->execute([json_encode(array_values(array_unique($ids))), (int)$a['id']]);
    }
}

// Tela Usuários mudou os GTs de alguém: o GT passa a ter essa pessoa como responsável
// (e sai de quem tinha); GT desmarcado fica sem responsável.
function sif_gt_sync_user(PDO $pdo, int $userId, array $gtIds, array $oldIds = []): void {
    foreach (array_diff($gtIds, $oldIds) as $g) sif_gt_set_responsavel($pdo, (int)$g, $userId);
    foreach (array_diff($oldIds, $gtIds) as $g) {
        $pdo->prepare("UPDATE gt SET responsavel_id = NULL WHERE id = ? AND responsavel_id = ?")->execute([(int)$g, $userId]);
    }
}

// Dados públicos do responsável (card da página do GT).
function sif_gt_public_profile(array $a): array {
    return [
        'id'         => (int)$a['id'],
        'name'       => $a['name'] ?? '',
        'role'       => $a['cargo'] ?? '',
        'email'      => ($a['contact_email'] ?? '') !== '' ? $a['contact_email'] : ($a['email'] ?? ''),
        'whatsapp'   => $a['whatsapp'] ?? '',
        'photo'      => $a['photo'] ?? '',
        'link'       => $a['link'] ?? '',
        'link_label' => $a['link_label'] ?? '',
    ];
}

// Página (page_configs) → módulo que pode editá-la
function sif_page_module(string $page): ?string {
    $map = [
        'home' => 'home', 'associadas' => 'associadas', 'produtos' => 'produtos',
        'contato' => 'contato', 'footer' => 'rodape', 'embrapii' => 'embrapii',
        'eventos' => 'eventos', 'treinamentos' => 'treinamentos', 'gt' => 'gt',
        'projetos' => 'projetos', 'jobs' => 'jobs', 'blog' => 'blog',
        'treinamentos_in_company' => 'in_company', 'in_company' => 'in_company',
    ];
    return $map[$page] ?? null; // desconhecida → só admin
}

$sif_public_scripts = ['login_admin.php', 'leads.php', 'candidates.php', 'session.php'];
$sif_script = basename($_SERVER['SCRIPT_FILENAME'] ?? '');
$sif_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$sif_is_write = !in_array($sif_method, ['GET', 'HEAD', 'OPTIONS'], true);

// Gravações só a partir do próprio site (ou do ambiente local de desenvolvimento):
// bloqueia formulários de outros sites enviando em nome de quem está logado.
if ($sif_is_write && !empty($_SERVER['HTTP_ORIGIN'])) {
    $oHost = strtolower((string)parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST));
    $myHost = strtolower(preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
    $isLocal = in_array($myHost, ['localhost', '127.0.0.1'], true);
    $ok = $oHost === $myHost || preg_replace('/^www\./', '', $oHost) === preg_replace('/^www\./', '', $myHost)
        || ($isLocal && in_array($oHost, ['localhost', '127.0.0.1'], true));
    if (!$ok) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'origem_invalida', 'message' => 'Envio recusado: origem não autorizada.']);
        exit;
    }
}

if (!in_array($sif_script, $sif_public_scripts, true)
    && $sif_is_write
    && !sif_is_admin()) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error'   => 'nao_autorizado',
        'message' => 'Sua sessão do painel expirou. Faça login novamente para salvar.',
    ]);
    exit;
}

// Permissão por área. Endpoints que decidem sozinhos (página, blog, leads,
// candidaturas, uploads e usuários) ficam fora deste mapa.
$sif_script_module = [
    'banners.php' => 'banners', 'jobs.php' => 'jobs', 'eventos.php' => 'eventos',
    'treinamentos.php' => 'treinamentos', 'projetos.php' => 'projetos', // gt.php confere sozinho (o responsável edita o próprio GT)
    'faqs.php' => 'home', 'institucional.php' => 'institucional', 'associadas.php' => 'associadas',
    'treinamentos_in_company.php' => 'in_company', 'eincol.php' => 'eincol',
];
// Admin gravando: garante que a estrutura do banco está atualizada ANTES de
// conferir a permissão (1 consulta rápida; os ALTERs só rodam uma vez). Depois
// relê o usuário: antes da migração ele ainda não tinha perfil e módulos.
if (!in_array($sif_method, ['GET', 'HEAD', 'OPTIONS'], true) && sif_is_admin() && isset($pdo)) {
    sif_ensure_schema($pdo);
    sif_user(true);
}
if ($sif_is_write && sif_is_admin() && isset($sif_script_module[$sif_script])) {
    sif_require($sif_script_module[$sif_script]);
}


// SEO: depois de qualquer gravação de conteúdo no painel, atualiza o índice
// usado nas metatags, no sitemap.xml e no llms.txt (roda no fim do pedido).
if (!in_array($sif_method, ['GET', 'HEAD', 'OPTIONS'], true) && sif_is_admin() && isset($pdo)
    && !in_array($sif_script, ['upload.php', 'upload_pdf.php', 'upload_file.php', 'upload_video.php', 'session.php', 'login_admin.php', 'users.php'], true)) {
    register_shutdown_function(function () use ($pdo) {
        require_once __DIR__ . '/seo_lib.php';
        sif_seo_write_cache($pdo);
    });
}
