import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, Download } from 'lucide-react';
import { BLOCKS } from '../sections/SectionBlocks';
import { PROJECT_BLOCKS } from '../sections/projectBlocks';
import { SECTION_TYPES, visibleSections, isSectionEmpty } from '../sections/sectionTypes';
import { cleanRichHtml, htmlToText, getImageUrl, toExternalUrl, heroW } from '../../apiConfig';
import { buttonClass, BtnArrow } from '../ui/Button';

// Página de Projeto no formato "dossiê": cabeçalho editorial, faixa de ficha
// técnica, índice lateral fixo (com progresso) e capítulos numerados.
// Os capítulos são os blocos do projeto (ordem, ocultar e título vêm do painel).

const ALL_BLOCKS = { ...BLOCKS, ...PROJECT_BLOCKS };
const num = (i) => String(i + 1).padStart(2, '0');
const proseCls = 'prose prose-lg max-w-none text-gray-600 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-sif-green prose-strong:text-inherit prose-li:marker:text-sif-green prose-img:rounded-3xl';

export function buildChapters({ description, sections, aboutTitle = 'Sobre o projeto' }) {
  const list = [];
  if (htmlToText(description || '').trim()) {
    list.push({ id: 'cap-sobre', title: aboutTitle, html: cleanRichHtml(description) });
  }
  visibleSections(sections).forEach((sec) => {
    if (!ALL_BLOCKS[sec.type] || isSectionEmpty(sec)) return;
    list.push({ id: `cap-${sec.id}`, title: (sec.title || '').trim() || SECTION_TYPES[sec.type]?.label || '', sec });
  });
  return list;
}

function Chapter({ cap, index }) {
  const Block = cap.sec ? ALL_BLOCKS[cap.sec.type] : null;
  return (
    <section id={cap.id} data-chapter className="scroll-mt-28 py-12 md:py-14 border-t border-gray-200/80 first:border-t-0 first:pt-0">
      <div className="grid md:grid-cols-[3.25rem_minmax(0,1fr)] md:gap-x-4">
        <span aria-hidden="true" className="hidden md:block pt-2.5 text-sm font-semibold tabular-nums text-sif-green">{num(index)}</span>
        <div className="min-w-0">
          {cap.title && (
            <h2 className="sif-title text-2xl md:text-4xl leading-tight text-sif-ink mb-8">
              <span aria-hidden="true" className="md:hidden mr-3 text-sm font-semibold tabular-nums text-sif-green">{num(index)}</span>
              {cap.title}
            </h2>
          )}
          {cap.html
            ? <div className={proseCls} dangerouslySetInnerHTML={{ __html: cap.html }} />
            : Block && <Block sec={{ ...cap.sec, title: '', eyebrow: '' }} dark={false} />}
        </div>
      </div>
    </section>
  );
}

