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

echo json_encode(['logged' => sif_is_admin()]);
