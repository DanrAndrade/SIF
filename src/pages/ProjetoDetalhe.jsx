import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Tag, Clock, Download, ChevronRight } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import EditablePageContact from '../components/EditablePageContact';

const API_URL = `${API_BASE_URL}/projetos.php`;

const STATUS_DOT = {
  'Em Andamento': 'bg-amber-400',
  'Concluído': 'bg-emerald-500',
  'Em Planejamento': 'bg-blue-400',
  'Suspenso': 'bg-red-400',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
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
          document.title = `SIF | ${data.title}`;
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
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!projeto) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      {/* HEADER SECTION */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#1f2937]">
        <div className="absolute inset-0 z-0 opacity-20">
          {projeto.image_url ? (
            <img src={getImageUrl(projeto.image_url)} alt="bg" className="w-full h-full object-cover blur-sm" />
          ) : (
            <div className="w-full h-full bg-[#007a3d]"></div>
          )}
        </div>
        <NoiseOverlay opacity={0.4} />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/projetos" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Projetos
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {projeto.tag && (
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                {projeto.tag}
              </span>
            )}
            {projeto.status && (
              <span className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[projeto.status] || 'bg-gray-400'}`}></span>
                {projeto.status}
              </span>
            )}
            {projeto.lab && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                <MapPin size={12} />
                {projeto.lab}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading uppercase text-white leading-tight tracking-tighter mb-8 max-w-5xl">
            {projeto.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
            {projeto.data_limite && (
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                <Clock size={16} className="text-[#007a3d]" />
                Prazo: {formatDate(projeto.data_limite)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl relative z-20 -mt-10">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-16">
          {projeto.image_url && (
            <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-sm">
              <img src={getImageUrl(projeto.image_url)} alt={projeto.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Renderização do Rich Text */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#007a3d] prose-img:rounded-3xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: projeto.description || '<p class="text-gray-400 italic text-center">Nenhuma descrição disponível para este projeto.</p>' }}
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
                if (!tabs.length) return null;
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
                    <div className="bg-gray-50 p-8 md:p-12 rounded-[32px] border border-gray-100">
                      <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#007a3d] prose-img:rounded-3xl prose-img:shadow-sm"
                        dangerouslySetInnerHTML={{ __html: tabs[activeTab]?.content }} />
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {projeto.link_url && (
            <div className="mt-16 pt-12 border-t border-gray-100 flex justify-center">
              <a 
                href={projeto.link_url} 
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
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-6 max-w-3xl">
          <EditablePageContact pageKey="projetos" fallbackTitle="Fale com o responsável" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
