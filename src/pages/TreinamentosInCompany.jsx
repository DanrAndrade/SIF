import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import { ArrowRight, BookOpen, Clock, Play } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Bespoke Solutions',
  hero_title_line1: 'Treinamentos',
  hero_title_highlight: 'In-Company',
  hero_subtitle: 'Soluções personalizadas em educação corporativa, levadas diretamente ao coração da sua empresa.',
  hero_scroll_label: 'Explorar Soluções',
};

export default function TreinamentosInCompany() {
  const [trainings, setTrainings] = useState([]);
  const [segments, setSegments] = useState(['Todos']);
  const [selectedSegment, setSelectedSegment] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrainings(); }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/treinamentos_in_company.php`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTrainings(list);
      const uniqueSegments = ['Todos', ...new Set(list.map(t => t.segment).filter(Boolean))];
      setSegments(uniqueSegments);
    } catch (err) {
      console.error('Erro ao carregar treinamentos in-company:', err);
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

      <EditablePageHero pageKey="treinamentos_in_company" defaults={HERO_DEFAULTS} scrollTargetId="tic-content" />

      <main id="tic-content" className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white h-96 rounded-[40px] animate-pulse"></div>
              ))
            ) : filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <Link
                  key={training.id}
                  to={`/treinamentos-in-company/${training.slug}`}
                  className="group bg-white rounded-[48px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
                >
                  <div className="h-64 relative overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(training.image_url)}
                      alt={training.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    {training.segment && (
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#007a3d] shadow-md">{training.segment}</div>
                    )}
                    {training.video_url && (
                      <div className="absolute bottom-6 right-6 w-10 h-10 bg-[#007a3d] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                        <Play size={16} fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] leading-tight mb-8 group-hover:text-[#007a3d] transition-colors">{training.title}</h3>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                          {training.hours && (
                            <>
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#007a3d]">
                                <Clock size={16} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{training.hours}</span>
                            </>
                          )}
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
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
