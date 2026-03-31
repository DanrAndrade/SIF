import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Calendar, MapPin, ArrowRight, Download, Users, Camera, FileText, Play, Info, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

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

  const featuredEvent = events[0]; // O primeiro evento cadastrado ou mais recente
  const nextEvents = events.slice(1); // O restante

  const pastEvents = [
    { title: '44º Reunião do GT Solos', date: 'Outubro 2023', location: 'Viçosa-MG', type: 'GTs' },
    { title: 'Workshop de Tecnologia de Produtos', date: 'Agosto 2023', location: 'Curitiba-PR', type: 'Treinamento' },
    { title: 'Simpósio de Genética Florestal', date: 'Maio 2023', location: 'Online', type: 'Simpósio' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO SECTION DE EVENTOS */}
      <div className="relative h-[60vh] flex items-center pt-20 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f11] via-[#0f1f11]/60 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#92b735] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Networking & Negócios</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase text-white leading-[0.85] tracking-tighter mb-6">
              Nossos <br/>
              <span className="text-[#92b735]">Eventos</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-10">
              Conectando lideranças e transformando o conhecimento em prática nos maiores fóruns florestais.
          </p>

          <button 
              onClick={() => {
                  const section = document.getElementById('eventos-content');
                  if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
              }} 
              className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-[10px] hover:text-[#92b735] transition-colors"
          >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  <ChevronDown size={18} className="animate-bounce" />
              </div>
              Ver Agenda
          </button>
        </div>
      </div>

      <main id="eventos-content" className="flex-grow pb-24 lg:pt-12">
        {/* EVENTO EM DESTAQUE */}
        {featuredEvent && (
          <section className="py-24 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -z-0 rounded-l-[100px] hidden lg:block"></div>
              <div className="container mx-auto px-6 max-w-7xl relative z-10">
                  <div className="flex flex-col lg:flex-row gap-16 items-center">
                      <div className="lg:w-1/2 space-y-8">
                          <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-[#059669] text-[9px] font-black uppercase tracking-widest">Destaque do Ano</div>
                          <h2 className="text-4xl md:text-7xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">
                            {featuredEvent.title.split(' ').slice(0, 2).join(' ')} <br/>
                            <span className="text-[#059669]">{featuredEvent.title.split(' ').slice(2).join(' ')}</span>
                          </h2>
                          <div className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed line-clamp-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: featuredEvent.description }}></div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                              {featuredEvent.video_url && (
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#059669] shadow-sm"><Play size={20} /></div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-[#1f2937] tracking-widest">Vídeo Chamada</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Assista ao Teaser Oficial</p>
                                    </div>
                                </div>
                              )}
                              {featuredEvent.planta_url && (
                                <div className="flex items-start gap-4 cursor-pointer hover:translate-x-1 transition-transform">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#059669] shadow-sm"><Download size={20} /></div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-[#1f2937] tracking-widest">Planta Baixa</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">Download do Mapa da Feira</p>
                                    </div>
                                </div>
                              )}
                          </div>

                          <div className="pt-8 flex flex-col sm:flex-row gap-6">
                              <Link to={`/eventos/${featuredEvent.slug}`}>
                                <Button variant="primary" className="px-10 py-5 uppercase font-bold tracking-widest text-xs">Saiba Mais & Inscrições</Button>
                              </Link>
                              <div className="flex flex-col justify-center">
                                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Atendimento SIF</span>
                                  <span className="text-xs font-bold text-[#1f2937]">eventos@sif.org.br</span>
                              </div>
                          </div>
                      </div>
                      <div className="lg:w-1/2 relative w-full">
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                          <div className="rounded-[60px] overflow-hidden shadow-2xl relative aspect-square group">
                              <img 
                                src={getImageUrl(featuredEvent.image_url)} 
                                alt={featuredEvent.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670'}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937]/60 to-transparent"></div>
                              <div className="absolute bottom-10 left-10 text-white">
                                  <div className="flex items-center gap-2 mb-2">
                                      <MapPin size={16} className="text-[#059669]" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">{featuredEvent.location || 'Consultar Local'}</span>
                                  </div>
                                  <h3 className="text-2xl font-bold font-heading uppercase">{featuredEvent.title}</h3>
                              </div>
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
                        <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Agenda {new Date().getFullYear()}</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">Próximos <span className="text-[#059669]">Encontros</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                       Array(3).fill(0).map((_, i) => (
                         <div key={i} className="bg-white h-80 rounded-[40px] animate-pulse"></div>
                       ))
                    ) : (
                      events.length > 0 ? (
                        events.map((event, i) => (
                          <Link to={`/eventos/${event.slug}`} key={event.id} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between">
                              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#059669] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                              
                              <div className="flex justify-between items-start mb-10">
                                  <div className="text-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                      {/* Parse da data simples se for texto fixo */}
                                      <span className="block text-2xl font-black text-[#1f2937] font-heading leading-none uppercase">{event.date?.split(' ')[0] || 'TBD'}</span>
                                      <span className="text-[9px] font-black text-[#059669] uppercase tracking-widest">{event.date?.split(' ')[1] || ''}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest pt-2">{event.location}</span>
                                    {event.planta_url && <Info size={14} className="text-emerald-300 mt-2" />}
                                  </div>
                              </div>

                              <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-8 leading-tight group-hover:text-[#059669] transition-colors line-clamp-2">{event.title}</h3>
                              
                              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#059669]">Inscrições Abertas</span>
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

        {/* HISTÓRICO DE EVENTOS */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Bibliotecas Técnicas</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">Histórico e <span className="text-[#059669]">Materiais</span></h2>
                </div>

                <div className="bg-[#f8f9fa] rounded-[60px] p-8 md:p-16 border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#1f2937]">Nome do Evento</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#1f2937] hidden md:table-cell">Ano/Mês</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#1f2937] text-right">Acessar Recursos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pastEvents.map((item, i) => (
                                    <tr key={i} className="group hover:bg-white transition-all">
                                        <td className="py-8 pr-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-[#1f2937] uppercase">{item.title}</span>
                                                <span className="text-[10px] font-black text-[#059669] uppercase tracking-widest mt-1">{item.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 hidden md:table-cell">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.date} • {item.location}</span>
                                        </td>
                                        <td className="py-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#059669] hover:border-emerald-100 transition-all shadow-sm" title="Fotos"><Camera size={18}/></button>
                                                <button className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#059669] hover:border-emerald-100 transition-all shadow-sm" title="Anais/Materials"><FileText size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
