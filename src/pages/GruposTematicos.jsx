import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import EditablePageHero from '../components/EditablePageHero';
import { ArrowRight, Layers, Target, Activity, ShieldCheck, Zap, Globe, Microscope } from 'lucide-react';
import { API_BASE_URL, getImageUrl, cleanRichHtml } from '../apiConfig';
import Button from '../components/ui/Button';

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

export default function GruposTematicos() {
  const [gts, setGts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGts();
  }, []);

  const fetchGts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gt.php`);
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar GTs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      
      <EditablePageHero pageKey="gt" defaults={HERO_DEFAULTS} scrollTargetId="gt-content" />

      <main className="flex-grow py-24" id="gt-content">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* INTRODUÇÃO */}
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter mb-8">Onde a <br/><span className="text-[#007a3d]">ciência</span> encontra o campo.</h2>
            <p className="text-gray-500 text-xl font-medium leading-relaxed">Os Grupos Temáticos da SIF representam parcerias estratégicas entre a academia e as empresas associadas, focadas em solucionar desafios reais do setor por meio de pesquisa aplicada.</p>
          </div>

          {/* GRID DE GTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white h-80 rounded-[48px] animate-pulse shadow-sm"></div>
              ))
            ) : (
              gts.map((gt) => {
                const IconComponent = iconMap[gt.icon] || Target;
                return (
                  <Link 
                    key={gt.id} 
                    to={`/grupos-tematicos/${gt.slug}`}
                    className="group bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all block relative overflow-hidden h-full flex flex-col"
                  >
                    {/* Banner (foto ou cor com ícone) */}
                    <div className="relative h-44 overflow-hidden rounded-t-[48px] flex-shrink-0">
                      {gt.image_url
                        ? <img
                            src={getImageUrl(gt.image_url)}
                            alt={gt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        : <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: gt.color || '#007a3d' }}
                          >
                            <IconComponent size={64} className="text-white/40" />
                          </div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div
                        className="absolute bottom-4 left-6 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: gt.color || '#007a3d' }}
                      >
                        <IconComponent size={16} />
                      </div>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-3 group-hover:text-[#007a3d] transition-colors">{gt.title}</h3>
                      <div 
                        className="text-gray-400 font-medium leading-relaxed mb-6 line-clamp-3 text-sm flex-grow"
                        dangerouslySetInnerHTML={{ __html: cleanRichHtml(gt.description || '').substring(0, 150) + '...' }}
                      />
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1f2937] group-hover:gap-5 transition-all pt-4 border-t border-gray-50">
                        Saiba Mais <ArrowRight size={16} className="text-[#007a3d]" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* CTAs EXTRAS */}
          <div className="mt-24 p-12 md:p-20 bg-[#1f2937] rounded-[60px] text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="max-w-xl">
                 <h3 className="text-3xl md:text-5xl font-bold font-heading uppercase mb-6 leading-tight">Quer tornar sua empresa <span className="text-[#007a3d]">parceira de um GT?</span></h3>
                 <p className="text-gray-400 font-medium text-base">Participe ativamente das pesquisas e tenha acesso prioritário aos resultados e tecnologias geradas.</p>
               </div>
               <Link to="/associadas">
                 <Button variant="primary" className="bg-white text-[#1f2937] hover:bg-emerald-50 border-0 uppercase font-black tracking-widest text-[10px]">Quero ser Associado</Button>
               </Link>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
