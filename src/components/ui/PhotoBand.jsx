import React, { useEffect, useRef, useState } from 'react';

// Faixa escura com uma foto bem desfocada ao fundo, véu verde e granulado
// fino por cima (inspirado no site de referência, nas cores da SIF).
// A foto se move um pouco mais devagar que a página (profundidade), só
// enquanto a faixa está na tela. Sem foto, vira o verde-escuro padrão.
// photo: um endereço ou uma lista (se uma foto falhar, tenta a próxima)
export default function PhotoBand({ photo, as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useRef(null);
  const list = (Array.isArray(photo) ? photo : [photo]).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const src = list[idx] || '';

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, visible = false;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty('--p', p.toFixed(3));
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [src]);

  return (
    <Tag ref={ref} className={`${src ? 'sif-photo-band' : 'sif-glow-dark'} text-white ${className}`} {...rest}>
      {src && (
        <div className="sif-photo-band__bg" aria-hidden="true">
          <img key={src} src={src} alt="" loading="lazy" decoding="async" onError={() => setIdx(i => i + 1)} />
        </div>
      )}
      {children}
    </Tag>
  );
}
