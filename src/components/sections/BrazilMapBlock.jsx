import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cleanRichHtml } from '../../apiConfig';
import { viewBox as VIEWBOX, states as ALL_STATES } from './brazilStates';

// Bloco "Mapa do Brasil" (tipo 'brazil_map'): mapa em SVG puro com efeito de
// relevo (camadas de espessura + perspectiva). Os estados citados sobem em
// sequência, ganham um ponto pulsante e um balão flutuante com as cidades.
//
// Dados: sec = { title, eyebrow, content (HTML opcional), items: [{ uf: 'BA', text: 'Alagoinhas' }] }

const LIFT = 14; // altura (unidades do SVG) que os estados citados sobem
const BASE_W = 700; // largura de referência para os deslocamentos dos balões

// Deslocamento do balão em relação ao ponto do estado (px na largura de referência)
const OFFSETS = {
  MA: { dx: 60, dy: -66 },
  BA: { dx: 100, dy: -62 },
  MG: { dx: 105, dy: 34 },
  SP: { dx: 95, dy: 92 },
  MS: { dx: -160, dy: 14 },
  RS: { dx: -90, dy: 46 },
};
// Ajuste fino do ponto (fração da largura/altura do estado a partir do centro do bbox)
const CENTER_ADJ = { MA: [-0.05, 0], BA: [-0.1, 0.05], MG: [0.02, 0.02], SP: [-0.02, 0], RS: [0, 0.05], MS: [0, 0.05] };

