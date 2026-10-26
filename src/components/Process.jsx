import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../apiConfig';
import PhotoBand from './ui/PhotoBand';

// Home › "Explore nossos recursos" (Painel › Home › Explore Recursos).
// Faixa escura com foto desfocada que troca junto com o painel em destaque;
// painéis com foto que se expandem ao passar o mouse (mesma linguagem das
// "Áreas de Atuação" da Institucional). No celular: cards com arraste.

// Foto padrão por posição (Unsplash) quando o painel não tem imagem própria
const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1758272959521-170d37e63c8a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615671524990-c0e871c5f806?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758343660101-10ee4fa1ca68?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509414556967-312906f278a0?q=80&w=1600&auto=format&fit=crop',
];

const DEFAULT_STEPS = [
  { id: "01", title: "Blog e Notícias", icon_type: "Newspaper", img: "", shortDesc: "Fique por dentro das novidades.", fullDesc: "Acompanhe as últimas notícias, eventos e inovações do setor florestal brasileiro.", benefits: "Novidades, Artigos, Eventos", link: "/blog", external: false },
  { id: "02", title: "Treinamentos", icon_type: "BookOpen", img: "", shortDesc: "Qualificação profissional.", fullDesc: "Consulte nossa agenda completa de treinamentos e cursos especializados para o setor.", benefits: "Cursos, Certificados, Expertise", link: "/treinamentos", external: false },
  { id: "03", title: "Nossos Projetos", icon_type: "TreePine", img: "", shortDesc: "Inovação em P&D+I.", fullDesc: "Conheça os projetos de pesquisa e desenvolvimento que estamos realizando no campo.", benefits: "P&D+I, Tecnologia, Campo", link: "/projetos", external: false },
  { id: "04", title: "Transparência", icon_type: "ScrollText", img: "", shortDesc: "Ética e Integridade.", fullDesc: "Acesse nosso Código de Conduta e diretrizes de conformidade aplicadas a todos os processos.", benefits: "Ética, Compliance, Governança", link: "https://sif.conveniar.com.br/portaltransparencia/", external: true },
];

// Link interno, externo ou nada
function StepLink({ step, className, children, ...rest }) {
  if (step.external) return <a href={step.link} target="_blank" rel="noopener noreferrer" className={className} {...rest}>{children}</a>;
  return <Link to={step.link} className={className} {...rest}>{children}</Link>;
}

// Foto do painel: se falhar, cai na foto padrão
function StepPhoto({ src, fallback, className, style }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed || !src ? fallback : src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} style={style} />;
}

