import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import EditablePageHero from '../components/EditablePageHero';
import { Calendar, MapPin, ArrowRight, Download, Users, Camera, FileText, Play, Info, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070',
  hero_badge: 'Networking & Negócios',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Eventos',
  hero_subtitle: 'Conectando lideranças e transformando o conhecimento em prática nos maiores fóruns florestais.',
  hero_scroll_label: 'Ver Agenda',
};

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/eventos.php`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Classificação automática por data: eventos com event_date >= hoje vão
  // para "Próximos"; com event_date < hoje vão para "Concluídos". Eventos sem
  // event_date entram em "Próximos" (fail-soft) — basta cadastrar no admin.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isUpcoming = (ev) => {
    if (!ev.event_date) return true;
    const d = new Date(ev.event_date);
    return !isNaN(d) && d >= today;
  };
  const upcomingEvents = events.filter(isUpcoming);
  const pastEvents = events.filter(ev => !isUpcoming(ev));
  const featuredEvent = upcomingEvents[0]; // próximo evento (não o primeiro do array)

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      
      <EditablePageHero pageKey="eventos" defaults={HERO_DEFAULTS} scrollTargetId="eventos-content" />

      <main id="eventos-content" className="flex-grow pb-24 lg:pt-12">
        {/* EVENTO EM DESTAQUE */}
        {featuredEvent && (
        <section className="py-12 md:py-24 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -z-0 rounded-l-[100px] hidden lg:block"></div>
              <div className="container mx-auto px-6 max-w-7xl relative z-10">
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

                      {/* IMAGEM — vem primeiro no mobile (order-first), segundo no desktop */}
                      <div className="order-first lg:order-last lg:w-1/2 relative w-full">
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                          <div className="rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl relative aspect-[4/3] md:aspect-square group">
                              {featuredEvent.image_url
                                ? <img
                                    src={getImageUrl(featuredEvent.image_url)}
                                    alt={featuredEvent.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                  />
                                : <div className="w-full h-full bg-gradient-to-br from-[#007a3d] to-[#1f2937] flex items-center justify-center">
                                    <span className="text-white/20 text-8xl font-black uppercase tracking-tighter">SIF</span>
                                  </div>
                              }
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937]/60 to-transparent"></div>
                              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                  <div className="flex items-center gap-2 mb-2">
                                      <MapPin size={16} className="text-[#007a3d]" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">{featuredEvent.location || 'Consultar Local'}</span>
                                  </div>
                                  <h3 className="text-lg md:text-2xl font-bold font-heading uppercase line-clamp-2">{featuredEvent.title}</h3>
                              </div>
                          </div>
                      </div>

                      {/* CONTEÚDO — vem segundo no mobile (order-last), primeiro no desktop */}
                      <div className="order-last lg:order-first lg:w-1/2 space-y-6 md:space-y-8">
                          <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-[#007a3d] text-[9px] font-black uppercase tracking-widest">Destaque do Ano</div>
                          <h2 className="text-3xl md:text-7xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">
                            {featuredEvent.title.split(' ').slice(0, 2).join(' ')} <br/>
                            <span className="text-[#007a3d]">{featuredEvent.title.split(' ').slice(2).join(' ')}</span>
                          </h2>
                          <div className="text-gray-500 text-sm md:text-base font-medium leading-relaxed line-clamp-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: featuredEvent.description }}></div>
                          
                          {featuredEvent.video_url && (
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#007a3d] shadow-sm shrink-0"><Play size={20} /></div>
                                <div className="pt-1">
                                    <h4 className="text-xs font-black uppercase text-[#1f2937] tracking-widest">Vídeo disponível</h4>
                                </div>
                            </div>
                          )}

                          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                              <Link to={`/eventos/${featuredEvent.slug}`}>
                                <Button variant="primary" className="uppercase font-bold tracking-widest w-full sm:w-auto">Saiba Mais</Button>
                              </Link>
                          </div>
                      </div>

                  </div>
              </div>
          </section>
        )}

        {/* PRÓXIMOS EVENTOS */}
        <section className="py-24 bg-[#f8f9fa]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-10">
                    <div>
                        <span className="text-[#007a3d] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Agenda {new Date().getFullYear()}</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">Próximos <span className="text-[#007a3d]">Encontros</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                       Array(3).fill(0).map((_, i) => (
                         <div key={i} className="bg-white h-80 rounded-[40px] animate-pulse"></div>
                       ))
                    ) : (
                      upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event) => (
                          <Link to={`/eventos/${event.slug}`} key={event.id} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between">
                              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#007a3d] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>

                              <div className="flex justify-between items-start mb-10">
                                  <div className="text-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                      <span className="block text-2xl font-black text-[#1f2937] font-heading leading-none uppercase">{event.date?.split(' ')[0] || 'TBD'}</span>
                                      <span className="text-[9px] font-black text-[#007a3d] uppercase tracking-widest">{event.date?.split(' ')[1] || ''}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest pt-2">{event.location}</span>
                                    {event.planta_url && <Info size={14} className="text-emerald-300 mt-2" />}
                                  </div>
                              </div>

                              <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-8 leading-tight group-hover:text-[#007a3d] transition-colors line-clamp-2">{event.title}</h3>

                              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#007a3d]">Inscrições Abertas</span>
                                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#1f2937] group-hover:text-white transition-all shadow-inner"><ArrowRight size={18} /></div>
                              </div>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">Nenhum evento agendado no momento.</div>
                      )
                    )}
                </div>
            </div>
        </section>

        {/* EVENTOS CONCLUÍDOS — só aparece se há eventos passados */}
        {pastEvents.length > 0 && (
          <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-10">
                <div>
                  <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Histórico</span>
                  <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">Eventos <span className="text-gray-400">Concluídos</span></h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <Link to={`/eventos/${event.slug}`} key={event.id} className="bg-[#f8f9fa] p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between opacity-90 hover:opacity-100">
                    <div className="flex justify-between items-start mb-10">
                      <div className="text-center bg-white px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="block text-2xl font-black text-gray-500 font-heading leading-none uppercase">{event.date?.split(' ')[0] || 'TBD'}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{event.date?.split(' ')[1] || ''}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest pt-2">{event.location}</span>
                    </div>

                    <h3 className="text-xl font-bold font-heading uppercase text-gray-700 mb-8 leading-tight group-hover:text-[#007a3d] transition-colors line-clamp-2">{event.title}</h3>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Concluído</span>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:bg-[#1f2937] group-hover:text-white transition-all shadow-inner"><ArrowRight size={18} /></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
