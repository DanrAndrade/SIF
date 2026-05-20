# Handoff — Projeto SIF

> **Para nova conversa Claude:** leia este arquivo INTEIRO antes de tocar em qualquer código. Este projeto teve várias iterações e há armadilhas documentadas aqui. Quando algo der errado, é quase sempre por ignorar uma das regras desta seção.

---

## 1. Localização e estrutura

**Projeto principal (TRABALHE AQUI SEMPRE):**
```
C:\Users\danie\SIF\
```

**Worktree do Claude (NÃO USE):**
```
C:\Users\danie\SIF\.claude\worktrees\agitated-pascal-10a819\
```
Esse worktree é uma cópia stale com código antigo. Foi origem de um incidente onde o Claude rodou o dev server lá e o usuário viu uma versão "antiga" do site, achando que o projeto tinha sido corrompido. **Use sempre caminhos absolutos `C:\Users\danie\SIF\...`** ao editar arquivos.

**Backend PHP:**
```
C:\xampp\htdocs\sif-api\
```
Servido em `http://localhost/sif-api/` via XAMPP/Apache.

**Banco MySQL:**
Database `sif_db` no XAMPP (phpMyAdmin via `http://localhost/phpmyadmin/`).

**GitHub:**
```
https://github.com/DanrAndrade/SIF.git
```
Branch principal: `main`. Tag de marco: `v0.9-pre-paginas-estaticas`.

---

## 2. Stack

- **Frontend**: React 18 + Vite 5 + Tailwind + React Router 7
- **Backend**: PHP puro + PDO MySQL
- **Hospedagem alvo**: Hostinger (domínio ainda não definido pelo cliente)
- **Dev local**: `npm run dev` em `C:\Users\danie\SIF\` → `http://localhost:5173/`
- **Build**: `npm run build` → `dist/`

---

## 3. ⚠️ REGRAS CRÍTICAS (aprendidas a duras penas)

### 3.1 — Sempre trabalhar no projeto principal
Edite **somente** arquivos em `C:\Users\danie\SIF\`. Nunca toque em `.claude/worktrees/...`. Use caminhos absolutos em todas as ferramentas de Edit/Write/Bash.

### 3.2 — Antes de mexer em algo complexo, commitar
O usuário NÃO commita com frequência. Antes de qualquer mudança grande, peça pra ele commitar (ou faça você mesmo via `git add -A && git commit`) pra ter rollback seguro.

### 3.3 — Placeholders sempre genéricos
Nunca use o nome real do usuário (`Daniel Andrade`) nem email pessoal em placeholders. Use `"Seu nome aqui"`, `"email@sif.org.br"`, `"(DDD) 00000-0000"`.

### 3.4 — Cores SIF: apenas tons de verde
Identidade visual usa **apenas verdes** (`#007a3d`, `#1B5E20`, `#4ADE80`, `#92b735`, emerald-*). Nunca use laranja, amber, yellow para hover/highlights. Se encontrar laranja em algum lugar, é bug.

### 3.5 — Para edição CRUD: auto-seed silencioso, NÃO botão "Importar"
Quando uma página estática precisa ser editável, o admin auto-popula o banco com os dados existentes na primeira carga (silenciosamente). Sem botão "Importar conteúdo atual" — o usuário rejeitou explicitamente esse padrão.

Use `useRef` pra evitar duplo seed por React StrictMode:
```js
const seedingRef = useRef(false);
if (list.length === 0 && !seedingRef.current) {
  seedingRef.current = true;
  // ...seed
}
```

### 3.6 — Backend POST vs PUT (cuidado com duplicatas)
Em **todos os handlers PHP** que aceitam POST tunelado para PUT (`_method=PUT`), o POST handler deve **explicitamente excluir** o caso `_method=PUT`, senão cria duplicata em vez de atualizar:

