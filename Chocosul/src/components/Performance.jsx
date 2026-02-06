import React from 'react';

export default function Performance() {
  return (
      <section className="w-full bg-transparent">
          {/* Padding top mantido para afastar o conteúdo do final do Hero */}
          <div className="container relative pt-16 md:pt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 px-6 md:px-4 items-start">
                  
                  {/* Item 1 */}
                  <div className="flex flex-col gap-4">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#1f2937] tracking-wide leading-tight">
                        Experiência<br/>Consolidada
                      </h3>
                      <p className="text-sm text-[#1f2937]/90 font-medium leading-relaxed">
                        Há mais de duas décadas liderando o mercado com eficiência tangível e resultados comprovados.
                      </p>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="flex flex-col gap-4 md:border-l md:border-black/10 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#1f2937] tracking-wide leading-tight">
                        Frota<br/>Própria
                      </h3>
                      <p className="text-sm text-[#1f2937]/90 font-medium leading-relaxed">
                        Infraestrutura robusta com mais de 120 veículos monitorados via satélite 24 horas.
                      </p>
                  </div>
                  
                  {/* Item 3 */}
                  <div className="flex flex-col gap-4 md:border-l md:border-black/10 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#1f2937] tracking-wide leading-tight">
                        Capilaridade<br/>Extrema
                      </h3>
                      <p className="text-sm text-[#1f2937]/90 font-medium leading-relaxed">
                        Atendimento direto a mais de 4.000 pontos de venda em todo o extremo sul do estado.
                      </p>
                  </div>
              </div>
          </div>
      </section>
  );
}