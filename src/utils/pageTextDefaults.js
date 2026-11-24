// Textos de seções que antes eram fixos no código. Os valores abaixo são o
// texto atual (usado enquanto o painel não tiver nada salvo). Ficam na mesma
// configuração da página (page_configs) que o cabeçalho.
//
// fields: o que aparece no painel (PageTextsForm), na ordem.

// Página /grupos-tematicos (chave "gt")
export const GT_LIST_TEXTS = {
  defaults: {
    intro_title_before: 'Onde a',
    intro_title_highlight: 'ciência',
    intro_title_after: 'encontra o campo.',
    intro_text: 'Os Grupos Temáticos da SIF representam parcerias estratégicas entre a academia e as empresas associadas, focadas em solucionar desafios reais do setor por meio de pesquisa aplicada.',
    cta_title: 'Quer tornar sua empresa',
    cta_highlight: 'parceira de um GT?',
    cta_text: 'Participe ativamente das pesquisas e tenha acesso prioritário aos resultados e tecnologias geradas.',
    cta_btn_label: 'Quero ser associado',
    cta_btn_link: '/associadas',
  },
  groups: [
    { title: 'Apresentação (acima da lista de grupos)', fields: [
      { key: 'intro_title_before', label: 'Título: começo' },
      { key: 'intro_title_highlight', label: 'Título: palavra em verde' },
      { key: 'intro_title_after', label: 'Título: fim (vai para a linha de baixo)' },
      { key: 'intro_text', label: 'Texto', type: 'textarea', rows: 3, wide: true },
    ] },
    { title: 'Chamada no fim da página', fields: [
      { key: 'cta_title', label: 'Título' },
      { key: 'cta_highlight', label: 'Título: parte em verde' },
      { key: 'cta_text', label: 'Texto', type: 'textarea', rows: 2, wide: true },
      { key: 'cta_btn_label', label: 'Botão: texto (vazio esconde)' },
      { key: 'cta_btn_link', label: 'Botão: link', hint: 'Página do site: /contato. Outro site: https://...' },
    ] },
  ],
};

// Página /treinamentos (chave "treinamentos"): chamada para o In-Company
export const TREINAMENTOS_TEXTS = {
  defaults: {
    cta_title: 'Sua empresa quer',
    cta_highlight: 'capacitar a equipe?',
    cta_text: 'Realizamos treinamentos customizados (In-Company) adaptados às necessidades específicas do seu negócio florestal.',
    cta_btn_label: 'Consultar projeto customizado',
    cta_btn_link: '/treinamentos-in-company',
  },
  groups: [
    { title: 'Chamada no fim da página (In-Company)', fields: [
      { key: 'cta_title', label: 'Título: primeira linha' },
      { key: 'cta_highlight', label: 'Título: segunda linha (em verde)' },
      { key: 'cta_text', label: 'Texto', type: 'textarea', rows: 2, wide: true },
      { key: 'cta_btn_label', label: 'Botão: texto (vazio esconde)' },
      { key: 'cta_btn_link', label: 'Botão: link', hint: 'Página do site: /contato. Outro site: https://...' },
    ] },
  ],
};

// Página /eventos (chave "eventos"): card do EINCOL (aparece quando o EINCOL está ativo)
export const EVENTOS_TEXTS = {
  defaults: {
    eincol_card_tag: 'Evento especial',
    eincol_card_title: 'EINCOL',
    eincol_card_text: 'Encontro Internacional de Ciência Florestal: conheça a programação completa, os palestrantes e como participar.',
    eincol_card_btn: 'Acessar página',
  },
  groups: [
    { title: 'Card do EINCOL (aparece quando o EINCOL está ativo)', fields: [
      { key: 'eincol_card_tag', label: 'Etiqueta' },
      { key: 'eincol_card_title', label: 'Título' },
      { key: 'eincol_card_btn', label: 'Botão: texto' },
      { key: 'eincol_card_text', label: 'Texto', type: 'textarea', rows: 2, wide: true },
    ] },
  ],
};

