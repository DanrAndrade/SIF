import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import VideoModal from './ui/VideoModal';
import iconLogo from '../assets/sif.svg';
import NoiseOverlay from './ui/NoiseOverlay';
import Button from './ui/Button';
import { getImageUrl } from '../apiConfig';

export default function HeroSection({ wrapperRef, bgRef, contentRef, config = {}, bgImage, gradient }) {
  const scrollToExplore = () => window.scrollTo({top: 800, behavior: 'smooth'});

  const tag         = config.tag         || 'Sustentabilidade & Inovação';
  const titleLine1  = config.title_line1 || 'Sociedade de';
  const titleLine2  = config.title_line2 || 'Investigações Florestais';
  const subtitle    = config.subtitle    || 'Há mais de 40 anos promovendo o desenvolvimento científico e tecnológico do setor florestal brasileiro. Conexão entre universidade e grandes empresas.';
  const cta1Label   = config.cta1_label  || 'Seja Associada';
  const cta1Link    = config.cta1_link   || '/contato';
  const cta2Label   = config.cta2_label  || 'Nossos Projetos';
  const cta2Link    = config.cta2_link   || '/projetos';
  const scrollLabel = config.scroll_label|| 'Conheça';
  // 3º botão (2ª etapa): "Trabalhe Conosco". Texto vazio no painel = sem botão.
  const gFrom = gradient?.from || '#007a3d';
  const gTo   = gradient?.to   || '#1B5E20';
  // Imagem vem só do admin (sem imagem de exemplo). Sem ela, fica o fundo verde do container.
  const resolvedBg  = bgImage ? (bgImage.startsWith('http') ? bgImage : getImageUrl(bgImage)) : '';
  // Vídeo de fundo (mudo, em loop) + botão discreto para o vídeo completo
  const loopSrc   = config.video_loop ? getImageUrl(config.video_loop) : '';
  const fullUrl   = config.video_full_url || '';
  const fullLabel = config.video_full_label || 'Assistir vídeo completo';
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="relative z-20 gpu-layer" ref={wrapperRef}> 
        <div className="absolute bottom-0 left-0 right-0 h-[200px] -z-20 overflow-hidden pointer-events-none">
            {/* Mantido o gradiente de base verde suave, pode ser útil para transição, mas o NoiseOverlay ajuda */}
            <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 50% 100%, ${gFrom} 0%, ${gTo} 100%)` }}></div>
            <NoiseOverlay opacity={0.4} />
        </div>

        <div ref={bgRef} className="absolute top-16 left-0 right-0 h-full bg-transparent rounded-bl-[40px] md:rounded-bl-[80px] z-0 will-change-transform"></div>

        <section className="relative z-10 min-h-[95vh] flex items-center bg-cover bg-center bg-no-repeat rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] gpu-layer"
            style={resolvedBg ? { backgroundImage: `url('${resolvedBg}')` } : undefined}>
            
            {loopSrc && <HeroVideo src={loopSrc} poster={resolvedBg} />}

            {/* --- CORREÇÃO AQUI: OVERLAYS ESCUROS (FUMÊ) --- */}
            {/* Gradiente lateral escuro (preto/cinza escuro) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/60 via-40% to-transparent opacity-95"></div>
            {/* Gradiente inferior escuro */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            {fullUrl && (
              <button type="button" onClick={() => setShowFull(true)}
                className="absolute z-20 bottom-6 right-6 md:bottom-10 md:right-10 inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white/90 text-[11px] font-semibold tracking-wide transition-colors">
                <span className="w-7 h-7 rounded-full bg-white/90 text-[#0b3320] flex items-center justify-center"><Play size={13} className="ml-0.5" fill="currentColor" /></span>
                {fullLabel}
              </button>
            )}

            <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-12 items-center gap-12 pt-0 will-change-transform">
                <div className="md:col-span-7 flex flex-col items-start space-y-7 py-12">
                    <div className="inline-flex items-center px-3 py-1 border border-[#7FBA00]/40 rounded-full bg-[#7FBA00]/10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7FBA00]">{tag}</span>
                    </div>

                    <h1 className="sif-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-white">
                        {titleLine1} <br/>
                        <span className="text-[#cce399]">{titleLine2}</span>
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-lg leading-relaxed font-medium">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                        <Button href={cta1Link} variant="primary" className="w-full sm:w-auto">
                            {cta1Label}
                        </Button>
                        <Button href={cta2Link} variant="glass" className="w-full sm:w-auto">
                            {cta2Label}
                        </Button>
                    </div>
                </div>

                <div className="hidden md:flex md:col-span-5 relative items-center justify-center h-[500px]">
                   <div className="absolute top-1/2 left-1/2 w-[480px] h-[480px] border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform" style={{ animation: 'subtle-pulse 8s ease-in-out infinite' }}></div>
                   
                   <div className="relative z-10 w-64 h-64 flex items-center justify-center will-change-transform">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 bg-[#051a08]/30 backdrop-blur-sm"></div>
                        <img src={iconLogo} alt="Logo SIF" className="relative z-20 w-[130%] h-[130%] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)]" />
                   </div>
                </div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-100 animate-bounce cursor-pointer z-20" onClick={scrollToExplore}>
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white">{scrollLabel}</span>
                <ChevronDown className="text-white w-6 h-6" />
            </div>
        </section>
        {showFull && <VideoModal url={fullUrl} title={fullLabel} onClose={() => setShowFull(false)} />}
    </div>
  );
}

// Vídeo de fundo: mudo, em loop, sem controles. Não toca se o visitante pediu
// "menos movimento" ou "economia de dados"; pausa quando o topo sai da tela.
function HeroVideo({ src, poster }) {
  const ref = useRef(null);
  const [allowed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    return !reduce && !saveData;
  });

  useEffect(() => {
    const v = ref.current;
    if (!v || !allowed || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [allowed]);

  if (!allowed) return null;
  return (
    <video ref={ref} className="absolute inset-0 w-full h-full object-cover z-0" src={src} poster={poster || undefined}
      autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
  );
}
