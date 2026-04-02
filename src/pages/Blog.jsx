import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Calendar, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../apiConfig';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(API_URL);
        
        // FIX: Check response status
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar posts:', err);
        setError('Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#059669] selection:text-white flex flex-col">
      <Navbar />

      {/* HERO PADRÃO SIF REPLICADO */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">SIF Media Center</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Blog e <br/>
              <span className="text-[#059669]">Notícias</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Conhecimento técnico, inovações e as principais atualizações da Sociedade de Investigações Florestais.
          </p>

          <button 
              onClick={() => {
                  const section = document.getElementById('blog-posts');
                  if (section) {
                      const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
                      window.scrollTo({top: y, behavior: 'smooth'});
                  }
              }} 
              className="group flex flex-col items-start gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#059669]"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-all shadow-sm">
                  <ChevronDown className="animate-bounce" size={20} />
              </div>
          </button>
        </div>
      </div>

      <main id="blog-posts" className="container mx-auto px-6 py-24 flex-grow scroll-mt-32">
        {/* FIX: Add error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-12 flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-red-800 font-bold text-lg mb-2">Erro ao Carregar Publicações</p>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse uppercase tracking-widest">Carregando Artigos...</div>
        ) : posts.length === 0 && !error ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase tracking-widest mb-4">Nenhuma publicação disponível</p>
            <p className="text-gray-500">Volte em breve para conferir nossos artigos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map(post => (
              <a 
                key={post.id} 
                href={`/blog/${post.slug}`} 
                className="group bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 transition-all hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={post.image_url ? getImageUrl(post.image_url) : 'https://via.placeholder.com/800x600?text=SIF'} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=SIF';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#059669] text-xs font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} /> 
                    {/* FIX: Add try-catch for date formatting */}
                    {(() => {
                      try {
                        return new Date(post.created_at).toLocaleDateString('pt-BR');
                      } catch {
                        return 'Data indisponível';
                      }
                    })()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2 uppercase leading-tight group-hover:text-[#059669] transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler Completo</span>
                    <ArrowRight size={18} className="text-[#059669] group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}