-- ============================================================
-- MIGRAÇÃO SIF — Sincronização Completa do Banco de Dados
-- Execute este script no phpMyAdmin
-- Data: 2026-05-05 (revisão completa)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABELA: jobs — Adiciona campo tipo_vaga se não existir
-- ─────────────────────────────────────────────────────────────
ALTER TABLE `jobs`
  ADD COLUMN IF NOT EXISTS `tipo_vaga` VARCHAR(50) DEFAULT 'Interna'
    COMMENT 'Interna (SIF) ou Externa (Parceiro)' AFTER `active`;

-- ─────────────────────────────────────────────────────────────
-- TABELA: projetos — Garante todas as colunas necessárias
-- ─────────────────────────────────────────────────────────────
ALTER TABLE `projetos`
  ADD COLUMN IF NOT EXISTS `slug`       VARCHAR(255)  DEFAULT NULL  AFTER `id`,
  ADD COLUMN IF NOT EXISTS `title`      VARCHAR(255)  DEFAULT NULL  AFTER `slug`,
  ADD COLUMN IF NOT EXISTS `description` LONGTEXT     DEFAULT NULL  AFTER `title`,
  ADD COLUMN IF NOT EXISTS `tag`        VARCHAR(100)  DEFAULT NULL  AFTER `description`,
  ADD COLUMN IF NOT EXISTS `lab`        VARCHAR(100)  DEFAULT NULL  AFTER `tag`,
  ADD COLUMN IF NOT EXISTS `status`     VARCHAR(50)   DEFAULT 'Em Andamento' AFTER `lab`,
  ADD COLUMN IF NOT EXISTS `data_limite` DATE         DEFAULT NULL  AFTER `status`,
  ADD COLUMN IF NOT EXISTS `link_url`   VARCHAR(500)  DEFAULT NULL  AFTER `data_limite`,
  ADD COLUMN IF NOT EXISTS `image_url`  VARCHAR(500)  DEFAULT NULL  AFTER `link_url`,
  ADD COLUMN IF NOT EXISTS `pdf_url`    VARCHAR(500)  DEFAULT NULL
    COMMENT 'Caminho do PDF do projeto' AFTER `image_url`,
  ADD COLUMN IF NOT EXISTS `tabs`       LONGTEXT      DEFAULT NULL
    COMMENT 'JSON com abas de conteúdo dinâmicas' AFTER `pdf_url`,
  ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP AFTER `tabs`;

-- ─────────────────────────────────────────────────────────────
-- TABELA: eventos — Garante colunas time e extra_data
-- ─────────────────────────────────────────────────────────────
ALTER TABLE `eventos`
  ADD COLUMN IF NOT EXISTS `time`       VARCHAR(100) DEFAULT NULL
    COMMENT 'Horário do evento (ex: 08h00 – 18h00)' AFTER `date`,
  ADD COLUMN IF NOT EXISTS `extra_data` LONGTEXT     DEFAULT NULL
    COMMENT 'JSON com abas, PDFs e outros dados extras' AFTER `video_url`;

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES ÚNICOS — Evita slugs duplicados
-- ─────────────────────────────────────────────────────────────
-- Projetos: índice único no slug (ignora erro se já existir)
SET @projetos_slug_exists = (
  SELECT COUNT(1) FROM information_schema.STATISTICS
  WHERE table_schema = DATABASE()
    AND table_name = 'projetos'
    AND index_name = 'slug'
);
SET @sql = IF(
  @projetos_slug_exists = 0,
  'ALTER TABLE projetos ADD UNIQUE INDEX `slug` (`slug`)',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ─────────────────────────────────────────────────────────────
-- VERIFICAÇÃO FINAL — Confirmar estrutura das tabelas
-- ─────────────────────────────────────────────────────────────
DESCRIBE `jobs`;
DESCRIBE `projetos`;
DESCRIBE `eventos`;