// ─── Títulos, etiquetas e botões que eram fixos no código (nov/2026) ───────
// Cada página ganha estes campos no cartão "Textos da página" do painel.
// O menu de navegação e a página "não encontrado" continuam fixos de propósito.
const extend = (spec, defaults, groups) => { Object.assign(spec.defaults, defaults); spec.groups.push(...groups); };

// Página inicial (chave "home")
export const HOME_TEXTS = {
  defaults: {
    banners_title: 'Destaques',
    partners_title: 'Nossos Parceiros',
    faq_tag: 'Tire suas Dúvidas',
    faq_title: 'Perguntas Frequentes',
    process_btn: 'Acessar',
    video_title: 'Vídeo Institucional SIF',
  },
  groups: [
    { title: 'Títulos das seções', fields: [
      { key: 'banners_title', label: 'Título acima dos banners' },
      { key: 'partners_title', label: 'Título da faixa de parceiros' },
      { key: 'faq_tag', label: 'Perguntas frequentes: etiqueta' },
      { key: 'faq_title', label: 'Perguntas frequentes: título' },
      { key: 'process_btn', label: 'Botão dos cards de "Explore nossos recursos"' },
      { key: 'video_title', label: 'Título da janela do vídeo de "Quem Somos"' },
    ] },
  ],
};

// Empresas associadas (chave "associadas")
export const ASSOCIADAS_TEXTS = {
  defaults: { beneficios_tag: 'Benefícios' },
  groups: [
    { title: 'Seção de benefícios', fields: [
      { key: 'beneficios_tag', label: 'Etiqueta acima do título' },
    ] },
  ],
};

// Produtos e serviços (chave "produtos")
export const PRODUTOS_TEXTS = {
  defaults: {
    tab_comercial: 'Comercial',
    tab_germinar: 'Programa Germinar',
    tab_boletim: 'Boletim Técnico',
    tab_pd: 'Serviços de P&D',
    boletim_card_tag: 'Boletim Técnico',
    boletim_search_placeholder: 'Buscar boletim pelo título',
    germinar_card_btn_link: '/trabalhe-conosco',
  },
  groups: [
    { title: 'Nomes das abas', fields: [
      { key: 'tab_comercial', label: 'Nome da aba Comercial' },
      { key: 'tab_germinar', label: 'Nome da aba Programa Germinar' },
      { key: 'tab_boletim', label: 'Nome da aba Boletim Técnico' },
      { key: 'tab_pd', label: 'Nome da aba Serviços de P&D' },
    ] },
    { title: 'Boletim Técnico', fields: [
      { key: 'boletim_card_tag', label: 'Etiqueta em cada boletim' },
      { key: 'boletim_search_placeholder', label: 'Texto dentro da busca' },
    ] },
    { title: 'Card do Programa Germinar (fim da página)', fields: [
      { key: 'germinar_card_btn_link', label: 'Link do botão', hint: 'Página do site: /contato. Outro site: https://...' },
    ] },
  ],
};

// Eventos (chave "eventos"): lista e página de cada evento
extend(EVENTOS_TEXTS, {
  list_open_title: 'Eventos em',
  list_open_accent: 'Andamento',
  list_done_title: 'Eventos',
  list_done_accent: 'Concluídos',
  badge_open: 'Inscrições Abertas',
  badge_done: 'Concluído',
  detail_eyebrow: 'Evento',
  detail_about_title: 'Sobre o evento',
  fact_date: 'Data',
  fact_time: 'Horário',
  fact_place: 'Local',
  fact_status: 'Situação',
  fact_date_empty: 'A confirmar',
  fact_place_empty: 'A definir',
  contact_title: 'Fale com a equipe',
  contact_btn: 'Falar com a equipe',
}, [
  { title: 'Lista de eventos', fields: [
    { key: 'list_open_title', label: 'Título "em andamento": começo' },
    { key: 'list_open_accent', label: 'Título "em andamento": parte em verde' },
    { key: 'badge_open', label: 'Selo dos eventos abertos' },
    { key: 'list_done_title', label: 'Título "concluídos": começo' },
    { key: 'list_done_accent', label: 'Título "concluídos": parte em verde' },
    { key: 'badge_done', label: 'Selo dos eventos concluídos' },
  ] },
  { title: 'Página de cada evento', fields: [
    { key: 'detail_eyebrow', label: 'Etiqueta acima do título' },
    { key: 'detail_about_title', label: 'Título do texto de apresentação' },
    { key: 'contact_title', label: 'Título do bloco de contato' },
    { key: 'contact_btn', label: 'Botão de contato (topo)' },
    { key: 'fact_date', label: 'Faixa de informações: "Data"' },
    { key: 'fact_time', label: 'Faixa de informações: "Horário"' },
    { key: 'fact_place', label: 'Faixa de informações: "Local"' },
    { key: 'fact_status', label: 'Faixa de informações: "Situação"' },
    { key: 'fact_date_empty', label: 'Quando não há data' },
    { key: 'fact_place_empty', label: 'Quando não há local' },
  ] },
]);

