import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Clock, ChevronLeft, Play, Layers, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import EditablePageContact from '../components/EditablePageContact';

export default function TreinamentoInCompanyDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
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
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Treinamento não encontrado</h2>
        <Link to="/treinamentos-in-company">
          <Button variant="primary" className="rounded-xl">Voltar para Treinamentos In-Company</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* HERO */}
      <div className="relative h-[65vh] flex items-center pt-20 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          {training.image_url && <img
            src={getImageUrl(training.image_url)}
            className="w-full h-full object-cover opacity-50"
            alt={training.title}
            loading="lazy"
            decoding="async"
          />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/20 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/treinamentos-in-company"
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#7FBA00] mb-8 transition-colors group bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ChevronLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Voltar aos Treinamentos In-Company</span>
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              {training.title}
            </h1>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <section className="py-24 relative -mt-32 z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            <div className="w-full bg-white rounded-[28px] md:rounded-[40px] p-5 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-4">
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
                <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d]" dangerouslySetInnerHTML={{ __html: training.description }} />
              ) : (
                <p className="text-gray-400 italic text-center">Descrição não disponível.</p>
              )}

              {training.video_url && (
                <div className="mt-16 bg-gray-900 rounded-[32px] overflow-hidden aspect-video shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={training.video_url.replace('watch?v=', 'embed/')}
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

      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="treinamentos_in_company" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
