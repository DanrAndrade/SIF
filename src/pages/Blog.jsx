import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import { Calendar, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import { API_BASE_URL, getImageUrl, toDate } from '../apiConfig';

const API_URL = `${API_BASE_URL}/blog.php`;

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'SIF Media Center',
  hero_title_line1: 'Blog e',
  hero_title_highlight: 'Notícias',
  hero_subtitle: 'Conhecimento técnico, inovações e as principais atualizações da Sociedade de Investigações Florestais.',
  hero_scroll_label: '',
};

export default function Blog() {
  usePageTitle('Blog'); // título da aba do navegador / Google
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(API_URL);

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
    <div className="sif-page min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      <EditablePageHero pageKey="blog" defaults={HERO_DEFAULTS} scrollTargetId="blog-posts" />

      <main id="blog-posts" className="container mx-auto px-6 pt-16 pb-40 flex-grow scroll-mt-32">
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
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-card overflow-hidden shadow-xl border border-gray-100 transition-all hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={post.image_url ? getImageUrl(post.image_url, 800) : null}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${!post.image_url ? 'hidden' : ''}`}
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#007a3d] text-xs font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} />
                    {(() => {
                      try {
                        return toDate(post.created_at)?.toLocaleDateString('pt-BR') || '';
                      } catch {
                        return 'Data indisponível';
                      }
                    })()}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-[#007a3d] transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler Completo</span>
                    <ArrowRight size={18} className="text-[#007a3d] group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
