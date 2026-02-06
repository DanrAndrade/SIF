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

  const categories = [
    { id: "01", tag: "Alimentos", title: "Alimentos", desc: "Os itens essenciais que giram sua loja. O mix completo de grãos, massas e enlatados.", link: "https://loja.chocosul.com.br/alimentos", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" },
    { id: "02", tag: "Bebidas", title: "Bebidas", desc: "Refrescância e alto giro. Sucos, refrigerantes e energéticos indispensáveis.", link: "https://loja.chocosul.com.br/bebidas", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2574&auto=format&fit=crop" },
    { id: "03", tag: "Bomboniere", title: "Bomboniere", desc: "O doce sabor do lucro. Chocolates e balas para compra por impulso.", link: "https://loja.chocosul.com.br/bomboniere", image: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=2672&auto=format&fit=crop" },
    { id: "04", tag: "Limpeza", title: "Limpeza", desc: "Eficiência e confiança. Produtos de alta performance para a casa.", link: "https://loja.chocosul.com.br/limpeza", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=2670&auto=format&fit=crop" },
    { id: "05", tag: "Perfumaria", title: "Perfumaria", desc: "Beleza e cuidado diário. Shampoos e sabonetes para toda família.", link: "https://loja.chocosul.com.br/perfumaria", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop" },
    { id: "06", tag: "Pet", title: "Pet", desc: "Cuidado para o melhor amigo. Alimentos e petiscos nutritivos.", link: "https://loja.chocosul.com.br/pet", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2686&auto=format&fit=crop" }
  ];

  return (
    <section ref={sectionRef} className="relative w-full py-16 md:py-20 overflow-hidden bg-[#f8f9fa]">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-8">
            <div className="max-w-xl">
                 <SectionHeader tag="Áreas de Atuação" title="Nossos Produtos" />
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
                            <span className="text-[10px] md:text-xs font-bold text-[#D91A3C] uppercase tracking-widest mb-2 md:mb-4 block">{item.id} / {item.tag}</span>
                            <h3 className="text-3xl md:text-3xl font-bold section-heading uppercase leading-none mb-3 md:mb-4">{item.title}</h3>
                            <p className="text-xs md:text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-4 md:line-clamp-none">{item.desc}</p>
                        </div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center self-end border border-white/5 shadow-xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 bg-[#1f2937] text-[#FFC107] group-hover:bg-[#D91A3C] group-hover:text-white">
                            <ArrowUpRight size={20} />
                        </a>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex md:hidden justify-center items-center gap-3 mt-8 pb-4">
            {categories.map((_, index) => (
                <button key={index} onClick={() => scrollTOIndex(index)} className={`rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 h-2 bg-[#D91A3C]' : 'w-2 h-2 bg-gray-300 hover:bg-[#D91A3C]/50'}`} aria-label={`Ir para slide ${index + 1}`}/>
            ))}
        </div>
    </section>
  );
}