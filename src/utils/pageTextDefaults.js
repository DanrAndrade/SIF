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
      { key: 'cta_btn_link', label: 'Botão: link' },
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
      { key: 'cta_btn_link', label: 'Botão: link' },
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

// Junta o que veio do painel com o padrão. Campo apagado no painel ("") fica vazio
// de propósito; campo que nunca foi salvo (null/ausente) usa o texto padrão.
export const withTexts = (spec, config) => {
  const out = { ...spec.defaults };
  for (const k of Object.keys(spec.defaults)) if (config && config[k] != null) out[k] = config[k];
  return out;
};
