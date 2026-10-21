import React, { useEffect, useRef } from 'react';

// Liga a padronagem no fundo da página (ela rola junto com o conteúdo) e
// cria um destaque perto do mouse que deixa a padronagem mais evidente.
// O destaque é um círculo pequeno que só se MOVE (transform); a padronagem
// dentro dele é deslocada para ficar alinhada com a do fundo, mesmo rolando.
const R = 240; // raio do destaque (px)

export default function BackgroundPattern() {
  const spot = useRef(null);

  useEffect(() => {
    document.body.classList.add('sif-patterned');
    return () => document.body.classList.remove('sif-patterned');
  }, []);

  useEffect(() => {
    const el = spot.current;
    if (!el || !window.matchMedia?.('(hover: hover)').matches) return;
    let raf = 0, x = -999, y = -999;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`;
      el.style.backgroundPosition = `${-(x - R + window.scrollX)}px ${-(y - R + window.scrollY)}px`;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!el.classList.contains('is-on')) el.classList.add('is-on');
      queue();
    };
    const leave = () => el.classList.remove('is-on');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', queue);
      document.documentElement.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={spot} className="sif-bg-spot" style={{ width: R * 2, height: R * 2 }} aria-hidden="true" />;
}
