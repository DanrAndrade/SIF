import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Tag, Clock, Download, ChevronRight } from 'lucide-react';
import { API_BASE_URL, getImageUrl, cleanRichHtml, toExternalUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import EditablePageContact from '../components/EditablePageContact';
import { useSeo } from '../hooks/useSeo';
import { usePageTitle } from '../hooks/usePageTitle';
import { getEffectiveProjectStatus, STATUS_DOT } from '../utils/helpers';
import DetailHero from '../components/DetailHero';
import { FlaskConical } from 'lucide-react';

const API_URL = `${API_BASE_URL}/projetos.php`;


function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  usePageTitle(projeto?.title);
  useSeo({ description: projeto?.description, image: projeto?.image_url ? getImageUrl(projeto.image_url) : undefined });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [projSections, setProjSections] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error || !data.id) {
          navigate('/projetos');
        } else {
          setProjeto(data);

          try {
            const extra = data.extra_data ? JSON.parse(data.extra_data) : {};
            const s = extra.sections;
            setProjSections(Array.isArray(s) && s.length > 0 ? s : null);
          } catch { setProjSections(null); }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar projeto:", err);
        navigate('/projetos');
      });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen sif-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!projeto) return null;

  return (
    <div className="sif-page min-h-screen font-sans selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      {/* TOPO (padrão das páginas de detalhe) */}
      {(() => {
        const es = getEffectiveProjectStatus(projeto);
        return (
          <DetailHero
            cover={projeto.image_url ? getImageUrl(projeto.image_url) : ''}
            crumbs={[{ label: 'Projetos', to: '/projetos' }]}
            eyebrow="Projeto de P&D" icon={FlaskConical}
            title={projeto.title}
            chips={[
              { icon: Tag, text: projeto.tag },
              { dot: STATUS_DOT[es] || 'bg-gray-400', text: es },
              { icon: MapPin, text: projeto.lab },
              { icon: Clock, text: projeto.data_limite ? `Prazo: ${formatDate(projeto.data_limite)}` : '' },
            ]}
          />
        );
      })()}

      {/* CONTENT SECTION */}
      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl relative z-20 -mt-10">
        <div className="bg-white rounded-card md:rounded-panel shadow-sm border border-gray-100 p-5 md:p-16">
          {projeto.image_url && (
            <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-sm">
              <img src={getImageUrl(projeto.image_url)} alt={projeto.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Renderização do Rich Text */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#007a3d] prose-img:rounded-3xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: cleanRichHtml(projeto.description) || '<p class="text-gray-400 italic text-center">Nenhuma descrição disponível para este projeto.</p>' }}
          />

          {projSections ? (
            <div className="mt-12">
              <ContentSectionsRenderer sections={projSections} />
            </div>
          ) : (
            <>
              {projeto.pdf_url && (
                <div className="mt-12 flex justify-center border-b border-gray-100 pb-12">
                  <a href={getImageUrl(projeto.pdf_url)} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#007a3d] text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#007a3d]/30 hover:bg-[#006030] hover:shadow-xl hover:-translate-y-1 transition-all">
                    Baixar Documento do Projeto (PDF) <Download size={16}/>
                  </a>
                </div>
              )}
              {projeto.tabs && (() => {
                let tabs = [];
                try { tabs = JSON.parse(projeto.tabs); } catch {}
                if (!Array.isArray(tabs) || !tabs.length) return null;
                return (
                  <div className="mt-16 space-y-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {tabs.map((tab, idx) => (
                        <button key={idx} onClick={() => setActiveTab(idx)}
                          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === idx ? 'bg-[#1f2937] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-[#1f2937] hover:bg-gray-100'}`}>
                          {tab.title}
                        </button>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-8 md:p-12 rounded-card border border-gray-100">
                      <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#007a3d] prose-img:rounded-3xl prose-img:shadow-sm"
                        dangerouslySetInnerHTML={{ __html: cleanRichHtml(tabs[activeTab]?.content) }} />
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {projeto.link_url && (
            <div className="mt-16 pt-12 border-t border-gray-100 flex justify-center">
              <a 
                href={toExternalUrl(projeto.link_url) || undefined} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#1f2937] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#007a3d] hover:shadow-lg transition-all hover:-translate-y-1"
              >
                Visitar Página Externa do Projeto <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </main>

      {/* CONTATO RESPONSÁVEL — configurado em /admin/projetos */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="projetos" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
