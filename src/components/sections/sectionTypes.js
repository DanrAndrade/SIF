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
