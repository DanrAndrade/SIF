<?php
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Vaga oculta não sai na leitura pública (só no painel, com ?admin=1 e login)
    $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin();
    $stmt = $pdo->query("SELECT * FROM jobs" . ($adminMode ? '' : ' WHERE active = 1') . " ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    $data = json_decode(sif_raw_input(), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
        exit;
    }

    // Vaga sem título não é salva (aparecia como card vazio no site)
    if (trim((string)($data['title'] ?? '')) === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Informe o título da vaga.']);
        exit;
    }

    sif_ensure_schema($pdo); // garante as colunas empresa e external_url (vagas de associadas)

    $reqs      = isset($data['requirements']) ? json_encode($data['requirements']) : '[]';
    $active    = isset($data['active']) ? (int)$data['active'] : 1;
    // A categoria precisa existir (Painel › Trabalhe Conosco › Categorias de vaga)
    $cats = sif_job_categories($pdo);
    $tipo_vaga = (string)($data['tipo_vaga'] ?? '');
    if ($tipo_vaga === 'Externa') $tipo_vaga = 'Associadas';
    if (!isset($cats[$tipo_vaga])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Categoria de vaga inválida. Escolha uma das categorias cadastradas.']);
        exit;
    }

    // Categoria de só divulgação (ex.: empresas associadas): a SIF não recebe currículo.
    // Precisa do link da vaga no site da empresa; nas outras categorias, sem link.
    $empresa = null;
    $externalUrl = null;
    if ($cats[$tipo_vaga] === 'divulgacao') {
        $empresa = mb_substr(trim((string)($data['empresa'] ?? '')), 0, 150);
        $externalUrl = trim((string)($data['external_url'] ?? ''));
        if ($externalUrl !== '' && !preg_match('#^https?://#i', $externalUrl)) $externalUrl = 'https://' . $externalUrl;
        $okUrl = $externalUrl !== '' && filter_var($externalUrl, FILTER_VALIDATE_URL) && preg_match('#^https?://#i', $externalUrl);
        if (!$okUrl || mb_strlen($externalUrl) > 500) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Informe o link da vaga no site da empresa (começando com https://).']);
            exit;
        }
    }

    if (isset($data['id'])) {
        $sql  = "UPDATE jobs SET title=?, location=?, type=?, salary=?, description=?, requirements=?, active=?, tipo_vaga=?, empresa=?, external_url=? WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['title']    ?? '',
            $data['location'] ?? '',
            $data['type']     ?? '',
            $data['salary']   ?? '',
            $data['description'] ?? '',
            $reqs,
            $active,
            $tipo_vaga,
            $empresa,
            $externalUrl,
            $data['id']
        ]);
    } else {
        $sql  = "INSERT INTO jobs (title, location, type, salary, description, requirements, active, tipo_vaga, empresa, external_url) VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['title']    ?? '',
            $data['location'] ?? '',
            $data['type']     ?? '',
            $data['salary']   ?? '',
            $data['description'] ?? '',
            $reqs,
            $active,
            $tipo_vaga,
            $empresa,
            $externalUrl
        ]);
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $pdo->prepare("DELETE FROM jobs WHERE id=?")->execute([$id]);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID não informado.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);