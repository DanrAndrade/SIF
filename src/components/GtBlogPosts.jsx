import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { BlockHeader } from './sections/SectionBlocks';
import { htmlExcerpt } from './sections/sectionTypes';

const fmt = (d) => (d ? new Date(String(d).replace(' ', 'T')).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

// Posts do blog de um Grupo Temático (blog_posts.gt_id).
//  - posts: lista já carregada pela página (senão busca sozinho pelo gtId)
//  - sec: bloco "Blog do grupo" (título/etiqueta escolhidos no painel)
// Some quando o grupo ainda não tem posts.
export default function GtBlogPosts({ gtId, posts: given, limit = 3, sec = null, dark = false }) {
  const [fetched, setFetched] = useState([]);
  useEffect(() => {
    if (given || !gtId) return;
    fetch(`${API_BASE_URL}/blog.php?gt_id=${encodeURIComponent(gtId)}`)
      .then(r => r.json()).then(d => setFetched(Array.isArray(d) ? d : [])).catch(() => setFetched([]));
  }, [gtId, given]);

  // Mais recentes primeiro; mostra pelo menos 3 (ou o que o painel pedir)
  const byDate = [...(given || fetched)].sort((x, y) => String(y.created_at || '').localeCompare(String(x.created_at || '')));
  const posts = byDate.slice(0, Math.max(3, Number(limit) || 3));
  if (posts.length === 0) return null;
  const header = sec || { title: 'Publicações recentes', eyebrow: 'Blog do grupo' };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <BlockHeader sec={header} dark={dark} className="mb-0" />
        <Link to="/blog" className={`group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${dark ? 'text-[#b5e05c]' : 'text-[var(--accent,#007a3d)]'}`}>
          Ver o blog completo <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}

// Card compacto de post: foto em cima, data, título e um resumo curto
function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group rounded-card overflow-hidden bg-white shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        {post.image_url
          ? <img src={getImageUrl(post.image_url, 640)} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          : <div className="w-full h-full bg-gradient-to-br from-[var(--accent,#007a3d)] to-[#0b3320]" />}
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2"><Calendar size={12} className="text-[var(--accent,#007a3d)]" /> {fmt(post.created_at)}</span>
        <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[var(--accent,#007a3d)] transition-colors leading-snug line-clamp-2">{post.title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">{htmlExcerpt(post.content, 140)}</p>
        {post.responsaveis?.length > 0 && <p className="mt-auto pt-4 text-xs text-gray-500 truncate">Por <strong className="text-gray-700 font-semibold">{post.responsaveis.map(r => r.name).join(', ')}</strong></p>}
      </div>
    </Link>
  );
}