// Treinamentos (chave "treinamentos"): lista e página de cada treinamento
extend(TREINAMENTOS_TEXTS, {
  count_label: 'Cursos disponíveis',
  detail_eyebrow: 'Treinamento',
  detail_about_title: 'Sobre o treinamento',
  fact_area: 'Área',
  fact_format: 'Formato',
  fact_hours: 'Carga horária',
  fact_period: 'Período',
  fact_place: 'Local',
  contact_title: 'Fale com a equipe',
  contact_btn: 'Falar com a equipe',
}, [
  { title: 'Lista de treinamentos', fields: [
    { key: 'count_label', label: 'Texto ao lado do número de cursos' },
  ] },
  { title: 'Página de cada treinamento', fields: [
    { key: 'detail_eyebrow', label: 'Etiqueta acima do título' },
    { key: 'detail_about_title', label: 'Título do texto de apresentação' },
    { key: 'contact_title', label: 'Título do bloco de contato' },
    { key: 'contact_btn', label: 'Botão de contato (topo)' },
    { key: 'fact_area', label: 'Faixa de informações: "Área"' },
    { key: 'fact_format', label: 'Faixa de informações: "Formato"' },
    { key: 'fact_hours', label: 'Faixa de informações: "Carga horária"' },
    { key: 'fact_period', label: 'Faixa de informações: "Período"' },
    { key: 'fact_place', label: 'Faixa de informações: "Local"' },
  ] },
]);

// Treinamentos In-Company (chave "treinamentos_in_company")
export const IN_COMPANY_TEXTS = {
  defaults: {
    count_label: 'Cursos disponíveis',
    detail_eyebrow: 'Treinamento In-Company',
    detail_about_title: 'Sobre o treinamento',
    fact_area: 'Área',
    fact_class: 'Turma',
    class_value: 'Exclusiva para a sua empresa',
    fact_format: 'Formato',
    fact_hours: 'Carga horária',
    fact_place: 'Local',
    contact_title: 'Fale com a equipe',
    contact_btn: 'Falar com a equipe',
  },
  groups: [
    { title: 'Lista de treinamentos', fields: [
      { key: 'count_label', label: 'Texto ao lado do número de cursos' },
    ] },
    { title: 'Página de cada treinamento', fields: [
      { key: 'detail_eyebrow', label: 'Etiqueta acima do título' },
      { key: 'detail_about_title', label: 'Título do texto de apresentação' },
      { key: 'contact_title', label: 'Título do bloco de contato' },
      { key: 'contact_btn', label: 'Botão de contato (topo)' },
      { key: 'fact_area', label: 'Faixa de informações: "Área"' },
      { key: 'fact_class', label: 'Faixa de informações: "Turma"' },
      { key: 'class_value', label: 'Valor da "Turma"' },
      { key: 'fact_format', label: 'Faixa de informações: "Formato"' },
      { key: 'fact_hours', label: 'Faixa de informações: "Carga horária"' },
      { key: 'fact_place', label: 'Faixa de informações: "Local"' },
    ] },
  ],
};

