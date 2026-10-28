import React from 'react';
import { visibleSections, isSectionEmpty } from './sections/sectionTypes';
import { BLOCKS } from './sections/SectionBlocks';
import PhotoBand from './ui/PhotoBand';

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
  photo:  { cls: '', dark: true, photo: true },
};

export function renderableSections(sections, special = {}) {
  return visibleSections(sections).filter(s =>
    special[s.type] ? true : (BLOCKS[s.type] && !isSectionEmpty(s)));
}

// bgPhoto: foto usada nas faixas "foto desfocada" (ex.: capa do GT)
export default function ContentSectionsRenderer({ sections, layout = 'stack', special = {}, bgPhoto = '' }) {
  const list = renderableSections(sections, special);
  if (!list.length) return null;

  if (layout === 'page') {
    // Cada faixa de foto começa por uma foto diferente da lista
    const photos = (Array.isArray(bgPhoto) ? bgPhoto : [bgPhoto]).filter(Boolean);
    let photoN = 0;
    return (
      <>
        {list.map((sec) => {
          const node = special[sec.type] ? special[sec.type](sec) : null;
          if (special[sec.type] && !node) return null;
          // Automático:
          //  - números e depoimento: faixa escura com foto desfocada (destaque)
          //  - o resto (textos, cards, fotos, pessoas, vídeo, logos): fundo da página
          const auto = (sec.type === 'stats' || sec.type === 'quote') ? 'photo' : 'plain';
          // chamada (CTA) já é um card escuro: fica sempre no fundo da página
          const key = sec.type === 'cta' ? 'plain' : (sec.bg && sec.bg !== 'auto' ? sec.bg : auto);
          const band = BAND[key] || BAND.plain;
          const Block = BLOCKS[sec.type];
          const inner = (
            <div className="relative max-w-6xl mx-auto px-6">
              {node || <Block sec={sec} dark={band.dark} />}
            </div>
          );
          if (band.photo) {
            return (
              <PhotoBand key={sec.id} id={sectionAnchor(sec)} photo={photos.length ? [...photos.slice(photoN % photos.length), ...photos.slice(0, photoN++ % photos.length)] : ''} className="scroll-mt-28 py-12 md:py-28">
                {inner}
              </PhotoBand>
            );
          }
          return (
            <section key={sec.id} id={sectionAnchor(sec)} className={`relative scroll-mt-28 py-16 md:py-24 ${band.cls}`}>
              {inner}
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
