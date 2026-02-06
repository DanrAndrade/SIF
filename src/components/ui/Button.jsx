import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', // primary, outline, ghost
  className = '', 
  icon: Icon,
  href,
  isLoading = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-full uppercase tracking-wider text-[12px] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-[#D91A3C] to-[#900f24] text-white shadow-2xl hover:shadow-red-500/30 hover:scale-105",
    outline: "bg-transparent border border-gray-200 text-gray-500 hover:border-[#D91A3C] hover:text-[#D91A3C]",
    glass: "bg-white/5 backdrop-blur-md border border-white shadow-lg hover:bg-white/20 text-white",
    solidWhite: "bg-white text-[#D91A3C] shadow-lg hover:scale-105"
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component 
      href={href}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
      {Icon && !isLoading && <Icon size={18} className="transition-transform group-hover:translate-x-1" />}
    </Component>
  );
}