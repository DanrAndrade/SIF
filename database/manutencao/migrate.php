<?php
/**
 * Migration: Add 'active' column to content tables
 * Run once: http://localhost/sif-api/migrate.php
 *
 * Adds a publish/active toggle to eventos, treinamentos, gt, projetos, blog_posts.
 * Existing records get active = 1 (published) by default.
 */
require_once 'db.php';
header('Content-Type: application/json');

$migrations = [
    "ALTER TABLE eventos        ADD COLUMN IF NOT EXISTS active     TINYINT(1) NOT NULL DEFAULT 1",
    "ALTER TABLE treinamentos   ADD COLUMN IF NOT EXISTS active     TINYINT(1) NOT NULL DEFAULT 1",
    "ALTER TABLE gt             ADD COLUMN IF NOT EXISTS active     TINYINT(1) NOT NULL DEFAULT 1",
    "ALTER TABLE projetos       ADD COLUMN IF NOT EXISTS active     TINYINT(1) NOT NULL DEFAULT 1",
    "ALTER TABLE blog_posts     ADD COLUMN IF NOT EXISTS active     TINYINT(1) NOT NULL DEFAULT 1",
    "ALTER TABLE blog_posts     ADD COLUMN IF NOT EXISTS extra_data TEXT NULL",
    "ALTER TABLE gt             ADD COLUMN IF NOT EXISTS extra_data TEXT NULL",
    "ALTER TABLE treinamentos   ADD COLUMN IF NOT EXISTS extra_data TEXT NULL",
    "ALTER TABLE projetos       ADD COLUMN IF NOT EXISTS extra_data TEXT NULL",
];

$results = [];
foreach ($migrations as $sql) {
    try {
        $pdo->exec($sql);
        $results[] = ['sql' => $sql, 'status' => 'ok'];
    } catch (PDOException $e) {
        $results[] = ['sql' => $sql, 'status' => 'error', 'message' => $e->getMessage()];
    }
}

echo json_encode(['results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
