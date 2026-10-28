import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Button, { buttonClass, BtnArrow } from '../ui/Button';
import SmartLink from '../ui/SmartLink';
import DetailHero from '../DetailHero';
import EditablePageContact from '../EditablePageContact';
import ContentSectionsRenderer, { renderableSections, sectionAnchor } from '../ContentSectionsRenderer';
import { BlockHeader } from '../sections/SectionBlocks';
import { normalizeSections, isSectionEmpty } from '../sections/sectionTypes';
import { API_BASE_URL, cleanRichHtml } from '../../apiConfig';
import { http } from '../../utils/http';

// Layout padrão das páginas de detalhe de Evento, Treinamento e
// Treinamento In-Company (mesmo desenho estruturado do Grupo Temático):
//
//   1. topo (DetailHero) com chips e botões
//   2. faixa de informações rápidas (data, local, carga horária, situação...)
//   3. menu da página (âncoras), fixo ao rolar
//   4. "Sobre" em duas colunas + blocos montados no painel, em faixas
//   5. vídeo (campo "Link do vídeo") e card de contato da equipe
//
// Quem chama monta os dados (cada tipo guarda as coisas num lugar) e passa:
//   facts:   [{ icon, label, value, sub? }]  (só os preenchidos aparecem)
//   about:   { title, html, eyebrow? }       texto principal ("Sobre o evento")
//   sections: blocos salvos no painel (extra_data.sections)
//   cta:     { label, href }                 link de inscrição/proposta (opcional)
//   pageKey: página do contato geral ('eventos', 'treinamentos'...)

// Monta a lista final de blocos da página:
//  - o texto principal vira o bloco "Sobre" (duas colunas) no começo;
//    sem texto principal, o 1º bloco de Texto da página faz esse papel;
//  - o vídeo do formulário entra logo depois do "Sobre" (se não houver bloco de vídeo igual);
//  - o card de contato fica no fim.
export function buildDetailSections({ about, sections, videoUrl, hasContact, contactTitle }) {
  const list = normalizeSections(sections);
  const out = [];
  const aboutHtml = about?.html || '';
  const firstVisible = list.findIndex(s => s.visible !== false && !isSectionEmpty(s));
  let rest = list;
  if (!isSectionEmpty({ type: 'editor', content: aboutHtml })) {
    out.push({ id: 's-sobre', type: 'detail_about', title: about.title, eyebrow: about.eyebrow, content: aboutHtml });
  } else if (firstVisible >= 0 && list[firstVisible].type === 'editor') {
    const s = list[firstVisible];
    out.push({ ...s, type: 'detail_about', title: s.title || about?.title, eyebrow: s.eyebrow || about?.eyebrow });
    rest = list.filter((_, i) => i !== firstVisible);
  }
  const url = String(videoUrl || '').trim();
  const hasSameVideo = rest.some(s => s.type === 'video' && String(s.url || '').trim() === url);
  if (url && !hasSameVideo) out.push({ id: 's-video', type: 'video', title: 'Vídeo', url });
  out.push(...rest);
  if (hasContact) out.push({ id: 's-contato', type: 'detail_contact', title: contactTitle || 'Fale com a equipe' });
  return out;
}

