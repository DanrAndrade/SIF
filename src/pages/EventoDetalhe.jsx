import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

export default function EventoDetalhe() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/eventos.php?slug=${slug}`);
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      console.error("Erro ao carregar evento:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event || !event.title) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Evento não encontrado</h2>
        <Link to="/eventos">
          <Button variant="primary" className="rounded-xl font-bold tracking-tight">Voltar para Eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />

      {/* HERO PREMIUM COM CONTRASTE */}
      <div className="relative h-[65vh] flex items-center pt-20 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(event.image_url)} 
            className="w-full h-full object-cover opacity-50" 
            alt={event.title} 
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/20 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/eventos" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#92b735] mb-8 transition-colors group bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ChevronLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Voltar aos Eventos</span>
          </Link>
          
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#92b735] text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-emerald-900/20">
              {event.date || 'Data a confirmar'}
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <MapPin className="text-[#92b735]" size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">{event.location || 'Local a definir'}</span>
              </div>
              {event.planta_url && (
                <a href={event.planta_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <FileText className="text-[#059669]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest border-b border-white/20">Baixar Planta Baixa (PDF)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE CONTEÚDO */}
      <section className="py-24 relative -mt-32 z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Detalhes do Evento */}
            <div className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#059669]">
                   <Info size={20} />
                </div>
                Sobre o Evento
              </h3>
              
              <div 
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#059669]"
                dangerouslySetInnerHTML={{ __html: event.description || 'Descrição não disponível.' }}
              />

              {event.video_url && (
                <div className="mt-16 bg-gray-900 rounded-[32px] overflow-hidden aspect-video shadow-2xl relative group">
                  <iframe 
                    className="w-full h-full"
                    src={event.video_url.replace('watch?v=', 'embed/')} 
                    title="Vídeo Chamada do Evento"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* Sidebar de Ação */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-32">
                  <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-tighter text-2xl">Gestão de Eventos</h4>
                  <p className="text-sm text-gray-500 mb-10">Deseja expor sua marca neste evento ou solicitar informações técnicas?</p>
                  
                  <div className="space-y-6 mb-12">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#059669]">
                           <Users size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Atendimento SIF</p>
                           <p className="font-bold text-gray-800 tracking-tight text-sm">Analista de Eventos</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#059669]">
                           <Calendar size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Status do Evento</p>
                           <p className="font-bold text-gray-800 tracking-tight text-sm">Inscrições Abertas</p>
                        </div>
                     </div>
                  </div>

                  <a href={`https://wa.me/553138991185?text=Interesse no Evento: ${event.title}`} target="_blank" rel="noreferrer">
                    <Button variant="primary" className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/20">
                      Entrar em Contato <ArrowRight size={18} />
                    </Button>
                  </a>
               </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
