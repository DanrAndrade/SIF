# Auditoria completa — SIF (outubro/2026)

Feita antes da 2ª etapa (proposta aprovada: R$ 3.840, 4 semanas).
Três frentes: **painel administrativo**, **site público**, **backend (PHP + banco)**.
Só leitura — nada foi alterado. Caminhos relativos à raiz do repositório.

Legenda de gravidade: 🔴 alta · 🟠 média · ⚪ baixa

---

## ✅ Situação em 20/10/2026 (depois das correções)

| Fase | Situação |
|---|---|
| **1 — Corrigir** | Feito: itens 1–19 e S1–S5, S7 (ver lista abaixo). Testes automáticos do backend (17) passando. |
| **2 — Padronizar** | Feito: kit do painel em todas as telas, confirmações, avisos, ações de item, ocultar/reordenar onde faltava, remover imagem, cores. |
| **3 — Preparar** | Feito: limpeza, tipografia centralizada (`.sif-title` + variáveis), modelo único de seções (texto, abas, PDFs, carrossel de logos, ocultar). |

**Ficou para depois (conscientemente):**
- S6 — trocar a senha do painel e tirar o hash do `database/sif_db.sql` (depende de você).
- S8 — limite de tentativas no login, cookie de sessão próprio da subpasta, proteção CSRF; anti-spam no formulário de contato/currículos.
- Unificar as 6 telas de publicação num componente só (`PublicationAdmin`) e o "helper de CRUD" no PHP — fica junto do novo modelo de página da proposta (semanas 2–3), para não refazer duas vezes.
- Centralizar a classe `prose` (repetida ~15×), títulos gigantes que estouram no celular nas páginas de detalhe, acessibilidade (rótulos de botões, menu pelo teclado), requisições repetidas de `page_content`, apagar arquivos antigos ao trocar imagem.
- Itens da proposta (Montserrat ligada, sem caixa-alta, bento, rodapé editável etc.) — a estrutura está pronta, a mudança visual é a 2ª etapa.

---

## Fase 1 — Corrigir agora (bugs que perdem dados + segurança)

### Perda de dados / comportamento errado
| # | Problema | Onde | |
|---|---|---|---|
| 1 | Salvar o **cabeçalho (hero)** desfaz o **contato do responsável** e vice-versa (cada formulário reenvia a configuração antiga inteira) | `PageHeaderForm.jsx:229`, `PageContactForm.jsx:63`, `PageContentForm.jsx:39`, `ContatoAdmin.jsx:64`, `ProdutosAdmin.jsx:129` | 🔴 |
| 2 | Editar um item **oculto o publica de novo** (o formulário não envia `active`) | Eventos, Treinamentos, GT, Projetos, In-Company (`*Admin.jsx` + PHP) | 🔴 |
| 3 | Formulários **limpam/fecham mesmo quando o salvamento falha** | `ProjetosAdmin.jsx:109`, vagas `AdminViews.jsx:270`, `TimelineManager.jsx:36`, `TeamManager.jsx:81`, `AssociadasAdmin.jsx:334` | 🔴 |
| 4 | Badge **"Salvo" aparece mesmo com erro** (não checa resposta) | PageHeaderForm, PageContactForm, PageContentForm, Contato, Institucional, Associadas, Produtos | 🔴 |
| 5 | **Botões de link interno saem do site** na homologação (`/contato` vira `sif.org.br/contato`, o site antigo) | `ui/Button.jsx:29` (Home, FAQ, Associadas, Institucional), `BannerCarousel.jsx:135` | 🔴 |
| 6 | PDFs padrão do Estatuto ficam **sem a subpasta** | `Institucional.jsx:571` | 🔴 |
| 7 | Home: animação de rolagem **recriada a cada rolagem e nunca encerrada** (pesa o navegador; quebra o futuro bloco de números) | `Home.jsx:42-100` | 🔴 |
| 8 | "Status" de Eventos aparece no painel mas **nunca é gravado** | `EventosAdmin.jsx:242`, `eventos.php` | 🟠 |
| 9 | **Remover imagem/PDF não persiste** (Eventos, Blog, PDFs da EINCOL); Treinamentos/GT/Projetos nem têm botão remover | vários | 🟠 |
| 10 | EINCOL **reenvia as mesmas imagens/PDFs** a cada salvar (duplica arquivos) | `EincolAdmin.jsx:244` | 🟠 |
| 11 | **Link (slug) muda ao corrigir o título** — quebra links já divulgados; título repetido dá erro | publicações + `blog.php:133` | 🟠 |
| 12 | Imagem nova de card da Home vai para o **card errado** se reordenar antes de salvar | `AdminHome.jsx:350,411` | 🟠 |
| 13 | Institucional › "Nossa Gente": campos do cabeçalho **sem botão de salvar** visível | `InstitucionalAdmin.jsx:197` | 🟠 |
| 14 | Segmentos de Treinamentos/In-Company **somem ao recarregar** | `TreinamentosAdmin.jsx:34` | 🟠 |
| 15 | Formulário de Contato **não avisa quando o envio falha** | `Contact.jsx:182` | 🟠 |
| 16 | Sem página 404 (rota desconhecida = tela branca); links do rodapé para `/historia` e card `/comercial` inexistentes | `App.jsx`, `Footer.jsx:54`, `Services.jsx:8` | 🟠 |
| 17 | Resumo dos GTs corta o HTML no meio de uma tag | `GruposTematicos.jsx:109` | 🟠 |
| 18 | Erros do servidor saem como HTML/vazios (front mostra "Erro de conexão"); respostas sem `Content-Type: json`; formatos `{status}` × `{success}` misturados | vários PHP | 🟠 |
| 19 | Tabelas `eventos`, `gt`, `treinamentos` em **utf8 antigo** (emoji = erro); `extra_data` em **TEXT (64 KB)** — conteúdo grande é truncado | banco | 🟠 |

