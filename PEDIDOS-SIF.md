# Pedidos da SIF: o que já foi feito e o que falta

> Atualizado em 24/11/2026. Reúne os pedidos da Camila (Coordenação de Produtos e
> Serviços) e do Lucas (Comunicação), além das revisões de design do Dan.
> Legenda: **[feito]** já está no código e no GitHub · **[publicar]** feito, mas ainda
> não subiu para o servidor · **[pendente]** falta fazer · **[conversar]** depende de
> alinhamento com a SIF · **[aguardando SIF]** depende de material da SIF.

## Situação da publicação

- **25/11/2026:** banco local refeito a partir da produção + conteúdo novo de Produtos e Serviços; SQL de publicação regenerado e verificado (`Downloads/atualizacao-banco-2026-11-25.sql`, 13 campos). Ver HANDOFF-IA.md §15. O SQL de 24/11 deve ser descartado.

- Pacote pronto para subir: `Downloads/sif-atualizacao-2026-11-24.zip`
  (`index.html`, `assets/` e `sif-api/` direto na raiz do zip; extrair em
  `public_html/sif-novo-h7k2x9/`). Leva `upload_video.php`, `.user.ini`, as 32 fotos
  de `uploads/pages/produtos/slides/` e o PDF de diretrizes do Boletim.
- Banco: `Downloads/atualizacao-banco-2026-11-24.sql` (cópia em
  `database/atualizacoes/2026-11-produtos-servicos.sql`). Só altera a página Produtos e
  Serviços com `JSON_MERGE_PATCH`; pode rodar mais de uma vez.
- **[publicar]** Tudo das seções 2 e 3 abaixo está nesse pacote. O Dan ainda não subiu.

---

## 1. Lista "Ajustes do Site SIF" (Camila, out-nov/2026)

As respostas foram enviadas no PDF `Ajustes-Site-SIF - respostas.pdf`.

### Home
1. Tirar o texto/link do vídeo do topo: **[feito]** ele abre o vídeo completo. No painel
   agora há a opção "Mostrar o botão para assistir o vídeo completo" (`video_full_enabled`).
2. "+50 Anos" em preto e negrito: **[explicado]** o verde fecha a composição do bloco
   (canto inferior direito). Ficou como está.
3. Reduzir o espaço entre "Quem Somos" e "Nossos Serviços": **[explicado]** o espaço é
   proposital, para o bloco ficar centralizado na tela.
4. "Faça parte da SIF" abaixo do Menu e do FAQ: **[conversar]** não entendemos o "abaixo
   do Menu". A ordem das seções já pode ser mudada no painel (Página inicial > Ordem das
   seções). Aguardando a SIF detalhar.
5. Logo do rodapé com cores erradas: **[feito]** agora é a mesma logo do menu.

### Quem Somos
1. Reduzir o espaço entre blocos: **[feito]**.
2. Retirar "Sua empresa quer fazer parte desta história?" e os botões: **[feito]** a
   chamada foi excluída. O card verde "Faça parte" continua.

### Empresas Associadas
1. Nome da empresa não obrigatório: **[feito]** há uma opção para não exibir o nome. O
   campo continua obrigatório no cadastro, porque é o texto que o Google lê para saber
   qual empresa aparece em cada logo.

### Projetos
1. Tirar Conveniar e Portal da Transparência do menu, "Projetos SIF" e "Embrapii":
   **[feito]**. O botão "Conveniar" do canto do menu continua.

### Produtos e Serviços
1. Links no menu para Comercial, Boletim Técnico, Importação e Exportação e Proteção de
   Cultivares: **[feito]** cada item abre a aba direto (`?aba=...` e `#atalho`).
2. Páginas dentro de Comercial (Sementes, Tubetes, Treinamentos In Company, Serviços
   Especializados, Programa Germinar): **[feito]**.
   - **Patrocínios:** **[aguardando SIF]** ainda não tem conteúdo. Quando mandarem o
     texto, criamos a sub-aba e o link no menu.
3. Entregar as páginas já preenchidas: **[feito]** para Produtos e Serviços, com os
   slides de novembro (ver seção 2).
   - **[aguardando SIF]** textos e imagens das demais páginas.
4. Boletim Técnico com todos os boletins do site antigo e paginação: **[feito]** são 51
   boletins, 9 por página.
5. Busca no Boletim Técnico: **[feito]** (extra) com busca por título, com ou sem acento.

### Testeira (topo das páginas)
- Fotos não harmonizam com os títulos: **[feito]** os títulos agora ficam em duas linhas
  (`DetailHero` `titleLines` e `EditablePageHero`). A altura da área foi mantida.
  **[aguardando SIF]** o Lucas vai trocar as fotos de fundo por fotos pensadas para a
  composição, com o destaque à direita.

### GTs
- Retirar o bloco de projetos: **[explicado]** ele só existe no GT de demonstração. Eventos
  e Treinamentos já usam a mesma estrutura.
  - **[aguardando SIF]** o Lucas vai alimentar os GTs e eventos.

### Observações finais
1. Deixar o site o mais editável possível: **[feito]** todas as páginas têm o cartão
   "Textos da página". Ficam fixos só o menu e a página "não encontrado" (motivos no PDF
   de respostas).