```php
// CORRETO
if ($method === 'POST' && empty($_POST['_method'])) {
    // CREATE
}
if ($method === 'PUT' || ($method === 'POST' && ($_POST['_method'] ?? '') === 'PUT')) {
    // UPDATE
}
```

Bug histórico: usuário editou um membro da equipe → criou duplicata sem foto. Cleanup deletou o original com foto. Foi necessário script de reparo. Já corrigido em `team`, `timeline`, `documents`, `associadas`, `faqs`.

### 3.7 — Fallbacks visuais nos componentes públicos
Todo componente público que consome config do backend deve ter **fallback completo** (DEFAULTS) com os textos atuais hardcoded. Se backend offline ou config vazio, o site renderiza idêntico ao que estava antes:

```js
const c = { ...DEFAULTS, ...config };
return <h1>{c.title}</h1>;
```

### 3.8 — Estrutura visual: consistência entre páginas similares
- Cards de Eventos e Projetos: **mesmo layout** (EventoCard espelha ProjetoCard)
- Páginas Tipo 2 (Eventos/Treinamentos/GT/Projetos/Blog) usam `EditablePageHero` e `EditablePageContact`
- Páginas Tipo 1 (Home/Institucional/Associadas/etc) usam tabs no admin estilo `AdminHome`

### 3.9 — Worktrees do Claude não vão pro git
`.gitignore` tem `.claude/worktrees/`. Não tente versionar isso.

### 3.10 — Nunca rodar `git push --force` ou destruir histórico
Usuário valoriza poder voltar atrás. Sempre prefira `git revert` a `reset --hard`.

---

## 4. Backend — endpoints PHP e tabelas

### Endpoints chave em `C:\xampp\htdocs\sif-api\`

| Arquivo | Função |
|---|---|
| `db.php` | Conexão PDO MySQL (credenciais XAMPP padrão) |
| `page_content.php` | **CMS genérico** — GET/POST de `page_configs` por `page_key`. Aceita uploads multipart |
| `institucional.php` | CRUD de `team_members`, `timeline_items`, `documents` + config geral |
| `associadas.php` | CRUD de empresas associadas (com `address`) |
| `faqs.php` | CRUD de FAQs por `page_key` |
| `eventos.php` | CRUD eventos (com `event_date` para segmentação por data) |
| `treinamentos.php`, `gt.php`, `projetos.php`, `blog.php` | CRUD das publicações |
| `eincol.php` | CMS específico para página Eincol (configurável original do user) |
| `jobs.php` | CRUD vagas |
| `leads.php` | Recebe submissões do form de contato |
| `candidates.php` | Submissões de candidatos a vagas |
| `banners.php` | Banners da Home (carrossel) |
| `upload.php`, `upload_pdf.php` | Upload utilitários |
| `image_utils.php` | Compressão e upload helper |
| `login_admin.php` | Autenticação admin |

### Scripts de migration/manutenção
- `migrate.php` — adicionou `active` e `extra_data` em tabelas de publicações
- `migrate_cms.php` — criou `page_configs`, `team_members`, `timeline_items`, `documents`, `associadas`, `faqs`
- `migrate_associadas_address.php` — adicionou coluna `address`
- `migrate_eventos_date.php` — adicionou coluna `event_date` (DATE)
- `cleanup_duplicates.php` — limpa duplicatas em `team_members` e `associadas`
- `repair_photos.php` — restaura `photo_url` de membros da equipe pelo padrão estático

### Tabelas MySQL
- `page_configs` (page_key, config_json) — JSON genérico por página
- `team_members` (group_name, name, role, photo_url, link_email, link_whatsapp, sort_order, active)
- `timeline_items` (year, title, content, image_url, layout, sort_order, active)
- `documents` (page_key, title, description, pdf_url, icon_type, sort_order, active) — **legado, não usado mais** (PDFs agora em `page_configs.institucional_geral.estatuto_blocks`)
- `associadas` (name, logo_url, address, sort_order, active)
- `faqs` (page_key, question, answer, sort_order, active)
- `eventos` (slug, title, description, date [texto], event_date [DATE], time, location, video_url, image_url, extra_data, active)
- `treinamentos`, `gt`, `projetos`, `blog_posts` (com sections via `extra_data` JSON)
- `jobs`, `leads`, `candidates`, `banners`

