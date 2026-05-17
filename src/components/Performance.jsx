import React from 'react';

const DEFAULT_ITEMS = [
  { title: 'Missão', text: 'Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.' },
  { title: 'Visão',  text: 'Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.' },
  { title: 'Valores',text: 'Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo' },
];

export default function Performance({ config = {} }) {
  const items = Array.isArray(config.items) && config.items.length > 0 ? config.items : DEFAULT_ITEMS;

  return (
      <section className="w-full bg-transparent">
          <div className="container relative pt-16 md:pt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 px-6 md:px-4 items-start">
                  {items.map((item, idx) => (
                      <div key={idx} className={`flex flex-col gap-4 ${idx > 0 ? 'md:border-l md:border-white/20 md:pl-8' : ''}`}>
                          <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-white tracking-wide leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white font-medium leading-relaxed">
                            {item.text}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );
}
