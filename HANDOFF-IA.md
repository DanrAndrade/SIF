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