### Padrão de upload nested no `page_content.php`
O backend reconhece padrões especiais de field name:
- `<section>_card_<idx>_image` → grava em `current[section][cards][idx][image]`
- `<section>_step_<idx>_img` → grava em `current[section][steps][idx][img]`
- Demais (`hero_image`, `quem_somos_image`, `contact_photo`, etc.) → grava no nível raiz

---

## 5. Frontend — componentes reutilizáveis

### Públicos (consumidos pelas páginas)
- `src/components/EditablePageHero.jsx` — hero padrão SIF. `<EditablePageHero pageKey="X" defaults={...} scrollTargetId="..." bgColor="#f8f9fa" />`
- `src/components/EditablePageContact.jsx` — card "Fale com o responsável" no fim das detail pages
- `src/components/ContentSectionsRenderer.jsx` — renderiza sections (text/image/video/tabs/pdf) configuradas no admin
- `src/components/Partners.jsx` — carrossel de logos na Home (consome `/associadas.php`)
- `src/components/HeroSection.jsx`, `Performance.jsx`, `About.jsx`, `Services.jsx`, `Process.jsx`, `FAQ.jsx` — seções da Home (todas com fallback DEFAULT)
- `src/components/ui/BackLink.jsx` — botão voltar verde sólido
- `src/components/ui/Button.jsx`, `FormElements.jsx`, `SectionHeader.jsx`, `NoiseOverlay.jsx`

### Admin
- `src/components/admin/PageHeaderForm.jsx` — form genérico para hero (imagem/badge/títulos/subtítulo)
- `src/components/admin/PageContactForm.jsx` — form genérico para contato responsável (nome/cargo/email/whatsapp/foto)
- `src/components/admin/AdminHome.jsx` — admin da Home (tabs Hero/Performance/About/Services/Process/FAQ)
- `src/components/admin/AdminFAQ.jsx` — CRUD perguntas (usado dentro de AdminHome e talvez outras)
- `src/components/admin/ContentSections.jsx`, `TabManager.jsx`, `QuillEditor.jsx`, `ImageUploadArea.jsx` — sistema editor de seções/abas nas postagens

### Hook
- `src/hooks/usePageConfig.js` — fetch genérico de `page_content.php?page=X`

---

## 6. Mapa de páginas e admin

### Página → admin → pageKey usado em `page_configs`

| Página pública | Rota admin | pageKey | Status edição |
|---|---|---|---|
| `/` | `/admin/home` | `home` | ✅ 100% (hero, Performance, About, Services, Process, FAQ, contato) |
| `/institucional` | `/admin/institucional` | `institucional_geral` | ✅ 100% (7 abas: Hero, Quem Somos, Equipe, Áreas, Estatutos com blocos PDFs, Linha do Tempo, CTA) |
| `/associadas` | `/admin/associadas` | `associadas` | ✅ 100% (4 abas: Hero, Benefícios, Empresas, CTA) |
| `/produtos-servicos` | `/admin/produtos` | `produtos` | ⚠️ Só hero. Conteúdo das 4 abas (Comercial/Germinar/Boletim/P&D) hardcoded |
| `/treinamentos-in-company` | `/admin/in-company` | `treinamentos_in_company` | ⚠️ Só hero. Resto hardcoded |
| `/trabalhe-conosco` | `/admin/jobs` | `jobs` | ⚠️ Hero editável + CRUD vagas. Missão/Visão/Valores hardcoded |
| `/contato` | `/admin/contato` | `contato` | ⚠️ Só hero. Form funciona (envia para `leads.php`) |
| `/eventos` + `/eventos/:slug` | `/admin/eventos` | `eventos` | ✅ Hero + contato + CRUD com segmentação automática por `event_date` |
| `/treinamentos` + detail | `/admin/treinamentos` | `treinamentos` | ✅ Hero + contato + CRUD |
| `/grupos-tematicos` + detail | `/admin/gt` | `gt` | ✅ Hero + contato + CRUD |
| `/projetos` + detail | `/admin/projetos` | `projetos` | ✅ Hero + contato + CRUD (status: Em Andamento/Concluído) |
| `/blog` + `/blog/:slug` | `/admin/blog` | `blog` | ✅ Hero + CRUD posts |
| `/eincol` | `/admin/eincol` | (próprio) | ✅ Página piloto original do usuário |

