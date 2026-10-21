import React from 'react';
import SmartLink from './SmartLink';

// Tamanhos e estilos padrão dos botões do site (um lugar só).
const SIZES = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-8 py-3.5 text-[12px]',
  lg: 'px-10 py-4 text-[13px]',
};

const VARIANTS = {
  primary: 'bg-gradient-to-br from-[#1B5E20] from-30% to-[#7FBA00] text-white shadow-[0_10px_20px_-10px_rgba(27,94,32,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(146,183,53,0.6)] hover:scale-105 hover:from-[#2a5530] hover:to-[#a3c940]',
  accent: 'bg-[#7FBA00] text-[#1f2937] shadow-xl hover:bg-[#a3c940] hover:scale-105',
  outline: 'bg-transparent border-2 border-[#007a3d]/30 text-[#007a3d] hover:border-[#007a3d] hover:bg-[#007a3d] hover:text-white',
  glass: 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 shadow-lg',
  solidWhite: 'bg-white text-[#1f2937] shadow-lg hover:bg-gray-50 hover:scale-105',
  // Sobre fundo verde escuro: branco que fica verde-folha no hover
  light: 'bg-white text-sif-dark hover:bg-sif-leaf hover:text-white',
  // Contorno claro sobre fundo escuro
  ghostLight: 'border border-white/30 text-white hover:bg-white/10',
};

const BASE = 'inline-flex items-center justify-center gap-2 font-bold rounded-full uppercase tracking-wider transition-all duration-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden';

// Mesmo visual do <Button> para usar num link/elemento próprio (ex.: card inteiro clicável)
export const buttonClass = (variant = 'primary', size = 'md') =>
  `${BASE} ${SIZES[size] || SIZES.md} ${VARIANTS[variant] || VARIANTS.primary}`;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  href,
  isLoading = false,
  ...props
}) {
  // Com href: SmartLink (rota interna respeita a subpasta do site; antes
  // '/contato' virava sif.org.br/contato e caía no site antigo).
  const Component = href ? SmartLink : 'button';
  const linkProps = href ? { href, newTabExternal: false } : {};

  return (
    <Component
      {...linkProps}
      className={`${buttonClass(variant, size)} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? 'Carregando...' : children}
        {Icon && !isLoading && <Icon size={size === 'sm' ? 14 : 18} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
    </Component>
  );
}
