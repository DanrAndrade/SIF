import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

// Missão, Visão e Valores lado a lado (como no layout original), com ícone.
export default function MissionValues({ cfg }) {
  const valores = String(cfg.valores_text || '')
    .split(/[•·|;,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);

  const cols = [
    { icon: Target, title: cfg.missao_title, body: <p>{cfg.missao_text}</p> },
    { icon: Eye, title: cfg.visao_title, body: <p>{cfg.visao_text}</p> },
    {
      icon: Heart,
      title: cfg.valores_title,
      body: (
        <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          {valores.map((v, i) => (
            <li key={v + i} className="flex items-center gap-2">
              {v}
              {i < valores.length - 1 && <span aria-hidden="true" className="text-sif-green/40">·</span>}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <section className="sif-container px-4 sm:px-6 md:px-10 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cols.map((c) => (
          <article key={c.title}
            className="relative flex flex-col items-center text-center px-8 py-10">
            <c.icon size={44} strokeWidth={1.4} className="relative mb-6 text-sif-green" aria-hidden="true" />
            <h3 className="relative mb-4 text-sm font-bold uppercase tracking-[0.2em] text-sif-ink">{c.title}</h3>
            <div className="relative text-[15px] leading-relaxed text-gray-500 max-w-xs">{c.body}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
