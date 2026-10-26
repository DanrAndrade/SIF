import React from 'react';
import { Loader2 } from 'lucide-react';
import SmartLink from '../../ui/SmartLink';

// Botão padrão do painel com a mesma API do botão do site (variant, size, icon,
// isLoading, href), mas no visual do painel: retângulo arredondado, texto normal,
// ícone pequeno à esquerda e sem a seta em círculo do site.
//   primary → verde (ação principal)   outline → branco com borda (secundária)
//   danger  → vermelho (excluir)
const SIZES = {
  sm: 'px-3.5 py-2 text-[13px] gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};
const VARIANTS = {
  primary: 'bg-[#007a3d] text-white shadow-sm hover:bg-[#1B5E20]',
  outline: 'bg-white border border-gray-200 text-gray-700 hover:border-[#007a3d] hover:text-[#007a3d]',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
};
const ALIAS = { light: 'outline', ghostLight: 'outline', accent: 'outline', solidWhite: 'outline', glass: 'outline' };

export default function AdminButton({ children, variant = 'primary', size = 'md', className = '', icon: Icon, href, isLoading = false, ...props }) {
  const Component = href ? SmartLink : 'button';
  const linkProps = href ? { href, newTabExternal: false } : { type: props.type || 'button' };
  const v = VARIANTS[ALIAS[variant] || variant] || VARIANTS.primary;
  const iconSize = size === 'sm' ? 14 : 16;
  return (
    <Component {...linkProps} {...props}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${SIZES[size] || SIZES.md} ${v} ${className}`}>
      {isLoading ? <Loader2 size={iconSize} className="animate-spin" /> : Icon ? <Icon size={iconSize} /> : null}
      {children}
    </Component>
  );
}
