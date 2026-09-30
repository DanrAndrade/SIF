<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';

$method = $_SERVER['REQUEST_METHOD'];

// --- Auto-migração: garante a coluna do site da empresa (idempotente) ---
// A produção ganha o campo automaticamente ao subir este arquivo.
try {
    if (!$pdo->query("SHOW COLUMNS FROM associadas LIKE 'website'")->fetch()) {
        $pdo->exec("ALTER TABLE associadas ADD COLUMN website VARCHAR(500) NULL AFTER address");
    }
} catch (Exception $e) { /* segue sem a coluna se algo falhar */ }

// ─────────────────────────────────────────────────────────
// HELPER — Upload organizado para a pasta de associadas
// ─────────────────────────────────────────────────────────
function uploadAssociadaLogo($file): ?string {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;

    $dir = 'uploads/pages/associadas/logos/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $ext    = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $name   = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $dir . $name;

    if (!move_uploaded_file($file['tmp_name'], $target)) return null;

    // Converte logo para WebP; se não der, comprime o original.
    $webp = convertToWebp($target, 400, 85);
    if ($webp) return $webp;
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
        compressImage($target, 400, 90); // logos pequenos, alta qualidade
    }

    return str_replace('\\', '/', $target);
}

// ─────────────────────────────────────────────────────────
// GET — Lista todos os parceiros (ativos e inativos)
// GET /associadas.php
// GET /associadas.php?active_only=1   (somente ativos)
// ─────────────────────────────────────────────────────────
if ($method === 'GET') {
    $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';

    $sql  = "SELECT * FROM associadas";
    $sql .= $activeOnly ? " WHERE active = 1" : "";
    $sql .= " ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// ─────────────────────────────────────────────────────────
// POST — Cria nova empresa associada
// FormData: name, logo (file, opcional)
// (não atende quando vier com _method=PUT — isso vira UPDATE abaixo)
// ─────────────────────────────────────────────────────────
if ($method === 'POST' && empty($_POST['_method'])) {
    $name = trim($_POST['name'] ?? '');
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Nome da empresa é obrigatório.']);
        exit;
    }

    // Obtém a maior ordem atual
    $maxOrder = $pdo->query("SELECT COALESCE(MAX(sort_order), 0) FROM associadas")->fetchColumn();

    $logoUrl = null;
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $logoUrl = uploadAssociadaLogo($_FILES['logo']);
    } elseif (!empty($_POST['logo_url'])) {
        // Aceita URL/path direto (ex: /logos/Suzano.png) para seed inicial
        $logoUrl = trim($_POST['logo_url']);
    }

    $address = isset($_POST['address']) ? trim($_POST['address']) : null;
    $website = isset($_POST['website']) ? trim($_POST['website']) : null;

    $stmt = $pdo->prepare("
        INSERT INTO associadas (name, logo_url, address, website, sort_order, active)
        VALUES (?, ?, ?, ?, ?, 1)
    ");
    $stmt->execute([$name, $logoUrl, $address, $website, $maxOrder + 1]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

// ─────────────────────────────────────────────────────────
// PUT — Atualiza empresa associada (nome, logo, active, sort)
// Aceita PUT real OU POST + _method=PUT (FormData não suporta PUT nativo).
// ─────────────────────────────────────────────────────────
if ($method === 'PUT' || ($method === 'POST' && ($_POST['_method'] ?? '') === 'PUT')) {
    // PUT via FormData requer leitura manual
    $data = [];
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (str_contains($contentType, 'application/json')) {
        $raw  = sif_raw_input();
        $data = json_decode($raw, true) ?? [];
    } else {
        // FormData via POST tunelado (método _method=PUT) - suporte via POST com _method
        $data = $_POST;
    }

    $id = intval($data['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID inválido.']);
        exit;
    }

    $fields = [];
    $values = [];

    if (isset($data['name']) && trim($data['name']) !== '') {
        $fields[] = 'name = ?';
        $values[] = trim($data['name']);
    }

    if (isset($data['address'])) {
        $fields[] = 'address = ?';
        $values[] = trim($data['address']);
    }

    if (isset($data['website'])) {
        $fields[] = 'website = ?';
        $values[] = trim($data['website']);
    }

    if (isset($data['active'])) {
        $fields[] = 'active = ?';
        $values[] = intval($data['active']);
    }

    if (isset($data['sort_order'])) {
        $fields[] = 'sort_order = ?';
        $values[] = intval($data['sort_order']);
    }

    // Upload de novo logo (via _method=PUT simulado)
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $logoUrl = uploadAssociadaLogo($_FILES['logo']);
        if ($logoUrl) {
            $fields[] = 'logo_url = ?';
            $values[] = $logoUrl;
        }
    }

    if (!empty($fields)) {
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE associadas SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
    }

    echo json_encode(['success' => true]);
    exit;
}

// ─────────────────────────────────────────────────────────
// DELETE — Remove empresa associada
// DELETE /associadas.php?id=5
// ─────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID inválido.']);
        exit;
    }

    // Obtém logo para deletar arquivo físico
    $stmt = $pdo->prepare("SELECT logo_url FROM associadas WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && $row['logo_url'] && file_exists($row['logo_url'])) {
        @unlink($row['logo_url']);
    }

    $stmt = $pdo->prepare("DELETE FROM associadas WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
?>