// Faixa de informações rápidas: cartão branco que sobe um pouco sobre o topo
// (as linhas entre os itens são o fundo cinza aparecendo pelo espaço de 1px da grade)
function FactsStrip({ facts }) {
  const list = facts.filter(f => f && String(f.value || '').trim());
  if (!list.length) return null;
  const n = list.length;
  const cols = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }[n] || (n === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3');
  return (
    <div className="relative z-20 -mt-10 md:-mt-14 max-w-6xl mx-auto px-4 sm:px-6 w-full">
      {/* com 1 ou 2 itens a faixa fica do tamanho do conteúdo (não uma barra larga vazia) */}
      <dl className={`grid grid-cols-2 ${cols} ${n <= 2 ? 'sm:w-fit sm:min-w-[420px] max-w-full' : ''} gap-px bg-gray-100 rounded-card md:rounded-panel overflow-hidden shadow-card border border-gray-100`}>
        {list.map((f, i) => {
          const Icon = f.icon;
          // número ímpar de itens: no celular o último ocupa a linha inteira
          const wide = n % 2 === 1 && i === n - 1 ? 'col-span-2 sm:col-span-1' : '';
          return (
            <div key={i} className={`min-w-0 bg-white px-5 py-5 md:px-7 md:py-7 ${wide}`}>
              <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                {Icon && <Icon size={14} className="text-sif-green shrink-0" aria-hidden="true" />}{f.label}
              </dt>
              <dd className="mt-2 text-base md:text-xl font-semibold leading-snug text-sif-ink break-words">{f.value}</dd>
              {f.sub && <dd className="mt-1 text-sm text-gray-500 break-words">{f.sub}</dd>}
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function DetailLoading() {
  return (
    <div className="min-h-screen sif-page flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function DetailNotFound({ title, backHref, backLabel }) {
  return (
    <div className="min-h-screen sif-page flex flex-col">
      <Navbar scrolled />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="sif-title text-3xl text-gray-800 mb-4">{title}</h1>
        <Button href={backHref} variant="primary">{backLabel}</Button>
      </div>
      <Footer />
    </div>
  );
}

export default function DetailPage({
  cover, crumbs, eyebrow, title, summary, chips = [], facts = [], about, sections, videoUrl,
  cta, pageKey, contactTitle = 'Fale com a equipe', bandPhotos = [],
}) {
  const [contact, setContact] = useState(null);
  const [activeId, setActiveId] = useState('');

  // Contato geral da página (Painel › Eventos/Treinamentos › Contato responsável)
  useEffect(() => {
    if (!pageKey) return;
    let alive = true;
    http.get(`${API_BASE_URL}/page_content.php?page=${pageKey}`)
      .then(res => {
        const d = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
        if (alive && (d.contact_name || d.contact_email || d.contact_whatsapp)) setContact(d);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [pageKey]);

  const list = useMemo(
    () => buildDetailSections({ about, sections, videoUrl, hasContact: !!contact, contactTitle }),
    [about, sections, videoUrl, contact, contactTitle],
  );

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Blocos desta página com desenho próprio
  const special = {
    detail_about: (sec) => (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            {sec.eyebrow && <span className="sif-eyebrow mb-4">{sec.eyebrow}</span>}
            {sec.title && <h2 className="sif-title sif-h2 text-sif-ink">{sec.title}</h2>}
            <span className="hidden lg:block mt-8 h-px w-16 bg-sif-green/40" aria-hidden="true" />
          </div>
        </div>
        <div className="lg:col-span-8 min-w-0">
          <div className="prose prose-lg max-w-none text-gray-600 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-sif-ink prose-a:text-sif-green prose-strong:text-sif-ink prose-li:marker:text-sif-green prose-img:rounded-3xl [&>p:first-child]:text-xl [&>p:first-child]:leading-relaxed [&>p:first-child]:text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content || '') }} />
        </div>
      </div>
    ),
    detail_contact: (sec) => (
      <div className="max-w-3xl mx-auto">
        <BlockHeader sec={sec} align="center" size="md" className="mb-8" />
        <EditablePageContact pageKey={null} override={contact} layout="wide" />
      </div>
    ),
  };

  // Menu da página: blocos que aparecem e têm título
  const visible = renderableSections(list, special);
  const navItems = visible.filter(s => s.title).map(s => ({ id: sectionAnchor(s), title: s.title }));
  const navKey = navItems.map(n => n.id).join('|');

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
  }, [navKey]);

  const contactSec = visible.find(s => s.type === 'detail_contact');
  const onContact = contactSec ? () => go(sectionAnchor(contactSec)) : null;
  // inscrição no topo só quando leva para fora do site (ex.: Sympla)
  const ctaExternal = !!(cta && /^https?:\/\//i.test(cta.href));

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <DetailHero
        cover={cover} crumbs={crumbs} eyebrow={eyebrow} title={title} summary={summary} chips={chips}
        actions={(ctaExternal || onContact) ? <>
          {/* Topo só com: inscrição (quando é link externo) e contato.
              Botões que só rolam para seções da página ficam no menu da página. */}
          {ctaExternal && (
            <SmartLink href={cta.href} className={buttonClass('light', 'sm')}>
              <span className="py-2">{cta.label}</span><BtnArrow variant="light" size="sm" />
            </SmartLink>
          )}
          {onContact && (
            <button type="button" onClick={onContact} className={buttonClass(ctaExternal ? 'ghostLight' : 'light', 'sm')}>
              <span className="py-2">Falar com a equipe</span><BtnArrow variant={ctaExternal ? 'ghostLight' : 'light'} size="sm" icon={MessageCircle} />
            </button>
          )}
        </> : null}
      />

      <FactsStrip facts={facts} />

      {/* MENU DA PÁGINA (fixo ao rolar) */}
      {navItems.length > 1 && (
        <div className="sif-subnav sticky z-30 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav aria-label="Nesta página" className="flex gap-1 overflow-x-auto no-scrollbar p-1.5 rounded-full bg-white/85 backdrop-blur-md border border-gray-100 shadow-[var(--sif-shadow-card)] w-fit max-w-full">
              {navItems.map(n => (
                <button key={n.id} type="button" onClick={() => go(n.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${activeId === n.id ? 'bg-sif-green text-white' : 'text-gray-600 hover:text-sif-green'}`}>
                  {n.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <ContentSectionsRenderer sections={list} layout="page" special={special} bgPhoto={bandPhotos} />
      </main>

      <Footer />
    </div>
  );
}
