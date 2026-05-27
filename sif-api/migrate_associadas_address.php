<?php
require_once 'db.php';
header('Content-Type: application/json');
try {
    $pdo->exec("ALTER TABLE associadas ADD COLUMN IF NOT EXISTS address VARCHAR(500) DEFAULT NULL");
    echo json_encode(['success' => true, 'message' => 'Coluna address adicionada (ou ja existia).']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
