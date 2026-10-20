import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

// "Blog do grupo": posts do blog ligados a um Grupo Temático (blog_posts.gt_id).
// Some quando o grupo ainda não tem posts.
export default function GtBlogPosts({ gtId, limit = 6 }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!gtId) return;
    fetch(`${API_BASE_URL}/blog.php?gt_id=${encodeURIComponent(gtId)}`)
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d) ? d.slice(0, limit) : []))
      .catch(() => setPosts([]));
  }, [gtId, limit]);

  if (posts.length === 0) return null;

  const fmt = (d) => d ? new Date(d.replace(' ', 'T')).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <section className="py-16 bg-[#f8f9fa]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-3 block">Blog do grupo</span>
            <h2 className="sif-title text-3xl md:text-4xl text-[#1f2937]">Publicações recentes</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#007a3d] hover:underline">
            Ver o blog completo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
              {p.image_url && (
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img src={getImageUrl(p.image_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3"><Calendar size={12} className="text-[#007a3d]" /> {fmt(p.created_at)}</span>
                <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#007a3d] transition-colors leading-snug line-clamp-3">{p.title}</h3>
                {p.responsaveis?.length > 0 && <p className="text-xs text-gray-500 mt-3">Por {p.responsaveis.map(r => r.name).join(', ')}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
