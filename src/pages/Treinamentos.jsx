import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Calendar, MapPin, ArrowRight, BookOpen, Clock, Award, X, MessageSquare, Play, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

export default function Treinamentos() {
  const [trainings, setTrainings] = useState([]);
  const [segments, setSegments] = useState(['Todos']);
  const [selectedSegment, setSelectedSegment] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/treinamentos.php`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTrainings(list);
      
      // Gerar lista de segmentos únicos
      const uniqueSegments = ['Todos', ...new Set(list.map(t => t.segment).filter(Boolean))];
      setSegments(uniqueSegments);
    } catch (err) {
      console.error("Erro ao carregar treinamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = selectedSegment === 'Todos' 
    ? trainings 
    : trainings.filter(t => t.segment === selectedSegment);

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      
      {/* HERO SECTION DE TREINAMENTOS */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Educação Executiva & Técnica</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Nossos <br/>
              <span className="text-[#007a3d]">Treinamentos</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Capacitação técnica de alto nível para os desafios contínuos do setor florestal brasileiro.
          </p>

          <button 
              onClick={() => {
                  const section = document.getElementById('treinamentos-content');
                  if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
              }} 
              className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-[10px] hover:text-[#007a3d] transition-colors"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] transition-all">
                  <ChevronDown size={20} className="animate-bounce" />
              </div>
              Explorar Cursos
          </button>
        </div>
      </div>

      <main id="treinamentos-content" className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* SELEÇÃO DE SEGMENTO / FILTRO DINÂMICO */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
             <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               {segments.map(segment => (
                 <button
                   key={segment}
                   onClick={() => setSelectedSegment(segment)}
                   className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                     selectedSegment === segment 
                       ? 'bg-[#1f2937] text-white border-[#1f2937] shadow-xl' 
                       : 'bg-white text-gray-400 border-gray-100 hover:border-[#007a3d] hover:text-[#007a3d]'
                   }`}
                 >
                   {segment}
                 </button>
               ))}
             </div>
             
             <div className="hidden lg:flex items-center gap-4 text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">{filteredTrainings.length} Cursos disponíveis</span>
             </div>
          </div>

          {/* GRID DE TREINAMENTOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               Array(3).fill(0).map((_, i) => (
                 <div key={i} className="bg-white h-96 rounded-[40px] animate-pulse"></div>
               ))
            ) : (
              filteredTrainings.length > 0 ? (
                filteredTrainings.map((training) => (
                  <Link 
                    key={training.id} 
                    to={`/treinamentos/${training.slug}`}
                    className="group bg-white rounded-[48px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
                  >
                    <div className="h-64 relative overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(training.image_url)}
                        alt={training.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1599403816733-149d682054ea?q=80&w=2670'}
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#007a3d] shadow-md">{training.segment}</div>
                      {training.video_url && (
                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-[#007a3d] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                           <Play size={16} fill="white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-10 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] leading-tight mb-8 group-hover:text-[#007a3d] transition-colors">{training.title}</h3>
                      
                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#007a3d]">
                                 <Clock size={16} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{training.hours}</span>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#007a3d] group-hover:text-white transition-all shadow-inner">
                              <ArrowRight size={20} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                   <BookOpen size={48} className="mx-auto text-gray-200 mb-6" />
                   <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum treinamento encontrado nesta categoria.</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* CTA IN-COMPANY */}
      <section className="py-24 bg-[#1f2937] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <NoiseOverlay opacity={1} />
         </div>
         <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-white tracking-tighter mb-8 italic">Sua empresa quer <br/><span className="text-[#007a3d]">capacitar a equipe?</span></h2>
            <p className="text-gray-400 text-base mb-12 max-w-2xl mx-auto font-medium">Realizamos treinamentos customizados (In-Company) adaptados às necessidades específicas do seu negócio florestal.</p>
            <Link to="/treinamentos-in-company">
              <Button className="rounded-2xl font-black uppercase tracking-widest shadow-2xl">Consultar Projeto Customizado</Button>
            </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
}
