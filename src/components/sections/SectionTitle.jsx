import React from 'react';
import { TITLE_SIZES, TITLE_WEIGHTS, resolveTitleStyle } from '../../utils/sectionTitle';

// Título de uma seção com o estilo escolhido no painel (tamanho, peso,
// maiúsculas, alinhamento). Sem escolha salva, usa o padrão informado.
export default function SectionTitle({ sec, defaultSize = 'lg', defaultAlign = 'left', className = '', as: Tag = 'h2' }) {
  if (!sec?.title) return null;
  const st = resolveTitleStyle(sec, defaultSize, defaultAlign);
  const cls = [
    TITLE_SIZES[st.size].site,
    TITLE_WEIGHTS[st.weight].cls,
    st.upper ? 'uppercase tracking-tighter' : 'tracking-tight',
    st.align === 'center' ? 'text-center' : 'text-left',
    'text-[#1f2937]',
    className,
  ].join(' ');
  return <Tag className={cls}>{sec.title}</Tag>;
}
