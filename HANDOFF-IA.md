# Passagem de bastão — IA que continua o projeto SIF

> **Para a IA que está lendo isto (no notebook de trabalho):** esta conversa
> começou em outro PC. Este arquivo tem tudo o que você precisa pra continuar
> de onde paramos. Leia inteiro antes de mexer em qualquer coisa.
> Escrito em 2026-09-29.

---

## 1. Quem é o usuário e como ele trabalha

- Fala português, é direto, prefere respostas curtas e objetivas.
- Não é necessário tratar ele como leigo, mas **explique o "porquê"** das
  mudanças em linguagem simples (ele repassa pro cliente).
- Fluxo dele: você altera o código → gera build → **ele sobe manualmente na
  HostGator** → testa → dá OK → você faz commit + push no GitHub.
- **Sempre peça OK antes do push** quando ele ainda estiver testando/ajustando.
- Ao indicar onde está um arquivo pra ele pegar, aponte a **pasta que contém**
  o item (pronto pra copiar), não um caminho por dentro dele.

## 2. O projeto

- **Frontend:** React + Vite (SPA), React Router, editor rico = Quill
  (`react-quill-new`).
- **Backend:** PHP + MySQL em `sif-api/`.
- **Produção (homologação):** `https://sif.org.br/sif-novo-h7k2x9/` — o site
  roda numa **subpasta**. Um dia vai pra raiz do domínio.
- **Local:** ver `CLAUDE.md` (XAMPP, banco `sif_db`, `npx vite --host`).

### Regras CRÍTICAS — não quebrar
- `vite.config.js`: `PROD_BASE = '/sif-novo-h7k2x9/'` (build usa a subpasta).
- API sempre derivada de `import.meta.env.BASE_URL` → `/sif-novo-h7k2x9/sif-api`.
  **Nunca** chumbar a subpasta no código.
- Toda imagem vinda do banco passa por `getImageUrl()` (`src/apiConfig.js`).
- `index.html` tem `<meta name="robots" content="noindex, nofollow">` (homologação).
- **NUNCA** entregar/sobrescrever: `sif-api/db.php` (credenciais reais só no
  servidor — o do Git é template `PREENCHER_...`), `sif-api/uploads/`
  (conteúdo real do cliente), `nossa-gente/`.
- Conteúdo é editável pelo painel (vive no banco). Não colocar conteúdo/imagem
  de exemplo chumbado.

### Como entregar um deploy
1. `npm run build`.
2. Entregar um zip **enxuto** só com `index.html` + `assets/` (o resto do
   `dist/` — `logos/`, `docs/`, `nossa-gente/`, `index.php`, `favicon.svg`,
   `.htaccess` — é estático e normalmente não muda; **não** mandar subir).
3. Se algum `sif-api/*.php` mudou, listar **arquivo por arquivo** (sem `db.php`).
4. Instruir: apagar a `assets/` antiga no servidor, subir a nova, trocar o
   `index.html`, Ctrl+F5.
5. Se mudou schema do banco, entregar o SQL (ou fazer o PHP auto-migrar de
   forma idempotente, como já foi feito em `treinamentos.php`).

## 3. O que já foi feito (histórico recente — tudo já no GitHub e em produção)

- **Editor Quill (todos os editores do admin):** toolbar fixa no topo, só o
  texto rola (corrigiu toolbar sumindo/subindo). Editores mais altos.
  Tudo passa pelo componente compartilhado `src/components/admin/QuillEditor.jsx`
  + `src/hooks/useQuillImageHandler.js`. A EincolAdmin foi consolidada nele.
- **"Imagem com texto ao lado" foi REMOVIDA** do toolbar a pedido do cliente
  (não funcionava bem). O registro do formato `imageAlign`
  (`src/utils/quillImageAlign.js`) e o CSS `.ql-img-align-*` ficaram só por
  compatibilidade com conteúdo antigo — não remover.
- **EINCOL – Grupos de Patrocinadores:** no admin, em "Seções Adicionais",
  botão "Grupo de Patrocinadores" (título + logos). Salvo **dentro do
  `sections_json`** existente como `{type:'sponsors', title, images:[...]}` —
  sem tabela nova. No site vira carrossel (`SponsorCarousel` em
  `src/pages/Eincol.jsx`).
- **Home – cards de Serviços** (`src/components/Services.jsx`): largura fixa
  760px, foto 84%, **o card cresce conforme o texto** (o cliente NÃO quer
  texto cortado com reticências), botão da seta com `shrink-0`.
