<?php
require 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar

$method = $_SERVER['REQUEST_METHOD'];

// GET: Listar candidatos (Só Admin)
if ($method === 'GET') {
    if (!sif_can('candidates')) { if (sif_is_admin()) sif_deny();
        http_response_code(401); 
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }
    // Agora buscamos também o status
    $stmt = $pdo->query("SELECT * FROM candidates ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// POST: Criar (Público) OU Atualizar Status (Admin)
elseif ($method === 'POST') {
    
    // Verificamos se é um upload de arquivo (Candidatura do Site)
    if (isset($_FILES['cv']) || isset($_POST['job_title'])) {
        // ... Lógica de Upload (CÓDIGO ORIGINAL MANTIDO ABAIXO) ...
        $str = fn($k, $max) => is_scalar($_POST[$k] ?? null) ? mb_substr(trim((string)$_POST[$k]), 0, $max) : '';
        $name = $str('name', 120);
        $email = $str('email', 150);
        $phone = $str('phone', 40);
        $linkedin = $str('linkedin', 300);
        $jobTitle = $str('job_title', 200) ?: 'Banco de Talentos';
        $jobId = isset($_POST['job_id']) && ctype_digit((string)$_POST['job_id']) ? (int)$_POST['job_id'] : null;

        // Robôs: campo escondido preenchido = finge que deu certo e descarta
        if ($str('website', 10) !== '') { echo json_encode(['success' => true]); exit; }
        if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Preencha nome e um e-mail válido.']);
            exit;
        }
        // Limite por IP: até 6 candidaturas por hora
        $ip = sif_client_ip();
        if (sif_attempts($pdo, 'cv', $ip, 60) >= 6) {
            http_response_code(429);
            echo json_encode(['success' => false, 'error' => 'Muitos envios seguidos. Tente novamente mais tarde.']);
            exit;
        }
        sif_attempt_add($pdo, 'cv', $ip);

        $cvFilename = null;
        if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
            // Limite de 10MB para o currículo (rede de segurança — o front já valida)
            if ($_FILES['cv']['size'] > 10 * 1024 * 1024) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Currículo muito grande. Máximo 10MB.']);
                exit;
            }
            // Currículos ficam em uploads/cvs/ — pasta protegida por .htaccess
            // (acesso direto via web é bloqueado; só o download.php autenticado lê).
            $uploadDir = 'uploads/cvs/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            // Garante a proteção da pasta (bloqueia acesso direto via navegador)
            $htaccessPath = $uploadDir . '.htaccess';
            if (!file_exists($htaccessPath)) {
                @file_put_contents($htaccessPath,
                    "<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n" .
                    "<IfModule !mod_authz_core.c>\n    Order deny,allow\n    Deny from all\n</IfModule>\n"
                );
            }
            // Só PDF ou Word, pelo tipo real do arquivo
            $ext = sif_safe_ext($_FILES['cv']['tmp_name'], 'pdf,doc', $_FILES['cv']['name']);
            if (!$ext) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Envie o currículo em PDF ou Word (.doc/.docx).']);
                exit;
            }
            // Nome único (nunca sobrescreve) + nome do candidato para facilitar no painel
            $cleanName = substr(preg_replace('/[^a-zA-Z0-9]/', '', $name), 0, 40);
            $newFilename = time() . '_' . bin2hex(random_bytes(4)) . ($cleanName ? '_' . $cleanName : '') . '.' . $ext;
            if (move_uploaded_file($_FILES['cv']['tmp_name'], $uploadDir . $newFilename)) {
                $cvFilename = $newFilename;
            }
        }

        try {
            // Inserimos com status padrão 'unread'
            $sql = "INSERT INTO candidates (job_id, job_title, name, email, phone, linkedin, cv_filename, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$jobId, $jobTitle, $name, $email, $phone, $linkedin, $cvFilename]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            error_log('[sif-api] candidates: ' . $e->getMessage());
            echo json_encode(['success' => false, 'error' => 'Não foi possível enviar a candidatura. Tente de novo.']);
        }
    } 
    // Se não for upload, é o Admin atualizando o STATUS (JSON)
    else {
        $data = json_decode(sif_raw_input(), true);
        
        if (!sif_can('candidates')) { if (sif_is_admin()) sif_deny();
            http_response_code(401); exit;
        }

        if (isset($data['id']) && isset($data['status'])) {
            $stmt = $pdo->prepare("UPDATE candidates SET status=? WHERE id=?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
        }
    }
}
?>