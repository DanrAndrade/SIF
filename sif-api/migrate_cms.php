<?php
/**
 * Migration CMS — Cria/garante todas as tabelas do sistema configurável.
 * Rodar uma vez: http://localhost/sif-api/migrate_cms.php
 *
 * Tabelas: page_configs, team_members, timeline_items, documents, associadas, faqs.
 * Idempotente: pode rodar várias vezes sem quebrar dados.
 */
require_once 'db.php';
header('Content-Type: application/json');

$migrations = [
    "CREATE TABLE IF NOT EXISTS `page_configs` (
        `id`         INT           NOT NULL AUTO_INCREMENT,
        `page_key`   VARCHAR(100)  NOT NULL,
        `config_json` LONGTEXT     DEFAULT NULL,
        `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `page_key` (`page_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('home', '{}')",
    "INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('institucional_geral', '{}')",
    "INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('produtos', '{}')",

    "CREATE TABLE IF NOT EXISTS `team_members` (
        `id`            INT           NOT NULL AUTO_INCREMENT,
        `group_name`    VARCHAR(150)  NOT NULL,
        `name`          VARCHAR(255)  NOT NULL,
        `role`          VARCHAR(255)  DEFAULT NULL,
        `photo_url`     VARCHAR(500)  DEFAULT NULL,
        `link_whatsapp` VARCHAR(50)   DEFAULT NULL,
        `link_email`    VARCHAR(255)  DEFAULT NULL,
        `sort_order`    INT           DEFAULT 0,
        `active`        TINYINT(1)    DEFAULT 1,
        `created_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_group` (`group_name`),
        KEY `idx_sort`  (`group_name`, `sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "CREATE TABLE IF NOT EXISTS `timeline_items` (
        `id`          INT           NOT NULL AUTO_INCREMENT,
        `year`        VARCHAR(10)   NOT NULL,
        `title`       VARCHAR(255)  NOT NULL,
        `content`     TEXT          DEFAULT NULL,
        `image_url`   VARCHAR(500)  DEFAULT NULL,
        `layout`      ENUM('image-left','image-right') DEFAULT 'image-left',
        `sort_order`  INT           DEFAULT 0,
        `active`      TINYINT(1)    DEFAULT 1,
        PRIMARY KEY (`id`),
        KEY `idx_sort` (`sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "CREATE TABLE IF NOT EXISTS `documents` (
        `id`          INT           NOT NULL AUTO_INCREMENT,
        `page_key`    VARCHAR(100)  NOT NULL,
        `title`       VARCHAR(255)  NOT NULL,
        `description` TEXT          DEFAULT NULL,
        `pdf_url`     VARCHAR(500)  DEFAULT NULL,
        `icon_type`   VARCHAR(50)   DEFAULT 'FileText',
        `sort_order`  INT           DEFAULT 0,
        `active`      TINYINT(1)    DEFAULT 1,
        PRIMARY KEY (`id`),
        KEY `idx_page` (`page_key`),
        KEY `idx_sort` (`page_key`, `sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "CREATE TABLE IF NOT EXISTS `associadas` (
        `id`          INT           NOT NULL AUTO_INCREMENT,
        `name`        VARCHAR(255)  NOT NULL,
        `logo_url`    VARCHAR(500)  DEFAULT NULL,
        `sort_order`  INT           DEFAULT 0,
        `active`      TINYINT(1)    DEFAULT 1,
        `created_at`  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_sort` (`sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // ── FAQs ──────────────────────────────────────────────────
    "CREATE TABLE IF NOT EXISTS `faqs` (
        `id`          INT           NOT NULL AUTO_INCREMENT,
        `page_key`    VARCHAR(100)  NOT NULL DEFAULT 'home',
        `question`    VARCHAR(500)  NOT NULL,
        `answer`      TEXT          DEFAULT NULL,
        `sort_order`  INT           DEFAULT 0,
        `active`      TINYINT(1)    DEFAULT 1,
        PRIMARY KEY (`id`),
        KEY `idx_page` (`page_key`),
        KEY `idx_sort` (`page_key`, `sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
];

$results = [];
foreach ($migrations as $sql) {
    try {
        $pdo->exec($sql);
        $results[] = ['sql' => substr(preg_replace('/\s+/', ' ', $sql), 0, 80) . '...', 'status' => 'ok'];
    } catch (PDOException $e) {
        $results[] = ['sql' => substr($sql, 0, 80) . '...', 'status' => 'error', 'message' => $e->getMessage()];
    }
}

echo json_encode(['results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
