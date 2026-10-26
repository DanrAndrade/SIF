import { useEffect, useRef } from 'react';

// Parallax leve para a capa do vídeo do "Quem Somos".
// Cada camada recebe data-speed (ex.: -0.06 sobe, 0.05 desce) e só muda o
// "transform" enquanto o bloco está visível na tela (barato para o celular).
// Quem pediu "menos movimento" no sistema vê as fotos paradas.
export default function useParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const layers = [...host.querySelectorAll('[data-speed]')];
    if (!layers.length) return;

    let raf = 0, visible = false;
    const paint = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      // distância do centro do bloco até o centro da tela
      const d = r.top + r.height / 2 - window.innerHeight / 2;
      const MAX = window.innerWidth < 768 ? 24 : 48; // deslocamento máximo (px)
      layers.forEach((el) => {
        const y = Math.max(-MAX, Math.min(MAX, d * parseFloat(el.dataset.speed || 0)));
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); }, { rootMargin: '100px 0px' });
    io.observe(host);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
