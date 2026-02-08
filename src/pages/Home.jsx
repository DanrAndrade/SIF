import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BannerCarousel from '../components/BannerCarousel'; // <--- IMPORTADO AQUI
import Performance from '../components/Performance';
import About from '../components/About';
import Partners from '../components/Partners';
import Services from '../components/Services';
import Regional from '../components/Regional';
import Process from '../components/Process';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  
  const servicesSectionRef = useRef(null);
  const servicesTrackRef = useRef(null);

  useEffect(() => {
    let lenis;
    let ctx; 

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

        let mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
            if (servicesSectionRef.current && servicesTrackRef.current) {
                const section = servicesSectionRef.current;
                const track = servicesTrackRef.current;
                const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 100); 

                gsap.to(track, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${(track.scrollWidth - window.innerWidth) * 1.5}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        anticipatePin: 1
                    }
                });
            }
        });
        ctx = mm;
    }

    return () => {
      if (lenis) lenis.destroy();
      if (ctx) ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scrolled]);

  // Noise Otimizado (Base64)
  const noisePattern = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABMTExERERmZmYzMzNmZmYAAABVvhyhAAAACHRSTlMAMwAzzP//zMzMzHJLEwAAACVJREFUOMtjYCAJcDEwMDBxMQAJUEGrcQqhqXHBGk200UYbsRoAAGOAAwD314OTAAAAAElFTkSuQmCC")`;

  return (
    <div className="chocosul-app font-sans text-gray-900 bg-[#f8f9fa] overflow-x-hidden w-full">
      <Navbar 
        scrolled={scrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* BACKGROUND PRINCIPAL - VERDE FLORESTA */}
      {/* Contém Hero + Performance (Frota) */}
      <div className="relative w-full bg-[#1B5E20] rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden z-0 shadow-2xl pb-16 gpu-layer">
          
          {/* Gradiente Verde Profundo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#2E7D32_0%,_#1B5E20_100%)] z-0 will-change-transform"></div>
          
          <div 
              className="absolute inset-0 opacity-30 mix-blend-overlay z-0 pointer-events-none bg-noise will-change-transform"
              style={{ backgroundImage: noisePattern, filter: 'contrast(120%) brightness(100%)' }}
          ></div>

          <div className="relative z-10">
             <HeroSection 
                wrapperRef={heroRef}
                bgRef={heroBgRef}
                contentRef={heroContentRef}
             />
          </div>

          <div id="frota" className="relative z-20 pt-4 px-4 optimize-paint">
              <Performance />
          </div>
      </div>

      {/* --- BANNER CAROUSEL --- */}
      {/* Adicionado AQUI, fora do bloco verde para não quebrar o layout. */}
      {/* Ele vai aparecer no fundo cinza claro, logo abaixo da curva verde. */}
      <BannerCarousel />

      <div id="quem-somos" className="optimize-paint">
        <About />
      </div>

      <Partners />
      
      <div id="servicos">
        <Services sectionRef={servicesSectionRef} trackRef={servicesTrackRef} />
      </div>
      
      <Regional />
      
      <div id="tecnologia" className="optimize-paint">
        <Process />
      </div>
      
      <FAQ />
      <Footer />
    </div>
  );
}