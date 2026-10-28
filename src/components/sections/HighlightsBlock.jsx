import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getImageUrl, heroW } from '../../apiConfig';

// Bloco "Destaques com foto" (tipo 'highlights'): mesmo estilo do carrossel
// "Áreas de atuação" da página EMBRAPII. Painel verde-escuro com a foto do
// item da vez no fundo, texto à esquerda e os próximos itens em cards.
// Leve: a troca usa só opacidade e deslocamento (opacity/transform).
//
// Dados: sec.items = [{ title, text, image }]

const img = (p, w) => (p ? getImageUrl(p, w) : '');
const pad = (n) => String(n).padStart(2, '0');

export default function HighlightsBlock({ sec }) {
  const items = (sec.items || []).filter(i => i && String(i.title || '').trim());
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const boxRef = useRef(null);

  // Só troca sozinho quando o painel está na tela
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = useCallback((i) => setActive(((i % n) + n) % n), [n]);

  // Troca a cada 7 s (para com o mouse ou o dedo em cima, e com "menos movimento")
  useEffect(() => {
    if (n < 2 || paused || !inView || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => select(active + 1), 7000);
    return () => clearTimeout(t);
  }, [active, paused, inView, n, select]);

  if (!n) return null;
  const cur = Math.min(active, n - 1);
  const next = Array.from({ length: n - 1 }, (_, k) => (cur + 1 + k) % n);
  const label = sec.eyebrow || sec.title;

  return (
    <div ref={boxRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}
      className="relative rounded-panel overflow-hidden bg-sif-dark text-white shadow-[0_40px_80px_-40px_rgba(6,25,15,0.7)]">
      {/* Fundo: fotos empilhadas, só a da vez aparece (troca suave pela opacidade) */}
      {items.map((it, i) => (it.image ? (
        <img key={i} src={img(it.image, heroW(1600))} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === cur ? 'opacity-100' : 'opacity-0'}`} />
      ) : null))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06190f]/90 via-[#06190f]/65 to-[#06190f]/20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06190f]/80 to-transparent" aria-hidden="true" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:min-h-[clamp(480px,70vh,620px)] items-center">
        {/* Texto: todos os itens no mesmo lugar (altura = o maior), só o da vez aparece */}
        <div className="lg:col-span-5 min-w-0">
          {label && <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime">{label}</span>}
          <div className="grid mt-6">
            {items.map((it, i) => {
              const on = i === cur;
              return (
                <div key={i} aria-hidden={!on}
                  className={`[grid-area:1/1] transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-white/50 mb-3">{pad(i + 1)}</p>
                  <p className="sif-title text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight break-words" role={on ? 'heading' : undefined} aria-level={on ? 3 : undefined}>{it.title}</p>
                  {it.text && <p className="mt-6 max-w-md text-base md:text-[17px] leading-relaxed text-white/75 whitespace-pre-line">{it.text}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximos itens + navegação */}
        <div className="lg:col-span-7 min-w-0">
          {next.length > 0 && (
            // rolagem por fora; por dentro a fila encosta à direita só quando cabe
            // (com justify-end direto, o que sobra seria cortado à esquerda)
            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="flex gap-4 md:gap-5 w-max lg:ml-auto">
              {next.map((i, k) => (
                <button key={`${cur}-${i}`} type="button" onClick={() => select(i)} aria-label={`Ver ${items[i].title}`}
                  style={{ animationDelay: `${k * 110}ms` }}
                  className="sif-card-in group relative shrink-0 w-[150px] sm:w-[190px] lg:w-[clamp(170px,14vw,215px)] aspect-[2/3] rounded-card overflow-hidden text-left bg-[#0b3320] shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sif-lime">
                  {items[i].image && <img src={img(items[i].image, 480)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <span className="absolute inset-0 bg-gradient-to-t from-[#06190f]/90 via-[#06190f]/25 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <span className="block text-[11px] font-bold tracking-[0.2em] text-sif-lime">{pad(i + 1)}</span>
                    <span className="mt-1.5 block text-[15px] md:text-base font-semibold leading-snug line-clamp-3">{items[i].title}</span>
                  </span>
                </button>
              ))}
              </div>
            </div>
          )}
          {n > 1 && (
            <div className="mt-8 flex items-center gap-4 lg:pl-[8%]">
              <button type="button" onClick={() => select(cur - 1)} aria-label="Anterior" className="w-12 h-12 shrink-0 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-sif-dark transition-colors"><ArrowLeft size={18} /></button>
              <button type="button" onClick={() => select(cur + 1)} aria-label="Próximo" className="w-12 h-12 shrink-0 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-sif-dark transition-colors"><ArrowRight size={18} /></button>
              {/* barra de progresso: escala horizontal (transform), não largura */}
              <span className="relative flex-1 h-px bg-white/20 overflow-hidden" aria-hidden="true">
                <span className="absolute inset-0 bg-sif-lime origin-left transition-transform duration-700 ease-out" style={{ transform: `scaleX(${(cur + 1) / n})` }} />
              </span>
              <span className="shrink-0 sif-title text-2xl md:text-3xl tabular-nums">{pad(cur + 1)}<span className="text-base text-white/40"> / {pad(n)}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
