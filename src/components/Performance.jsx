import React from 'react';

export default function Performance() {
  return (
      <section className="w-full bg-transparent">
          {/* Padding top mantido para afastar o conteúdo do final do Hero */}
          <div className="container relative pt-16 md:pt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 px-6 md:px-4 items-start">
                  
                  {/* Item 1 */}
                  <div className="flex flex-col gap-4">
                      {/* Título com a cor #d6e2b2 */}
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#d6e2b2] tracking-wide leading-tight">
                        50 Anos de<br/>Inovação
                      </h3>
                      {/* Texto com a cor #d6e2b2 */}
                      <p className="text-sm text-[#d6e2b2] font-medium leading-relaxed">
                        Meio século promovendo o desenvolvimento científico e a sustentabilidade no setor florestal brasileiro.
                      </p>
                  </div>
                  
                  {/* Item 2 */}
                  {/* Borda ajustada para combinar com a cor do texto (20% de opacidade) */}
                  <div className="flex flex-col gap-4 md:border-l md:border-[#d6e2b2]/20 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#d6e2b2] tracking-wide leading-tight">
                        +30 Empresas<br/>Associadas
                      </h3>
                      <p className="text-sm text-[#d6e2b2] font-medium leading-relaxed">
                        Agregamos gigantes de celulose, siderurgia, painéis e novos negócios em um modelo cooperativo único.
                      </p>
                  </div>
                  
                  {/* Item 3 */}
                  <div className="flex flex-col gap-4 md:border-l md:border-[#d6e2b2]/20 md:pl-8">
                      <h3 className="text-2xl md:text-2xl font-bold font-heading uppercase text-[#d6e2b2] tracking-wide leading-tight">
                        Conexão<br/>Universidade
                      </h3>
                      <p className="text-sm text-[#d6e2b2] font-medium leading-relaxed">
                        A ponte estratégica entre a excelência acadêmica da UFV e as demandas reais do mercado florestal.
                      </p>
                  </div>
              </div>
          </div>
      </section>
  );
}