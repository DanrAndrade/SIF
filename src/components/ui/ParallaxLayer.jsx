import React, { useEffect, useRef } from 'react';

// Camada de fundo com profundidade (parallax) para os topos das páginas:
// ao rolar, a foto desce mais devagar que o conteúdo. Fica dentro de um pai
// com "overflow: hidden" e posição relativa/absoluta.
// Só calcula enquanto o topo está na tela; quem pediu "menos movimento" no
// sistema vê a foto parada.
export default function ParallaxLayer({ speed = 0.45, zoom = 0, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, visible = true;
    const paint = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const passed = Math.max(0, -r.top);              // quanto do topo já rolou
      const y = passed * speed;                         // desce mais devagar
      const s = 1 + Math.min(1, passed / (r.height || 1)) * zoom; // e aproxima
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(host);
    window.addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [speed, zoom]);

  // Começa acima do topo (top -50%) para não abrir um vão quando desce
  return (
    <div ref={ref} aria-hidden="true" className={`absolute left-0 right-0 bottom-0 -top-[50%] will-change-transform pointer-events-none ${className}`}>
      {children}
    </div>
  );
}
