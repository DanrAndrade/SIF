<?php
require_once 'db.php';
require_once 'api_guard.php'; // decodifica envios do front + exige login para gravar
require_once 'image_utils.php';
$method = $_SERVER['REQUEST_METHOD'];

// ---------------------------------------------------------------- permissões do blog
// - módulo "blog": tudo
// - responsável por GT (admins.gt_ids): cria/edita posts do blog dos seus grupos
// - responsável pelo post (blog_posts.responsavel_ids): edita aquele post
function sif_blog_full(): bool { return sif_can('blog'); }
function sif_blog_post_allowed(?array $post): bool {
    if (sif_blog_full()) return true;
    $u = sif_user();
    if (!$u || !$post) return false;
    if (!empty($post['gt_id']) && in_array((int)$post['gt_id'], $u['gt_ids'], true)) return true;
    return in_array($u['id'], array_map('intval', sif_json_list($post['responsavel_ids'] ?? null)), true);
}
function sif_blog_gt_allowed($gtId): bool {
    if (sif_blog_full()) return true;
    $u = sif_user();
    return $u && $gtId && in_array((int)$gtId, $u['gt_ids'], true);
}
function sif_blog_load(PDO $pdo, $id): ?array {
    $st = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ?");
    $st->execute([(int)$id]);
    return $st->fetch(PDO::FETCH_ASSOC) ?: null;
}
// Nomes dos responsáveis (públicos: aparecem como autores do post)
function sif_blog_with_people(PDO $pdo, array $posts): array {
    $people = [];
    try {
        foreach ($pdo->query("SELECT id, name, cargo FROM admins")->fetchAll(PDO::FETCH_ASSOC) as $a) {
            if (!empty($a['name'])) $people[(int)$a['id']] = ['id' => (int)$a['id'], 'name' => $a['name'], 'cargo' => $a['cargo'] ?? ''];
        }
    } catch (Throwable $e) { /* banco ainda sem as colunas novas */ }
    foreach ($posts as &$p) {
        $ids = array_map('intval', sif_json_list($p['responsavel_ids'] ?? null));
        $p['responsaveis'] = array_values(array_filter(array_map(fn($i) => $people[$i] ?? null, $ids)));
    }
    return $posts;
}

