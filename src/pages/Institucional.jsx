import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ArrowRight, Leaf, Sprout, Microscope, Globe, Users, Download, FileText, FileBadge, Scale, X as CloseIcon, ChevronDown, Check, Map, Settings, Shield, ArrowLeft } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import iconLogo from '../assets/icone.svg';
import Button from '../components/ui/Button';
import FAQ from '../components/FAQ';

// --- DADOS DA EQUIPE ---
const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    role: "Diretor Executivo",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
    bio: "Doutor em Ciência Florestal pela UFV, João atua há mais de 20 anos na liderança de projetos de P&D+, conectando o conhecimento acadêmico às demandas do mercado industrial."
  },
  {
    id: 2,
    name: "Maria Souza",
    role: "Coordenadora Técnica",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
    bio: "Especialista em biotecnologia florestal, Maria coordena as equipes de laboratório e campo, garantindo a excelência técnica em todas as etapas dos projetos cooperativos."
  },
  {
    id: 3,
    name: "Carlos Mendes",
    role: "Gerente de P&D",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop",
    bio: "Responsável pela gestão de parcerias e novos negócios, Carlos foca no desenvolvimento de tecnologias disruptivas para a indústria de celulose e papel."
  },
  {
    id: 4,
    name: "Ana Costa",
    role: "Gestora de Projetos",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop",
    bio: "Com vasta experiênca em gestão ágil, Ana assegura que os cronogramas e entregáveis de cada associada sejam cumpridos com o máximo rigor de qualidade."
  }
];

