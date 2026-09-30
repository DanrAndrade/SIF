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
 * 2) EXIGE LOGIN DO PAINEL para qualquer gravação (POST/PUT/DELETE).
 *    Leitura (GET) continua pública, pois o site precisa dela.
 *    Exceções: login e os formulários públicos (contato e candidatura),
 *    que já checam o login sozinhos nas partes restritas.
 */

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

// ---------------------------------------------------------------- 2) login para gravar
function sif_is_admin(): bool {
    return !empty($_SESSION['admin_logged_in']);
}

$sif_public_scripts = ['login_admin.php', 'leads.php', 'candidates.php', 'session.php'];
$sif_script = basename($_SERVER['SCRIPT_FILENAME'] ?? '');
$sif_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (!in_array($sif_script, $sif_public_scripts, true)
    && !in_array($sif_method, ['GET', 'HEAD', 'OPTIONS'], true)
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
