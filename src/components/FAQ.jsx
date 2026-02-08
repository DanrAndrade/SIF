import React, { useState } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqData = [
    { 
      q: "Como me tornar um associado?", 
      a: "Para se tornar um associado, entre em contato com nossa equipe administrativa através do formulário de contato ou e-mail institucional para receber os detalhes sobre o processo de filiação." 
    },
    { 
      q: "O que é o SIF?", 
      a: "A Sociedade de Investigações Florestais (SIF) é uma instituição sem fins lucrativos que promove a integração entre universidades e empresas do setor florestal, fomentando pesquisa e inovação." 
    },
    { 
      q: "Onde o SIF está localizado?", 
      a: "Nossa sede está localizada no campus da Universidade Federal de Viçosa (UFV), em Viçosa - MG, polo de referência em Ciência Florestal no Brasil." 
    },
    { 
      q: "Quais são as principais áreas de atuação?", 
      a: "Atuamos em cinco pilares fundamentais: Silvicultura, Manejo de Recursos Florestais, Ambiência, Proteção Florestal e Tecnologia de Produtos Florestais." 
    }
  ];

  return (
      <section className="bg-transparent w-full py-20 px-6 md:px-12 lg:px-24 overflow-visible pb-24">
        <SectionHeader 
            tag="Tire suas Dúvidas" 
            title="Perguntas Frequentes" 
        />
        
        <div className="flex flex-col lg:flex-row gap-16 items-start mt-12">
            <div className="w-full lg:w-[40%] shrink-0">
                {/* GRADIENTE ALTERADO: De Vermelho para Verde SIF */}
                <div className="h-auto lg:aspect-[4/3] w-full bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-[32px] p-8 md:p-10 flex flex-col justify-between text-white relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 mb-8 lg:mb-0">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                            <Mail size={24} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase mb-2 leading-tight">Ainda tem<br/>Dúvidas?</h3>
                        <p className="text-white/80 text-sm font-medium">Nossa equipe técnica e comercial está pronta para atender você.</p>
                    </div>
                    
                    <Button href="/contato" variant="solidWhite" className="w-full relative z-10">Falar com Consultor</Button>
                </div>
            </div>

            <div className="w-full lg:w-[60%]">
                {faqData.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 mb-6 pb-6">
                        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleFaq(index)}>
                            {/* HOVER ALTERADO: De Vermelho para Verde SIF */}
                            <h4 className={`text-lg font-bold transition-colors uppercase section-heading ${openFaq === index ? 'text-[#2E7D32]' : 'text-[#1f2937] group-hover:text-[#2E7D32]'}`}>
                                {item.q}
                            </h4>
                            {/* CORES DO CHEVRON: Mantendo a lógica de Dark/Yellow quando aberto e cinza/verde no hover */}
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-[#1f2937] border-[#1f2937] text-[#FFC107] rotate-180' : 'border-gray-300 text-gray-400 group-hover:border-[#2E7D32] group-hover:text-[#2E7D32]'}`}>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-all duration-500 ${openFaq === index ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
  );
}