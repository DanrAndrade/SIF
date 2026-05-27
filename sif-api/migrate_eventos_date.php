<?php
require_once 'db.php';
header('Content-Type: application/json');
try {
    $pdo->exec("ALTER TABLE eventos ADD COLUMN IF NOT EXISTS event_date DATE DEFAULT NULL");
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
