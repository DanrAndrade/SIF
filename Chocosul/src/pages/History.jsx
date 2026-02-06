import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ArrowRight, CheckCircle, TrendingUp, Globe } from 'lucide-react';
// useNavigate removido
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// IMPORTANDO O LOGO DEFINITIVO
import iconLogo from '../assets/icone.svg';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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
        const startPoint = {
            x: startRect.left - parentRect.left + startRect.width / 2,
            y: startRect.top - parentRect.top + startRect.height / 2
        };

        const markerPoints = markers.map(marker => {
            const rect = marker.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2
            };
        });

        const pathPoints = [startPoint, ...markerPoints];

        gsap.set(box, {
            x: pathPoints[0].x,
            y: pathPoints[0].y,
            xPercent: -50,
            yPercent: -50,
            opacity: 1
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".history-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        });

        tl.to(box, {
          motionPath: {
            path: pathPoints,
            curviness: 1.5,
            autoRotate: false 
          },
          ease: "none" 
        });
      }

      const timer = setTimeout(createTimeline, 800);
      window.addEventListener("resize", createTimeline);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", createTimeline);
      };

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#D91A3C] selection:text-white flex flex-col">
      <Navbar scrolled={true} mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

      <div ref={mainRef} className="history-container relative w-full pt-48 pb-32">
        
        {/* LOGO ANIMADO (BOX-LOGO) */}
        {/* Mantive as classes originais para a animação funcionar, mas troquei o conteúdo pela imagem */}
        <div className="box-logo absolute top-0 left-0 w-20 h-20 md:w-28 md:h-28 bg-white border-4 border-[#f8f9fa] rounded-full flex items-center justify-center shadow-2xl z-30 p-4 pointer-events-none will-change-transform opacity-0">
             <img 
                src={iconLogo} 
                alt="Logo Chocosul" 
                className="w-full h-full object-contain" 
             />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative max-w-7xl">
            
            <div className="text-center mb-24 md:mb-32 relative z-10 flex flex-col items-center">
                <div className="start-marker w-1 h-1 bg-transparent mb-16"></div>
                <span className="text-[#D91A3C] font-bold uppercase tracking-[0.4em] text-xs mb-6 animate-pulse block">Desde 2004</span>
                <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9]">
                    Uma História de<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D91A3C] to-[#900f24]">Movimento</span>
                </h1>
                <p className="text-gray-400 mt-6 font-medium max-w-xl mx-auto text-lg">
                    De dois caminhões a uma potência logística no sul da Bahia.
                </p>
            </div>

            {/* SEÇÃO 1: 2004 */}
            <div className="relative mb-24 md:mb-48">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-7 relative">
                        <div className="rounded-[40px] overflow-hidden shadow-2xl relative h-[300px] md:h-[450px] group bg-gray-200">
                            <img 
                                src="https://images.unsplash.com/photo-1586155638764-bf04544711bc?q=80&w=2070&auto=format&fit=crop" 
                                alt="Caminhão Antigo" 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        <span className="absolute -top-6 -left-6 text-[100px] md:text-[180px] font-bold text-gray-200/50 font-heading -z-10 leading-none">04</span>
                    </div>

                    <div className="md:col-span-5 relative pl-4 md:pl-10">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden md:block">
                            <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase mb-6 text-[#1f2937]">O Ponto de Partida</h2>
                        <div className="w-16 h-1 bg-[#D91A3C] mb-6"></div>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                            Eunápolis, Bahia. Em um pequeno escritório, nascia o sonho. Com apenas dois veículos e muita vontade de fazer diferente, iniciamos nossa operação focados em algo que faltava na região: <strong>compromisso</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 2: 2010 */}
            <div className="relative mb-24 md:mb-48">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-4 order-2 md:order-1 relative text-right md:text-right">
                         <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase mb-6 text-[#1f2937]">Conquistando a <br/>Independência</h2>
                        <div className="w-16 h-1 bg-[#1f2937] mb-6 ml-auto"></div>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                            Para garantir pontualidade, precisávamos ter o controle. Em 2010, fizemos nosso maior investimento até então: a aquisição da frota pesada própria.
                        </p>
                        <ul className="text-gray-500 font-medium space-y-2 inline-block text-right text-sm md:text-base">
                            <li className="flex items-center justify-end gap-2"><CheckCircle size={16} className="text-[#D91A3C]"/> Pontualidade Garantida</li>
                            <li className="flex items-center justify-end gap-2"><CheckCircle size={16} className="text-[#D91A3C]"/> Manutenção Preventiva</li>
                            <li className="flex items-center justify-end gap-2"><CheckCircle size={16} className="text-[#D91A3C]"/> Monitoramento 24h</li>
                        </ul>

                         <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block">
                            <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>
                    </div>

                    <div className="md:col-span-8 order-1 md:order-2 relative">
                         <div className="bg-white p-3 md:p-4 pb-8 md:pb-12 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
                             <div className="h-[250px] md:h-[350px] overflow-hidden bg-gray-100 relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Frota de Caminhões" 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                             </div>
                             <div className="flex justify-between items-end mt-4 px-2">
                                 <span className="font-heading text-3xl md:text-4xl text-gray-300">2010</span>
                                 <span className="font-handwriting text-gray-500 text-xs md:text-sm">Nossa primeira frota Scania</span>
                             </div>
                         </div>
                    </div>

                </div>
            </div>

            {/* SEÇÃO 3: 2016 */}
            <div className="relative mb-24 md:mb-48">
                <div className="absolute inset-0 bg-blue-50/50 -skew-y-3 rounded-[50px] -z-10 scale-110"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 md:py-16">
                     <div className="relative h-[250px] md:h-[350px]">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200 h-full w-full">
                             <img 
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
                                alt="Tecnologia WMS" 
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 md:p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                            <p className="text-[#D91A3C] font-bold text-xl md:text-2xl">99.9%</p>
                            <p className="text-gray-500 text-xs md:text-sm">Precisão de Estoque</p>
                        </div>
                     </div>

                     <div className="relative pl-0 md:pl-8">
                         <div className="absolute -left-12 top-20 hidden md:block">
                            <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300"></div>
                        </div>

                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">2016</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase mb-6 text-[#1f2937]">A Era Digital:<br/> WMS & Inteligência</h2>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                            Não bastava transportar, era preciso informar. Implementamos sistemas de WMS de ponta, permitindo que nossos clientes vissem seu estoque em tempo real.
                        </p>
                     </div>
                </div>
            </div>

            {/* SEÇÃO 4: 2023 */}
            <div className="relative mb-24 md:mb-32">
                <div className="bg-[#1f2937] rounded-[30px] md:rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D91A3C] rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="order-2 md:order-1">
                             <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase mb-6">Validado por<br/>Gigantes</h2>
                             <div className="w-20 h-1 bg-[#D91A3C] mb-8"></div>
                             <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                                 A excelência nos trouxe até aqui. Em 2023, consolidamos contratos com as maiores indústrias alimentícias do mundo. Mondelez, Heinz, Ferrero. 
                             </p>
                             <p className="text-white font-bold text-lg md:text-xl">
                                 Eles confiam na Chocosul.
                             </p>
                        </div>

                        <div className="order-1 md:order-2 flex justify-center relative">
                             <div className="absolute right-0 top-0 hidden md:block">
                                <div className="timeline-marker w-4 h-4 rounded-full bg-white/20"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors">
                                    <Globe className="text-gray-300 w-10 h-10" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors">
                                    <TrendingUp className="text-gray-300 w-10 h-10" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors col-span-2">
                                    <span className="font-heading text-xl tracking-widest text-center">GLOBAL PARTNERS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FINAL */}
            <div className="text-center relative z-10 pb-20">
                <div className="flex justify-center mb-12">
                     <div className="timeline-marker w-4 h-4 bg-transparent"></div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-bold font-heading uppercase text-[#1f2937] mb-8 leading-none">
                        O Futuro<br/><span className="text-[#D91A3C]">É Agora</span>
                    </h2>
                    <p className="text-gray-500 mb-10 font-medium text-lg md:text-xl">
                        Estamos prontos para os próximos 20 anos. <br/>Sua empresa vem com a gente?
                    </p>
                    
                    {/* BOTÃO SIMPLIFICADO: Apenas Scale no Hover */}
                    <a 
                        href="/contato"
                        className="group relative inline-flex items-center gap-4 px-10 py-4 
                        bg-gradient-to-br from-[#D91A3C] to-[#900f24] 
                        text-white font-bold rounded-full uppercase tracking-wider text-xs md:text-sm 
                        transition-all duration-300 cursor-pointer shadow-xl
                        hover:scale-105"
                    >
                        Iniciar Parceria
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}