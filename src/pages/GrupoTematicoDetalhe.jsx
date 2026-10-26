import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, Newspaper } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import ContentSectionsRenderer, { renderableSections, sectionAnchor } from '../components/ContentSectionsRenderer';
import EditablePageContact from '../components/EditablePageContact';
import DetailHero from '../components/DetailHero';
import GtBlogPosts from '../components/GtBlogPosts';
import { BlockHeader } from '../components/sections/SectionBlocks';
import { withGtDefaults, htmlExcerpt } from '../components/sections/sectionTypes';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { buttonClass, BtnArrow } from '../components/ui/Button';

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
  // Responsável = usuário do painel escolhido no GT (perfil vem do usuário).
  // GT antigo, ainda sem usuário escolhido: mostra o texto que estava salvo no grupo.
  const resp = gt?.responsavel || (!gt?.responsavel_id ? extra.responsavel : null) || {};
  const responsavel = (resp.name || resp.email || resp.whatsapp) ? {
    contact_name: resp.name, contact_role: resp.role, contact_email: resp.email, contact_whatsapp: resp.whatsapp,
    contact_photo: resp.photo, contact_link: resp.link, contact_link_label: resp.link_label,
  } : null;
  const hasContact = !!responsavel; // sem responsável, o card não aparece
  const intro = sections.find(s => s.type === 'gt_intro');
  const summary = extra.summary || htmlExcerpt(intro?.content || gt?.description || '', 220);

  usePageTitle(gt?.title);
  useSeo({ description: summary, image: gt?.image_url ? getImageUrl(gt.image_url) : undefined });

  // Blocos especiais
  const special = {
    gt_blog: (sec) => (posts && posts.length ? <GtBlogPosts posts={posts} limit={sec.limit || 3} sec={sec} /> : null),
    gt_contact: (sec) => (!hasContact ? null :
      <div className="max-w-3xl mx-auto">
        <BlockHeader sec={sec} align="center" size="md" className="mb-8" />
        <EditablePageContact pageKey={null} fallbackTitle="Responsável pelo grupo" override={responsavel} layout="wide" />
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
  const cover = gt.image_url ? getImageUrl(gt.image_url, 1920) : '';
  // Fundo das faixas escuras: capa do grupo; sem capa, a 1ª foto da página
  const pagePhotos = (sections || []).flatMap(s => [s.image, ...(s.images || [])]).filter(Boolean);
  const bandPhoto = [gt.image_url, ...pagePhotos].filter(Boolean).slice(0, 6).map(p => getImageUrl(p, 1280));
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const contactSec = visible.find(s => s.type === 'gt_contact');
  const blogSec = visible.find(s => s.type === 'gt_blog');

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white" style={accentVars}>
      <Navbar />

      {/* TOPO (padrão das páginas de detalhe) */}
      <DetailHero
        cover={cover} accent={color}
        crumbs={[{ label: 'Grupos Temáticos', to: '/grupos-tematicos' }]}
        eyebrow="Grupo Temático"
        title={gt.title} summary={summary}
        actions={<>
          {contactSec && (
            <button type="button" onClick={() => go(sectionAnchor(contactSec))} className={buttonClass('light')}>
              <span className="py-2">Falar com o responsável</span><BtnArrow variant="light" icon={MessageCircle} />
            </button>
          )}
          {blogSec && (
            <button type="button" onClick={() => go(sectionAnchor(blogSec))} className={buttonClass('ghostLight')}>
              <span className="py-2">{posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}</span><BtnArrow variant="ghostLight" icon={Newspaper} />
            </button>
          )}
          {responsavel?.contact_name && (
            <span className="inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/85 text-sm">
              {responsavel.contact_photo
                ? <img src={getImageUrl(responsavel.contact_photo, 160)} alt="" className="w-8 h-8 rounded-full object-cover" />
                : <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{responsavel.contact_name.charAt(0)}</span>}
              <span>Responsável: <strong className="font-semibold text-white">{responsavel.contact_name}</strong></span>
            </span>
          )}
        </>}
      />

      {/* MENU DA PÁGINA (fixo ao rolar) */}
      {navItems.length > 1 && (
        <div className="sif-subnav sticky z-30 mt-6">
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
        <ContentSectionsRenderer sections={sections} layout="page" special={special} bgPhoto={bandPhoto} />
      </main>

      <Footer />
    </div>
  );
}
