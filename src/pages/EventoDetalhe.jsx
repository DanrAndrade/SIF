import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import Button from '../components/ui/Button';
import { ChevronLeft, MapPin, FileText, Info, Users, Calendar, ArrowRight } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';

export default function EventoDetalhe() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/eventos.php?slug=${slug}`);
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      console.error("Erro ao carregar evento:", err);
    } finally {
      setLoading(false);
    }
  };

  // Parse extra_data — deve ficar ANTES de qualquer return condicional (regra dos Hooks)
  const extra = React.useMemo(() => {
    if (!event?.extra_data) return {};
    try { return JSON.parse(event.extra_data); } catch { return {}; }
  }, [event]);
  const sections = Array.isArray(extra.sections) && extra.sections.length > 0 ? extra.sections : null;
  const tabs = extra.tabs || [];
  const pdfs = [
    extra.pdf1_url && { url: extra.pdf1_url, title: extra.pdf1_title || 'PDF 1' },
    extra.pdf2_url && { url: extra.pdf2_url, title: extra.pdf2_title || 'PDF 2' },
    extra.pdf3_url && { url: extra.pdf3_url, title: extra.pdf3_title || 'PDF 3' },
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event || !event.title) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Evento não encontrado</h2>
        <Link to="/eventos">
          <Button variant="primary" className="rounded-xl font-bold tracking-tight">Voltar para Eventos</Button>
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
          {event.image_url && (
            <img 
              src={getImageUrl(event.image_url)} 
              className="w-full h-full object-cover opacity-50" 
              alt={event.title} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/20 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/eventos" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#7FBA00] mb-8 transition-colors group bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ChevronLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Voltar aos Eventos</span>
          </Link>
          
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#7FBA00] text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-emerald-900/20">
              {event.date || 'Data a confirmar'}
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              {event.title}
            </h1>
            
          </div>
        </div>
      </div>

      {/* SEÇÃO DE CONTEÚDO */}
      <section className="py-24 relative -mt-32 z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            
            {/* Detalhes do Evento */}
            <div className="w-full bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#007a3d]">
                   <Info size={20} />
                </div>
                Sobre o Evento
              </h3>
              
              <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#007a3d]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{event.date || 'Data a confirmar'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#007a3d]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{event.location || 'Local a definir'}</span>
                </div>
                {(event.time || extra.time) && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-[#007a3d]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{event.time || extra.time}</span>
                  </div>
                )}
              </div>

              <div 
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]"
                dangerouslySetInnerHTML={{ __html: event.description || 'Descrição não disponível.' }}
              />

              {sections ? (
                <div className="mt-16">
                  <ContentSectionsRenderer sections={sections} />
                </div>
              ) : (
                <>
                  {tabs.length > 0 && (
                    <div className="mt-16">
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#007a3d]"><Calendar size={20}/></div>
                        Programação
                      </h3>
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
                  )}
                  {pdfs.length > 0 && (
                    <div className="mt-16">
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#007a3d]"><FileText size={20}/></div>
                        Arquivos Anexos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {pdfs.map((pdf, idx) => (
                          <a key={idx} href={getImageUrl(pdf.url)} target="_blank" rel="noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#007a3d] hover:shadow-lg transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#007a3d] shadow-sm"><FileText size={18}/></div>
                            <span className="font-bold text-sm text-gray-700 group-hover:text-[#007a3d] truncate">{pdf.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {event.video_url && (
                <div className="mt-16 bg-gray-900 rounded-[32px] overflow-hidden aspect-video shadow-2xl relative group">
                  <iframe 
                    className="w-full h-full"
                    src={event.video_url.replace('watch?v=', 'embed/')} 
                    title="Vídeo Chamada do Evento"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* Sidebar de Ação */}
            <div className="w-full space-y-8">
               <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-tighter text-2xl">Gestão de Eventos</h4>
                  <p className="text-sm text-gray-500 mb-10">Deseja expor sua marca neste evento ou solicitar informações técnicas?</p>
                  
                  <a href={`https://wa.me/553138991185?text=Interesse no Evento: ${event.title}`} target="_blank" rel="noreferrer" className="inline-block">
                    <Button variant="primary" className="px-10 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20">
                      Entrar em Contato <ArrowRight size={18} />
                    </Button>
                  </a>
               </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
