import React from 'react';

export default function Performance() {
  return (
      <section className="w-full bg-transparent">
          {/* Padding top mantido para afastar o conteúdo do final do Hero */}
          <div className="container relative pt-16 md:pt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 px-6 md:px-4 items-start">
                  
                  {/* Item 1 - Missão */}
                  <div className="flex flex-col gap-4">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-white tracking-wide leading-tight">
                        Missão
                      </h3>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.
                      </p>
                  </div>
                  
                  {/* Item 2 - Visão */}
                  <div className="flex flex-col gap-4 md:border-l md:border-white/20 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-white tracking-wide leading-tight">
                        Visão
                      </h3>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.
                      </p>
                  </div>
                  
                  {/* Item 3 - Valores */}
                  <div className="flex flex-col gap-4 md:border-l md:border-white/20 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-white tracking-wide leading-tight">
                        Valores
                      </h3>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo
                      </p>
                  </div>
              </div>
          </div>
      </section>
  );
}
