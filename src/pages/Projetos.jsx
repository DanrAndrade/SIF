import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { BarChart3, Globe, Cpu, Lightbulb, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Projetos() {
  const categories = [
    { title: 'Forest Insight', icon: Search, desc: 'Nossa inteligência de mercado e monitoramento de tendências globais.' },
    { title: 'P&D Aplicado', icon: Microscope, desc: 'Projetos customizados para demandas específicas das associadas.' },
    { title: 'Inovação Aberta', icon: Lightbulb, desc: 'Conexão com startups e ecossistemas de tecnologia florestal.' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">P&D+I Estratégico</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Nossos <br/>
              <span className="text-[#059669]">Projetos</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Transformando desafios em soluções aplicadas através do Forest Insight e pesquisas de vanguarda.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        {/* FOREST INSIGHT SECTION */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
             <div className="bg-[#1f2937] rounded-[80px] p-12 md:p-24 text-white flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                <div className="lg:w-1/2 space-y-8">
                  <div className="w-16 h-16 bg-[#059669] rounded-2xl flex items-center justify-center shadow-lg"><Search size={32} /></div>
                  <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tighter">Forest <br/><span className="text-[#059669]">Insight</span></h2>
                  <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic">"A inteligência que antecipa o futuro da indústria florestal."</p>
                  <p className="text-gray-300 font-medium leading-relaxed">O Forest Insight é o informativo estratégico do SIF, consolidando dados de mercado, avanços tecnológicos e análises críticas para embasar a tomada de decisão das nossas associadas.</p>
                  <Button variant="primary" className="mt-6 border-0 bg-[#059669]">Conhecer o Informativo</Button>
                </div>
                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                    <span className="block text-4xl font-bold text-[#059669] mb-2 font-heading">#01</span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">Radar de Mercado Geral</span>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 translate-y-8">
                    <span className="block text-4xl font-bold text-white mb-2 font-heading">24/7</span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-tight">Monitoramento Global</span>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* PROJETOS EM ANDAMENTO */}
        <section className="py-24 bg-[#f8f9fa]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Portfólio Ativo</span>
              <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">Projetos em <span className="text-[#059669]">Andamento</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Monitoramento Remoto de Pragas', lab: 'LabProteção', tag: 'Tecnologia' },
                { title: 'Melhoramento para Seca', lab: 'GTGenética', tag: 'Pesquisa' },
                { title: 'Otimização de Rotas Logísticas', lab: 'GTColheita', tag: 'Logística' },
                { title: 'Sensores de Solo em Tempo Real', lab: 'GTSolos', tag: 'P&D' },
                { title: 'Bioinsumos Florestais', lab: 'Inovação', tag: 'Sustentabilidade' },
                { title: 'Inteligência Artificial no Inventário', lab: 'GTInventário', tag: 'IA' },
              ].map((proj, i) => (
                <div key={i} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center gap-3 mb-6">
                     <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{proj.tag}</span>
                   </div>
                   <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-6 leading-tight group-hover:text-[#059669] transition-colors">{proj.title}</h3>
                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                     <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{proj.lab}</span>
                     <ArrowRight size={16} className="text-gray-200 group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
