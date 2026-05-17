import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { ChevronLeft, Target, Users, BookOpen, ShieldCheck, ArrowRight, Microscope, Zap, Globe, Activity, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';

const iconMap = {
  Target: Target,
  Users: Users,
  Book: Microscope,
  Zap: Zap,
  Shield: ShieldCheck,
  Globe: Globe,
  Activity: Activity
};

export default function GrupoTematicoDetalhe() {
  const { slug } = useParams();
  const [gt, setGt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGt();
  }, [slug]);

  const fetchGt = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gt.php?slug=${slug}`);
      const data = await res.json();
      setGt(data);
    } catch (err) {
      console.error("Erro ao carregar GT:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!gt || !gt.title) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Grupo Temático não encontrado</h2>
        <Link to="/grupos-tematicos">
          <Button variant="primary" className="rounded-xl">Ver todos os Grupos</Button>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[gt.icon] || Target;
  const gtColor = gt.color || '#007a3d';

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* HERO — foto se houver, senão degradê escuro */}
      <div className="relative h-[65vh] flex items-center pt-20 overflow-hidden bg-[#1f2937]">
        <div className="absolute inset-0 z-0">
          {gt.image_url
            ? <>
                <img
                  src={getImageUrl(gt.image_url)}
                  alt={gt.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              </>
            : <>
                <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-[#1B5E20]/30" />
                <div className="absolute top-0 right-0 w-full h-full opacity-10 transform scale-150 rotate-12">
                  <IconComponent size={800} strokeWidth={0.5} className="text-white" />
                </div>
              </>
          }
          <NoiseOverlay opacity={0.2} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/grupos-tematicos"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-10 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md group-hover:bg-[#007a3d] transition-all">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-1">Nossos Clusters</span>
          </Link>

          <div className="max-w-4xl flex flex-col gap-6">
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white shadow-2xl"
              style={{ backgroundColor: gtColor }}
            >
              <IconComponent size={32} />
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest border border-white/10 w-fit">Pesquisa Aplicada</span>
            <h1 className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter leading-[0.9]">
              {gt.title}
            </h1>
            <p className="text-white/60 text-base font-medium tracking-tight">SIF - Sociedade de Investigações Florestais</p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO TÉCNICO */}
      <section className="py-24 relative -mt-20 z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Detalhes Técnicos */}
            <div className="lg:col-span-8 bg-white rounded-[48px] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[600px]">
              <div className="flex items-center gap-6 mb-16">
                 <div className="p-4 rounded-3xl bg-gray-50 text-[#007a3d]">
                    <IconComponent size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter">{gt.content_title || 'Objetivos do Cluster'}</h3>
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest mt-1">{gt.content_subtitle || 'Linhas de Pesquisa e Inovação'}</p>
                 </div>
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#1B5E20] prose-li:marker:text-[#007a3d]"
                dangerouslySetInnerHTML={{ __html: gt.description }}
              />

              {(() => {
                try {
                  const extra = gt.extra_data ? JSON.parse(gt.extra_data) : {};
                  if (extra.sections?.length) return <div className="mt-12 pt-8 border-t border-gray-100"><ContentSectionsRenderer sections={extra.sections} /></div>;
                } catch {}
                return null;
              })()}
            </div>

            {/* Sidebar de Adesão */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-[#1f2937] rounded-[48px] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5 sticky top-32">
                  <div className="relative z-10">
                    <h4 className="text-3xl font-bold mb-6 uppercase tracking-tight leading-tight">Quer tornar sua empresa <span className="text-[#007a3d]">Parceira?</span></h4>
                    <p className="text-gray-400 mb-10 font-medium">Empresas parceiras têm acesso exclusivo a seminários técnicos, plantas baixas de experimentos e prioridade em novas tecnologias.</p>
                    
                    <div className="space-y-4 mb-12">
                       {['Relatórios Técnicos', 'Dias de Campo', 'Softwares Exclusivos'].map(item => (
                         <div key={item} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#007a3d]/20 flex items-center justify-center text-[#007a3d]">
                               <ArrowRight size={12} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{item}</span>
                         </div>
                       ))}
                    </div>

                    <a href={`https://wa.me/553138991185?text=Interesse em tornar minha empresa parceira do ${gt.title}`} target="_blank" rel="noreferrer">
                      <Button variant="primary" className="w-full rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">
                        Seja Parceiro <ArrowRight size={18} />
                      </Button>
                    </a>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d] opacity-5 rounded-bl-[100px] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700"></div>
               </div>

               {/* Card Secretaria */}
               <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h5 className="text-gray-900 font-bold mb-4 uppercase tracking-tight">Coordenadoria Técnica</h5>
                  <p className="text-xs text-gray-500 mb-8 font-medium">Dúvidas sobre o escopo de pesquisa ou projetos específicos?</p>
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-[#007a3d]">
                        <FileText size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Secretaria de P&D</p>
                        <p className="font-bold text-gray-800 tracking-tight text-sm">sif@sif.org.br</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
