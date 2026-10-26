// Modelo único de SEÇÕES (blocos) de página. O mesmo formato serve para GT,
// Eventos, Treinamentos, Projetos, In-Company, Blog, Produtos e EINCOL
// (extra_data.sections / page_configs) — editor e renderizador usam este arquivo.
//
// Formato de cada bloco:
//   { id, type, title?, eyebrow?, bg?, visible?, title_size?, title_weight?, title_upper?, title_align?, ...dados do tipo }
//   - a ORDEM do array é a ordem na página
//   - visible === false → não aparece no site (fica salvo no painel)
//   - bg → fundo da faixa no layout "página" (ver BAND_STYLES)
//
// Para criar um tipo novo: acrescente aqui (create + isSectionEmpty), o editor
// em components/admin/sections/BlockEditors.jsx e o desenho em
// components/sections/SectionBlocks.jsx.

export const SECTION_TYPES = {
  editor:     { label: 'Texto',             icon: 'Type',        desc: 'Texto livre com títulos, listas, links e imagens.', create: () => ({ content: '' }) },
  text_image: { label: 'Texto + imagem',    icon: 'ImageIcon',   desc: 'Texto ao lado de uma foto (esquerda ou direita).', create: () => ({ content: '', image: '', image_side: 'right' }) },
  cards:      { label: 'Cards de destaque', icon: 'LayoutGrid',  desc: 'Grade de cards com ícone, título e texto (objetivos, linhas de pesquisa...).', create: () => ({ items: [{ icon: 'Target', title: '', text: '' }, { icon: 'Microscope', title: '', text: '' }, { icon: 'Leaf', title: '', text: '' }] }) },
  stats:      { label: 'Números',           icon: 'BarChart3',   desc: 'Faixa com números grandes e legendas.', create: () => ({ items: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }] }) },
  people:     { label: 'Pessoas',           icon: 'Users',       desc: 'Fotos com nome, cargo e link (coordenação, comitê...).', create: () => ({ items: [] }) },
  gallery:    { label: 'Galeria de fotos',  icon: 'Images',      desc: 'Grade de fotos que abre em tela cheia.', create: () => ({ images: [] }) },
  video:      { label: 'Vídeo',             icon: 'PlayCircle',  desc: 'Vídeo do YouTube, Vimeo ou arquivo MP4.', create: () => ({ url: '', caption: '' }) },
  quote:      { label: 'Citação',           icon: 'Quote',       desc: 'Frase em destaque com autor.', create: () => ({ text: '', author: '', role: '' }) },
  cta:        { label: 'Chamada',           icon: 'Megaphone',   desc: 'Faixa com texto e botão (inscrição, contato...).', create: () => ({ text: '', btn_label: '', btn_link: '' }) },
  tabs:       { label: 'Abas',              icon: 'Layers',      desc: 'Conteúdo dividido em abas (programação, módulos...).', create: () => ({ tabs: [] }) },
  pdfs:       { label: 'Documentos (PDF)',  icon: 'FileText',    desc: 'Lista de arquivos para baixar.', create: () => ({ pdfs: [] }) },
  logos:      { label: 'Carrossel de logos', icon: 'Building2',  desc: 'Logos de empresas, patrocinadores ou parceiros.', create: () => ({ images: [] }) },
  // Blocos especiais da página de Grupo Temático (só posição/título; o conteúdo vem de outro lugar)
  gt_intro:   { label: 'Apresentação do grupo', icon: 'Info',    desc: 'Texto de apresentação do grupo.', only: ['gt'], create: () => ({ content: '' }) },
  gt_blog:    { label: 'Blog do grupo',     icon: 'Newspaper',   desc: 'Últimos posts do blog deste grupo (automático).', only: ['gt'], unique: true, create: () => ({ limit: 3 }) },
  gt_contact: { label: 'Responsável',       icon: 'UserRound',   desc: 'Card do responsável pelo grupo (automático).', only: ['gt'], unique: true, create: () => ({}) },
};

// Fundos de faixa (layout "página"). O padrão alterna sozinho entre claro e branco.
export const BAND_STYLES = {
  auto:   'Automático',
  plain:  'Fundo da página',
  white:  'Branco',
  tinted: 'Verde bem claro',
  glow:   'Degradê verde suave',
  photo:  'Foto desfocada (escuro)',
  dark:   'Verde escuro',
};

