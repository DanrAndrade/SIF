import React, { useEffect, useRef } from 'react';

// Padronagem fixa atrás de todas as páginas públicas + "lanterna" que deixa a
// padronagem mais evidente perto do mouse. Só desenha/atualiza via CSS
// (variáveis --mx/--my), um frame por vez — não pesa na rolagem.
export default function BackgroundPattern() {
  const spot = useRef(null);

  useEffect(() => {
    const el = spot.current;
    if (!el || !window.matchMedia?.('(hover: hover)').matches) return;
    let raf = 0, x = 0, y = 0;
    const paint = () => { raf = 0; el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`); };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!el.classList.contains('is-on')) el.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => el.classList.remove('is-on');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="sif-bg-pattern" aria-hidden="true" />
      <div ref={spot} className="sif-bg-spot" aria-hidden="true" />
    </>
  );
}
