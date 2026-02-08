import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

export default function Services({ sectionRef, trackRef }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTOIndex = (index) => {
      if (trackRef.current) {
          const children = trackRef.current.children;
          if (children[index]) {
              const scrollLeft = children[index].offsetLeft - 24; 
              trackRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
              setActiveIndex(index);
          }
      }
  };

  const handleScroll = () => {
      if (trackRef.current) {
          const scrollPosition = trackRef.current.scrollLeft;
          const cardWidth = trackRef.current.children[0]?.offsetWidth || 300;
          const indexyb = Math.round(scrollPosition / cardWidth);
          setActiveIndex(indexyb);
      }
  };

  useEffect(() => {
      const ref = trackRef.current;
      if (ref) {
          ref.addEventListener('scroll', handleScroll);
          return () => ref.removeEventListener('scroll', handleScroll);
      }
  }, [trackRef]);

  // AQUI: Links atualizados para apontar para a nova página e seção específica
  const categories = [
    { 
      id: "01", 
      tag: "Silvicultura", 
      title: "Silvicultura", 
      desc: "Implantação, manejo e regeneração de florestas. Foco em melhoramento genético e alta produtividade sustentável.", 
      link: "/areas-atuacao#silvicultura", // Link atualizado
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2670&auto=format&fit=crop" 
    },
    { 
      id: "02", 
      tag: "Manejo", 
      title: "Manejo de Recursos Florestais", 
      desc: "Planejamento estratégico da produção florestal, colheita e transporte, garantindo o uso racional dos recursos.", 
      link: "/areas-atuacao#manejo", // Link atualizado
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop" 
    },
    { 
      id: "03", 
      tag: "Ambiência", 
      title: "Ambiência", 
      desc: "Harmonização entre produção e meio ambiente, conservação da biodiversidade e gestão de recursos hídricos.", 
      link: "/areas-atuacao#ambiencia", // Link atualizado
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop" 
    },
    { 
      id: "04", 
      tag: "Proteção", 
      title: "Proteção Florestal", 
      desc: "Monitoramento e controle integrado de pragas, doenças e incêndios para assegurar a sanidade da floresta.", 
      link: "/areas-atuacao#protecao", // Link atualizado
      image: "https://images.unsplash.com/photo-1516214104703-d870798883c5?q=80&w=2670&auto=format&fit=crop" 
    },
    { 
      id: "05", 
      tag: "Tecnologia", 
      title: "Tecnologia de Produtos Florestais", 
      desc: "Inovação e qualidade no processamento da madeira, celulose e novos materiais de base biológica.", 
      link: "/areas-atuacao#tecnologia", // Link atualizado
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670&auto=format&fit=crop" 
    }
  ];

  return (
    <section ref={sectionRef} className="relative w-full py-16 md:py-20 overflow-hidden bg-[#f8f9fa]">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-8">
            <div className="max-w-xl">
                 <SectionHeader tag="Áreas de Atuação" title="Nossos Serviços" />
            </div>
        </div>

        <div className="w-full h-8 md:h-10"></div>
        
        <div ref={trackRef} className="flex gap-4 md:gap-8 pb-4 relative z-10 pl-6 md:pl-12 lg:pl-[max(48px,calc((100vw-1280px)/2+48px))] pr-6 md:pr-24 w-full md:w-max overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar">
            {categories.map((item) => (
                <div key={item.id} className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[550px] h-[450px] md:h-[400px] shrink-0 snap-center relative flex items-center group">
                    <div className="w-full md:w-[75%] h-[85%] md:h-full absolute md:right-0 top-0 rounded-[32px] overflow-hidden shadow-lg">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.title} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:static w-[92%] md:w-[50%] h-[220px] md:h-[280px] bg-white p-6 md:p-8 rounded-[24px] shadow-2xl z-10 md:ml-8 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] md:text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-2 md:mb-4 block">{item.id} / {item.tag}</span>
                            <h3 className="text-3xl md:text-3xl font-bold section-heading uppercase leading-none mb-3 md:mb-4">{item.title}</h3>
                            <p className="text-xs md:text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-4 md:line-clamp-none">{item.desc}</p>
                        </div>
                        {/* Como é um link interno agora, o ideal seria usar o componente Link do react-router, mas o <a> funciona se a rota estiver configurada */}
                        <a href={item.link} className="w-12 h-12 rounded-full flex items-center justify-center self-end border border-white/5 shadow-xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 bg-[#1f2937] text-[#FFC107] group-hover:bg-[#2E7D32] group-hover:text-white">
                            <ArrowUpRight size={20} />
                        </a>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex md:hidden justify-center items-center gap-3 mt-8 pb-4">
            {categories.map((_, index) => (
                <button key={index} onClick={() => scrollTOIndex(index)} className={`rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 h-2 bg-[#2E7D32]' : 'w-2 h-2 bg-gray-300 hover:bg-[#2E7D32]/50'}`} aria-label={`Ir para slide ${index + 1}`}/>
            ))}
        </div>
    </section>
  );
}