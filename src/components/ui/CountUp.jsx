import React, { useEffect, useRef, useState } from 'react';

// Número que conta de 0 até o valor digitado no painel quando aparece na
// tela (e conta de novo se a pessoa voltar a rolar até ele).
// Entende prefixo e sufixo: "+15", "10,73 mil", "R$ 2.500", "98%".
// Texto sem número (ex.: "Brasil") aparece como está.
export function parseCount(str) {
  const m = String(str ?? '').trim().match(/^(\D*?)(\d[\d.]*(?:,\d+)?)(.*)$/s);
  if (!m) return null;
  const clean = m[2].replace(/\./g, '').replace(',', '.');
  const value = parseFloat(clean);
  if (!isFinite(value)) return null;
  const decimals = (clean.split('.')[1] || '').length;
  // mantém o separador de milhar se o original tinha (2.500)
  const thousands = /\d\.\d{3}/.test(m[2]);
  return { prefix: m[1], value, decimals, thousands, suffix: m[3] };
}

const format = (n, p) => n.toLocaleString('pt-BR', {
  minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals, useGrouping: p.thousands,
});

export default function CountUp({ value, duration = 1800, className = '' }) {
  const ref = useRef(null);
  const p = parseCount(value);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !p) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') { setN(p.value); return; }
    let raf = 0, running = false, done = false;
    const run = () => {
      running = true;
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / duration);
        setN(p.value * (1 - Math.pow(1 - k, 3))); // desacelera no fim
        if (k < 1) raf = requestAnimationFrame(tick); else { running = false; done = true; }
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running && !done) run();
      // saiu por baixo da tela (a pessoa subiu): zera para contar de novo
      else if (!e.isIntersecting && e.boundingClientRect.top >= window.innerHeight) {
        cancelAnimationFrame(raf); running = false; done = false; setN(0);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!p) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={String(value)}>
      <span aria-hidden="true">{p.prefix}{format(n, p)}{p.suffix}</span>
    </span>
  );
}
