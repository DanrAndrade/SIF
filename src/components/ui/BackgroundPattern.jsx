import React, { useEffect, useRef } from 'react';

// Padronagem fixa atrás das páginas públicas + "lanterna" que deixa a
// padronagem mais evidente perto do mouse.
// A lanterna é um círculo pequeno que só se MOVE (transform) — o navegador
// não redesenha a tela inteira a cada movimento do mouse.
const R = 240; // raio da lanterna (px)

export default function BackgroundPattern() {
  const spot = useRef(null);

  useEffect(() => {
    const el = spot.current;
    if (!el || !window.matchMedia?.('(hover: hover)').matches) return;
    let raf = 0, x = -999, y = -999;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`;
      // a padronagem do círculo acompanha a da página (fica alinhada)
      el.style.backgroundPosition = `${-(x - R)}px ${-(y - R)}px`;
    };
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
      <div ref={spot} className="sif-bg-spot" style={{ width: R * 2, height: R * 2 }} aria-hidden="true" />
    </>
  );
}
