import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Sprout, Briefcase, FileText, Microscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ProdutosServicos() {
  const [activeTab, setActiveTab] = useState('comercial');

  const tabs = [
    { id: 'comercial', name: 'Comercial', icon: Sprout },
    { id: 'germinar', name: 'Programa Germinar', icon: Briefcase },
    { id: 'boletim', name: 'Boletim Técnico', icon: FileText },
    { id: 'pd', name: 'Serviços de P&D', icon: Microscope },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Inovação & Mercado</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Produtos <br/>
              <span className="text-[#059669]">& Serviços</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.
          </p>
        </div>
      </div>

      <main className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex flex-wrap gap-4 mb-20 border-b border-gray-100 pb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1f2937] text-white shadow-xl'
                    : 'bg-white text-gray-400 hover:text-[#059669] border border-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* CONTEÚDO DAS ABAS */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {activeTab === 'comercial' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Setor <span className="text-[#059669]">Comercial</span></h2>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">Oferecemos sementes de alta qualidade genética e a tecnologia Ellepot para otimização do seu viveiro, além de oportunidades exclusivas de patrocínio nos maiores eventos do setor.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: 'Sementes', desc: 'Melhoramento genético e alta taxa de germinação.' },
                      { title: 'Ellepot', desc: 'Sistemas de propagação biodegradáveis e eficientes.' },
                      { title: 'Patrocínios', desc: 'Visibilidade para sua marca em eventos técnicos.' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all group">
                        <CheckCircle2 size={24} className="text-[#059669] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-[#1f2937] uppercase text-sm mb-2">{item.title}</h4>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Button href="/contato" variant="primary" className="px-12 py-5 text-xs">Fale com o Comercial</Button>
                </div>
                <div className="rounded-[60px] overflow-hidden shadow-2xl relative aspect-[4/3]">
                  <img src="https://images.unsplash.com/photo-1599403816733-149d682054ea?q=80&w=2670" alt="Viveiro" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937]/40 to-transparent"></div>
                </div>
              </div>
            )}

            {activeTab === 'germinar' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 rounded-[60px] overflow-hidden shadow-2xl relative aspect-[4/3]">
                  <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2670" alt="Equipe" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#059669]/40 to-transparent"></div>
                </div>
                <div className="order-1 lg:order-2 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Programa <span className="text-[#059669]">Germinar</span></h2>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">O elo entre novos talentos e as gigantes do setor florestal. O Germinar capacita estagiários por meio de vivência prática em projetos de P&D.</p>
                  
                  <ul className="space-y-4 pt-4">
                    {['Seleção estratégica de estagiários', 'Acompanhamento técnico acadêmico', 'Desenvolvimento de competências práticas', 'Oportunidades de efetivação'].map((item) => (
                      <li key={item} className="flex items-center gap-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center"><ArrowRight size={14} className="text-[#059669]" /></div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-4 pt-6">
                    <Button href="/trabalhe-conosco" variant="primary" className="px-10 py-5 text-xs underline underline-offset-8">Ver Vagas Germinar</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'boletim' && (
              <div className="max-w-4xl mx-auto text-center space-y-12 py-12">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#059669] mb-8 shadow-inner">
                  <FileText size={48} />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Boletim <span className="text-[#059669]">Informativo SIF</span></h2>
                <p className="text-gray-500 text-xl leading-relaxed font-medium">Transmissão de conhecimento técnico e atualizações sobre o estado da arte na ciência florestal aplicada.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
                  {[ 
                    { year: '2024', issues: '04 Edições', color: 'bg-emerald-50' },
                    { year: '2023', issues: '12 Edições', color: 'bg-gray-50' },
                    { year: '2022', issues: '12 Edições', color: 'bg-gray-50' }
                  ].map((item) => (
                    <div key={item.year} className={`${item.color} p-10 rounded-[40px] border border-gray-100/50 hover:scale-105 transition-all shadow-sm`}>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{item.issues}</span>
                      <h4 className="text-3xl font-bold text-[#1f2937] font-heading">{item.year}</h4>
                      <Button variant="outline" className="mt-8 w-full border-gray-200 text-[10px] py-4">Acessar Arquivo</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pd' && (
              <div className="bg-[#1f2937] rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-[#059669] rounded-full blur-[140px] opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                 
                 <div className="max-w-3xl relative z-10">
                    <span className="text-[#059669] font-black uppercase text-[10px] tracking-[.3em] mb-6 block">Soluções Customizadas</span>
                    <h2 className="text-5xl md:text-7xl font-bold font-heading uppercase mb-8 leading-[0.9]">Pesquisa e <br/><span className="text-[#059669]">Desenvolvimento</span></h2>
                    <p className="text-gray-400 text-xl leading-relaxed font-medium mb-12">Ofertamos excelência técnica em consultoria, estudos de viabilidade e desenvolvimento de novas tecnologias para toda a cadeia produtiva.</p>
                    
                    <div className="flex flex-wrap gap-8">
                       <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-white line-clamp-1">+350</span>
                          <span className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">Projetos Entregues</span>
                       </div>
                       <div className="w-[1px] h-16 bg-white/10 hidden sm:block"></div>
                       <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-white line-clamp-1">+50</span>
                          <span className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">Doutores Envolvidos</span>
                       </div>
                    </div>

                    <Button href="/contato" className="mt-16 bg-[#059669] hover:bg-[#047857] border-0 text-white px-12 py-6">Solicitar Proposta Técnica</Button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
