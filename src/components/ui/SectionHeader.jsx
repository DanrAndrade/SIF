import React from 'react';

export default function SectionHeader({ 
  tag, 
  title, 
  subtitle, 
  align = 'left', 
  lightMode = false 
}) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const textColor = lightMode ? 'text-white' : 'text-[#1f2937]';
  
  // Lógica para manter as cores originais (adaptadas para Verde SIF)
  // Amarelo (#FFC107) virou Verde Claro (#7FBA00)
  // Vermelho (#D91A3C) virou Verde SIF (#007a3d)
  const tagStyles = lightMode 
    ? 'border-[#7FBA00]/40 text-[#7FBA00] bg-[#7FBA00]/10' 
    : 'border-[#007a3d]/30 text-[#007a3d] bg-[#007a3d]/5';

  return (
    <div className={`flex flex-col mb-12 ${alignClass}`}>
      {tag && (
        <div className={`inline-flex items-center px-3 py-1 border rounded-full mb-6 ${tagStyles}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {tag}
            </span>
        </div>
      )}
      
      <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-none tracking-tight section-heading mb-6 ${textColor}`}>
        {/* Renderiza HTML dentro do título se necessário (para as quebras de linha <br/>) */}
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </h2>
      
      {subtitle && (
        <p className={`text-sm md:text-base font-bold leading-relaxed max-w-2xl ${lightMode ? 'text-gray-300' : 'text-[#1f2937]/90'}`}>
            {subtitle}
        </p>
      )}
    </div>
  );
}
