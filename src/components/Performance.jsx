import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_ITEMS = [
  { title: 'Missão', text: 'Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.' },
  { title: 'Visão',  text: 'Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.' },
  { title: 'Valores',text: 'Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo' },
];

const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]';

// Entrada rápida em sequência quando o bloco aparece. Só opacity/transform (leve).
function useInView() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    // Entra quando o bloco chega a 85% da tela; só "rearma" quando sai por
    // baixo (rolando para cima depois de passar, ele fica parado, sem piscar).
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShown(true);
      else if (e.boundingClientRect.top > (window.innerHeight || 0)) setShown(false);
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

// Missão, Visão e Valores lado a lado (sem ícones e sem efeito de mouse).
export default function Performance({ config = {} }) {
  const items = Array.isArray(config.items) && config.items.length > 0 ? config.items : DEFAULT_ITEMS;
  const [ref, shown] = useInView();

  return (
    <section className="w-full bg-transparent" data-no-reveal>
      <div className="container relative pt-16 md:pt-20">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 px-6 md:px-4 items-start">
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{ transitionDelay: shown ? `${idx * 90}ms` : '0ms' }}
              className={`relative pt-8 transition-[opacity,transform] duration-[650ms] ${EASE} ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {/* linha de topo: entra desenhando */}
              <span
                aria-hidden="true"
                style={{ transitionDelay: shown ? `${idx * 90 + 100}ms` : '0ms' }}
                className={`absolute top-0 inset-x-0 h-px bg-white/25 origin-left transition-transform duration-[800ms] ${EASE} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
              />
              <h3 className="mb-4 text-2xl font-semibold font-heading text-white tracking-wide leading-tight">{item.title}</h3>
              <p className="text-sm text-white/85 font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