// Grupos Temáticos (chave "gt"): lista e página de cada grupo
extend(GT_LIST_TEXTS, {
  card_btn: 'Saiba mais',
  detail_eyebrow: 'Grupo Temático',
  contact_btn: 'Falar com o responsável',
  contact_title: 'Responsável pelo grupo',
  blog_btn: 'Ver o blog completo',
}, [
  { title: 'Lista de grupos', fields: [
    { key: 'card_btn', label: 'Botão de cada grupo' },
  ] },
  { title: 'Página de cada grupo', fields: [
    { key: 'detail_eyebrow', label: 'Etiqueta acima do título' },
    { key: 'contact_btn', label: 'Botão de contato (topo)' },
    { key: 'contact_title', label: 'Título do card do responsável (quando não preenchido)' },
    { key: 'blog_btn', label: 'Botão do blog do grupo' },
  ] },
]);

// Projetos P&D (chave "projetos")
export const PROJETOS_TEXTS = {
  defaults: {
    open_title: 'Projetos em',
    open_accent: 'Andamento',
    done_title: 'Projetos',
    done_accent: 'Concluídos',
    detail_eyebrow: 'Projeto de P&D',
    pdf_btn: 'Baixar Documento do Projeto (PDF)',
    link_btn: 'Visitar Página Externa do Projeto',
    contact_title: 'Fale com o responsável',
  },
  groups: [
    { title: 'Lista de projetos', fields: [
      { key: 'open_title', label: 'Título "em andamento": começo' },
      { key: 'open_accent', label: 'Título "em andamento": parte em verde' },
      { key: 'done_title', label: 'Título "concluídos": começo' },
      { key: 'done_accent', label: 'Título "concluídos": parte em verde' },
    ] },
    { title: 'Página de cada projeto', fields: [
      { key: 'detail_eyebrow', label: 'Etiqueta acima do título' },
      { key: 'pdf_btn', label: 'Botão do documento (PDF)' },
      { key: 'link_btn', label: 'Botão da página externa' },
      { key: 'contact_title', label: 'Título do bloco de contato' },
    ] },
  ],
};

// Projetos SIF e EMBRAPII (chave "embrapii")
export const EMBRAPII_TEXTS = {
  defaults: {
    projects_all_btn: 'Ver todos os projetos',
    minibio_label: 'Minibio',
    minibio_btn: 'Ler minibio',
    form_success_title: 'Mensagem enviada.',
    form_success_text: 'Obrigado pelo interesse. A equipe da Unidade EMBRAPII Fibras Florestais vai retornar o contato.',
  },
  groups: [
    { title: 'Outros textos da página', fields: [
      { key: 'projects_all_btn', label: 'Botão abaixo dos projetos' },
      { key: 'minibio_btn', label: 'Botão para abrir a minibio' },
      { key: 'minibio_label', label: 'Título da janela da minibio' },
      { key: 'form_success_title', label: 'Formulário: título após o envio' },
      { key: 'form_success_text', label: 'Formulário: texto após o envio', type: 'textarea', rows: 2, wide: true },
    ] },
  ],
};

// Blog (chave "blog"): página de cada publicação
export const BLOG_TEXTS = {
  defaults: {
    post_tag: 'Blog & Notícias',
    post_box_title: 'Artigo',
    post_box_sub: 'SIF Media Center',
    related_title: 'Leia Também',
  },
  groups: [
    { title: 'Página de cada publicação', fields: [
      { key: 'post_tag', label: 'Etiqueta no topo' },
      { key: 'post_box_title', label: 'Caixa lateral: título' },
      { key: 'post_box_sub', label: 'Caixa lateral: subtítulo' },
      { key: 'related_title', label: 'Título das publicações relacionadas' },
    ] },
  ],
};

