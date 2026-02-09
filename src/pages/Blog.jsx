import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Calendar, ArrowRight, PlayCircle, FileText } from 'lucide-react';

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
      <div className="relative h-[60vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-50 rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter">Blog e Notícias <br/> <span className="text-[#4ADE80]">SIF</span></h1>
        </div>
      </div>

      <main className="container mx-auto px-6 py-20 flex-grow">
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse uppercase tracking-widest">Carregando Artigos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map(post => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 transition-all hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img src={post.image_url || 'https://via.placeholder.com/800x600'} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
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
      <Footer />
    </div>
  );
}