// Índice lateral: destaca o capítulo atual e preenche a linha conforme a leitura
function ChapterIndex({ chapters, mainRef }) {
  const [active, setActive] = useState(chapters[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = chapters.map(c => document.getElementById(c.id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = mainRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.45 - r.top) / Math.max(1, r.height);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [mainRef]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav aria-label="Neste projeto" className="hidden lg:block lg:sticky lg:top-[calc(var(--sif-nav-h)+2rem)] self-start">
      <p className="sif-eyebrow mb-5">Neste projeto</p>
      <div className="relative pl-5">
        <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
        <span aria-hidden="true" className="absolute left-0 top-0 w-px bg-sif-green transition-[height] duration-200" style={{ height: `${progress * 100}%` }} />
        <ol className="space-y-3.5">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button type="button" onClick={() => go(c.id)}
                className={`group w-full text-left flex items-baseline gap-3 text-sm leading-snug transition-colors ${active === c.id ? 'text-sif-ink font-semibold' : 'text-gray-500 hover:text-sif-ink'}`}>
                <span className={`tabular-nums text-xs ${active === c.id ? 'text-sif-green' : 'text-gray-400'}`}>{num(i)}</span>
                <span>{c.title || SECTION_TYPES[c.sec?.type]?.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default function ProjectDossier({ projeto, status, ficha = [], lead = '', chapters = [], tx = {}, contact }) {
  const mainRef = useRef(null);
  const cover = projeto.image_url ? getImageUrl(projeto.image_url, heroW()) : '';
  const prazo = projeto.data_limite ? new Date(projeto.data_limite + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  const facts = useMemo(() => {
    const rows = [];
    if (status) rows.push({ label: 'Situação', value: status, tone: status === 'Em Andamento' ? 'live' : '' });
    if (projeto.tag) rows.push({ label: 'Área', value: projeto.tag });
    if (projeto.lab) rows.push({ label: 'Laboratório / GT', value: projeto.lab });
    if (prazo) rows.push({ label: 'Prazo', value: prazo });
    (ficha || []).forEach(r => { if (r && String(r.value || '').trim()) rows.push({ label: r.label || '—', value: r.value }); });
    return rows;
  }, [status, projeto.tag, projeto.lab, prazo, ficha]);

  const link = toExternalUrl(projeto.link_url) || '';
  const pdf = projeto.pdf_url ? getImageUrl(projeto.pdf_url) : '';

  return (
    <>
      <header className="sif-container pt-[calc(var(--sif-nav-h)+2.5rem)] md:pt-[calc(var(--sif-nav-h)+4rem)] pb-10 md:pb-14">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-sif-green">Início</Link>
          <ChevronRight size={12} />
          <Link to="/projetos" className="hover:text-sif-green">Projetos</Link>
          <ChevronRight size={12} />
          <span className="text-sif-ink truncate max-w-[60vw]">{projeto.title}</span>
        </nav>
        {tx.detail_eyebrow && <span className="sif-eyebrow mb-5">{tx.detail_eyebrow}</span>}
        <h1 className="sif-title sif-h1 text-sif-ink max-w-4xl">{projeto.title}</h1>
        {lead && <p className="mt-7 max-w-3xl text-xl md:text-2xl leading-snug font-light text-gray-600 whitespace-pre-line">{lead}</p>}
        {(link || pdf) && (
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {link && (
              <a href={link} target="_blank" rel="noreferrer" className={buttonClass('primary', 'lg')}>
                <span className="py-2">{tx.link_btn}</span><BtnArrow variant="primary" size="lg" icon={ExternalLink} />
              </a>
            )}
            {pdf && (
              <a href={pdf} target="_blank" rel="noreferrer" className={buttonClass(link ? 'outline' : 'primary', 'lg')}>
                <span className="py-2">{tx.pdf_btn}</span><BtnArrow variant={link ? 'outline' : 'primary'} size="lg" icon={Download} />
              </a>
            )}
          </div>
        )}
      </header>

      {cover && (
        <figure className="sif-container">
          <img src={cover} alt="" fetchpriority="high" decoding="async" className="w-full aspect-[16/9] md:aspect-[21/9] object-cover rounded-card md:rounded-panel shadow-card" />
        </figure>
      )}

      {facts.length > 0 && (
        <section aria-label="Ficha técnica" className="sif-container mt-10 md:mt-14">
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-7 border-y border-gray-200 py-8">
            {facts.map((f, i) => (
              <div key={i} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{f.label}</dt>
                <dd className={`mt-1.5 text-base font-medium leading-snug break-words ${f.tone === 'live' ? 'text-sif-green' : 'text-sif-ink'}`}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {chapters.length > 0 && (
        <div className="sif-container grid lg:grid-cols-[190px_minmax(0,1fr)] gap-x-14 xl:gap-x-20 py-14 md:py-20">
          <ChapterIndex chapters={chapters} mainRef={mainRef} />
          <div ref={mainRef} className="min-w-0">
            {chapters.map((c, i) => <Chapter key={c.id} cap={c} index={i} />)}
          </div>
        </div>
      )}

      {contact}
    </>
  );
}