export default function Process({ config = {} }) {
  const [active, setActive] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const scrollRef = useRef(null);

  const sectionTag = config.section_tag || 'Inovação e Transparência';
  const sectionTitle = config.section_title || 'Explore nossos recursos';
  const sectionSubtitle = config.section_subtitle || 'Acesse as principais áreas e conteúdos da nossa plataforma.';

  const rawSteps = Array.isArray(config.steps) && config.steps.length > 0 ? config.steps : DEFAULT_STEPS;
  const steps = rawSteps.map((s, i) => ({
    title: s.title || '',
    img: s.img ? getImageUrl(s.img, 1280) : '',
    fallback: getImageUrl(DEFAULT_PHOTOS[i % DEFAULT_PHOTOS.length], 1280),
    shortDesc: s.shortDesc || '',
    fullDesc: s.fullDesc || '',
    benefits: typeof s.benefits === 'string'
      ? s.benefits.split(',').map(b => b.trim()).filter(Boolean)
      : (Array.isArray(s.benefits) ? s.benefits : []),
    link: s.link || '#',
    external: !!s.external,
  }));
  // Fundo da faixa: a foto do painel em destaque (no celular, a do card visível)
  const slides = steps.map(s => s.img || s.fallback);

  const onMobileScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const w = card ? card.getBoundingClientRect().width + 16 : el.offsetWidth;
    setMobileIndex(Math.min(steps.length - 1, Math.max(0, Math.round(el.scrollLeft / w))));
  };

  return (
    <div className="px-4 md:px-6">
      <PhotoBand slides={slides} active={typeof window !== 'undefined' && window.innerWidth < 1024 ? mobileIndex : active}
        className="max-w-[1400px] mx-auto rounded-panel py-14 lg:py-20 shadow-[0_40px_80px_-40px_rgba(6,25,15,0.7)]">
        <div className="relative px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
            <div className="max-w-2xl">
              <span className="block text-sif-lime font-bold tracking-[0.25em] uppercase text-xs mb-4">{sectionTag}</span>
              <h2 className="sif-title text-3xl md:text-5xl text-white tracking-tight leading-tight">{sectionTitle}</h2>
            </div>
            {sectionSubtitle && <p className="text-white/70 text-base md:text-lg max-w-md lg:text-right">{sectionSubtitle}</p>}
          </div>

          {/* COMPUTADOR: painéis que se expandem */}
          <div className="hidden lg:flex w-full h-[460px] gap-3" data-no-reveal>
            {steps.map((step, i) => {
              const isActive = active === i;
              return (
                <StepLink key={i} step={step}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                  className="group relative h-full min-w-0 rounded-card overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sif-lime transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]"
                  style={{ flexGrow: isActive ? 3.4 : 1, flexBasis: 0 }}>
                  <StepPhoto src={step.img} fallback={step.fallback}
                    className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ transform: isActive ? 'scale(1.03)' : 'scale(1.15)', filter: isActive ? 'brightness(.8)' : 'saturate(.6) brightness(.6)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06190f] via-[#06190f]/75 to-[#06190f]/25" />

                  {/* Fechado: título na vertical */}
                  <div className={`absolute left-6 bottom-6 origin-bottom-left -rotate-90 translate-x-6 whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
                    <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/85">{step.title}</span>
                  </div>

                  {/* Aberto: conteúdo completo */}
                  <div className={`absolute inset-x-0 bottom-0 p-8 xl:p-10 text-white transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                    {step.shortDesc && <span className="block text-xs font-bold uppercase tracking-[0.2em] text-sif-lime mb-3">{step.shortDesc}</span>}
                    <h3 className="text-3xl xl:text-4xl font-semibold leading-tight mb-4 max-w-xl">{step.title}</h3>
                    {step.fullDesc && <p className="text-white/80 leading-relaxed max-w-xl mb-6">{step.fullDesc}</p>}
                    <div className="flex flex-wrap items-center gap-2">
                      {step.benefits.map((b, j) => (
                        <span key={j} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90">{b}</span>
                      ))}
                      <span className="ml-auto inline-flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-white text-sif-dark text-xs font-bold uppercase tracking-wider transition-colors group-hover:bg-sif-lime">
                        Acessar <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </StepLink>
              );
            })}
          </div>

          {/* CELULAR / TABLET: cards com arraste */}
          <div className="lg:hidden">
            <div ref={scrollRef} onScroll={onMobileScroll} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 pb-2" data-no-reveal>
              {steps.map((step, i) => (
                <StepLink key={i} step={step} className="relative shrink-0 w-[85%] sm:w-[60%] snap-center rounded-card overflow-hidden min-h-[420px] flex flex-col justify-end">
                  <StepPhoto src={step.img} fallback={step.fallback} className="absolute inset-0 w-full h-full object-cover brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06190f] via-[#06190f]/80 to-[#06190f]/20" />
                  <div className="relative p-6 text-white">
                    {step.shortDesc && <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-sif-lime mb-2">{step.shortDesc}</span>}
                    <h3 className="text-2xl font-semibold leading-tight mb-3">{step.title}</h3>
                    {step.fullDesc && <p className="text-white/80 text-sm leading-relaxed mb-5">{step.fullDesc}</p>}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {step.benefits.map((b, j) => <span key={j} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-white/90">{b}</span>)}
                    </div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sif-dark text-xs font-bold uppercase tracking-wider">Acessar <ArrowUpRight size={15} /></span>
                  </div>
                </StepLink>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {steps.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${mobileIndex === i ? 'w-8 bg-sif-lime' : 'w-2 bg-white/25'}`} />)}
            </div>
          </div>
        </div>
      </PhotoBand>
    </div>
  );
}
