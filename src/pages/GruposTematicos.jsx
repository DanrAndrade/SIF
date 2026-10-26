import React, { useState, useEffect } from 'react';
import LoadError from '../components/ui/LoadError';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import { ArrowRight, Layers, Target, Activity, ShieldCheck, Zap, Globe, Microscope } from 'lucide-react';
import { API_BASE_URL, getImageUrl, htmlToText } from '../apiConfig';
import GlowCta from '../components/ui/GlowCta';

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Clusters de Pesquisa',
  hero_title_line1: 'Grupos',
  hero_title_highlight: 'Temáticos',
  hero_subtitle: 'Cooperação técnica especializada em áreas chave para a excelência do setor florestal.',
  hero_scroll_label: 'Ver Grupos',
};

const iconMap = {
  Target: Target,
  Users: Layers,
  Book: Microscope,
  Zap: Zap,
  Shield: ShieldCheck,
  Globe: Globe,
  Activity: Activity
};

// Resumo do grupo (painel › GT › Resumo); sem ele, usa o começo do texto
const gtSummary = (gt) => { try { return (JSON.parse(gt.extra_data || '{}') || {}).summary || ''; } catch { return ''; } };

export default function GruposTematicos() {
  const [loadError, setLoadError] = useState(false);
  usePageTitle('Grupos Temáticos'); // título da aba do navegador / Google
  const [gts, setGts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGts();
  }, []);

  const fetchGts = async () => {
    try {
      setLoadError(false);
      const res = await fetch(`${API_BASE_URL}/gt.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar GTs:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      
      <EditablePageHero pageKey="gt" defaults={HERO_DEFAULTS} scrollTargetId="gt-content" />

      <main className="flex-grow py-24" id="gt-content">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* INTRODUÇÃO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 md:mb-20">
            <h2 className="lg:col-span-7 sif-title sif-h2 text-[#1f2937] leading-[0.95] tracking-tight">Onde a <span className="text-[#007a3d]">ciência</span><br/>encontra o campo.</h2>
            <p className="lg:col-span-5 text-gray-500 text-lg leading-relaxed">Os Grupos Temáticos da SIF representam parcerias estratégicas entre a academia e as empresas associadas, focadas em solucionar desafios reais do setor por meio de pesquisa aplicada.</p>
          </div>

          {/* GRADE DE GTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white h-[380px] rounded-panel animate-pulse shadow-card"></div>
              ))
            ) : loadError ? (
              <LoadError onRetry={() => { setLoading(true); fetchGts(); }} />
            ) : gts.length === 0 ? (
              <p className="col-span-full py-16 text-center text-gray-400 font-bold uppercase tracking-widest italic">Nenhum grupo temático publicado no momento.</p>
            ) : (
              gts.map((gt) => <GtCard key={gt.id} gt={gt} Icon={iconMap[gt.icon] || Target} />)
            )}
          </div>

          {/* CHAMADA (mesmo card do Trabalhe Conosco da Home) */}
          <div className="mt-20 md:mt-24">
            <GlowCta title="Quer tornar sua empresa" highlight="parceira de um GT?"
              text="Participe ativamente das pesquisas e tenha acesso prioritário aos resultados e tecnologias geradas."
              btnLabel="Quero ser associado" href="/associadas" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Card do grupo: foto (ou a cor do grupo) ocupando o card todo, com o texto
// por cima. Foto quebrada cai na versão com a cor do grupo.
function GtCard({ gt, Icon }) {
  const [imgOk, setImgOk] = useState(!!gt.image_url);
  const color = gt.color || '#007a3d';
  return (
    <Link to={`/grupos-tematicos/${gt.slug}`}
      className="group relative block h-[380px] md:h-[420px] rounded-panel overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7FBA00]">
      {imgOk ? (
        <img src={getImageUrl(gt.image_url, 800)} alt="" loading="lazy" decoding="async" onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${color} 0%, #0b3320 85%)` }}>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06190f]/95 via-[#06190f]/45 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-7 md:p-8 text-white">
        <h3 className="text-2xl font-semibold leading-tight mb-2">{gt.title}</h3>
        <p className="text-white/75 text-sm leading-relaxed line-clamp-2 mb-5">{gtSummary(gt) || htmlToText(gt.description, 160)}</p>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sif-lime">
          Saiba mais <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
