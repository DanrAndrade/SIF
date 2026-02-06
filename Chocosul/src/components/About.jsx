import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
// useNavigate removido, usando link comum

export default function About() {
  return (
      <div className="wrapper mt-12">
        <section className="w-full py-20 px-6 md:px-16 lg:px-24 mt-4 relative">
            <div className="inline-flex items-center px-3 py-1 border border-[#FFC107] rounded-full mb-16 bg-[#FFC107]/10">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b45309]">Quem Somos</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-4 flex flex-col justify-center relative z-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.9] mb-8 section-heading text-text-main">Líderes em<br/><span className="text-[#D91A3C]">Distribuição</span></h2>
                    
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm mb-12">
                         Fundada para transformar a logística no sul baiano, a Chocosul construiu uma trajetória sólida de confiança e inovação. Mais do que uma distribuidora, somos parceiros estratégicos para o crescimento do seu negócio.
                    </p>
                </div>
                <div className="lg:col-span-4 flex justify-center py-10 lg:py-0 relative z-10">
                    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-gray-200 group shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=2070" alt="Armazém" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-gray-100">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-text-main">CD Eunápolis - BA</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-12">
                    <div className="bg-white p-8 rounded-2xl border-l-4 border-[#D91A3C] shadow-lg">
                        <h4 className="font-bold text-sm mb-4 uppercase text-text-main tracking-widest">Nossa Metodologia</h4>
                        <ul className="text-xs text-gray-500 space-y-3 font-medium">
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#D91A3C]" /> Recebimento Conferido</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#D91A3C]" /> Armazenagem WMS</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#D91A3C]" /> Frota Roteirizada</li>
                        </ul>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        {/* BOTÃO ATUALIZADO:
                           - Removido: hover:bg-[#b01530] (Mudança de cor)
                           - Adicionado: hover:scale-105 (Aumento de tamanho)
                           - Adicionado: duration-300 (Suavidade)
                        */}
                        <a 
                            href="/historia"
                            className="w-full px-8 py-4 bg-[#D91A3C] text-white font-bold rounded-xl uppercase tracking-wider text-[12px] shadow-lg 
                            transition-all duration-300 hover:scale-105
                            flex items-center justify-center gap-3 group text-center"
                        >
                            Descubra nossa História <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}