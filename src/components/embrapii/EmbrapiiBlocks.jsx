import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, Plus, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { getImageUrl, cleanRichHtml, htmlToText, heroW } from '../../apiConfig';
import { videoEmbedUrl } from '../ui/VideoModal';
import { buttonClass, BtnArrow } from '../ui/Button';
import PhotoBand from '../ui/PhotoBand';
import LogoCarousel from '../sections/LogoCarousel';
import TeamDirectory from '../team/TeamDirectory';
import EmbrapiiForm from './EmbrapiiForm';
import { fileExt, fileIcon, fileMetaLabel, fileUrl } from '../sections/fileMeta';

// Blocos com desenho próprio da página "Projetos SIF e EMBRAPII".
// Todo o conteúdo vem do painel (page_configs "embrapii"); aqui só o visual.

const img = (p, w = 1280) => (p ? getImageUrl(p, w) : '');
const pad = (n) => String(n).padStart(2, '0');
const paragraphs = (t) => String(t || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
const norm = (s) => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();

function Header({ eyebrow, title, dark, center, className = 'mb-12 md:mb-14' }) {
  if (!eyebrow && !title) return null;
  return (
    <div className={`${className} max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <span className={`sif-eyebrow mb-4 ${dark ? '!text-sif-lime' : ''}`}>{eyebrow}</span>}
      {title && <h2 className={`sif-title sif-h2 ${dark ? 'text-white' : 'text-sif-ink'}`}>{title}</h2>}
    </div>
  );
}

const prose = (dark) => `prose prose-lg max-w-none ${dark ? 'prose-invert text-white/75' : 'text-gray-600'} prose-p:leading-relaxed prose-strong:text-inherit prose-a:text-sif-green prose-li:marker:text-sif-green`;

/* ─── VÍDEO (card em tamanho médio, toca no próprio lugar) ─────────── */
function VideoCard({ sec }) {
  const [play, setPlay] = useState(false);
  const url = String(sec?.url || '').trim();
  const embed = videoEmbedUrl(url);
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  const [thumb, setThumb] = useState(yt ? `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg` : '');
  const isFile = /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
  if (!embed && !isFile) return null;
  const autoplay = embed && (embed.includes('?') ? `${embed}&autoplay=1` : `${embed}?autoplay=1`);
  return (
    <figure>
      <div className="relative aspect-video rounded-card overflow-hidden bg-sif-dark shadow-card-hover">
        {!embed ? (
          <video src={getImageUrl(url)} controls preload="metadata" playsInline className="w-full h-full" />
        ) : play ? (
          <iframe src={autoplay} title={sec.title || 'Vídeo'} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 w-full h-full" aria-label="Assistir ao vídeo">
            {thumb && <img src={thumb} alt="" loading="lazy" decoding="async" onError={() => setThumb(t => (t.includes('maxres') ? t.replace('maxresdefault', 'hqdefault') : ''))} className="absolute inset-0 w-full h-full object-cover" />}
            <span className="absolute inset-0 bg-gradient-to-t from-sif-dark/60 via-sif-dark/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-white text-sif-dark flex items-center justify-center shadow-card transition-transform duration-500 group-hover:scale-110">
                <Play size={24} fill="currentColor" className="ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
      {(sec.title || sec.caption) && (
        <figcaption className="mt-4 flex items-baseline gap-3 text-sm">
          {sec.eyebrow && <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-sif-green">{sec.eyebrow}</span>}
          <span className="text-gray-500">{sec.title || sec.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

/* ─── APRESENTAÇÃO (texto + vídeo, como na página de referência) ───── */
export function EmbIntro({ c, video }) {
  const [lead, ...rest] = paragraphs(c.intro_text);
  return (
    <section id="embrapii-intro" className="relative py-20 md:py-28 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            {c.intro_tag && <span className="sif-eyebrow mb-4">{c.intro_tag}</span>}
            {c.intro_title && <h2 className="sif-title sif-h2 text-sif-ink">{c.intro_title}</h2>}
            {lead && <p className="mt-8 text-lg md:text-xl leading-relaxed text-sif-ink/85">{lead}</p>}
            {rest.map((p, i) => <p key={i} className="mt-5 text-base leading-relaxed text-gray-600">{p}</p>)}
          </div>
          <div className="lg:col-span-6">
            {video ? <VideoCard sec={video} /> : c.intro_image && (
              <img src={img(c.intro_image, 900)} alt="" loading="lazy" decoding="async" className="w-full aspect-video object-cover rounded-card shadow-card" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ÁREAS DE ATUAÇÃO (foto de fundo + título grande + cards ao lado) ── */
// A área ativa vira o fundo e o título; os cards mostram as próximas.
// Ao escolher um card, a foto dele cresce até virar o fundo.
export function EmbAreas({ c, frentes }) {
  const n = frentes.length;
  const [active, setActive] = useState(0);   // área do texto e dos cards
  const [bg, setBg] = useState(0);           // foto do fundo (troca quando a foto "chega")
  const [flight, setFlight] = useState(null); // foto voando do card para o fundo
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const boxRef = useRef(null);
  const cardRefs = useRef({});
  const busy = useRef(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Escolher uma área: a foto do card cresce até ocupar o fundo todo.
  const select = useCallback((i) => {
    if (busy.current || i === active || !frentes[i]) return;
    const box = boxRef.current;
    const card = cardRefs.current[i];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !box || !card || !frentes[i].image) { setActive(i); setBg(i); return; }
    const b = box.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    busy.current = true;
    setFlight({ i, src: img(frentes[i].image, heroW(1600)), full: false, from: { left: r.left - b.left, top: r.top - b.top, width: r.width, height: r.height } });
  }, [active, frentes]);

  // Monta a foto no lugar do card e, no quadro seguinte, manda para o fundo
  useEffect(() => {
    if (!flight || flight.full) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setFlight(f => (f ? { ...f, full: true } : f))); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [flight]);

  // Texto troca junto com o voo; quando a foto chega, ela vira o fundo
  const flying = flight?.full ? flight.i : null;
  useEffect(() => {
    if (flying === null) return;
    setActive(flying);
    const t = setTimeout(() => { setBg(flying); setFlight(null); busy.current = false; }, 950);
    return () => clearTimeout(t);
  }, [flying]);

  // Troca sozinha a cada 7 s enquanto está na tela (para com o mouse em cima)
  useEffect(() => {
    if (n < 2 || paused || !inView || flight || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => select((active + 1) % n), 7000);
    return () => clearTimeout(t);
  }, [active, paused, inView, flight, n, select]);

  if (!n) return null;
  const next = Array.from({ length: n - 1 }, (_, k) => (active + 1 + k) % n);
  const EASE = 'cubic-bezier(.65,0,.35,1)';
  const FLY = ['left', 'top', 'width', 'height', 'border-radius'].map(p => `${p} .9s ${EASE}`).join(', ');

  return (
    <section className="px-4 md:px-6 py-6 md:py-10" data-no-reveal>
      <div ref={boxRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}
        className="relative max-w-[1400px] mx-auto rounded-panel overflow-hidden bg-sif-dark text-white shadow-[0_40px_80px_-40px_rgba(6,25,15,0.7)]">
        {/* Fundo: a foto da vez (sem transição; quem anima é a foto que voa) */}
        {frentes.map((f, i) => (
          f.image ? (
            <img key={i} src={img(f.image, heroW(1600))} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
              className={`absolute inset-0 w-full h-full object-cover ${i === bg ? 'opacity-100' : 'opacity-0'}`} />
          ) : null
        ))}
        {flight && (
          <div aria-hidden="true" className="absolute overflow-hidden"
            style={{ transition: FLY, ...(flight.full ? { left: 0, top: 0, width: '100%', height: '100%', borderRadius: 0 } : { ...flight.from, borderRadius: 20 }) }}>
            <img src={flight.src} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06190f]/90 via-[#06190f]/60 to-[#06190f]/15" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06190f]/80 to-transparent" aria-hidden="true" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:min-h-[clamp(520px,74vh,660px)] items-center">
          {/* Texto: todas as áreas ocupam o mesmo lugar (altura = a maior), só a da vez aparece */}
          <div className="lg:col-span-5">
            <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime">{c.frentes_tag || 'Áreas de atuação'}</span>
            <div className="grid mt-6">
              {frentes.map((f, i) => {
                const on = i === active;
                const text = f.text || c.frentes_text;
                return (
                  <div key={i} aria-hidden={!on}
                    className={`[grid-area:1/1] transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
                    <p className="sif-title text-4xl sm:text-5xl lg:text-[56px] leading-[1.02] tracking-tight" role={on ? 'heading' : undefined} aria-level={on ? 2 : undefined}>{f.title}</p>
                    {text && <p className="mt-6 max-w-md text-base md:text-[17px] leading-relaxed text-white/75">{text}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximas áreas + navegação */}
          <div className="lg:col-span-7 min-w-0">
            {next.length > 0 && (
              <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar lg:justify-end pb-1">
                {next.map((i, k) => (
                  <button key={`${active}-${i}`} ref={el => { cardRefs.current[i] = el; }} type="button" onClick={() => select(i)} aria-label={`Ver ${frentes[i].title}`}
                    style={{ animationDelay: `${k * 110}ms` }}
                    className="sif-card-in group relative shrink-0 w-[170px] sm:w-[200px] lg:w-[clamp(180px,15vw,230px)] aspect-[2/3] rounded-card overflow-hidden text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sif-lime">
                    {frentes[i].image && <img src={img(frentes[i].image, 480)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />}
                    <span className="absolute inset-0 bg-gradient-to-t from-[#06190f]/90 via-[#06190f]/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                    <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <span className="block text-[11px] font-bold tracking-[0.2em] text-sif-lime">{pad(i + 1)}</span>
                      <span className="mt-1.5 block text-[15px] md:text-base font-semibold leading-snug">{frentes[i].title}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {n > 1 && (
              <div className="mt-8 flex items-center gap-4 lg:pl-[8%]">
                <button type="button" onClick={() => select((active - 1 + n) % n)} aria-label="Área anterior" className="w-12 h-12 shrink-0 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-sif-dark transition-colors"><ArrowLeft size={18} /></button>
                <button type="button" onClick={() => select((active + 1) % n)} aria-label="Próxima área" className="w-12 h-12 shrink-0 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-sif-dark transition-colors"><ArrowRight size={18} /></button>
                <span className="relative flex-1 h-px bg-white/20" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 bg-sif-lime transition-[width] duration-700 ease-out" style={{ width: `${((active + 1) / n) * 100}%` }} />
                </span>
                <span className="shrink-0 sif-title text-3xl md:text-4xl tabular-nums">{pad(active + 1)}<span className="text-base text-white/40"> / {pad(n)}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PARCERIA (foto + passos em lista) ────────────────────────────── */
export function EmbSteps({ sec, photo }) {
  const items = (sec.items || []).filter(i => i && (i.title || i.subtitle || i.text));
  return (
    <section id={`secao-${sec.id}`} className="relative py-20 md:py-28 scroll-mt-28">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Header eyebrow={sec.eyebrow} title={sec.title} className="mb-0" />
            {photo && (
              <img src={img(photo, 900)} alt="" loading="lazy" decoding="async" className="hidden lg:block mt-10 w-full aspect-[4/3] object-cover rounded-card shadow-card" />
            )}
          </div>
          <ol className="lg:col-span-7 bg-white shadow-card divide-y divide-sif-ink/10">
            {items.map((it, i) => (
              <li key={i} className="grid grid-cols-[52px_1fr] md:grid-cols-[88px_1fr] gap-x-4 px-6 py-7 md:px-10 md:py-9">
                <span className="sif-title text-3xl md:text-[44px] leading-none text-sif-green tabular-nums">{pad(i + 1)}</span>
                <div className="min-w-0">
                  {it.title && <h3 className="text-lg md:text-xl font-semibold leading-snug text-sif-ink">{it.title}</h3>}
                  {it.subtitle && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{it.subtitle}</p>}
                  {it.text && <p className="mt-2 text-sm leading-relaxed text-gray-500 whitespace-pre-line">{it.text}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─── CAPACITAÇÃO (título, texto abaixo e faixa do documento) ──────── */
export function EmbTextDoc({ sec, docs }) {
  const files = (docs?.pdfs || []).filter(p => fileUrl(p));
  const [main, ...others] = files;
  return (
    <section id={`secao-${sec.id}`} className="relative py-20 md:py-28 scroll-mt-28">
      <div className="container mx-auto px-6 max-w-7xl">
        <div>
          <Header eyebrow={sec.eyebrow} title={sec.title} className="mb-8 md:mb-10" />
          <div className={`${prose(false)} prose-base md:prose-lg`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content || '') }} />
        </div>

        {main && (
          <div className="mt-12 md:mt-16 rounded-card sif-glow-dark text-white px-6 py-7 sm:px-10 md:px-12 md:py-9 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-sif-lime">{docs.eyebrow || 'Material de apoio'}</span>
              <p className="mt-2 text-lg md:text-2xl font-semibold leading-snug">{main.title || 'Documento'}</p>
              {fileMetaLabel(main) && <p className="mt-1 text-sm text-white/55">{fileMetaLabel(main)}</p>}
            </div>
            <a href={getImageUrl(fileUrl(main))} target="_blank" rel="noopener noreferrer" className={`shrink-0 self-start md:self-auto ${buttonClass('light')}`}>
              <span className="py-2">Baixar {(fileExt(main) || 'arquivo').toUpperCase()}</span><BtnArrow variant="light" icon={Download} rotate={false} />
            </a>
          </div>
        )}
        {others.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.map((p, i) => {
              const Icon = fileIcon(fileExt(p));
              return (
                <li key={i}>
                  <a href={getImageUrl(fileUrl(p))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white shadow-card rounded-card px-5 py-4 text-sm text-sif-ink hover:text-sif-green">
                    <Icon size={16} className="shrink-0 text-sif-green" aria-hidden="true" /><span className="min-w-0 truncate">{p.title || `Arquivo ${i + 2}`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ─── EQUIPE (mesmo padrão da Nossa Gente do Institucional) ─────────── */
export function EmbTeam({ sec }) {
  const items = (sec.items || []).filter(i => i && i.name);
  // Grupos do filtro: campo "Grupo" de cada pessoa (na ordem em que aparecem)
  const order = [];
  const byGroup = {};
  items.forEach((p, i) => {
    const g = String(p.group || '').trim() || 'Equipe';
    if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
    byGroup[g].push({
      id: p._id || i, name: p.name, role: p.role,
      image: p.photo ? img(p.photo, 480) : null,
      link_email: String(p.email || '').trim(), link_phone: String(p.phone || '').trim(),
    });
  });
  const groups = order.map(g => ({ key: g, label: g, data: byGroup[g] }));
  return (
    <section id={`secao-${sec.id}`} className="relative py-20 md:py-28 scroll-mt-28">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <Header eyebrow={sec.eyebrow} title={sec.title} center className="mb-14 md:mb-16" />
        <TeamDirectory groups={groups} />
      </div>
    </section>
  );
}

/* ─── COMITÊ (texto + membros + minibios) ──────────────────────────── */
// bios: [{ title: nome, content: html }] (abas do painel, ligadas pelo nome)
export function matchBios(people, tabs) {
  const list = (tabs || []).filter(t => t && t.title);
  const byName = new Map(list.map(t => [norm(t.title), t]));
  const found = new Map();
  for (const p of people) {
    const t = byName.get(norm(p.name)) || list.find(x => norm(x.title).startsWith(norm(p.name)) || norm(p.name).startsWith(norm(x.title)));
    if (t && htmlToText(t.content || '').trim()) found.set(p, t);
  }
  return found;
}

function Avatar({ p, className = '' }) {
  return (
    <div className={`rounded-full overflow-hidden bg-[#e8f3ec] shrink-0 ${className}`}>
      {p.photo
        ? <img src={img(p.photo, 320)} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-sif-green">{p.name.trim().charAt(0)}</div>}
    </div>
  );
}

// Janela da minibio.
// Notebook: foto da pessoa ocupando a coluna da esquerda (nome e cargo por cima)
// e, à direita, barra fixa com "Fechar" e o texto rolando (lado da rolagem reto).
// Celular: abre de baixo, com foto redonda, nome e "Fechar" no topo.
function BioDialog({ person, bio, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const closeBtn = (
    <button type="button" onClick={onClose} aria-label="Fechar"
      className="shrink-0 w-10 h-10 rounded-full border border-sif-ink/15 text-sif-ink flex items-center justify-center hover:bg-sif-dark hover:text-white hover:border-sif-dark transition-colors">
      <X size={18} />
    </button>
  );
  // Abre direto no <body>: dentro da seção, animações com transform prendiam a janela
  return createPortal(
    <div data-lenis-prevent role="dialog" aria-modal="true" aria-label={`Minibio de ${person.name}`} onClick={onClose}
      className="fixed inset-0 z-[100] bg-[#06190f]/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 lg:p-10">
      <div onClick={(e) => e.stopPropagation()}
        className="sif-area-in relative w-full sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-[88vh] sm:h-auto sm:max-h-[86vh] lg:h-[min(640px,86vh)] flex flex-col lg:flex-row overflow-hidden bg-white shadow-2xl rounded-tl-panel sm:rounded-l-panel">

        {/* Foto (notebook) */}
        <aside className="hidden lg:block relative shrink-0 w-[36%] bg-sif-dark">
          {person.photo
            ? <img src={img(person.photo, 800)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <span className="absolute inset-0 sif-glow-dark flex items-center justify-center text-7xl font-semibold text-sif-lime/60">{person.name.trim().charAt(0)}</span>}
          <span className="absolute inset-0 bg-gradient-to-t from-[#06190f]/95 via-[#06190f]/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-9 xl:p-10 text-white">
            <p className="sif-title text-2xl xl:text-[28px] leading-tight tracking-tight">{person.name}</p>
            {person.role && <p className="mt-2 text-sm xl:text-base text-sif-lime leading-snug">{person.role}</p>}
          </div>
        </aside>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          {/* Topo: celular com foto e nome; notebook só com "Minibio" e Fechar */}
          <div className="shrink-0 flex items-center gap-4 px-6 sm:px-10 lg:px-14 py-5 lg:py-6 border-b border-gray-100">
            <Avatar p={person} className="lg:hidden w-14 h-14 ring-2 ring-sif-green/20" />
            <div className="min-w-0 flex-1">
              <span className="hidden lg:block text-[11px] font-bold uppercase tracking-[0.22em] text-sif-green">Minibio</span>
              <p className="lg:hidden font-semibold leading-tight text-sif-ink">{person.name}</p>
              {person.role && <p className="lg:hidden mt-0.5 text-sm text-sif-green leading-snug">{person.role}</p>}
            </div>
            {closeBtn}
          </div>
          <div className={`flex-1 min-h-0 overflow-y-auto px-6 py-7 sm:px-10 lg:px-14 lg:py-10 ${prose(false)} prose-base lg:prose-lg`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(bio.content || '') }} />
        </div>
      </div>
    </div>,
    document.body
  );
}

export function EmbCommittee({ intro, people, bios, photo }) {
  const items = (people?.items || []).filter(i => i && i.name);
  const bioMap = matchBios(items, bios?.tabs);
  const [open, setOpen] = useState(null);
  const anchor = (intro || people).id;
  return (
    <PhotoBand id={`secao-${anchor}`} photo={photo} className="py-20 md:py-28 scroll-mt-28">
      <div className="relative container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {intro && (
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Header eyebrow={intro.eyebrow} title={intro.title} dark className="mb-8" />
                <div className={`${prose(true)} prose-base md:prose-lg`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(intro.content || '') }} />
              </div>
            </div>
          )}
          <div className={intro ? 'lg:col-span-7' : 'lg:col-span-12'}>
            {!intro && <Header eyebrow={people.eyebrow} title={people.title} dark />}
            {(bios?.eyebrow || bios?.title) && bioMap.size > 0 && (
              <div className="mb-6">
                {bios.eyebrow && <span className="block text-xs font-bold uppercase tracking-[0.2em] text-sif-lime">{bios.eyebrow}</span>}
                {bios.title && <h3 className="mt-2 text-xl md:text-2xl font-semibold text-white">{bios.title}</h3>}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((p, i) => {
                const bio = bioMap.get(p);
                const Tag = bio ? 'button' : 'div';
                return (
                  <Tag key={p._id || i} {...(bio ? { type: 'button', onClick: () => setOpen(p) } : {})}
                    className="group text-left flex items-center gap-4 rounded-card bg-[#0d2418]/90 border border-white/10 p-4 md:p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,.7)] transition-colors duration-300 hover:bg-[#123120]/95 hover:border-sif-lime/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sif-lime">
                    <Avatar p={p} className="w-16 h-16 md:w-[72px] md:h-[72px] ring-2 ring-sif-lime/40" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-tight text-white">{p.name}</span>
                      {p.role && <span className="block mt-1 text-sm leading-snug text-white/60">{p.role}</span>}
                      {bio && (
                        <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-sif-lime">
                          <span className="w-5 h-5 rounded-full bg-sif-lime/15 flex items-center justify-center transition-transform duration-300 group-hover:rotate-90"><Plus size={12} /></span>
                          Ler minibio
                        </span>
                      )}
                    </span>
                  </Tag>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {open && <BioDialog person={open} bio={bioMap.get(open)} onClose={() => setOpen(null)} />}
    </PhotoBand>
  );
}

/* ─── LOGOS (realização e apoio) ───────────────────────────────────── */
// Cada logo ganha a mesma "área" visual: logos largos ficam mais baixos e
// logos quadrados mais altos, para nenhum parecer maior que o outro.
function BalancedLogo({ src, alt }) {
  const [w, setW] = useState(null);
  return (
    <img src={getImageUrl(src, 640)} alt={alt} loading="lazy" decoding="async"
      onLoad={(e) => { const r = e.currentTarget.naturalWidth / (e.currentTarget.naturalHeight || 1); setW(Math.round(Math.min(280, Math.sqrt(19000 * r)))); }}
      style={w ? { width: `${w}px` } : undefined}
      className="max-w-full max-h-[96px] md:max-h-[124px] h-auto object-contain" />
  );
}

export function EmbLogos({ sec }) {
  const imgs = (sec.images || []).map(i => (typeof i === 'string' ? { url: i } : i)).filter(i => i && i.url);
  if (!imgs.length) return null;
  const cols = imgs.length <= 2 ? 'grid-cols-2' : imgs.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4';
  return (
    <section id={`secao-${sec.id}`} className="relative bg-white py-16 md:py-24 scroll-mt-28 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <Header eyebrow={sec.eyebrow} title={sec.title} center className="mb-10 md:mb-14" />
        {imgs.length > 8 ? <LogoCarousel images={imgs} /> : (
          <div className={`grid ${cols} gap-px bg-gray-100 rounded-card overflow-hidden border border-gray-100`}>
            {imgs.map((it, i) => {
              const logo = <BalancedLogo src={it.url} alt={it.alt || `Logo ${i + 1}`} />;
              return (
                <div key={i} className="bg-white flex items-center justify-center h-36 sm:h-44 md:h-56 px-5 md:px-8">
                  {it.link ? <a href={it.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">{logo}</a> : logo}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── FALE CONOSCO (texto + formulário próprio) ────────────────────── */
export function EmbContact({ c, photo }) {
  return (
    <section id="fale-conosco" className="relative py-20 md:py-28 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-card md:rounded-panel overflow-hidden bg-white shadow-card-hover">
          <PhotoBand as="div" photo={photo} className="lg:col-span-5 px-6 py-10 sm:px-10 md:px-12 md:py-14 flex flex-col">
            {c.cta_tag && <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime mb-5">{c.cta_tag}</span>}
            {c.cta_title && <h2 className="sif-title text-3xl md:text-4xl leading-[1.1] tracking-tight">{c.cta_title}</h2>}
            {c.cta_text && <p className="mt-6 text-base md:text-[17px] leading-relaxed text-white/75">{c.cta_text}</p>}
            {c.form_note && <p className="relative mt-10 lg:mt-auto pt-6 border-t border-white/10 text-sm font-semibold text-sif-lime">{c.form_note}</p>}
          </PhotoBand>
          <div className="lg:col-span-7 px-6 py-10 sm:px-10 md:px-14 md:py-14">
            <EmbrapiiForm buttonLabel={c.form_button || 'Quero uma demonstração'} />
          </div>
        </div>
      </div>
    </section>
  );
}
