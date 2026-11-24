import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Download, ArrowRight, Play, Quote as QuoteIcon, X, ExternalLink, ChevronLeft, ChevronRight,
  Target, Microscope, Leaf, Sprout, TreePine, Users, Shield, Globe, Lightbulb, BarChart3, BookOpen, Award,
  Factory, FlaskConical, HeartHandshake, Rocket, Droplets, Flame, Recycle, Truck, Settings, Map, Check
} from 'lucide-react';
import { getImageUrl, cleanRichHtml, htmlToText } from '../../apiConfig';
import SectionTitle from './SectionTitle';
import LogoCarousel from './LogoCarousel';
import SmartLink from '../ui/SmartLink';
import { videoEmbedUrl } from '../ui/VideoModal';
import { buttonClass, BtnArrow } from '../ui/Button';
import CountUp from '../ui/CountUp';
import { fileExt, fileIcon, fileMetaLabel, fileUrl } from './fileMeta';
import HighlightsBlock from './HighlightsBlock';
import leafIcon from '../../assets/icone.svg';

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
            className="relative w-full aspect-[4/3] object-cover rounded-card shadow-card-hover" />
        </div>
      )}
    </div>
  );
}

// Cards lado a lado (até 4): filete na cor do grupo, número grande e, ao
// passar o mouse, o card cresce e escurece. Com 5 ou mais, vira grade.
// Folha da SIF (com o "i" branco) como marca d'água discreta nos cards brancos
export function LeafMark({ className = '' }) {
  return <img src={leafIcon} alt="" aria-hidden="true" draggable="false" loading="lazy"
    className={`pointer-events-none select-none absolute [filter:grayscale(1)] opacity-[0.07] ${className}`} />;
}

