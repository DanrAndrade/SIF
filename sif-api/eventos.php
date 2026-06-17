<?php
require_once 'db.php';
require_once 'image_utils.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

// ─── GET ────────────────────────────────────────────────────
if ($method == 'GET') {
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM eventos WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($event && $event['extra_data']) {
            $extra = json_decode($event['extra_data'], true);
            if (is_array($extra)) {
                $event = array_merge($event, $extra);
            }
        }
        echo json_encode($event);
    } else {
        // Admin requests all; public requests only active=1
        $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1';
        if ($adminMode) {
            $stmt = $pdo->query("SELECT * FROM eventos ORDER BY created_at DESC");
        } else {
            $stmt = $pdo->query("SELECT * FROM eventos WHERE active = 1 ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

// ─── POST (CREATE / UPDATE / TOGGLE ACTIVE) ─────────────────
if ($method == 'POST') {

    // Quick toggle: active/inactive without full form
    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = $_POST['active'] ?? 1;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID não informado."]);
            exit;
        }
        $pdo->prepare("UPDATE eventos SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["status" => "success"]);
        exit;
    }

    function uploadEventFile($file, $subpath) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) return null;
        $dir = "uploads/" . $subpath . "/";
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $name = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $target = $dir . $name;
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }
        return null;
    }

    $id          = $_POST['id']          ?? null;
    $slug        = $_POST['slug']        ?? '';
    $title       = $_POST['title']       ?? '';
    $description = $_POST['description'] ?? '';
    $event_date  = !empty($_POST['event_date']) ? $_POST['event_date'] : null;
    // Gera o texto exibido (campo 'date') automaticamente a partir do event_date.
    // Mantemos o campo 'date' por compatibilidade com leitura antiga.
    $date = $_POST['date'] ?? '';
    if ($event_date) {
        $meses = [1=>'Jan',2=>'Fev',3=>'Mar',4=>'Abr',5=>'Mai',6=>'Jun',7=>'Jul',8=>'Ago',9=>'Set',10=>'Out',11=>'Nov',12=>'Dez'];
        $ts = strtotime($event_date);
        if ($ts) {
            $d = (int)date('d', $ts);
            $m = (int)date('n', $ts);
            $y = date('Y', $ts);
            $date = "$d $meses[$m] $y";
        }
    }
    $time        = $_POST['time']        ?? '';
    $location    = $_POST['location']    ?? '';
    $video_url   = $_POST['video_url']   ?? '';
    $extra_data  = $_POST['extra_data']  ?? null;
    $active      = isset($_POST['active']) ? (int)$_POST['active'] : 1;
    $image_url_fallback = $_POST['image_url'] ?? '';

    if (empty($title)) {
        echo json_encode(["status" => "error", "message" => "Título obrigatório."]);
        exit;
    }

    $image_url = uploadEventFile($_FILES['image'] ?? null, 'eventos/images');
    if (!$image_url && $image_url_fallback) {
        $image_url = $image_url_fallback;
    }

    if ($id) {
        $stmt = $pdo->prepare(
            "UPDATE eventos SET
                slug=?, title=?, description=?, date=?, event_date=?, time=?,
                location=?, video_url=?, extra_data=?, active=?,
                image_url = CASE WHEN ? IS NOT NULL THEN ? ELSE image_url END
             WHERE id=?"
        );
        $stmt->execute([
            $slug, $title, $description, $date, $event_date, $time,
            $location, $video_url, $extra_data, $active,
            $image_url, $image_url, $id
        ]);
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO eventos (slug, title, description, date, event_date, time, location, video_url, extra_data, image_url, active)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $slug, $title, $description, $date, $event_date, $time,
            $location, $video_url, $extra_data, $image_url, $active
        ]);
    }

    echo json_encode(["status" => "success"]);
    exit;
}

// ─── DELETE ─────────────────────────────────────────────────
if ($method == 'DELETE') {
    if (empty($_GET['id'])) {
        echo json_encode(["status" => "error", "message" => "ID não informado."]);
        exit;
    }
    $pdo->prepare("DELETE FROM eventos WHERE id = ?")->execute([$_GET['id']]);
    echo json_encode(["status" => "success"]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