- **Institucional – Áreas de Atuação:** carrossel rola por card + `snap-start`;
  o 3º card não fica mais cortado.
- Commits posteriores (feitos em outra sessão): botão de vídeo no Quill,
  vídeo salvo como `<iframe>` (`useSemanticHTML=false`), embed de
  YouTube/Vimeo, campo de data (início/fim) em Treinamentos.

## 4. ✅ RESOLVIDO (30/09/2026) — EINCOL: "Erro de conexão" ao salvar

**Causa confirmada:** o ModSecurity (firewall da HostGator) responde **406 Not
Acceptable** para qualquer campo com **link completo para outro domínio**
(ex.: `https://www.instagram.com/...`, regra RFI) ou com `<p><br></p>`
(o Quill gera isso em toda linha em branco). Vale para TODOS os endpoints,
não só a EINCOL. As regras endureceram entre 08/09 e 28/09 (antes salvava).

**Correção (vale para o projeto todo — não remover):**
- `src/utils/apiInterceptor.js` (importado no `main.jsx`): intercepta
  `fetch` e `axios` para URLs da API. Os campos de texto do FormData viram
  `__sifb64:<base64url>`; o corpo JSON vira `{"__sif_b64":"<base64url>"}`.
  Também envia o cookie de sessão (`credentials: include`).
- `sif-api/api_guard.php` (incluído em TODO endpoint logo após o `db.php`):
  decodifica `$_POST` e oferece `sif_raw_input()` no lugar de
  `file_get_contents('php://input')`. **Endpoint novo precisa incluir esse
  arquivo e usar `sif_raw_input()` para JSON.**
- O mesmo `api_guard.php` **exige login do painel para POST/PUT/DELETE**
  (antes qualquer pessoa conseguia gravar sem login). Exceções públicas:
  `login_admin.php`, `leads.php`, `candidates.php`, `session.php`.
  O `session.php` informa se está logado; o `AdminRoute` (`App.jsx`) confere
  ao abrir o painel e mantém a sessão viva a cada 5 min.
- Imagem colada no editor (base64) agora é enviada como arquivo
  (`QuillEditor.jsx`). A EINCOL tinha uma de ~730 KB na seção 3.
- A EINCOL mostra o motivo real do erro no toast (status + mensagem).

Também nesta entrega: botão "Carrossel de Logos" na EINCOL (antes se chamava
"Grupo de Patrocinadores" — já existia, mas o cliente não achava) e campo
"Site da empresa" em Associadas (coluna `website`, criada sozinha pelo
`associadas.php`; o card em /associadas e a logo na home viram link).

**Pendência de segurança:** o `testeconexao.php` existia só no servidor, com
a senha do banco em texto — deve ser apagado do servidor.

## 5. Sincronizar com o que está NO AR (HostGator)

O usuário vai baixar a pasta do site da HostGator pro notebook. Use-a pra
saber exatamente o que está em produção:

- **Build no ar:** compare o `index.html` do servidor com o `dist/index.html`
  local — os nomes com hash (`assets/index-XXXX.js`) dizem qual build está lá.
  Se forem diferentes, rode `npm run build` na última versão do GitHub e
  compare de novo; se ainda diferir, algo foi subido fora do Git — avise.
- **PHP no ar:** faça diff de `sif-api/*.php` do servidor contra o
  `sif-api/` do repo. **Ignore** `db.php` (no servidor tem credencial real —
  não copie, não exiba a senha), `uploads/`, `cache/`, `nossa-gente/`.
  Qualquer PHP que esteja diferente no servidor e não no Git: mostre o diff
  pro usuário antes de decidir qual versão vale.
- Atenção a nomes com acento em `nossa-gente/` (ex.: `Coordenações`) — no
  Linux da HostGator isso pode dar 404; é pré-existente.
- **Nunca** jogue a pasta baixada do servidor por cima do repositório inteiro.

## 6. Primeiros passos sugeridos pra você (IA do notebook)

1. `git pull` e ler este arquivo + `CLAUDE.md`.
2. Subir o ambiente local conforme `CLAUDE.md` (se ainda não estiver).
3. Comparar com a pasta baixada da HostGator (seção 5) e relatar ao usuário
   o que difere.
4. Investigar o bug da EINCOL (seção 4) — começar pelo status/corpo da
   resposta no Network.
5. Ouvir os novos pedidos do usuário e seguir o fluxo de entrega (seção 2).

## 7. Auditoria de outubro/2026 — como o projeto está organizado agora

Auditoria completa (relatório em `AUDITORIA-2026-10.md`) seguida de 3 fases,
todas commitadas. **Ainda não foi feito deploy dessas fases** — o usuário sobe
quando decidir (não gerar zip a cada etapa; só quando ele pedir).

