import React, { useState, useEffect, useRef } from 'react';
import { resolveGradient, TEXTURES } from '../utils/homeVisual';
import NumbersBento from '../components/NumbersBento';
import JobsCtaSection from '../components/JobsCtaSection';
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
  const grad = resolveGradient(config.visual);
  const texture = config.visual?.texture || 'ruido';

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

    // Quem pediu "menos movimento" no sistema fica com a rolagem normal
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const lenis = reduceMotion ? null : new Lenis({
      duration: 0.9, // mais curto = rolagem mais leve e responsiva
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Mantém o ScrollTrigger sincronizado com a rolagem do Lenis
    let rafId;
    const onNativeScroll = () => setScrolled(window.scrollY > 50);
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => {
        ScrollTrigger.update();
        setScrolled(scroll > 50); // React ignora quando o valor não muda
      });
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } else {
      window.addEventListener('scroll', onNativeScroll, { passive: true });
    }

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
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('load', refresh);
      window.removeEventListener('scroll', onNativeScroll);
      mm.revert();
      lenis?.destroy();
    };
  }, []);

  // Conteúdo da Home chegou do banco (cards de Serviços podem mudar de
  // quantidade/tamanho): recalcula o tamanho do pin.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [config]);

    return (
        <div className="sif-app sif-page font-sans text-[#1f2937] overflow-x-hidden w-full selection:bg-[#007a3d] selection:text-white">
          <Navbar 
            scrolled={scrolled} 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />

          {/* --- HERO & PERFORMANCE --- */}
          <div className="relative w-full rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden z-0 shadow-2xl pb-16" style={{ backgroundColor: grad.to }}>
              {/* Degradê e textura editáveis em Painel › Home › Topo */}
              <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(circle at 50% 0%, ${grad.from} 0%, ${grad.to} 100%)` }}></div>

              {texture === 'ruido' && (
                <div className="sif-noise absolute inset-0 opacity-50 z-0" aria-hidden="true"></div>
              )}
              {TEXTURES[texture]?.style && (
                <div className="absolute inset-0 z-0 pointer-events-none" style={TEXTURES[texture].style}></div>
              )}

              <div className="relative z-10">
                 <HeroSection
                    wrapperRef={heroRef}
                    bgRef={heroBgRef}
                    contentRef={heroContentRef}
                    config={config.hero}
                    bgImage={config.hero_bg}
                    gradient={grad}
                 />
              </div>

              <div className="relative z-20 pt-4 px-4">
                  <Performance config={config.performance} />
              </div>
          </div>

          <BannerCarousel />

          {/* --- NÚMEROS (bento com contagem animada) --- */}
          <NumbersBento config={config.numbers} />


          {/* --- SOBRE NÓS --- */}
          <div id="quem-somos" className="py-12">
            <About config={config.about} />
          </div>

          {/* --- PRODUTOS E SERVIÇOS --- */}
          <Services sectionRef={servicesSectionRef} trackRef={servicesTrackRef} config={config.services} />

          {/* --- PARCEIROS --- */}
          <Partners />

          {/* --- TRABALHE CONOSCO (card para a página de vagas) --- */}
          <JobsCtaSection config={config.jobs_cta} />

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
