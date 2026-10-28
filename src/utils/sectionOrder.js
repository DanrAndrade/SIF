// Ordem das seções fixas de uma página (configurável no painel).
//
// O painel grava em page_configs um array de chaves, ex.:
//   section_order: ['sobre', 'servicos', 'numeros', ...]
// Este arquivo transforma esse array na ordem final usada pelo site:
//   - sem nada salvo: devolve a ordem padrão (exatamente a de hoje);
//   - chaves desconhecidas (seção que não existe mais) são ignoradas;
//   - chaves repetidas contam só uma vez;
//   - seção nova (que ainda não estava na lista salva) entra na posição
//     padrão: logo depois da seção que vem antes dela na ordem padrão.

export const SECTION_ORDER_FIELD = 'section_order';

export function resolveSectionOrder(saved, defaultKeys) {
  const known = new Set(defaultKeys);
  if (!Array.isArray(saved) || saved.length === 0) return [...defaultKeys];

  const out = [];
  for (const k of saved) {
    if (typeof k === 'string' && known.has(k) && !out.includes(k)) out.push(k);
  }

  // Seções que faltam: entram depois da vizinha anterior (ordem padrão)
  defaultKeys.forEach((k, i) => {
    if (out.includes(k)) return;
    let pos = 0;
    for (let j = i - 1; j >= 0; j--) {
      const idx = out.indexOf(defaultKeys[j]);
      if (idx !== -1) { pos = idx + 1; break; }
    }
    out.splice(pos, 0, k);
  });
  return out;
}

// Duas listas de chaves são iguais (mesma ordem)?
export function sameOrder(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((k, i) => k === b[i]);
}

// Seções que podem trocar de lugar em cada página, na ORDEM PADRÃO (a de
// hoje). A chave é o que vai salvo no banco; o rótulo aparece no painel.
// O topo (hero) e o rodapé de todas as páginas ficam sempre fixos.
export const PAGE_SECTIONS = {
  // Home: o bloco verde do topo (vídeo/foto + Missão, Visão e Valores) é fixo
  home: [
    { key: 'banners',  label: 'Banners (carrossel)', hint: 'Só aparece quando há banner ativo.' },
    { key: 'about',    label: 'Quem Somos' },
    { key: 'numbers',  label: 'A SIF em números', hint: 'Só aparece quando ativado na aba Números.' },
    { key: 'services', label: 'Nossos Serviços (cards que passam com a rolagem)' },
    { key: 'partners', label: 'Empresas associadas (logos)' },
    { key: 'jobs_cta', label: 'Trabalhe Conosco' },
    { key: 'process',  label: 'Explore nossos recursos' },
    { key: 'faq',      label: 'Perguntas frequentes' },
  ],
  institucional: [
    { key: 'quem_somos', label: 'Quem Somos' },
    { key: 'team',       label: 'Nossa Gente (equipe)' },
    { key: 'areas',      label: 'Áreas de atuação' },
    { key: 'estatuto',   label: 'Documentação e Transparência' },
    { key: 'historia',   label: 'Linha do tempo + chamada final' },
  ],
  associadas: [
    { key: 'texto',      label: 'Texto', hint: 'Só aparece quando a aba Texto está preenchida.' },
    { key: 'beneficios', label: 'Benefícios' },
    { key: 'logos',      label: 'Empresas (logos)' },
    { key: 'cta',        label: 'Chamada final (Seja uma Associada)' },
  ],
  embrapii: [
    { key: 'intro',    label: 'Apresentação' },
    { key: 'areas',    label: 'Áreas de atuação' },
    { key: 'sections', label: 'Blocos da aba Seções', hint: 'Os blocos continuam na ordem definida na aba Seções.' },
    { key: 'projects', label: 'Projetos em andamento' },
    { key: 'logos',    label: 'Logos (Realização e apoio)', hint: 'Os blocos de logos da aba Seções.' },
    { key: 'contact',  label: 'Fale conosco (formulário)' },
  ],
  jobs: [
    { key: 'vagas',   label: 'Vagas abertas' },
    { key: 'proposito', label: 'Missão, Visão e Valores' },
    { key: 'banco',   label: 'Banco de Talentos' },
  ],
};

export const sectionKeys = (page) => (PAGE_SECTIONS[page] || []).map(s => s.key);

// Atalho para o site: ordem final das chaves de uma página a partir da config
export const pageSectionOrder = (page, config) =>
  resolveSectionOrder(config ? config[SECTION_ORDER_FIELD] : null, sectionKeys(page));
