<?php
/**
 * ===================================================================
 *  CONVERSÃO ÚNICA DE IMAGENS PARA WEBP  —  RODAR UMA VEZ E APAGAR
 * ===================================================================
 *  O que faz:
 *   1. Converte para .webp todas as imagens raster em uploads/ e
 *      nossa-gente/ (jpg, jpeg, png, gif, bmp), apagando as originais.
 *   2. Atualiza TODAS as referências no banco (troca .jpg/.png/... pelo
 *      novo .webp em todas as colunas de texto de todas as tabelas).
 *
 *  As fotos da equipe (nossa-gente/ -> team_members.image_url) são as
 *  únicas imagens reais — o script converte e reaponta todas, sem perder.
 *
 *  COMO RODAR (no servidor):
 *   1. Suba este arquivo para .../sif-novo-h7k2x9/sif-api/
 *   2. Acesse no navegador:
 *        https://sif.org.br/sif-novo-h7k2x9/sif-api/converter_webp.php?key=CONVERTER_SIF_2026
 *   3. Confira o relatório.
 *   4. APAGUE este arquivo do servidor (segurança).
 *
 *  Seguro de rodar mais de uma vez (imagens já .webp são ignoradas).
 * ===================================================================
 */

@set_time_limit(0);
@ini_set('memory_limit', '512M');

require_once 'db.php';
require_once 'image_utils.php';

header('Content-Type: text/plain; charset=utf-8');

$KEY = 'CONVERTER_SIF_2026';
if (($_GET['key'] ?? '') !== $KEY) {
    http_response_code(403);
    echo "Acesso negado. Use ?key=CONVERTER_SIF_2026\n";
    exit;
}

$apiDir  = __DIR__;                 // .../sif-api
$siteDir = dirname($apiDir);        // .../sif-novo-h7k2x9 (raiz da subpasta)

$norm = fn($p) => str_replace('\\', '/', $p);

// Pastas a varrer => prefixo de como o caminho aparece no banco
$targets = [
    // arquivos em sif-api/uploads/...  -> banco guarda "uploads/..."
    ['dir' => $apiDir . '/uploads',      'strip' => $norm($apiDir) . '/',  'prefix' => ''],
    // arquivos em (raiz)/nossa-gente/.. -> banco guarda "/nossa-gente/..."
    ['dir' => $siteDir . '/nossa-gente', 'strip' => $norm($siteDir) . '/', 'prefix' => '/'],
];

$map = [];          // caminho-no-banco-antigo => novo (.webp)
$convertidos = 0; $jaWebp = 0; $falhas = 0;

echo "== CONVERSAO DE IMAGENS PARA WEBP ==\n\n";

foreach ($targets as $t) {
    if (!is_dir($t['dir'])) { echo "(pasta nao existe: {$t['dir']})\n"; continue; }
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($t['dir'], FilesystemIterator::SKIP_DOTS)
    );
    foreach ($it as $file) {
        if (!$file->isFile()) continue;
        $ext = strtolower($file->getExtension());
        if ($ext === 'webp') { $jaWebp++; continue; }
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'bmp'])) continue;

        $fullOld = $norm($file->getPathname());
        $relOld  = $t['prefix'] . str_replace($t['strip'], '', $fullOld);

        $webpFull = convertToWebp($fullOld);
        if (!$webpFull) { $falhas++; echo "FALHOU: {$relOld}\n"; continue; }

        $relNew = $t['prefix'] . str_replace($t['strip'], '', $norm($webpFull));
        if ($relOld !== $relNew) {
            $map[$relOld] = $relNew;
            // Versão com barras escapadas, para campos JSON ("uploads\/pages\/...")
            $escOld = str_replace('/', '\\/', $relOld);
            if ($escOld !== $relOld) $map[$escOld] = str_replace('/', '\\/', $relNew);
        }
        $convertidos++;
    }
}

echo "\nArquivos convertidos: {$convertidos} | ja .webp: {$jaWebp} | falhas: {$falhas}\n";
echo "Referencias mapeadas: " . count($map) . "\n\n";

if (empty($map)) {
    echo "Nada a atualizar no banco.\n";
    exit;
}

// Ordena chaves mais longas primeiro (strtr ja faz, mas garante clareza)
uksort($map, fn($a, $b) => strlen($b) - strlen($a));

// Atualiza TODAS as colunas de texto de TODAS as tabelas
$tabelas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
$totalUpdates = 0;

foreach ($tabelas as $tabela) {
    // Descobre colunas e a chave primaria
    $cols = $pdo->query("SHOW COLUMNS FROM `{$tabela}`")->fetchAll(PDO::FETCH_ASSOC);
    $pk = null; $textCols = [];
    foreach ($cols as $c) {
        if (($c['Key'] ?? '') === 'PRI' && $pk === null) $pk = $c['Field'];
        $type = strtolower($c['Type']);
        if (preg_match('/char|text|json|blob/', $type)) $textCols[] = $c['Field'];
    }
    if (!$pk || empty($textCols)) continue;

    $rows = $pdo->query("SELECT * FROM `{$tabela}`")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $row) {
        $sets = []; $vals = [];
        foreach ($textCols as $col) {
            $orig = $row[$col];
            if ($orig === null || $orig === '') continue;
            $novo = strtr($orig, $map);
            if ($novo !== $orig) { $sets[] = "`{$col}` = ?"; $vals[] = $novo; }
        }
        if ($sets) {
            $vals[] = $row[$pk];
            $sql = "UPDATE `{$tabela}` SET " . implode(', ', $sets) . " WHERE `{$pk}` = ?";
            $pdo->prepare($sql)->execute($vals);
            $totalUpdates++;
            echo "Atualizado: {$tabela} #{$row[$pk]}\n";
        }
    }
}

echo "\nLinhas atualizadas no banco: {$totalUpdates}\n";
echo "\n== CONCLUIDO ==  Agora APAGUE este arquivo do servidor.\n";
