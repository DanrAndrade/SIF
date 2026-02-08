import React from 'react';
// import { ArrowRight } from 'lucide-react'; 

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon: Icon,
  href,
  isLoading = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-full uppercase tracking-wider text-[12px] transition-all duration-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden";
  
  const variants = {
    // --- GRADIENTE COM VERDE ESCURO PREDOMINANTE ---
    // Adicionei 'from-30%'. Isso segura o Verde Escuro (#1B5E20) por mais tempo
    // antes de suavizar para o Verde Folha (#92b735).
    primary: "bg-gradient-to-br from-[#1B5E20] from-30% to-[#92b735] text-white shadow-[0_10px_20px_-10px_rgba(27,94,32,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(146,183,53,0.6)] hover:scale-105 hover:from-[#2a5530] hover:to-[#a3c940]",
    
    // Accent (Mantido)
    accent: "bg-[#92b735] text-[#1f2937] shadow-xl hover:bg-[#a3c940] hover:scale-105",

    // Outline (Mantido)
    outline: "bg-transparent border-2 border-[#3c7a43]/30 text-[#3c7a43] hover:border-[#3c7a43] hover:bg-[#3c7a43] hover:text-white",
    
    // Glass (Mantido)
    glass: "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 shadow-lg",
    
    // SolidWhite (Mantido)
    solidWhite: "bg-white text-[#1f2937] shadow-lg hover:bg-gray-50 hover:scale-105"
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component 
      href={href}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? "Carregando..." : children}
        {Icon && !isLoading && <Icon size={18} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
    </Component>
  );
}