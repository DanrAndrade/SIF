
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin@sif.org.br','$2y$10$z0UEEeUif4pACcL1QAZ/mOAcj23Wey1LviP2dHrfvWxtnY7aPHg/i');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `associadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `associadas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `associadas` WRITE;
/*!40000 ALTER TABLE `associadas` DISABLE KEYS */;
INSERT INTO `associadas` VALUES (1,'Suzano','/logos/SUZANO-HORIZONTAL-LOGO-200x53.png',1,1,'2026-05-17 23:12:18',''),(3,'Gerdau','/logos/GERDAU-LOGO-HORIZONTAL-200x113.png',3,1,'2026-05-17 23:12:18',NULL),(5,'ArcelorMittal','/logos/ARCELORMITTAL-LOGO-200x113.png',4,1,'2026-05-17 23:12:18',NULL),(7,'Cenibra','/logos/CENIBRA-LOGO-200x198.png',5,1,'2026-05-17 23:12:18',NULL),(9,'Veracel','/logos/VERACEL-LOGO-200x73.png',6,1,'2026-05-17 23:12:18',NULL),(11,'Aperam','/logos/APERAM-LOGO-200x113.png',7,1,'2026-05-17 23:12:18',NULL),(12,'Bracell','/logos/bracell-logo-200x45.png',8,1,'2026-05-17 23:12:18',NULL),(13,'Vallourec','/logos/VALLOUREC-LOGO-200x47.png',9,1,'2026-05-17 23:12:18',NULL),(15,'Arauco','/logos/ARAUCO-LOGO-200x37.png',11,1,'2026-05-17 23:12:18',NULL),(16,'CMPC','/logos/Logo-CMPC-1024x496.png',12,1,'2026-05-17 23:12:18',NULL),(21,'Smurfit Westrock','/logos/SMURFIT-WESTROCK-1.png',16,1,'2026-05-17 23:12:18',NULL),(23,'Dexco','/logos/logo-dexco.jpg',18,1,'2026-05-17 23:12:18',NULL),(24,'LD Celulose','/logos/LD-CELULOSE-1.png',19,1,'2026-05-17 23:12:18',NULL),(25,'Agropalma','/logos/Agropalma-Logo.png',20,1,'2026-05-17 23:12:18',NULL),(28,'Bunge','/logos/Bunge-Logo-200x46.png',23,1,'2026-05-17 23:12:18',NULL),(29,'ArborGen','/logos/ArborGen-2021-Logo-with-Tagline-SMALL-200x145.png',24,1,'2026-05-17 23:12:18',NULL),(32,'Placas do Brasil','/logos/Placas-Do-Brasil-LOGO-200x67.png',27,1,'2026-05-17 23:12:18',NULL),(35,'Paracel','/logos/PARACEL-LOGO-200x47.png',29,1,'2026-05-17 23:12:18',NULL),(37,'Montes del Plata','/logos/Logo-Montes-del-Plata-200x100.png',30,1,'2026-05-17 23:12:18',NULL),(38,'Sinobras','/logos/SINOBRAS-LOGO-200x71.png',31,1,'2026-05-17 23:12:18',NULL),(39,'Vetorial','/logos/Vetorial-Logo-200x113.png',32,1,'2026-05-17 23:12:18',NULL),(42,'Metal Sider','/logos/Metal-Sider-Logo-200x113.png',35,1,'2026-05-17 23:12:18',NULL),(44,'Grupo Maringá','/logos/GRUPO-MARINGA-LOGO-200x112.png',37,1,'2026-05-17 23:12:18',NULL),(46,'Grupo Index','/logos/GRUPO-INDEX-LOGO-200x78.png',38,1,'2026-05-17 23:12:18',NULL),(48,'Deforsa','/logos/DEFORSA-LOGO-200x228.png',39,1,'2026-05-17 23:12:18',NULL),(49,'Concrem','/logos/CONCREM.png',40,1,'2026-05-17 23:12:18',NULL),(51,'The Forest Company','/logos/THE-FOREST-COMPANY.png',42,1,'2026-05-17 23:12:18',NULL),(52,'Pan Bioenergia','/logos/PAN-BIOENERGIA.png',43,1,'2026-05-17 23:12:19',NULL),(58,'Klabin','uploads/pages/associadas/logos/1779454060_11cd4da506a5.png',49,1,'2026-05-18 14:23:03',NULL);
/*!40000 ALTER TABLE `associadas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (13,NULL,'banners/banner_1779064089_4561.png','https://www.youtube.com/watch?v=1sCu2RgmXDo',1,'2026-02-08 14:17:59'),(15,NULL,'banners/banner_1779064326_5710.jpg','',1,'2026-05-18 00:32:06'),(16,NULL,'banners/banner_1779064417_6615.png','',1,'2026-05-18 00:32:41');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `audio_link` varchar(255) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tags` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `extra_data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `job_title` varchar(150) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `cv_filename` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('unread','viewed') DEFAULT 'unread',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(100) NOT NULL COMMENT 'Ex: institucional, eincol',
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `icon_type` varchar(50) DEFAULT 'FileText' COMMENT '??cone Lucide a usar',
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_key`),
  KEY `idx_sort` (`page_key`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'institucional','Estatuto Social SIF','O alicerce da nossa Governan??a','/docs/estatutosif.pdf','Scale',1,1),(2,'institucional','C??digo de Conduta e ??tica','Regulamento interno de conduta','/docs/Codigo-de-Conduta-e-Etica-SIF-2022.pdf','FileBadge',2,1),(3,'institucional','Declara????o Anticorrup????o e Antifraude','Compromisso com a ??tica','/docs/Dec_Anticorrup_Antifraude_SIF.pdf','Shield',3,1),(4,'institucional','Regulamento de Bolsa 2024','Normas para concess??o de bolsas','/docs/REGULAMENTO-DE-BOLSA-2024-1.pdf','FileText',4,1),(5,'institucional','Regulamento de Aquisi????es e Contrata????es 2024','Procedimentos de compras','/docs/REGULAMENTO-PARA-AQUISICOES-E-CONTRATACOES-2024-1.pdf','FileText',5,1);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `eincol_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eincol_config` (
  `id` int(11) NOT NULL DEFAULT 1,
  `hero_image` varchar(500) DEFAULT NULL,
  `hero_title` varchar(255) DEFAULT 'EINCOL',
  `hero_subtitle` text DEFAULT NULL,
  `main_content` longtext DEFAULT NULL,
  `render_image` varchar(500) DEFAULT NULL,
  `planta_image` varchar(500) DEFAULT NULL,
  `planta_url` varchar(500) DEFAULT NULL,
  `pdf1_url` varchar(500) DEFAULT NULL,
  `pdf1_title` varchar(255) DEFAULT NULL,
  `pdf2_url` varchar(500) DEFAULT NULL,
  `pdf2_title` varchar(255) DEFAULT NULL,
  `pdf3_url` varchar(500) DEFAULT NULL,
  `pdf3_title` varchar(255) DEFAULT NULL,
  `tabs_json` longtext DEFAULT NULL,
  `sections_json` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `eincol_config` WRITE;
/*!40000 ALTER TABLE `eincol_config` DISABLE KEYS */;
INSERT INTO `eincol_config` VALUES (1,'uploads/eincol/hero/1779806426_8fcf451090fd.jpg','EINCOL 2026 ','Encontro Nacional do Setor Florestal ','<h2 class=\"ql-align-justify\">Sobre&nbsp;o&nbsp;Evento&nbsp;</h2><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\">O&nbsp;setor&nbsp;florestal&nbsp;vem&nbsp;ganhando&nbsp;cada&nbsp;vez&nbsp;mais&nbsp;destaque&nbsp;no&nbsp;cenário&nbsp;econômico&nbsp;e&nbsp;ambiental,&nbsp;e&nbsp;eventos&nbsp;voltados&nbsp;a&nbsp;essa&nbsp;área&nbsp;se&nbsp;tornam&nbsp;espaços&nbsp;estratégicos&nbsp;para&nbsp;troca&nbsp;de&nbsp;conhecimento&nbsp;e&nbsp;inovação.&nbsp;Um&nbsp;exemplo&nbsp;disso&nbsp;é&nbsp;o&nbsp;Encontro&nbsp;Nacional&nbsp;do&nbsp;Setor&nbsp;Florestal,&nbsp;um&nbsp;evento&nbsp;que&nbsp;reúne&nbsp;profissionais,&nbsp;pesquisadores,&nbsp;empresas&nbsp;e&nbsp;estudantes&nbsp;interessados&nbsp;no&nbsp;manejo&nbsp;sustentável,&nbsp;na&nbsp;conservação&nbsp;ambiental&nbsp;e&nbsp;nas&nbsp;novas&nbsp;tecnologias&nbsp;aplicadas&nbsp;às&nbsp;florestas.</p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\">Durante&nbsp;o&nbsp;evento,&nbsp;são&nbsp;promovidas&nbsp;palestras,&nbsp;painéis&nbsp;e&nbsp;workshops&nbsp;que&nbsp;abordam&nbsp;temas&nbsp;como&nbsp;reflorestamento,&nbsp;certificação&nbsp;ambiental,&nbsp;uso&nbsp;de&nbsp;recursos&nbsp;naturais&nbsp;de&nbsp;forma&nbsp;responsável&nbsp;e&nbsp;o&nbsp;papel&nbsp;das&nbsp;florestas&nbsp;no&nbsp;combate&nbsp;às&nbsp;mudanças&nbsp;climáticas.&nbsp;Especialistas&nbsp;compartilham&nbsp;experiências&nbsp;práticas&nbsp;e&nbsp;estudos&nbsp;recentes,&nbsp;proporcionando&nbsp;uma&nbsp;visão&nbsp;ampla&nbsp;sobre&nbsp;os&nbsp;desafios&nbsp;e&nbsp;oportunidades&nbsp;do&nbsp;setor.</p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\">Além&nbsp;do&nbsp;conteúdo&nbsp;técnico,&nbsp;o&nbsp;evento&nbsp;também&nbsp;se&nbsp;destaca&nbsp;como&nbsp;uma&nbsp;oportunidade&nbsp;de&nbsp;networking,&nbsp;permitindo&nbsp;a&nbsp;conexão&nbsp;entre&nbsp;diferentes&nbsp;agentes&nbsp;do&nbsp;mercado.&nbsp;Empresas&nbsp;apresentam&nbsp;soluções&nbsp;inovadoras,&nbsp;enquanto&nbsp;instituições&nbsp;discutem&nbsp;políticas&nbsp;públicas&nbsp;e&nbsp;estratégias&nbsp;para&nbsp;o&nbsp;desenvolvimento&nbsp;sustentável.&nbsp;Essa&nbsp;integração&nbsp;fortalece&nbsp;o&nbsp;setor&nbsp;e&nbsp;incentiva&nbsp;a&nbsp;adoção&nbsp;de&nbsp;práticas&nbsp;mais&nbsp;conscientes&nbsp;e&nbsp;eficientes.</p><p class=\"ql-align-justify\"></p><p class=\"ql-align-justify\">Ao&nbsp;final,&nbsp;o&nbsp;encontro&nbsp;reforça&nbsp;a&nbsp;importância&nbsp;da&nbsp;gestão&nbsp;florestal&nbsp;responsável&nbsp;como&nbsp;um&nbsp;caminho&nbsp;essencial&nbsp;para&nbsp;equilibrar&nbsp;crescimento&nbsp;econômico&nbsp;e&nbsp;preservação&nbsp;ambiental.&nbsp;A&nbsp;troca&nbsp;de&nbsp;ideias&nbsp;e&nbsp;experiências&nbsp;contribui&nbsp;para&nbsp;a&nbsp;construção&nbsp;de&nbsp;soluções&nbsp;mais&nbsp;sustentáveis,&nbsp;mostrando&nbsp;que&nbsp;é&nbsp;possível&nbsp;avançar&nbsp;sem&nbsp;comprometer&nbsp;os&nbsp;recursos&nbsp;naturais&nbsp;das&nbsp;futuras&nbsp;gerações.</p>','uploads/eincol/renders/1778077115_caed8bd448d6.png','uploads/eincol/plantas/1779806426_e1e502803c75.jpeg','https://docs.google.com/document/d/1Owb7f8l-GgVFC1ZQsTUbZdgo5Ldy9-p5/edit?usp=drive_web&ouid=100334480382804147586&rtpof=true','uploads/eincol/pdfs/1777989689_708f1726aa64.pdf','teste  ','uploads/eincol/pdfs/1777942476_76b1497f7ca2.pdf','teste 2  ','uploads/eincol/pdfs/1777942476_bbfe9c39a296.pdf','pdf 3 ','[{\"title\":\"Programação 1 \",\"content\":\"<p><strong>Lista&nbsp;com&nbsp;pontos&nbsp;(bullet&nbsp;points):</strong></p><ul><li>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit</li><li>Sed&nbsp;do&nbsp;eiusmod&nbsp;tempor&nbsp;incididunt&nbsp;ut&nbsp;labore&nbsp;et&nbsp;dolore&nbsp;magna&nbsp;aliqua</li><li>Ut&nbsp;enim&nbsp;ad&nbsp;minim&nbsp;veniam</li><li>Quis&nbsp;nostrud&nbsp;exercitation&nbsp;ullamco&nbsp;laboris&nbsp;nisi&nbsp;ut&nbsp;aliquip&nbsp;ex&nbsp;ea&nbsp;commodo&nbsp;consequat&nbsp;</li></ul>\",\"_uid\":\"tab-1778029808432-0\"},{\"title\":\"Programação 2 \",\"content\":\"<p><strong>Lista&nbsp;enumerada:</strong></p><ol><li>Primeiro&nbsp;item&nbsp;com&nbsp;texto&nbsp;de&nbsp;exemplo</li><li>Segundo&nbsp;item&nbsp;demonstrando&nbsp;sequência</li><li>Terceiro&nbsp;item&nbsp;para&nbsp;completar&nbsp;a&nbsp;lista</li><li>Quarto&nbsp;item&nbsp;com&nbsp;mais&nbsp;conteúdo&nbsp;fictício</li></ol><p></p><ul><li>Nunc&nbsp;feugiat&nbsp;mi&nbsp;a&nbsp;tellus&nbsp;consequat&nbsp;imperdiet.&nbsp;Vestibulum&nbsp;sapien.&nbsp;Proin&nbsp;quam.&nbsp;Etiam&nbsp;ultrices.&nbsp;Suspendisse&nbsp;in&nbsp;justo&nbsp;eu&nbsp;magna&nbsp;luctus&nbsp;suscipit.&nbsp;Sed&nbsp;lectus.&nbsp;Integer&nbsp;euismod&nbsp;lacus&nbsp;luctus&nbsp;magna.&nbsp;Quisque&nbsp;cursus,&nbsp;metus&nbsp;vitae&nbsp;pharetra&nbsp;auctor,&nbsp;sem&nbsp;massa&nbsp;mattis&nbsp;sem,&nbsp;at&nbsp;interdum&nbsp;magna&nbsp;augue&nbsp;eget&nbsp;diam.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Morbi&nbsp;lacinia&nbsp;molestie&nbsp;dui.</li></ul><p></p><p>Praesent&nbsp;blandit&nbsp;dolor.&nbsp;Sed&nbsp;non&nbsp;quam.&nbsp;In&nbsp;vel&nbsp;mi&nbsp;sit&nbsp;amet&nbsp;augue&nbsp;congue&nbsp;elementum.&nbsp;Morbi&nbsp;in&nbsp;ipsum&nbsp;sit&nbsp;amet&nbsp;pede&nbsp;facilisis&nbsp;laoreet.&nbsp;Donec&nbsp;lacus&nbsp;nunc,&nbsp;viverra&nbsp;nec.</p>\",\"_uid\":\"tab-1778029808432-1\"},{\"title\":\"Nova aba\",\"content\":\"<p>Pellentesque&nbsp;rhoncus&nbsp;nunc&nbsp;et&nbsp;augue.&nbsp;Integer&nbsp;id&nbsp;felis.&nbsp;Curabitur&nbsp;aliquet&nbsp;pellentesque&nbsp;diam.&nbsp;Integer&nbsp;quis&nbsp;metus&nbsp;vitae&nbsp;elit&nbsp;lobortis&nbsp;egestas.&nbsp;Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetuer&nbsp;adipiscing&nbsp;elit.&nbsp;Morbi&nbsp;vel&nbsp;erat&nbsp;non&nbsp;mauris&nbsp;convallis&nbsp;vehicula.</p><p>Nullam&nbsp;at&nbsp;leo&nbsp;nec&nbsp;metus&nbsp;aliquam&nbsp;semper.&nbsp;Sed&nbsp;ac&nbsp;lacus.&nbsp;Donec&nbsp;volutpat,&nbsp;ligula&nbsp;sit&nbsp;amet&nbsp;hendrerit&nbsp;varius,&nbsp;enim&nbsp;nibh&nbsp;pretium&nbsp;odio,&nbsp;vitae&nbsp;facilisis&nbsp;ligula&nbsp;sapien&nbsp;eget&nbsp;nisl.&nbsp;Integer&nbsp;in&nbsp;mauris&nbsp;eu&nbsp;nibh&nbsp;euismod&nbsp;gravida.&nbsp;Duis&nbsp;ac&nbsp;tellus&nbsp;et&nbsp;risus&nbsp;vulputate&nbsp;vehicula.</p><p>Donec&nbsp;lobortis&nbsp;risus&nbsp;a&nbsp;elit.&nbsp;Etiam&nbsp;tempor.&nbsp;Ut&nbsp;ullamcorper,&nbsp;ligula&nbsp;eu&nbsp;tempor&nbsp;congue,&nbsp;eros&nbsp;est&nbsp;euismod&nbsp;turpis,&nbsp;id&nbsp;tincidunt&nbsp;sapien&nbsp;risus&nbsp;a&nbsp;quam.&nbsp;Maecenas&nbsp;fermentum&nbsp;consequat&nbsp;mi.&nbsp;Donec&nbsp;fermentum.</p><p>Pellentesque&nbsp;malesuada&nbsp;nulla&nbsp;a&nbsp;mi.&nbsp;Duis&nbsp;sapien&nbsp;sem,&nbsp;aliquet&nbsp;nec,&nbsp;commodo&nbsp;eget,&nbsp;consequat&nbsp;quis,&nbsp;neque.&nbsp;Aliquam&nbsp;faucibus,&nbsp;elit&nbsp;ut&nbsp;dictum&nbsp;aliquet,&nbsp;felis&nbsp;nisl&nbsp;adipiscing&nbsp;sapien,&nbsp;sed&nbsp;malesuada&nbsp;diam&nbsp;lacus&nbsp;eget&nbsp;erat.</p><p>Cras&nbsp;mollis&nbsp;scelerisque&nbsp;nunc.&nbsp;Nullam&nbsp;arcu.&nbsp;Aliquam&nbsp;consequat.&nbsp;Curabitur&nbsp;augue&nbsp;lorem,&nbsp;dapibus&nbsp;quis,&nbsp;laoreet&nbsp;et,&nbsp;pretium&nbsp;ac,&nbsp;nisi.&nbsp;Aenean&nbsp;magna&nbsp;nisl,&nbsp;mollis&nbsp;quis,&nbsp;molestie&nbsp;eu,&nbsp;feugiat&nbsp;in,&nbsp;orci.</p><p></p><p></p><p>&nbsp;Donec&nbsp;lobortis&nbsp;risus&nbsp;a&nbsp;elit.&nbsp;Etiam&nbsp;tempor.</p><p></p><p></p><p>Pellentesque&nbsp;malesuada&nbsp;nulla&nbsp;a&nbsp;mi.&nbsp;Duis&nbsp;sapien&nbsp;sem,&nbsp;aliquet&nbsp;nec,&nbsp;commodo&nbsp;eget,&nbsp;consequat&nbsp;quis,&nbsp;neque.&nbsp;Aliquam&nbsp;faucibus,&nbsp;elit&nbsp;ut&nbsp;dictum&nbsp;aliquet,&nbsp;felis&nbsp;nisl&nbsp;adipiscing&nbsp;sapien,&nbsp;sed&nbsp;malesuada&nbsp;diam&nbsp;lacus&nbsp;eget&nbsp;erat.</p><p>Cras&nbsp;mollis&nbsp;scelerisque&nbsp;nunc.&nbsp;Nullam&nbsp;arcu.&nbsp;Aliquam&nbsp;consequat.&nbsp;Curabitur&nbsp;augue&nbsp;lorem,&nbsp;dapibus&nbsp;quis,&nbsp;laoreet&nbsp;et,&nbsp;pretium&nbsp;ac,&nbsp;nisi.&nbsp;Aenean&nbsp;magna&nbsp;nisl,&nbsp;mollis&nbsp;quis,&nbsp;molestie&nbsp;eu,&nbsp;feugiat&nbsp;in,&nbsp;orci.</p>\",\"_uid\":\"tab-1778029808432-2\"}]','[{\"title\":\"Informações Complementares \",\"text\":\"<p class=\\\"ql-align-justify\\\">Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Sed&nbsp;do&nbsp;eiusmod&nbsp;tempor&nbsp;incididunt&nbsp;ut&nbsp;labore&nbsp;et&nbsp;dolore&nbsp;magna&nbsp;aliqua.&nbsp;Ut&nbsp;enim&nbsp;ad&nbsp;minim&nbsp;veniam,&nbsp;quis&nbsp;nostrud&nbsp;exercitation&nbsp;ullamco&nbsp;laboris&nbsp;nisi&nbsp;ut&nbsp;aliquip&nbsp;ex&nbsp;ea&nbsp;commodo&nbsp;consequat.&nbsp;Duis&nbsp;aute&nbsp;irure&nbsp;dolor&nbsp;in&nbsp;reprehenderit&nbsp;in&nbsp;voluptate&nbsp;velit&nbsp;esse&nbsp;cillum&nbsp;dolore&nbsp;eu&nbsp;fugiat&nbsp;nulla&nbsp;pariatur.&nbsp;Excepteur&nbsp;sint&nbsp;occaecat&nbsp;cupidatat&nbsp;non&nbsp;proident,&nbsp;sunt&nbsp;in&nbsp;culpa&nbsp;qui&nbsp;officia&nbsp;deserunt&nbsp;mollit&nbsp;anim&nbsp;id&nbsp;est&nbsp;laborum.Curabitur&nbsp;pretium&nbsp;tincidunt&nbsp;lacus.&nbsp;Nulla&nbsp;gravida&nbsp;orci&nbsp;a&nbsp;odio.&nbsp;Nullam&nbsp;varius,&nbsp;turpis&nbsp;et&nbsp;commodo&nbsp;pharetra,&nbsp;est&nbsp;eros&nbsp;bibendum&nbsp;elit,&nbsp;nec&nbsp;luctus&nbsp;magna&nbsp;felis&nbsp;sollicitudin&nbsp;mauris.&nbsp;Integer&nbsp;in&nbsp;mauris&nbsp;eu&nbsp;nibh&nbsp;euismod&nbsp;gravida.&nbsp;Duis&nbsp;ac&nbsp;tellus&nbsp;et&nbsp;risus&nbsp;vulputate&nbsp;vehicula.&nbsp;Donec&nbsp;lobortis&nbsp;risus&nbsp;a&nbsp;elit.&nbsp;Etiam&nbsp;tempor.&nbsp;Ut&nbsp;ullamcorper,&nbsp;ligula&nbsp;eu&nbsp;tempor&nbsp;congue,&nbsp;eros&nbsp;est&nbsp;euismod&nbsp;turpis,&nbsp;id&nbsp;tincidunt&nbsp;sapien&nbsp;risus&nbsp;a&nbsp;quam.&nbsp;Maecenas&nbsp;fermentum&nbsp;consequat&nbsp;mi.&nbsp;Donec&nbsp;fermentum.&nbsp;Pellentesque&nbsp;malesuada&nbsp;nulla&nbsp;a&nbsp;mi.&nbsp;Duis&nbsp;sapien&nbsp;nunc,&nbsp;commodo&nbsp;et,&nbsp;interdum&nbsp;suscipit,&nbsp;sollicitudin&nbsp;et,&nbsp;dolor.&nbsp;Pellentesque&nbsp;habitant&nbsp;morbi&nbsp;tristique&nbsp;senectus&nbsp;et&nbsp;netus&nbsp;et&nbsp;malesuada&nbsp;fames&nbsp;ac&nbsp;turpis&nbsp;egestas.Aliquam&nbsp;elementum&nbsp;magna&nbsp;eros,&nbsp;ac&nbsp;posuere&nbsp;elit&nbsp;tempus&nbsp;ac.&nbsp;Vivamus&nbsp;eleifend&nbsp;urna&nbsp;nec&nbsp;metus&nbsp;scelerisque,&nbsp;eu&nbsp;feugiat&nbsp;velit&nbsp;convallis.&nbsp;Nam&nbsp;ut&nbsp;mattis&nbsp;eros.</p><p class=\\\"ql-align-justify\\\"></p><p class=\\\"ql-align-justify\\\"><img src=\\\"http://localhost/sif-api/uploads/editor/1779806485_d06274b3d5a03a0f.jpg\\\"></p><p class=\\\"ql-align-justify\\\"></p><p class=\\\"ql-align-justify\\\"></p><p class=\\\"ql-align-justify\\\">Maecenas&nbsp;ac&nbsp;pulvinar&nbsp;lorem.&nbsp;Pellentesque&nbsp;accumsan,&nbsp;massa&nbsp;vel&nbsp;hendrerit&nbsp;interdum,&nbsp;mi&nbsp;ex&nbsp;varius&nbsp;erat,&nbsp;a&nbsp;accumsan&nbsp;eros&nbsp;est&nbsp;ac&nbsp;erat.&nbsp;Suspendisse&nbsp;sit&nbsp;amet&nbsp;vehicula&nbsp;nisi.&nbsp;Mauris&nbsp;hendrerit&nbsp;fringilla&nbsp;risus,&nbsp;egestas&nbsp;pretium&nbsp;tellus.&nbsp;In&nbsp;sed&nbsp;pretium&nbsp;nisl.&nbsp;Sed&nbsp;imperdiet,&nbsp;sem&nbsp;vitae&nbsp;elementum&nbsp;feugiat,&nbsp;erat&nbsp;sem&nbsp;pharetra&nbsp;massa,&nbsp;non&nbsp;venenatis&nbsp;tellus&nbsp;justo&nbsp;quis&nbsp;massa.&nbsp;Proin&nbsp;ut&nbsp;tortor&nbsp;nisl.Nullam&nbsp;ac&nbsp;urna&nbsp;eu&nbsp;felis&nbsp;dapibus&nbsp;condimentum&nbsp;sit&nbsp;amet&nbsp;a&nbsp;augue.&nbsp;Sed&nbsp;non&nbsp;neque&nbsp;elit.&nbsp;Sed&nbsp;ut&nbsp;imperdiet&nbsp;nisi.&nbsp;Proin&nbsp;condimentum&nbsp;fermentum&nbsp;nunc.&nbsp;Etiam&nbsp;pharetra,&nbsp;erat&nbsp;sed&nbsp;fermentum&nbsp;feugiat,&nbsp;velit&nbsp;mauris&nbsp;egestas&nbsp;quam,&nbsp;ut&nbsp;aliquam&nbsp;massa&nbsp;nisl&nbsp;quis&nbsp;neque.&nbsp;Suspendisse&nbsp;in&nbsp;orci&nbsp;enim.&nbsp;Vivamus&nbsp;lacinia&nbsp;sem&nbsp;vitae&nbsp;ante&nbsp;hendrerit,&nbsp;ac&nbsp;interdum&nbsp;neque&nbsp;imperdiet.&nbsp;Pellentesque&nbsp;vel&nbsp;lacus&nbsp;dui.&nbsp;Ut&nbsp;hendrerit&nbsp;lorem&nbsp;sit&nbsp;amet&nbsp;est&nbsp;sollicitudin,&nbsp;ut&nbsp;interdum&nbsp;massa&nbsp;pretium.&nbsp;Curabitur&nbsp;nisl&nbsp;ex,&nbsp;rutrum&nbsp;a&nbsp;purus&nbsp;quis,&nbsp;scelerisque&nbsp;interdum&nbsp;justo.</p><p class=\\\"ql-align-justify\\\"></p><p class=\\\"ql-align-justify\\\"><a href=\\\"https://www.youtube.com/watch?v=SDJViHRwyr8\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">Phasellus&nbsp;vulputate,&nbsp;lectus&nbsp;sed&nbsp;elementum&nbsp;pretium,&nbsp;nisi&nbsp;lorem&nbsp;pretium&nbsp;mi,&nbsp;a&nbsp;interdum&nbsp;magna&nbsp;sem&nbsp;ut&nbsp;est.&nbsp;Praesent&nbsp;mattis,&nbsp;massa&nbsp;in&nbsp;eleifend&nbsp;egestas,&nbsp;enim&nbsp;justo&nbsp;tristique&nbsp;elit,&nbsp;at&nbsp;eleifend&nbsp;ante&nbsp;purus&nbsp;nec&nbsp;nisl.&nbsp;Maecenas&nbsp;tincidunt,&nbsp;nisl&nbsp;nec&nbsp;sodales&nbsp;sodales,&nbsp;eros&nbsp;sapien&nbsp;interdum&nbsp;dolor,&nbsp;quis&nbsp;condimentum&nbsp;nibh&nbsp;lorem&nbsp;non&nbsp;ex.&nbsp;Nam&nbsp;et&nbsp;nulla&nbsp;sit&nbsp;amet&nbsp;nisl&nbsp;elementum&nbsp;eleifend.&nbsp;Fusce&nbsp;tincidunt,&nbsp;eros&nbsp;eu&nbsp;elementum&nbsp;pulvinar,&nbsp;est&nbsp;neque&nbsp;rhoncus&nbsp;metus,&nbsp;vel&nbsp;scelerisque&nbsp;dolor&nbsp;sem&nbsp;at&nbsp;dui.&nbsp;In&nbsp;sodales&nbsp;pharetra&nbsp;lacus,&nbsp;ac&nbsp;volutpat&nbsp;tellus&nbsp;elementum&nbsp;in.</a></p>\",\"_uid\":\"sec-1778029808432-0\"}]','2026-05-27 14:15:11',1);
/*!40000 ALTER TABLE `eincol_config` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` varchar(100) DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `extra_data` longtext DEFAULT NULL,
  `planta_url` varchar(255) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `event_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(100) NOT NULL DEFAULT 'home',
  `question` varchar(500) NOT NULL,
  `answer` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_key`),
  KEY `idx_sort` (`page_key`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'home','Como me tornar um associado?','Para se tornar um associado, entre em contato com nossa equipe administrativa através do formulário de contato ou e-mail institucional para receber os detalhes sobre o processo de filiação.',2,1),(2,'home','O que é o SIF?','A Sociedade de Investigações Florestais (SIF) é uma instituição sem fins lucrativos que promove a integração entre universidades e empresas do setor florestal, fomentando pesquisa e inovação.',1,1),(3,'home','Onde o SIF está localizado?','Nossa sede está localizada no campus da Universidade Federal de Viçosa (UFV), em Viçosa - MG, polo de referência em Ciência Florestal no Brasil.',3,1),(4,'home','Quais são as principais áreas de atuação?','Atuamos em cinco pilares fundamentais: Silvicultura, Manejo de Recursos Florestais, Ambiência, Proteção Florestal e Tecnologia de Produtos Florestais.',4,1);
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `gt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content_title` varchar(255) DEFAULT NULL,
  `content_subtitle` varchar(255) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `bg_color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `extra_data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `gt` WRITE;
/*!40000 ALTER TABLE `gt` DISABLE KEYS */;
INSERT INTO `gt` VALUES (1,'teste-1','Teste 1 ','<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel hendrerit libero. Praesent pulvinar, sapien vel feugiat vestibulum, nulla dui pretium orci, non ultricies elit lacus quis ante. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.</p><p>Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.</p><p>Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi.</p><p><br></p><p><br></p><iframe class=\"ql-video\" frameborder=\"0\" allowfullscreen=\"true\" src=\"https://www.youtube.com/embed/HLGRI-Qlkk8?showinfo=0\"></iframe><p><br></p><p>Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam vel iaculis mauris. Sed ullamcorper tellus erat, non ultrices sem tincidunt euismod.</p><p>Suspendisse potenti. Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus.</p><p>Quer ainda mais? Posso fazer uma versão gigante estilo “parede de texto infinita” ou até um lorem ipsum engraçado com palavras em português misturadas</p>','Objetivos do Cluster.','Linhas de Pesquisa e Inovação!','Target','#059669','#05966922','2026-04-02 12:15:02','uploads/gt/1777988711_542b5d107ab2.png',1,NULL),(2,'teste','Teste','<p>asdasdasd</p>','Objetivos do dasdasd','Linhas de Pesquisa e Inovação','Target','#25007a','#25007a22','2026-05-06 14:27:07','uploads/gt/1779837239_cb5c5d57b3d6.jpg',1,'{\"sections\":[]}'),(3,'novo-grupo-tematico','Novo grupo tematico','<p><strong><em><u>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Integer&nbsp;vel&nbsp;sapien&nbsp;nec&nbsp;velit&nbsp;luctus&nbsp;tincidunt.&nbsp;Suspendisse&nbsp;potenti.&nbsp;Curabitur&nbsp;viverra,&nbsp;neque&nbsp;non&nbsp;luctus&nbsp;gravida,&nbsp;turpis&nbsp;lacus&nbsp;feugiat&nbsp;arcu,&nbsp;vitae&nbsp;condimentum&nbsp;justo&nbsp;magna&nbsp;nec&nbsp;libero.&nbsp;Donec&nbsp;sodales,&nbsp;urna&nbsp;sed&nbsp;fermentum&nbsp;bibendum,&nbsp;tortor&nbsp;nunc&nbsp;facilisis&nbsp;augue,&nbsp;eget&nbsp;consequat&nbsp;justo&nbsp;est&nbsp;non&nbsp;purus.</u></em></strong></p><ol><li>Praesent&nbsp;suscipit&nbsp;sapien&nbsp;ut&nbsp;libero&nbsp;malesuada,&nbsp;a&nbsp;ultrices&nbsp;risus&nbsp;pharetra.&nbsp;Aliquam&nbsp;erat&nbsp;volutpat.&nbsp;Sed&nbsp;tincidunt&nbsp;lacus&nbsp;ac&nbsp;justo&nbsp;hendrerit,&nbsp;sit&nbsp;amet&nbsp;tincidunt&nbsp;massa&nbsp;pretium.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Donec&nbsp;eget&nbsp;tortor&nbsp;non&nbsp;libero&nbsp;consequat&nbsp;faucibus.&nbsp;Quisque&nbsp;sed&nbsp;augue&nbsp;ut&nbsp;purus&nbsp;feugiat&nbsp;convallis.&nbsp;Vivamus&nbsp;sed&nbsp;arcu&nbsp;at&nbsp;lectus&nbsp;tristique&nbsp;vulputate.</li><li>Mauris&nbsp;ultricies,&nbsp;augue&nbsp;vel&nbsp;interdum&nbsp;feugiat,&nbsp;lorem&nbsp;mi&nbsp;varius&nbsp;nibh,&nbsp;sed&nbsp;consequat&nbsp;magna&nbsp;nisl&nbsp;at&nbsp;metus.&nbsp;Integer&nbsp;faucibus,&nbsp;purus&nbsp;sit&nbsp;amet&nbsp;suscipit&nbsp;pulvinar,&nbsp;sapien&nbsp;velit&nbsp;dignissim&nbsp;est,&nbsp;sed&nbsp;tristique&nbsp;lacus&nbsp;enim&nbsp;eget&nbsp;sapien.&nbsp;Nullam&nbsp;luctus&nbsp;justo&nbsp;non&nbsp;lacus&nbsp;hendrerit,&nbsp;eget&nbsp;fermentum&nbsp;nisi&nbsp;pharetra.&nbsp;Etiam&nbsp;non&nbsp;dolor&nbsp;nec&nbsp;velit&nbsp;malesuada&nbsp;scelerisque.</li></ol><p></p><p><img src=\"http://localhost/sif-api/uploads/editor/1779837174_34091d67cac5c195.jpg\"></p>','QUALQUER TITUlo','Linhas de Pesquisa e Inovação','Target','#0586d6','#0586d622','2026-05-26 23:13:35','uploads/gt/1779837215_c8df6dab2a23.jpg',1,'{\"sections\":[{\"id\":\"1779837193609-16zf4e\",\"type\":\"tabs\",\"title\":\"\",\"tabs\":[{\"title\":\"sddas\",\"content\":\"<p>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Integer&nbsp;vel&nbsp;sapien&nbsp;nec&nbsp;velit&nbsp;luctus&nbsp;tincidunt.&nbsp;Suspendisse&nbsp;potenti.&nbsp;Curabitur&nbsp;viverra,&nbsp;neque&nbsp;non&nbsp;luctus&nbsp;gravida,&nbsp;turpis&nbsp;lacus&nbsp;feugiat&nbsp;arcu,&nbsp;vitae&nbsp;condimentum&nbsp;justo&nbsp;magna&nbsp;nec&nbsp;libero.&nbsp;Donec&nbsp;sodales,&nbsp;urna&nbsp;sed&nbsp;fermentum&nbsp;bibendum,&nbsp;tortor&nbsp;nunc&nbsp;facilisis&nbsp;augue,&nbsp;eget&nbsp;consequat&nbsp;justo&nbsp;est&nbsp;non&nbsp;purus.</p><p>Praesent&nbsp;suscipit&nbsp;sapien&nbsp;ut&nbsp;libero&nbsp;malesuada,&nbsp;a&nbsp;ultrices&nbsp;risus&nbsp;pharetra.&nbsp;Aliquam&nbsp;erat&nbsp;volutpat.&nbsp;Sed&nbsp;tincidunt&nbsp;lacus&nbsp;ac&nbsp;justo&nbsp;hendrerit,&nbsp;sit&nbsp;amet&nbsp;tincidunt&nbsp;massa&nbsp;pretium.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Donec&nbsp;eget&nbsp;tortor&nbsp;non&nbsp;libero&nbsp;consequat&nbsp;faucibus.&nbsp;Quisque&nbsp;sed&nbsp;augue&nbsp;ut&nbsp;purus&nbsp;feugiat&nbsp;convallis.&nbsp;Vivamus&nbsp;sed&nbsp;arcu&nbsp;at&nbsp;lectus&nbsp;tristique&nbsp;vulputate.</p><p>Mauris&nbsp;ultricies,&nbsp;augue&nbsp;vel&nbsp;interdum&nbsp;feugiat,&nbsp;lorem&nbsp;mi&nbsp;varius&nbsp;nibh,&nbsp;sed&nbsp;consequat&nbsp;magna&nbsp;nisl&nbsp;at&nbsp;metus.&nbsp;Integer&nbsp;faucibus,&nbsp;purus&nbsp;sit&nbsp;amet&nbsp;suscipit&nbsp;pulvinar,&nbsp;sapien&nbsp;velit&nbsp;dignissim&nbsp;est,&nbsp;sed&nbsp;tristique&nbsp;lacus&nbsp;enim&nbsp;eget&nbsp;sapien.&nbsp;Nullam&nbsp;luctus&nbsp;justo&nbsp;non&nbsp;lacus&nbsp;hendrerit,&nbsp;eget&nbsp;fermentum&nbsp;nisi&nbsp;pharetra.&nbsp;Etiam&nbsp;non&nbsp;dolor&nbsp;nec&nbsp;velit&nbsp;malesuada&nbsp;scelerisque.</p>\"},{\"title\":\"asdadadad\",\"content\":\"<p>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Integer&nbsp;vel&nbsp;sapien&nbsp;nec&nbsp;velit&nbsp;luctus&nbsp;tincidunt.&nbsp;Suspendisse&nbsp;potenti.&nbsp;Curabitur&nbsp;viverra,&nbsp;neque&nbsp;non&nbsp;luctus&nbsp;gravida,&nbsp;turpis&nbsp;lacus&nbsp;feugiat&nbsp;arcu,&nbsp;vitae&nbsp;condimentum&nbsp;justo&nbsp;magna&nbsp;nec&nbsp;libero.&nbsp;Donec&nbsp;sodales,&nbsp;urna&nbsp;sed&nbsp;fermentum&nbsp;bibendum,&nbsp;tortor&nbsp;nunc&nbsp;facilisis&nbsp;augue,&nbsp;eget&nbsp;consequat&nbsp;justo&nbsp;est&nbsp;non&nbsp;purus.</p><p>Praesent&nbsp;suscipit&nbsp;sapien&nbsp;ut&nbsp;libero&nbsp;malesuada,&nbsp;a&nbsp;ultrices&nbsp;risus&nbsp;pharetra.&nbsp;Aliquam&nbsp;erat&nbsp;volutpat.&nbsp;Sed&nbsp;tincidunt&nbsp;lacus&nbsp;ac&nbsp;justo&nbsp;hendrerit,&nbsp;sit&nbsp;amet&nbsp;tincidunt&nbsp;massa&nbsp;pretium.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Donec&nbsp;eget&nbsp;tortor&nbsp;non&nbsp;libero&nbsp;consequat&nbsp;faucibus.&nbsp;Quisque&nbsp;sed&nbsp;augue&nbsp;ut&nbsp;purus&nbsp;feugiat&nbsp;convallis.&nbsp;Vivamus&nbsp;sed&nbsp;arcu&nbsp;at&nbsp;lectus&nbsp;tristique&nbsp;vulputate.</p><p>Mauris&nbsp;ultricies,&nbsp;augue&nbsp;vel&nbsp;interdum&nbsp;feugiat,&nbsp;lorem&nbsp;mi&nbsp;varius&nbsp;nibh,&nbsp;sed&nbsp;consequat&nbsp;magna&nbsp;nisl&nbsp;at&nbsp;metus.&nbsp;Integer&nbsp;faucibus,&nbsp;purus&nbsp;sit&nbsp;amet&nbsp;suscipit&nbsp;pulvinar,&nbsp;sapien&nbsp;velit&nbsp;dignissim&nbsp;est,&nbsp;sed&nbsp;tristique&nbsp;lacus&nbsp;enim&nbsp;eget&nbsp;sapien.&nbsp;Nullam&nbsp;luctus&nbsp;justo&nbsp;non&nbsp;lacus&nbsp;hendrerit,&nbsp;eget&nbsp;fermentum&nbsp;nisi&nbsp;pharetra.&nbsp;Etiam&nbsp;non&nbsp;dolor&nbsp;nec&nbsp;velit&nbsp;malesuada&nbsp;scelerisque.&nbsp;Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Integer&nbsp;vel&nbsp;sapien&nbsp;nec&nbsp;velit&nbsp;luctus&nbsp;tincidunt.&nbsp;Suspendisse&nbsp;potenti.&nbsp;Curabitur&nbsp;viverra,&nbsp;neque&nbsp;non&nbsp;luctus&nbsp;gravida,&nbsp;turpis&nbsp;lacus&nbsp;feugiat&nbsp;arcu,&nbsp;vitae&nbsp;condimentum&nbsp;justo&nbsp;magna&nbsp;nec&nbsp;libero.&nbsp;Donec&nbsp;sodales,&nbsp;urna&nbsp;sed&nbsp;fermentum&nbsp;bibendum,&nbsp;tortor&nbsp;nunc&nbsp;facilisis&nbsp;augue,&nbsp;eget&nbsp;consequat&nbsp;justo&nbsp;est&nbsp;non&nbsp;purus.</p><p>Praesent&nbsp;suscipit&nbsp;sapien&nbsp;ut&nbsp;libero&nbsp;malesuada,&nbsp;a&nbsp;ultrices&nbsp;risus&nbsp;pharetra.&nbsp;Aliquam&nbsp;erat&nbsp;volutpat.&nbsp;Sed&nbsp;tincidunt&nbsp;lacus&nbsp;ac&nbsp;justo&nbsp;hendrerit,&nbsp;sit&nbsp;amet&nbsp;tincidunt&nbsp;massa&nbsp;pretium.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Donec&nbsp;eget&nbsp;tortor&nbsp;non&nbsp;libero&nbsp;consequat&nbsp;faucibus.&nbsp;Quisque&nbsp;sed&nbsp;augue&nbsp;ut&nbsp;purus&nbsp;feugiat&nbsp;convallis.&nbsp;Vivamus&nbsp;sed&nbsp;arcu&nbsp;at&nbsp;lectus&nbsp;tristique&nbsp;vulputate.</p><p>Mauris&nbsp;ultricies,&nbsp;augue&nbsp;vel&nbsp;interdum&nbsp;feugiat,&nbsp;lorem&nbsp;mi&nbsp;varius&nbsp;nibh,&nbsp;sed&nbsp;consequat&nbsp;magna&nbsp;nisl&nbsp;at&nbsp;metus.&nbsp;Integer&nbsp;faucibus,&nbsp;purus&nbsp;sit&nbsp;amet&nbsp;suscipit&nbsp;pulvinar,&nbsp;sapien&nbsp;velit&nbsp;dignissim&nbsp;est,&nbsp;sed&nbsp;tristique&nbsp;lacus&nbsp;enim&nbsp;eget&nbsp;sapien.&nbsp;Nullam&nbsp;luctus&nbsp;justo&nbsp;non&nbsp;lacus&nbsp;hendrerit,&nbsp;eget&nbsp;fermentum&nbsp;nisi&nbsp;pharetra.&nbsp;Etiam&nbsp;non&nbsp;dolor&nbsp;nec&nbsp;velit&nbsp;malesuada&nbsp;scelerisque.</p>\"}]},{\"id\":\"1779837204649-c4c95j\",\"type\":\"pdfs\",\"title\":\"\",\"pdfs\":[{\"url\":\"uploads/pdfs/1779837206_a8c09fcfb3b0edd5.pdf\",\"title\":\"estatutosif (3)\"}]},{\"id\":\"1779837208845-4fu3yl\",\"type\":\"editor\",\"title\":\"dsdadadadsad\",\"content\":\"<p>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.&nbsp;Integer&nbsp;vel&nbsp;sapien&nbsp;nec&nbsp;velit&nbsp;luctus&nbsp;tincidunt.&nbsp;Suspendisse&nbsp;potenti.&nbsp;Curabitur&nbsp;viverra,&nbsp;neque&nbsp;non&nbsp;luctus&nbsp;gravida,&nbsp;turpis&nbsp;lacus&nbsp;feugiat&nbsp;arcu,&nbsp;vitae&nbsp;condimentum&nbsp;justo&nbsp;magna&nbsp;nec&nbsp;libero.&nbsp;Donec&nbsp;sodales,&nbsp;urna&nbsp;sed&nbsp;fermentum&nbsp;bibendum,&nbsp;tortor&nbsp;nunc&nbsp;facilisis&nbsp;augue,&nbsp;eget&nbsp;consequat&nbsp;justo&nbsp;est&nbsp;non&nbsp;purus.</p><p>Praesent&nbsp;suscipit&nbsp;sapien&nbsp;ut&nbsp;libero&nbsp;malesuada,&nbsp;a&nbsp;ultrices&nbsp;risus&nbsp;pharetra.&nbsp;Aliquam&nbsp;erat&nbsp;volutpat.&nbsp;Sed&nbsp;tincidunt&nbsp;lacus&nbsp;ac&nbsp;justo&nbsp;hendrerit,&nbsp;sit&nbsp;amet&nbsp;tincidunt&nbsp;massa&nbsp;pretium.&nbsp;Vestibulum&nbsp;ante&nbsp;ipsum&nbsp;primis&nbsp;in&nbsp;faucibus&nbsp;orci&nbsp;luctus&nbsp;et&nbsp;ultrices&nbsp;posuere&nbsp;cubilia&nbsp;curae;&nbsp;Donec&nbsp;eget&nbsp;tortor&nbsp;non&nbsp;libero&nbsp;consequat&nbsp;faucibus.&nbsp;Quisque&nbsp;sed&nbsp;augue&nbsp;ut&nbsp;purus&nbsp;feugiat&nbsp;convallis.&nbsp;Vivamus&nbsp;sed&nbsp;arcu&nbsp;at&nbsp;lectus&nbsp;tristique&nbsp;vulputate.</p><p>Mauris&nbsp;ultricies,&nbsp;augue&nbsp;vel&nbsp;interdum&nbsp;feugiat,&nbsp;lorem&nbsp;mi&nbsp;varius&nbsp;nibh,&nbsp;sed&nbsp;consequat&nbsp;magna&nbsp;nisl&nbsp;at&nbsp;metus.&nbsp;Integer&nbsp;faucibus,&nbsp;purus&nbsp;sit&nbsp;amet&nbsp;suscipit&nbsp;pulvinar,&nbsp;sapien&nbsp;velit&nbsp;dignissim&nbsp;est,&nbsp;sed&nbsp;tristique&nbsp;lacus&nbsp;enim&nbsp;eget&nbsp;sapien.&nbsp;Nullam&nbsp;luctus&nbsp;justo&nbsp;non&nbsp;lacus&nbsp;hendrerit,&nbsp;eget&nbsp;fermentum&nbsp;nisi&nbsp;pharetra.&nbsp;Etiam&nbsp;non&nbsp;dolor&nbsp;nec&nbsp;velit&nbsp;malesuada&nbsp;scelerisque.</p>\"}]}');
/*!40000 ALTER TABLE `gt` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `active` tinyint(1) DEFAULT 1,
  `tipo_vaga` enum('Interna','Externa') DEFAULT 'Interna',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('unread','read','contacted') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `page_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(100) NOT NULL,
  `config_json` longtext DEFAULT NULL COMMENT 'JSON com todo o conte??do da p??gina',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_key` (`page_key`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `page_configs` WRITE;
/*!40000 ALTER TABLE `page_configs` DISABLE KEYS */;
INSERT INTO `page_configs` VALUES (1,'home','{\"hero\":{\"tag\":\"Sustentabilidade & Inovação    \",\"title_line1\":\"Sociedade de  \",\"title_line2\":\"Investigações Florestais  \",\"subtitle\":\"Há mais de 40 anos promovendo o desenvolvimento científico e tecnológico do setor florestal brasileiro. Conexão entre universidade e grandes empresas.   \",\"cta1_label\":\"Seja Associada  \",\"cta1_link\":\"\\/contato  \",\"cta2_label\":\"Nossos Projetos  \",\"cta2_link\":\"\\/projetos  \",\"scroll_label\":\"Explore     \"},\"performance\":{\"items\":[{\"title\":\"Missão   \",\"text\":\"Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.   \"},{\"title\":\"Visão   \",\"text\":\"Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.   \"},{\"title\":\"Valores \",\"text\":\"Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo \\n\"}]},\"about\":{\"tag\":\"Quem Somos  \",\"title\":\"Referência em Pesquisa Florestal  \",\"paragraph_1\":\"Fundada em 1974, a Sociedade de Investigações Florestais (SIF) consolida uma trajetória de cinco décadas como o elo estratégico entre a Universidade Federal de Viçosa (UFV) e o setor produtivo. Nossa missão é impulsionar o desenvolvimento do setor florestal através da pesquisa aplicada, da geração de conhecimento e da qualificação profissional de excelência.   \",\"paragraph_2\":\"Atualmente, conectamos mais de 28 empresas associadas, abrangendo segmentos fundamentais como celulose e papel, siderurgia, painéis de madeira e o mercado de crédito de carbono. Essa cooperação público-privada permite que projetos de Pesquisa, Desenvolvimento e Inovação (PD&I) sejam conduzidos por especialistas renomados, utilizando a infraestrutura avançada e o capital intelectual do Departamento de Engenharia Florestal da UFV.   \",\"paragraph_3\":\"Nosso compromisso estende-se à sociedade por meio da democratização do saber técnico. Os avanços científicos gerados em nossos grupos temáticos e parcerias são compartilhados através da Revista Árvore, de boletins técnicos e de treinamentos especializados, garantindo que a inovação e a sustentabilidade norteiem o futuro das florestas.  \",\"cta_label\":\"Conheça Nossa História  \",\"cta_link\":\"\\/institucional\",\"video_url\":\"https:\\/\\/www.youtube.com\\/embed\\/9AWrRQWYIcw?rel=0&modestbranding=1\",\"badge_value\":\"+50 Anos  \",\"badge_label\":\"De excelência  \"},\"services\":{\"section_tag\":\"Áreas de Atuação \",\"section_title\":\"Nossos Serviços \",\"cards\":[{\"id\":\"01 \",\"tag\":\"Treinamentos  \",\"title\":\"Treinamentos  \",\"desc\":\"Nossa área comercial atua estrategicamente na venda de sementes de alta qualidade, tecnologia Ellepot e captação de patrocínios para eventos florestais.  \",\"link\":\"https:\\/\\/sif.org.br\",\"image\":\"uploads\\/pages\\/home\\/images\\/1779887934_e7d6ad1586ba.jpg\"},{\"id\":\"02\",\"tag\":\"Germinar\",\"title\":\"Programa Germinar\",\"desc\":\"Uma iniciativa focada no desenvolvimento e atração de talentos. Descubra como funciona o programa e acesse nosso banco de vagas exclusivas.\",\"link\":\"\\/trabalhe-conosco\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop\"},{\"id\":\"03\",\"tag\":\"Informativo\",\"title\":\"Boletim Técnico\",\"desc\":\"Conteúdos aprofundados e atualizações das principais inovações do setor florestal. Acesse nossas edições técnicas focadas em ciência e aplicação de campo.\",\"link\":\"\\/blog\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1456324504439-367cee3b3c32?q=80&w=2670&auto=format&fit=crop\"},{\"id\":\"04\",\"tag\":\"Pesquisa\",\"title\":\"Serviços de P&D\",\"desc\":\"Realizamos projetos especializados de Pesquisa e Desenvolvimento, conectando as demandas reais da indústria florestal com a excelência acadêmica.\",\"link\":\"\\/projetos\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop\"},{\"id\":\"05\",\"tag\":\"Comercial\",\"title\":\"Novo card\",\"desc\":\"Texto de teste vem aqui\",\"link\":\"\\/\",\"image\":\"uploads\\/pages\\/home\\/images\\/1779721900_f4a09cb7cb00.jpg\"}]},\"process\":{\"section_tag\":\"Inovação e Transparência \",\"section_title\":\"Explore nossos recursos \",\"section_subtitle\":\"Acesse as principais áreas e conteúdos da nossa plataforma. \",\"steps\":[{\"id\":\"01 \",\"title\":\"Blog e Notícias \",\"icon_type\":\"\",\"img\":\"uploads\\/pages\\/home\\/images\\/1779454316_4fb4ba7c7ef1.png\",\"shortDesc\":\"Fique por dentro das novidades! \",\"fullDesc\":\"Acompanhe as últimas notícias, eventos e inovações do setor florestal brasileiro. \",\"benefits\":\"Novidades, Artigos, Eventos, \",\"link\":\"\\/blog\",\"external\":false},{\"id\":\"02\",\"title\":\"Treinamentos\",\"icon_type\":\"BookOpen\",\"img\":\"uploads\\/pages\\/home\\/images\\/1779721992_23f3359d0179.jpg\",\"shortDesc\":\"Qualificação profissional.\",\"fullDesc\":\"Consulte nossa agenda completa de treinamentos e cursos especializados para o setor.\",\"benefits\":\"Cursos, Certificados, Expertise\",\"link\":\"\\/treinamentos\",\"external\":false},{\"id\":\"03\",\"title\":\"Nossos Projetos\",\"icon_type\":\"TreePine\",\"img\":\"uploads\\/pages\\/home\\/images\\/1779721992_f80db6f5fa6c.jpg\",\"shortDesc\":\"Inovação em P&D+I.\",\"fullDesc\":\"Conheça os projetos de pesquisa e desenvolvimento que estamos realizando no campo.\",\"benefits\":\"P&D+I, Tecnologia, Campo\",\"link\":\"\\/projetos\",\"external\":false},{\"id\":\"04\",\"title\":\"Transparência\",\"icon_type\":\"ScrollText\",\"img\":\"https:\\/\\/images.unsplash.com\\/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071\",\"shortDesc\":\"Ética e Integridade.\",\"fullDesc\":\"Acesse nosso Código de Conduta e diretrizes de conformidade aplicadas a todos os processos.\",\"benefits\":\"Ética, Compliance, Governança\",\"link\":\"https:\\/\\/sif.conveniar.com.br\\/portaltransparencia\\/\",\"external\":true}]},\"faq_side\":{\"title\":\"Ainda tem <br> Dúvidas? \",\"subtitle\":\"Nossa equipe técnica e comercial está pronta para atender você. \",\"cta_label\":\"Falar com Consultor Agora\",\"cta_link\":\"\\/contato\"},\"services_card_0_image\":\"uploads\\/pages\\/home\\/images\\/1779118818_95dfa62eac3b.png\",\"hero_bg\":\"uploads\\/pages\\/home\\/images\\/1779887804_5963d5be83d6.jpg\"}','2026-05-27 13:18:54'),(2,'produtos','{\"comercial_title_line1\":\"Setor teste \",\"comercial_title_highlight\":\"Comercial \",\"comercial_intro\":\"Oferecemos sementes de alta qualidade genética e a tecnologia Ellepot para otimização do seu viveiro, além de oportunidades exclusivas de patrocínio nos maiores eventos do setor. \",\"comercial_sections\":[],\"germinar_title_line1\":\"Programa\",\"germinar_title_highlight\":\"Germinar\",\"germinar_intro\":\"Conectar a formação universitária à prática do setor privado, oferecendo aos estudantes a oportunidade de vivenciar a rotina das empresas, entender sua cultura organizacional e se preparar para futuras oportunidades de atuação profissional.\",\"germinar_sections\":[{\"id\":\"germinar-obj\",\"type\":\"editor\",\"title\":\"Objetivos Específicos\",\"content\":\"<ul><li>Preparar&nbsp;o&nbsp;futuro&nbsp;colaborador&nbsp;no&nbsp;final&nbsp;da&nbsp;formação&nbsp;acadêmica<\\/li><li>Inserir&nbsp;o&nbsp;aluno&nbsp;nos&nbsp;processos&nbsp;técnicos,&nbsp;operacionais&nbsp;e&nbsp;culturais<\\/li><li>Promover&nbsp;troca&nbsp;de&nbsp;experiências&nbsp;entre&nbsp;alunos&nbsp;e&nbsp;profissionais<\\/li><li>Identificar&nbsp;talentos&nbsp;ainda&nbsp;durante&nbsp;a&nbsp;formação&nbsp;acadêmica<\\/li><li>Facilitar&nbsp;contratações&nbsp;por&nbsp;meio&nbsp;do&nbsp;estágio<\\/li><li>Desenvolver&nbsp;competências&nbsp;interpessoais<\\/li><li>Atrair&nbsp;mão&nbsp;de&nbsp;obra&nbsp;qualificada<\\/li><li>Integrar&nbsp;pesquisa&nbsp;acadêmica&nbsp;e&nbsp;prática&nbsp;empresarial<\\/li><\\/ul>\"},{\"id\":\"germinar-plano\",\"type\":\"tabs\",\"title\":\"Plano Pedagógico \",\"tabs\":[{\"title\":\"Período & Pré-requisitos\",\"content\":\"<p>A&nbsp;duração&nbsp;do&nbsp;programa&nbsp;depende&nbsp;do&nbsp;nível&nbsp;acadêmico,&nbsp;graduação&nbsp;ou&nbsp;pós-graduação:&nbsp;<strong>Mínimo:&nbsp;6&nbsp;meses&nbsp;|&nbsp;Máximo:&nbsp;24&nbsp;meses.<\\/strong><\\/p><h3>Graduação<\\/h3><p><strong>Pré-requisitos:<\\/strong>&nbsp;Ter&nbsp;cursado&nbsp;todas&nbsp;as&nbsp;disciplinas&nbsp;do&nbsp;curso.<\\/p><p><strong>Exceção:<\\/strong><\\/p><ul><li>Estágio&nbsp;Supervisionado&nbsp;(ENF&nbsp;498)<\\/li><li>Trabalho&nbsp;de&nbsp;Conclusão&nbsp;de&nbsp;Curso&nbsp;(ENF&nbsp;497\\/499)<\\/li><\\/ul><h3>Pós-Graduação<\\/h3><p><strong>Pré-requisitos:<\\/strong>&nbsp;Ter&nbsp;cursado&nbsp;todas&nbsp;as&nbsp;disciplinas&nbsp;do&nbsp;curso.<\\/p><p><strong>Exceção:<\\/strong><\\/p><ul><li>Pesquisa&nbsp;(ENF&nbsp;799)<\\/li><li>Seminários&nbsp;I&nbsp;e&nbsp;II&nbsp;(ENF&nbsp;797)<\\/li><\\/ul>\"},{\"title\":\"Benefícios\",\"content\":\"<h3>Benefícios&nbsp;Gerais<\\/h3><ul><li>Auxílio&nbsp;moradia<\\/li><li>Auxílio&nbsp;alimentação<\\/li><li>Deslocamento<\\/li><li>Plano&nbsp;de&nbsp;Saúde<\\/li><li>Seguro&nbsp;de&nbsp;Vida<\\/li><\\/ul><h3>Bolsa&nbsp;Auxílio&nbsp;Mensal<\\/h3><p><strong>Graduação:<\\/strong>&nbsp;R$&nbsp;1.500,00<\\/p><p><strong>Mestrado:<\\/strong>&nbsp;R$&nbsp;2.100,00<\\/p><p><strong>Doutorado:<\\/strong>&nbsp;R$&nbsp;3.100,00<\\/p>\"},{\"title\":\"Etapas do Processo Seletivo\",\"content\":\"<h3>Etapas<\\/h3><ul><li>Análise&nbsp;de&nbsp;histórico&nbsp;escolar<\\/li><li>Avaliação&nbsp;de&nbsp;currículo<\\/li><li>Entrevista<\\/li><li>Avaliação&nbsp;de&nbsp;perfil&nbsp;psicológico<\\/li><li>Soft&nbsp;skills&nbsp;e&nbsp;perfil&nbsp;cultural<\\/li><\\/ul><h3>Avaliação&nbsp;e&nbsp;Acompanhamento<\\/h3><ol><li><strong>Avaliação&nbsp;de&nbsp;Perfil:<\\/strong>&nbsp;Avaliação&nbsp;inicial&nbsp;dos&nbsp;bolsistas&nbsp;com&nbsp;teste&nbsp;Disc&nbsp;Assessment,&nbsp;avaliação&nbsp;de&nbsp;personalidade,&nbsp;e&nbsp;um&nbsp;questionário&nbsp;de&nbsp;Soft&nbsp;Skills.<\\/li><li><strong>Feedback&nbsp;para&nbsp;o&nbsp;Bolsista:<\\/strong>&nbsp;Reunião&nbsp;individual&nbsp;com&nbsp;o&nbsp;bolsista&nbsp;para&nbsp;feedback&nbsp;dos&nbsp;resultados&nbsp;e&nbsp;levantamento&nbsp;dos&nbsp;pontos&nbsp;de&nbsp;desenvolvimento,&nbsp;de&nbsp;forma&nbsp;que&nbsp;os&nbsp;mesmos&nbsp;construam&nbsp;o&nbsp;próprio&nbsp;PD&amp;I.<\\/li><li><strong>Reunião&nbsp;com&nbsp;o&nbsp;Gestor&nbsp;Responsável:<\\/strong>&nbsp;Reunião&nbsp;de&nbsp;alinhamento&nbsp;com&nbsp;o&nbsp;Gestor&nbsp;Responsável&nbsp;pelo&nbsp;bolsista&nbsp;para&nbsp;definição&nbsp;do&nbsp;plano&nbsp;de&nbsp;atividades&nbsp;durante&nbsp;todo&nbsp;o&nbsp;período&nbsp;do&nbsp;estágio.<\\/li><li><strong>Reuniões&nbsp;Individuais&nbsp;com&nbsp;o&nbsp;Bolsista:<\\/strong>&nbsp;Reunião&nbsp;de&nbsp;acompanhamento&nbsp;do&nbsp;plano&nbsp;de&nbsp;atividades&nbsp;do&nbsp;bolsista,&nbsp;de&nbsp;forma&nbsp;a&nbsp;avaliar&nbsp;a&nbsp;evolução&nbsp;das&nbsp;ações,&nbsp;resultados&nbsp;e&nbsp;definição&nbsp;de&nbsp;novas&nbsp;ações&nbsp;quando&nbsp;necessário.<\\/li><li><strong>Avaliação&nbsp;Final:<\\/strong>&nbsp;Ao&nbsp;final&nbsp;da&nbsp;bolsa,&nbsp;o&nbsp;aluno&nbsp;passa&nbsp;por&nbsp;uma&nbsp;avaliação&nbsp;final&nbsp;de&nbsp;perfil,&nbsp;para&nbsp;traçar&nbsp;a&nbsp;evolução&nbsp;das&nbsp;soft&nbsp;skills&nbsp;trabalhadas&nbsp;no&nbsp;plano&nbsp;de&nbsp;ação.<\\/li><\\/ol>\"},{\"title\":\"Direitos e Deveres\",\"content\":\"<h3>Bolsista<\\/h3><ul><li>Cumprir&nbsp;a&nbsp;carga&nbsp;horária&nbsp;de&nbsp;20&nbsp;ou&nbsp;30&nbsp;horas&nbsp;semanais<\\/li><li>Manter&nbsp;conduta&nbsp;ética,&nbsp;respeitosa&nbsp;e&nbsp;profissional&nbsp;durante&nbsp;todo&nbsp;o&nbsp;período<\\/li><li>Apresentar&nbsp;relatórios&nbsp;de&nbsp;acompanhamento,&nbsp;quando&nbsp;solicitado<\\/li><li>Zelar&nbsp;pelo&nbsp;bom&nbsp;uso&nbsp;das&nbsp;instalações&nbsp;da&nbsp;empresa<\\/li><li>Manter&nbsp;sigilo&nbsp;sobre&nbsp;informações&nbsp;confidenciais<\\/li><\\/ul><h3>Empresa<\\/h3><ul><li>Designar&nbsp;um&nbsp;supervisor&nbsp;para&nbsp;acompanhamento&nbsp;do&nbsp;bolsista<\\/li><li>Garantir&nbsp;as&nbsp;condições&nbsp;necessárias&nbsp;para&nbsp;a&nbsp;execução&nbsp;da&nbsp;atividade<\\/li><li>Oferecer&nbsp;ambiente&nbsp;seguro&nbsp;e&nbsp;condizente&nbsp;com&nbsp;as&nbsp;atividades&nbsp;de&nbsp;formação<\\/li><li>Fornecer&nbsp;feedback&nbsp;regular&nbsp;sobre&nbsp;o&nbsp;desempenho&nbsp;do&nbsp;bolsista<\\/li><\\/ul><h3>SIF<\\/h3><ul><li>Coordenar&nbsp;e&nbsp;supervisionar&nbsp;o&nbsp;cumprimento&nbsp;das&nbsp;atividades&nbsp;previstas<\\/li><li>Oferecer&nbsp;suporte&nbsp;acadêmico&nbsp;aos&nbsp;bolsistas<\\/li><li>Zelar&nbsp;pela&nbsp;qualidade&nbsp;do&nbsp;programa&nbsp;e&nbsp;pelo&nbsp;cumprimento&nbsp;das&nbsp;metas&nbsp;pedagógicas<\\/li><\\/ul>\"},{\"title\":\"Investimento & Outros\",\"content\":\"<h3>Investimento<\\/h3><p>Os&nbsp;custos&nbsp;envolvem&nbsp;a&nbsp;bolsa&nbsp;acadêmica,&nbsp;alimentação,&nbsp;moradia,&nbsp;deslocamento,&nbsp;formação&nbsp;de&nbsp;RH,&nbsp;plano&nbsp;de&nbsp;saúde&nbsp;e&nbsp;seguro&nbsp;de&nbsp;vida,&nbsp;variando&nbsp;conforme&nbsp;o&nbsp;nível&nbsp;acadêmico&nbsp;(graduação,&nbsp;mestrado&nbsp;e&nbsp;doutorado)&nbsp;e&nbsp;as&nbsp;demandas&nbsp;da&nbsp;empresa&nbsp;parceira.<\\/p><p><strong>Forma&nbsp;de&nbsp;Pagamento:<\\/strong><\\/p><ul><li>1ª&nbsp;parcela&nbsp;—&nbsp;50%&nbsp;do&nbsp;valor&nbsp;na&nbsp;assinatura&nbsp;do&nbsp;contrato<\\/li><li>2ª&nbsp;parcela&nbsp;—&nbsp;50%&nbsp;no&nbsp;início&nbsp;do&nbsp;sexto&nbsp;mês<\\/li><\\/ul><h3>Certificação<\\/h3><p>Fim&nbsp;do&nbsp;programa:&nbsp;O&nbsp;aluno&nbsp;receberá&nbsp;um&nbsp;certificado&nbsp;de&nbsp;participação&nbsp;emitido&nbsp;pela&nbsp;SIF\\/UFV&nbsp;em&nbsp;parceria&nbsp;com&nbsp;a&nbsp;empresa&nbsp;envolvida.<\\/p><h3>Confidencialidade<\\/h3><p>Inovações,&nbsp;produtos,&nbsp;relatórios&nbsp;ou&nbsp;qualquer&nbsp;material&nbsp;intelectual&nbsp;desenvolvido&nbsp;durante&nbsp;o&nbsp;Programa,&nbsp;serão&nbsp;considerados&nbsp;de&nbsp;coautoria&nbsp;entre&nbsp;aluno,&nbsp;orientador&nbsp;e&nbsp;empresa,&nbsp;salvo&nbsp;acordo&nbsp;em&nbsp;contrato&nbsp;específico.<\\/p><h3>Seguros&nbsp;e&nbsp;Suporte&nbsp;Emergencial<\\/h3><p>Os&nbsp;participantes&nbsp;do&nbsp;programa&nbsp;devem&nbsp;estar&nbsp;cobertos&nbsp;por&nbsp;seguro&nbsp;contra&nbsp;acidentes&nbsp;pessoais,&nbsp;contratado&nbsp;pela&nbsp;SIF&nbsp;ou&nbsp;pela&nbsp;empresa.&nbsp;Também&nbsp;é&nbsp;recomendada&nbsp;a&nbsp;existência&nbsp;de&nbsp;suporte&nbsp;médico&nbsp;emergencial&nbsp;em&nbsp;caso&nbsp;de&nbsp;acidentes&nbsp;durante&nbsp;o&nbsp;período&nbsp;de&nbsp;imersão.<\\/p><h3>Rescisão&nbsp;e&nbsp;Cancelamento<\\/h3><p>O&nbsp;desligamento&nbsp;do&nbsp;aluno&nbsp;poderá&nbsp;ocorrer&nbsp;nos&nbsp;seguintes&nbsp;casos:<\\/p><ul><li>Descumprimento&nbsp;das&nbsp;regras&nbsp;do&nbsp;programa<\\/li><li>Abandono&nbsp;das&nbsp;atividades<\\/li><li>Conduta&nbsp;inadequada&nbsp;ou&nbsp;antiética<\\/li><li>A&nbsp;pedido&nbsp;do&nbsp;aluno,&nbsp;mediante&nbsp;justificativa&nbsp;formal<\\/li><li>Por&nbsp;cancelamento&nbsp;do&nbsp;vínculo&nbsp;acadêmico&nbsp;com&nbsp;a&nbsp;universidade<\\/li><\\/ul>\"}]},{\"id\":\"1779888386202-ynibfb\",\"type\":\"pdfs\",\"title\":\"\",\"pdfs\":[{\"url\":\"uploads\\/pdfs\\/1779888399_55d82ab1b96e64ad.pdf\",\"title\":\"estatutosif (3)\"}]}],\"boletim_title_line1\":\"Boletim\",\"boletim_title_highlight\":\"Técnico SIF\",\"boletim_intro\":\"Transmissão de conhecimento técnico e atualizações sobre o estado da arte na ciência florestal aplicada.\",\"boletim_sections\":[],\"pd_title_line1\":\"Pesquisa &\",\"pd_title_highlight\":\"Desenvolvimento\",\"pd_intro\":\"Ofertamos excelência técnica em consultoria, estudos de viabilidade e desenvolvimento de novas tecnologias para toda a cadeia produtiva florestal.\",\"pd_sections\":[{\"id\":\"1779891483712-377koq\",\"type\":\"pdfs\",\"title\":\"\",\"pdfs\":[{\"url\":\"uploads\\/pdfs\\/1779891486_fb9bc960aded2fa4.pdf\",\"title\":\"estatutosif (3)\"}]}],\"hero_image\":\"uploads\\/pages\\/produtos\\/images\\/1779725635_dfcc4dc7e7f6.jpg\",\"hero_badge\":\"Inovação & Mercado 222 \",\"hero_title_line1\":\"Produtos 222\",\"hero_title_highlight\":\"& Serviços 22\",\"hero_subtitle\":\"Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal. 222\",\"hero_scroll_label\":\"ver produtos \",\"boletim_pdfs\":[{\"id\":\"bol-1779892018078-4mg1h\",\"title\":\"Teste\",\"pdf_url\":\"uploads\\/pdfs\\/1779892025_2b1f026f60687840.pdf\",\"cover_url\":\"uploads\\/editor\\/1779892020_ff7f225cb5bcc7ca.jpg\"}]}','2026-05-27 14:27:07'),(3,'institucional_geral','{\"hero_badge\":\"A SIF & Sua História \",\"hero_title_line1\":\"Nossa \",\"hero_title_highlight\":\"História \",\"hero_subtitle\":\"Somos o catalisador da inovação florestal no Brasil e no mundo. \",\"quem_somos_title\":\"Nossa História\",\"quem_somos_text1\":\"Fundada em 1974, a Sociedade de Investigações Florestais (SIF) consolida uma trajetória de cinco décadas como o elo estratégico entre a Universidade Federal de Viçosa (UFV) e o setor produtivo florestal brasileiro. \",\"quem_somos_text2\":\"Conectamos mais de 28 empresas associadas em projetos de pesquisa, desenvolvimento e inovação, formando a maior rede de cooperação universidade-empresa do setor no país. \",\"areas_tagline\":\"Fronteira Tecnológica\",\"areas_title\":\"Nossas Áreas de Atuação\",\"areas_subtitle\":\"Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal de ponta.\",\"estatuto_section_title\":\"Documentação & Transparência\",\"estatuto_section_subtitle\":\"A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.\",\"historia_tagline\":\"Nossa Jornada\",\"cta_title\":\"O Amanhã é Científico\",\"quem_somos_image\":\"uploads\\/pages\\/institucional\\/quem-somos\\/1779722457_1b27aa4b6517.avif\",\"hero_image\":\"uploads\\/pages\\/institucional\\/hero\\/1779722286_3300f217da0c.jpg\",\"quem_somos_title_line1\":\"Nossa \",\"quem_somos_title_highlight\":\"História \",\"quem_somos_image_caption_top\":\"Campus UFV \",\"quem_somos_image_caption_main\":\"Onde a Ciência Acontece \",\"team_tag\":\"Conheça \",\"team_title\":\"Nossa Gente \",\"team_subtitle\":\"As mentes que construíram cinco décadas de inovação e excelência florestal. ww\",\"areas_tag\":\"Fronteira Tecnológica\",\"areas_title_line1\":\"Nossas Áreas\",\"areas_title_highlight\":\"de Atuação\",\"areas\":[{\"title\":\"Silvicultura de Precisão\",\"icon\":\"Globe\",\"desc\":\"Desenvolvimento de protocolos avançados de biotecnologia, produção de sementes certificadas e mudas de alta performance. Atuamos na fronteira da nutrição florestal e técnicas silviculturais automatizadas para maximizar o ganho genético no campo.\"},{\"title\":\"Manejo & Inteligência\",\"icon\":\"Map\",\"desc\":\"Soluções integradas em inventário florestal contínuo, planejamento estratégico de colheita e economia de recursos. Utilizamos sensoriamento remoto e GIS de alta resolução para modelagem preditiva e tomada de decisão baseada em dados.\"},{\"title\":\"Ambiência & Clima\",\"icon\":\"Leaf\",\"desc\":\"Pesquisas focadas na conservação da biodiversidade, monitoramento hidrológico e recuperação de ecossistemas degradados. Lideramos projetos de regulação hídrica e estratégias de adaptação às mudanças climáticas para o setor florestal.\"},{\"title\":\"Proteção & Sanidade\",\"icon\":\"Shield\",\"desc\":\"Monitoramento ativo e controle biológico de pragas e doenças florestais. Desenvolvemos sistemas inteligentes de prevenção contra incêndios e protocolos de defesa fitossanitária que garantem a segurança do patrimônio biológico das empresas.\"},{\"title\":\"Tecnologia de Produtos\",\"icon\":\"Settings\",\"desc\":\"Fomento à inovação em processos industriais para energia, celulose, papel e multiprodutos da madeira. Investigamos a anatomia e as propriedades físico-químicas das fibras para o desenvolvimento de bioprodutos de alto valor agregado.\"}],\"estatuto_tag\":\"Governança\",\"estatuto_title_line1\":\"Documentação\",\"estatuto_title_highlight\":\"& Transparência\",\"estatuto_subtitle\":\"A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.\",\"estatuto_footer_title_line1\":\"A importância do Estatuto\",\"estatuto_footer_title_highlight\":\"e das Normas\",\"estatuto_footer_p1\":\"O Estatuto Social e as normas internas são os pilares que garantem a governança, a transparência e a segurança jurídica de uma organização como a SIF.\",\"estatuto_footer_p2\":\"O Estatuto funciona como a constituição da entidade. É o seu documento de fundação, que define sua identidade, propósito, estrutura de poder e os direitos e deveres dos seus membros. Ele é o alicerce que confere legitimidade e orienta as decisões estratégicas mais importantes.\",\"estatuto_footer_p3\":\"As normas, como regulamentos e regimentos, são o desdobramento prático do estatuto. Elas detalham os procedimentos do dia a dia, garantindo que as atividades sejam conduzidas de forma justa, padronizada e eficiente.\",\"estatuto_footer_quote\":\"Em conjunto, o estatuto estabelece \\\"o que\\\" a organização é, enquanto as normas definem \\\"como\\\" ela deve operar para cumprir sua missão com integridade e organização.\",\"historia_tag\":\"Nossa Jornada\",\"historia_title_line1\":\"Cinco\",\"historia_title_highlight\":\"Décadas\",\"historia_title_line2\":\"de Ciência\",\"cta_title_line1\":\"O Amanhã é\",\"cta_title_highlight\":\"Florestal\",\"cta_btn1_label\":\"Seja um Associado\",\"cta_btn1_link\":\"\\/contato\",\"cta_btn2_label\":\"Trabalhe Conosco\",\"cta_btn2_link\":\"\\/trabalhe-conosco\",\"estatuto_blocks\":[{\"icon\":\"Scale \",\"title\":\"Estatuto Social \",\"subtitle\":\"O alicerce da nossa Governança \",\"paragraphs\":[\"O Estatuto Social é o documento magno que estabelece a finalidade, a estrutura e as normas de funcionamento da SIF. Ele é a nossa constituição, definindo nossa identidade, propósito, estrutura de poder e os direitos e deveres dos nossos membros. \",\"O Estatuto é o alicerce que confere legitimidade e orienta as decisões estratégicas mais importantes da nossa organização.\"],\"pdfs\":[{\"label\":\"Estatuto Social SIF \",\"url\":\"\\/uploads\\/pdfs\\/1779723352_c73e05d4e72377be.pdf\",\"icon\":\"Scale \"}]},{\"icon\":\"FileText \",\"title\":\"Regulamentos Internos \",\"subtitle\":\" \",\"paragraphs\":[\"Os regulamentos que normatizam as políticas e os procedimentos internos da SIF são os desdobramentos práticos do nosso estatuto, detalhando as operações do dia a dia e garantindo que todas as atividades sejam conduzidas de forma justa, padronizada e eficiente.\",\"Sua função é oferecer clareza e segurança para todos os envolvidos, minimizando conflitos e assegurando a ordem operacional.\"],\"pdfs\":[{\"label\":\"Código de Conduta e Ética \",\"url\":\"\\/docs\\/Codigo-de-Conduta-e-Etica-SIF-2022.pdf\",\"icon\":\"Scale\"},{\"label\":\"Declaração Anticorrupção e Antifraude\",\"url\":\"\\/docs\\/Dec_Anticorrup_Antifraude_SIF.pdf\",\"icon\":\"Shield\"},{\"label\":\"Regulamento de Bolsa 2024\",\"url\":\"\\/docs\\/REGULAMENTO-DE-BOLSA-2024-1.pdf\",\"icon\":\"FileText\"},{\"label\":\"Regulamento de Aquisições e Contratações 2024\",\"url\":\"\\/docs\\/REGULAMENTO-PARA-AQUISICOES-E-CONTRATACOES-2024-1.pdf\",\"icon\":\"FileText\"}]}]}','2026-05-27 13:22:31'),(22,'eventos','{\"hero_image\":\"uploads\\/pages\\/eventos\\/images\\/1779119051_3e699ed02e71.jpg\",\"hero_badge\":\" Networking e Oportunidade\",\"hero_title_line1\":\"Nossos \",\"hero_title_highlight\":\"Eventos\",\"hero_subtitle\":\"Conectando lideranças e transformando o conhecimento em prática nos maiores fóruns florestais.\",\"hero_scroll_label\":\"Saiba mais\",\"contact_name\":\"Daniel Andrade\",\"contact_role\":\"Gerente de Eventos\",\"contact_email\":\"eventos@sif.com.br\",\"contact_whatsapp\":\"1212345678\",\"contact_photo\":\"uploads\\/pages\\/eventos\\/images\\/1779115892_2c9dfe24f9c1.jpg\"}','2026-05-27 13:33:41'),(23,'treinamentos','{\"contact_name\":\"Daniel Andrade R\",\"contact_role\":\"Gerente de Operações www\",\"contact_email\":\"daniel@gmail.com.br\",\"contact_whatsapp\":\"739819285471111\",\"contact_photo\":\"uploads\\/pages\\/treinamentos\\/images\\/1779114106_f17bc4e772b5.jpg\",\"hero_image\":\"uploads\\/pages\\/treinamentos\\/images\\/1779799831_05abeaa08771.jpg\",\"hero_badge\":\"Educação Executiva & Técnica \",\"hero_title_line1\":\"Nossos \",\"hero_title_highlight\":\"Treinamentos\",\"hero_subtitle\":\"Capacitação técnica de alto nível para os desafios contínuos do setor florestal brasileiro. \",\"hero_scroll_label\":\"Conheça nossos Cursos \"}','2026-05-26 14:02:52'),(50,'contato','{\"hero_image\":\"uploads\\/pages\\/contato\\/images\\/1779456293_f0867fdc59b1.png\",\"hero_badge\":\"Conecte-se Conosco\",\"hero_title_line1\":\"Fale com\",\"hero_title_highlight\":\"Nossa Equipe\",\"hero_subtitle\":\"Transparência e proximidade são nossos pilares. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas.\",\"hero_scroll_label\":\"sss\"}','2026-05-25 16:15:23'),(93,'associadas','{\"hero_image\":\"uploads\\/pages\\/associadas\\/images\\/1779888007_fe8a34d502c3.jpg\",\"hero_badge\":\"Parceria Estratégica \",\"hero_title_line1\":\"Empresas \",\"hero_title_highlight\":\"Associadas \",\"hero_subtitle\":\"O elo que une a ciência acadêmica às maiores potências da indústria florestal global.  \",\"beneficios_title_line1\":\"Por que ser uma\",\"beneficios_title_highlight\":\"Associada SIF?\",\"benefits\":[{\"title\":\"Projetos Cooperativos\",\"description\":\"Participação em pesquisas de alto impacto com custos compartilhados entre grandes players do setor.\"},{\"title\":\"Tecnologia de Ponta\",\"description\":\"Acesso direto aos laboratórios da UFV e suporte de pesquisadores nível internacional.\"},{\"title\":\"Networking Estratégico\",\"description\":\"Conexão direta com as maiores empresas de base florestal do mundo em fóruns exclusivos.\"},{\"title\":\"Segurança e Ética\",\"description\":\"Governança robusta e transparência total na gestão de recursos e propriedade intelectual.\"}],\"logos_tag\":\"Nossa Rede\",\"logos_title_line1\":\"Empresas que\",\"logos_title_highlight\":\"Confiam na SIF\",\"cta_title\":\"Sua empresa quer fazer parte desta história?\",\"cta_text\":\"Junte-se ao maior cluster de inovação florestal da América Latina e transforme seus resultados através da ciência.\",\"cta_btn_label\":\"Seja uma Associada\",\"cta_btn_link\":\"\\/contato\",\"hero_scroll_label\":\"Ver Benefícios \"}','2026-05-27 13:20:07'),(113,'gt','{\"contact_name\":\"responsvel\",\"contact_role\":\"gestão\",\"contact_email\":\"sadasda@sdsd.com\",\"contact_whatsapp\":\"73123456\",\"contact_photo\":\"uploads\\/pages\\/gt\\/images\\/1779726839_d609b132ae77.jpg\",\"hero_image\":\"uploads\\/pages\\/gt\\/images\\/1779837120_b2ff35d875a3.jpg\",\"hero_badge\":\"Nossos Clusters de Pesquisa\",\"hero_title_line1\":\"Grupos\",\"hero_title_highlight\":\"Temáticos\",\"hero_subtitle\":\"Cooperação técnica especializada em áreas chave para a excelência do setor florestal.\",\"hero_scroll_label\":\"Explore\"}','2026-05-26 23:12:00'),(116,'treinamentos_in_company','{\"hero_image\":\"uploads\\/pages\\/treinamentos_in_company\\/images\\/1779804139_ab4b86010f98.jpg\",\"hero_badge\":\"Bespoke Solutions \",\"hero_title_line1\":\"Treinamentos \",\"hero_title_highlight\":\"In-Company \",\"hero_subtitle\":\"Soluções personalizadas em educação corporativa, levadas diretamente ao coração da sua empresa. \",\"hero_scroll_label\":\"Explorar Soluções\",\"contact_name\":\"Rodrigo Andrade\",\"contact_role\":\"Gerente\",\"contact_email\":\"email@sif.com.br\",\"contact_whatsapp\":\"73912345678\",\"contact_photo\":\"\"}','2026-05-26 23:08:14'),(124,'blog','{\"hero_image\":\"uploads\\/pages\\/blog\\/images\\/1779837446_9e09b67feaf2.avif\",\"hero_badge\":\"SIF Media Center\",\"hero_title_line1\":\"Blog e\",\"hero_title_highlight\":\"Notícias\",\"hero_subtitle\":\"Conhecimento técnico, inovações e as principais atualizações da Sociedade de Investigações Florestais.\",\"hero_scroll_label\":\"Nossas Notícias \"}','2026-05-26 23:19:37'),(127,'projetos','{\"hero_image\":\"uploads\\/pages\\/projetos\\/images\\/1779837600_1eca817694c5.jpg\",\"hero_badge\":\"P&D+ I Estratégico.\",\"hero_title_line1\":\"Nossos\",\"hero_title_highlight\":\"Projetos\",\"hero_subtitle\":\"Transformando desafios em soluções aplicadas através de pesquisas de vanguarda e inovação florestal.\",\"hero_scroll_label\":\"Nossos Projetos\",\"contact_name\":\"asdas\",\"contact_role\":\"asdsa\",\"contact_email\":\"asdsad\",\"contact_whatsapp\":\"\",\"contact_photo\":\"uploads\\/pages\\/projetos\\/images\\/1779837803_5fecd2ffdad1.jpg\"}','2026-05-26 23:23:23'),(137,'jobs','{\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1522202176988-66273c2fd55f?q=80&w=2071\",\"hero_badge\":\"Carreiras & Talentos SIF \",\"hero_title_line1\":\"Trabalhe \",\"hero_title_highlight\":\"Conosco \",\"hero_subtitle\":\"Faça parte de uma instituição que é referência nacional em ciência e tecnologia para o setor florestal.\",\"hero_scroll_label\":\"\"}','2026-05-27 12:18:12');
/*!40000 ALTER TABLE `page_configs` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projetos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `lab` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Em Andamento',
  `data_limite` date DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pdf_url` varchar(500) DEFAULT NULL,
  `tabs` longtext DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `extra_data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `projetos` WRITE;
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(150) NOT NULL COMMENT 'Ex: Diretoria, Coordenadoras, Coord. de CSC',
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `link_whatsapp` varchar(50) DEFAULT NULL COMMENT 'N??mero do WhatsApp (somente d??gitos)',
  `link_email` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_name`),
  KEY `idx_sort` (`group_name`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (2,'Diretoria','Gleison','Diretor Geral EMBRAPII  e Diretor Cientifico SIF','/nossa-gente/Diretoria/Gleison - Diretor Geral EMBRAPII  e Diretor Cientifico SIF.jpg','7312345678','gleison@sif.com',2,1,'2026-05-17 22:44:10'),(3,'Diretoria','Gumercindo','Diretor Geral da SIF','/nossa-gente/Diretoria/Gumercindo - Diretor Geral da SIF.png','','',3,1,'2026-05-17 22:44:10'),(7,'Diretoria','Michele Brandão','Gerente Executiva','/nossa-gente/Diretoria/Michele Brandão  - Gerente Executiva.jpg','','',6,1,'2026-05-17 22:44:10'),(8,'Coordenadoras','Camila','Coord. Produtos e Serviços','/nossa-gente/Coordenadoras/Camila - Coord. Produtos e Serviços.png','','',1,1,'2026-05-17 22:44:10'),(9,'Coordenadoras','Cintia','Coord da Fudação SIF e EMBRAPII','/nossa-gente/Coordenadoras/Cintia - Coord da Fudação SIF e EMBRAPII.png','','',2,1,'2026-05-17 22:44:10'),(13,'Coordenadoras','Helen','Coord de Inovação e Projetos','/nossa-gente/Coordenadoras/Helen  - Coord de Inovação e Projetos.png','','',5,1,'2026-05-17 22:44:10'),(15,'Coordenadoras','Larissa','Coord. de CSC','/nossa-gente/Coordenadoras/Larissa  - Coord. de CSC.png','','',7,1,'2026-05-17 22:44:10'),(16,'Coordenadoras','Ângela Silva','Coord. de Rh e Faciliities','/nossa-gente/Coordenadoras/Ângela Silva - Coord. de Rh e Faciliities.png','','',8,1,'2026-05-17 22:44:10'),(18,'Coord. Fundação SIF & EMBRAPII','Flávia','Estagiária','/nossa-gente/Coordenações/Coord. Fundação SIF e EMBRAPII/Flávia - Estagiária.png','','',1,1,'2026-05-17 22:44:10'),(19,'Coord. Fundação SIF & EMBRAPII','Gabriela Camilo','Gestora de Convênios','/nossa-gente/Coordenações/Coord. Fundação SIF e EMBRAPII/Gabriela Camilo - Gestora de Convênios.png','','',2,1,'2026-05-17 22:44:10'),(20,'Coord. Fundação SIF & EMBRAPII','Otávio Silveira','Estagiário','/nossa-gente/Coordenações/Coord. Fundação SIF e EMBRAPII/Otávio Silveira - Estagiário.png','','',3,1,'2026-05-17 22:44:10'),(22,'Coord. Inovação e Projetos','Tamara Braga','Analista de Inovação','/nossa-gente/Coordenações/Coordenação Inovação e Projetos/Tamara Braga - Analista de Inovação.png','','',1,1,'2026-05-17 22:44:10'),(23,'Coord. Inovação e Projetos','Thamires Carvalho','Analista de Proejtos','/nossa-gente/Coordenações/Coordenação Inovação e Projetos/Thamires Carvalho - Analista de Proejtos.png','','',2,1,'2026-05-17 22:44:10'),(24,'Coord. de CSC','Adilson Abranches','Informática','/nossa-gente/Coordenações/Coordenação de CSC/Adilson Abranches - Informática.png','','',1,1,'2026-05-17 22:44:10'),(25,'Coord. de CSC','Joyce Aquino','Contratos Internos','/nossa-gente/Coordenações/Coordenação de CSC/Joyce Aquino - Contratos Internos.png','','',2,1,'2026-05-17 22:44:10'),(29,'Coord. de CSC','Kellen Souza','Compras','/nossa-gente/Coordenações/Coordenação de CSC/Kellen Souza - Compras.png','','',3,1,'2026-05-17 22:44:10'),(31,'Coord. de CSC','Lidiane Heleno','Contas a Pagar','/nossa-gente/Coordenações/Coordenação de CSC/Lidiane Heleno - Contas a Pagar.png','','',4,1,'2026-05-17 22:44:10'),(35,'Coord. de CSC','Mauricio Seiffer','Estagiário','/nossa-gente/Coordenações/Coordenação de CSC/Mauricio Seiffer - Estagiário.png','','',6,1,'2026-05-17 22:44:10'),(36,'Coord. de CSC','Rafaela Vilar','Contas a Receber','/nossa-gente/Coordenações/Coordenação de CSC/Rafaela Vilar - Contas a Receber.png','','',7,1,'2026-05-17 22:44:10'),(38,'Coord. de CSC','Silmara Pena','Controle Financeiro','/nossa-gente/Coordenações/Coordenação de CSC/Silmara Pena  - Controle Financeiro.png','','',8,1,'2026-05-17 22:44:10'),(40,'Coord. de Produtos e Serviços','Angelina Melo','GT Sociedade','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Angelina Melo - GT Sociedade.png','','',1,1,'2026-05-17 22:44:10'),(42,'Coord. de Produtos e Serviços','Giovanna Oliveira','GT Colheita e Logística','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Giovanna Oliveira - GT Colheita e Logística.png','','',2,1,'2026-05-17 22:44:10'),(43,'Coord. de Produtos e Serviços','Juliana Melo','GT Carvão Vegetal','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Juliana Melo - GT Carvão Vegetal.png','','',3,1,'2026-05-17 22:44:10'),(44,'Coord. de Produtos e Serviços','Laís Luz','Analista de Eventos','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Laís Luz - Analista de Eventos.png','','',4,1,'2026-05-17 22:44:10'),(45,'Coord. de Produtos e Serviços','Lucas Sousa','Assistente de Comunicação e Marketing','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Lucas Sousa - Assistente de Comunicação e Marketing.png','','',5,1,'2026-05-17 22:44:10'),(46,'Coord. de Produtos e Serviços','Mateus Costa','Analista de Comunicação e Marketing','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Mateus Costa - Analista de Comunicação e Marketing.png','','',6,1,'2026-05-17 22:44:10'),(48,'Coord. de Produtos e Serviços','Mirian Valente','GT Restauração','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Mirian Valente - GT Restauração.png','','',7,1,'2026-05-17 22:44:10'),(50,'Coord. de Produtos e Serviços','Nathália Ramos','GT Bambu','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Nathália Ramos - GT Bambu.png','','',8,1,'2026-05-17 22:44:10'),(52,'Coord. de Produtos e Serviços','Otávio Fernandes','GT Segurança','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Otávio Fernandes - GT Segurança.png','','',10,1,'2026-05-17 22:44:10'),(54,'Coord. de Produtos e Serviços','Pedro Almada','Analista Comercial','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Pedro Almada - Analista Comercial.png','','',12,1,'2026-05-17 22:44:10'),(55,'Coord. de Produtos e Serviços','Samuel Souza','GT Ferroligas','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Samuel Souza - GT Ferroligas.png','','',13,1,'2026-05-17 22:44:10'),(56,'Coord. de Produtos e Serviços','Silas Sardinha','GT Manejo','/nossa-gente/Coordenações/Coordenação de Produtos e Serviços/Silas Sardinha - GT Manejo.png','','',14,1,'2026-05-17 22:44:10'),(59,'Coord. de RH & Facilities','Adão Vitorio','Recepção','/nossa-gente/Coordenações/Coordenação de RH/Adão Vitorio - Recepção.png','','',1,1,'2026-05-17 22:44:10'),(60,'Coord. de RH & Facilities','Ana Clarisse','Estagiária','/nossa-gente/Coordenações/Coordenação de RH/Ana Clarisse - Estagiária.png','','',2,1,'2026-05-17 22:44:10'),(61,'Coord. de RH & Facilities','Maria Auxiliadora','Serviços Gerais','/nossa-gente/Coordenações/Coordenação de RH/Maria Auxiliadora - Serviços Gerais.png','','',3,1,'2026-05-17 22:44:10'),(62,'Coord. de RH & Facilities','Monalisa Meireles','Estagiária','/nossa-gente/Coordenações/Coordenação de RH/Monalisa Meireles - Estagiária.png','','',4,1,'2026-05-17 22:44:10'),(64,'Coord. de RH & Facilities','Roberta Finamore','Formação de RH','/nossa-gente/Coordenações/Coordenação de RH/Roberta Finamore - Formação de RH.jpg','','',5,1,'2026-05-17 22:44:10'),(66,'Coord. de RH & Facilities','Samara Soares','Analista de RH','/nossa-gente/Coordenações/Coordenação de RH/Samara Soares - Analista de RH.png','','',6,1,'2026-05-17 22:44:10'),(68,'Consultores','Andreia','Organizacional','/nossa-gente/Consultores/Andreia - Organizacional.jpg','','',1,1,'2026-05-17 22:44:10'),(70,'Consultores','Marinês','Juridico','/nossa-gente/Consultores/Marinês - Juridico.jpg','','',2,1,'2026-05-17 22:44:10'),(76,'Consultores','Rômulo','Contábil','/nossa-gente/Consultores/Rômulo - Contábil.png','','',3,1,'2026-05-17 22:44:10'),(85,'Diretoria','Gilciano','Diretor Geral Fundação SIF','/nossa-gente/Diretoria/Gilciano - Diretor Geral Fundação SIF.jpg','12345678','gilciano@sif.com',8,1,'2026-05-17 22:45:02');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `timeline_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `layout` enum('image-left','image-right') DEFAULT 'image-left',
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `timeline_items` WRITE;
/*!40000 ALTER TABLE `timeline_items` DISABLE KEYS */;
INSERT INTO `timeline_items` VALUES (1,'1974','Origem','Criação da SIF através da união entre a UFV e as principais empresas florestais do país, estabelecendo um modelo inédito de parceria universidade-empresa no Brasil.','uploads/pages/institucional/timeline/1779062866_0617831c7ba5.jpg','image-left',1,1),(2,'1975','A <span class=\"text-[#007a3d]\">Fundação</span>','Lançamento da Revista Árvore, que se consolidaria como um dos principais periódicos científicos do setor, democratizando o conhecimento gerado em âmbito acadêmico.','https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2670','image-right',2,1),(3,'2020','Unidade EMBRAPII','O credenciamento do Departamento de Engenharia Florestal da UFV como Unidade EMBRAPII Fibras Florestais, sob gestão da SIF, potencializou o aporte de recursos para projetos de alta densidade tecnológica.','https://www2.dti.ufv.br/noticias/files/fotos/1590541431.jpg','image-left',3,1),(4,'2021','Expansão e Startups','Início do Ciclo 2 da EMBRAPII, ampliando a atuação da SIF para o suporte a startups e a inserção de novos produtos tecnológicos no mercado.','https://ageflor.com.br/wp-content/uploads/2024/11/34a-Reuniao-da-Comissao-Tecnica-de-Genetica-e-Melhoramento-Florestal-CTGMF-da-SIF-Sociedade-de-Investigacoes-Florestais-990x650.jpg','image-right',4,1),(5,'2024','O Cinquentenário','Celebração de 50 anos de história, marcando a maturidade institucional e a renovação dos compromissos com a inovação sustentável e o setor produtivo nacional.','https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2674','image-right',5,1);
/*!40000 ALTER TABLE `timeline_items` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `treinamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treinamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `segment` varchar(100) DEFAULT NULL,
  `hours` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `extra_data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `treinamentos` WRITE;
/*!40000 ALTER TABLE `treinamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `treinamentos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `treinamentos_in_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treinamentos_in_company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `segment` varchar(100) DEFAULT NULL,
  `hours` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `active` tinyint(4) DEFAULT 1,
  `extra_data` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `treinamentos_in_company` WRITE;
/*!40000 ALTER TABLE `treinamentos_in_company` DISABLE KEYS */;
/*!40000 ALTER TABLE `treinamentos_in_company` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

