import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';
import PhotoBand from '../ui/PhotoBand';

// Missão, Visão e Valores lado a lado, sobre faixa escura com foto de
// floresta desfocada (parallax leve), ícones em círculo e divisórias finas.
const BG = 'https://images.unsplash.com/photo-1509414556967-312906f278a0?q=80&w=1280&auto=format&fit=crop';

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
        <ul className="flex flex-wrap justify-center gap-2">
          {valores.map((v, i) => (
            <li key={v + i} className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[13px] text-white/85">{v}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="px-4 md:px-6 pb-16 md:pb-24">
      <PhotoBand photo={BG} className="max-w-[1400px] mx-auto rounded-panel py-14 md:py-20 shadow-[0_40px_80px_-40px_rgba(6,25,15,0.7)]">
        <div className="relative px-6 md:px-12">
          <div className="text-center mb-12 md:mb-14">
            <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime mb-4">{cfg.proposito_tag || 'Nosso propósito'}</span>
            <h2 className="sif-title text-3xl md:text-5xl text-white tracking-tight">
              {cfg.proposito_title_line1 || 'O que nos'} <span className="text-sif-lime">{cfg.proposito_title_line2 || 'move'}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-white/15 gap-10 md:gap-0">
            {cols.map((c) => (
              <article key={c.title} className="flex flex-col items-center text-center md:px-10">
                <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sif-lime/40 bg-sif-lime/10" aria-hidden="true">
                  <c.icon size={28} strokeWidth={1.5} className="text-sif-lime" />
                </span>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white">{c.title}</h3>
                <div className="text-[15px] leading-relaxed text-white/75 max-w-xs">{c.body}</div>
              </article>
            ))}
          </div>
        </div>
      </PhotoBand>
    </div>
  );
}
