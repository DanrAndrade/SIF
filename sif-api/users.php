<?php
/**
 * Usuários do painel (Painel › Usuários). Só ADMINISTRADOR, exceto
 * "trocar minha senha" e a lista pública de responsáveis (nomes).
 *
 *   GET  /users.php                    → lista (admin)
 *   GET  /users.php?responsaveis=1     → [{id,name,cargo}] de usuários ativos (logado) — p/ escolher autores do blog
 *   POST /users.php  JSON {action: 'save', id?, name, cargo, email, password?, role, modules[], gt_ids[], active}
 *   POST /users.php  JSON {action: 'delete', id}
 *   POST /users.php  JSON {action: 'my_password', current, new}
 */
require 'db.php';
require_once 'api_guard.php';

$method = $_SERVER['REQUEST_METHOD'];
if (sif_is_admin()) sif_ensure_schema($pdo);

function sif_user_row(array $u): array {
    return [
        'id'         => (int)$u['id'],
        'name'       => $u['name'] ?? '',
        'cargo'      => $u['cargo'] ?? '',
        'email'      => $u['email'],
        'role'       => ($u['role'] ?? 'editor') === 'admin' ? 'admin' : 'editor',
        'modules'    => array_values(array_intersect(sif_json_list($u['modules'] ?? null), SIF_MODULES)),
        'gt_ids'     => array_map('intval', sif_json_list($u['gt_ids'] ?? null)),
        'active'     => (int)($u['active'] ?? 1),
        'last_login' => $u['last_login'] ?? null,
    ];
}

function sif_active_admin_count(PDO $pdo, int $exceptId = 0): int {
    $st = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE COALESCE(role,'admin') = 'admin' AND COALESCE(active,1) = 1 AND id <> ?");
    $st->execute([$exceptId]);
    return (int)$st->fetchColumn();
}

if ($method === 'GET') {
    if (!sif_is_admin()) { http_response_code(401); echo json_encode(['success' => false, 'error' => 'nao_autorizado', 'message' => 'Faça login.']); exit; }

    if (isset($_GET['responsaveis'])) {
        $rows = $pdo->query("SELECT id, name, cargo FROM admins WHERE COALESCE(active,1) = 1 ORDER BY name, id")->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array_map(fn($r) => [
            'id' => (int)$r['id'], 'name' => $r['name'] ?: ('Usuário #' . $r['id']), 'cargo' => $r['cargo'] ?? '',
        ], $rows));
        exit;
    }

    if (!sif_is_superadmin()) sif_deny('Só administradores podem ver a lista de usuários.');
    $rows = $pdo->query("SELECT * FROM admins ORDER BY COALESCE(active,1) DESC, name, email")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(array_map('sif_user_row', $rows));
    exit;
}

if ($method !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Método não permitido.']); exit; }

$data = json_decode(sif_raw_input(), true) ?: [];
$action = $data['action'] ?? '';
$me = sif_user();

// --- Trocar a própria senha (qualquer usuário logado)
if ($action === 'my_password') {
    $new = (string)($data['new'] ?? '');
    if (strlen($new) < 8) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'A nova senha precisa ter pelo menos 8 caracteres.']); exit; }
    if (sif_attempts($pdo, 'senha', 'u' . $me['id'], 15) >= 5) {
        http_response_code(429); echo json_encode(['success' => false, 'message' => 'Muitas tentativas. Aguarde 15 minutos.']); exit;
    }
    $st = $pdo->prepare("SELECT password FROM admins WHERE id = ?");
    $st->execute([$me['id']]);
    if (!password_verify((string)($data['current'] ?? ''), (string)$st->fetchColumn())) {
        sif_attempt_add($pdo, 'senha', 'u' . $me['id']);
        http_response_code(400); echo json_encode(['success' => false, 'message' => 'A senha atual não confere.']); exit;
    }
    $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?")->execute([password_hash($new, PASSWORD_DEFAULT), $me['id']]);
    echo json_encode(['success' => true]);
    exit;
}

if (!sif_is_superadmin()) sif_deny('Só administradores podem cadastrar ou alterar usuários.');

// --- Criar / editar
if ($action === 'save') {
    $id     = (int)($data['id'] ?? 0);
    $name   = trim((string)($data['name'] ?? ''));
    $cargo  = trim((string)($data['cargo'] ?? ''));
    $email  = strtolower(trim((string)($data['email'] ?? '')));
    $pass   = (string)($data['password'] ?? '');
    $role   = ($data['role'] ?? '') === 'editor' ? 'editor' : 'admin';
    $active = !empty($data['active']) ? 1 : 0;
    $modules = array_values(array_intersect(sif_json_list($data['modules'] ?? []), SIF_MODULES));
    $gtIds   = array_values(array_unique(array_filter(array_map('intval', sif_json_list($data['gt_ids'] ?? [])))));

    $fail = function (string $m) { http_response_code(400); echo json_encode(['success' => false, 'message' => $m]); exit; };
    if ($name === '') $fail('Informe o nome.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $fail('E-mail inválido.');
    if (!$id && strlen($pass) < 8) $fail('A senha precisa ter pelo menos 8 caracteres.');
    if ($id && $pass !== '' && strlen($pass) < 8) $fail('A nova senha precisa ter pelo menos 8 caracteres.');

    $dup = $pdo->prepare("SELECT id FROM admins WHERE LOWER(email) = ? AND id <> ?");
    $dup->execute([$email, $id]);
    if ($dup->fetch()) $fail('Já existe um usuário com esse e-mail.');

    // Não deixar o painel sem nenhum administrador ativo
    if ($id && ($role !== 'admin' || !$active) && sif_active_admin_count($pdo, $id) === 0) {
        $fail('Este é o último administrador ativo. Cadastre outro administrador antes de mudar o perfil ou desativar.');
    }
    if ($id === $me['id'] && !$active) $fail('Você não pode desativar o seu próprio usuário.');

    $mods = json_encode($role === 'admin' ? [] : $modules);
    $gts  = json_encode($gtIds);
    if ($id) {
        $pdo->prepare("UPDATE admins SET name=?, cargo=?, email=?, role=?, modules=?, gt_ids=?, active=? WHERE id=?")
            ->execute([$name, $cargo, $email, $role, $mods, $gts, $active, $id]);
        if ($pass !== '') $pdo->prepare("UPDATE admins SET password=? WHERE id=?")->execute([password_hash($pass, PASSWORD_DEFAULT), $id]);
    } else {
        $pdo->prepare("INSERT INTO admins (name, cargo, email, password, role, modules, gt_ids, active) VALUES (?,?,?,?,?,?,?,?)")
            ->execute([$name, $cargo, $email, password_hash($pass, PASSWORD_DEFAULT), $role, $mods, $gts, $active]);
        $id = (int)$pdo->lastInsertId();
    }
    $st = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
    $st->execute([$id]);
    echo json_encode(['success' => true, 'user' => sif_user_row($st->fetch(PDO::FETCH_ASSOC))]);
    exit;
}

// --- Excluir
if ($action === 'delete') {
    $id = (int)($data['id'] ?? 0);
    if ($id === $me['id']) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'Você não pode excluir o seu próprio usuário.']); exit; }
    if (sif_active_admin_count($pdo, $id) === 0) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'Não é possível excluir o último administrador.']); exit; }
    $pdo->prepare("DELETE FROM admins WHERE id = ?")->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Ação desconhecida.']);
