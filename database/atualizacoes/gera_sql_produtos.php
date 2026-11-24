<?php
// Gera o SQL que aplica o conteúdo novo de Produtos e Serviços (produtos_novo.json).
// JSON_MERGE_PATCH troca só as chaves listadas; o resto da página fica como está.
$novo = file_get_contents(__DIR__ . '/produtos_novo.json');
json_decode($novo); if (json_last_error()) { fwrite(STDERR, "json inválido\n"); exit(1); }
$pdo = new PDO('mysql:host=127.0.0.1;port=3307;dbname=sif_producao;charset=utf8mb4', 'root', '');
$q = $pdo->quote($novo);
$sql = "-- =====================================================================\n"
     . "-- SIF: Produtos e Serviços (conteúdo das apresentações de 19/11/2026)\n"
     . "-- =====================================================================\n"
     . "-- Atualiza só estas partes da página Produtos e Serviços:\n"
     . "--   aba Comercial (Sementes, Tubetes, Treinamentos In Company), aba Germinar, aba Serviços de P&D,\n"
     . "--   abas novas Proteção de Cultivares e Importação e Exportação (com o texto que\n"
     . "--   já estava cadastrado nas sub-abas do Comercial), documentos do Boletim Técnico\n"
     . "--   e o título \"Conheça nossos\". Cabeçalho, boletins e demais textos ficam como estão.\n"
     . "SET NAMES utf8mb4;\n"
     . "UPDATE `page_configs` SET `config_json` = JSON_MERGE_PATCH(`config_json`, $q) WHERE `page_key` = 'produtos';\n";
file_put_contents($argv[1], $sql);
echo "ok ", strlen($sql), " bytes\n";
