<?php
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
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

    $reqs      = isset($data['requirements']) ? json_encode($data['requirements']) : '[]';
    $active    = isset($data['active']) ? (int)$data['active'] : 1;
    $tipo_vaga = $data['tipo_vaga'] ?? 'Interna';
    if ($tipo_vaga === 'Externa') $tipo_vaga = 'Associadas';
    if (!in_array($tipo_vaga, ['Interna', 'Associadas', 'Germinar'], true)) $tipo_vaga = 'Interna';

    if (isset($data['id'])) {
        $sql  = "UPDATE jobs SET title=?, location=?, type=?, salary=?, description=?, requirements=?, active=?, tipo_vaga=? WHERE id=?";
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
            $data['id']
        ]);
    } else {
        $sql  = "INSERT INTO jobs (title, location, type, salary, description, requirements, active, tipo_vaga) VALUES (?,?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['title']    ?? '',
            $data['location'] ?? '',
            $data['type']     ?? '',
            $data['salary']   ?? '',
            $data['description'] ?? '',
            $reqs,
            $active,
            $tipo_vaga
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