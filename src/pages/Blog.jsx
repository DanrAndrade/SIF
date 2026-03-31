import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { getImageUrl } from '../apiConfig';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* HERO SECTION DO BLOG */}
      <div className="relative h-[60vh] flex items-center pt-20 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f11] via-[#0f1f11]/60 to-transparent"></div>
          <NoiseOverlay opacity={0.3} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#92b735] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">SIF Media Center</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase text-white leading-[0.85] tracking-tighter mb-6">
              Blog e <br/>
              <span className="text-[#92b735]">Notícias</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-10">
              Conhecimento técnico, inovações e as principais atualizações da Sociedade de Investigações Florestais.
          </p>

          <button 
              onClick={() => {
                  const section = document.getElementById('blog-posts');
                  if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
              }} 
              className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-[10px] hover:text-[#92b735] transition-colors"
          >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  <ChevronDown size={18} className="animate-bounce" />
              </div>
              Explorar Notícias
          </button>
        </div>
      </div>

      <main id="blog-posts" className="container mx-auto px-6 pt-20 flex-grow scroll-mt-32">
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse uppercase tracking-widest">Carregando Artigos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map(post => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 transition-all hover:-translate-y-2">
               <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={getImageUrl(post.image_url)} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=SIF'}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2 uppercase leading-tight group-hover:text-[#2E7D32] transition-colors">{post.title}</h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler Completo</span>
                    <ArrowRight size={18} className="text-[#2E7D32] group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* BLOCO FÍSICO INVISÍVEL PARA FORÇAR O ESPAÇAMENTO DO FOOTER */}
      <div className="w-full h-24 md:h-32 flex-shrink-0"></div>

      <Footer />
    </div>
  );
}