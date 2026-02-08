import React, { useState, useRef } from 'react';
import { PackageCheck, Warehouse, ScanBarcode, MapPin, Plus, CheckCircle2 } from 'lucide-react';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Padrão de ruído SVG
  const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

  const steps = [
    { 
        id: "01", 
        title: "Recebimento", 
        icon: PackageCheck,
        img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", 
        shortDesc: "Entrada fiscal automatizada e conferência cega.",
        fullDesc: "Validação imediata da NFe na portaria e conferência cega para garantir integridade física e fiscal.",
        benefits: ["Validação Fiscal", "Conferência Cega", "Etiquetagem"],
        color: "bg-blue-600",
        textColor: "text-blue-600"
    },
    { 
        id: "02", 
        title: "Armazenagem", 
        icon: Warehouse,
        img: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop", 
        shortDesc: "Endereçamento inteligente via Mapa de Calor.",
        fullDesc: "Algoritmos de Curva ABC definem o local ideal, otimizando o trajeto e garantindo o FEFO.",
        benefits: ["Curva ABC", "Controle FEFO", "Verticalização"],
        color: "bg-purple-600",
        textColor: "text-purple-600"
    },
    { 
        id: "03", 
        title: "Separação", 
        icon: ScanBarcode,
        img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop", 
        shortDesc: "Picking com coletores de alta precisão.",
        fullDesc: "Separação guiada por sistema (voice/coletor), eliminando papel com 99.9% de acuracidade.",
        benefits: ["Zero Papel", "Acuracidade 99.9%", "Auditoria"],
        color: "bg-orange-600",
        textColor: "text-orange-600"
    },
    { 
        id: "04", 
        title: "Entrega", 
        icon: MapPin,
        img: "https://images.unsplash.com/photo-1605618720893-d201914644e2?q=80&w=2070&auto=format&fit=crop", 
        shortDesc: "Tracking Last-Mile em tempo real.",
        fullDesc: "Monitoramento via satélite da frota com previsão de chegada e comprovante digital.",
        benefits: ["Roteirização", "Tracking Real", "Comprovante"],
        color: "bg-[#D91A3C]",
        textColor: "text-[#D91A3C]"
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
        <section className="relative w-full rounded-[32px] overflow-hidden bg-[#fba819] text-[#1f2937] py-16 lg:py-20">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fba819_0%,_#e09616_100%)] z-0"></div>
            <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay z-0 pointer-events-none"
                style={{ backgroundImage: noisePattern, filter: 'contrast(120%) brightness(100%)' }}
            ></div>

            <div className="container relative z-10 flex flex-col items-center">
                
                <div className="text-center mb-12 max-w-2xl px-6">
                    <div className="inline-flex items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D91A3C]">
                            Logística Integrada
                        </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold uppercase leading-none tracking-tight text-[#1f2937] section-heading mb-4">
                        Processo Operacional
                    </h2>
                    <p className="text-sm md:text-base text-[#1f2937]/90 font-bold leading-relaxed">
                        Passe o mouse sobre os cards e conheça cada etapa.
                    </p>
                </div>

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden lg:flex w-full h-[460px] gap-4 items-stretch px-4">
                    {steps.map((step, index) => {
                        const isActive = activeStep === index;
                        return (
                        <div 
                            key={index}
                            onMouseEnter={() => setActiveStep(index)}
                            className={`
                                relative h-full rounded-3xl bg-white shadow-2xl overflow-hidden cursor-default 
                                transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                                ${isActive ? 'flex-[3]' : 'flex-[1] hover:flex-[1.1]'}
                                border-2 border-white
                            `}
                        >
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                                <div className={`
                                    relative w-full overflow-hidden transition-all duration-700 ease-in-out
                                    ${isActive ? 'h-[50%]' : 'h-full'} 
                                `}>
                                    <img 
                                        src={step.img} 
                                        alt={step.title} 
                                        className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-100 grayscale'}`} 
                                        style={{ 
                                            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between p-6">
                                <div className="flex justify-between items-start">
                                    <span className={`text-4xl font-black font-heading drop-shadow-md transition-colors duration-300 ${isActive ? step.textColor : 'text-white'}`}>
                                        {step.id}
                                    </span>
                                    <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg 
                                        transition-all duration-500 backdrop-blur-md border border-white/20 
                                        ${step.color} 
                                        ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-90 grayscale'}
                                    `}>
                                        <step.icon size={20} />
                                    </div>
                                </div>
                                <div className="relative mt-auto">
                                    <div className={`
                                        absolute bottom-10 left-8 origin-bottom-left -rotate-90 w-max 
                                        transition-all duration-500 ease-in-out 
                                        ${isActive ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 delay-200'}
                                    `}>
                                        <h3 className="text-xl font-bold uppercase text-[#1f2937] tracking-[0.15em] whitespace-nowrap bg-white/80 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-sm border border-white/40">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <div className={`
                                        flex flex-col justify-end transition-all duration-500 delay-100 ease-out
                                        ${isActive ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute bottom-0 left-0 pointer-events-none'}
                                    `}>
                                        <h3 className="text-2xl font-bold uppercase text-[#1f2937] mb-2 section-heading leading-none">
                                            {step.title}
                                        </h3>
                                        <p className={`text-sm font-bold ${step.textColor} mb-3 leading-tight`}>
                                            {step.shortDesc}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2 font-medium">
                                            {step.fullDesc}
                                        </p>
                                        <ul className="space-y-1.5">
                                            {step.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    <CheckCircle2 size={12} className={step.textColor} />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className={`absolute bottom-6 right-6 transition-all duration-500 ${isActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100 delay-200'}`}>
                                    <div className="bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition-transform backdrop-blur-sm">
                                        <Plus size={20} className="text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>

                {/* --- MOBILE VIEW: Carrossel Horizontal --- */}
                {/* w-full para evitar corte lateral e padding para sombra não cortar */}
                <div className="w-full lg:hidden relative">
                    <div 
                        ref={scrollContainerRef}
                        onScroll={handleMobileScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-6 pb-8 pt-2"
                    >
                        {steps.map((step, index) => (
                            <div key={index} className="min-w-[85vw] snap-center bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-white flex flex-col">
                                <div className="relative h-48 shrink-0">
                                    <img 
                                        src={step.img} 
                                        alt={step.title} 
                                        className="w-full h-full object-cover"
                                        style={{ 
                                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                        }}
                                    />
                                    <div className="absolute bottom-2 left-6 flex items-center gap-3">
                                         <span className="text-3xl font-black text-[#1f2937] font-heading drop-shadow-sm">{step.id}</span>
                                        <h3 className="text-lg font-bold uppercase text-[#1f2937] relative z-10">{step.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6 pt-0 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-8 h-8 min-w-[2rem] rounded-lg flex items-center justify-center text-white ${step.color}`}>
                                                <step.icon size={16} />
                                            </div>
                                             <p className={`text-xs font-bold ${step.textColor} leading-tight`}>
                                                {step.shortDesc}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                                            {step.fullDesc}
                                        </p>
                                    </div>
                                     <ul className="space-y-1.5 pl-2 border-l-2 border-gray-100">
                                        {step.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                <div className={`w-1 h-1 rounded-full ${step.color}`}></div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* INDICADORES (DOTS) */}
                    <div className="flex justify-center gap-2">
                        {steps.map((_, index) => (
                            <div 
                                key={index} 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    mobileActiveIndex === index ? 'w-6 bg-[#1f2937]' : 'w-2 bg-[#1f2937]/30'
                                }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
      </div>
  );
}