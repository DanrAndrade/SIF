import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Gem, Sparkles } from 'lucide-react';

const DEFAULT_ITEMS = [
  { title: 'Missão', text: 'Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.' },
  { title: 'Visão',  text: 'Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.' },
  { title: 'Valores',text: 'Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo' },
];

// Ícone pelo título (o painel só tem título e texto); senão, pela posição.
const ICONS = [Target, Eye, Gem];
const iconFor = (title = '', idx) => {
  const t = title.toLowerCase();
  if (t.includes('miss')) return Target;
  if (t.includes('vis')) return Eye;
  if (t.includes('valor')) return Gem;
  return ICONS[idx] || Sparkles;
};

const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]';

// Entrada em sequência quando o bloco aparece na tela; ao sair da tela ele
// "rearma" e anima de novo na volta. Só opacity/transform (leve).
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
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.2) setShown(true);
      else if (!e.isIntersecting) setShown(false);
    }, { threshold: [0, 0.2] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

export default function Performance({ config = {} }) {
  const items = Array.isArray(config.items) && config.items.length > 0 ? config.items : DEFAULT_ITEMS;
  const [ref, shown] = useInView();

  return (
      <section className="w-full bg-transparent" data-no-reveal>
          <div className="container relative pt-16 md:pt-20">
              <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 px-6 md:px-4 items-start">
                  {items.map((item, idx) => {
                    const Icon = iconFor(item.title, idx);
                    const delay = { transitionDelay: shown ? `${idx * 140}ms` : '0ms' };
                    return (
                      <div
                        key={idx}
                        style={delay}
                        className={`group relative pt-8 transition-[opacity,transform] duration-[900ms] ${EASE} ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                      >
                          {/* linha de topo: entra desenhando; no hover ganha o realce lima */}
                          <span
                            aria-hidden="true"
                            style={{ transitionDelay: shown ? `${idx * 140 + 200}ms` : '0ms' }}
                            className={`absolute top-0 inset-x-0 h-px bg-white/25 origin-left transition-transform duration-[1100ms] ${EASE} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
                          />
                          <span
                            aria-hidden="true"
                            className={`absolute -top-px inset-x-0 h-[3px] rounded-full bg-sif-lime origin-left scale-x-0 transition-transform duration-500 ${EASE} group-hover:scale-x-100`}
                          />

                          <div className="flex items-center gap-4 mb-4">
                              <span className={`relative w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ring-1 ring-white/20 bg-white/10 transition-transform duration-500 ${EASE} group-hover:-translate-y-1`}>
                                  <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-sif-lime opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                  <Icon size={22} strokeWidth={1.75} className="relative text-sif-lime transition-colors duration-500 group-hover:text-sif-dark" />
                              </span>
                              <h3 className={`text-2xl font-semibold font-heading text-white tracking-wide leading-tight transition-transform duration-500 ${EASE} group-hover:translate-x-1`}>
                                {item.title}
                              </h3>
                          </div>
                          <p className="text-sm text-white/85 font-medium leading-relaxed transition-opacity duration-500 group-hover:opacity-100">
                            {item.text}
                          </p>
                      </div>
                    );
                  })}
              </div>
          </div>
      </section>
  );
}