// --- COMPONENTE TIMELINE ITEM ---
const HistoryItem = ({ year, title, children, imgSrc, layout = "image-left" }) => {
    const isRight = layout === "image-right";
    return (
        <div className="relative mb-32 md:mb-64 last:mb-0 group/item">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                {/* Texto */}
                <div className={`space-y-6 ${isRight ? 'order-2 md:order-1 text-right' : 'order-2 md:order-2'}`}>
                     <div className="flex items-center gap-4 group-hover/item:pl-2 transition-all">
                        {!isRight && <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300 group-hover/item:bg-[#059669] transition-colors"></div>}
                        <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937]">
                            <span dangerouslySetInnerHTML={{ __html: title }} />
                        </h2>
                        {isRight && <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300 group-hover/item:bg-[#059669] transition-colors"></div>}
                     </div>
                     <div className={`w-20 h-1.5 bg-[#059669] ${isRight ? 'ml-auto' : ''}`}></div>
                     <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                        {children}
                     </p>
                </div>
                {/* Imagem */}
                <div className={`relative ${isRight ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
                    <div className="absolute inset-0 bg-emerald-50 rounded-[40px] translate-x-4 translate-y-4 -z-10 group-hover/item:translate-x-6 group-hover/item:translate-y-6 transition-transform"></div>
                    <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3] relative">
                        <img src={imgSrc} alt={year} className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110" />
                        <div className="absolute inset-0 bg-[#1f2937]/20"></div>
                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-2xl font-black text-2xl text-[#1f2937] shadow-xl">{year}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Institucional() {
  const mainRef = useRef(null);
  const areasScrollRef = useRef(null);

  const scrollAreas = (direction) => {
    if (areasScrollRef.current) {
        const { scrollLeft, clientWidth } = areasScrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
        areasScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    
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
        
        gsap.set(box, { x: pathPoints[0].x, y: pathPoints[0].y, xPercent: -50, yPercent: -50, opacity: 1 });
        
        const tl = gsap.timeline({ 
            scrollTrigger: { 
                trigger: ".history-container", 
                start: "top top", 
                end: "bottom bottom", 
                scrub: 1.5, 
                invalidateOnRefresh: true 
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
      
      const timer = setTimeout(createTimeline, 1000);
      window.addEventListener("resize", createTimeline);
      return () => { clearTimeout(timer); window.removeEventListener("resize", createTimeline); };
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#059669] selection:text-white flex flex-col">
      <Navbar />

      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2071')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">A SIF & Sua História</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Nossa <br/>
              <span className="text-[#059669]">História</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Mais do que uma entidade, somos o catalisador da inovação florestal no Brasil e no mundo.
          </p>

          <button 
              onClick={() => {
                  const section = document.getElementById('quem-somos');
                  if (section) {
                      const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
                      window.scrollTo({top: y, behavior: 'smooth'});
                  }
              }} 
              className="group flex flex-col items-start gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#059669]"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-all shadow-sm">
                  <ChevronDown className="animate-bounce" size={20} />
              </div>
          </button>
        </div>
      </div>

      {/* QUEM SOMOS */}
      <div id="quem-somos" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                    <div className="w-16 h-1.5 bg-[#059669]"></div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[1.0] tracking-tight">
                        Pioneirismo <br/><span className="text-[#059669]">Científico</span>
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
                        Fundada em 1974 na Universidade Federal de Viçosa (UFV), a SIF nasceu da necessidade de unir o rigor acadêmico às demandas práticas do mercado sustentável. Somos uma organização sem fins lucrativos que gerencia a sinergia entre grandes potências industriais e o capital intelectual da academia.
                    </p>
                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
                        Ao longo de cinco décadas, transformamos o cenário florestal brasileiro, tornando-o referência mundial em produtividade através de pesquisas aplicadas em genética, solos e tecnologia.
                    </p>
                </div>
                <div className="relative animate-in zoom-in duration-1000">
                    <div className="absolute inset-0 bg-emerald-100/50 rounded-[60px] translate-x-10 translate-y-10 -z-10 blur-3xl"></div>
                    <div className="rounded-[60px] overflow-hidden shadow-2xl relative aspect-[4/5] lg:aspect-square">
                        <img 
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" 
                            alt="Manejo Florestal" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-[#1f2937] via-transparent to-transparent">
                            <p className="text-white text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Campus UFV</p>
                            <p className="text-white text-2xl font-bold uppercase font-heading">Onde a Ciência Acontece</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-[#f8f9fa] pt-20">
        {/* NOSSA GENTE */}
        <div id="nossa-gente" className="container mx-auto px-6 md:px-12 pt-32 pb-32 md:pb-40 w-full max-w-7xl">
            <div className="text-center mb-20">
                <span className="text-[#059669] font-bold uppercase tracking-widest text-xs mb-4 block underline underline-offset-8">Conheça</span>
                <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937]">Nossa Gente</h2>
                <p className="text-gray-400 mt-8 max-w-2xl mx-auto font-medium text-lg md:text-xl">
                    Especialistas e pesquisadores dedicados a transformar o setor florestal por meio da inovação constante.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="group text-center" 
                    >
                        <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white group-hover:border-[#059669] transition-all duration-500 shadow-xl relative">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <h3 className="font-bold text-[#1f2937] text-xl uppercase font-heading tracking-tight">{member.name}</h3>
                        <p className="text-[#059669] text-xs font-black uppercase tracking-[0.2em] mt-2 block">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* ÁREAS DE ATUAÇÃO / REGIONAL */}
        <div id="areas-atuacao" className="bg-[#f8f9fa] py-32 border-t border-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Fronteira Tecnológica</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">Nossas Áreas <br/><span className="text-[#059669]">de Atuação</span></h2>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <p className="text-gray-400 font-medium text-lg max-w-sm">Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal de ponta.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => scrollAreas('left')}
                                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#1f2937] hover:border-[#059669] hover:bg-[#059669] hover:text-white transition-all shadow-md active:scale-95"
                            >
                                <ArrowLeft size={24} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => scrollAreas('right')}
                                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#1f2937] hover:border-[#059669] hover:bg-[#059669] hover:text-white transition-all shadow-md active:scale-95"
                            >
                                <ArrowRight size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={areasScrollRef} 
                    className="flex overflow-x-auto gap-10 no-scrollbar pb-16 snap-x snap-mandatory px-4"
                >
                    {[
                        { 
                            title: "Silvicultura de Precisão", 
                            icon: Sprout, 
                            desc: "Desenvolvimento de protocolos avançados de biotecnologia, produção de sementes certificadas e mudas de alta performance. Atuamos na fronteira da nutrição florestal e técnicas silviculturais automatizadas para maximizar o ganho genético no campo." 
                        },
                        { 
                            title: "Manejo & Inteligência", 
                            icon: Map, 
                            desc: "Soluções integradas em inventário florestal contínuo, planejamento estratégico de colheita e economia de recursos. Utilizamos sensoriamento remoto e GIS de alta resolução para modelagem preditiva e tomada de decisão baseada em dados." 
                        },
                        { 
                            title: "Ambiência & Clima", 
                            icon: Leaf, 
                            desc: "Pesquisas focadas na conservação da biodiversidade, monitoramento hidrológico e recuperação de ecossistemas degradados. Lideramos projetos de regulação hídrica e estratégias de adaptação às mudanças climáticas para o setor florestal." 
                        },
                        { 
                            title: "Proteção & Sanidade", 
                            icon: Shield, 
                            desc: "Monitoramento ativo e controle biológico de pragas e doenças florestais. Desenvolvemos sistemas inteligentes de prevenção contra incêndios e protocolos de defesa fitossanitária que garantem a segurança do patrimônio biológico das empresas." 
                        },
                        { 
                            title: "Tecnologia de Produtos", 
                            icon: Settings, 
                            desc: "Fomento à inovação em processos industriais para energia, celulose, papel e multiprodutos da madeira. Investigamos a anatomia e as propriedades físico-químicas das fibras para o desenvolvimento de bioprodutos de alto valor agregado." 
                        },
                    ].map((area, i) => (
                        <div 
                            key={i} 
                            className="group flex-shrink-0 w-[350px] md:w-[450px] bg-white p-12 rounded-[56px] transition-all duration-500 snap-center border border-gray-100 shadow-[inset_0_0_20px_rgba(255,255,255,1),0_15px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_70px_-25px_rgba(0,0,0,0.15)]"
                        >
                            <div className="text-[#059669] mb-10 group-hover:scale-110 transition-transform origin-left duration-500">
                                <area.icon size={42} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] mb-6 group-hover:text-[#059669] transition-colors leading-tight">{area.title}</h3>
                            <p className="text-gray-500 text-base leading-relaxed font-medium">
                                {area.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* ESTATUTO E NORMAS */}
        <div id="estatutos-normas" className="container mx-auto px-6 md:px-8 max-w-7xl pt-32 pb-32 mt-64 border-t border-gray-100/5">
            <div className="bg-[#1f2937] rounded-[40px] p-10 md:p-16 text-white relative flex flex-col items-center text-center shadow-2xl">
                <div className="max-w-4xl relative z-10 w-full">
                    <span className="text-[#059669] font-bold uppercase tracking-widest text-xs mb-4 block underline underline-offset-8">Governança</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase mt-8 mb-8 leading-tight">Documentação <br/><span className="text-[#059669]">& Transparência</span></h2>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-16 font-medium max-w-2xl mx-auto">A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[ 
                            { title: "Estatuto Social SIF", size: "1.2 MB", icon: Scale },
                            { title: "Código de Ética", size: "850 KB", icon: FileBadge },
                            { title: "Regimento Interno", size: "920 KB", icon: FileText }
                        ].map((doc, i) => (
                            <a key={i} href="#" className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col gap-6 items-center group hover:bg-[#059669] hover:border-transparent transition-all duration-300">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-[#059669] group-hover:text-white group-hover:scale-110 transition-all">
                                    <doc.icon size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold uppercase text-[10px] tracking-[0.2em] group-hover:text-white transition-colors mb-2">{doc.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-emerald-100">{doc.size} • PDF</p>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:border-white/50 transition-all">
                                    <Download size={18} />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* HISTORIA (TIMELINE) */}
        <div id="historia" className="history-container py-24 bg-white" ref={mainRef}>
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="text-center mb-32 relative z-10 flex flex-col items-center">
                    <div className="start-marker w-1 h-1 bg-transparent mb-16"></div>
                    <span className="text-[#059669] font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Nossa Jornada</span>
                    <h2 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">
                        Cinco <span className="text-[#059669]">Décadas</span><br/>de Ciência
                    </h2>
                </div>

                {/* Box flutuante */}
                <div className="box-logo fixed pointer-events-none z-50 transition-opacity duration-300 opacity-0 mix-blend-multiply">
                     <img src={iconLogo} alt="SIF" className="w-16 md:w-24 opacity-80" />
                </div>

                <div className="relative space-y-10">
                    <HistoryItem 
                        year={1974} 
                        title="O <span className='text-[#059669]'>Berço</span>" 
                        imgSrc="https://images.unsplash.com/photo-1581093806997-124204d9ad9d?q=80&w=2670&auto=format&fit=crop"
                    >
                        Fundação no campus da UFV, estabelecendo a primeira ponte estratégica entre academia e as gigantes do setor florestal brasileiro.
                    </HistoryItem>

                    <HistoryItem 
                        year={1992} 
                        title="Eco-<span className='text-[#059669]'>92</span>" 
                        imgSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                        layout="image-right"
                    >
                        Apresentação de soluções disruptivas em manejo sustentável na conferência da ONU, o Rio de Janeiro se tornou palco para a ciência da SIF.
                    </HistoryItem>

                    <HistoryItem 
                        year={2021} 
                        title="Era <span className='text-[#059669]'>HUB</span>" 
                        imgSrc="https://images.unsplash.com/photo-1532187875605-1838d7370324?q=80&w=2670&auto=format&fit=crop"
                    >
                        Credenciamento como Unidade EMBRAPII, permitindo o co-financiamento federal de projetos tecnológicos de alta complexidade.
                    </HistoryItem>
                </div>

                {/* CTA FINAL */}
                <div className="mt-64 text-center">
                    <div className="timeline-marker w-1 h-1 bg-transparent mb-12 mx-auto"></div>
                    <h2 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] mb-12 leading-none">
                        O Amanhã é<br/><span className="text-[#059669]">Científico</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Button href="/contato" variant="primary" icon={ArrowRight} className="px-14 py-6 bg-[#059669] hover:bg-[#047857] shadow-2xl shadow-emerald-700/20 text-sm">
                            Seja uma Associada
                        </Button>
                        <Button href="/trabalhe-conosco" variant="outline" className="px-14 py-6 border-[#1f2937] text-[#1f2937] hover:bg-[#1f2937] hover:text-white transition-all text-sm">
                            Trabalhe Conosco
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <FAQ />
      <Footer />
    </div>
  );
}
