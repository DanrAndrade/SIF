import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import { getImageUrl } from '../apiConfig';

const DEFAULT_CARDS = [
  { id: "01", tag: "Comercial", title: "Comercial", desc: "Nossa área comercial atua estrategicamente na venda de sementes de alta qualidade, tecnologia Ellepot e captação de patrocínios para eventos florestais.", link: "/comercial", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2674&auto=format&fit=crop" },
  { id: "02", tag: "Germinar", title: "Programa Germinar", desc: "Uma iniciativa focada no desenvolvimento e atração de talentos. Descubra como funciona o programa e acesse nosso banco de vagas exclusivas.", link: "/trabalhe-conosco", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" },
  { id: "03", tag: "Informativo", title: "Boletim Técnico", desc: "Conteúdos aprofundados e atualizações das principais inovações do setor florestal. Acesse nossas edições técnicas focadas em ciência e aplicação de campo.", link: "/blog", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2670&auto=format&fit=crop" },
  { id: "04", tag: "Pesquisa", title: "Serviços de P&D", desc: "Realizamos projetos especializados de Pesquisa e Desenvolvimento, conectando as demandas reais da indústria florestal com a excelência acadêmica.", link: "/projetos", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop" }
];

export default function Services({ sectionRef, trackRef, config = {} }) {
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

  const rawCards = Array.isArray(config.cards) && config.cards.length > 0 ? config.cards : DEFAULT_CARDS;
  const categories = rawCards.map((c, i) => ({
    id: c.id || String(i + 1).padStart(2, '0'),
    tag: c.tag || '',
    title: c.title || '',
    desc: c.desc || '',
    link: c.link || '#',
    image: c.image ? (c.image.startsWith('http') ? c.image : getImageUrl(c.image)) : (DEFAULT_CARDS[i % DEFAULT_CARDS.length]?.image || ''),
  }));
  const sectionTag = config.section_tag || 'Áreas de Atuação';
  const sectionTitle = config.section_title || 'Nossos Serviços';

  return (
    <section ref={sectionRef} className="relative w-full py-16 md:py-0 md:h-screen md:flex md:flex-col md:justify-center overflow-hidden bg-[#f8f9fa] z-20">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-8">
            <div className="max-w-xl">
                 <SectionHeader tag={sectionTag} title={sectionTitle} />
            </div>
        </div>

        <div className="w-full h-8 md:h-10"></div>
        
        <div ref={trackRef} className="flex gap-4 md:gap-8 pb-4 relative z-10 pl-6 md:pl-12 lg:pl-[max(48px,calc((100vw-1280px)/2+48px))] pr-6 md:pr-24 w-full md:w-max overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar">
            {categories.map((item) => (
                <div key={item.id} className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[550px] h-[450px] md:h-[400px] shrink-0 snap-center relative flex items-center group">
                    <div className="w-full md:w-[75%] h-[85%] md:h-full absolute md:right-0 top-0 rounded-[32px] overflow-hidden shadow-lg">
                        <img src={item.image} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.title} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:static w-[92%] md:w-[50%] h-[220px] md:h-[280px] bg-white p-6 md:p-8 rounded-[24px] shadow-2xl z-10 md:ml-8 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] md:text-xs font-bold text-[#007a3d] uppercase tracking-widest mb-2 md:mb-4 block">{item.id} / {item.tag}</span>
                            <h3 className="text-3xl md:text-3xl font-bold section-heading uppercase leading-none mb-3 md:mb-4">{item.title}</h3>
                            <p className="text-xs md:text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-4 md:line-clamp-none">{item.desc}</p>
                        </div>
                        {item.link && item.link.startsWith('http') ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center self-end border border-white/5 shadow-xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 bg-[#1f2937] text-[#FFC107] group-hover:bg-[#007a3d] group-hover:text-white">
                                <ArrowUpRight size={20} />
                            </a>
                        ) : (
                            <Link to={item.link || '#'} className="w-12 h-12 rounded-full flex items-center justify-center self-end border border-white/5 shadow-xl cursor-pointer transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 bg-[#1f2937] text-[#FFC107] group-hover:bg-[#007a3d] group-hover:text-white">
                                <ArrowUpRight size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex md:hidden justify-center items-center gap-3 mt-8 pb-4">
            {categories.map((_, index) => (
                <button key={index} onClick={() => scrollTOIndex(index)} className={`rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 h-2 bg-[#007a3d]' : 'w-2 h-2 bg-gray-300 hover:bg-[#007a3d]/50'}`} aria-label={`Ir para slide ${index + 1}`}/>
            ))}
        </div>
    </section>
  );
}
