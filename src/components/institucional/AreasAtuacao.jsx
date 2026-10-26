import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Sprout } from 'lucide-react';
import { getImageUrl } from '../../apiConfig';

// Fotos padrão por índice (o painel ainda não tem campo de imagem por área).
// Se um dia a área vier com `image`/`image_url`, ela tem prioridade.
const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758343660101-10ee4fa1ca68?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615671524990-c0e871c5f806?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1627278631921-874a70b5f973?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509414556967-312906f278a0?q=80&w=1400&auto=format&fit=crop',
];

const AUTOPLAY_MS = 7000;

const photoFor = (area, i) => {
  const own = area?.image || area?.image_url;
  if (own) return String(own).startsWith('http') ? own : getImageUrl(own, 1400);
  return FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length];
};

const pad = (n) => String(n).padStart(2, '0');

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
};

const NavButton = ({ dir, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="group/nav relative w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center text-sif-ink overflow-hidden transition-all duration-300 hover:border-sif-green hover:text-white hover:shadow-card-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sif-green focus-visible:ring-offset-2"
  >
    <span className="absolute inset-0 bg-sif-green scale-0 rounded-full transition-transform duration-300 ease-out group-hover/nav:scale-100" />
    {dir === 'left'
      ? <ArrowLeft size={22} strokeWidth={2.25} className="relative transition-transform duration-300 group-hover/nav:-translate-x-0.5" />
      : <ArrowRight size={22} strokeWidth={2.25} className="relative transition-transform duration-300 group-hover/nav:translate-x-0.5" />}
  </button>
);

export default function AreasAtuacao({ cfg, areas, iconMap = {} }) {
  const reduced = usePrefersReducedMotion();
  const total = areas.length;

  // ---- Desktop: painéis que se expandem ----
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const panelsRef = useRef(null);

  // ---- Celular: carrossel com arraste ----
  const trackRef = useRef(null);
  const [mActive, setMActive] = useState(0);

  const sectionRef = useRef(null);

  useEffect(() => { if (active >= total) setActive(0); }, [total, active]);

  // Só roda o autoplay quando a seção está visível
  useEffect(() => {
    const el = panelsRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((dir) => {
    setActive((a) => (a + dir + total) % total);
  }, [total]);

  // Entrada com GSAP (painéis sobem em cascata). O bloco tem data-no-reveal
  // para não somar com a animação automática global.
  useLayoutEffect(() => {
    if (reduced) return;
    // IntersectionObserver em vez de ScrollTrigger: a página carrega equipe e
    // textos do banco depois, o que deslocaria a posição calculada do gatilho.
    const root = sectionRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    let io;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-area-item]');
      if (!items.length) return;
      gsap.set(items, { y: 70, opacity: 0, clipPath: 'inset(18% 0% 0% 0% round 28px)' });
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        ctx.add(() => {
          gsap.to(items, {
            y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)',
            duration: 1.1, ease: 'power3.out', stagger: 0.09,
            clearProps: 'clipPath,transform,opacity',
          });
        });
      }, { rootMargin: '0px 0px -20% 0px' });
      io.observe(root);
    }, sectionRef);
    return () => { io?.disconnect(); ctx.revert(); };
  }, [reduced, total]);

  // Celular: descobre o card ativo pelo scroll
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const first = el.children[0];
    const step = el.children[1] ? el.children[1].offsetLeft - first.offsetLeft : first.offsetWidth;
    const idx = Math.round(el.scrollLeft / Math.max(1, step));
    setMActive(Math.min(total - 1, Math.max(0, idx)));
  };

  const mGo = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.min(total - 1, Math.max(0, mActive + dir));
    const card = el.children[next];
    if (card) el.scrollTo({ left: card.offsetLeft - el.children[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
  };

  const autoplayOn = !reduced && inView && !paused && total > 1;

  return (
    <div ref={sectionRef} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
      <style>{`
        @keyframes sifAreaProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-8">
        <div className="w-full max-w-2xl text-left">
          <span className="sif-eyebrow mb-4">{cfg.areas_tag}</span>
          <h2 className="sif-title sif-h2 text-sif-ink leading-[0.9] tracking-tighter">
            {cfg.areas_title_line1} <br /><span className="text-sif-green">{cfg.areas_title_highlight}</span>
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start lg:items-end w-full lg:w-auto">
          <p className="text-gray-500 font-medium text-base max-w-sm">{cfg.areas_subtitle}</p>
          {total > 1 && (
            <div className="hidden lg:flex items-center gap-4">
              <span className="font-heading text-sm font-bold tabular-nums text-sif-ink min-w-[64px] text-right">
                {pad(active + 1)} <span className="text-gray-300">/ {pad(total)}</span>
              </span>
              <NavButton dir="left" label="Área anterior" onClick={() => go(-1)} />
              <NavButton dir="right" label="Próxima área" onClick={() => go(1)} />
            </div>
          )}
        </div>
      </div>

      {/* ===== DESKTOP: painéis expansíveis ===== */}
      <div
        ref={panelsRef}
        data-no-reveal
        className="hidden lg:flex gap-3 xl:gap-4 h-[clamp(400px,62vh,540px)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {areas.map((area, i) => {
          const Icon = iconMap[area.icon] || Sprout;
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              data-area-item
              aria-expanded={isActive}
              aria-label={area.title}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group relative min-w-0 overflow-hidden rounded-card text-left bg-sif-dark shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sif-lime focus-visible:ring-offset-4"
              style={{
                flexGrow: isActive ? 5.5 : 1,
                flexBasis: 0,
                transition: reduced ? 'none' : 'flex-grow 900ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms',
              }}
            >
              {/* Foto */}
              <img
                src={photoFor(area, i)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: 'none', // sem zoom (só a troca de brilho)
                  filter: isActive ? 'saturate(1) brightness(0.85)' : 'saturate(0.6) brightness(0.7)',
                  transition: reduced ? 'none' : 'filter 700ms ease',
                }}
              />
              {/* Véus */}
              <div className="absolute inset-0 bg-gradient-to-t from-sif-dark via-sif-dark/80 to-sif-dark/35" />
              <div
                className="absolute inset-0 bg-sif-dark/55 transition-opacity duration-700"
                style={{ opacity: isActive ? 0 : 1 }}
              />
              {/* Granulado leve */}
              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
              />

              {/* Número grande */}
              <span
                className="absolute top-6 left-6 font-heading font-black leading-none text-white tabular-nums transition-all duration-700"
                style={{
                  fontSize: isActive ? '5.5rem' : '2rem',
                  opacity: isActive ? 0.22 : 0.85,
                  WebkitTextStroke: isActive ? '1.5px rgba(255,255,255,0.9)' : '0',
                  color: isActive ? 'transparent' : '#fff',
                }}
              >
                {pad(i + 1)}
              </span>

              {/* Estado recolhido: título vertical */}
              <div
                className="absolute inset-x-0 bottom-0 top-24 flex flex-col items-center justify-end pb-8 gap-5 transition-opacity duration-300"
                style={{ opacity: isActive ? 0 : 1, transitionDelay: isActive ? '0ms' : '350ms' }}
                aria-hidden={isActive}
              >
                <span
                  className="font-heading font-semibold text-white text-lg tracking-tight whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {area.title}
                </span>
                <span className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-sif-lime transition-all duration-300 group-hover:bg-white/10">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
              </div>

              {/* Estado aberto: conteúdo completo */}
              <div
                className="absolute inset-x-0 bottom-0 p-10 xl:p-12"
                aria-hidden={!isActive}
              >
                <div
                  className="max-w-[520px]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(28px)',
                    transition: reduced ? 'none' : `opacity 600ms ease ${isActive ? '380ms' : '0ms'}, transform 800ms cubic-bezier(0.22,1,0.36,1) ${isActive ? '380ms' : '0ms'}`,
                    visibility: isActive ? 'visible' : 'hidden',
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Icon size={26} strokeWidth={1.6} className="text-sif-lime" />
                    <span className="h-px w-10 bg-sif-lime/60" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sif-lime">
                      Área {pad(i + 1)}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-white text-3xl xl:text-4xl leading-[1.05] tracking-tight mb-5 w-[460px] max-w-full">
                    {area.title}
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed font-medium w-[480px] max-w-full">
                    {area.desc}
                  </p>
                </div>
              </div>

              {/* Barra de tempo do autoplay */}
              {isActive && total > 1 && !reduced && (
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10 overflow-hidden">
                  <div
                    key={`p-${active}`}
                    className="h-full bg-sif-lime origin-left"
                    style={{
                      animation: `sifAreaProgress ${AUTOPLAY_MS}ms linear forwards`,
                      animationPlayState: autoplayOn ? 'running' : 'paused',
                    }}
                    onAnimationEnd={() => go(1)}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Indicador de progresso (desktop) */}
      {total > 1 && (
        <div className="hidden lg:flex mt-8 gap-2" aria-hidden="true">
          {areas.map((a, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ flexGrow: i === active ? 5.5 : 1, flexBasis: 0, background: i === active ? '#007a3d' : '#e5e7eb' }}
            />
          ))}
        </div>
      )}

      {/* ===== CELULAR / TABLET: carrossel com arraste ===== */}
      <div className="lg:hidden" data-no-reveal>
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 pb-2"
          style={{ scrollPaddingLeft: '1rem' }}
        >
          {areas.map((area, i) => {
            const Icon = iconMap[area.icon] || Sprout;
            const isActive = i === mActive;
            return (
              <article
                key={i}
                data-area-item
                className="relative shrink-0 snap-start w-[84%] sm:w-[60%] md:w-[46%] min-h-[500px] rounded-card overflow-hidden bg-sif-dark shadow-card flex flex-col justify-end"
              >
                <img
                  src={photoFor(area, i)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
                  style={{ transform: isActive ? 'scale(1.04)' : 'scale(1.14)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sif-dark via-sif-dark/85 to-sif-dark/40" />
                <span
                  className="absolute top-5 left-6 font-heading font-black text-6xl leading-none tabular-nums"
                  style={{ color: 'transparent', WebkitTextStroke: '1.2px rgba(255,255,255,0.75)' }}
                >
                  {pad(i + 1)}
                </span>
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={22} strokeWidth={1.6} className="text-sif-lime" />
                    <span className="h-px w-8 bg-sif-lime/60" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-2xl leading-tight tracking-tight mb-3">
                    {area.title}
                  </h3>
                  <p className="text-white/80 text-[15px] leading-relaxed font-medium">{area.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        {total > 1 && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 flex gap-1.5" aria-hidden="true">
              {areas.map((a, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ flexGrow: i === mActive ? 4 : 1, flexBasis: 0, background: i <= mActive ? '#007a3d' : '#e5e7eb' }}
                />
              ))}
            </div>
            <span className="font-heading text-sm font-bold tabular-nums text-sif-ink">
              {pad(mActive + 1)} <span className="text-gray-300">/ {pad(total)}</span>
            </span>
            <div className="flex gap-2">
              <button type="button" aria-label="Área anterior" onClick={() => mGo(-1)} disabled={mActive === 0}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-sif-ink transition-all active:scale-95 disabled:opacity-35 hover:bg-sif-green hover:text-white hover:border-sif-green">
                <ArrowLeft size={18} strokeWidth={2.25} />
              </button>
              <button type="button" aria-label="Próxima área" onClick={() => mGo(1)} disabled={mActive === total - 1}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-sif-ink transition-all active:scale-95 disabled:opacity-35 hover:bg-sif-green hover:text-white hover:border-sif-green">
                <ArrowRight size={18} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