### Regras novas (não quebrar)
- **Painel — kit padrão** (`src/components/admin/kit/`): toda tela usa
  `AdminPage` (título + barra fixa com "Alterações não salvas/Salvo" + Salvar),
  `AdminCard`, `SaveButton`, `ItemActions` (sempre ↑ ↓ · Visível · Editar ·
  Excluir), `ImageField`, `useConfirm()` (nunca `window.confirm`/`alert`),
  `useDirty()` (aviso de não salvo; use `settleMs` em telas com Quill).
- **Chamadas do painel à API**: `src/utils/adminApi.js` → `apiRequest()`
  (confere status e `success`; lança erro com a mensagem do servidor),
  `savePageConfig(pageKey, campos, arquivos)` (envie **só os campos do
  formulário** — o PHP mescla; senão um form apaga o outro), `toastError()`.
- **Links**: `src/components/ui/SmartLink.jsx` (rota interna respeita a
  subpasta; `Button href` já usa). Nunca `<a href="/rota">` cru.
- **Seções de página — modelo único**: `src/components/sections/sectionTypes.js`
  (tipos, `createSection`, `normalizeSections`, `visibleSections`). Editor:
  `components/admin/ContentSections.jsx`; site: `ContentSectionsRenderer.jsx`.
  Tipo novo = registrar nos três. `visible === false` oculta no site.
- **Tipografia**: fonte e estilo dos títulos só em `src/index.css`
  (`--sif-font-*`, `--sif-title-*`, classe `.sif-title` nos h1/h2).
  Montserrat: descomentar o link no `index.html` + trocar `--sif-font-sans`.
  Tirar caixa-alta/negrito dos títulos: `--sif-title-transform: none` e peso.
- **Backend**: todo endpoint inclui `api_guard.php` (decodifica envios,
  exige login para gravar, erros sempre em JSON, `sif_safe_ext()` para
  upload pelo tipo real, `sif_ensure_schema()` = migração versionada que roda
  sozinha quando o admin abre o painel — para mudar o banco, crie a versão 2
  lá, idempotente). `sif-api/.htaccess` bloqueia .sql/.zip, scripts de
  manutenção e includes. Scripts antigos estão em `database/manutencao/`.
- **Limpeza**: `dist/` e `*.zip` não são mais versionados (`npm run build`
  gera o `dist/`). Pasta `sif/` (template antigo) e código morto removidos.

### Ambiente local — atenção
- Se o MySQL do XAMPP não subir na 3306 porque outro projeto ocupa a porta,
  rode o do SIF em outra porta (`mysqld --port=3307`) e mude **só a cópia**
  `C:\xampp\htdocs\sif-api\db.php` (`'host' => '127.0.0.1;port=3307'`).
  Ao copiar o backend para o XAMPP, **não sobrescreva o db.php** dessa cópia.

### Próximo passo (proposta aprovada — R$ 3.840, 4 semanas)
Visual (Montserrat, títulos, degradê, textura, bento de números, rodapé
editável), modelo de página para Produtos/GT/Eventos/Projetos usando o modelo
de seções, página Projetos SIF/EMBRAPII (conteúdo da landing do Lucas),
vagas por categoria, menus, usuários e permissões (blog por responsável do GT).

## 8. Proposta revisada (R$ 3.840) — o que foi implementado (20/10/2026)

Tudo commitado localmente; **ainda não publicado** na HostGator nem enviado ao GitHub.

**Semana 1 — visual e conteúdo**
- Home: degradê e textura do topo editáveis (Painel › Home › Topo — `utils/homeVisual.js`); bloco de números em bento com contagem animada (aba Números — `components/NumbersBento.jsx`, começa **desligado** até preencher); 3º botão "Trabalhe Conosco" no topo.
- Fonte Montserrat; títulos sem caixa-alta/negrito (tokens `--sif-title-*` no `index.css`).
- Rodapé editável + nova cor verde (Painel › Páginas › Rodapé — `utils/footerDefaults.js`, page_configs `footer`).
- Menu: "Área do Associado" → "Conveniar"; "Projetos & Transparência" → "Projetos"; item "SIF e EMBRAPII" aponta para a página nova.
- Equipe: nome/ordem dos grupos editáveis (`utils/teamGroups.js`, salvo em `institucional_geral.team_groups`); seção some quando vazia.
- Institucional: card de chamada no fim (aba CTA Final) — **modelo de referência da equipe não foi recebido**; o card é um esboço editável.
- Associadas: seção de texto corrido (aba Texto) — some enquanto vazia.
- Vagas por categoria Interna / Associadas / Germinar (`utils/jobCategories.js`; migração v2 troca o enum e converte "Externa" → "Associadas").
- Boletins: já tinha upload de PDF + capa; padronizado (botões do kit, erros claros).
- GT: responsável próprio por grupo (nome, cargo, e-mail, WhatsApp, foto, link) em `gt.extra_data.responsavel`.
- Página nova **/projetos-sif-embrapii** (`pages/ProjetosEmbrapii.jsx`, painel `EmbrapiiAdmin`, page_configs `embrapii`) — esboço para aprovação; conteúdo resumido da landing EMBRAPII (sem nomes do comitê).

