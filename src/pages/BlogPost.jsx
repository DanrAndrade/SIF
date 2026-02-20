import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag as TagIcon, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}?slug=${slug}`)
      .then(res => res.json())
      .then(postData => {
        setPost(postData);
        
        fetch(API_URL)
          .then(res => res.json())
          .then(allPosts => {
            if (Array.isArray(allPosts)) {
              const currentTags = postData.tags ? postData.tags.split(',').map(t => t.trim().toLowerCase()) : [];
              
              const filtered = allPosts.filter(p => {
                // CORREÇÃO: Compara o slug ou converte o ID para String para garantir que não vai falhar por diferença de tipo (texto vs número)
                if (p.slug === postData.slug || String(p.id) === String(postData.id)) {
                    return false; 
                }
                
                const pTags = p.tags ? p.tags.split(',').map(t => t.trim().toLowerCase()) : [];
                return pTags.some(tag => currentTags.includes(tag)); 
              });
              
              setRelatedPosts(filtered.slice(0, 3));
            }
          });
      });
      
    window.scrollTo(0,0);
  }, [slug]);

  if (!post) return <div className="h-screen flex items-center justify-center font-bold text-[#2E7D32]">Carregando Artigo...</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar scrolled={true} />
      
      <article className="flex-grow pt-32 container mx-auto px-6 max-w-4xl">
        <a href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-[#2E7D32] mb-12 font-bold uppercase text-[10px] tracking-widest transition-colors"><ArrowLeft size={16}/> Voltar ao Blog</a>
        
        {/* 1. Imagem de Capa (Hero) */}
        <div className="mb-16">
            <img src={post.image_url} className="w-full h-[500px] object-cover rounded-[56px] shadow-2xl border border-gray-100" alt={post.title} />
        </div>

        {/* 2. Título */}
        <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tighter uppercase">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#2E7D32]"/> {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
        </header>

        {/* 3. Conteúdo Rico (HTML do Editor) */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed sif-content-rich"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* 4. Tags de Rodapé */}
        <div className="flex flex-wrap gap-2 mt-8 mb-8 pt-6 border-t border-gray-100">
            {post.tags?.split(',').map(tag => {
                if(!tag.trim()) return null;
                return (
                    <span key={tag} className="px-5 py-2.5 bg-gray-50 border rounded-full text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-[#2E7D32] hover:border-[#2E7D32] transition-colors">
                        <TagIcon size={12}/> {tag.trim()}
                    </span>
                )
            })}
        </div>

        {/* 5. Seção: Leia Também */}
        {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-2xl font-bold uppercase text-[#1B5E20] tracking-tighter mb-8">Leia Também</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map(relPost => (
                        <a key={relPost.id} href={`/blog/${relPost.slug}`} className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-100 transition-all hover:-translate-y-2 flex flex-col">
                            <div className="relative h-40 overflow-hidden flex-shrink-0">
                                <img src={relPost.image_url || 'https://via.placeholder.com/800x600'} alt={relPost.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    <Calendar size={12} /> {new Date(relPost.created_at).toLocaleDateString()}
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 uppercase leading-tight group-hover:text-[#2E7D32] transition-colors flex-grow">{relPost.title}</h4>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler</span>
                                    <ArrowRight size={14} className="text-[#2E7D32] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        )}
      </article>

      {/* BLOCO FÍSICO INVISÍVEL PARA FORÇAR O ESPAÇAMENTO DO FOOTER */}
      <div className="w-full h-24 md:h-32 flex-shrink-0"></div>

      <Footer />
    </div>
  );
}