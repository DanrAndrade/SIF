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

  const posts = (given || fetched).slice(0, limit);
  if (posts.length === 0) return null;
  const header = sec || { title: 'Publicações recentes', eyebrow: 'Blog do grupo' };
  // 1 ou 2 posts: cards iguais lado a lado; 3+: o mais recente em destaque + lista
  const featured = posts.length >= 3;
  const [first, ...rest] = featured ? posts : [posts[0]];
  const pair = featured ? [] : posts.slice(1);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <BlockHeader sec={header} dark={dark} className="mb-0" />
        <Link to="/blog" className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline ${dark ? 'text-[#b5e05c]' : 'text-[var(--accent,#007a3d)]'}`}>
          Ver o blog completo <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BigCard post={first} />
        {pair.map(p => <BigCard key={p.id} post={p} />)}
        {rest.length > 0 && (
          <div className="grid gap-6 content-start">
            {rest.map(p => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group sif-card sif-card-hover rounded-[28px] overflow-hidden border border-gray-100 flex">
                {p.image_url && (
                  <div className="w-32 md:w-44 shrink-0 overflow-hidden bg-gray-100">
                    <img src={getImageUrl(p.image_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5 md:p-6 flex flex-col justify-center min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{fmt(p.created_at)}</span>
                  <h3 className="font-semibold text-[#1f2937] group-hover:text-[var(--accent,#007a3d)] transition-colors leading-snug line-clamp-2">{p.title}</h3>
                  {p.responsaveis?.length > 0 && <p className="text-xs text-gray-500 mt-2 truncate">Por {p.responsaveis.map(r => r.name).join(', ')}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Card grande de post (imagem em cima)
function BigCard({ post: first }) {
  return (
    <Link to={`/blog/${first.slug}`} className="group sif-card sif-card-hover rounded-[32px] overflow-hidden border border-gray-100 flex flex-col">
      {first.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img src={getImageUrl(first.image_url)} alt={first.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      )}
      <div className="p-7 md:p-9 flex flex-col flex-grow">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3"><Calendar size={13} className="text-[var(--accent,#007a3d)]" /> {fmt(first.created_at)}</span>
        <h3 className="text-xl md:text-2xl font-semibold text-[#1f2937] group-hover:text-[var(--accent,#007a3d)] transition-colors leading-snug">{first.title}</h3>
        <p className="mt-3 text-gray-500 leading-relaxed line-clamp-3">{htmlExcerpt(first.content, 220)}</p>
        {first.responsaveis?.length > 0 && <p className="mt-auto pt-5 text-sm text-gray-500">Por <strong className="text-gray-700 font-semibold">{first.responsaveis.map(r => r.name).join(', ')}</strong></p>}
      </div>
    </Link>
  );
}
