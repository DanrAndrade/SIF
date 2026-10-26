import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import SmartLink from './SmartLink';
import { buttonClass } from './Button';

// Card de chamada escuro (verde da SIF) com um brilho desfocado que segue o
// mouse e cresce no hover. Usado em "Trabalhe Conosco" (Home) e "Quer
// tornar sua empresa parceira de um GT?" (Grupos Temáticos).
//
//   <GlowCta eyebrow="Trabalhe Conosco" title="Faça parte" highlight="da SIF"
//     text="..." btnLabel="Ver vagas" href="/trabalhe-conosco">{chips}</GlowCta>
export default function GlowCta({ eyebrow, title, highlight, text, btnLabel, href, children, className = '' }) {
  const ref = useRef(null);
  const raf = useRef(0);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${clientX - r.left}px`);
      el.style.setProperty('--my', `${clientY - r.top}px`);
    });
  };

  return (
    <SmartLink href={href} ref={ref} onPointerMove={onMove}
      className={`sif-cta-glow sif-glow-dark group block rounded-panel text-white p-8 sm:p-10 md:p-14 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7FBA00] ${className}`}>
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
        <div className="max-w-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1">
          {eyebrow && <span className="block mb-4 text-xs font-bold uppercase tracking-[0.25em] text-sif-lime">{eyebrow}</span>}
          <h3 className="sif-title text-3xl md:text-5xl leading-tight">
            {title}{highlight && <> <span className="text-sif-lime">{highlight}</span></>}
          </h3>
          {text && <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">{text}</p>}
          {children}
        </div>
        {btnLabel && (
          <span className={`shrink-0 w-fit ${buttonClass('light')}`}>
            {btnLabel}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        )}
      </div>
    </SmartLink>
  );
}
