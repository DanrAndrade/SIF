import React, { useState, useEffect, useMemo } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, ChevronLeft, Play, Layers, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl, cleanRichHtml, toVideoEmbed } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import { useSeo } from '../hooks/useSeo';
import EditablePageContact from '../components/EditablePageContact';
import DetailHero from '../components/DetailHero';

export default function TreinamentoInCompanyDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  usePageTitle(training?.title); // título da aba do navegador / Google
  useSeo({ description: training?.description, image: training?.image_url ? getImageUrl(training.image_url) : undefined });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/treinamentos_in_company.php?slug=${slug}`);
        const data = await res.json();
        setTraining(data);
      } catch (err) {
        console.error("Erro ao carregar treinamento:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const sections = useMemo(() => {
    if (!training?.extra_data) return null;
    try { const s = JSON.parse(training.extra_data).sections; return Array.isArray(s) && s.length > 0 ? s : null; } catch { return null; }
  }, [training]);

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
        <Button href="/treinamentos-in-company" variant="primary" className="rounded-xl">Voltar para Treinamentos In-Company</Button>
      </div>
    );
  }

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* TOPO (padrão das páginas de detalhe) */}
      <DetailHero
        cover={training.image_url ? getImageUrl(training.image_url) : ''}
        crumbs={[{ label: 'Treinamentos In-Company', to: '/treinamentos-in-company' }]}
        eyebrow="Treinamento In-Company" icon={Award}
        title={training.title}
        chips={[{ icon: Clock, text: training.hours ? `${training.hours}${/\d$/.test(String(training.hours)) ? 'h' : ''}` : '' }, { icon: Layers, text: training.segment }]}
      />

      {/* CONTEÚDO */}
      <section className="py-16 md:py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            <div className="w-full bg-white rounded-card md:rounded-panel p-5 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-medium text-gray-900 mb-12 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#007a3d]">
                  <Award size={20} />
                </div>
                Conteúdo Programático
              </h3>

              <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                {training.segment && (
                  <div className="flex items-center gap-3">
                    <Layers className="text-[#007a3d]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.segment}</span>
                  </div>
                )}
                {training.hours && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-[#007a3d]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-700">{training.hours} - Carga Horária</span>
                  </div>
                )}
              </div>

              {sections ? (
                <ContentSectionsRenderer sections={sections} />
              ) : training.description ? (
                <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: cleanRichHtml(training.description) }} />
              ) : (
                <p className="text-gray-400 italic text-center">Descrição não disponível.</p>
              )}

              {training.video_url && (
                <div className="mt-16 bg-gray-900 rounded-card overflow-hidden aspect-video shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={toVideoEmbed(training.video_url) || training.video_url}
                    title="Apresentação do Treinamento"
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

      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="treinamentos_in_company" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
