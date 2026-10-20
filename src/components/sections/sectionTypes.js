// Modelo único de SEÇÕES de página (base das "páginas pré-montadas com
// seções reordenáveis"). O mesmo formato serve para Eventos, Treinamentos,
// GT, Projetos, In-Company, Blog e Produtos (extra_data.sections /
// page_configs) — e é o que o editor e o renderizador usam.
//
// Formato de cada seção:
//   { id, type, title?, visible?, title_size?, title_weight?, title_upper?, title_align?, ...dados do tipo }
//   - a ORDEM do array é a ordem na página
//   - visible === false → não aparece no site (fica salva no painel)
//
// Para criar um tipo novo: acrescente aqui (create) e registre o editor em
// components/admin/sections e o render em components/ContentSectionsRenderer.

export const SECTION_TYPES = {
  editor: { label: 'Texto', create: () => ({ content: '' }) },
  tabs:   { label: 'Abas',  create: () => ({ tabs: [] }) },
  pdfs:   { label: 'PDFs',  create: () => ({ pdfs: [] }) },
  logos:  { label: 'Carrossel de logos', create: () => ({ images: [] }) },
};

export const newSectionId = () => `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function createSection(type) {
  const def = SECTION_TYPES[type];
  if (!def) throw new Error(`Tipo de seção desconhecido: ${type}`);
  return { id: newSectionId(), type, title: '', ...def.create() };
}

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

// Seção sem conteúdo nenhum (ex.: veio do modelo e não foi preenchida) —
// o site não mostra, para não aparecer título solto.
export function isSectionEmpty(s) {
  if (!s) return true;
  const blankHtml = (h) => !h || (!/<img|<iframe|<video/i.test(h) && h.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() === '');
  if (s.type === 'editor') return blankHtml(s.content);
  if (s.type === 'tabs')   return !(s.tabs || []).some(t => t && (t.title || !blankHtml(t.content)));
  if (s.type === 'pdfs')   return !(s.pdfs || []).some(p => p && (p.url || p.pdf_url));
  if (s.type === 'logos')  return !(s.images || []).some(Boolean);
  return false;
}

// ESTRUTURA PADRÃO por tipo de página: blocos já com título, para preencher.
// O que ficar vazio não aparece no site; a ordem e os títulos podem mudar.
export const PAGE_TEMPLATES = {
  gt: [
    ['editor', 'Objetivos'], ['editor', 'Linhas de pesquisa'],
    ['logos', 'Empresas participantes'], ['pdfs', 'Documentos e relatórios'],
  ],
  eventos: [
    ['editor', 'Sobre o evento'], ['tabs', 'Programação'], ['editor', 'Local e inscrições'],
    ['logos', 'Patrocinadores e apoio'], ['pdfs', 'Materiais'],
  ],
  treinamentos: [
    ['editor', 'Objetivos'], ['editor', 'Público-alvo'], ['tabs', 'Conteúdo programático'],
    ['editor', 'Instrutores'], ['pdfs', 'Materiais'],
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
