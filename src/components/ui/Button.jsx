import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import SmartLink from './SmartLink';

// PADRÃO ÚNICO DE BOTÃO DO SITE (mesmo do "Enviar mensagem" do Contato):
// pílula com texto em caixa alta e a seta dentro de um círculo à direita.
// No hover a cor muda, o círculo fica branco e a seta gira levemente.
// (Painel admin e tela de login têm componentes próprios.)
//
// Variantes (todas com o mesmo formato):
//   primary  → verde-escuro, hover verde SIF   (padrão, sobre fundo claro)
//   light    → branco, hover verde-folha        (sobre fundo escuro / foto)
//   outline  → contorno verde, hover preenchido  (ação secundária no claro)
//   ghostLight → contorno branco, hover vidro   (ação secundária no escuro)
// Aliases antigos: accent/solidWhite → light; glass → ghostLight.
const SIZES = {
  sm: { box: 'pl-5 pr-1.5 py-1.5 text-[11px] gap-2.5 tracking-[0.14em]', circle: 'w-8 h-8', icon: 15 },
  // md e lg ficam um pouco mais compactos no celular (cabem numa linha só)
  md: { box: 'pl-5 sm:pl-7 pr-1.5 sm:pr-2 py-1.5 sm:py-2 text-[11.5px] sm:text-[12.5px] gap-2.5 sm:gap-3 tracking-[0.1em] sm:tracking-[0.14em]', circle: 'w-9 h-9 sm:w-10 sm:h-10', icon: 17 },
  lg: { box: 'pl-6 sm:pl-8 pr-1.5 sm:pr-2 py-1.5 sm:py-2 text-[12px] sm:text-[13px] gap-3 sm:gap-3.5 tracking-[0.1em] sm:tracking-[0.14em]', circle: 'w-10 h-10 sm:w-11 sm:h-11', icon: 18 },
};

const VARIANTS = {
  primary: { box: 'bg-sif-dark text-white hover:bg-sif-green', circle: 'bg-white/10 group-hover/btn:bg-white group-hover/btn:text-sif-green' },
  light: { box: 'bg-white text-sif-dark hover:bg-sif-leaf hover:text-white', circle: 'bg-sif-dark/[0.07] group-hover/btn:bg-white group-hover/btn:text-sif-green' },
  outline: { box: 'border border-sif-green/35 text-sif-green hover:bg-sif-green hover:text-white hover:border-sif-green', circle: 'bg-sif-green/10 group-hover/btn:bg-white group-hover/btn:text-sif-green' },
  ghostLight: { box: 'border border-white/30 text-white hover:bg-white/10 hover:border-white/60', circle: 'bg-white/10 group-hover/btn:bg-white group-hover/btn:text-sif-dark' },
};
const ALIAS = { accent: 'light', solidWhite: 'light', glass: 'ghostLight' };
const pick = (v) => VARIANTS[ALIAS[v] || v] || VARIANTS.primary;

const BASE = 'group/btn relative inline-flex items-center justify-center max-w-full overflow-hidden rounded-full font-bold uppercase leading-tight text-left transition-colors duration-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed';

// Classes do botão (para usar num link/elemento próprio). Dentro dele,
// coloque o texto e <BtnArrow /> (o círculo com a seta).
export const buttonClass = (variant = 'primary', size = 'md') =>
  `${BASE} ${(SIZES[size] || SIZES.md).box} ${pick(variant).box}`;

// Círculo com a seta (ou outro ícone) no fim do botão
export function BtnArrow({ variant = 'primary', size = 'md', icon: Icon = ArrowRight, loading = false, rotate = true }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full transition-all duration-500 ${s.circle} ${pick(variant).circle}`} aria-hidden="true">
      {loading
        ? <Loader2 size={s.icon} className="animate-spin" />
        : <Icon size={s.icon} className={`transition-transform duration-500 group-hover/btn:translate-x-0.5 ${rotate && Icon === ArrowRight ? 'group-hover/btn:-rotate-45' : ''}`} />}
    </span>
  );
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  href,
  isLoading = false,
  ...props
}) {
  // Com href: SmartLink (rota interna respeita a subpasta do site)
  const Component = href ? SmartLink : 'button';
  const linkProps = href ? { href, newTabExternal: false } : {};

  return (
    <Component {...linkProps} className={`${buttonClass(variant, size)} ${className}`} {...props}>
      <span className="py-2">{isLoading ? 'Carregando...' : children}</span>
      <BtnArrow variant={variant} size={size} icon={icon || ArrowRight} loading={isLoading} />
    </Component>
  );
}
