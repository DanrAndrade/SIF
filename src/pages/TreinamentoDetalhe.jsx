import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Clock, MapPin, ChevronLeft, Play, FileText, Calendar, CheckCircle2, MessageSquare, Layers, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl, cleanRichHtml, toVideoEmbed } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import { useSeo } from '../hooks/useSeo';
import EditablePageContact from '../components/EditablePageContact';
import DetailHero from '../components/DetailHero';
import { BookOpen } from 'lucide-react';

export default function TreinamentoDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  usePageTitle(training?.title); // título da aba do navegador / Google
  useSeo({ description: training?.description, image: training?.image_url ? getImageUrl(training.image_url) : undefined });
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
      <div className="min-h-screen sif-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen sif-page flex flex-col items-center justify-center p-4">
        <h2 className="sif-title text-2xl text-gray-800 mb-4 tracking-tighter">Treinamento não encontrado</h2>
        <Button href="/treinamentos" variant="primary" className="rounded-xl">Voltar para Treinamentos</Button>
      </div>
    );
  }

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* TOPO (padrão das páginas de detalhe) */}
      <DetailHero
        cover={training.image_url ? getImageUrl(training.image_url) : ''}
        crumbs={[{ label: 'Treinamentos', to: '/treinamentos' }]}
        eyebrow="Treinamento" icon={BookOpen}
        title={training.title}
        chips={[{ icon: Calendar, text: training.date }, { icon: MapPin, text: training.location }, { icon: Clock, text: training.hours ? `${training.hours}${/\d$/.test(String(training.hours)) ? 'h' : ''}` : '' }, { icon: Layers, text: training.segment }]}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <section className="py-24 relative -mt-20 z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">

            {/* CONTEÚDO PRINCIPAL */}
            <div className="w-full bg-white rounded-panel p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[600px]">
              <h3 className="text-3xl font-medium text-gray-900 mb-12 tracking-tight flex items-center gap-4">
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
                {training.hours && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-[#007a3d]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.hours} - Carga Horária</span>
                  </div>
                )}
                {training.date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-[#007a3d]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.date}</span>
                  </div>
                )}
              </div>
              
              {sections ? (
                <ContentSectionsRenderer sections={sections} />
              ) : !parsed ? (
                <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: cleanRichHtml(training.description) || 'Descrição não disponível.' }} />
              ) : (
                <div className="space-y-16">
                  {parsed.presentation && (
                    <div>
                      <h4 className="text-xl font-bold uppercase tracking-widest text-[#007a3d] mb-8 flex items-center gap-3"><Award size={24}/> Apresentação / Sobre o Curso</h4>
                      <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: cleanRichHtml(parsed.presentation) }} />
                    </div>
                  )}
                  {parsed.audience && (
                    <div className="pt-12 mt-12 border-t border-gray-100">
                      <h4 className="text-xl font-bold uppercase tracking-widest text-[#007a3d] mb-8 flex items-center gap-3"><CheckCircle2 size={24}/> Público-Alvo</h4>
                      <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: cleanRichHtml(parsed.audience) }} />
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
                                dangerouslySetInnerHTML={{ __html: cleanRichHtml(tabs[activeTab].content) }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: cleanRichHtml(parsed.modules_content) }} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {training.video_url && (
                <div className="mt-16 bg-gray-900 rounded-card overflow-hidden aspect-video shadow-2xl relative group">
                  <iframe 
                    className="w-full h-full"
                    src={toVideoEmbed(training.video_url) || training.video_url} 
                    title="Apresentação do Curso"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* PDF do treinamento (se houver) — link discreto */}
            {training.pdf_url && (
              <div className="w-full">
                <a href={getImageUrl(training.pdf_url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 text-[#007a3d] hover:bg-[#007a3d] hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
                  <FileText size={16} /> Baixar Material do Curso (PDF)
                </a>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* CONTATO RESPONSÁVEL — configurado em /admin/treinamentos */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="treinamentos" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
