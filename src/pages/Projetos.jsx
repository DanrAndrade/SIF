import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const API_URL = `${API_BASE_URL}/projetos.php`;

const STATUS_DOT = {
  'Em Andamento':     'bg-amber-400',
  'Concluído':        'bg-emerald-500',
  'Em Planejamento':  'bg-blue-400',
  'Suspenso':         'bg-red-400',
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

function SectionTitle({ label, title, accent }) {
  return (
    <div className="mb-16 border-b border-gray-100 pb-10">
      <span className="text-[#007a3d] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">{label}</span>
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

      {/* HERO */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
            <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">P&D+I Estratégico</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
            Nossos <br />
            <span className="text-[#007a3d]">Projetos</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
            Transformando desafios em soluções aplicadas através de pesquisas de vanguarda e inovação florestal.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('projetos-lista');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="group flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#007a3d]"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] transition-all">
              <ChevronDown size={20} className="animate-bounce" />
            </div>
            Ver Projetos
          </button>
        </div>
      </div>

      <main className="flex-grow">

        {/* ── PROJETOS EM ANDAMENTO ── */}
        <section id="projetos-lista" className="py-24 bg-[#f8f9fa] scroll-mt-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionTitle label="Portfólio Ativo" title="Projetos em" accent="Andamento" />

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
              <SectionTitle label="Histórico de Pesquisa" title="Projetos" accent="Concluídos" />
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
