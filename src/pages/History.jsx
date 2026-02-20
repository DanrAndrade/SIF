import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ArrowRight, Leaf, Sprout, Microscope, Globe, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import iconLogo from '../assets/icone.svg';
import Button from '../components/ui/Button';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// --- COMPONENTE TIMELINE ROW (ADAPTADO SIF) ---
const TimelineRow = ({ 
  year, 
  title, 
  imgSrc, 
  children, 
  layout = "image-left", 
  imgColClass = "md:col-span-7", 
  textColClass = "md:col-span-5",
  containerClass = "rounded-[40px] overflow-hidden shadow-2xl relative h-[300px] md:h-[450px] group bg-gray-200",
  imageWrapperClass = "w-full h-full",
  cardContent = null,
  overlayElements = null,
  backgroundDecoration = null 
}) => {
  
  const isRight = layout === "image-right";
  // Cor primária da SIF (Verde)
  const primaryColorClass = "bg-[#059669]"; 
  const primaryTextClass = "text-[#059669]";

  return (
    <div className="relative mb-24 md:mb-48 last:mb-0">
      {backgroundDecoration}

      <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${backgroundDecoration ? 'py-12 md:py-16' : ''}`}>
        
        {/* Texto */}
        <div className={`${textColClass} relative ${isRight ? 'order-2 md:order-1 text-right md:text-right' : 'pl-4 md:pl-10 order-2 md:order-2'}`}>
           <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block ${isRight ? '-right-12' : '-left-6'}`}>
              <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300"></div>
           </div>

           {year === 2021 && <span className="text-blue-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">EMBRAPII</span>}

           <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase mb-6 text-[#1f2937]">
              <span dangerouslySetInnerHTML={{ __html: title }} />
           </h2>

           <div className={`w-16 h-1 mb-6 ${isRight ? 'bg-[#1f2937] ml-auto' : primaryColorClass}`}></div>

           <div className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              {children}
           </div>
        </div>

        {/* Imagem / Card */}
        <div className={`${imgColClass} relative ${isRight ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
            <div className={`relative transition-all duration-500 ${containerClass}`}>
                <div className={`relative overflow-hidden ${imageWrapperClass}`}>
                    <img 
                        src={imgSrc} 
                        alt={`Ano ${year}`} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {!containerClass.includes('bg-white') && <div className="absolute inset-0 bg-black/20"></div>}
                </div>
                {cardContent}
            </div>

            {overlayElements}

            {!cardContent && (
                <span className={`absolute -top-6 text-[100px] md:text-[180px] font-bold text-gray-200/50 font-heading -z-10 leading-none select-none 
                    ${isRight ? '-right-6' : '-left-6'}`}>
                    {year.toString().slice(-2)}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default function History() {
  const mainRef = useRef(null);
  
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const box = document.querySelector(".box-logo");
      const startMarker = document.querySelector(".start-marker");
      const markers = gsap.utils.toArray(".timeline-marker");
      
      function createTimeline() {
        if (!mainRef.current || !box || !startMarker || markers.length === 0) return;
        const triggers = ScrollTrigger.getAll();
        triggers.forEach(t => t.kill());
        gsap.killTweensOf(box);
        const parentRect = mainRef.current.getBoundingClientRect();
        const startRect = startMarker.getBoundingClientRect();
        const startPoint = { x: startRect.left - parentRect.left + startRect.width / 2, y: startRect.top - parentRect.top + startRect.height / 2 };
        const markerPoints = markers.map(marker => {
            const rect = marker.getBoundingClientRect();
            return { x: rect.left - parentRect.left + rect.width / 2, y: rect.top - parentRect.top + rect.height / 2 };
        });
        const pathPoints = [startPoint, ...markerPoints];
        gsap.set(box, { x: pathPoints[0].x, y: pathPoints[0].y, xPercent: -50, yPercent: -50, opacity: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".history-container", start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true } });
        tl.to(box, { motionPath: { path: pathPoints, curviness: 1.5, autoRotate: false }, ease: "none" });
      }
      const timer = setTimeout(createTimeline, 800);
      window.addEventListener("resize", createTimeline);
      return () => { clearTimeout(timer); window.removeEventListener("resize", createTimeline); };
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#059669] selection:text-white flex flex-col">
      <Navbar scrolled={true} />

      <div ref={mainRef} className="history-container relative w-full pt-48 pb-32">
        {/* Logo que percorre a timeline */}
        <div className="box-logo absolute top-0 left-0 w-20 h-20 md:w-28 md:h-28 bg-white border-4 border-[#f8f9fa] rounded-full flex items-center justify-center shadow-2xl z-30 p-4 pointer-events-none will-change-transform opacity-0">
             <img src={iconLogo} alt="Logo SIF" className="w-full h-full object-contain" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative max-w-7xl">
            <div className="text-center mb-24 md:mb-32 relative z-10 flex flex-col items-center">
                <div className="start-marker w-1 h-1 bg-transparent mb-16"></div>
                <span className="text-[#059669] font-bold uppercase tracking-[0.4em] text-xs mb-6 animate-pulse block">Desde 1974</span>
                <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9]">
                    Uma História de<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#064e3b]">Raízes Fortes</span>
                </h1>
                <p className="text-gray-400 mt-6 font-medium max-w-xl mx-auto text-lg">
                    Há 50 anos conectando ciência, universidade e grandes empresas florestais.
                </p>
            </div>

            {/* 1974: Fundação */}
            <TimelineRow 
                year={1974} 
                title="O Plantio da <br/>Inovação" 
                imgSrc="https://images.unsplash.com/photo-1667689894283-475c4c7e5904?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            >
                Em Viçosa, Minas Gerais, nasce uma parceria pioneira. A <strong>Universidade Federal de Viçosa (UFV)</strong> e as maiores empresas florestais do país se unem para criar a SIF. O objetivo era claro: transformar pesquisa acadêmica em soluções reais para o campo.
            </TimelineRow>

            {/* 2014: 40 Anos e Reconhecimento */}
            <TimelineRow 
                year={2014} 
                title="Consolidação e<br/>Reconhecimento" 
                imgSrc="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop"
                layout="image-right"
                imgColClass="md:col-span-8"
                textColClass="md:col-span-4"
                containerClass="bg-white p-3 md:p-4 pb-8 md:pb-12 shadow-xl rotate-1 hover:rotate-0 h-auto"
                imageWrapperClass="h-[250px] md:h-[350px] bg-gray-100"
                cardContent={
                    <div className="flex justify-between items-end mt-4 px-2">
                        <span className="font-heading text-3xl md:text-4xl text-gray-300">2014</span>
                        <span className="font-handwriting text-gray-500 text-xs md:text-sm">40 Anos de Excelência</span>
                    </div>
                }
            >
                <p className="mb-6">Comemorando quatro décadas de impacto, criamos a <strong>Medalha Sebastião Ferreira</strong>, honrando aqueles que moldaram o setor florestal brasileiro.</p>
                <ul className="text-gray-500 font-medium space-y-2 inline-block text-right text-sm md:text-base w-full">
                    <li className="flex items-center justify-end gap-2"><Leaf size={16} className="text-[#059669]"/> Pesquisa de Ponta</li>
                    <li className="flex items-center justify-end gap-2"><Users size={16} className="text-[#059669]"/> Capacitação Técnica</li>
                    <li className="flex items-center justify-end gap-2"><Globe size={16} className="text-[#059669]"/> Referência Global</li>
                </ul>
            </TimelineRow>

            {/* 2021: Tecnologia e EMBRAPII */}
            <TimelineRow 
                year={2021} 
                title="A Era Digital:<br/> Hub de Tecnologia" 
                imgSrc="https://images.unsplash.com/photo-1526666923127-b2970f64b422?q=80&w=2072&auto=format&fit=crop"
                imgColClass="md:col-span-6"
                textColClass="md:col-span-6"
                containerClass="rounded-3xl border-4 border-white bg-gray-200 shadow-2xl h-full"
                backgroundDecoration={<div className="absolute inset-0 bg-green-50/50 -skew-y-3 rounded-[50px] -z-10 scale-110"></div>}
                overlayElements={
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-xs hidden md:block z-20">
                        <p className="text-[#059669] font-bold text-xl md:text-2xl">Startups</p>
                        <p className="text-gray-500 text-xs md:text-sm">Forest Insight & Inovação</p>
                    </div>
                }
            >
                A SIF se reinventa como um Hub de Inovação. Com o credenciamento da unidade <strong>EMBRAPII Fibras Florestais</strong> e o lançamento do programa <em>Forest Insight</em>, conectamos startups e tecnologia de ponta aos desafios das grandes empresas.
            </TimelineRow>

            {/* 2024: Card Dark - Validado por Gigantes */}
            <div className="relative mb-24 md:mb-32">
                <div className="bg-[#1f2937] rounded-[30px] md:rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669] rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="order-2 md:order-1">
                             <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase mb-6">Gigantes do<br/>Setor</h2>
                             <div className="w-20 h-1 bg-[#059669] mb-8"></div>
                             <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                                 Hoje, somos o elo estratégico das maiores empresas de base florestal do mundo. Aperam, ArcelorMittal, Cenibra, Suzano, Vallourec e muitas outras.
                             </p>
                             <p className="text-white font-bold text-lg md:text-xl">
                                 Elas confiam na ciência da SIF.
                             </p>
                        </div>

                        <div className="order-1 md:order-2 flex justify-center relative">
                             <div className="absolute right-0 top-0 hidden md:block">
                                <div className="timeline-marker w-4 h-4 rounded-full bg-white/20"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors">
                                    <Sprout className="text-gray-300 w-10 h-10" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors">
                                    <Microscope className="text-gray-300 w-10 h-10" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors col-span-2">
                                    <span className="font-heading text-xl tracking-widest text-center">WORLD CLASS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="text-center relative z-10 pb-20">
                <div className="flex justify-center mb-12"><div className="timeline-marker w-4 h-4 bg-transparent"></div></div>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-bold font-heading uppercase text-[#1f2937] mb-8 leading-none">
                        O Futuro é<br/><span className="text-[#059669]">Sustentável</span>
                    </h2>
                    <p className="text-gray-500 mb-10 font-medium text-lg md:text-xl">
                        Estamos prontos para os próximos 50 anos de pesquisa. <br/>Sua empresa vem com a gente?
                    </p>
                    <Button href="/contato" variant="primary" icon={ArrowRight} className="px-10 py-4 text-sm bg-[#059669] hover:bg-[#047857]">
                        Seja uma Associada
                    </Button>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}