**Semanas 2–3 — usuários, permissões e modelos de página**
- `admins` ganhou: name, cargo, role (`admin`|`editor`), modules (JSON), gt_ids (JSON), active, last_login (migração **v3**, roda sozinha no 1º login).
  Os usuários que já existem viram **admin** (nada muda para eles).
- `api_guard.php`: `sif_user()`, `sif_can($modulo)`, `sif_require()`, `sif_deny()` (403). Mapa script→módulo para gravações;
  `page_content.php` confere por página (`sif_page_module`); leads/candidatos/banners/download conferem o módulo.
  Usuário logado sem permissão recebe **403** (nunca 401, que o painel trata como sessão expirada).
- `users.php` (novo): lista/cria/edita/exclui (só admin), `responsaveis=1` (nomes para o blog), `my_password`. Não deixa ficar sem admin ativo.
- Painel: tela **Usuários**, menu lateral filtrado por permissão (`utils/adminModules.js`, `contexts/AdminUserContext.jsx`), "Minha senha".
- Blog: `blog_posts.gt_id`, `responsavel_ids` (vários), `created_by`. Quem tem módulo Blog edita tudo; responsável por GT publica no blog do(s) seu(s) grupo(s);
  responsável pelo post edita o post. Página do GT mostra "Blog do grupo" (`components/GtBlogPosts.jsx`); post mostra os autores.
- Estrutura padrão de página: `PAGE_TEMPLATES` em `sectionTypes.js`; item novo de GT/Eventos/Treinamentos/In-Company/Projetos já nasce com os blocos;
  Produtos e Blog têm o botão "Usar a estrutura padrão". Bloco vazio não aparece no site (`isSectionEmpty`).

**Para publicar** (quando o Dan pedir): build + copiar `sif-api/*.php` novos/alterados **sem** `db.php`, `uploads/`, `nossa-gente/`.
Arquivos PHP novos: `users.php`. Alterados: api_guard, blog, page_content, login_admin, session, leads, candidates, banners, download, jobs, institucional.

## 9. Rodada de ajustes do Dan (21/10/2026) — 13 itens

Tudo commitado localmente; **não publicado**. Resumo do que mudou e onde:

