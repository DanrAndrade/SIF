import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Menu "Nesta página" (pílula branca translúcida). Quando há itens escondidos
// nas pontas, mostra um esfumado e uma seta que rola o menu; o item ativo é
// trazido para a área visível. Rola com o dedo no celular.
// items: [{ id, title }]   activeClass / idleClass: cores do item ativo e dos demais
export default function PageNav({
  items,
  activeId,
  onSelect,
  activeClass = 'bg-sif-green text-white',
  idleClass = 'text-gray-600 hover:text-sif-green',
}) {
  const scrollRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges(prev => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [measure, items]);

  // Item ativo: rola só o menu (sem mexer na rolagem da página)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !activeId) return;
    const btn = el.querySelector(`[data-nav-id="${String(activeId).replace(/"/g, '\\"')}"]`);
    if (!btn) return;
    const margin = 44; // espaço das setas
    const left = btn.offsetLeft - margin;
    const right = btn.offsetLeft + btn.offsetWidth + margin;
    if (left < el.scrollLeft) el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    else if (right > el.scrollLeft + el.clientWidth) el.scrollTo({ left: right - el.clientWidth, behavior: 'smooth' });
  }, [activeId]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(120, el.clientWidth * 0.6), behavior: 'smooth' });
  };

  const arrow = 'absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-card transition-colors hover:text-sif-green';

  return (
    <div className="relative w-fit max-w-full rounded-full border border-gray-100 bg-white/85 shadow-card backdrop-blur-md">
      <nav ref={scrollRef} aria-label="Nesta página" className="no-scrollbar relative flex gap-1 overflow-x-auto rounded-full p-1.5">
        {items.map(n => (
          <button key={n.id} type="button" data-nav-id={n.id} onClick={() => onSelect(n.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeId === n.id ? activeClass : idleClass}`}>
            {n.title}
          </button>
        ))}
      </nav>

      {edges.left && (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-14 rounded-l-full bg-gradient-to-r from-white via-white/80 to-transparent" />
          <button type="button" aria-label="Ver itens anteriores" onClick={() => scrollBy(-1)} className={`${arrow} left-1.5`}>
            <ChevronLeft size={16} />
          </button>
        </>
      )}
      {edges.right && (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-14 rounded-r-full bg-gradient-to-l from-white via-white/80 to-transparent" />
          <button type="button" aria-label="Ver mais itens" onClick={() => scrollBy(1)} className={`${arrow} right-1.5`}>
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}
