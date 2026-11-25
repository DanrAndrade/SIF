<?php
// Gera o SQL de atualização da página Produtos e Serviços para a PRODUÇÃO.
//
// Compara o conteúdo do banco local (sif_producao) com o que está no ar
// (produtos_live.json) e leva SÓ as chaves que mudaram. O JSON_MERGE_PATCH troca
// apenas essas chaves; o resto da página (e todas as outras tabelas e páginas)
// fica como está. Pode rodar mais de uma vez.
//
// Uso: C:/xampp/php/php.exe gera_sql_produtos.php saida.sql
//   (porta do MySQL: variável SIF_DB_PORT, padrão 3306)
$base = json_decode(file_get_contents(__DIR__ . '/produtos_live.json'), true);
if (!is_array($base)) { fwrite(STDERR, "produtos_live.json inválido\n"); exit(1); }
$port = getenv('SIF_DB_PORT') ?: 3306;
$pdo = new PDO("mysql:host=127.0.0.1;port=$port;dbname=sif_producao;charset=utf8mb4", 'root', '');
$local = json_decode($pdo->query("SELECT config_json FROM page_configs WHERE page_key = 'produtos'")->fetchColumn(), true);
if (!is_array($local)) { fwrite(STDERR, "conteúdo local de produtos não encontrado\n"); exit(1); }

$patch = [];
foreach ($local as $k => $v) {
    if (!array_key_exists($k, $base) || json_encode($base[$k]) !== json_encode($v)) $patch[$k] = $v;
}
if (!$patch) { fwrite(STDERR, "nada a atualizar\n"); exit(1); }

$q = $pdo->quote(json_encode($patch, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
$sql = "-- =====================================================================\n"
     . "-- SIF: Produtos e Serviços (conteúdo das apresentações de novembro/2026)\n"
     . "-- =====================================================================\n"
     . "-- Atualiza só estas partes da página Produtos e Serviços (" . count($patch) . " campos):\n"
     . "--   aba Comercial (Sementes, Tubetes, Treinamentos In Company), aba Germinar, aba Serviços de P&D,\n"
     . "--   abas Proteção de Cultivares e Importação e Exportação, documentos do Boletim Técnico\n"
     . "--   e o título \"Conheça nossos\". Cabeçalho, boletins e demais textos ficam como estão.\n"
     . "-- Não mexe em nenhuma outra tabela nem em nenhuma outra página do site.\n"
     . "-- Campos: " . implode(', ', array_keys($patch)) . "\n"
     . "SET NAMES utf8mb4;\n"
     . "UPDATE `page_configs` SET `config_json` = JSON_MERGE_PATCH(`config_json`, $q) WHERE `page_key` = 'produtos';\n";
file_put_contents($argv[1], $sql);
echo "ok ", strlen($sql), " bytes, ", count($patch), " campos: ", implode(', ', array_keys($patch)), "\n";
