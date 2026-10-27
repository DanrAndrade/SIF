<?php
/**
 * Estado da sessão do painel.
 *   GET  /session.php              → {"logged": true|false}  (também mantém a sessão viva)
 *   POST /session.php  _action=logout → encerra a sessão
 */
require_once 'db.php';
require_once 'api_guard.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['_action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

// Admin abrindo o painel: aplica ajustes pendentes na estrutura do banco
if (sif_is_admin()) { sif_ensure_schema($pdo); sif_user(true); } // relê o perfil depois da migração

$me = sif_user();
if ($me) {
    // Tem post do blog em que aparece como responsável? (libera a aba Blog)
    try {
        $st = $pdo->query("SELECT responsavel_ids FROM blog_posts WHERE responsavel_ids IS NOT NULL AND responsavel_ids <> ''");
        $me['blog_author'] = false;
        foreach ($st->fetchAll(PDO::FETCH_COLUMN) as $ids) {
            if (in_array($me['id'], array_map('intval', sif_json_list($ids)), true)) { $me['blog_author'] = true; break; }
        }
    } catch (Throwable $e) { $me['blog_author'] = false; }
}
echo json_encode(['logged' => $me !== null, 'user' => $me]);
