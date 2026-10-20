import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BannerCarousel from '../components/BannerCarousel';
import Performance from '../components/Performance';
import About from '../components/About';
import Services from '../components/Services';
import Process from '../components/Process';
import Partners from '../components/Partners';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

import { usePageConfig } from '../hooks/usePageConfig';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Config editável via /admin/home. Tudo tem fallback nos componentes filhos.
  const { config } = usePageConfig('home');

  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  
  // Refs para o componente Services
  const servicesSectionRef = useRef(null);
  const servicesTrackRef = useRef(null);

  // Rolagem suave (Lenis) + "pin" horizontal dos Serviços.
  // Roda UMA vez por visita à Home (antes dependia de [scrolled] e era
  // destruída/recriada toda vez que a rolagem passava de 50px, deixando
  // laços de animação acumulados mesmo depois de sair da página).
  useEffect(() => {
    document.title = "SIF | Sociedade de Investigações Florestais";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Mantém o ScrollTrigger sincronizado com a rolagem do Lenis
    lenis.on('scroll', ({ scroll }) => {
      ScrollTrigger.update();
      setScrolled(scroll > 50); // React ignora quando o valor não muda
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Contexto local: no fim, desfaz SÓ as animações desta página
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const section = servicesSectionRef.current;
      const track = servicesTrackRef.current;
      if (!section || !track) return;
      // Distância calculada na hora (muda quando os cards/fonte carregam)
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    // Recalcula depois que fontes e imagens terminam de carregar
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', refresh);
      mm.revert();
      lenis.destroy();
    };
  }, []);

  // Conteúdo da Home chegou do banco (cards de Serviços podem mudar de
  // quantidade/tamanho): recalcula o tamanho do pin.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [config]);

    const noisePattern = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABMTExERERmZmYzMzNmZmYAAABVvhyhAAAACHRSTlMAMwAzzP//zMzMzHJLEwAAACVJREFUOMtjYCAJcDEwMDBxMQAJUEGrcQqhqXHBGk200UYbsRoAAGOAAwD314OTAAAAAElFTkSuQmCC")`;

    return (
        <div className="sif-app font-sans text-[#1f2937] bg-[#f8f9fa] overflow-x-hidden w-full selection:bg-[#007a3d] selection:text-white">
          <Navbar 
            scrolled={scrolled} 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />

          {/* --- HERO & PERFORMANCE --- */}
          <div className="relative w-full bg-[#1B5E20] rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden z-0 shadow-2xl pb-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#007a3d_0%,_#1B5E20_100%)] z-0"></div>
              
              <div 
                  className="absolute inset-0 opacity-20 mix-blend-overlay z-0 pointer-events-none bg-noise"
                  style={{ backgroundImage: noisePattern, filter: 'contrast(120%) brightness(100%)' }}
              ></div>

              <div className="relative z-10">
                 <HeroSection
                    wrapperRef={heroRef}
                    bgRef={heroBgRef}
                    contentRef={heroContentRef}
                    config={config.hero}
                    bgImage={config.hero_bg}
                 />
              </div>

              <div className="relative z-20 pt-4 px-4">
                  <Performance config={config.performance} />
              </div>
          </div>

          <BannerCarousel />


          {/* --- SOBRE NÓS --- */}
          <div id="quem-somos" className="py-12">
            <About config={config.about} />
          </div>

          {/* --- PRODUTOS E SERVIÇOS --- */}
          <Services sectionRef={servicesSectionRef} trackRef={servicesTrackRef} config={config.services} />

          {/* --- PARCEIROS --- */}
          <Partners />

          {/* --- INOVAÇÃO E TRANSPARÊNCIA (PROCESS) --- */}
      <div className="py-14 px-0 md:py-24 md:px-6 bg-white">
        <div className="w-full max-w-[1280px] mx-auto px-0">
            <Process config={config.process} />
        </div>
      </div>


      <FAQ pageKey="home" sideConfig={config.faq_side} />
      <Footer />
    </div>
  );
}
