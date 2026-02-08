import React, { useState, useRef } from 'react';
import { Newspaper, BookOpen, TreePine, ScrollText, Plus, CheckCircle2 } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import NoiseOverlay from './ui/NoiseOverlay';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const steps = [
    { 
        id: "01", 
        title: "Jornal SIF", 
        icon: Newspaper,
        img: "https://images.unsplash.com/photo-1624269305548-1527ef905ff6", 
        shortDesc: "Informativo oficial de notícias.",
        fullDesc: "O principal canal de comunicação do SIF, trazendo novidades sobre projetos e parcerias.",
        benefits: ["Notícias", "Projetos", "Eventos"],
        color: "bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]",
        textColor: "text-[#4ADE80]",
        link: "#" 
    },
    { 
        id: "02", 
        title: "Boletim Técnico", 
        icon: BookOpen,
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015", 
        shortDesc: "Resultados e tecnologias.",
        fullDesc: "Publicações voltadas para a transferência de tecnologia e resultados práticos das pesquisas.",
        benefits: ["Tecnologia", "Pesquisa", "Resultados"],
        color: "bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]",
        textColor: "text-[#4ADE80]",
        link: "#"
    },
    { 
        id: "03", 
        title: "Revista Árvore", 
        icon: TreePine,
        img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=2070", 
        shortDesc: "Referência científica mundial.",
        fullDesc: "Uma das revistas mais respeitadas na Ciência Florestal, com alto impacto global.",
        benefits: ["Impacto", "Ciência", "Global"],
        color: "bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]",
        textColor: "text-[#4ADE80]",
        link: "#"
    },
    { 
        id: "04", 
        title: "Código de Conduta", 
        icon: ScrollText,
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071", 
        shortDesc: "Ética e integridade SIF.",
        fullDesc: "Nossas diretrizes de conformidade e ética, garantindo os mais altos padrões institucionais.",
        benefits: ["Ética", "Compliance", "Transparência"],
        color: "bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]",
        textColor: "text-[#4ADE80]",
        link: "#"
    }
  ];

  const handleMobileScroll = () => {
      if (scrollContainerRef.current) {
          const scrollLeft = scrollContainerRef.current.scrollLeft;
          const cardWidth = scrollContainerRef.current.offsetWidth;
          const index = Math.round(scrollLeft / cardWidth);
          setMobileActiveIndex(index);
      }
  };

  return (
      <div className="wrapper mb-4">
        <section className="relative w-full rounded-[32px] overflow-hidden bg-[#1f2937] py-12 lg:py-16 shadow-2xl">
            
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2E7D32] rounded-full blur-[120px] opacity-25 pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#4ADE80] rounded-full blur-[100px] opacity-15 pointer-events-none -translate-x-1/4 translate-y-1/4"></div>
            
            <NoiseOverlay opacity={0.2} />

            <div className="container relative z-10 flex flex-col items-center">
                <div className="max-w-2xl px-6 w-full text-center mb-10">
                    <span className="inline-block text-[#4ADE80] font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Comunicação e Ética</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Inovação e Transparência</h2>
                    <p className="text-gray-400 text-sm md:text-base font-light">Explore nossas publicações oficiais e diretrizes.</p>
                </div>

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden lg:flex w-full h-[440px] gap-4 items-stretch px-4">
                    {steps.map((step, index) => {
                        const isActive = activeStep === index;
                        return (
                        <a 
                            key={index}
                            href={step.link}
                            onMouseEnter={() => setActiveStep(index)}
                            className={`
                                relative h-full rounded-[32px] overflow-hidden cursor-pointer 
                                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-[2px]
                                bg-gradient-to-b from-[#1B5E20] to-[#2E7D32]
                                ${isActive ? 'flex-[3.5]' : 'flex-[1] opacity-60'}
                            `}
                        >
                            <div className="relative w-full h-full bg-[#0a0f16] rounded-[30px] overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <img src={step.img} alt={step.title} className="w-full h-full object-cover brightness-[0.45]" />
                                    <NoiseOverlay opacity={0.3} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-3xl font-black transition-all duration-500 ${isActive ? 'text-[#4ADE80]' : 'text-white/10'}`}>{step.id}</span>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10 ${step.color} ${isActive ? 'scale-110' : 'scale-90 opacity-60'}`}>
                                            <step.icon size={22} />
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex flex-col justify-end min-h-[140px]">
                                        {/* Título Vertical Ajustado */}
                                        <div className={`absolute bottom-4 left-2 origin-bottom-left -rotate-90 w-max transition-all duration-500 ${isActive ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
                                            <h3 className="text-lg font-bold uppercase text-white tracking-[0.2em] whitespace-nowrap">{step.title}</h3>
                                        </div>
                                        
                                        {/* Conteúdo Expandido com altura flexível para não cortar */}
                                        <div className={`transition-all duration-500 flex flex-col justify-end ${isActive ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute inset-x-0'}`}>
                                            <h3 className="text-xl md:text-2xl font-bold uppercase text-white mb-2 leading-tight">{step.title}</h3>
                                            <p className={`text-xs font-bold ${step.textColor} mb-2 leading-tight uppercase`}>{step.shortDesc}</p>
                                            <p className="text-[11px] md:text-xs text-gray-300 leading-relaxed mb-4 font-light">{step.fullDesc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                                                        <CheckCircle2 size={10} className="text-[#4ADE80]" />{benefit}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`absolute bottom-6 right-6 transition-all duration-500 ${isActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                                        <div className="bg-white/10 p-2 rounded-full border border-white/20 text-[#4ADE80] shadow-xl"><Plus size={18} /></div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    )})}
                </div>

                {/* --- MOBILE VIEW --- */}
                <div className="w-full lg:hidden relative">
                    <div ref={scrollContainerRef} onScroll={handleMobileScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-6 pb-8 pt-2">
                        {steps.map((step, index) => (
                            <a key={index} href={step.link} className="min-w-[85vw] snap-center p-[2px] bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] rounded-[32px]">
                                <div className="relative rounded-[30px] overflow-hidden flex flex-col h-[400px]">
                                    <div className="absolute inset-0 z-0">
                                        <img src={step.img} alt={step.title} className="w-full h-full object-cover brightness-[0.4]" />
                                        <NoiseOverlay opacity={0.3} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-3xl font-black text-[#4ADE80]">{step.id}</span>
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${step.color}`}><step.icon size={22} /></div>
                                            </div>
                                            <h3 className="text-xl font-bold uppercase text-white mb-1">{step.title}</h3>
                                            <p className={`text-xs font-bold ${step.textColor} mb-3`}>{step.shortDesc}</p>
                                            <p className="text-xs text-gray-200 font-light leading-relaxed mb-6">{step.fullDesc}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {step.benefits.map((benefit, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-white uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                                    <CheckCircle2 size={12} className="text-[#4ADE80]" />{benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2">
                        {steps.map((_, index) => (
                            <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${mobileActiveIndex === index ? 'w-8 bg-[#4ADE80]' : 'w-2 bg-white/20'}`}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}