const STYLE = `
.bmap-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:2rem;align-items:center}
.bmap-map{order:1}.bmap-text{order:2}
@media (min-width:1024px){.bmap-grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:3rem}.bmap-map{order:2}.bmap-text{order:1}}
.bmap-st{transition:transform .7s cubic-bezier(.2,.9,.25,1.15)}
.bmap-dot{transform-box:fill-box;transform-origin:center;opacity:0;transform:scale(.2);transition:opacity .4s,transform .5s cubic-bezier(.2,.9,.25,1.4)}
.bmap-dot.on{opacity:1;transform:scale(1)}
.bmap-ring{transform-box:fill-box;transform-origin:center;animation:bmap-pulse 2.2s ease-out infinite}
@keyframes bmap-pulse{0%{transform:scale(.6);opacity:.85}100%{transform:scale(3.2);opacity:0}}
.bmap-tip{transform:translate(-50%,-50%) translateY(10px) scale(.92);transition:opacity .45s,transform .5s cubic-bezier(.2,.9,.25,1.2),filter .25s}
.bmap-tip.on{transform:translate(-50%,-50%)}
@media (prefers-reduced-motion:reduce){.bmap-st,.bmap-dot,.bmap-tip{transition:none!important}.bmap-ring{animation:none!important;opacity:.35}}
`;

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function BrazilMapBlock({ sec, dark = false }) {
  const uid = useId().replace(/:/g, '');
  const wrapRef = useRef(null);
  const pathRefs = useRef({});
  const dotRefs = useRef({});
  const [centers, setCenters] = useState({}); // UF -> {x, y} em unidades do SVG
  const [pos, setPos] = useState({}); // UF -> {x, y} em px dentro do wrapper
  const [w, setW] = useState(BASE_W);
  const [up, setUp] = useState(false);
  const [hover, setHover] = useState(null);

  const items = useMemo(() => {
    const seen = new Set();
    return (sec?.items || [])
      .map(i => ({ uf: String(i?.uf || '').toUpperCase(), text: String(i?.text || '').trim() }))
      .filter(i => ALL_STATES.some(s => s.id === i.uf) && !seen.has(i.uf) && seen.add(i.uf));
  }, [sec?.items]);
  const cited = useMemo(() => new Set(items.map(i => i.uf)), [items]);
  const nameOf = (uf) => ALL_STATES.find(s => s.id === uf)?.name || uf;

  // centro do bbox de cada estado citado
  useLayoutEffect(() => {
    const next = {};
    items.forEach(({ uf }) => {
      const el = pathRefs.current[uf];
      if (!el?.getBBox) return;
      const b = el.getBBox();
      const [ax, ay] = CENTER_ADJ[uf] || [0, 0];
      next[uf] = { x: b.x + b.width * (0.5 + ax), y: b.y + b.height * (0.5 + ay) };
    });
    setCenters(next);
  }, [items]);

  // posição real (já com a perspectiva) dos pontos, para ancorar os balões em HTML
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const next = {};
      Object.entries(dotRefs.current).forEach(([uf, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        next[uf] = { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top };
      });
      setPos(next);
      setW(wr.width);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [centers]);

  // sobe quando entra na tela
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === 'undefined') { setUp(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setUp(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const compact = w < 520;
  const scale = Math.min(1, w / BASE_W);
  const head = dark ? 'text-white' : 'text-[#1f2937]';
  const proseText = dark ? 'prose-invert text-white/80' : 'text-gray-600';
  const anyHover = hover != null;
  const allD = useMemo(() => ALL_STATES.map(s => s.d), []);
  const hasText = sec?.content && String(sec.content).replace(/<[^>]*>/g, '').trim();

  return (
    <div className="bmap-grid">
      <style>{STYLE}</style>

      {/* Texto + lista (no celular fica embaixo do mapa) */}
      <div className="bmap-text min-w-0">
        {sec?.eyebrow && <span className="sif-eyebrow">{sec.eyebrow}</span>}
        {sec?.title && <h2 className={`sif-title sif-h2 ${head}`}>{sec.title}</h2>}
        {hasText && (
          <div className={`prose ${proseText} mt-4 max-w-none`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content) }} />
        )}
        {items.length > 0 && (
          <ul className="mt-6 space-y-2">
            {items.map(({ uf, text }) => (
              <li key={uf}
                onMouseEnter={() => setHover(uf)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(uf)} onBlur={() => setHover(null)} tabIndex={0}
                className={`flex items-start gap-3 rounded-xl px-3 py-2 border transition-colors cursor-default outline-none ${hover === uf ? 'bg-[#007a3d] border-[#007a3d] text-white' : dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-[#1f2937]'}`}>
                <span className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-8 h-6 rounded-md text-[11px] font-bold ${hover === uf ? 'bg-sif-lime text-[#0b3320]' : 'bg-[#007a3d] text-white'}`}>{uf}</span>
                <span className="min-w-0 text-sm leading-snug">
                  <strong className="block font-bold">{nameOf(uf)}</strong>
                  <span className={hover === uf ? 'text-white/90' : dark ? 'text-white/70' : 'text-gray-600'}>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div className="bmap-map min-w-0">
        <div ref={wrapRef} className="relative w-full select-none" role="img"
          aria-label={`Mapa do Brasil com ${items.map(i => `${nameOf(i.uf)}: ${i.text}`).join('; ')}`}>
          <div style={{ transform: 'perspective(1200px) rotateX(18deg)', transformOrigin: '50% 62%' }}>
            <svg viewBox="-10 -30 633 700" className="w-full h-auto block overflow-visible" aria-hidden="true">
              <defs>
                <g id={`all-${uid}`}>{allD.map((d, i) => <path key={i} d={d} />)}</g>
                <filter id={`blur-${uid}`} x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="9" /></filter>
              </defs>

              {/* sombra no chão */}
              <use href={`#all-${uid}`} fill="#0b3320" opacity=".28" transform="translate(6 30)" filter={`url(#blur-${uid})`} />

              {/* espessura do mapa */}
              {[9, 7, 5, 3, 1].map(dy => (
                <use key={dy} href={`#all-${uid}`} fill={dy > 4 ? '#8fa89a' : '#9cb3a6'} transform={`translate(0 ${dy})`} />
              ))}

              {/* estados não citados */}
              <g style={{ opacity: anyHover ? 0.7 : 1, transition: 'opacity .3s' }}>
                {ALL_STATES.filter(s => !cited.has(s.id)).map(s => (
                  <path key={s.id} d={s.d} fill="#dfe9e2" stroke="#fff" strokeWidth=".9" strokeLinejoin="round" />
                ))}
              </g>

              {/* estados citados (sobem um por um) */}
              {ALL_STATES.filter(s => cited.has(s.id)).map(s => {
                const idx = items.findIndex(i => i.uf === s.id);
                const delay = `${idx * 180}ms`;
                const on = hover === s.id;
                const dim = anyHover && !on;
                const extra = on ? 3 : 0;
                return (
                  <g key={s.id} style={{ opacity: dim ? 0.45 : 1, transition: 'opacity .3s', cursor: 'pointer' }}
                    onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
                    onClick={() => setHover(h => (h === s.id ? null : s.id))}>
                    {[0, 1, 2, 3].map(j => (
                      <path key={j} d={s.d} fill={j < 2 ? '#0b3320' : '#075c2e'} className="bmap-st"
                        style={{ transform: `translateY(${up ? -((LIFT + extra) * j) / 4 : 0}px)`, transitionDelay: delay }} />
                    ))}
                    <path ref={el => { pathRefs.current[s.id] = el; }} d={s.d} className="bmap-st"
                      fill={on ? '#0a9a4d' : '#007a3d'} stroke="#b5e05c" strokeWidth=".9" strokeLinejoin="round"
                      style={{ transform: `translateY(${up ? -(LIFT + extra) : 0}px)`, transitionDelay: delay }} />
                  </g>
                );
              })}

              {/* pontos pulsantes */}
              {items.map(({ uf }, idx) => {
                const c = centers[uf];
                if (!c) return null;
                const cy = c.y - LIFT - (hover === uf ? 3 : 0);
                return (
                  <g key={uf} style={{ pointerEvents: 'none', transition: 'opacity .3s', opacity: anyHover && hover !== uf ? 0.5 : 1 }}>
                    <g className={`bmap-dot ${up ? 'on' : ''}`} style={{ transitionDelay: `${idx * 180 + 450}ms` }}>
                      <circle className="bmap-ring" cx={c.x} cy={cy} r="5" fill="none" stroke="#b5e05c" strokeWidth="2" style={{ animationDelay: `${idx * 180 + 450}ms` }} />
                      <circle ref={el => { dotRefs.current[uf] = el; }} cx={c.x} cy={cy} r="4.5" fill="#b5e05c" stroke="#0b3320" strokeWidth="1.6" />
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* linhas + balões (HTML, sem a perspectiva, para ficarem legíveis) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden="true">
            {items.map(({ uf }) => {
              const p = pos[uf]; if (!p) return null;
              const o = OFFSETS[uf] || { dx: 100, dy: -60 };
              const half = compact ? 40 : 82;
              const bx = Math.min(Math.max(p.x + o.dx * scale, half), w - half), by = p.y + o.dy * scale;
              return <line key={uf} x1={p.x} y1={p.y} x2={bx} y2={by} stroke="#007a3d" strokeWidth="1.5" strokeDasharray="3 3"
                style={{ opacity: up ? (anyHover && hover !== uf ? 0.2 : 0.8) : 0, transition: 'opacity .4s' }} />;
            })}
          </svg>
          {items.map(({ uf, text }, idx) => {
            const p = pos[uf]; if (!p) return null;
            const o = OFFSETS[uf] || { dx: 100, dy: -60 };
            const half = compact ? 40 : 82;
            const bx = Math.min(Math.max(p.x + o.dx * scale, half), w - half);
            const by = p.y + o.dy * scale;
            const on = hover === uf;
            return (
              <div key={uf} className={`bmap-tip absolute ${up ? 'on' : ''}`}
                onMouseEnter={() => setHover(uf)} onMouseLeave={() => setHover(null)}
                style={{ left: bx, top: by, transitionDelay: up ? `${idx * 180 + 600}ms` : '0ms', zIndex: on ? 20 : 10,
                  opacity: up ? (anyHover && !on ? 0.35 : 1) : 0, filter: anyHover && !on ? 'grayscale(.4)' : 'none' }}>
                <div className={`rounded-xl bg-white shadow-[0_8px_24px_rgba(11,51,32,.22)] border ${on ? 'border-[#007a3d]' : 'border-[#007a3d]/20'} ${compact ? 'px-2 py-1' : 'px-3 py-2'}`}
                  style={{ width: 'max-content', maxWidth: compact ? 92 : 170, transform: on ? 'scale(1.06)' : 'none', transition: 'transform .25s' }}>
                  <div className={`font-extrabold text-[#0b3320] leading-tight flex items-center gap-1.5 ${compact ? 'text-[10px]' : 'text-[13px]'}`}>
                    <span className={`rounded bg-[#007a3d] text-white px-1 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{uf}</span>
                    {!compact && nameOf(uf)}
                  </div>
                  {!compact && text && <div className="text-[11.5px] leading-snug text-gray-600 mt-0.5">{text}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
