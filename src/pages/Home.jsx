import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, MessageSquare, Phone, Mail, Calendar, MapPin, Clock, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BannerCarousel from '../components/BannerCarousel';
import Performance from '../components/Performance';
import About from '../components/About';
import Services from '../components/Services';
import Regional from '../components/Regional';
import Process from '../components/Process';
import Partners from '../components/Partners';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';

// Importação do ícone para o favicon
import iconeSif from '../assets/icone.svg';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentTrainings, setRecentTrainings] = useState([]);
  
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  
  // Refs para o componente Services
  const servicesSectionRef = useRef(null);
  const servicesTrackRef = useRef(null);

  useEffect(() => {
    // 1. Configuração de SEO e Favicon
    document.title = "SIF | Sociedade de Investigações Florestais";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = iconeSif;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = iconeSif;
      document.head.appendChild(newLink);
    }

    // 2. Busca Dados Dinâmicos
    fetch(`${API_BASE_URL}/eventos.php`)
      .then(res => res.json())
      .then(data => setRecentEvents(Array.isArray(data) ? data.slice(0, 1) : []))
      .catch(err => console.error(err));

    fetch(`${API_BASE_URL}/treinamentos.php`)
      .then(res => res.json())
      .then(data => setRecentTrainings(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(err => console.error(err));

    // 3. Lenis Scroll Suave
    let lenis;
    if (typeof window !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
            
            const scrollY = lenis.scroll;
            if (scrollY > 50 && !scrolled) setScrolled(true);
            if (scrollY <= 50 && scrolled) setScrolled(false);
        };
        
        requestAnimationFrame(raf);
    }

    // 4. Animação Horizontal Scroll para Nossos Serviços
    if (servicesSectionRef.current && servicesTrackRef.current) {
        const scrollWidth = servicesTrackRef.current.scrollWidth;
        const amountToScroll = scrollWidth - window.innerWidth;

        gsap.to(servicesTrackRef.current, {
            x: -amountToScroll,
            ease: "none",
            scrollTrigger: {
                trigger: servicesSectionRef.current,
                start: "top top",
                end: () => `+=${amountToScroll}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }

    return () => {
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scrolled]);

  const noisePattern = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABMTExERERmZmYzMzNmZmYAAABVvhyhAAAACHRSTlMAMwAzzP//zMzMzHJLEwAAACVJREFUOMtjYCAJcDEwMDBxMQAJUEGrcQqhqXHBGk200UYbsRoAAGOAAwD314OTAAAAAElFTkSuQmCC")`;

  return (
    <div className="sif-app font-sans text-[#1f2937] bg-[#f8f9fa] overflow-x-hidden w-full selection:bg-[#059669] selection:text-white">
      <Navbar 
        scrolled={scrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* --- HERO & PERFORMANCE --- */}
      <div className="relative w-full bg-[#1B5E20] rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden z-0 shadow-2xl pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#2E7D32_0%,_#1B5E20_100%)] z-0"></div>
          
          <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay z-0 pointer-events-none bg-noise"
              style={{ backgroundImage: noisePattern, filter: 'contrast(120%) brightness(100%)' }}
          ></div>

          <div className="relative z-10">
             <HeroSection 
                wrapperRef={heroRef}
                bgRef={heroBgRef}
                contentRef={heroContentRef}
             />
          </div>

          <div className="relative z-20 pt-4 px-4">
              <Performance />
          </div>
      </div>

      <BannerCarousel />

      {/* --- AGENDA E DESTAQUES (DINÂMICO) --- */}
      {(recentEvents.length > 0 || recentTrainings.length > 0) && (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
           <div className="container mx-auto max-w-7xl relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-10">
                 <div>
                    <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4 underline underline-offset-8">Tempo Real</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">O que <br/><span className="text-[#059669]">está acontecendo</span></h2>
                 </div>
                 <Link to="/eventos" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#059669] transition-all">
                    Ver Agenda Completa <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 {/* Evento Principal */}
                 {recentEvents[0] && (
                   <div className="lg:col-span-12 xl:col-span-7">
                      <Link to={`/eventos/${recentEvents[0].slug}`} className="group relative block h-[450px] rounded-[48px] overflow-hidden shadow-2xl">
                         <img 
                            src={getImageUrl(recentEvents[0].image_url)} 
                            alt={recentEvents[0].title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070'}
                          />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                         <div className="absolute bottom-10 left-10 right-10">
                            <span className="px-4 py-1 rounded-full bg-[#059669] text-white text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Destaque SIF</span>
                            <h3 className="text-3xl md:text-4xl font-bold text-white uppercase font-heading leading-none mb-6 tracking-tight line-clamp-2">{recentEvents[0].title}</h3>
                            <div className="flex flex-wrap gap-6 items-center">
                               <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase"><Calendar size={16} className="text-[#059669]" /> {recentEvents[0].date}</div>
                               <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase"><MapPin size={16} className="text-[#059669]" /> {recentEvents[0].location}</div>
                            </div>
                         </div>
                      </Link>
                   </div>
                 )}

                 {/* Lista Lateral de Treinamentos */}
                 <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4 px-2">Próximos Treinamentos</h4>
                    {recentTrainings.map((training) => (
                      <Link key={training.id} to={`/treinamentos/${training.slug}`} className="flex items-center gap-6 p-6 bg-[#f8f9fa] rounded-[32px] border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all group">
                         <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                            <img 
                                src={getImageUrl(training.image_url)} 
                                alt={training.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670'}
                             />
                         </div>
                         <div className="flex-grow">
                            <span className="text-[8px] font-black uppercase text-[#059669] tracking-widest">{training.segment}</span>
                            <h5 className="font-bold text-[#1f2937] uppercase text-sm leading-tight group-hover:text-[#059669] transition-colors mb-2">{training.title}</h5>
                            <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                               <Clock size={12} /> {training.hours} • SIF/UFV
                            </div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-200 group-hover:bg-[#059669] group-hover:text-white transition-all shadow-inner">
                            <ArrowRight size={18} />
                         </div>
                      </Link>
                    ))}
                    {recentTrainings.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] text-gray-300 font-bold uppercase text-[10px] tracking-widest">Vagas em breve</div>
                    )}
                 </div>
              </div>
           </div>
           <div className="absolute top-1/2 left-0 w-full h-[500px] bg-[#f8f9fa]/50 -z-0 -rotate-3 translate-y-20"></div>
        </section>
      )}

      {/* --- SOBRE NÓS --- */}
      <div id="quem-somos" className="py-12">
        <About />
      </div>

      {/* --- PRODUTOS E SERVIÇOS --- */}
      <Services sectionRef={servicesSectionRef} trackRef={servicesTrackRef} />

      {/* --- PARCEIROS --- */}
      <Partners />

      {/* --- ATUAÇÃO REGIONAL --- */}
      <Regional />

      {/* --- INOVAÇÃO E TRANSPARÊNCIA (PROCESS) --- */}
      <div className="py-24 px-6 bg-white">
        <div className="container mx-auto">
            <Process />
        </div>
      </div>
      
      {/* --- CTA DE CONTATO --- */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
            <div className="bg-[#1f2937] border border-gray-800 rounded-[60px] p-10 md:p-24 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#059669] rounded-full blur-[150px] opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Vamos Conversar?</span>
                        <h2 className="text-4xl md:text-7xl font-bold font-heading uppercase text-white mb-8 leading-[0.9] tracking-tighter">
                            Inicie sua <br/>
                            <span className="text-[#059669]">Parceria</span>
                        </h2>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                            Nossa equipe técnica está pronta para atender suas demandas de pesquisa, inovação e desenvolvimento florestal.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all group/item">
                                <Mail className="text-[#059669] mb-4" size={24} />
                                <span className="block text-gray-500 text-[10px] uppercase font-black mb-1">E-mail</span>
                                <p className="text-white font-bold text-sm">contato@sif.org.br</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all group/item">
                                <Phone className="text-[#059669] mb-4" size={24} />
                                <span className="block text-gray-500 text-[10px] uppercase font-black mb-1">Telefone</span>
                                <p className="text-white font-bold text-sm">(31) 3612-3950</p>
                            </div>
                        </div>
                        
                        <Link 
                            to="/contato" 
                            className="w-full bg-[#059669] hover:bg-[#047857] text-white py-8 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-900/20"
                        >
                            Fale com um Especialista <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      <FAQ />
      <Footer />
    </div>
  );
}