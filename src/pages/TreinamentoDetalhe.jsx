import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Clock, MapPin, ChevronLeft, Play, FileText, Calendar, CheckCircle2, MessageSquare, Layers, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';

export default function TreinamentoDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTraining();
  }, [slug]);

  const fetchTraining = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/treinamentos.php?slug=${slug}`);
      const data = await res.json();
      setTraining(data);
    } catch (err) {
      console.error("Erro ao carregar treinamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const sections = React.useMemo(() => {
    if (!training?.extra_data) return null;
    try { const s = JSON.parse(training.extra_data).sections; return Array.isArray(s) && s.length > 0 ? s : null; } catch { return null; }
  }, [training]);

  const parsed = React.useMemo(() => {
    if (!training?.description) return null;
    try { return JSON.parse(training.description); } catch { return null; }
  }, [training]);

  const tabs = parsed?.tabs || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Treinamento não encontrado</h2>
        <Link to="/treinamentos">
          <Button variant="primary" className="rounded-xl">Voltar para Treinamentos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* HERO PREMIUM COM CONTRASTE */}
      <div className="relative h-[65vh] flex items-center pt-20 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(training.image_url)} 
            className="w-full h-full object-cover opacity-50" 
            alt={training.title} 
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/20 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/treinamentos" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#7FBA00] mb-8 transition-colors group bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ChevronLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Voltar aos Treinamentos</span>
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              {training.title}
            </h1>
            

          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="py-24 relative -mt-32 z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            
            {/* CONTEÚDO PRINCIPAL */}
            <div className="w-full bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#007a3d]">
                   <Award size={20} />
                </div>
                Conteúdo Programático
              </h3>
              
              <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Layers className="text-[#007a3d]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.segment || 'Capacitação Técnica'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#007a3d]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.hours || '8h'} - Carga Horária</span>
                </div>
              </div>
              
              {sections ? (
                <ContentSectionsRenderer sections={sections} />
              ) : !parsed ? (
                <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: training.description || 'Descrição não disponível.' }} />
              ) : (
                <div className="space-y-16">
                  {parsed.presentation && (
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-widest text-[#007a3d] mb-8 flex items-center gap-3"><Award size={24}/> Apresentação / Sobre o Curso</h4>
                      <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: parsed.presentation }} />
                    </div>
                  )}
                  {parsed.audience && (
                    <div className="pt-12 mt-12 border-t border-gray-100">
                      <h4 className="text-xl font-bold uppercase tracking-widest text-[#007a3d] mb-8 flex items-center gap-3"><CheckCircle2 size={24}/> Público-Alvo</h4>
                      <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: parsed.audience }} />
                    </div>
                  )}
                  {(tabs.length > 0 || parsed.modules_content) && (
                    <div className="pt-12 mt-12 border-t border-gray-100">
                      <h4 className="text-xl font-bold uppercase tracking-widest text-[#007a3d] mb-8 flex items-center gap-3"><Layers size={24}/> Módulos do Treinamento</h4>
                      {tabs.length > 0 ? (
                        <div className="mt-8">
                          <div className="flex flex-wrap gap-3 mb-8">
                            {tabs.map((tab, i) => (
                              <button key={i} onClick={() => setActiveTab(i)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === i ? 'bg-[#1f2937] text-white border-[#1f2937] shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-[#007a3d] hover:text-[#007a3d]'}`}>
                                {tab.title}
                              </button>
                            ))}
                          </div>
                          {tabs[activeTab] && (
                            <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100">
                              <h4 className="text-base font-bold uppercase tracking-tight text-[#007a3d] mb-6">{tabs[activeTab].title}</h4>
                              <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#1f2937] prose-headings:uppercase prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d] prose-img:rounded-2xl prose-img:shadow-lg"
                                dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: parsed.modules_content }} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {training.video_url && (
                <div className="mt-16 bg-gray-900 rounded-[32px] overflow-hidden aspect-video shadow-2xl relative group">
                  <iframe 
                    className="w-full h-full"
                    src={training.video_url.replace('watch?v=', 'embed/')} 
                    title="Apresentação do Curso"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* CARDS DE AÇÃO (MOVIDOS PARA BAIXO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Card Inscrição */}
              <div className="bg-[#007a3d] rounded-[40px] p-10 text-white shadow-2xl shadow-emerald-900/40 h-full">
                <h4 className="text-2xl font-bold mb-6 uppercase tracking-tight">Tenho Interesse</h4>
                <p className="text-emerald-100 mb-8 font-medium">Garanta sua vaga ou solicite uma proposta In-Company para sua empresa.</p>
                
                <div className="space-y-4 mb-10">
                   <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 text-emerald-300" />
                      <span className="text-xs font-bold uppercase tracking-wider">Certificado SIF incluso</span>
                   </div>
                   <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 text-emerald-300" />
                      <span className="text-xs font-bold uppercase tracking-wider">Material didático exclusivo</span>
                   </div>
                </div>

                <a href={`https://wa.me/553138991185?text=Olá, gostaria de mais informações sobre o treinamento: ${training.title}`} target="_blank" rel="noreferrer">
                  <Button className="w-full bg-white text-[#007a3d] hover:bg-emerald-50 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-lg">
                    <MessageSquare size={18} /> Quero me Inscrever
                  </Button>
                </a>

                {training.pdf_url && (
                  <a href={getImageUrl(training.pdf_url)} target="_blank" rel="noreferrer" className="block mt-6">
                    <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100 hover:text-white transition-colors py-2">
                       <FileText size={14} /> Clique Aqui e Saiba Mais
                    </button>
                  </a>
                )}
              </div>

              {/* Card CTA Secundário */}
              <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 h-full">
                 <h5 className="text-gray-900 font-bold mb-4 uppercase tracking-tight">Atendimento Direto</h5>
                 <p className="text-sm text-gray-500 mb-6">Dúvida sobre pré-requisitos ou turmas customizadas?</p>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefone / WhatsApp</p>
                    <p className="font-bold text-gray-800 tracking-tight">(31) 3899-1185</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