### Tags `page_keys` já criadas no banco
`home`, `institucional_geral`, `associadas`, `produtos`, `treinamentos_in_company`, `jobs`, `contato`, `eventos`, `treinamentos`, `gt`, `projetos`, `blog`.

---

## 7. Sidebar admin (estrutura)

```
GESTÃO
  - Leads / Contato
  - Candidatos

SITE & INSTITUCIONAL
  - Banners Home
  - Gerenciar Vagas (→ /admin/jobs, com PageHeaderForm de Jobs no topo)
  - Gerenciar Blog
  - Eventos
  - Treinamentos
  - Grupos Temáticos
  - Projetos P&D

PÁGINAS (estáticas com layout fixo, conteúdo editável)
  - Página Home
  - Institucional
  - Associadas
  - Produtos & Serviços    ← novo
  - Trein. In-Company       ← novo
  - Página Contato          ← novo

EVENTO ESPECIAL
  - EINCOL
```

---

## 8. Padrões importantes do código

### Auto-seed em manager (ex: TeamManager, AssociadasAdmin)
```js
const seedingRef = useRef(false);
const fetch_ = async () => {
  const data = await res.json();
  const list = Array.isArray(data) ? data : [];
  if (list.length === 0 && !seedingRef.current) {
    seedingRef.current = true;
    for (const item of STATIC_SEED) {
      const fd = new FormData(); /* ... */
      await fetch(API, { method: 'POST', body: fd });
    }
    // refetch após seed
  } else {
    setItems(list);
  }
};
```

### Página pública com config + fallback
```js
import { usePageConfig } from '../hooks/usePageConfig';
const { config } = usePageConfig('home');
const cfg = { ...DEFAULTS, ...config };
// usar cfg.hero_title, cfg.hero_subtitle, etc.
```

### Admin com PageHeaderForm
```js
import PageHeaderForm from '../../components/admin/PageHeaderForm';
const HERO_DEFAULTS = {
  hero_image: 'https://...',
  hero_badge: 'Etiqueta',
  hero_title_line1: 'Texto', hero_title_highlight: 'Verde',
  hero_subtitle: '...',
  hero_scroll_label: '',
};
return <PageHeaderForm pageKey="X" defaults={HERO_DEFAULTS} title="Cabeçalho..." />;
```

### Detail page com contato responsável
```js
import EditablePageContact from '../components/EditablePageContact';
// antes do <Footer />:
<section className="py-16 bg-[#f8f9fa]">
  <div className="container mx-auto px-6 max-w-3xl">
    <EditablePageContact pageKey="treinamentos" fallbackTitle="Fale com o responsável" />
  </div>
</section>
```

---

## 9. Pendências conhecidas (não-bloqueantes pra deploy)

1. **Conteúdo interno das páginas estáticas** (Produtos & Serviços, Treinamentos In-Company, Jobs, Contato): só o hero é editável. Internamente continuam hardcoded. Para evoluir, adicionar mais campos no admin correspondente.
2. **Navbar tablet**: breakpoint atual é `lg` (1024px). Entre 768–1023 usa drawer mobile. Pode ficar como está.
3. **Linha do tempo horizontal**: usuário decidiu manter vertical mesmo.

