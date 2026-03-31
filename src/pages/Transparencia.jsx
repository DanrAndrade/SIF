import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { ShieldCheck, FileText, ExternalLink, Scale, Landmark, Info } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Transparencia() {
  const [activeTab, setActiveTab] = useState('portal');

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Ética & Governança</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Portal da <br/>
              <span className="text-[#059669]">Transparência</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Acesso a convênios, editais e informações financeiras, garantindo a integridade institucional do SIF.
          </p>
        </div>
      </div>

      <main className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex flex-wrap gap-4 mb-16 border-b border-gray-100 pb-8">
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'portal'
                  ? 'bg-[#1f2937] text-white shadow-xl'
                  : 'bg-white text-gray-400 hover:text-[#059669] border border-gray-100'
              }`}
            >
              <Landmark size={18} />
              Portal Conveniar
            </button>
            <button
              onClick={() => setActiveTab('documentos')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'documentos'
                  ? 'bg-[#1f2937] text-white shadow-xl'
                  : 'bg-white text-gray-400 hover:text-[#059669] border border-gray-100'
              }`}
            >
              <FileText size={18} />
              Documentos & Editais
            </button>
          </div>

          {/* CONTEÚDO */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {activeTab === 'portal' && (
              <div className="bg-white rounded-[60px] p-12 md:p-24 border border-gray-50 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 text-[#059669]/10"><Landmark size={200} /></div>
                <div className="max-w-2xl relative z-10 space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tight leading-none text-balance">Gestão Transparente via <span className="text-[#059669]">Conveniar</span></h2>
                  <p className="text-gray-500 text-lg font-medium leading-relaxed">Através do portal Conveniar, disponibilizamos o acompanhamento em tempo real de projetos, convênios e a execução financeira da fundação.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {[
                      'Consulta de Projetos',
                      'Editais de Compras',
                      'Prestação de Contas',
                      'Relatórios Anuais'
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-[#059669]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1f2937]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Button 
                      href="https://sif.conveniar.com.br/portaltransparencia/#projetos" 
                      target="_blank" 
                      className="px-10 py-5 bg-[#1f2937] text-white flex items-center gap-3 border-0"
                    >
                      Acessar Portal Externo <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documentos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Estatuto Social', icon: Scale, date: 'Atualizado em 2023' },
                  { title: 'Regimento Interno', icon: FileText, date: 'Atualizado em 2022' },
                  { title: 'Manual de Compras', icon: Info, date: 'Vigente' },
                  { title: 'Código de Ética', icon: ShieldCheck, date: 'Vigente' },
                ].map((doc, i) => (
                  <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#059669] mb-8 group-hover:bg-[#059669] group-hover:text-white transition-all">
                       <doc.icon size={24} />
                     </div>
                     <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-2">{doc.title}</h3>
                     <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest block mb-10">{doc.date}</span>
                     <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1f2937] hover:text-[#059669] transition-colors">
                       Visualizar PDF <ExternalLink size={14} />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