- **Bento** (`components/NumbersBento.jsx`): mosaico sempre fechado (posição fixa por quantidade), frase abaixo do título, número aceita sufixo ("2,5 mil").
- **Trabalhe Conosco na Home**: virou seção abaixo das associadas (`components/JobsCtaSection.jsx`, aba "Trabalhe Conosco" no painel da Home). O 3º botão do topo saiu.
- **Padronagem de fundo**: `styles/pattern.css` (gerado por script a partir do favicon: pontinhos + folhinha) + `components/ui/BackgroundPattern.jsx` (lanterna no mouse, só move um círculo com transform). Páginas usam `.sif-page` (fundo transparente).
- **Sombras**: `--sif-shadow-card`/`-hover`, classes `.sif-card`, `shadow-card`.
- **Vídeo no topo da Home**: `sif-api/upload_video.php` (MP4/WebM até 40 MB; `.user.ini` subiu para 45M/50M), `HeroSection` (loop mudo, pausa fora da tela, respeita "menos movimento") + `components/ui/VideoModal.jsx` (YouTube/Vimeo/MP4).
- **Rodapé** mais escuro (`#092416`).
- **Páginas de GT montadas por blocos**: `components/sections/sectionTypes.js` (tipos + `PAGE_TEMPLATES` + `withGtDefaults`), `SectionBlocks.jsx` (desenho), `ContentSectionsRenderer.jsx` (layout `page` com faixas e âncoras), `admin/sections/BlockEditors.jsx`. Blocos especiais `gt_intro`/`gt_blog`/`gt_contact`. GT antigo: o texto vira o bloco "Apresentação" ao abrir no painel.
- **Topo padrão** de detalhe: `components/DetailHero.jsx` (GT, Evento, Treinamento, In-Company, Projeto).
- **Performance**: axios só no painel (`utils/axiosAdmin.js`; site usa `utils/http.js`), Blog/Post/Login sob demanda, GSAP em arquivo próprio, logos fora do JS, ruído como imagem (`styles/noise.css`), 4 pesos de fonte, cache/compressão (`public/.htaccess`, `public/assets/.htaccess`, `sif-api/.htaccess`).
- **SEO/GEO**: `sif-api/seo_lib.php` gera `cache/seo_index.json` a cada gravação no painel; `public/index.php` injeta título/descrição/OG/canonical/robots/JSON-LD e um resumo em texto no `#root`; `sitemap.xml`, `robots.txt`, `llms.txt` gerados do banco (rewrites no `public/.htaccess`). Na subpasta de homologação tudo sai como **noindex**; na raiz vira indexável sozinho. No front: `hooks/useSeo.js`.
- **Segurança/bugs (3 revisões)**: `sif_safe_unlink`, `sif_clean_html`/`sif_clean_json` (HTML limpo ao gravar; no navegador `sanitizeHtml` em `cleanRichHtml`), bloqueio de força bruta (`login_attempts`, migração **v4**), limite em contato/candidatura, item oculto = 404, gravação só da própria origem, `ErrorBoundary`, páginas de detalhe recomeçam ao trocar de slug (`BySlug` no `App.jsx`), uploads do editor de blocos rastreados (`admin/sections/uploadTracker.js`), Quill só repassa mudanças do usuário, importações (equipe/empresas/FAQ) só por botão, falha ao carregar trava o Salvar.
- **Padrão visual**: tokens no `tailwind.config.js` (`sif-*`, `rounded-card/panel`, `shadow-card`), classes `.sif-eyebrow/.sif-h1/.sif-h2/.sif-section/.sif-container` (index.css), `buttonClass()` no `ui/Button.jsx`. Títulos sem caixa-alta/negrito.
- **Painel novo**: `utils/adminModules.js` é o mapa único (grupos, rótulos, endereços `TAB_PATHS`, página no site). `/admin/dashboard` agora é o **Início** (`pages/admin/PainelInicio.jsx`); mensagens foram para `/admin/leads`. Sidebar verde por tarefa, barra do topo com "Ver no site", campo único `kit/Field.jsx`.

**Para publicar** (quando o Dan pedir): build + PHP novos `upload_video.php`, `seo_lib.php`, `sitemap.php`, `robots.php`, `llms.php` + todos os PHP alterados (nunca `db.php`, `uploads/`, `nossa-gente/`) + `sif-api/.htaccess`, `sif-api/.user.ini`. O `public/.htaccess` e `public/assets/.htaccess` vão dentro do build.
**No `db.php` de produção (manual, não é entregue):** liberar origens `localhost` só em ambiente local e, se possível, `ini_set('session.gc_maxlifetime', 86400)` antes do `session_start()`.

## 10. Desempenho, vídeo do topo e ambiente local (out/2026)

- **Imagens redimensionadas no servidor:** `sif-api/img.php?src=uploads/...&w=800`
  reduz a largura, converte para WebP e guarda em `sif-api/cache/img/`. No
  front, `getImageUrl(caminho, largura)` (apiConfig.js) já monta esse link.
  Precisa da extensão **GD** no PHP (na HostGator vem ligada; no XAMPP local
  foi ligada em `php.ini`). Sem GD, o img.php redireciona para a imagem
  original (nada quebra, só fica mais pesado). A Home caiu de ~13 MB para
  ~1,4 MB de imagens.
- **Sem Lenis:** a rolagem suave foi removida (rodava um laço o tempo todo e
  engasgava). O pacote ainda está no package.json, mas não é usado.
- **Topo da Home:** no painel, "Fundo do topo" = Imagem ou Vídeo. O vídeo pode
  ser link do YouTube/Vimeo (`video_loop_url`) ou MP4 enviado (`video_loop`).
  O botão "Assistir vídeo" usa `video_full_url` ou, vazio, o próprio vídeo.
- **CSS `.container`:** agora fica em `@layer components` e só define as
  laterais (antes zerava o espaço de cima/baixo de várias seções).
- **Ambiente local:** o Vite do SIF roda em **http://localhost:3000**
  (`.claude/launch.json`). A porta 5173 está ocupada por outro projeto (G3
  Clinic) e o login do painel não funciona por 127.0.0.1 (cookie).
