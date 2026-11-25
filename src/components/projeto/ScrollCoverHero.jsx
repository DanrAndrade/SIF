import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Topo do projeto com a foto de capa ligada à rolagem: a foto começa abaixo
// do título, sobe por trás dele, cresce até ocupar a tela toda e vira o topo
// padrão do site (película escura + canto arredondado). Cada linha de texto
// troca de cor no momento em que a foto passa por trás dela.
// Com "menos movimento" no sistema, vira o layout estático (título, foto abaixo).

const INK = [31, 41, 55];
const TONES = {
  crumb:   { from: [107, 114, 128], to: [214, 222, 217] },
  eyebrow: { from: [0, 122, 61],    to: [181, 224, 92] },
  title:   { from: INK,             to: [255, 255, 255] },
  lead:    { from: [75, 85, 99],    to: [236, 241, 238] },
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a, b, q) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * q)},${Math.round(a[1] + (b[1] - a[1]) * q)},${Math.round(a[2] + (b[2] - a[2]) * q)})`;

const TextBlock = React.forwardRef(function TextBlock({ title, eyebrow, lead, actions }, ref) {
  return (
    <div ref={ref} className="relative">
      <nav data-tone="crumb" aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-xs mb-8" style={{ color: mix(...Object.values(TONES.crumb), 0) }}>
        <Link to="/" className="hover:opacity-70">Início</Link>
        <ChevronRight size={12} />
        <Link to="/projetos" className="hover:opacity-70">Projetos</Link>
        <ChevronRight size={12} />
        <span className="truncate max-w-[60vw]">{title}</span>
      </nav>
      {eyebrow && <span data-tone="eyebrow" className="block text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: mix(...Object.values(TONES.eyebrow), 0) }}>{eyebrow}</span>}
      <h1 data-tone="title" className="sif-title sif-h1 max-w-4xl" style={{ color: mix(...Object.values(TONES.title), 0) }}>{title}</h1>
      {lead && <p data-tone="lead" className="mt-7 max-w-3xl text-xl md:text-2xl leading-snug font-light whitespace-pre-line" style={{ color: mix(...Object.values(TONES.lead), 0) }}>{lead}</p>}
      {actions && <div className="mt-9 flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
});

export default function ScrollCoverHero({ cover, title, eyebrow, lead, actions }) {
  const [reduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);
  const imgRef = useRef(null);
  const shadeRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current, stage = stageRef.current, text = textRef.current, photo = photoRef.current, shade = shadeRef.current;
    if (!wrap || !stage || !text || !photo) return;
    let raf = 0;
    let m = null;
    let cur = null;          // progresso desenhado (suavizado)
    let lastY = window.scrollY;
    let dir = 1;             // última direção da rolagem (1 desce, -1 sobe)
    let idleT = 0;
    let snapping = false;
    let snapT = 0;

    const measure = () => {
      const H = window.innerHeight;
      const W = window.innerWidth;
      const textTop = text.offsetTop;
      const lines = [...text.querySelectorAll('[data-tone]')].map(el => ({
        el, tone: TONES[el.dataset.tone],
        top: textTop + el.offsetTop, bottom: textTop + el.offsetTop + el.offsetHeight,
      }));
      const textBottom = textTop + text.offsetHeight;
      const inset = Math.max(W >= 768 ? 40 : 24, (W - 1280) / 2 + (W >= 768 ? 40 : 24));
      const startTop = Math.min(H - 190, textBottom + 36);
      // altura final = a do topo padrão do site (64vh), ou a do texto se for maior
      const endH = Math.min(H, Math.round(Math.max(H * 0.64, textBottom + 64)));
      const gap = H - endH;
      m = { H, W, lines, inset, startTop, gap, bottomGap: 28, travel: Math.round(H * 0.9), radius: W >= 768 ? 80 : 40 };
      wrap.style.height = `${H + m.travel}px`;
      wrap.style.marginBottom = `-${gap}px`;
      stage.style.height = `${H}px`;
    };

    const target = () => clamp01(-wrap.getBoundingClientRect().top / m.travel);

    const render = (p) => {
      const e = ease(p);
      const top = m.startTop * (1 - e);
      const side = m.inset * (1 - e);
      const bottom = m.bottomGap * (1 - e) + m.gap * e;
      const rad = 40 * (1 - e);
      photo.style.top = `${top}px`;
      photo.style.left = `${side}px`;
      photo.style.right = `${side}px`;
      photo.style.bottom = `${bottom}px`;
      photo.style.borderRadius = `${rad}px ${rad}px ${rad}px ${40 + (m.radius - 40) * e}px`;
      if (imgRef.current) imgRef.current.style.transform = `scale(${1.1 - 0.1 * e})`;
      if (shade) shade.style.opacity = String(clamp01((e - 0.25) / 0.6));
      // Menu (sem fundo): texto escuro sobre o fundo claro e branco quando a
      // foto chega nele; fica visível até o topo completar, depois sobe ao rolar
      const root = document.documentElement;
      const navH = 81;
      const stageTop = Math.min(0, wrap.getBoundingClientRect().top + m.travel);
      const photoBottom = stageTop + (m.H - bottom);
      const qNav = Math.min(clamp01((navH - top) / navH), clamp01((photoBottom - 24) / 80));
      root.style.setProperty('--sif-nav-fg', mix(INK, [255, 255, 255], qNav));
      root.dataset.navHold = p < 0.999 ? '1' : '0';
      m.lines.forEach(({ el, tone, top: t, bottom: b }) => {
        const q = clamp01((b - top) / Math.max(1, b - t));
        el.style.color = mix(tone.from, tone.to, q);
        el.style.textShadow = q > 0.4 ? '0 2px 18px rgba(0,0,0,.45)' : 'none';
      });
    };

    // Desenha acompanhando a rolagem com um leve atraso (movimento fluido, sem
    // saltos mesmo com a roda do mouse em passos grandes)
    const tick = () => {
      raf = 0;
      if (!m) return;
      const t = target();
      if (cur === null) cur = t;
      cur += (t - cur) * 0.2;
      if (Math.abs(t - cur) < 0.0008) cur = t;
      render(cur);
      if (cur !== t) raf = requestAnimationFrame(tick);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(tick); };

    // ÍMÃ: ao parar de rolar no meio da transição, completa para o lado em que a
    // pessoa ia (topo da página ou topo padrão pronto). Um passo pequeno além do
    // topo pronto também volta para ele. Rolar com a roda/toque cancela o ímã.
    const snapTo = (p) => {
      const base = window.scrollY + wrap.getBoundingClientRect().top;
      snapping = true;
      window.scrollTo({ top: Math.round(base + p * m.travel), behavior: 'smooth' });
      clearTimeout(snapT);
      snapT = setTimeout(() => { snapping = false; }, 900);
    };
    const settle = () => {
      if (!m || snapping) return;
      const s = -wrap.getBoundingClientRect().top; // quanto já rolou dentro do topo
      if (s <= 2) return;
      const p = s / m.travel;
      if (p < 1) {
        if (dir >= 0) snapTo(p > 0.08 ? 1 : 0);
        else snapTo(p < 0.92 ? 0 : 1);
      } else if (s < m.travel + m.H * 0.07 && dir >= 0 && s > m.travel + 2) {
        snapTo(1);
      }
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 1) { dir = y > lastY ? 1 : -1; lastY = y; }
      request();
      clearTimeout(idleT);
      idleT = setTimeout(settle, 140);
    };
    const cancelSnap = () => { snapping = false; clearTimeout(snapT); };
    const onResize = () => { measure(); cur = null; request(); };

    measure();
    cur = target();
    render(cur);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', cancelSnap, { passive: true });
    window.addEventListener('touchstart', cancelSnap, { passive: true });
    window.addEventListener('keydown', cancelSnap);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(text);
    if (document.fonts?.ready) document.fonts.ready.then(onResize).catch(() => {});
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', cancelSnap);
      window.removeEventListener('touchstart', cancelSnap);
      window.removeEventListener('keydown', cancelSnap);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(idleT);
      clearTimeout(snapT);
      document.documentElement.style.removeProperty('--sif-nav-fg');
      document.documentElement.dataset.navHold = '0';
    };
  }, [reduced, cover]);

  if (reduced) {
    return (
      <>
        <header className="sif-container pt-[calc(var(--sif-nav-h)+2.5rem)] md:pt-[calc(var(--sif-nav-h)+4rem)] pb-10 md:pb-14">
          <TextBlock title={title} eyebrow={eyebrow} lead={lead} actions={actions} />
        </header>
        <figure className="sif-container">
          <img src={cover} alt="" fetchpriority="high" decoding="async" className="w-full aspect-[16/9] md:aspect-[21/9] object-cover rounded-card md:rounded-panel shadow-card" />
        </figure>
      </>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <div ref={stageRef} className="sticky top-0 overflow-hidden">
        <div ref={photoRef} className="absolute z-10 overflow-hidden bg-[#0b2116] shadow-card will-change-[top,left,right,bottom]">
          <img ref={imgRef} src={cover} alt="" fetchpriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover will-change-transform" />
          <div ref={shadeRef} className="absolute inset-0 opacity-0" aria-hidden="true">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,18,11,.7) 0%, rgba(5,18,11,.38) 45%, rgba(5,18,11,.12) 75%)' }} />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
        <div className="relative z-20 sif-container pt-[calc(var(--sif-nav-h)+2.5rem)] md:pt-[calc(var(--sif-nav-h)+4rem)]">
          <TextBlock ref={textRef} title={title} eyebrow={eyebrow} lead={lead} actions={actions} />
        </div>
      </div>
    </div>
  );
}
