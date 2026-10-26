import React, { useEffect, useState } from 'react';
import { Play, Phone, Mail, X, Plus, Sprout, Factory, Leaf, Download } from 'lucide-react';
import { getImageUrl, cleanRichHtml, htmlToText } from '../../apiConfig';
import PhotoBand from '../ui/PhotoBand';
import { videoEmbedUrl } from '../ui/VideoModal';
import { buttonClass, BtnArrow } from '../ui/Button';
import LogoCarousel from '../sections/LogoCarousel';
import { fileExt, fileIcon, fileMetaLabel, fileUrl } from '../sections/fileMeta';

// Blocos com desenho próprio da página "Projetos SIF e EMBRAPII".
// Todo o conteúdo vem do painel (page_configs "embrapii"); aqui só o visual.

const img = (p, w = 1280) => (p ? getImageUrl(p, w) : '');
const FRENTE_ICONS = [Sprout, Factory, Leaf];
const pad = (n) => String(n).padStart(2, '0');
const paragraphs = (t) => String(t || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

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

/* ─── APRESENTAÇÃO + FOCOS ─────────────────────────────────────────── */
export function EmbIntro({ c, frentes }) {
  const [lead, ...rest] = paragraphs(c.intro_text);
  return (
    <section id="embrapii-intro" className="relative py-20 md:py-28 scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(127,186,0,.16),transparent)]" aria-hidden="true" />
      <div className="relative container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            {c.intro_tag && <span className="sif-eyebrow mb-4">{c.intro_tag}</span>}
            {c.intro_title && <h2 className="sif-title sif-h2 text-sif-ink">{c.intro_title}</h2>}
            {c.intro_image && (
              <div className="relative mt-10 hidden lg:block">
                <div className="absolute -inset-3 rounded-panel bg-sif-leaf/15 -rotate-2" aria-hidden="true" />
                <img src={img(c.intro_image, 900)} alt="" loading="lazy" decoding="async" className="relative w-full aspect-[5/4] object-cover rounded-panel shadow-card-hover" />
              </div>
            )}
          </div>
          <div className="lg:col-span-7">
            {lead && <p className="text-xl md:text-2xl leading-relaxed text-sif-ink font-medium" data-reveal>{lead}</p>}
            {rest.map((p, i) => (
              <p key={i} className="mt-6 text-base md:text-lg leading-relaxed text-gray-600" data-reveal>{p}</p>
            ))}
            {c.intro_image && (
              <img src={img(c.intro_image, 900)} alt="" loading="lazy" decoding="async" className="lg:hidden mt-10 w-full aspect-[16/10] object-cover rounded-card shadow-card" />
            )}
          </div>
        </div>

        {frentes.length > 0 && (
          <div className="mt-20 md:mt-24">
            {c.frentes_tag && <span className="sif-eyebrow mb-6">{c.frentes_tag}</span>}
            <div className={`grid grid-cols-1 ${['', '', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2 lg:grid-cols-4'][Math.min(frentes.length, 4)]} gap-5`}>
              {frentes.map((f, i) => {
                const Icon = FRENTE_ICONS[i % FRENTE_ICONS.length];
                return (
                  <article key={i} className="group relative overflow-hidden rounded-card aspect-[16/11] md:aspect-[4/5] sif-glow-dark shadow-card transition-transform duration-500 hover:-translate-y-1">
                    {f.image
                      ? <img src={img(f.image, 800)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                      : <Icon size={180} strokeWidth={0.8} className="absolute -right-8 -top-6 text-sif-lime/20" aria-hidden="true" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06230f]/95 via-[#0b3320]/45 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 p-7 md:p-8 text-white">
                      <span className="block text-sm font-semibold tracking-[0.2em] text-sif-lime">{pad(i + 1)}</span>
                      <h3 className="mt-3 text-xl md:text-2xl font-semibold leading-tight">{f.title}</h3>
                      {f.text && <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">{f.text}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── PASSOS (linha do tempo) ──────────────────────────────────────── */
const STEP_COLS = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' };
export function EmbSteps({ sec }) {
  const items = (sec.items || []).filter(i => i && (i.title || i.subtitle || i.text));
  const timeline = items.length <= 6;
  return (
    <section id={`secao-${sec.id}`} className="sif-glow relative py-20 md:py-28 scroll-mt-28">
      <div className="relative container mx-auto px-6 max-w-7xl">
        <Header eyebrow={sec.eyebrow} title={sec.title} />
        <ol className={`relative grid grid-cols-1 gap-5 ${timeline ? STEP_COLS[items.length] || '' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {timeline && (
            <span aria-hidden="true" className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-sif-green via-sif-leaf to-sif-green/20 lg:bottom-auto lg:w-auto lg:h-px lg:left-[8%] lg:right-[8%] lg:bg-gradient-to-r" />
          )}
          {items.map((it, i) => (
            <li key={i} className="relative flex lg:flex-col gap-4 lg:gap-7 min-w-0">
              <span className="relative z-[1] shrink-0 w-14 h-14 lg:mx-auto rounded-full bg-sif-dark text-sif-lime flex items-center justify-center text-base font-semibold tabular-nums shadow-[0_0_0_6px_rgba(255,255,255,.55)]">
                {pad(i + 1)}
              </span>
              <div tabIndex={0} className="group flex-1 min-w-0 rounded-card bg-white shadow-card p-6 md:p-7 outline-none transition-colors duration-500 hover:bg-sif-dark focus:bg-sif-dark lg:min-h-[220px]">
                {it.title && <h3 className="text-lg md:text-xl font-semibold leading-snug text-sif-ink transition-colors duration-500 group-hover:text-white group-focus:text-white">{it.title}</h3>}
                {it.subtitle && <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-white/75 group-focus:text-white/75">{it.subtitle}</p>}
                {it.text && <p className="mt-3 text-sm leading-relaxed text-gray-500 whitespace-pre-line group-hover:text-white/75 group-focus:text-white/75">{it.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── VÍDEO em destaque sobre faixa escura ─────────────────────────── */
export function EmbVideo({ sec, photo }) {
  const [play, setPlay] = useState(false);
  const url = String(sec.url || '').trim();
  const embed = videoEmbedUrl(url);
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  const [thumb, setThumb] = useState(yt ? `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg` : '');
  const isFile = /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
  if (!embed && !isFile) return null;
  return (
    <PhotoBand id={`secao-${sec.id}`} photo={photo} className="scroll-mt-28 py-20 md:py-28">
      <div className="relative container mx-auto px-6 max-w-5xl">
        <Header eyebrow={sec.eyebrow} title={sec.title} dark center className="mb-10 md:mb-12" />
        <div className="relative">
          <div className="absolute -inset-4 md:-inset-6 rounded-[48px] border border-white/10" aria-hidden="true" />
          <div className="relative aspect-video rounded-card md:rounded-panel overflow-hidden bg-[#06230f] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
            {!embed ? (
              <video src={getImageUrl(url)} controls preload="metadata" playsInline className="w-full h-full" />
            ) : play ? (
              <iframe src={embed} title={sec.title || 'Vídeo'} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            ) : (
              <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 w-full h-full" aria-label="Assistir ao vídeo">
                {thumb && <img src={thumb} alt="" loading="lazy" onError={() => setThumb(t => (t.includes('maxres') ? t.replace('maxresdefault', 'hqdefault') : ''))} className="absolute inset-0 w-full h-full object-cover scale-[1.04]" />}
                <span className="absolute inset-0 bg-gradient-to-t from-[#06230f]/70 via-transparent to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-24 h-24 md:w-28 md:h-28 rounded-full bg-sif-lime/30 animate-ping [animation-duration:2.2s]" aria-hidden="true" />
                    <span className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-sif-dark flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </span>
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        {sec.caption && <p className="mt-6 text-center text-sm text-white/60">{sec.caption}</p>}
      </div>
    </PhotoBand>
  );
}

/* ─── TEXTO + DOCUMENTO em destaque (Programa de RH) ───────────────── */
export function EmbTextDoc({ sec, docs }) {
  const files = (docs?.pdfs || []).filter(p => fileUrl(p));
  const main = files[0];
  const others = files.slice(1);
  return (
    <section id={`secao-${sec.id}`} className="relative py-20 md:py-28 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-card md:rounded-panel overflow-hidden bg-white shadow-card">
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-14">
            <Header eyebrow={sec.eyebrow} title={sec.title} className="mb-8" />
            <div className={`${prose(false)} prose-base md:prose-lg`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(sec.content || '') }} />
          </div>
          {main && (
            <div className="lg:col-span-5 sif-glow-dark text-white p-6 sm:p-10 md:p-14 flex flex-col">
              {(docs.eyebrow || docs.title) && (
                <div className="mb-10">
                  {docs.eyebrow && <span className="block text-xs font-bold uppercase tracking-[0.2em] text-sif-lime">{docs.eyebrow}</span>}
                  {docs.title && <h3 className="mt-3 text-2xl font-semibold leading-snug">{docs.title}</h3>}
                </div>
              )}
              {/* "Folhas" do documento (ilustração leve, só CSS) */}
              <div className="relative mx-auto w-40 md:w-48 aspect-[3/4] my-4" aria-hidden="true">
                <div className="absolute inset-0 rounded-2xl bg-white/10 rotate-[8deg] translate-x-3" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 rotate-[3deg] translate-x-1" />
                <div className="absolute inset-0 rounded-2xl bg-white shadow-2xl p-5 flex flex-col -rotate-2">
                  <span className="self-start rounded-md bg-sif-dark text-sif-lime text-[10px] font-bold tracking-widest px-2 py-1">{(fileExt(main) || 'doc').toUpperCase()}</span>
                  <span className="mt-5 h-2 w-4/5 rounded bg-sif-dark/80" />
                  <span className="mt-2 h-2 w-3/5 rounded bg-sif-dark/80" />
                  {[0, 1, 2, 3, 4].map(k => <span key={k} className="mt-3 h-1.5 rounded bg-gray-200" style={{ width: `${92 - k * 9}%` }} />)}
                  <span className="mt-auto h-8 w-8 rounded-full bg-sif-leaf/25" />
                </div>
              </div>
              <div className="mt-10">
                <p className="text-lg md:text-xl font-semibold leading-snug">{main.title || 'Documento'}</p>
                {fileMetaLabel(main) && <p className="mt-1 text-sm text-white/55">{fileMetaLabel(main)}</p>}
                <a href={getImageUrl(fileUrl(main))} target="_blank" rel="noopener noreferrer" className={`mt-6 ${buttonClass('light')}`}>
                  <span className="py-2">Baixar documento</span><BtnArrow variant="light" icon={Download} rotate={false} />
                </a>
              </div>
              {others.length > 0 && (
                <ul className="mt-8 pt-6 border-t border-white/10 space-y-2">
                  {others.map((p, i) => {
                    const Icon = fileIcon(fileExt(p));
                    return (
                      <li key={i}>
                        <a href={getImageUrl(fileUrl(p))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/80 hover:text-sif-lime">
                          <Icon size={16} className="shrink-0" aria-hidden="true" /><span className="min-w-0 truncate">{p.title || `Arquivo ${i + 2}`}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── EQUIPE ───────────────────────────────────────────────────────── */
function Avatar({ p, className = '' }) {
  return (
    <div className={`rounded-full overflow-hidden bg-[#e8f3ec] shrink-0 ${className}`}>
      {p.photo
        ? <img src={img(p.photo, 320)} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-sif-green">{p.name.trim().charAt(0)}</div>}
    </div>
  );
}

export function EmbTeam({ sec }) {
  const items = (sec.items || []).filter(i => i && i.name);
  return (
    <section id={`secao-${sec.id}`} className="relative py-20 md:py-28 scroll-mt-28">
      <div className="container mx-auto px-6 max-w-7xl">
        <Header eyebrow={sec.eyebrow} title={sec.title} />
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {items.map((p, i) => {
            const phone = String(p.phone || '').trim();
            const email = String(p.email || '').trim();
            const card = (
              <>
                <Avatar p={p} className="w-24 h-24 md:w-28 md:h-28 mx-auto ring-4 ring-[#eef5f0] shadow-card" />
                <p className="mt-5 font-semibold leading-tight text-sif-ink">{p.name}</p>
                {p.role && <p className="mt-1.5 text-sm leading-snug text-sif-green">{p.role}</p>}
              </>
            );
            return (
              <div key={p._id || i} className="group flex flex-col text-center bg-white rounded-card shadow-card px-4 pt-7 pb-5 md:px-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]">
                {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer">{card}</a> : card}
                {(phone || email) && (
                  <div className="mt-auto pt-4">
                    <div className="mt-1 pt-4 border-t border-gray-100 flex flex-col items-center gap-1.5 text-xs text-gray-500">
                      {phone && (
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-sif-green" title={phone}>
                          <Phone size={13} className="shrink-0 text-sif-green" aria-hidden="true" /><span>{phone}</span>
                        </a>
                      )}
                      {email && (
                        <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-sif-green max-w-full" title={email}>
                          <Mail size={13} className="shrink-0 text-sif-green" aria-hidden="true" />
                          <span className="hidden sm:inline min-w-0 truncate">{email}</span>
                          <span className="sm:hidden">E-mail</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

function BioDialog({ person, bio, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div data-lenis-prevent role="dialog" aria-modal="true" aria-label={person.name} onClick={onClose}
      className="fixed inset-0 z-[100] bg-[#06230f]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-t-panel sm:rounded-panel shadow-2xl">
        <div className="sif-glow-dark text-white px-7 pt-8 pb-7 sm:px-10 flex items-center gap-5 rounded-t-panel">
          <Avatar p={person} className="w-20 h-20 ring-4 ring-white/15" />
          <div className="min-w-0">
            <p className="text-xl font-semibold leading-tight">{person.name}</p>
            {person.role && <p className="mt-1 text-sm text-sif-lime leading-snug">{person.role}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="ml-auto self-start shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><X size={20} /></button>
        </div>
        <div className={`px-7 py-8 sm:px-10 sm:py-10 ${prose(false)} prose-base`} dangerouslySetInnerHTML={{ __html: cleanRichHtml(bio.content || '') }} />
      </div>
    </div>
  );
}

export function EmbCommittee({ intro, people, bios }) {
  const items = (people?.items || []).filter(i => i && i.name);
  const bioMap = matchBios(items, bios?.tabs);
  const [open, setOpen] = useState(null);
  const anchor = (intro || people).id;
  return (
    <section id={`secao-${anchor}`} className="sif-glow-dark relative py-20 md:py-28 scroll-mt-28 overflow-hidden">
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
                    className="group text-left flex items-center gap-4 rounded-card bg-white/[0.06] border border-white/10 p-4 md:p-5 transition-colors duration-300 hover:bg-white/[0.12] hover:border-sif-lime/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sif-lime">
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
    </section>
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