### Segurança
| # | Problema | |
|---|---|---|
| S1 | **Upload aceita qualquer extensão** (usa o nome do arquivo do usuário, sem checar o tipo real) em quase todos os endpoints; `upload.php` aceita SVG. A pasta `uploads/` no servidor **já bloqueia** execução de PHP — falta padronizar a validação | 🔴 |
| S2 | `page_content.php`: nome da página entra no caminho da pasta (dá para gravar fora de `uploads/`) — só admin | 🔴 |
| S3 | Currículos: upload público sem validação de tipo nem limite de envios (spam) | 🟠 |
| S4 | Itens **ocultos/rascunhos visíveis** a qualquer um com `?admin=1` | 🟠 |
| S5 | `sif-api/3-uploads.zip` (430 MB) **público para download** no servidor → apagar | 🟠 |
| S6 | Hash da senha do admin dentro de `database/sif_db.sql` no Git → trocar senha e tirar do dump | 🟠 |
| S7 | Scripts de manutenção (`migrate*`, `cleanup_duplicates`, `converter_webp`…) estão no Git; **no servidor não estão** ✔ — manter assim | ⚪ |
| S8 | Sessão do painel compartilha cookie com o site antigo da raiz; login sem limite de tentativas | ⚪ |

---

## Fase 2 — Padronizar (painel e páginas)

### O que está desigual hoje
- **3 estilos de tela** no painel (cards, títulos e cores diferentes).
- **Botão Salvar** em lugares diferentes: no topo (Home, Institucional, Associadas, Produtos), só no rodapé (publicações, EINCOL), ao sair do campo (Associadas), 3 botões empilhados (Vagas); some em algumas abas.
- **Exclusão:** `confirm()` do navegador (14 lugares), 4 modais copiados, e **sem confirmação** em seções, abas, PDFs, logos da EINCOL.
- **Avisos:** `alert()` (Blog), toast, selo "Salvo", ou nada (Leads, Candidatos, Vagas, Linha do Tempo).
- **Recursos que existem numa tela e faltam em outra:** reordenar (falta em Equipe, Empresas, Banners, publicações), ocultar (falta em Equipe e Linha do Tempo), remover imagem, contato do responsável (falta no Blog), editor de seções (EINCOL tem um próprio; Home/Institucional não têm).
- **7 cópias** de campo de texto, **6 jeitos** de subir imagem, **4 cópias** de abas no site, **3 jeitos** de embutir vídeo, **6 heros** de página de detalhe diferentes.
- Cores fora do verde: amarelo/âmbar/laranja em FAQ, Serviços, status de projetos/eventos/leads/vagas, avisos.

### Padrão proposto
- **`AdminPage`** — cabeçalho único (título, subtítulo, abas) com **barra fixa no topo**: indicador "alterações não salvas / Salvo" + **[Salvar]**.
- **`apiRequest`** — uma função para todas as chamadas: checa a resposta e mostra a mensagem real do servidor (nunca "Erro de conexão" quando houve resposta).
- **Feedback único:** toast de sucesso e de erro em todas as telas; sem `alert()`.
- **`ConfirmDialog`** — confirmação obrigatória em toda exclusão.
- **`ImageField`** — upload único com prévia e **remover** que funciona.
- **`SortableItemCard`** — toda lista de itens com as mesmas ações, sempre nesta ordem: **↑ ↓ · Visível · Editar · Excluir**.
- **`PublicationAdmin`** — modelo único para Eventos, Treinamentos, GT, Projetos, In-Company e Blog.
- Aviso de "alterações não salvas" ao trocar de tela; menu lateral atualiza o endereço.

---

## Fase 3 — Preparar para a proposta

1. **Tipografia centralizada:** hoje há 270 `uppercase`, 106 `font-black`, 163 `font-bold` espalhados. Montserrat **não é carregada** em lugar nenhum (o site usa a fonte do sistema). Carregar a fonte, criar classes únicas de título (`sif-h1`, `sif-h2`, `sif-eyebrow`, `sif-prose`) e componentes `PageHero`/`SectionTitle` — assim "sem caixa-alta e sem negrito" vira uma troca num lugar só.
2. **Modelo de página com seções reordenáveis:** um renderizador único de seções (texto, imagem, vídeo, abas, PDFs, carrossel de logos, cards, chamada, contato, números) que substitui as 3 versões atuais, lê os formatos antigos sem perder conteúdo, e um editor único no painel. Dados: itens continuam nas tabelas próprias (`extra_data`), páginas únicas em `page_configs` — formato `{ v:1, sections:[{id,type,visible,title,data}] }`.
3. **Backend comum:** helper de resposta JSON, upload seguro, slug único gerado no servidor, migração de banco versionada (LONGTEXT + utf8mb4) — cada endpoint fica com poucas linhas, sem mudar endereços.
4. **Rodapé editável** (`page_configs.footer`) e **bloco de números animado** (depende da correção #7).
5. **Limpeza:** remover pasta `sif/` (projeto antigo), zips de build no Git, `dist/` do Git, `Regional.jsx`, `DocumentsManager.jsx`, `produtos.php`, dependências sem uso (`recharts`, `leaflet`, `react-quill` antigo), CSS morto; atualizar HANDOFF.md.

---

## A confirmar no servidor
- `sql_mode` do MySQL (estrito ou não) — afeta truncamento silencioso.
- Se o repositório do GitHub é público (afeta S6).
- Export atualizado do banco de produção para testar com dados reais.
