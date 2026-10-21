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
  const m = String(str ?? '').trim().match(/^([\d.]*\d(?:,\d+)?)(.*)$/);
  if (!m) return null;
  const s = m[1].replace(/\./g, '').replace(',', '.');
  const value = parseFloat(s);
  if (!isFinite(value)) return null;
  const decimals = (s.split('.')[1] || '').length;
  return { value, decimals, rest: m[2] || '' };
}

const fmt = (n, decimals) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function CountUp({ number, start }) {
  const parsed = parseNumber(number);
  const [shown, setShown] = useState(parsed ? fmt(0, parsed.decimals) + parsed.rest : number);

  useEffect(() => {
    if (!parsed) { setShown(number); return; }
    if (!start) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(fmt(parsed.value, parsed.decimals) + parsed.rest); return; }
    const dur = 1800;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // desacelera no fim
      setShown(fmt(parsed.value * eased, parsed.decimals) + parsed.rest);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, number]);

  return <>{shown}</>;
}

// Mosaico SEMPRE fechado (sem buraco), com posição explícita de cada card
// conforme a quantidade. 4 cards (modelo IBÁ):
//   [ 1 1 | 2 | 4 ]
//   [ 1 1 | 3 | 4 ]
// 3 cards: [1 1 | 2 2] / [1 1 | 3 3]   ·   2 cards: [1 1 | 2 2]   ·   1: largura toda.
// Do 5º em diante: linhas extras em que os cards dividem a largura igualmente.
const LAYOUTS = {
  1: ['md:col-span-4 md:row-span-2'],
  2: ['md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-2'],
  3: ['md:col-span-2 md:row-span-2', 'md:col-start-3 md:col-span-2 md:row-start-1', 'md:col-start-3 md:col-span-2 md:row-start-2'],
  4: ['md:col-span-2 md:row-span-2', 'md:col-start-3 md:row-start-1', 'md:col-start-3 md:row-start-2', 'md:col-start-4 md:row-start-1 md:row-span-2'],
};
const SIZE = { big: 'min-h-[300px]', small: 'min-h-[200px]' };
const EXTRA_COLS = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

function Card({ card, index, start, cls: posCls = '', big = false, tall = false }) {
  const content = (
    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
      <div className={`flex ${big || tall ? 'flex-col items-start' : 'flex-wrap items-end gap-x-3 gap-y-1'} leading-none`}>
        <span className={`font-bold tracking-tight ${big ? 'text-6xl md:text-8xl' : tall ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl'}`}>
          {card.prefix}<CountUp number={card.number} start={start} />
        </span>
        {card.unit && (
          <span className={`font-bold uppercase ${big || tall ? 'text-2xl md:text-4xl mt-2' : 'text-base md:text-xl pb-1'}`}>{card.unit}</span>
        )}
      </div>
      {card.label && <p className={`mt-3 font-medium text-white/90 ${big ? 'text-base md:text-xl max-w-md' : 'text-sm md:text-base'}`}>{card.label}</p>}
    </div>
  );

  const cls = `group relative overflow-hidden rounded-3xl bg-[#1B5E20] ${posCls} ${big || tall ? SIZE.big : SIZE.small}`;
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
    }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  if (!visible) return null;

  return (
    <section ref={ref} className="py-16 md:py-24 px-4">
      <div className="max-w-[1280px] mx-auto">
        {(config.tag || config.title || config.subtitle) && (
          <div className="mb-10 md:mb-14 max-w-3xl">
            {config.tag && <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-3 block">{config.tag}</span>}
            {config.title && <h2 className="sif-title text-3xl md:text-5xl text-[#1f2937] leading-tight">{config.title}</h2>}
            {config.subtitle && <p className="mt-4 text-gray-500 text-base md:text-lg leading-relaxed">{config.subtitle}</p>}
          </div>
        )}
        {(() => {
          const head = cards.slice(0, 4);
          const layout = LAYOUTS[head.length];
          // celular/tablet (2 colunas): o último card ocupa a linha toda se sobrar sozinho
          const oddSm = (n, i) => (n % 2 === 1 && i === n - 1 ? 'sm:col-span-2' : '');
          const rest = cards.slice(4);
          const rows = [];
          for (let i = 0; i < rest.length; i += 4) rows.push(rest.slice(i, i + 4));
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(220px,auto))] gap-4">
                {head.map((c, i) => (
                  <Card key={i} card={c} index={i} start={start}
                    cls={`${layout[i]} ${oddSm(head.length, i)}`}
                    big={i === 0} tall={head.length === 4 && i === 3} />
                ))}
              </div>
              {rows.map((row, r) => (
                <div key={r} className={`grid grid-cols-1 sm:grid-cols-2 ${EXTRA_COLS[row.length]} gap-4 mt-4`}>
                  {row.map((c, i) => <Card key={i} card={c} index={-1} start={start} cls={oddSm(row.length, i)} />)}
                </div>
              ))}
            </>
          );
        })()}
      </div>
    </section>
  );
}
