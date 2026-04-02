import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag as TagIcon, ArrowRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getImageUrl } from '../apiConfig';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the main post
        const postRes = await fetch(`${API_URL}?slug=${slug}`);
        
        // FIX: Check response status
        if (!postRes.ok) {
          throw new Error(`Erro HTTP: ${postRes.status}`);
        }
        
        const postData = await postRes.json();
        
        // FIX: Handle case where post is not found
        if (!postData || !postData.id) {
          throw new Error('Artigo não encontrado');
        }
        
        setPost(postData);
        
        // Fetch all posts for related posts
        try {
          const allPostsRes = await fetch(API_URL);
          if (allPostsRes.ok) {
            const allPosts = await allPostsRes.json();
            if (Array.isArray(allPosts)) {
              // FIX: Improved tag matching logic
              const currentTags = postData.tags 
                ? postData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
                : [];
              
              const filtered = allPosts.filter(p => {
                // Exclude the current post
                if (p.slug === postData.slug || String(p.id) === String(postData.id)) {
                  return false; 
                }
                
                // Match by tags
                if (currentTags.length > 0) {
                  const pTags = p.tags 
                    ? p.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
                    : [];
                  return pTags.some(tag => currentTags.includes(tag)); 
                }
                
                return false;
              });
              
              // FIX: Sort by date and limit to 3
              const sortedFiltered = filtered.sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
              );
              
              setRelatedPosts(sortedFiltered.slice(0, 3));
            }
          }
        } catch (relatedErr) {
          // FIX: Don't fail the whole page if related posts fail
          console.error('Erro ao carregar posts relacionados:', relatedErr);
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        setError(err.message || 'Não foi possível carregar o artigo. Por favor, tente novamente.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-[#059669]">
        Carregando Artigo...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans overflow-x-hidden">
        <Navbar scrolled={true} />
        <div className="flex-grow pt-32 container mx-auto px-6 max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="text-red-800 font-bold text-lg mb-2">Erro ao Carregar Artigo</p>
              <p className="text-red-600 mb-4">{error || 'Artigo não encontrado'}</p>
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-white bg-[#059669] px-6 py-3 rounded-full hover:bg-[#047857] font-bold uppercase text-[10px] tracking-widest transition-all"
              >
                <ArrowLeft size={16}/> Voltar ao Blog
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar scrolled={true} />
      
      <article className="flex-grow pt-32 container mx-auto px-6 max-w-4xl">
        {/* BOTÃO DE VOLTAR CLARO E VISÍVEL */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#059669] bg-emerald-50 px-6 py-3 rounded-full hover:bg-[#059669] hover:text-white mb-10 font-bold uppercase text-[10px] tracking-widest transition-all shadow-sm">
            <ArrowLeft size={16}/> Voltar ao Blog
        </Link>
        
        <div className="mb-16">
            <img 
                src={post.image_url ? getImageUrl(post.image_url) : 'https://via.placeholder.com/1200x800?text=SIF'} 
                className="w-full h-[500px] object-cover rounded-[56px] shadow-2xl border border-gray-100" 
                alt={post.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/1200x800?text=SIF';
                }}
                loading="eager"
            />
        </div>

        <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tighter uppercase">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#059669]"/> 
                  {/* FIX: Safe date formatting */}
                  {(() => {
                    try {
                      return new Date(post.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      });
                    } catch {
                      return 'Data indisponível';
                    }
                  })()}
                </span>
            </div>
        </header>

        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed sif-content-rich"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        <style dangerouslySetInnerHTML={{ __html: `
            .sif-content-rich img { 
                max-width: 100%; height: auto; border-radius: 24px; 
                margin: 40px auto; display: block; box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            }
            .sif-content-rich p { margin-bottom: 1.5rem; }
            .sif-content-rich h1, .sif-content-rich h2, .sif-content-rich h3 {
                margin-top: 2rem; margin-bottom: 1rem; font-weight: bold;
            }
            .sif-content-rich ul, .sif-content-rich ol {
                margin: 1.5rem 0; padding-left: 2rem;
            }
            .sif-content-rich a {
                color: #059669; text-decoration: underline;
            }
            .sif-content-rich blockquote {
                border-left: 4px solid #059669; padding-left: 1.5rem; 
                margin: 2rem 0; font-style: italic; color: #374151;
            }
        ` }} />

        {/* FIX: Only show tags if they exist */}
        {post.tags && post.tags.trim() && (
          <div className="flex flex-wrap gap-2 mt-12 mb-8 pt-8 border-t border-gray-100">
              {post.tags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if(!trimmedTag) return null;
                  return (
                      <span 
                        key={`${trimmedTag}-${index}`} 
                        className="px-5 py-2.5 bg-gray-50 border rounded-full text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-[#059669] hover:border-[#059669] transition-colors"
                      >
                          <TagIcon size={12}/> {trimmedTag}
                      </span>
                  )
              })}
          </div>
        )}

        {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-2xl font-bold uppercase text-[#059669] tracking-tighter mb-8">Leia Também</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map(relPost => (
                        <a 
                          key={relPost.id} 
                          href={`/blog/${relPost.slug}`} 
                          className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-100 transition-all hover:-translate-y-2 flex flex-col"
                        >
                            <div className="relative h-40 overflow-hidden flex-shrink-0 bg-gray-50">
                                <img 
                                    src={relPost.image_url ? getImageUrl(relPost.image_url) : 'https://via.placeholder.com/800x600?text=SIF'} 
                                    alt={relPost.title} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/800x600?text=SIF';
                                    }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    <Calendar size={12} className="text-[#059669]" /> 
                                    {/* FIX: Safe date formatting */}
                                    {(() => {
                                      try {
                                        return new Date(relPost.created_at).toLocaleDateString('pt-BR');
                                      } catch {
                                        return 'Data indisponível';
                                      }
                                    })()}
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 uppercase leading-tight group-hover:text-[#059669] transition-colors flex-grow">{relPost.title}</h4>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler</span>
                                    <ArrowRight size={14} className="text-[#059669] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        )}
      </article>

      <div className="w-full h-24 md:h-32 flex-shrink-0"></div>
      <Footer />
    </div>
  );
}