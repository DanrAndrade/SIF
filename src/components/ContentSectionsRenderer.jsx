import React from 'react';
import { visibleSections, isSectionEmpty } from './sections/sectionTypes';
import { BLOCKS } from './sections/SectionBlocks';

// Desenha os blocos de uma página (modelo único em sections/sectionTypes.js).
//
// layout="stack" (padrão): blocos empilhados dentro do card da página
//   (Eventos, Treinamentos, Projetos, Blog...).
// layout="page": cada bloco vira uma faixa de largura total, com fundo
//   alternado (ou o escolhido no painel) e âncora para o menu da página (GT).
//
// special: { tipo: (bloco) => ReactNode } para blocos especiais da página
//   (ex.: gt_blog e gt_contact no Grupo Temático). Se devolver null, some.
export const sectionAnchor = (sec) => `secao-${sec.id}`;

const BAND = {
  plain:  { cls: 'bg-transparent', dark: false },
  white:  { cls: 'bg-white', dark: false },
  tinted: { cls: 'bg-[var(--accent-tint,#eef5f0)]', dark: false },
  dark:   { cls: 'sif-glow-dark text-white', dark: true },
  glow:   { cls: 'sif-glow', dark: false },
};

export function renderableSections(sections, special = {}) {
  return visibleSections(sections).filter(s =>
    special[s.type] ? true : (BLOCKS[s.type] && !isSectionEmpty(s)));
}

export default function ContentSectionsRenderer({ sections, layout = 'stack', special = {} }) {
  const list = renderableSections(sections, special);
  if (!list.length) return null;

  if (layout === 'page') {
    return (
      <>
        {list.map((sec) => {
          const node = special[sec.type] ? special[sec.type](sec) : null;
          if (special[sec.type] && !node) return null;
          // Automático (sem dois fundos iguais seguidos de verde):
          //  - números e depoimento: degradê verde (destaque)
          //  - galeria, pessoas e logos: faixa branca (sem cards brancos)
          //  - textos e cards: fundo da página (cards brancos com sombra)
          const auto = (sec.type === 'stats' || sec.type === 'quote') ? 'glow'
            : (['gallery', 'people', 'logos', 'video'].includes(sec.type) ? 'white' : 'plain');
          const key = sec.bg && sec.bg !== 'auto' ? sec.bg : auto;
          const band = BAND[key] || BAND.plain;
          const Block = BLOCKS[sec.type];
          return (
            <section key={sec.id} id={sectionAnchor(sec)} className={`relative scroll-mt-28 py-16 md:py-24 ${band.cls}`}>
              <div className="relative max-w-6xl mx-auto px-6">
                {node || <Block sec={sec} dark={band.dark} />}
              </div>
            </section>
          );
        })}
      </>
    );
  }

  return (
    <div className="space-y-14">
      {list.map((sec) => {
        if (special[sec.type]) return <React.Fragment key={sec.id}>{special[sec.type](sec)}</React.Fragment>;
        const Block = BLOCKS[sec.type];
        return <div key={sec.id} id={sectionAnchor(sec)} className="scroll-mt-28"><Block sec={sec} dark={false} /></div>;
      })}
    </div>
  );
}
