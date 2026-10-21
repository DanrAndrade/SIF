import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowDown, MessageCircle, Newspaper, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import ContentSectionsRenderer, { renderableSections, sectionAnchor } from '../components/ContentSectionsRenderer';
import EditablePageContact from '../components/EditablePageContact';
import GtBlogPosts from '../components/GtBlogPosts';
import { BlockHeader } from '../components/sections/SectionBlocks';
import { withGtDefaults, htmlExcerpt } from '../components/sections/sectionTypes';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

// Página de um Grupo Temático: topo com capa, menu da página (âncoras) e
// blocos configuráveis em faixas (ordem, conteúdo e fundo vêm do painel).
// Blocos especiais: "Blog do grupo" e "Responsável" (posição também configurável).

function parseExtra(gt) {
  try { return gt?.extra_data ? JSON.parse(gt.extra_data) || {} : {}; } catch { return {}; }
}

export default function GrupoTematicoDetalhe() {
  const { slug } = useParams();
  const [gt, setGt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/gt.php?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => setGt(d && d.title ? d : null))
      .catch(() => setGt(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!gt?.id) return;
    fetch(`${API_BASE_URL}/blog.php?gt_id=${gt.id}`)
      .then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : [])).catch(() => setPosts([]));
  }, [gt?.id]);

  const extra = useMemo(() => parseExtra(gt), [gt]);
  const sections = useMemo(() => (gt ? withGtDefaults(extra.sections, gt.description || '') : []), [gt, extra]);
  const resp = extra.responsavel || {};
  const responsavel = (resp.name || resp.email || resp.whatsapp) ? {
    contact_name: resp.name, contact_role: resp.role, contact_email: resp.email, contact_whatsapp: resp.whatsapp,
    contact_photo: resp.photo, contact_link: resp.link, contact_link_label: resp.link_label,
  } : null;
  const intro = sections.find(s => s.type === 'gt_intro');
  const summary = extra.summary || htmlExcerpt(intro?.content || gt?.description || '', 220);

  usePageTitle(gt?.title);
  useSeo({ description: summary, image: gt?.image_url ? getImageUrl(gt.image_url) : undefined });

  // Blocos especiais
  const special = {
    gt_blog: (sec) => (posts && posts.length ? <GtBlogPosts posts={posts} limit={sec.limit || 3} sec={sec} /> : null),
    gt_contact: (sec) => (
      <div className="max-w-3xl mx-auto">
        <BlockHeader sec={sec} align="center" size="md" className="mb-8" />
        <EditablePageContact pageKey="gt" fallbackTitle="Responsável pelo grupo" override={responsavel} />
      </div>
    ),
  };

  // Menu da página: blocos que aparecem e têm título
  const visible = renderableSections(sections, special)
    .filter(s => !(s.type === 'gt_blog' && !(posts && posts.length)));
  const navItems = visible.filter(s => s.title).map(s => ({ id: sectionAnchor(s), title: s.title }));

  useEffect(() => {
    if (!navItems.length || typeof IntersectionObserver === 'undefined') return;
    const els = navItems.map(n => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActiveId(hit.target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems.map(n => n.id).join('|')]);

  if (loading) {
    return (
      <div className="min-h-screen sif-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!gt) {
    return (
      <div className="min-h-screen sif-page flex flex-col">
        <Navbar scrolled />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="sif-title text-3xl text-gray-800 mb-4">Grupo Temático não encontrado</h1>
          <Button href="/grupos-tematicos" variant="primary">Ver todos os grupos</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const color = /^#[0-9a-f]{6}$/i.test(gt.color || '') ? gt.color : '#007a3d';
  const accentVars = {
    '--accent': color,
    '--accent-soft': `color-mix(in srgb, ${color} 12%, #ffffff)`,
    '--accent-tint': `color-mix(in srgb, ${color} 6%, #ffffff)`,
  };
  const cover = gt.image_url ? getImageUrl(gt.image_url) : '';
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const contactSec = visible.find(s => s.type === 'gt_contact');
  const blogSec = visible.find(s => s.type === 'gt_blog');

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white" style={accentVars}>
      <Navbar />

      {/* TOPO */}
      <header className="relative min-h-[72vh] flex items-end pt-32 pb-16 md:pb-20 overflow-hidden bg-[#0b2116] rounded-bl-[40px] md:rounded-bl-[80px]">
        {cover && <img src={cover} alt="" fetchpriority="high" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, rgba(5,18,11,.92) 0%, rgba(5,18,11,.72) 45%, ${color}55 100%)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="sif-pattern-on-dark absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="relative w-full max-w-6xl mx-auto px-6">
          <nav aria-label="Você está em" className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <Link to="/" className="hover:text-white">Início</Link><ChevronRight size={12} />
            <Link to="/grupos-tematicos" className="hover:text-white">Grupos Temáticos</Link><ChevronRight size={12} />
            <span className="text-white/90 truncate">{gt.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}><Target size={20} /></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b5e05c]">Grupo Temático</span>
          </div>
          <h1 className="sif-title text-4xl sm:text-5xl md:text-7xl text-white leading-[1.05] max-w-4xl">{gt.title}</h1>
          {summary && <p className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl">{summary}</p>}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {contactSec && (
              <button type="button" onClick={() => go(sectionAnchor(contactSec))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0b2116] text-xs font-bold uppercase tracking-widest hover:bg-[#7FBA00] hover:text-white transition-colors">
                <MessageCircle size={16} /> Falar com o responsável
              </button>
            )}
            {blogSec && (
              <button type="button" onClick={() => go(sectionAnchor(blogSec))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                <Newspaper size={16} /> {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
              </button>
            )}
            {responsavel?.contact_name && (
              <span className="inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/85 text-sm">
                {responsavel.contact_photo
                  ? <img src={getImageUrl(responsavel.contact_photo)} alt="" className="w-8 h-8 rounded-full object-cover" />
                  : <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{responsavel.contact_name.charAt(0)}</span>}
                <span>Responsável: <strong className="font-semibold text-white">{responsavel.contact_name}</strong></span>
              </span>
            )}
          </div>
        </div>
        {navItems.length > 0 && (
          <button type="button" onClick={() => go(navItems[0].id)} aria-label="Ir para o conteúdo"
            className="absolute bottom-6 right-6 md:right-10 w-11 h-11 rounded-full border border-white/25 text-white/80 flex items-center justify-center hover:bg-white/10 animate-bounce">
            <ArrowDown size={18} />
          </button>
        )}
      </header>

      {/* MENU DA PÁGINA (fixo ao rolar) */}
      {navItems.length > 1 && (
        <div className="sticky top-[72px] z-30 mt-6">
          <div className="max-w-6xl mx-auto px-6">
            <nav aria-label="Nesta página" className="flex gap-1 overflow-x-auto no-scrollbar p-1.5 rounded-full bg-white/85 backdrop-blur-md border border-gray-100 shadow-[var(--sif-shadow-card)] w-fit max-w-full">
              {navItems.map(n => (
                <button key={n.id} type="button" onClick={() => go(n.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${activeId === n.id ? 'bg-[var(--accent)] text-white' : 'text-gray-600 hover:text-[var(--accent)]'}`}>
                  {n.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* BLOCOS */}
      <main className="flex-grow">
        <ContentSectionsRenderer sections={sections} layout="page" special={special} />
      </main>

      <Footer />
    </div>
  );
}