export const newSectionId = () => `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function createSection(type) {
  const def = SECTION_TYPES[type];
  if (!def) throw new Error(`Tipo de seção desconhecido: ${type}`);
  return { id: newSectionId(), type, title: '', ...def.create() };
}

// Tipos que podem ser adicionados numa página (kind: 'gt', 'eventos'...)
export const typesFor = (kind) => Object.entries(SECTION_TYPES)
  .filter(([, d]) => !d.only || d.only.includes(kind))
  .map(([type, d]) => ({ type, ...d }));

// Aceita os formatos antigos e devolve tudo no formato atual, sem perder nada:
//   - EINCOL: { type: undefined|'text', text }  → editor (content)
//             { type: 'sponsors', images }       → logos
//   - seções sem id ganham um id estável (pela posição)
export function normalizeSections(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean).map((s, i) => {
    let out = { ...s };
    if (!out.type || out.type === 'text') {
      out = { ...out, type: 'editor', content: out.content ?? out.text ?? '' };
    } else if (out.type === 'sponsors') {
      out = { ...out, type: 'logos' };
    }
    if (!out.id) out.id = out._uid || `s-${i}`;
    return out;
  });
}

// Só as seções que aparecem no site
export const visibleSections = (list) => normalizeSections(list).filter(s => s.visible !== false);

const blankHtml = (h) => !h || (!/<img|<iframe|<video/i.test(h) && h.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() === '');

// Seção sem conteúdo nenhum (ex.: veio do modelo e não foi preenchida) —
// o site não mostra, para não aparecer título solto.
export function isSectionEmpty(s) {
  if (!s) return true;
  switch (s.type) {
    case 'editor':
    case 'gt_intro':   return blankHtml(s.content);
    case 'text_image': return blankHtml(s.content) && !s.image;
    case 'cards':      return !(s.items || []).some(i => i && (i.title || i.text));
    case 'stats':      return !(s.items || []).some(i => i && String(i.value || '').trim());
    case 'people':     return !(s.items || []).some(i => i && i.name);
    case 'gallery':    return !(s.images || []).some(Boolean);
    case 'video':      return !String(s.url || '').trim();
    case 'quote':      return !String(s.text || '').trim();
    case 'cta':        return !String(s.text || '').trim() && !s.title && !s.btn_label;
    case 'tabs':       return !(s.tabs || []).some(t => t && (t.title || !blankHtml(t.content)));
    case 'pdfs':       return !(s.pdfs || []).some(p => p && (p.url || p.pdf_url));
    case 'logos':      return !(s.images || []).some(Boolean);
    default:           return false; // gt_blog / gt_contact: o próprio bloco decide
  }
}

// Texto curto a partir de HTML (para resumos)
export const htmlExcerpt = (html = '', max = 180) => {
  const t = String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
};

// ESTRUTURA PADRÃO por tipo de página: blocos já com título, para preencher.
// O que ficar vazio não aparece no site; a ordem e os títulos podem mudar.
export const PAGE_TEMPLATES = {
  gt: [
    ['gt_intro', 'Sobre o grupo'], ['cards', 'Objetivos'], ['stats', 'O grupo em números'], ['cards', 'Linhas de pesquisa'],
    ['people', 'Coordenação'], ['logos', 'Empresas participantes'], ['pdfs', 'Documentos e relatórios'],
    ['gt_blog', 'Blog do grupo'], ['gt_contact', 'Fale com o responsável'],
  ],
  eventos: [
    ['editor', 'Sobre o evento'], ['tabs', 'Programação'], ['editor', 'Local e inscrições'],
    ['logos', 'Patrocinadores e apoio'], ['pdfs', 'Materiais'],
  ],
  treinamentos: [
    ['editor', 'Objetivos'], ['editor', 'Público-alvo'], ['tabs', 'Conteúdo programático'],
    ['people', 'Instrutores'], ['pdfs', 'Materiais'],
  ],
  in_company: [
    ['editor', 'Objetivos'], ['editor', 'Para quem é'], ['tabs', 'Conteúdo programático'], ['pdfs', 'Materiais'],
  ],
  projetos: [
    ['editor', 'Objetivos'], ['editor', 'Metodologia'], ['editor', 'Resultados'],
    ['logos', 'Empresas parceiras'], ['pdfs', 'Publicações'],
  ],
  produtos: [
    ['editor', 'Como funciona'], ['editor', 'Benefícios para a empresa'], ['pdfs', 'Materiais'],
  ],
  blog: [
    ['pdfs', 'Arquivos para download'],
  ],
};

export function createTemplate(kind) {
  return (PAGE_TEMPLATES[kind] || []).map(([type, title]) => ({ ...createSection(type), title }));
}

// GT: garante os blocos especiais (apresentação no começo; blog e responsável
// no fim) para páginas antigas que ainda não têm — sem mexer nas que já têm.
export function withGtDefaults(sections, description = '') {
  const list = normalizeSections(sections);
  const has = (t) => list.some(s => s.type === t);
  const out = [...list];
  if (!has('gt_intro')) out.unshift({ ...createSection('gt_intro'), id: 's-gt-intro', title: 'Sobre o grupo', content: description || '' });
  if (!has('gt_blog')) out.push({ ...createSection('gt_blog'), id: 's-gt-blog', title: 'Blog do grupo' });
  if (!has('gt_contact')) out.push({ ...createSection('gt_contact'), id: 's-gt-contact', title: 'Fale com o responsável' });
  return out;
}