2. Trazer a "folhinha" animada da identidade SIF: **[conversar]** as páginas agora são
   modulares (ordem e quantidade de seções configuráveis), então a animação exige um
   trabalho dedicado, para não quebrar em nenhuma combinação. Não está no escopo atual.

---

## 2. Pedidos de 19/11/2026 (Camila e Lucas: apresentações, áudios e prints)

Material: 3 apresentações (Sementes Deforsa, Tubetes Ellepot, Programa Germinar), fotos
em `Downloads/SIF - material novembro/`.

1. **[feito]** Qualidade do vídeo da Home: `src/utils/videoOptimize.js` usa 1920 px e
   6/4 Mbps. O original é mantido se tiver até 25 MB e o loop cobre até 60 s. Limite de
   envio de 60 MB (`upload_video.php`, `.user.ini` com 70M/100M). O Lucas reenvia o vídeo.
2. **[feito]** Proteção de Cultivares e Importação e Exportação viraram abas próprias ao
   lado de Serviços de P&D, com o texto que estava nas sub-abas do Comercial, e ganharam
   links no menu.
3. **[feito]** No painel, cada aba tem "Mostrar esta aba no site" (`<aba>_hidden`). A aba
   oculta some do site e do menu (Germinar, P&D e as outras).
4. **[feito]** Boletim: área "Envie seu boletim" com o PDF de diretrizes de submissão do
   site antigo, e capa inteira nos cards.
5. **[feito]** Vagas em abas Internas, Associadas e Germinar, com a aba vazia escondida
   (`JobFilters.jsx`).
6. **[feito]** Menu "Nesta página" dos eventos não corta o último item: setas e
   esfumado (`PageNav.jsx`).
7. **[feito]** "Cenheça" corrigido para "Conheça".
8. **[feito]** Comercial preenchido com o conteúdo dos slides:
   - Sementes Deforsa: 368 progênies de 6 espécies, dados climáticos dos 5 locais,
     valor comercial e empresas que compraram.
   - Tubetes Ellepot: vantagens, comparativo, estudos, personalização e valores simulados.
   - Treinamentos In Company.
9. **[feito]** Germinar preenchido com o conteúdo dos slides: objetivos, benefícios,
   números, mapa, depoimento, modalidades, fluxograma e segurança/investimento.
10. **[feito]** A imagem da tabela que eles tinham anexado em Produtos virou tabela real.
    Há tabelas no editor de texto de Produtos, Treinamentos, Blog e GTs.
11. **[conversar]** Folhinha animada (ver seção 1).

---

## 3. Revisão de design do Dan sobre Produtos e Serviços (23-24/11/2026)

Tudo **[feito]** e no GitHub (commits `d5dafef` a `9bdec2b`).

- **Cards de destaque** (`CardsBlock`):
  - marca d'água com a folha da SIF (`src/assets/icone.svg`, cinza, bem transparente);
  - até 4 cards numa fileira só;
  - 5 ou mais numa fileira que desliza com setas, em vez de duas linhas.
- **Abas** (`TabsBlock`):
  - lista numerada à esquerda e painel grande à direita, com a folha de fundo;
  - abas com tabela larga (dados climáticos) usam barra no topo e tabela compacta mais
    alta (`.sif-tab-wide`), com a coluna Anual em destaque.
- **Bloco novo "Comparativo"** (`compare`): "Tubete plástico x tubete Ellepot", lado a lado
  com o Ellepot destacado. Editor `CompareEditor`.
- **Bloco novo "Mapa do Brasil"** (`brazil_map`): mapa real em relevo
  (`BrazilMapBlock.jsx`, `brazilStates.js`, editor `BrazilMapEditor.jsx`). Os estados
  sobem animados, com balões e cidades. Usado em "Agregando talentos" do Germinar.
- **Submenus fixos:** as abas de Produtos (`.sif-tabbar`) e o "Nesta página" de
  eventos e GTs (`.sif-subnav`) ficam presos ao rolar, sobem quando o menu some e
  descem quando ele volta (`--sif-nav-h` no `index.css`).
- **"Não perca tempo..."** com botão em imagem: removido (só existia em Produtos).
- **Serviços de P&D, Proteção de Cultivares e Importação e Exportação** refeitos em
  blocos de design, com os textos da SIF e fotos (slides e Unsplash, salvas em
  `uploads/pages/produtos/slides/`):
  - P&D: texto e foto, os 6 serviços em destaque com fotos e chamada para o WhatsApp.
  - Cultivares: números (36, 40, 25, 14), portfólio de espécies e gêneros atendidos.
  - Importação: unidade do MAPA no campus da UFV e 3 cards de impacto na operação.
- **Associadas:** títulos do meio da página sem quebra de linha. A quebra fica só nos
  topos de página.

---

## 4. O que falta (resumo)

- [ ] **Dan:** publicar o zip e o SQL de 24/11 e conferir no ar.
- [ ] Depois de publicar: criar um GT de demonstração com todos os blocos novos, para a
      SIF ver e copiar o formato.
- [ ] **SIF:** detalhar o item 4 da Home ("Faça parte da SIF" abaixo do Menu).
- [ ] **SIF:** mandar o conteúdo de Patrocínios e das demais páginas.
- [ ] **SIF (Lucas):** fotos novas para os topos, vídeo da Home em alta e conteúdo dos GTs
      e eventos.
- [ ] **Conversar:** folhinha animada, como trabalho à parte.
