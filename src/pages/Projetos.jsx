import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import EditablePageHero from '../components/EditablePageHero';
import { ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070',
  hero_badge: 'P&D+I Estratégico',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Projetos',
  hero_subtitle: 'Transformando desafios em soluções aplicadas através de pesquisas de vanguarda e inovação florestal.',
  hero_scroll_label: 'Ver Projetos',
};

const API_URL = `${API_BASE_URL}/projetos.php`;

const STATUS_DOT = {
  'Em Andamento':     'bg-amber-400',
  'Concluído':        'bg-emerald-500',
};

const isAtivo = (status) => status !== 'Concluído';

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ProjetoCard({ proj }) {
  return (
    <Link to={`/projetos/${proj.slug}`} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col block">
      {proj.image_url && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(proj.image_url)}
            alt={proj.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-8 flex flex-col flex-grow">
        {/* Tag + Status */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {proj.tag && (
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{proj.tag}</span>
          )}
          {proj.status && (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[proj.status] || 'bg-gray-400'}`}></span>
              {proj.status}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-4 leading-tight group-hover:text-[#007a3d] transition-colors flex-grow">
          {proj.title}
        </h3>

        {/* Data limite */}
        {proj.data_limite && (
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Clock size={12} />
            Prazo: {formatDate(proj.data_limite)}
          </div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{proj.lab || ''}</span>
          <span className="flex items-center gap-1 text-[#007a3d] text-[10px] font-black uppercase tracking-wider group-hover:text-[#007a3d] transition-all">
            Ver Detalhes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionTitle({ title, accent }) {
  return (
    <div className="mb-16 border-b border-gray-100 pb-10">
      <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">
        {title} <span className="text-[#007a3d]">{accent}</span>
      </h2>
    </div>
  );
}

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'SIF | Projetos P&D';
    fetch(API_URL)
      .then(r => r.json())
      .then(data => { setProjetos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const ativos     = projetos.filter(p => isAtivo(p.status));
  const concluidos = projetos.filter(p => !isAtivo(p.status));

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="projetos" defaults={HERO_DEFAULTS} scrollTargetId="projetos-lista" />

      <main className="flex-grow">

        {/* ── PROJETOS EM ANDAMENTO ── */}
        <section id="projetos-lista" className="py-24 bg-[#f8f9fa] scroll-mt-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionTitle title="Projetos em" accent="Andamento" />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white h-60 rounded-[40px] animate-pulse" />
                ))}
              </div>
            ) : ativos.length === 0 ? (
              <div className="py-16 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                Nenhum projeto em andamento no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ativos.map(proj => <ProjetoCard key={proj.id} proj={proj} />)}
              </div>
            )}
          </div>
        </section>

        {/* ── PROJETOS CONCLUÍDOS ── */}
        {!loading && concluidos.length > 0 && (
          <section className="py-24 pb-32 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
              <SectionTitle title="Projetos" accent="Concluídos" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {concluidos.map(proj => (
                  <div key={proj.id} className="opacity-80 hover:opacity-100 transition-opacity">
                    <ProjetoCard proj={proj} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Padding bottom quando sem concluídos */}
        {!loading && concluidos.length === 0 && <div className="pb-24" />}

      </main>

      <Footer />
    </div>
  );
}