// Trabalhe Conosco (chave "jobs")
export const JOBS_TEXTS = {
  defaults: {
    proposito_tag: 'Nosso propósito',
    proposito_title_line1: 'O que nos',
    proposito_title_line2: 'move',
    empty_tag: 'Nenhuma vaga no momento',
    empty_title: 'As próximas oportunidades',
    empty_title_hl: 'aparecem aqui.',
    empty_text: 'Enquanto isso, deixe seu currículo no banco de talentos. Quando surgir uma vaga com o seu perfil, falamos com você.',
    empty_btn: 'Cadastrar meu currículo',
    banco_location: 'Geral',
    banco_type: 'Cadastro reserva',
    banco_description: 'Seu currículo ficará em nossa base estratégica para futuras oportunidades dentro dos nossos pilares técnicos e científicos.',
    apply_intro: 'Preencha seus dados e anexe o currículo. Levamos menos de dois minutos.',
  },
  groups: [
    { title: 'Seção Missão, Visão e Valores', fields: [
      { key: 'proposito_tag', label: 'Etiqueta' },
      { key: 'proposito_title_line1', label: 'Título: começo' },
      { key: 'proposito_title_line2', label: 'Título: parte em verde' },
    ] },
    { title: 'Quando não há vagas abertas', fields: [
      { key: 'empty_tag', label: 'Etiqueta' },
      { key: 'empty_title', label: 'Título: começo' },
      { key: 'empty_title_hl', label: 'Título: parte em verde' },
      { key: 'empty_text', label: 'Texto', type: 'textarea', rows: 2, wide: true },
      { key: 'empty_btn', label: 'Botão' },
    ] },
    { title: 'Banco de talentos (janela de cadastro)', fields: [
      { key: 'banco_location', label: 'Local' },
      { key: 'banco_type', label: 'Tipo' },
      { key: 'banco_description', label: 'Descrição', type: 'textarea', rows: 2, wide: true },
    ] },
    { title: 'Formulário de candidatura', fields: [
      { key: 'apply_intro', label: 'Texto de apresentação', type: 'textarea', rows: 2, wide: true },
    ] },
  ],
};

// Contato (chave "contato")
export const CONTATO_TEXTS = {
  defaults: {
    map_link: 'Como chegar',
    success_title: 'Mensagem enviada.',
    success_text: 'Obrigado pelo contato. Sua mensagem foi entregue à nossa secretaria técnica.',
  },
  groups: [
    { title: 'Outros textos da página', fields: [
      { key: 'map_link', label: 'Texto do link do endereço no mapa' },
      { key: 'success_title', label: 'Formulário: título após o envio' },
      { key: 'success_text', label: 'Formulário: texto após o envio', type: 'textarea', rows: 2, wide: true },
    ] },
  ],
};

// EINCOL (chave "eincol")
export const EINCOL_TEXTS = {
  defaults: {
    hero_tag: 'Evento Especial SIF',
    hero_scroll: 'Saiba Mais',
    plant_tag: 'Planta do Evento',
    plant_title: 'Conheça o',
    plant_title_hl: 'Espaço',
    plant_btn: 'Baixar Planta',
    downloads_title: 'Downloads',
    schedule_title: 'Programação',
  },
  groups: [
    { title: 'Títulos e botões da página', fields: [
      { key: 'hero_tag', label: 'Etiqueta no topo' },
      { key: 'hero_scroll', label: 'Texto para rolar a página (topo)' },
      { key: 'plant_tag', label: 'Planta: etiqueta' },
      { key: 'plant_title', label: 'Planta: título' },
      { key: 'plant_title_hl', label: 'Planta: título em verde' },
      { key: 'plant_btn', label: 'Planta: botão' },
      { key: 'downloads_title', label: 'Título dos downloads' },
      { key: 'schedule_title', label: 'Título da programação' },
    ] },
  ],
};

// Junta o que veio do painel com o padrão. Campo apagado no painel ("") fica vazio
// de propósito; campo que nunca foi salvo (null/ausente) usa o texto padrão.
export const withTexts = (spec, config) => {
  const out = { ...spec.defaults };
  for (const k of Object.keys(spec.defaults)) if (config && config[k] != null) out[k] = config[k];
  return out;
};
