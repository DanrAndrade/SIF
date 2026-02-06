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
  
  // Lógica para manter as cores originais (Amarelo ou Vermelho dependendo do contexto, aqui padronizei no ouro/laranja usado na maioria)
  const tagStyles = lightMode 
    ? 'border-[#FFC107]/40 text-[#FFC107] bg-[#FFC107]/10' 
    : 'border-[#D91A3C]/30 text-[#D91A3C] bg-[#D91A3C]/5';

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