// --- BUSCAR POSTS ---
if ($method === 'GET') {
    try {
        if (isset($_GET['slug'])) {
            $slug = trim($_GET['slug']);
            
            // Validate slug format
            if (empty($slug) || !preg_match('/^[a-z0-9-]+$/', $slug)) {
                http_response_code(400);
                echo json_encode(["error" => "Slug inválido"]);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE slug = ?" . (sif_is_admin() ? '' : ' AND active = 1'));
            $stmt->execute([$slug]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Return proper response when not found
            if (!$post) {
                http_response_code(404);
                echo json_encode(["error" => "Post não encontrado"]);
                exit;
            }
            
            echo json_encode(sif_blog_with_people($pdo, [$post])[0]);
        } else {
            $adminMode = isset($_GET['admin']) && $_GET['admin'] === '1' && sif_is_admin(); // itens ocultos só com login
            if ($adminMode) {
                $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
            } else {
                $stmt = $pdo->query("SELECT * FROM blog_posts WHERE active = 1 ORDER BY created_at DESC");
            }
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Painel: quem não tem o módulo Blog vê só os posts que pode editar
            if ($adminMode && !sif_blog_full()) $rows = array_values(array_filter($rows, 'sif_blog_post_allowed'));
            // Blog de um grupo temático: ?gt_id=N
            if (isset($_GET['gt_id'])) {
                $g = (int)$_GET['gt_id'];
                $rows = array_values(array_filter($rows, fn($r) => (int)($r['gt_id'] ?? 0) === $g));
            }
            echo json_encode(sif_blog_with_people($pdo, $rows));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[sif-api] blog: ' . $e->getMessage());
        echo json_encode(["error" => "Erro ao buscar posts."]);
    }
    exit;
}

// --- CRIAR OU EDITAR (POST) ---
if ($method === 'POST') {
    // Improved file upload function with validation
    function uploadFile($file, $subpath) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            return ["error" => "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP."];
        }
        
        // Validate file size (10MB max)
        if ($file['size'] > 10 * 1024 * 1024) {
            return ["error" => "Arquivo muito grande. Tamanho máximo: 10MB."];
        }
        
        $dir = "uploads/" . $subpath . "/";
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                return ["error" => "Erro ao criar diretório de upload."];
            }
        }
        
        // Sanitize filename
        $extension = sif_safe_ext($file['tmp_name'], 'image', $file['name']); // tipo real
        if (!$extension) return ["error" => "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP."];
        $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
        $target = $dir . $safeName;
        
        if (move_uploaded_file($file['tmp_name'], $target)) {
            $webp = convertToWebp($target);
            return $webp ?: str_replace('\\', '/', $target);
        }

        return ["error" => "Erro ao fazer upload do arquivo."];
    }

    if (isset($_POST['toggle_active'])) {
        $id     = $_POST['id']     ?? null;
        $active = ((int)($_POST['active'] ?? 1)) ? 1 : 0;
        if (!$id) {
            echo json_encode(["success" => false, "error" => "ID não informado."]);
            exit;
        }
        if (!sif_blog_post_allowed(sif_blog_load($pdo, $id))) sif_deny('Você não tem permissão para alterar este post.');
        $pdo->prepare("UPDATE blog_posts SET active = ? WHERE id = ?")->execute([$active, $id]);
        echo json_encode(["success" => true]);
        exit;
    }

    try {
        $id         = $_POST['id']         ?? null;
        $title      = trim($_POST['title'] ?? '');
        $active     = isset($_POST['active']) ? (int)$_POST['active'] : 1;
        $content    = sif_clean_html($_POST['content'] ?? ''); // sem scripts/eventos (XSS)
        $tags       = trim($_POST['tags']  ?? '');
        $extra_data = sif_clean_json($_POST['extra_data'] ?? null);
        $gt_id      = (int)($_POST['gt_id'] ?? 0) ?: null;
        $resp_ids   = json_encode(array_values(array_unique(array_filter(array_map('intval', sif_json_list($_POST['responsavel_ids'] ?? '[]'))))));
        if ($id) {
            $prev = sif_blog_load($pdo, $id);
            // Sem gt_id no envio: mantém o grupo atual
            if (!isset($_POST['gt_id']) && $prev) $gt_id = (int)($prev['gt_id'] ?? 0) ?: null;
            // Só quem gerencia o blog (ou é responsável pelo grupo do post) muda a lista de responsáveis
            if ($prev && !sif_blog_full() && !sif_blog_gt_allowed($prev['gt_id'] ?? null)) $resp_ids = $prev['responsavel_ids'] ?: '[]';
        }

        // Permissão: post novo → precisa poder publicar no grupo escolhido;
        // edição → precisa poder editar o post (e, se mudar o grupo, o novo também)
        if ($id) {
            $old = sif_blog_load($pdo, $id);
            if (!$old) { http_response_code(404); echo json_encode(["success" => false, "error" => "Post não encontrado."]); exit; }
            if (!sif_blog_post_allowed($old)) sif_deny('Você não tem permissão para editar este post.');
            if ((int)($old['gt_id'] ?? 0) !== (int)$gt_id && !sif_blog_gt_allowed($gt_id)) sif_deny('Você não pode mover o post para esse grupo temático.');
        } elseif (!sif_blog_gt_allowed($gt_id)) {
            sif_deny(sif_user() && sif_user()['gt_ids'] ? 'Escolha um dos seus grupos temáticos para publicar.' : 'Você não tem permissão para publicar no blog.');
        }
        
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "O título é obrigatório."]);
            exit;
        }

        $hasContent    = !empty($content) && $content !== '<p><br></p>';
        $hasExtraData  = !empty($extra_data);
        if (!$hasContent && !$hasExtraData) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "O conteúdo é obrigatório."]);
            exit;
        }
        
        // Validate title length
        if (strlen($title) > 200) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Título muito longo (máximo 200 caracteres)."]);
            exit;
        }
        
        // Slug (link do post). Na edição mantém o link já publicado — corrigir o
        // título não quebra links divulgados. Acentos viram letras simples
        // ("Ação" → "acao", antes virava "a-o").
        $slug = '';
        if ($id) {
            $cur = $pdo->prepare("SELECT slug FROM blog_posts WHERE id = ?");
            $cur->execute([$id]);
            $slug = (string)$cur->fetchColumn();
        }
        if ($slug === '') {
            $ascii = strtr($title, [
                'á'=>'a','à'=>'a','â'=>'a','ã'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
                'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i','ó'=>'o','ò'=>'o','ô'=>'o','õ'=>'o','ö'=>'o',
                'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','ñ'=>'n',
                'Á'=>'A','À'=>'A','Â'=>'A','Ã'=>'A','Ä'=>'A','É'=>'E','È'=>'E','Ê'=>'E','Ë'=>'E',
                'Í'=>'I','Ì'=>'I','Î'=>'I','Ï'=>'I','Ó'=>'O','Ò'=>'O','Ô'=>'O','Õ'=>'O','Ö'=>'O',
                'Ú'=>'U','Ù'=>'U','Û'=>'U','Ü'=>'U','Ç'=>'C','Ñ'=>'N',
            ]);
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $ascii ?: $title)));
            $slug = preg_replace('/-+/', '-', $slug);
            $slug = trim($slug, '-') ?: 'post';
        }
        
        // Ensure slug is unique (except for current post if editing)
        $slugCheckSql = $id 
            ? "SELECT id FROM blog_posts WHERE slug = ? AND id != ?" 
            : "SELECT id FROM blog_posts WHERE slug = ?";
        $slugCheckParams = $id ? [$slug, $id] : [$slug];
        $slugCheck = $pdo->prepare($slugCheckSql);
        $slugCheck->execute($slugCheckParams);
        
        if ($slugCheck->fetch()) {
            $slug = $slug . '-' . time();
        }

        $image_url = uploadFile($_FILES['image'] ?? null, 'images');
        
        // Check for upload errors
        if (is_array($image_url) && isset($image_url['error'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $image_url['error']]);
            exit;
        }

        if ($id) {
            // Validate ID
            if (!is_numeric($id) || $id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "ID inválido"]);
                exit;
            }
            
            // Ao atualizar com nova imagem, remove a imagem antiga
            if ($image_url) {
                $oldStmt = $pdo->prepare("SELECT image_url FROM blog_posts WHERE id = ?");
                $oldStmt->execute([$id]);
                $oldPost = $oldStmt->fetch(PDO::FETCH_ASSOC);
                
                // Delete old image file if it exists
                if ($oldPost && !empty($oldPost['image_url']) && file_exists($oldPost['image_url'])) {
                    sif_safe_unlink($oldPost['image_url']);
                }
                
                $stmt = $pdo->prepare("UPDATE blog_posts SET title=?, content=?, tags=?, slug=?, image_url=?, extra_data=?, gt_id=?, responsavel_ids=?, updated_at=NOW() WHERE id=?");
                $stmt->execute([$title, $content, $tags, $slug, $image_url, $extra_data, $gt_id, $resp_ids, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE blog_posts SET title=?, content=?, tags=?, slug=?, extra_data=?, gt_id=?, responsavel_ids=?, updated_at=NOW() WHERE id=?");
                $stmt->execute([$title, $content, $tags, $slug, $extra_data, $gt_id, $resp_ids, $id]);
            }
        } else {
            $stmt = $pdo->prepare("INSERT INTO blog_posts (title, slug, content, image_url, tags, active, extra_data, gt_id, responsavel_ids, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $content, $image_url, $tags, $active, $extra_data, $gt_id, $resp_ids, sif_user()['id'] ?? null]);
        }

        // Botão "remover imagem" do painel (só quando não veio imagem nova)
        if (!empty($id) && ($_POST['remove_image'] ?? '') === '1' && empty($_FILES['image']['tmp_name'])) {
            $pdo->prepare("UPDATE blog_posts SET image_url = '' WHERE id = ?")->execute([$id]);
        }
        echo json_encode(["success" => true, "slug" => $slug]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[sif-api] blog: ' . $e->getMessage());
        echo json_encode(["success" => false, "error" => "Erro ao salvar o post."]);
    }
    exit;
}

// --- EXCLUIR (DELETE) ---
if ($method === 'DELETE') {
    try {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            
            // Validate ID
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "ID inválido"]);
                exit;
            }
            
            // Check if post exists before deleting
            $checkStmt = $pdo->prepare("SELECT id, image_url, content FROM blog_posts WHERE id = ?");
            $checkStmt->execute([$id]);
            $post = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$post) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Post não encontrado"]);
                exit;
            }
            if (!sif_blog_post_allowed(sif_blog_load($pdo, $id))) sif_deny('Você não tem permissão para excluir este post.');
            
            // Remove a imagem de capa
            if (!empty($post['image_url']) && file_exists($post['image_url'])) {
                sif_safe_unlink($post['image_url']);
            }

            // Remove as imagens do conteúdo (imagens do editor)
            if (!empty($post['content'])) {
                preg_match_all('/<img[^>]+src="([^"]+)"/', $post['content'], $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $imgUrl) {
                        // Only delete if it's a local upload (starts with uploads/)
                        if (strpos($imgUrl, 'uploads/') === 0 && file_exists($imgUrl)) {
                            sif_safe_unlink($imgUrl);
                        }
                    }
                }
            }
            
            $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
            if ($stmt->execute([$id])) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Falha ao excluir."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID não fornecido"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[sif-api] blog: ' . $e->getMessage());
        echo json_encode(["success" => false, "error" => "Erro ao excluir o post."]);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(["error" => "Método não permitido"]);
?>