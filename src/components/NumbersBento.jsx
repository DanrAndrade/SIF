import React, { useEffect, useRef, useState } from 'react';
import { getImageUrl } from '../apiConfig';
import SmartLink from './ui/SmartLink';

// Bloco de números em "bento grid" (modelo IBÁ): cards com foto de fundo e
// número que conta até o valor final quando a seção aparece na tela.
// Tudo editável no painel (Home › Números). Layout dos 4 primeiros cards:
//   ┌─────────────┬──────┬──────┐
//   │             │  2   │      │
//   │      1      ├──────┤  4   │
//   │             │  3   │      │
//   └─────────────┴──────┴──────┘
// Cards além do 4º entram numa linha extra.

// "10,73" → { value: 10.73, decimals: 2 }   "713" → { value: 713, decimals: 0 }
function parseNumber(str) {
  const s = String(str ?? '').trim().replace(/\./g, '').replace(',', '.');
  const value = parseFloat(s);
  if (!isFinite(value)) return null;
  const decimals = (s.split('.')[1] || '').length;
  return { value, decimals };
}

const fmt = (n, decimals) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function CountUp({ number, start }) {
  const parsed = parseNumber(number);
  const [shown, setShown] = useState(parsed ? fmt(0, parsed.decimals) : number);

  useEffect(() => {
    if (!parsed) { setShown(number); return; }
    if (!start) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(fmt(parsed.value, parsed.decimals)); return; }
    const dur = 1800;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // desacelera no fim
      setShown(fmt(parsed.value * eased, parsed.decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, number]);

  return <>{shown}</>;
}

const POS = [
  'md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[460px]', // 1: grande
  'min-h-[200px]',                                               // 2
  'min-h-[200px]',                                               // 3
  'md:row-span-2 min-h-[260px] md:min-h-[460px]',               // 4: alto
];

function Card({ card, index, start }) {
  const big = index === 0;
  const tall = index === 3;
  const content = (
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
      <div className={`flex ${big || tall ? 'flex-col items-start' : 'items-end gap-3'} leading-none`}>
        <span className={`font-bold tracking-tight ${big ? 'text-6xl md:text-8xl' : tall ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'}`}>
          {card.prefix}<CountUp number={card.number} start={start} />
        </span>
        {card.unit && (
          <span className={`font-bold uppercase ${big || tall ? 'text-2xl md:text-4xl mt-2' : 'text-lg md:text-2xl pb-1'}`}>{card.unit}</span>
        )}
      </div>
      {card.label && <p className={`mt-3 font-medium text-white/90 ${big ? 'text-base md:text-xl max-w-md' : 'text-sm md:text-base'}`}>{card.label}</p>}
    </div>
  );

  const cls = `group relative overflow-hidden rounded-3xl bg-[#1B5E20] ${POS[index] || 'min-h-[220px]'}`;
  const bg = card.image ? (
    <img src={getImageUrl(card.image)} alt="" loading="lazy" decoding="async"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-[#007a3d] to-[#1B5E20]" />
  );
  const shade = <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />;

  return card.link ? (
    <SmartLink href={card.link} className={`${cls} block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7FBA00]`} aria-label={`${card.prefix || ''}${card.number} ${card.unit || ''} ${card.label || ''}`.trim()}>
      {bg}{shade}{content}
    </SmartLink>
  ) : (
    <div className={cls}>{bg}{shade}{content}</div>
  );
}

export default function NumbersBento({ config }) {
  const cards = (config?.cards || []).filter(c => c && String(c.number ?? '').trim() !== '');
  const ref = useRef(null);
  const [start, setStart] = useState(false);
  const visible = !!config?.enabled && cards.length > 0;

  // Liga o observador quando o bloco passa a existir (a config chega depois do 1º render)
  useEffect(() => {
    const el = ref.current;
    if (!visible || !el) return;
    // Navegador sem IntersectionObserver: mostra os números finais direto
    if (typeof IntersectionObserver === 'undefined') { setStart(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setStart(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  if (!visible) return null;

  return (
    <section ref={ref} className="py-16 md:py-24 px-4">
      <div className="max-w-[1280px] mx-auto">
        {(config.tag || config.title) && (
          <div className="mb-10 md:mb-14 max-w-3xl">
            {config.tag && <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-3 block">{config.tag}</span>}
            {config.title && <h2 className="sif-title text-3xl md:text-5xl text-[#1f2937] leading-tight">{config.title}</h2>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4">
          {cards.slice(0, 4).map((c, i) => <Card key={i} card={c} index={i} start={start} />)}
        </div>
        {cards.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {cards.slice(4).map((c, i) => <Card key={i + 4} card={c} index={-1} start={start} />)}
          </div>
        )}
      </div>
    </section>
  );
}
