import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import Button from '../components/ui/Button';
import EditablePageContact from '../components/EditablePageContact';
import { ChevronLeft, MapPin, FileText, Info, Users, Calendar, ArrowRight } from 'lucide-react';
import { API_BASE_URL, getImageUrl, cleanRichHtml, toVideoEmbed } from '../apiConfig';
import { useSeo } from '../hooks/useSeo';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import DetailHero from '../components/DetailHero';
import { CalendarDays } from 'lucide-react';

export default function EventoDetalhe() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  usePageTitle(event?.title); // título da aba do navegador / Google
  useSeo({ description: event?.description, image: event?.image_url ? getImageUrl(event.image_url) : undefined });
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
      <div className="min-h-screen sif-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event || !event.title) {
    return (
      <div className="min-h-screen sif-page flex flex-col items-center justify-center p-4">
        <h2 className="sif-title text-2xl text-gray-800 mb-4 tracking-tighter">Evento não encontrado</h2>
        <Button href="/eventos" variant="primary" className="rounded-xl font-bold tracking-tight">Voltar para Eventos</Button>
      </div>
    );
  }

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* TOPO (padrão das páginas de detalhe) */}
      <DetailHero
        cover={event.image_url ? getImageUrl(event.image_url) : ''}
        crumbs={[{ label: 'Eventos', to: '/eventos' }]}
        eyebrow="Evento" icon={CalendarDays}
        title={event.title}
        chips={[{ icon: Calendar, text: event.date || 'Data a confirmar' }, { icon: MapPin, text: event.location }]}
      />

      {/* SEÇÃO DE CONTEÚDO */}
      <section className="py-16 md:py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            
            {/* Detalhes do Evento */}
            <div className="w-full bg-white rounded-card md:rounded-panel p-5 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-medium text-gray-900 mb-12 tracking-tight flex items-center gap-4">
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
                dangerouslySetInnerHTML={{ __html: cleanRichHtml(event.description) || 'Descrição não disponível.' }}
              />

              {sections ? (
                <div className="mt-16">
                  <ContentSectionsRenderer sections={sections} />
                </div>
              ) : (
                <>
                  {tabs.length > 0 && (
                    <div className="mt-16">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight flex items-center gap-4">
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
                            dangerouslySetInnerHTML={{ __html: cleanRichHtml(tabs[activeTab].content) }} />
                        </div>
                      )}
                    </div>
                  )}
                  {pdfs.length > 0 && (
                    <div className="mt-16">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight flex items-center gap-4">
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
                <div className="mt-16 bg-gray-900 rounded-card overflow-hidden aspect-video shadow-2xl relative group">
                  <iframe 
                    className="w-full h-full"
                    src={toVideoEmbed(event.video_url) || event.video_url} 
                    title="Vídeo Chamada do Evento"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* CONTATO RESPONSÁVEL — configurado em /admin/eventos */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="eventos" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