---

## 10. Deploy na Hostinger (pendente, esperando domínio)

### Passos quando o domínio chegar

**1. Configurar produção**
- `src/apiConfig.js`: trocar `API_BASE_URL` para URL do backend (ex: `https://api.sif.org.br` ou `https://sif.org.br/api`)
- `C:\xampp\htdocs\sif-api\db.php`: trocar credenciais MySQL para as da Hostinger
- Adicionar CORS no PHP se backend em subdomínio diferente

**2. Build estático**
```
cd C:\Users\danie\SIF
npm run build
```
Gera `dist/` — frontend SPA estático.

**3. Upload na Hostinger via FTP/File Manager**
- `dist/*` → `public_html/`
- `sif-api/*` → `public_html/api/` (ou subdomínio próprio)
- Importar dump MySQL (exportar local via phpMyAdmin → importar no painel Hostinger)
- Criar pasta `uploads/` com permissão 755 (subpastas `pages/`, `pdfs/`, `eventos/`, etc.)
- Ajustar permissões dos PHPs (644) e pastas (755)

**4. `.htaccess` para SPA**
No `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]
```

**5. Rodar migrations no banco da Hostinger**
Acessar via URL os arquivos `migrate*.php` (ou rodar SQL direto no phpMyAdmin da Hostinger). Em produção, **DELETAR esses scripts** depois (segurança).

**6. Testes pós-deploy**
- Home carrega
- Cada página pública abre
- `/admin` login funciona
- Upload de imagem/PDF funciona
- Console sem erros CORS

---

## 11. Comandos uteis

```bash
# Dev local
cd C:\Users\danie\SIF
npm run dev                       # → http://localhost:5173

# Build
npm run build                     # → dist/

# Git
git status --short
git log --oneline -10
git push origin main
git push origin --tags

# Backup MySQL local (executar antes de deploy)
mysqldump -u root sif_db > sif_db_backup.sql

# Verificar status dos endpoints
curl -s http://localhost/sif-api/page_content.php?page=home | head -c 200
curl -s http://localhost/sif-api/eventos.php | head -c 200
```

---

## 12. Como retomar com nova conversa

1. Abra o Claude Code com `cd C:\Users\danie\SIF` no terminal.
2. Mande para o Claude:
   > "Leia o arquivo HANDOFF.md inteiro antes de qualquer coisa. Estou retomando o projeto SIF. Confirme que entendeu as regras e o estado atual antes de propor qualquer mudança."
3. Quando ele confirmar, descreva o que você quer fazer.

**Regra de ouro pro novo Claude**: se for tocar em coisa grande, peça pra commitar primeiro. Faça mudanças em commits pequenos. Build entre cada commit. Pra qualquer dúvida sobre como algo foi feito, leia o arquivo correspondente e o commit history (`git log --oneline -20`).

---

## 13. Histórico de commits (resumo dos marcos)

```
e4025ab feat(admin): hero editavel para Produtos, Trein.InCompany, Jobs e Contato
0ff04de chore: gitignore para worktrees do Claude Code
5573ade fix(backend): upload de imagem dentro de array
252957a fix(admin): placeholders genericos no form de empresas associadas
202ff63 feat(eventos): mesma estrutura visual de Projetos + campo de data unificado
45cccb3 fix(projetos): remove 'Portfolio Ativo'/'Historico de Pesquisa'
10704bb feat(eventos): segmentacao automatica por data
75b6f0f feat(associadas): campo endereco por empresa
b42533e style: secao do contato responsavel usa bg da pagina
062b774 fix: remove cards estaticos de contato (redundante)
bc0a931 fix(institucional): contatos da equipe por extenso
... (e mais commits da fase original)
```

Tag: `v0.9-pre-paginas-estaticas` — rollback seguro pra antes do admin das páginas estáticas.

---

**Fim do handoff. Boa sorte! 🌳**
