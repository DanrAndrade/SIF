<?php
/**
 * Cleanup de duplicatas criadas pelo bug do POST/PUT que ja foi corrigido.
 * - team_members: deduplica por (name, group_name) mantendo o que tem mais dados
 * - associadas:  deduplica por name mantendo o que tem logo_url preenchido
 * Rodar uma vez: http://localhost/sif-api/cleanup_duplicates.php
 */
require_once 'db.php';
header('Content-Type: application/json');

$results = [];

// ── team_members ──────────────────────────────────────────
// Para cada (name, group_name), mantém o ID com MAIS dados preenchidos
// (email + whatsapp + photo). Deleta os demais.
$stmt = $pdo->query("
    SELECT id, name, group_name, link_email, link_whatsapp, photo_url
    FROM team_members
    ORDER BY id ASC
");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$score = fn($r) =>
    (empty($r['link_email']) ? 0 : 4) +
    (empty($r['link_whatsapp']) ? 0 : 4) +
    (empty($r['photo_url']) ? 0 : 1);

$bestByKey = [];
foreach ($rows as $r) {
    $key = $r['name'] . '||' . $r['group_name'];
    if (!isset($bestByKey[$key]) || $score($r) > $score($bestByKey[$key])) {
        $bestByKey[$key] = $r;
    }
}
$keepIds = array_map(fn($r) => $r['id'], $bestByKey);

$totalBefore = count($rows);
$deleted = 0;
foreach ($rows as $r) {
    if (!in_array($r['id'], $keepIds, true)) {
        $del = $pdo->prepare("DELETE FROM team_members WHERE id = ?");
        $del->execute([$r['id']]);
        $deleted++;
    }
}
$results['team_members'] = ['before' => $totalBefore, 'kept' => count($keepIds), 'deleted' => $deleted];

// ── associadas ────────────────────────────────────────────
$stmt = $pdo->query("SELECT id, name, logo_url FROM associadas ORDER BY id ASC");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$scoreA = fn($r) => (empty($r['logo_url']) ? 0 : 1);
$bestByName = [];
foreach ($rows as $r) {
    $k = $r['name'];
    if (!isset($bestByName[$k]) || $scoreA($r) > $scoreA($bestByName[$k])) {
        $bestByName[$k] = $r;
    }
}
$keepIds = array_map(fn($r) => $r['id'], $bestByName);

$totalBefore = count($rows);
$deleted = 0;
foreach ($rows as $r) {
    if (!in_array($r['id'], $keepIds, true)) {
        $del = $pdo->prepare("DELETE FROM associadas WHERE id = ?");
        $del->execute([$r['id']]);
        $deleted++;
    }
}
$results['associadas'] = ['before' => $totalBefore, 'kept' => count($keepIds), 'deleted' => $deleted];

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
