import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Microscope, TreePine, Droplets, ShieldCheck, Zap, BarChart3, ArrowRight, Layers, Target, Activity, Shield, Globe } from 'lucide-react';
import Button from '../components/ui/Button';

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
      const res = await fetch('http://localhost/sif-api/gt.php');
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar GTs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Clusters de Pesquisa</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Grupos <br/>
              <span className="text-[#059669]">Temáticos</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Cooperação técnica especializada em áreas chave para a excelência do setor florestal.
          </p>
        </div>
      </div>

      <main className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* INTRODUÇÃO */}
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter mb-8">Onde a <br/><span className="text-[#059669]">ciência</span> encontra o campo.</h2>
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
                    className="group bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all block relative overflow-hidden h-full flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[80px] -z-0 transition-all group-hover:bg-[#059669] group-hover:opacity-10"></div>
                    <div>
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform text-white"
                        style={{ backgroundColor: gt.color || '#059669' }}
                      >
                        <IconComponent size={32} />
                      </div>
                      <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] mb-4 group-hover:text-[#059669] transition-colors">{gt.title}</h3>
                      <div 
                        className="text-gray-400 font-medium leading-relaxed mb-10 line-clamp-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: gt.description?.substring(0, 150) + '...' }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1f2937] group-hover:gap-5 transition-all mt-auto pt-6 border-t border-gray-50">
                      Saiba Mais <ArrowRight size={16} className="text-[#059669]" />
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
                 <h3 className="text-3xl md:text-5xl font-bold font-heading uppercase mb-6 leading-tight">Quer tornar sua empresa <span className="text-[#059669]">parceira de um GT?</span></h3>
                 <p className="text-gray-400 font-medium text-lg">Participe ativamente das pesquisas e tenha acesso prioritário aos resultados e tecnologias geradas.</p>
               </div>
               <Link to="/associadas">
                 <Button variant="primary" className="px-12 py-6 bg-white text-[#1f2937] hover:bg-emerald-50 border-0 uppercase font-black tracking-widest text-[10px]">Quero ser Associado</Button>
               </Link>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
