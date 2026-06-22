import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, Tag as TagIcon, ArrowRight, AlertCircle, Newspaper } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl, cleanRichHtml } from '../apiConfig';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';

const API_URL = `${API_BASE_URL}/blog.php`;

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Data indisponível';
  }
};

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

        const postRes = await fetch(`${API_URL}?slug=${slug}`);
        if (!postRes.ok) {
          throw new Error(`Erro HTTP: ${postRes.status}`);
        }

        const postData = await postRes.json();
        if (!postData || !postData.id) {
          throw new Error('Artigo não encontrado');
        }

        setPost(postData);

        try {
          const allPostsRes = await fetch(API_URL);
          if (allPostsRes.ok) {
            const allPosts = await allPostsRes.json();
            if (Array.isArray(allPosts)) {
              const currentTags = postData.tags
                ? postData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
                : [];

              const filtered = allPosts.filter(p => {
                if (p.slug === postData.slug || String(p.id) === String(postData.id)) {
                  return false;
                }
                if (currentTags.length > 0) {
                  const pTags = p.tags
                    ? p.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
                    : [];
                  return pTags.some(tag => currentTags.includes(tag));
                }
                return false;
              });

              const sortedFiltered = filtered.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
              );

              setRelatedPosts(sortedFiltered.slice(0, 3));
            }
          }
        } catch (relatedErr) {
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

    window.scrollTo(0, 0);
    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Artigo não encontrado</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error || 'Este artigo não está mais disponível.'}</p>
        <Link to="/blog">
          <Button variant="primary" className="rounded-xl">Voltar ao Blog</Button>
        </Link>
      </div>
    );
  }

  let extraSections = null;
  try {
    const extra = post.extra_data ? JSON.parse(post.extra_data) : {};
    if (extra.sections?.length) extraSections = extra.sections;
  } catch { /* extra_data inválido — ignora */ }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* HERO — foto da matéria se houver, senão degradê escuro */}
      <div className="relative h-[65vh] flex items-center pt-20 overflow-hidden bg-[#1f2937]">
        <div className="absolute inset-0 z-0">
          {post.image_url
            ? <>
                <img
                  src={getImageUrl(post.image_url)}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-60"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              </>
            : <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-[#1B5E20]/30" />
          }
          <NoiseOverlay opacity={0.2} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-10 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md group-hover:bg-[#007a3d] transition-all">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-1">Voltar para o Blog</span>
          </Link>

          <div className="max-w-4xl flex flex-col gap-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest border border-white/10 w-fit">Blog &amp; Notícias</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-[0.95]">
              {post.title}
            </h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-[#7FBA00]" /> {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <section className="py-24 relative -mt-20 z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12">

            <div className="bg-white rounded-[48px] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[400px]">
              <div className="flex items-center gap-6 mb-16">
                <div className="p-4 rounded-3xl bg-gray-50 text-[#007a3d]">
                  <Newspaper size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter">Artigo</h3>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest mt-1">SIF Media Center</p>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#1B5E20] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d] prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: cleanRichHtml(post.content) }}
              />

              {extraSections && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <ContentSectionsRenderer sections={extraSections} />
                </div>
              )}

              {post.tags && post.tags.trim() && (
                <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-gray-100">
                  {post.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span
                        key={`${trimmedTag}-${index}`}
                        className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-[#007a3d] hover:border-[#007a3d] transition-colors"
                      >
                        <TagIcon size={12} /> {trimmedTag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* LEIA TAMBÉM */}
      {relatedPosts.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold uppercase text-[#007a3d] tracking-tighter mb-8">Leia Também</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relPost => (
                <Link
                  key={relPost.id}
                  to={`/blog/${relPost.slug}`}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-lg border border-gray-100 transition-all hover:-translate-y-2 flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden flex-shrink-0 bg-gray-50">
                    {relPost.image_url && (
                      <img
                        src={getImageUrl(relPost.image_url)}
                        alt={relPost.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                      <Calendar size={12} className="text-[#007a3d]" />
                      {formatDate(relPost.created_at)}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 uppercase leading-tight group-hover:text-[#007a3d] transition-colors flex-grow">{relPost.title}</h4>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Ler</span>
                      <ArrowRight size={14} className="text-[#007a3d] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
