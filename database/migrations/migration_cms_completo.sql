-- ============================================================
-- MIGRAÇÃO SIF — CMS Completo (Todas as Páginas Editáveis)
-- Execute este script no phpMyAdmin (banco: sif_db)
-- Data: 2026-05-11
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABELA: page_configs
-- Configs genéricas de páginas (home, produtos, etc.)
-- Chave: page_key (ex: 'home', 'produtos', 'associadas')
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `page_configs` (
  `id`         INT           NOT NULL AUTO_INCREMENT,
  `page_key`   VARCHAR(100)  NOT NULL,
  `config_json` LONGTEXT     DEFAULT NULL COMMENT 'JSON com todo o conteúdo da página',
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_key` (`page_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir registros iniciais (se não existirem)
INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('home', '{}');
INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('produtos', '{}');
INSERT IGNORE INTO `page_configs` (`page_key`, `config_json`) VALUES ('institucional_geral', '{}');

-- ─────────────────────────────────────────────────────────────
-- TABELA: team_members
-- Membros da equipe (Nossa Gente — Institucional)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `team_members` (
  `id`            INT           NOT NULL AUTO_INCREMENT,
  `group_name`    VARCHAR(150)  NOT NULL COMMENT 'Ex: Diretoria, Coordenadoras, Coord. de CSC',
  `name`          VARCHAR(255)  NOT NULL,
  `role`          VARCHAR(255)  DEFAULT NULL,
  `photo_url`     VARCHAR(500)  DEFAULT NULL,
  `link_whatsapp` VARCHAR(50)   DEFAULT NULL COMMENT 'Número do WhatsApp (somente dígitos)',
  `link_email`    VARCHAR(255)  DEFAULT NULL,
  `sort_order`    INT           DEFAULT 0,
  `active`        TINYINT(1)    DEFAULT 1,
  `created_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_name`),
  KEY `idx_sort`  (`group_name`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- TABELA: timeline_items
-- Marcos históricos (Institucional — Linha do Tempo)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `timeline_items` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados iniciais da linha do tempo
INSERT IGNORE INTO `timeline_items` (`id`, `year`, `title`, `content`, `image_url`, `layout`, `sort_order`, `active`) VALUES
(1, '1974', 'A <span class="text-[#007a3d]">Fundação</span>', 'Criação da SIF através da união entre a UFV e as principais empresas florestais do país, estabelecendo um modelo inédito de parceria universidade-empresa no Brasil.', 'https://images.unsplash.com/photo-1581093806997-124204d9ad9d?q=80&w=2670', 'image-left', 1, 1),
(2, '1975', 'Revista <span class="text-[#007a3d]">Árvore</span>', 'Lançamento da Revista Árvore, que se consolidaria como um dos principais periódicos científicos do setor, democratizando o conhecimento gerado em âmbito acadêmico.', 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2670', 'image-right', 2, 1),
(3, '2020', 'Unidade <span class="text-[#007a3d]">EMBRAPII</span>', 'O credenciamento do Departamento de Engenharia Florestal da UFV como Unidade EMBRAPII Fibras Florestais, sob gestão da SIF, potencializou o aporte de recursos para projetos de alta densidade tecnológica.', 'https://images.unsplash.com/photo-1532187875605-1838d7370324?q=80&w=2670', 'image-left', 3, 1),
(4, '2021', 'Expansão e <span class="text-[#007a3d]">Startups</span>', 'Início do Ciclo 2 da EMBRAPII, ampliando a atuação da SIF para o suporte a startups e a inserção de novos produtos tecnológicos no mercado.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670', 'image-right', 4, 1),
(5, '2024', 'O <span class="text-[#007a3d]">Cinquentenário</span>', 'Celebração de 50 anos de história, marcando a maturidade institucional e a renovação dos compromissos com a inovação sustentável e o setor produtivo nacional.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2674', 'image-left', 5, 1);

-- ─────────────────────────────────────────────────────────────
-- TABELA: documents
-- PDFs e documentos por página (Institucional — Estatutos)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `documents` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `page_key`    VARCHAR(100)  NOT NULL COMMENT 'Ex: institucional, eincol',
  `title`       VARCHAR(255)  NOT NULL,
  `description` TEXT          DEFAULT NULL,
  `pdf_url`     VARCHAR(500)  DEFAULT NULL,
  `icon_type`   VARCHAR(50)   DEFAULT 'FileText' COMMENT 'Ícone Lucide a usar',
  `sort_order`  INT           DEFAULT 0,
  `active`      TINYINT(1)    DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_key`),
  KEY `idx_sort` (`page_key`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir documentos iniciais
INSERT IGNORE INTO `documents` (`id`, `page_key`, `title`, `description`, `pdf_url`, `icon_type`, `sort_order`, `active`) VALUES
(1, 'institucional', 'Estatuto Social SIF', 'O alicerce da nossa Governança', '/docs/estatutosif.pdf', 'Scale', 1, 1),
(2, 'institucional', 'Código de Conduta e Ética', 'Regulamento interno de conduta', '/docs/Codigo-de-Conduta-e-Etica-SIF-2022.pdf', 'FileBadge', 2, 1),
(3, 'institucional', 'Declaração Anticorrupção e Antifraude', 'Compromisso com a ética', '/docs/Dec_Anticorrup_Antifraude_SIF.pdf', 'Shield', 3, 1),
(4, 'institucional', 'Regulamento de Bolsa 2024', 'Normas para concessão de bolsas', '/docs/REGULAMENTO-DE-BOLSA-2024-1.pdf', 'FileText', 4, 1),
(5, 'institucional', 'Regulamento de Aquisições e Contratações 2024', 'Procedimentos de compras', '/docs/REGULAMENTO-PARA-AQUISICOES-E-CONTRATACOES-2024-1.pdf', 'FileText', 5, 1);

-- ─────────────────────────────────────────────────────────────
-- TABELA: associadas
-- Empresas parceiras / logos
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `associadas` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)  NOT NULL,
  `logo_url`    VARCHAR(500)  DEFAULT NULL,
  `sort_order`  INT           DEFAULT 0,
  `active`      TINYINT(1)    DEFAULT 1,
  `created_at`  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- VERIFICAÇÃO FINAL
-- ─────────────────────────────────────────────────────────────
SHOW TABLES;
SELECT 'Migração concluída com sucesso!' AS status;
