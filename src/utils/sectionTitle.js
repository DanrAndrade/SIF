// Estilo do título de cada bloco/seção (definido no painel).
// Padrão do site (2ª etapa): SEM caixa-alta e SEM negrito (peso médio).
// Caixa-alta e negrito só quando escolhidos no painel para aquele bloco.

export const TITLE_SIZES = {
  xl: { label: 'Extra grande', site: 'text-3xl md:text-[2.6rem] leading-tight', admin: 'text-xl' },
  lg: { label: 'Grande',       site: 'text-2xl md:text-3xl leading-snug',      admin: 'text-lg' },
  md: { label: 'Médio',        site: 'text-xl md:text-2xl',                    admin: 'text-base' },
  sm: { label: 'Pequeno',      site: 'text-lg md:text-xl',                     admin: 'text-sm' },
};

export const TITLE_WEIGHTS = {
  normal: { label: 'Normal',        cls: 'font-normal' },
  medium: { label: 'Médio',         cls: 'font-medium' },
  bold:   { label: 'Negrito',       cls: 'font-bold' },
  black:  { label: 'Extra-negrito', cls: 'font-black' },
};

export function resolveTitleStyle(sec, defaultSize, defaultAlign) {
  const size = TITLE_SIZES[sec.title_size] ? sec.title_size : defaultSize;
  const weight = TITLE_WEIGHTS[sec.title_weight] ? sec.title_weight : 'medium';
  return {
    size,
    weight,
    upper: sec.title_upper === true,
    align: sec.title_align || defaultAlign,
  };
}
