import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
import NoiseOverlay from '../components/ui/NoiseOverlay';

import { API_BASE_URL, getImageUrl } from '../apiConfig';
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

  useEffect(() => {
    // 1. Configuração de SEO
    document.title = "SIF | Sociedade de Investigações Florestais";

    // 2. Busca Dados Dinâmicos

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

        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
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
        });

        return () => {
          mm.revert();
          if (lenis) lenis.destroy();
          ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [scrolled]);

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
      <div className="py-14 px-2 md:py-24 md:px-6 bg-white">
        <div className="w-full max-w-[1280px] mx-auto px-1 md:px-0">
            <Process config={config.process} />
        </div>
      </div>


      <FAQ pageKey="home" sideConfig={config.faq_side} />
      <Footer />
    </div>
  );
}
