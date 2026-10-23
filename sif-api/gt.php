<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM gt WHERE slug = ?" . (sif_is_admin() ? '' : ' AND active = 1'));
        $stmt->execute([$_GET['slug']]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) { http_response_code(404); echo json_encode(['error' => 'Não encontrado']); exit; }
        echo json_encode($item);
    } else {
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin(); // itens ocultos só com login
        if ($adminMode) {
            $stmt = $pdo->query("SELECT * FROM gt ORDER BY id DESC");
        } else {
            $stmt = $pdo->query("SELECT * FROM gt WHERE active = 1 ORDER BY id DESC");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

if ($method === 'POST') {

    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = ((int)($_POST['active'] ?? 1)) ? 1 : 0;
        if (!$id) {
            echo json_encode(["success" => false, "error" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE gt SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    function uploadGtImage($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/gt/";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $ext  = sif_safe_ext($file['tmp_name'], 'image', $file['name']); // tipo real, não o nome
        if (!$ext) return null;
        $name = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }
        return null;
    }

    $id               = $_POST['id']               ?? null;
    $slug             = $_POST['slug']             ?? '';
    $title            = $_POST['title']            ?? '';
    $description      = sif_clean_html($_POST['description']      ?? '');
    $icon             = $_POST['icon']             ?? 'Target';
    $color            = $_POST['color']            ?? '#059669';
    $bg_color         = $_POST['bg_color']         ?? '#ECFDF5';
    $content_title    = $_POST['content_title']    ?? null;
    $content_subtitle = $_POST['content_subtitle'] ?? null;
    $active           = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    // Na edição, se o formulário não mandar 'active', mantém o estado atual (não republica item oculto)
    $activeUpd  = isset($_POST['active']) ? (int)$_POST['active'] : null;
    $extra_data       = sif_clean_json($_POST['extra_data']       ?? null);

    $image_url = uploadGtImage($_FILES['image'] ?? null);
    // Arquivo enviado mas recusado (tipo/tamanho): avisa em vez de salvar sem a imagem
    if (!$image_url && isset($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        echo json_encode(["status" => "error", "success" => false, "message" => "A imagem não foi aceita. Use JPG, PNG, WebP ou GIF de até 10 MB."]);
        exit;
    }

    if ($id) {
        if ($image_url) {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 image_url=?, content_title=?, content_subtitle=?, active=COALESCE(?, active), extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $image_url, $content_title, $content_subtitle, $activeUpd, $extra_data, $id]);
        } else {
            $stmt = $pdo->prepare(
                "UPDATE gt SET slug=?, title=?, description=?, icon=?, color=?, bg_color=?,
                 content_title=?, content_subtitle=?, active=COALESCE(?, active), extra_data=? WHERE id=?"
            );
            $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
                $content_title, $content_subtitle, $activeUpd, $extra_data, $id]);
        }
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO gt (slug, title, description, icon, color, bg_color, image_url, content_title, content_subtitle, active, extra_data)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$slug, $title, $description, $icon, $color, $bg_color,
            $image_url, $content_title, $content_subtitle, $active, $extra_data]);
    }
    // Botão "remover imagem" do painel (só quando não veio imagem nova)
    if (!empty($id) && ($_POST['remove_image'] ?? '') === '1' && empty($_FILES['image']['tmp_name'])) {
        $pdo->prepare("UPDATE gt SET image_url = '' WHERE id = ?")->execute([$id]);
    }
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $pdo->prepare("DELETE FROM gt WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "ID não fornecido"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
