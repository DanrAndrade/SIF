import React, { useState, useEffect } from 'react';
import { http } from '../utils/http';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import GlowCta from './ui/GlowCta';
import Button from './ui/Button';
import { API_BASE_URL } from '../apiConfig';

const DEFAULT_FAQ = [
  { question: 'Como me tornar um associado?', answer: 'Para se tornar um associado, entre em contato com nossa equipe administrativa através do formulário de contato ou e-mail institucional para receber os detalhes sobre o processo de filiação.' },
  { question: 'O que é o SIF?', answer: 'A Sociedade de Investigações Florestais (SIF) é uma instituição sem fins lucrativos que promove a integração entre universidades e empresas do setor florestal, fomentando pesquisa e inovação.' },
  { question: 'Onde o SIF está localizado?', answer: 'Nossa sede está localizada no campus da Universidade Federal de Viçosa (UFV), em Viçosa - MG, polo de referência em Ciência Florestal no Brasil.' },
  { question: 'Quais são as principais áreas de atuação?', answer: 'Atuamos em cinco pilares fundamentais: Silvicultura, Manejo de Recursos Florestais, Ambiência, Proteção Florestal e Tecnologia de Produtos Florestais.' },
];

const DEFAULT_SIDE = {
  title: 'Ainda tem<br/>Dúvidas?',
  subtitle: 'Nossa equipe técnica e comercial está pronta para atender você.',
  cta_label: 'Falar com Consultor',
  cta_link: '/contato',
};

export default function FAQ({ pageKey = 'home', sideConfig = {} }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [items, setItems] = useState(DEFAULT_FAQ);
  const side = { ...DEFAULT_SIDE, ...sideConfig };

  useEffect(() => {
    http.get(`${API_BASE_URL}/faqs.php?page_key=${pageKey}&active_only=1`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setItems(res.data);
      })
      .catch(() => { /* mantém DEFAULT_FAQ */ });
  }, [pageKey]);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
      <section id="faq" className="bg-transparent w-full py-20 px-6 md:px-12 lg:px-24 overflow-visible pb-24">
        <SectionHeader
            tag="Tire suas Dúvidas"
            title="Perguntas Frequentes"
        />

        <div className="flex flex-col lg:flex-row gap-16 items-start mt-12">
            <div className="w-full lg:w-[40%] shrink-0">
                {/* Mesmo card do Trabalhe Conosco (brilho que segue o mouse), na versão vertical */}
                <GlowCta stack className="lg:aspect-[4/3]"
                  title={<span dangerouslySetInnerHTML={{ __html: side.title }} />}
                  text={side.subtitle} btnLabel={side.cta_label} href={side.cta_link || '/contato'} />
            </div>

            <div className="w-full lg:w-[60%] space-y-3">
                {items.map((item, index) => (
                    <div key={item.id ?? index} className={`bg-white shadow-card transition-shadow duration-300 ${openFaq === index ? 'shadow-card-hover' : 'hover:shadow-card-hover'}`}>
                        <button type="button" aria-expanded={openFaq === index} className="w-full text-left flex justify-between items-center gap-4 cursor-pointer group px-6 py-5 md:px-7 md:py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#007a3d]/40" onClick={() => toggleFaq(index)}>
                            <h4 className={`text-lg font-semibold transition-colors ${openFaq === index ? 'text-[#007a3d]' : 'text-[#1f2937] group-hover:text-[#007a3d]'}`}>
                                {item.question}
                            </h4>
                            <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-sif-dark border-sif-dark text-[#7FBA00] rotate-180' : 'border-gray-300 text-gray-400 group-hover:border-[#007a3d] group-hover:text-[#007a3d]'}`}>
                                <ChevronDown size={16} />
                            </div>
                        </button>
                        <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden"><p className="px-6 md:px-7 pb-6 -mt-1 text-gray-500 text-sm leading-relaxed font-medium whitespace-pre-line">{item.answer}</p></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
  );
}
