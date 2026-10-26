import React, { useEffect, useState } from 'react';
import {
  FileText, Download, ArrowRight, Play, Quote as QuoteIcon, X, ExternalLink, ChevronLeft, ChevronRight,
  Target, Microscope, Leaf, Sprout, TreePine, Users, Shield, Globe, Lightbulb, BarChart3, BookOpen, Award,
  Factory, FlaskConical, HeartHandshake, Rocket, Droplets, Flame, Recycle, Truck, Settings, Map,
} from 'lucide-react';
import { getImageUrl, cleanRichHtml, htmlToText } from '../../apiConfig';
import SectionTitle from './SectionTitle';
import LogoCarousel from './LogoCarousel';
import SmartLink from '../ui/SmartLink';
import { videoEmbedUrl } from '../ui/VideoModal';
import { buttonClass } from '../ui/Button';

// Ícones disponíveis para os cards de destaque (nome salvo → componente)
export const BLOCK_ICONS = {
  Target, Microscope, Leaf, Sprout, TreePine, Users, Shield, Globe, Lightbulb, BarChart3, BookOpen, Award,
  Factory, FlaskConical, HeartHandshake, Rocket, Droplets, Flame, Recycle, Truck, Settings, Map,
};

const img = (p) => (p ? getImageUrl(p, 1280) : '');

// Cabeçalho padrão dos blocos: etiqueta pequena + título com o estilo do painel
export function BlockHeader({ sec, dark, align = 'left', size = 'xl', className = 'mb-10' }) {
  if (!sec.title && !sec.eyebrow) return null;
  return (
    <div className={`${className} ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl`}>
      {sec.eyebrow && <span className={`block mb-3 text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-[#b5e05c]' : 'text-[var(--accent,#007a3d)]'}`}>{sec.eyebrow}</span>}
      <SectionTitle sec={sec} defaultSize={size} defaultAlign={align} className={dark ? '!text-white' : ''} />
    </div>
  );
}

const proseCls = (dark) => `prose prose-lg max-w-none ${dark ? 'prose-invert text-white/80' : 'text-gray-600'} prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-[var(--accent,#007a3d)] prose-strong:text-inherit prose-li:marker:text-[var(--accent,#007a3d)] prose-img:rounded-3xl`;

export function EditorBlock({ sec, dark }) {
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className={proseCls(dark)} dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content) }} />
    </div>
  );
}

export function TextImageBlock({ sec, dark }) {
  const left = sec.image_side === 'left';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={left ? 'lg:order-2' : ''}>
        <BlockHeader sec={sec} dark={dark} className="mb-6" />
        <div className={proseCls(dark)} dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content || '') }} />
      </div>
      {sec.image && (
        <div className={`relative ${left ? 'lg:order-1' : ''}`}>
          <div className="absolute -inset-3 rounded-panel bg-[var(--accent,#007a3d)] opacity-10 rotate-2" aria-hidden="true" />
          <img src={img(sec.image)} alt={sec.title || ''} loading="lazy" decoding="async"
            className="relative w-full aspect-[4/3] object-cover rounded-card shadow-[var(--sif-shadow-card-hover)]" />
        </div>
      )}
    </div>
  );
}

