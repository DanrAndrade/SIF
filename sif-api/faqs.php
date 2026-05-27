<?php
/**
 * FAQs CRUD por page_key
 *  GET    /faqs.php?page_key=home              → lista
 *  POST   /faqs.php                            → cria (question, answer, page_key)
 *  PUT    /faqs.php  (FormData _method=PUT)    → atualiza (id + campos)
 *  DELETE /faqs.php?id=N                       → remove
 */
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $pageKey = trim($_GET['page_key'] ?? 'home');
    $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';

    $sql  = "SELECT * FROM faqs WHERE page_key = ?";
    $sql .= $activeOnly ? " AND active = 1" : "";
    $sql .= " ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$pageKey]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST' && empty($_POST['_method'])) {
    $pageKey  = trim($_POST['page_key'] ?? 'home');
    $question = trim($_POST['question'] ?? '');
    $answer   = trim($_POST['answer'] ?? '');

    if (!$question) {
        http_response_code(400);
        echo json_encode(['error' => 'Pergunta é obrigatória.']);
        exit;
    }

    $maxOrder = $pdo->prepare("SELECT COALESCE(MAX(sort_order),0) FROM faqs WHERE page_key = ?");
    $maxOrder->execute([$pageKey]);
    $maxOrder = $maxOrder->fetchColumn();

    $stmt = $pdo->prepare("INSERT INTO faqs (page_key, question, answer, sort_order, active) VALUES (?, ?, ?, ?, 1)");
    $stmt->execute([$pageKey, $question, $answer, $maxOrder + 1]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
    $id = intval($_POST['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID inválido.']);
        exit;
    }

    $fields = [];
    $values = [];
    foreach (['question', 'answer', 'page_key'] as $f) {
        if (isset($_POST[$f])) { $fields[] = "$f = ?"; $values[] = trim($_POST[$f]); }
    }
    if (isset($_POST['active']))     { $fields[] = 'active = ?';     $values[] = intval($_POST['active']); }
    if (isset($_POST['sort_order'])) { $fields[] = 'sort_order = ?'; $values[] = intval($_POST['sort_order']); }

    if (!empty($fields)) {
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE faqs SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID inválido.']); exit; }
    $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
