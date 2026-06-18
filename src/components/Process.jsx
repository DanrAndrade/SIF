import React, { useState, useRef } from 'react';
import { Newspaper, BookOpen, TreePine, ScrollText, Plus, CheckCircle2, Tent, Award, FlaskConical, FileText, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from './ui/SectionHeader';
import NoiseOverlay from './ui/NoiseOverlay';
import { getImageUrl } from '../apiConfig';

const ICON_MAP = { Newspaper, BookOpen, TreePine, ScrollText, Tent, Award, FlaskConical, FileText, Calendar, Users };

const DEFAULT_STEPS = [
  { id: "01", title: "Blog e Notícias", icon_type: "Newspaper", img: "", shortDesc: "Fique por dentro das novidades.", fullDesc: "Acompanhe as últimas notícias, eventos e inovações do setor florestal brasileiro.", benefits: "Novidades, Artigos, Eventos", link: "/blog", external: false },
  { id: "02", title: "Treinamentos", icon_type: "BookOpen", img: "", shortDesc: "Qualificação profissional.", fullDesc: "Consulte nossa agenda completa de treinamentos e cursos especializados para o setor.", benefits: "Cursos, Certificados, Expertise", link: "/treinamentos", external: false },
  { id: "03", title: "Nossos Projetos", icon_type: "TreePine", img: "", shortDesc: "Inovação em P&D+I.", fullDesc: "Conheça os projetos de pesquisa e desenvolvimento que estamos realizando no campo.", benefits: "P&D+I, Tecnologia, Campo", link: "/projetos", external: false },
  { id: "04", title: "Transparência", icon_type: "ScrollText", img: "", shortDesc: "Ética e Integridade.", fullDesc: "Acesse nosso Código de Conduta e diretrizes de conformidade aplicadas a todos os processos.", benefits: "Ética, Compliance, Governança", link: "https://sif.conveniar.com.br/portaltransparencia/", external: true },
];

export default function Process({ config = {} }) {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const sectionTag = config.section_tag || 'Inovação e Transparência';
  const sectionTitle = config.section_title || 'Explore nossos recursos';
  const sectionSubtitle = config.section_subtitle || 'Acesse as principais áreas e conteúdos da nossa plataforma.';

  const rawSteps = Array.isArray(config.steps) && config.steps.length > 0 ? config.steps : DEFAULT_STEPS;
  const steps = rawSteps.map((s) => {
    const Icon = ICON_MAP[s.icon_type] || Newspaper;
    const benefitsArr = typeof s.benefits === 'string'
      ? s.benefits.split(',').map(b => b.trim()).filter(Boolean)
      : (Array.isArray(s.benefits) ? s.benefits : []);
    return {
      id: s.id || '',
      title: s.title || '',
      icon: Icon,
      img: s.img ? (s.img.startsWith('http') ? s.img : getImageUrl(s.img)) : '',
      shortDesc: s.shortDesc || '',
      fullDesc: s.fullDesc || '',
      benefits: benefitsArr,
      color: "bg-gradient-to-br from-[#1B5E20] to-[#007a3d]",
      textColor: "text-[#4ADE80]",
      link: s.link || '#',
      external: !!s.external,
    };
  });

  const handleMobileScroll = () => {
      if (scrollContainerRef.current) {
          const scrollLeft = scrollContainerRef.current.scrollLeft;
          const cardWidth = scrollContainerRef.current.offsetWidth;
          const index = Math.round(scrollLeft / cardWidth);
          setMobileActiveIndex(index);
      }
  };

  return (
      <div className="wrapper mb-4">
        <section className="relative w-full rounded-[32px] overflow-hidden bg-[#1f2937] py-12 lg:py-16 shadow-2xl">
            
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#007a3d] rounded-full blur-[120px] opacity-25 pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#4ADE80] rounded-full blur-[100px] opacity-15 pointer-events-none -translate-x-1/4 translate-y-1/4"></div>
            
            <NoiseOverlay opacity={0.2} />

            <div className="container relative z-10 flex flex-col items-center">
                <div className="max-w-2xl px-6 w-full text-center mb-10">
                    <span className="inline-block text-[#4ADE80] font-bold tracking-[0.2em] uppercase text-[10px] mb-2">{sectionTag}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight uppercase">{sectionTitle}</h2>
                    <p className="text-gray-400 text-sm md:text-base font-light">{sectionSubtitle}</p>
                </div>

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden lg:flex w-full h-[440px] gap-4 items-stretch px-4">
                    {steps.map((step, index) => {
                        const isActive = activeStep === index;
                        const LinkComponent = step.external ? 'a' : Link;
                        const linkProps = step.external 
                            ? { href: step.link, target: "_blank", rel: "noopener noreferrer" } 
                            : { to: step.link };

                        return (
                        <LinkComponent 
                            key={index}
                            {...linkProps}
                            onMouseEnter={() => setActiveStep(index)}
                            className={`
                                relative h-full rounded-[32px] overflow-hidden cursor-pointer 
                                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-[2px]
                                bg-gradient-to-b from-[#1B5E20] to-[#007a3d]
                                ${isActive ? 'flex-[3.5]' : 'flex-[1] opacity-60'}
                            `}
                        >
                            <div className="relative w-full h-full bg-[#0a0f16] rounded-[30px] overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    {step.img && <img src={step.img} alt={step.title} loading="lazy" decoding="async" className="w-full h-full object-cover brightness-[0.45]" />}
                                    <NoiseOverlay opacity={0.3} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-3xl font-black transition-all duration-500 ${isActive ? 'text-[#4ADE80]' : 'text-white/10'}`}>{step.id}</span>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10 ${step.color} ${isActive ? 'scale-110' : 'scale-90 opacity-60'}`}>
                                            <step.icon size={22} />
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex flex-col justify-end min-h-[140px]">
                                        {/* Título Vertical Ajustado */}
                                        <div className={`absolute bottom-4 left-2 origin-bottom-left -rotate-90 w-max transition-all duration-500 ${isActive ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
                                            <h3 className="text-lg font-bold uppercase text-white tracking-[0.2em] whitespace-nowrap">{step.title}</h3>
                                        </div>
                                        
                                        {/* Conteúdo Expandido com altura flexível para não cortar */}
                                        <div className={`transition-all duration-500 flex flex-col justify-end ${isActive ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute inset-x-0'}`}>
                                            <h3 className="text-xl md:text-2xl font-bold uppercase text-white mb-2 leading-tight">{step.title}</h3>
                                            <p className={`text-xs font-bold ${step.textColor} mb-2 leading-tight uppercase`}>{step.shortDesc}</p>
                                            <p className="text-[11px] md:text-xs text-gray-300 leading-relaxed mb-4 font-light">{step.fullDesc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                                                        <CheckCircle2 size={10} className="text-[#4ADE80]" />{benefit}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`absolute bottom-6 right-6 transition-all duration-500 ${isActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                                        <div className="bg-white/10 p-2 rounded-full border border-white/20 text-[#4ADE80] shadow-xl"><Plus size={18} /></div>
                                    </div>
                                </div>
                            </div>
                        </LinkComponent>
                    )})}
                </div>

                {/* --- MOBILE VIEW --- */}
                <div className="w-full lg:hidden relative">
                    <div ref={scrollContainerRef} onScroll={handleMobileScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-0 px-0 pb-8 pt-2">
                        {steps.map((step, index) => {
                            const LinkComponent = step.external ? 'a' : Link;
                            const linkProps = step.external
                                ? { href: step.link, target: "_blank", rel: "noopener noreferrer" }
                                : { to: step.link };

                            return (
                            <LinkComponent key={index} {...linkProps} className="min-w-[100vw] box-border snap-center p-[2px] bg-gradient-to-b from-[#1B5E20] to-[#007a3d]">
                                <div className="relative rounded-[30px] overflow-hidden flex flex-col h-[400px] bg-[#0a0f16]">
                                    <div className="absolute inset-0 z-0">
                                        {step.img && <img src={step.img} alt={step.title} loading="lazy" decoding="async" className="w-full h-full object-cover brightness-[0.4]" />}
                                        <NoiseOverlay opacity={0.3} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                    </div>
                                    <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-3xl font-black text-[#4ADE80]">{step.id}</span>
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${step.color}`}><step.icon size={22} /></div>
                                            </div>
                                            <h3 className="text-xl font-bold uppercase text-white mb-1">{step.title}</h3>
                                            <p className={`text-xs font-bold ${step.textColor} mb-3`}>{step.shortDesc}</p>
                                            <p className="text-xs text-gray-200 font-light leading-relaxed mb-6">{step.fullDesc}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {step.benefits.map((benefit, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-white uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                                    <CheckCircle2 size={12} className="text-[#4ADE80]" />{benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </LinkComponent>
                        )})}
                    </div>
                    <div className="flex justify-center gap-2">
                        {steps.map((_, index) => (
                            <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${mobileActiveIndex === index ? 'w-8 bg-[#4ADE80]' : 'w-2 bg-white/20'}`}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}
