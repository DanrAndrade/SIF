import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ParallaxLayer from './ui/ParallaxLayer';

// Topo padrão das páginas de detalhe (Grupo Temático, Evento, Treinamento,
// In-Company, Projeto): capa com degradê, trilha de navegação, etiqueta,
// título, resumo, informações rápidas (chips) e botões.
//
//   <DetailHero cover={url} accent="#007a3d" crumbs={[{label:'Eventos', to:'/eventos'}]}
//     eyebrow="Evento" icon={CalendarDays} title="..." summary="..."
//     chips={[{ icon: MapPin, text: 'Viçosa' }]} actions={<Button .../>} />
export default function DetailHero({ cover, accent = '#007a3d', crumbs = [], eyebrow, icon: Icon, title, summary, chips = [], actions, children }) {
  const color = /^#[0-9a-f]{6}$/i.test(accent || '') ? accent : '#007a3d';
  const items = chips.filter(c => c && c.text);
  return (
    <header className="relative min-h-[64vh] flex items-end pt-32 pb-14 md:pb-20 overflow-hidden bg-[#0b2116] rounded-bl-[40px] md:rounded-bl-[80px]">
      {cover && <ParallaxLayer><img src={cover} alt="" fetchpriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover" /></ParallaxLayer>}
      <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, rgba(5,18,11,.92) 0%, rgba(5,18,11,.72) 45%, ${color}55 100%)` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative w-full sif-container">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-xs text-white/60 mb-8">
          <Link to="/" className="hover:text-white">Início</Link>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}><ChevronRight size={12} />{c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span>{c.label}</span>}</React.Fragment>
          ))}
          <ChevronRight size={12} /><span className="text-white/90 truncate max-w-[60vw]">{title}</span>
        </nav>

        {eyebrow && (
          <div className="flex items-center gap-3 mb-5">
            {Icon && <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}><Icon size={20} /></span>}
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sif-lime">{eyebrow}</span>
          </div>
        )}
        <h1 className="sif-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white max-w-4xl">{title}</h1>
        {summary && <p className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl">{summary}</p>}

        {items.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {items.map((c, i) => {
              const CIcon = c.icon;
              return (
                <li key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm">
                  {c.dot && <span className={`w-2 h-2 rounded-full ${c.dot}`} />}
                  {CIcon && <CIcon size={15} className="text-sif-lime" />}
                  {c.text}
                </li>
              );
            })}
          </ul>
        )}
        {actions && <div className="mt-10 flex flex-wrap items-center gap-3">{actions}</div>}
        {children}
      </div>
    </header>
  );
}