// Cards lado a lado (até 4): filete na cor do grupo, número grande e, ao
// passar o mouse, o card cresce e escurece. Com 5 ou mais, vira grade.
export function CardsBlock({ sec, dark }) {
  const items = (sec.items || []).filter(i => i && (i.title || i.text));
  const row = items.length <= 4;
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className={row ? 'flex flex-col md:flex-row gap-4 md:gap-5' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
        {items.map((it, i) => {
          const Icon = BLOCK_ICONS[it.icon] || Target;
          return (
            <article key={i} tabIndex={0}
              className={`group relative flex flex-col min-w-0 rounded-card overflow-hidden border-t-[3px] border-[var(--accent,#007a3d)] p-7 md:p-9 md:min-h-[340px] outline-none transition-[flex-grow,background-color,box-shadow] duration-700 ease-[cubic-bezier(.65,0,.35,1)] focus-visible:ring-2 focus-visible:ring-[var(--accent,#007a3d)] ${row ? 'md:flex-1 md:hover:flex-[1.45] md:focus-within:flex-[1.45]' : ''} ${dark ? 'bg-white/[0.06] hover:bg-white/[0.12]' : 'bg-white shadow-card hover:bg-[#0b3320] hover:shadow-card-hover focus:bg-[#0b3320]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-4xl md:text-5xl font-medium tracking-tight tabular-nums transition-colors duration-500 ${dark ? 'text-white/40 group-hover:text-[#b5e05c]' : 'text-gray-200 group-hover:text-[#b5e05c] group-focus:text-[#b5e05c]'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-500 ${dark ? 'bg-white/10 text-[#b5e05c]' : 'bg-[var(--accent-soft,#e8f3ec)] text-[var(--accent,#007a3d)] group-hover:bg-white/10 group-hover:text-[#b5e05c] group-focus:bg-white/10 group-focus:text-[#b5e05c]'}`}>
                  <Icon size={20} />
                </span>
              </div>
              <div className="flex-1 min-h-[40px]" />
              {it.title && <h3 className={`text-xl md:text-2xl font-semibold leading-tight mb-3 max-w-[22rem] transition-colors duration-500 ${dark ? 'text-white' : 'text-[#1f2937] group-hover:text-white group-focus:text-white'}`}>{it.title}</h3>}
              {/* Texto: mostra as primeiras linhas; no hover/foco o restante sobe com animação */}
              {it.text && (
                <div className="relative overflow-hidden max-h-[4.9em] group-hover:max-h-[24em] group-focus:max-h-[24em] transition-[max-height] duration-700 ease-[cubic-bezier(.65,0,.35,1)]">
                  <p className={`leading-relaxed whitespace-pre-line max-w-[22rem] transition-[color,transform] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] translate-y-1 group-hover:translate-y-0 ${dark ? 'text-white/70' : 'text-gray-500 group-hover:text-white/80 group-focus:text-white/80'}`}>{it.text}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function StatsBlock({ sec, dark }) {
  const items = (sec.items || []).filter(i => i && String(i.value || '').trim());
  const cols = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' }[items.length] || 'md:grid-cols-4';
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} align="center" />
      <div className={`grid grid-cols-2 ${cols} gap-3 md:gap-5`}>
        {items.map((it, i) => (
          <div key={i} className={`text-center rounded-card px-4 py-7 md:py-9 ${dark ? 'bg-[#2a302d]/[0.88] border border-white/10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]' : 'bg-white shadow-card'}`}>
            <div className={`text-4xl md:text-6xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-[var(--accent,#007a3d)]'}`}>{it.value}</div>
            {it.label && <div className={`mt-2 text-sm md:text-base ${dark ? 'text-white/70' : 'text-gray-500'}`}>{it.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Largura de cada pessoa: 2 por linha no celular, 3 no tablet, 4 no computador (última linha centralizada)
const PERSON_W = 'w-1/2 sm:w-1/3 lg:w-1/4';

export function PeopleBlock({ sec, dark }) {
  const items = (sec.items || []).filter(i => i && i.name);
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className="flex flex-wrap justify-center gap-y-10 -mx-3">
        {items.map((p, i) => {
          const body = (
            <>
              <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-[var(--sif-shadow-card)] bg-gray-100">
                {p.photo
                  ? <img src={img(p.photo)} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-[var(--accent,#007a3d)] bg-[var(--accent-soft,#e8f3ec)]">{p.name.trim().charAt(0)}</div>}
              </div>
              <p className={`font-semibold leading-tight ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{p.name}</p>
              {p.role && <p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-gray-500'}`}>{p.role}</p>}
              {p.link && <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[var(--accent,#007a3d)]">Ver perfil <ExternalLink size={12} /></span>}
            </>
          );
          return p.link
            ? <SmartLink key={i} href={p.link} className={`group text-center block px-3 ${PERSON_W}`}>{body}</SmartLink>
            : <div key={i} className={`group text-center px-3 ${PERSON_W}`}>{body}</div>;
        })}
      </div>
    </div>
  );
}

// Grade sempre fechada: escolhe colunas pela quantidade e alarga as fotos
// da última linha quando sobram (sem foto sozinha num canto).
function galleryLayout(n) {
  const c = n <= 4 ? Math.max(n, 1) : (n % 3 === 0 ? 3 : n % 4 === 0 ? 4 : 3);
  const cols = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[c];
  const r = n % c;
  const span = (i) => {
    const mobileLast = n % 2 === 1 && i === n - 1 ? 'col-span-2 md:col-span-1' : '';
    if (!r || i < n - r) return mobileLast;
    // r fotos na última linha dividem c colunas
    if (r === 1) return `col-span-2 ${{ 3: 'md:col-span-3', 4: 'md:col-span-4' }[c] || ''} md:[&>img]:aspect-[21/9]`;
    if (r === 2 && c === 3) return i === n - 2 ? 'md:col-span-2' : '';
    if (r === 2 && c === 4) return 'md:col-span-2';
    if (r === 3 && c === 4) return i === n - 3 ? 'md:col-span-2' : '';
    return mobileLast;
  };
  return { cols, span };
}

export function GalleryBlock({ sec, dark }) {
  const imgs = (sec.images || []).filter(Boolean);
  const [open, setOpen] = useState(-1);
  const gal = galleryLayout(imgs.length);
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen(i => (i + 1) % imgs.length);
      if (e.key === 'ArrowLeft') setOpen(i => (i - 1 + imgs.length) % imgs.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, imgs.length]);
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className={`grid grid-cols-2 ${gal.cols} gap-3 md:gap-4`}>
        {imgs.map((src, i) => (
          <button key={i} type="button" onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 ${gal.span(i)}`}>
            <img src={img(src)} alt="" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} className="w-full h-full min-h-[160px] md:min-h-[220px] aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {open >= 0 && (
        <div data-lenis-prevent className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={() => setOpen(-1)}>
          <button type="button" aria-label="Fechar" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><X size={22} /></button>
          {imgs.length > 1 && <button type="button" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); setOpen(i => (i - 1 + imgs.length) % imgs.length); }} className="absolute left-3 md:left-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><ChevronLeft size={22} /></button>}
          <img src={img(imgs[open])} alt="" className="max-h-[85vh] max-w-full rounded-2xl" onClick={(e) => e.stopPropagation()} />
          {imgs.length > 1 && <button type="button" aria-label="Próxima" onClick={(e) => { e.stopPropagation(); setOpen(i => (i + 1) % imgs.length); }} className="absolute right-3 md:right-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"><ChevronRight size={22} /></button>}
        </div>
      )}
    </div>
  );
}

// Vídeo: o player (iframe) só carrega quando o visitante clica — página leve.
export function VideoBlock({ sec, dark }) {
  const [play, setPlay] = useState(false);
  const url = String(sec.url || '').trim();
  const embed = videoEmbedUrl(url);
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  const thumb = yt ? `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg` : '';
  if (!embed && !/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) return null;
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className="relative aspect-video rounded-card overflow-hidden bg-[#0b3320] shadow-[var(--sif-shadow-card-hover)]">
        {!embed ? (
          <video src={getImageUrl(url)} controls preload="metadata" playsInline className="w-full h-full" />
        ) : play ? (
          <iframe src={embed} title={sec.title || 'Vídeo'} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 w-full h-full" aria-label="Assistir vídeo">
            {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />}
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-full bg-white text-[#0b3320] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <Play size={30} fill="currentColor" className="ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
      {sec.caption && <p className={`mt-4 text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>{sec.caption}</p>}
    </div>
  );
}

export function QuoteBlock({ sec, dark }) {
  return (
    <figure className="max-w-4xl mx-auto text-center">
      <QuoteIcon size={44} className={`mx-auto mb-6 ${dark ? 'text-[#b5e05c]' : 'text-[var(--accent,#007a3d)]'} opacity-80`} />
      <blockquote className={`text-2xl md:text-4xl leading-snug font-medium tracking-tight ${dark ? 'text-white' : 'text-[#1f2937]'}`}>
        {sec.text}
      </blockquote>
      {(sec.author || sec.role) && (
        <figcaption className="mt-8">
          {sec.author && <span className={`block font-semibold ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{sec.author}</span>}
          {sec.role && <span className={`block text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>{sec.role}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function CtaBlock({ sec }) {
  return (
    <div className="relative overflow-hidden rounded-card bg-[#0b3320] text-white px-8 py-12 md:px-16 md:py-16 shadow-[var(--sif-shadow-card-hover)]">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--accent,#007a3d)] blur-[110px] opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          {sec.title && <h2 className="sif-title text-3xl md:text-4xl leading-tight mb-4">{sec.title}</h2>}
          {sec.text && <p className="text-white/75 text-lg leading-relaxed whitespace-pre-line">{sec.text}</p>}
        </div>
        {sec.btn_label && (
          <SmartLink href={sec.btn_link || '/contato'} className={`shrink-0 ${buttonClass('light')}`}>
            {sec.btn_label} <ArrowRight size={16} />
          </SmartLink>
        )}
      </div>
    </div>
  );
}

export function TabsBlock({ sec, dark }) {
  const tabs = (sec.tabs || []).filter(t => t && (t.title || htmlToText(t.content || '').trim()));
  const [active, setActive] = useState(0);
  const cur = tabs[Math.min(active, tabs.length - 1)];
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {tabs.map((t, i) => (
          <button key={i} type="button" role="tab" aria-selected={active === i} onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${active === i
              ? 'bg-[var(--accent,#007a3d)] text-white border-transparent shadow-md'
              : dark ? 'bg-transparent text-white/70 border-white/20 hover:border-white/50' : 'bg-white text-gray-500 border-gray-200 hover:border-[var(--accent,#007a3d)] hover:text-[var(--accent,#007a3d)]'}`}>
            {t.title || `Aba ${i + 1}`}
          </button>
        ))}
      </div>
      {cur && (
        <div className={`rounded-card p-6 md:p-10 ${dark ? 'bg-white/[0.06] border border-white/10' : 'sif-card border border-gray-100'}`}>
          <div className={proseCls(dark)} dangerouslySetInnerHTML={{ __html: cleanRichHtml(cur.content || '') }} />
        </div>
      )}
    </div>
  );
}

export function PdfsBlock({ sec, dark }) {
  const pdfs = (sec.pdfs || []).filter(p => p && (p.url || p.pdf_url));
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pdfs.map((p, i) => (
          <a key={i} href={getImageUrl(p.url || p.pdf_url)} target="_blank" rel="noopener noreferrer"
            className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${dark ? 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.12]' : 'sif-card sif-card-hover border border-gray-100 hover:-translate-y-0.5'}`}>
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${dark ? 'bg-white/10 text-[#b5e05c]' : 'bg-[var(--accent-soft,#e8f3ec)] text-[var(--accent,#007a3d)]'}`}><FileText size={20} /></span>
            <span className={`flex-1 min-w-0 font-semibold text-sm leading-snug line-clamp-2 ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{p.title || `Documento ${i + 1}`}</span>
            <Download size={18} className={`shrink-0 transition-transform group-hover:translate-y-0.5 ${dark ? 'text-white/50' : 'text-gray-300 group-hover:text-[var(--accent,#007a3d)]'}`} />
          </a>
        ))}
      </div>
    </div>
  );
}

export function LogosBlock({ sec, dark }) {
  const imgs = (sec.images || []).filter(Boolean);
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} align="center" size="md" />
      <LogoCarousel images={imgs} />
    </div>
  );
}

export const BLOCKS = {
  editor: EditorBlock, gt_intro: EditorBlock, text_image: TextImageBlock, cards: CardsBlock, stats: StatsBlock,
  people: PeopleBlock, gallery: GalleryBlock, video: VideoBlock, quote: QuoteBlock, cta: CtaBlock,
  tabs: TabsBlock, pdfs: PdfsBlock, logos: LogosBlock,
};
