import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import VideoModal from './ui/VideoModal';
import ParallaxLayer from './ui/ParallaxLayer';
import iconLogo from '../assets/sif.svg';
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
  const resolvedBg  = bgImage ? (getImageUrl(bgImage, 1920)) : '';
  // Fundo do topo: "image" ou "video" (escolhido no painel). Painéis antigos
  // sem a escolha: vídeo se houver vídeo cadastrado.
  // Vídeo do topo: UM arquivo enviado pelo painel (já otimizado no envio).
  // Toca mudo em loop no fundo; o botão "Assistir vídeo" abre o mesmo
  // arquivo com som. Sem player do YouTube.
  const loopFile  = config.video_loop || '';
  const bgMode    = config.bg_mode || (loopFile ? 'video' : 'image');
  const useVideo  = bgMode === 'video' && !!loopFile;
  // Fundo: trecho curto e leve (se houver); o completo só carrega no botão
  const loopSrc   = useVideo ? getImageUrl(config.video_loop_short || loopFile) : '';
  const poster    = config.video_poster ? getImageUrl(config.video_poster) : resolvedBg;
  const fullUrl   = useVideo ? loopFile : '';
  const fullLabel = config.video_full_label || 'Assistir vídeo';
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="relative z-20 gpu-layer" ref={wrapperRef}> 
        <div className="absolute bottom-0 left-0 right-0 h-[200px] -z-20 overflow-hidden pointer-events-none">
            
            <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 50% 100%, ${gFrom} 0%, ${gTo} 100%)` }}></div>
        </div>

        <div ref={bgRef} className="absolute top-16 left-0 right-0 h-full bg-transparent rounded-bl-[40px] md:rounded-bl-[80px] z-0 will-change-transform"></div>

        <section className="relative z-10 min-h-[95vh] flex items-center bg-cover bg-center bg-no-repeat rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] gpu-layer"
            >
            
            {/* Fundo (foto ou vídeo) com profundidade ao rolar */}
            {(resolvedBg || loopSrc) && (
              <ParallaxLayer speed={0.25} className="!-top-[25%] z-0">
                {resolvedBg && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${resolvedBg}')` }} />}
                {loopSrc && <HeroVideo src={loopSrc} poster={poster} />}
              </ParallaxLayer>
            )}

            {/* --- CORREÇÃO AQUI: OVERLAYS ESCUROS (FUMÊ) --- */}
            {/* Gradiente lateral escuro (preto/cinza escuro) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/60 via-40% to-transparent opacity-95"></div>
            {/* Gradiente inferior escuro */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>


            <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 md:grid-cols-12 items-center gap-12 pt-0 will-change-transform">
                <div className="md:col-span-7 flex flex-col items-start space-y-7 py-12">
                    <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime">{tag}</span>

                    <h1 className="sif-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight text-white">
                        {titleLine1} <br/>
                        <span className="text-[#cce399]">{titleLine2}</span>
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-lg leading-relaxed font-medium">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                        <Button href={cta1Link} variant="light" className="w-full sm:w-auto">
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
            
            {/* Botão central de baixo: com vídeo completo configurado vira "Assistir vídeo";
                sem vídeo, continua a seta para rolar a página. */}
            {fullUrl ? (
              <button type="button" onClick={() => setShowFull(true)}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-colors">
                <Play size={12} fill="currentColor" />
                {fullLabel}
              </button>
            ) : (
              <button type="button" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce cursor-pointer z-20" onClick={scrollToExplore}>
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white">{scrollLabel}</span>
                <ChevronDown className="text-white w-6 h-6" />
              </button>
            )}
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
    const bigScreen = window.matchMedia?.('(min-width: 768px)').matches;
    return !reduce && !saveData && bigScreen;
  });

  useEffect(() => {
    const v = ref.current;
    if (!v || !allowed || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [allowed]);

  // Sem vídeo (celular, menos movimento, economia de dados): fica a capa
  if (!allowed) return poster ? <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0" /> : null;
  return (
    <video ref={ref} className="absolute inset-0 w-full h-full object-cover z-0" src={src} poster={poster || undefined}
      autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
  );
}

