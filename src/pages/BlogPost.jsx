import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}?slug=${slug}`).then(res => res.json()).then(setPost);
    window.scrollTo(0,0);
  }, [slug]);

  if (!post) return <div className="h-screen flex items-center justify-center font-bold text-[#2E7D32]">Carregando Artigo...</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar scrolled={true} />
      
      {/* pb-32 garante o espaçamento do footer solicitado */}
      <article className="flex-grow pt-32 pb-32 container mx-auto px-6 max-w-4xl">
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
        <div className="flex flex-wrap gap-2 mt-24 pt-10 border-t border-gray-50">
            {post.tags?.split(',').map(tag => (
                <span key={tag} className="px-5 py-2.5 bg-gray-50 border rounded-full text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-[#2E7D32] hover:border-[#2E7D32] transition-colors">
                    <TagIcon size={12}/> {tag.trim()}
                </span>
            ))}
        </div>
      </article>

      <Footer />
    </div>
  );
}