import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { whatsappLink } from '../../apiConfig';

// Equipe no padrão do site (Institucional › Nossa Gente e EMBRAPII › Nossa equipe):
// filtro por grupo + busca por nome/cargo e um carrossel de fotos redondas por grupo.
//
// groups: [{ key, label, data: [{ id, name, role, image, link_email, link_whatsapp, link_phone }] }]

const norm = (s) => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase(); // sem acentos
const words = (s) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

// Quão bem a pessoa combina com a busca (menor = melhor; -1 = não aparece):
// 0 primeiro nome começa com o texto, 1 outro nome começa, 2 cargo começa
// (a partir de 2 letras), 3 o texto aparece no meio (a partir de 3 letras).
function matchScore(m, q) {
  if (q.includes(' ')) return norm(m.name).includes(q) ? 1 : (norm(m.role).includes(q) ? 2 : -1);
  const name = words(m.name);
  if (name[0]?.startsWith(q)) return 0;
  if (name.some((w) => w.startsWith(q))) return 1;
  if (q.length >= 2 && words(m.role).some((w) => w.startsWith(q))) return 2;
  if (q.length >= 3 && norm(`${m.name} ${m.role || ''}`).includes(q)) return 3;
  return -1;
}

// Carrossel de um grupo: centralizado quando cabe; com setas quando não cabe.
export function TeamCarousel({ title, data }) {
  const scrollRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setNeedsScroll(el.scrollWidth > el.clientWidth + 2); // +2: folga de sub-pixel
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = ((el.firstChild?.offsetWidth || 160) + 24) * 3; // 3 cards por vez
    el.scrollTo({ left: el.scrollLeft + (direction === 'left' ? -amount : amount), behavior: 'smooth' });
  };

  const navBtn = 'w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1f2937] hover:bg-[#007a3d] hover:border-[#007a3d] hover:text-white transition-all shadow-sm active:scale-95';

  return (
    <div className="mb-20 last:mb-0">
      <div className="flex items-center justify-between mb-10">
        {title ? (
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1f2937] border-l-4 border-[#007a3d] pl-4">{title}</h3>
        ) : <span />}
        {needsScroll && (
          <div className="flex gap-3 shrink-0 ml-4">
            <button type="button" onClick={() => scroll('left')} aria-label="Anterior" className={navBtn}><ArrowLeft size={16} strokeWidth={2.5} /></button>
            <button type="button" onClick={() => scroll('right')} aria-label="Próximo" className={navBtn}><ArrowRight size={16} strokeWidth={2.5} /></button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`flex gap-5 sm:gap-6 md:gap-8 snap-x snap-mandatory ${needsScroll ? 'overflow-x-auto no-scrollbar' : 'flex-wrap justify-start overflow-x-visible'}`}
      >
        {data.map((m, i) => (
          <div key={m.id ?? i} className="w-[130px] sm:w-[155px] md:w-[180px] shrink-0 snap-start group text-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-3 ring-4 ring-transparent group-hover:ring-[#007a3d] transition-all duration-500 bg-gray-100 flex items-center justify-center">
              {m.image ? (
                <img src={m.image} alt={m.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <span className="text-2xl font-semibold text-[#007a3d]">{String(m.name || '').trim().charAt(0)}</span>
              )}
            </div>
            {m.role && (
              <span className="text-[#007a3d] text-[10px] font-black uppercase tracking-[0.15em] mb-1 block leading-snug">{m.role}</span>
            )}
            <h4 className="font-bold text-[#1f2937] text-xs sm:text-sm uppercase tracking-tight leading-tight">{m.name}</h4>
            {(m.link_email || m.link_whatsapp || m.link_phone) && (
              <div className="mt-1">
                {m.link_phone && (
                  <a href={`tel:${String(m.link_phone).replace(/[^\d+]/g, '')}`} className="block py-1.5 text-[11px] text-gray-500 hover:text-[#007a3d] leading-tight">{m.link_phone}</a>
                )}
                {m.link_email && (
                  <a href={`mailto:${m.link_email}`} className="block py-1.5 text-[11px] text-gray-500 hover:text-[#007a3d] break-all leading-tight">{m.link_email}</a>
                )}
                {m.link_whatsapp && (
                  <a href={whatsappLink(m.link_whatsapp)} target="_blank" rel="noopener noreferrer" className="block py-1.5 text-[11px] text-gray-500 hover:text-[#007a3d] leading-tight">{m.link_whatsapp}</a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Filtro (abas por grupo + busca) e os carrosséis.
// Com um grupo só, as abas somem e fica só a busca.
export default function TeamDirectory({ groups = [] }) {
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');
  const visible = groups.filter((g) => g.data && g.data.length > 0);
  if (visible.length === 0) return null;

  const q = norm(query.trim()).replace(/\s+/g, ' ');
  const inFilter = visible.filter((g) => filter === 'todos' || g.key === filter);
  // Com busca: uma lista só, quem combina melhor primeiro (ex.: "E" traz a Edna no começo)
  const results = q
    ? inFilter.flatMap((g) => g.data)
        .map((m) => [matchScore(m, q), m])
        .filter(([sc]) => sc >= 0)
        .sort((a, b) => a[0] - b[0] || norm(a[1].name).localeCompare(norm(b[1].name)))
        .map(([, m]) => m)
    : [];
  const shown = q
    ? (results.length ? [{ key: 'busca', label: `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`, data: results }] : [])
    : inFilter;
  const tabs = visible.length > 1 ? [{ key: 'todos', label: 'Todos' }, ...visible.map((g) => ({ key: g.key, label: g.label || g.key }))] : [];

  return (
    <>
      <div className="flex flex-col gap-6 mb-14" data-no-reveal>
        {/* celular: abas numa linha que desliza para o lado; computador: quebram linha */}
        {tabs.length > 0 && (
          <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-x-6 gap-y-3 border-b border-gray-200 min-w-max md:min-w-0 md:flex-wrap" role="tablist" aria-label="Filtrar por grupo">
            {tabs.map((t) => (
              <button key={t.key} type="button" role="tab" aria-selected={filter === t.key} onClick={() => setFilter(t.key)}
                className={`relative shrink-0 pt-2 pb-3.5 text-sm font-semibold transition-colors ${filter === t.key ? 'text-[#1f2937]' : 'text-gray-400 hover:text-gray-600'}`}>
                {t.label}
                <span className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#007a3d] transition-transform duration-300 origin-left ${filter === t.key ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
          </div>
        )}
        <label className="relative block w-full md:w-80">
          <span className="sr-only">Buscar pessoa</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou cargo"
            className="w-full bg-transparent border-b border-gray-300 focus:border-[#007a3d] outline-none py-2.5 text-sm text-[#1f2937] placeholder:text-gray-400 transition-colors" />
        </label>
      </div>

      {shown.map((g) => (
        <TeamCarousel key={g.key + query} title={q || visible.length > 1 ? (g.label || g.key) : ''} data={g.data} />
      ))}
      {shown.length === 0 && <p className="text-center text-gray-400 py-12">Ninguém encontrado com esse nome.</p>}
    </>
  );
}
