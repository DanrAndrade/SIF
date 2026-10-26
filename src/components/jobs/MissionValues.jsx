import React from 'react';

// Missão, Visão e Valores em formato editorial: título à esquerda e três
// linhas numeradas à direita, separadas por filetes finos. Os valores
// (texto separado por "•") viram uma lista de palavras.
export default function MissionValues({ cfg }) {
  const valores = String(cfg.valores_text || '')
    .split(/[•·|;,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);

  const rows = [
    { title: cfg.missao_title, body: <p className="text-lg md:text-xl leading-relaxed text-sif-ink/75">{cfg.missao_text}</p> },
    { title: cfg.visao_title, body: <p className="text-lg md:text-xl leading-relaxed text-sif-ink/75">{cfg.visao_text}</p> },
    {
     
      title: cfg.valores_title,
      body: (
        <ul className="flex flex-wrap gap-x-3 gap-y-2 text-lg md:text-xl text-sif-ink/75">
          {valores.map((v, i) => (
            <li key={v + i} className="flex items-center gap-3">
              {v}
              {i < valores.length - 1 && <span aria-hidden="true" className="text-sif-green/40">/</span>}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <section className="sif-container px-4 sm:px-6 md:px-10 py-16 md:py-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <header className="lg:col-span-4">
          <span className="sif-eyebrow mb-4">{cfg.proposito_tag || 'Nosso propósito'}</span>
          <h2 className="sif-title sif-h2 text-sif-ink tracking-tight">
            {cfg.proposito_title_line1 || 'O que nos'}{' '}
            <span className="text-sif-green">{cfg.proposito_title_line2 || 'move'}</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-gray-500">
            {cfg.proposito_text || 'Antes da vaga, a causa. É isso que une quem trabalha na SIF e nas empresas associadas.'}
          </p>
        </header>

        <ul className="lg:col-span-8 bg-white shadow-card divide-y divide-sif-ink/10">
          {rows.map((r) => (
            <li key={r.title} className="grid grid-cols-1 gap-2 px-7 py-8 sm:grid-cols-[170px_1fr] sm:gap-8 md:px-10 md:py-10 transition-colors duration-500 ease-out hover:bg-[#f2f7f3]">
              <h3 className="font-heading text-2xl md:text-[28px] font-medium leading-tight text-sif-ink">{r.title}</h3>
              <div className="sm:pt-1">{r.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