export function CardsBlock({ sec, dark }) {
  const items = (sec.items || []).filter(i => i && (i.title || i.subtitle || i.text));
  // até 6 cards: uma fileira só (o card cresce ao passar o mouse); mais que isso, grade
  const row = items.length <= 6;
  const wide = items.length > 4; // 5 ou 6 cards: fileira só a partir de telas largas
  const bp = wide ? 'lg' : 'md';
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className={row ? `grid grid-cols-1 sm:grid-cols-2 ${bp}:flex ${bp}:flex-row gap-4 ${bp}:gap-5` : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
        {items.map((it, i) => {
          return (
            <article key={i} tabIndex={0}
              className={`group relative flex flex-col min-w-0 rounded-card overflow-hidden p-7 ${wide ? 'lg:p-7' : 'md:p-8'} md:min-h-[280px] outline-none transition-[flex-grow,background-color,box-shadow] duration-700 ease-[cubic-bezier(.65,0,.35,1)] focus-visible:ring-2 focus-visible:ring-[var(--accent,#007a3d)] ${row ? (wide ? 'lg:flex-1 lg:hover:flex-[1.7] lg:focus-within:flex-[1.7]' : 'md:flex-1 md:hover:flex-[1.45] md:focus-within:flex-[1.45]') : ''} ${dark ? 'bg-white/[0.06] hover:bg-white/[0.12]' : 'bg-white shadow-card hover:bg-[#0b3320] hover:shadow-card-hover focus:bg-[#0b3320]'}`}>
              {!dark && <LeafMark className="-right-6 -bottom-8 w-32 md:w-36 rotate-[-12deg] transition-opacity duration-500 group-hover:opacity-0 group-focus:opacity-0" />}
              <span className={`relative text-4xl md:text-5xl font-medium tracking-tight tabular-nums transition-colors duration-500 ${dark ? 'text-white/40 group-hover:text-[#b5e05c]' : 'text-gray-200 group-hover:text-[#b5e05c] group-focus:text-[#b5e05c]'}`}>{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-h-[28px]" />
              {it.title && <h3 className={`relative ${wide ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-semibold leading-tight max-w-[22rem] transition-colors duration-500 ${dark ? 'text-white' : 'text-[#1f2937] group-hover:text-white group-focus:text-white'}`}>{it.title}</h3>}
              {it.subtitle && <p className={`relative mt-2 text-sm md:text-[15px] leading-snug max-w-[22rem] transition-colors duration-500 ${dark ? 'text-[#b5e05c]' : 'text-[var(--accent,#007a3d)] group-hover:text-[#b5e05c] group-focus:text-[#b5e05c]'}`}>{it.subtitle}</p>}
              {/* Texto: no computador fica escondido e SOBE ao passar o mouse
                  (ou focar pelo teclado); no celular aparece sempre */}
              {it.text && (
                <div className="sif-reveal-more relative">
                  <div className="overflow-hidden">
                    <p className={`pt-3 leading-relaxed whitespace-pre-line max-w-[22rem] ${dark ? 'text-white/75' : 'text-gray-500 group-hover:text-white/80 group-focus:text-white/80'}`}>{it.text}</p>
                  </div>
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
            <div className={`text-4xl md:text-6xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-[var(--accent,#007a3d)]'}`}><CountUp value={it.value} /></div>
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
              <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-card-hover bg-gray-100">
                {p.photo
                  ? <img src={img(p.photo)} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-[var(--accent,#007a3d)] bg-[var(--accent-soft,#e8f3ec)]">{p.name.trim().charAt(0)}</div>}
              </div>
              <p className={`font-semibold leading-tight ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{p.name}</p>
              {p.role && <p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-gray-500'}`}>{p.role}</p>}
              {p.link && <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[var(--accent,#007a3d)]">Ver perfil <ExternalLink size={12} /></span>}
            </>
          );
          // Telefone e e-mail (opcionais) ficam fora do link do perfil
          const phone = String(p.phone || '').trim();
          const email = String(p.email || '').trim();
          const contact = (phone || email) && (
            <div className={`mt-2 space-y-0.5 text-xs break-words ${dark ? 'text-white/70' : 'text-gray-500'}`}>
              {phone && <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="block hover:text-[var(--accent,#007a3d)]">{phone}</a>}
              {email && <a href={`mailto:${email}`} className="block hover:text-[var(--accent,#007a3d)]">{email}</a>}
            </div>
          );
          return (
            <div key={i} className={`group text-center px-3 ${PERSON_W}`}>
              {p.link ? <SmartLink href={p.link} className="block">{body}</SmartLink> : body}
              {contact}
            </div>
          );
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

// Muitas fotos: carrossel (deslizar no celular, setas no computador) em vez
// de uma grade longa. Até GALLERY_GRID_MAX fotos continua a grade.
const GALLERY_GRID_MAX = 4;
function GalleryCarousel({ imgs, dark, onOpen }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ i: 0, end: false });
  const step = () => (ref.current?.firstElementChild?.getBoundingClientRect().width || 1) + 16; // largura da foto + espaço
  const maxLeft = () => (ref.current ? ref.current.scrollWidth - ref.current.clientWidth : 0);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setPos({ i: Math.round(el.scrollLeft / step()), end: el.scrollLeft >= maxLeft() - 4 });
  };
  const go = (dir) => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(imgs.length - 1, Math.round(el.scrollLeft / step()) + dir));
    const left = Math.min(i * step(), maxLeft());
    setPos({ i, end: left >= maxLeft() - 4 });
    el.scrollTo({ left, behavior: 'smooth' });
  };
  const total = imgs.length;
  const cur = pos.end ? total - 1 : pos.i;
  const arrow = `w-11 h-11 rounded-full border flex items-center justify-center transition-all active:scale-95 disabled:opacity-35 ${dark ? 'border-white/25 text-white hover:bg-white hover:text-sif-dark' : 'border-gray-200 bg-white text-sif-ink hover:bg-sif-green hover:text-white hover:border-sif-green'}`;
  return (
    <div>
      <div ref={ref} onScroll={onScroll} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {imgs.map((src, i) => (
          <button key={i} type="button" onClick={() => onOpen(i)} aria-label={`Abrir foto ${i + 1} de ${total}`}
            className="group relative shrink-0 snap-start w-[82%] sm:w-[46%] lg:w-[calc((100%-2rem)/3)] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100">
            <img src={img(src)} alt="" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 flex gap-1.5" aria-hidden="true">
          {imgs.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all duration-500"
              style={{ flexGrow: i === cur ? 4 : 1, flexBasis: 0, background: i <= cur ? (dark ? '#b5e05c' : '#007a3d') : (dark ? 'rgba(255,255,255,.2)' : '#e5e7eb') }} />
          ))}
        </div>
        <span className={`font-heading text-sm font-bold tabular-nums ${dark ? 'text-white' : 'text-sif-ink'}`}>
          {String(cur + 1).padStart(2, '0')} <span className={dark ? 'text-white/40' : 'text-gray-300'}>/ {String(total).padStart(2, '0')}</span>
        </span>
        <div className="flex gap-2">
          <button type="button" aria-label="Foto anterior" onClick={() => go(-1)} disabled={pos.i === 0} className={arrow}><ChevronLeft size={18} /></button>
          <button type="button" aria-label="Próxima foto" onClick={() => go(1)} disabled={pos.end} className={arrow}><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
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
      {imgs.length > GALLERY_GRID_MAX ? <GalleryCarousel imgs={imgs} dark={dark} onOpen={setOpen} /> : (
      <div className={`grid grid-cols-2 ${gal.cols} gap-3 md:gap-4`}>
        {imgs.map((src, i) => (
          <button key={i} type="button" onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 ${gal.span(i)}`}>
            <img src={img(src)} alt="" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} className="w-full h-full min-h-[160px] md:min-h-[220px] aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      )}
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
      <div className="relative aspect-video rounded-card overflow-hidden bg-[#0b3320] shadow-card-hover">
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
    <div className="relative overflow-hidden rounded-card bg-[#0b3320] text-white px-8 py-12 md:px-16 md:py-16 shadow-card-hover">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--accent,#007a3d)] blur-[110px] opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          {sec.title && <h2 className="sif-title text-3xl md:text-4xl leading-tight mb-4">{sec.title}</h2>}
          {sec.text && <p className="text-white/75 text-lg leading-relaxed whitespace-pre-line">{sec.text}</p>}
        </div>
        {sec.btn_label && (
          <SmartLink href={sec.btn_link || '/contato'} className={`shrink-0 ${buttonClass('light')}`}>
            <span className="py-2">{sec.btn_label}</span><BtnArrow variant="light" />
          </SmartLink>
        )}
      </div>
    </div>
  );
}

// "Venda de Sementes" -> "venda-de-sementes" (endereço de cada aba, usado nos links do menu)
export const tabSlug = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function TabsBlock({ sec, dark }) {
  // aba vale se tem título, texto ou mídia (conteúdo antigo às vezes é só uma imagem)
  const tabs = (sec.tabs || []).filter(t => t && (t.title || htmlToText(t.content || '').trim() || /<(img|iframe|video)/i.test(t.content || '')));
  const [active, setActive] = useState(0);
  const cur = tabs[Math.min(active, tabs.length - 1)];
  const boxRef = useRef(null);
  const { hash } = useLocation();
  // Endereço com #nome-da-aba (ex.: link do menu): abre essa aba e rola até ela
  useEffect(() => {
    const want = decodeURIComponent((hash || '').replace(/^#/, ''));
    if (!want) return;
    const i = tabs.findIndex(t => t.title && tabSlug(t.title) === want);
    if (i < 0) return;
    setActive(i);
    const t = setTimeout(() => {
      const el = boxRef.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 140, behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, tabs.length]);
  const single = tabs.length === 1 && !tabs[0].title;
  // Abas com tabela larga (ex.: dados climáticos): barra no topo e painel na largura toda.
  // Demais: lista de abas à esquerda e painel grande à direita.
  const wide = tabs.some(t => /sif-table/.test(t.content || ''));
  const panel = (extra = '') => cur && (
    <div key={active} role="tabpanel"
      className={`relative overflow-hidden rounded-card p-7 md:p-12 animate-in fade-in duration-500 ${dark ? 'bg-white/[0.06] border border-white/10' : 'bg-white shadow-card'} ${extra}`}>
      {!dark && <LeafMark className="-right-10 -bottom-14 w-48 md:w-64 rotate-[-12deg]" />}
      {!single && cur.title && <h3 className={`relative font-heading font-semibold text-2xl md:text-3xl tracking-tight mb-6 ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{cur.title}</h3>}
      <div className={`relative ${proseCls(dark)} sif-tab-prose`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(cur.content || '') }} />
    </div>
  );
  if (single) return <div ref={boxRef}><BlockHeader sec={sec} dark={dark} />{panel()}</div>;

  const num = (i) => String(i + 1).padStart(2, '0');
  if (wide) {
    return (
      <div ref={boxRef}>
        <BlockHeader sec={sec} dark={dark} />
        <div className="-mx-6 px-6 overflow-x-auto no-scrollbar mb-5">
          <div role="tablist" className={`inline-flex gap-1 p-1.5 rounded-full ${dark ? 'bg-white/10' : 'bg-white shadow-card'}`}>
            {tabs.map((t, i) => (
              <button key={i} type="button" role="tab" aria-selected={active === i} onClick={() => setActive(i)}
                className={`shrink-0 px-5 md:px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${active === i
                  ? 'bg-[#0b3320] text-white shadow-md'
                  : dark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-[#007a3d]'}`}>
                {t.title || `Aba ${i + 1}`}
              </button>
            ))}
          </div>
        </div>
        {panel('md:min-h-[420px]')}
      </div>
    );
  }

  return (
    <div ref={boxRef}>
      <BlockHeader sec={sec} dark={dark} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* lista de abas: no celular desliza para o lado; no computador, coluna à esquerda */}
        <div role="tablist" aria-orientation="vertical"
          className="lg:col-span-4 -mx-6 px-6 lg:mx-0 lg:px-0 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar lg:overflow-visible lg:sticky lg:top-40">
          {tabs.map((t, i) => {
            const on = active === i;
            return (
              <button key={i} type="button" role="tab" aria-selected={on} onClick={() => setActive(i)}
                className={`group shrink-0 lg:w-full text-left flex items-center gap-4 rounded-2xl px-5 py-4 lg:py-5 transition-all duration-300 ${on
                  ? 'bg-[#0b3320] text-white shadow-card-hover'
                  : dark ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.12]' : 'bg-white/70 text-[#1f2937] hover:bg-white hover:shadow-card'}`}>
                <span className={`font-heading text-sm font-bold tabular-nums ${on ? 'text-[#b5e05c]' : 'text-gray-300 group-hover:text-[#007a3d]'}`}>{num(i)}</span>
                <span className="flex-1 font-semibold text-[15px] lg:text-base leading-snug whitespace-nowrap lg:whitespace-normal">{t.title || `Aba ${i + 1}`}</span>
                <ChevronRight size={18} className={`hidden lg:block shrink-0 transition-all duration-300 ${on ? 'text-[#b5e05c] translate-x-0' : 'text-gray-300 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            );
          })}
        </div>
        <div className="lg:col-span-8 min-w-0">{panel('lg:min-h-[360px]')}</div>
      </div>
    </div>
  );
}

// Comparativo (tipo 'compare'): dois lados lado a lado (ex.: tubete de plástico x Ellepot);
// o lado B é o destaque (fundo escuro, ícone de confirmação).
export function CompareBlock({ sec, dark }) {
  const rows = (sec.items || []).filter(r => r && (r.label || r.a || r.b));
  const A = sec.a_label || 'Opção A';
  const Bl = sec.b_label || 'Opção B';
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      {/* computador: tabela de 3 colunas com o lado B em destaque */}
      <div className="hidden md:grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] rounded-panel overflow-hidden shadow-card bg-white">
        <div className="px-8 pt-8 pb-5" />
        <div className="px-8 pt-8 pb-5 border-l border-gray-100">
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Convencional</span>
          <span className="font-heading text-xl font-semibold text-[#1f2937]">{A}</span>
        </div>
        <div className="px-8 pt-8 pb-5 bg-[#0b3320] relative overflow-hidden">
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b5e05c] mb-1">Recomendado</span>
          <span className="font-heading text-xl font-semibold text-white">{Bl}</span>
        </div>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div className="px-8 py-6 border-t border-gray-100 font-semibold text-[#1f2937]">{r.label}</div>
            <div className="px-8 py-6 border-t border-l border-gray-100 flex gap-3 text-gray-500 leading-relaxed">
              <X size={18} className="shrink-0 mt-0.5 text-gray-300" />{r.a}
            </div>
            <div className="px-8 py-6 border-t border-white/10 bg-[#0b3320] flex gap-3 text-white/85 leading-relaxed">
              <Check size={18} className="shrink-0 mt-0.5 text-[#b5e05c]" />{r.b}
            </div>
          </React.Fragment>
        ))}
        <div className="h-3" /><div className="h-3 border-l border-gray-100" /><div className="h-3 bg-[#0b3320]" />
      </div>
      {/* celular: um card por critério */}
      <div className="md:hidden space-y-4">
        {rows.map((r, i) => (
          <div key={i} className="rounded-card overflow-hidden bg-white shadow-card">
            <p className="px-5 pt-5 pb-3 font-semibold text-[#1f2937]">{r.label}</p>
            <div className="px-5 pb-4 flex gap-3 text-sm text-gray-500"><X size={16} className="shrink-0 mt-0.5 text-gray-300" /><span><strong className="block text-gray-400 text-[11px] uppercase tracking-widest">{A}</strong>{r.a}</span></div>
            <div className="px-5 py-4 bg-[#0b3320] flex gap-3 text-sm text-white/85"><Check size={16} className="shrink-0 mt-0.5 text-[#b5e05c]" /><span><strong className="block text-[#b5e05c] text-[11px] uppercase tracking-widest">{Bl}</strong>{r.b}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Arquivos e documentos (tipo 'pdfs'): nome, ícone pelo tipo, extensão e tamanho
export function PdfsBlock({ sec, dark }) {
  const files = (sec.pdfs || []).filter(p => fileUrl(p));
  return (
    <div>
      <BlockHeader sec={sec} dark={dark} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((p, i) => {
          const Icon = fileIcon(fileExt(p));
          const meta = fileMetaLabel(p);
          return (
            <a key={i} href={getImageUrl(fileUrl(p))} target="_blank" rel="noopener noreferrer"
              className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${dark ? 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.12]' : 'sif-card sif-card-hover border border-gray-100 hover:-translate-y-0.5'}`}>
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${dark ? 'bg-white/10 text-[#b5e05c]' : 'bg-[var(--accent-soft,#e8f3ec)] text-[var(--accent,#007a3d)]'}`}><Icon size={20} aria-hidden="true" /></span>
              <span className="flex-1 min-w-0">
                <span className={`block font-semibold text-sm leading-snug line-clamp-2 ${dark ? 'text-white' : 'text-[#1f2937]'}`}>{p.title || `Arquivo ${i + 1}`}</span>
                {meta && <span className={`block mt-1 text-xs ${dark ? 'text-white/55' : 'text-gray-400'}`}>{meta}</span>}
              </span>
              <Download size={18} aria-hidden="true" className={`shrink-0 transition-transform group-hover:translate-y-0.5 ${dark ? 'text-white/50' : 'text-gray-300 group-hover:text-[var(--accent,#007a3d)]'}`} />
            </a>
          );
        })}
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
  tabs: TabsBlock, pdfs: PdfsBlock, logos: LogosBlock, highlights: HighlightsBlock, compare: CompareBlock,
};
