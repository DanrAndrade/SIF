// Estilo do título das seções adicionais da EINCOL (definido no painel).
// Sem escolha salva, cada tipo mantém o visual padrão:
//   seção de texto → grande, extra-negrito, à esquerda
//   carrossel de logos → médio, negrito, centralizado

export const TITLE_SIZES = {
  lg: { label: 'Grande',  site: 'text-2xl md:text-3xl', admin: 'text-lg' },
  md: { label: 'Médio',   site: 'text-xl md:text-2xl',  admin: 'text-base' },
  sm: { label: 'Pequeno', site: 'text-lg md:text-xl',   admin: 'text-sm' },
};

export const TITLE_WEIGHTS = {
  normal: { label: 'Normal',        cls: 'font-normal' },
  medium: { label: 'Médio',         cls: 'font-medium' },
  bold:   { label: 'Negrito',       cls: 'font-bold' },
  black:  { label: 'Extra-negrito', cls: 'font-black' },
};

export function resolveTitleStyle(sec, defaultSize, defaultAlign) {
  const size = TITLE_SIZES[sec.title_size] ? sec.title_size : defaultSize;
  const weight = TITLE_WEIGHTS[sec.title_weight]
    ? sec.title_weight
    : sec.title_bold === false ? 'normal' : (size === 'lg' ? 'black' : 'bold');
  return {
    size,
    weight,
    upper: sec.title_upper !== false,
    align: sec.title_align || defaultAlign,
  };
}
