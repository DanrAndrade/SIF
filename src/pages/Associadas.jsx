import React, { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { http } from '../utils/http';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';
import { API_BASE_URL, getImageUrl, toExternalUrl, cleanRichHtml } from '../apiConfig';

// --- LOGOS DE FALLBACK (caso a API esteja offline) ---
import logoAgropalma from '../assets/logos/Agropalma-Logo.webp';
import logoAperam from '../assets/logos/APERAM-LOGO-200x113.webp';
import logoArauco from '../assets/logos/ARAUCO-LOGO-200x37.webp';
import logoArborGen from '../assets/logos/ArborGen-2021-Logo-with-Tagline-SMALL-200x145.webp';
import logoArcelor from '../assets/logos/ARCELORMITTAL-LOGO-200x113.webp';
import logoBracell from '../assets/logos/bracell-logo-200x45.webp';
import logoBunge from '../assets/logos/Bunge-Logo-200x46.webp';
import logoCenibra from '../assets/logos/CENIBRA-LOGO-200x198.webp';
import logoCmpc from '../assets/logos/Logo-CMPC-1024x496.webp';
import logoConcrem from '../assets/logos/CONCREM.webp';
import logoDeforsa from '../assets/logos/DEFORSA-LOGO-200x228.webp';
import logoDexco from '../assets/logos/logo-dexco.webp';
import logoGerdau from '../assets/logos/GERDAU-LOGO-HORIZONTAL-200x113.webp';
import logoGrupoIndex from '../assets/logos/GRUPO-INDEX-LOGO-200x78.webp';
import logoAssociadaUnknown from '../assets/logos/associadas-13-1-e1568898614510.webp';
import logoLdCelulose from '../assets/logos/LD-CELULOSE-1.webp';
import logoGrupoMaringa from '../assets/logos/GRUPO-MARINGA-LOGO-200x112.webp';
import logoMetalSider from '../assets/logos/Metal-Sider-Logo-200x113.webp';
import logoMontesDelPlata from '../assets/logos/Logo-Montes-del-Plata-200x100.webp';
import logoPanBioenergia from '../assets/logos/PAN-BIOENERGIA.webp';
import logoParacel from '../assets/logos/PARACEL-LOGO-200x47.webp';
import logoPlacasDoBrasil from '../assets/logos/Placas-Do-Brasil-LOGO-200x67.webp';
import logoSinobras from '../assets/logos/SINOBRAS-LOGO-200x71.webp';
import logoSmurfit from '../assets/logos/SMURFIT-WESTROCK-1.webp';
import logoSuzano from '../assets/logos/SUZANO-HORIZONTAL-LOGO-200x53.webp';
import logoForestCompany from '../assets/logos/THE-FOREST-COMPANY.webp';
import logoVallourec from '../assets/logos/VALLOUREC-LOGO-200x47.webp';
import logoVeracel from '../assets/logos/VERACEL-LOGO-200x73.webp';
import logoVetorial from '../assets/logos/Vetorial-Logo-200x113.webp';

const fallbackPartners = [
  { name: 'Suzano', src: logoSuzano }, { name: 'Klabin', src: null },
  { name: 'Gerdau', src: logoGerdau },
  { name: 'ArcelorMittal', src: logoArcelor }, { name: 'Cenibra', src: logoCenibra },
  { name: 'Veracel', src: logoVeracel }, { name: 'Aperam', src: logoAperam },
  { name: 'Bracell', src: logoBracell }, { name: 'Vallourec', src: logoVallourec },
  { name: 'Arauco', src: logoArauco }, { name: 'CMPC', src: logoCmpc },
  { name: 'Smurfit Westrock', src: logoSmurfit }, { name: 'Dexco', src: logoDexco },
  { name: 'LD Celulose', src: logoLdCelulose }, { name: 'Agropalma', src: logoAgropalma },
  { name: 'Bunge', src: logoBunge }, { name: 'ArborGen', src: logoArborGen },
  { name: 'Placas do Brasil', src: logoPlacasDoBrasil }, { name: 'Paracel', src: logoParacel },
  { name: 'Montes del Plata', src: logoMontesDelPlata }, { name: 'Sinobras', src: logoSinobras },
  { name: 'Vetorial', src: logoVetorial }, { name: 'Metal Sider', src: logoMetalSider },
  { name: 'Grupo Maringá', src: logoGrupoMaringa }, { name: 'Grupo Index', src: logoGrupoIndex },
  { name: 'Deforsa', src: logoDeforsa }, { name: 'Concrem', src: logoConcrem },
  { name: 'The Forest Company', src: logoForestCompany }, { name: 'Pan Bioenergia', src: logoPanBioenergia },
  { name: 'Outros', src: logoAssociadaUnknown },
];

// Conteúdo padrão (espelho do que está hoje na página) — fallback se admin não editou.
const DEFAULTS = {
  hero_image: '',
  hero_badge: 'Parceria Estratégica',
  hero_title_line1: 'Empresas',
  hero_title_highlight: 'Associadas',
  hero_subtitle: 'O elo que une a ciência acadêmica às maiores potências da indústria florestal global.',
  hero_scroll_label: 'Ver Benefícios',
  texto_enabled: true,
  texto_tag: 'Sobre a rede',
  texto_title: '',
  texto_html: '',

  beneficios_title_line1: 'Por que ser uma',
  beneficios_title_highlight: 'Associada SIF?',
  benefits: [
    { title: 'Projetos Cooperativos',  description: 'Participação em pesquisas de alto impacto com custos compartilhados entre grandes players do setor.' },
    { title: 'Tecnologia de Ponta',    description: 'Acesso direto aos laboratórios da UFV e suporte de pesquisadores nível internacional.' },
    { title: 'Networking Estratégico', description: 'Conexão direta com as maiores empresas de base florestal do mundo em fóruns exclusivos.' },
    { title: 'Segurança e Ética',      description: 'Governança robusta e transparência total na gestão de recursos e propriedade intelectual.' },
  ],

  logos_tag: 'Nossa Rede',
  logos_title_line1: 'Empresas que',
  logos_title_highlight: 'Confiam na SIF',

  cta_title: 'Sua empresa quer fazer parte desta história?',
  cta_text: 'Junte-se ao maior cluster de inovação florestal da América Latina e transforme seus resultados através da ciência.',
  cta_btn_label: 'Seja uma Associada',
  cta_btn_link: '/contato',
};

// Texto do editor sem conteúdo real (ex.: "<p><br></p>") conta como vazio
const hasText = (html) => !!html && (/<img|<iframe/i.test(html) || html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() !== '');

export default function Associadas() {
  usePageTitle('Empresas Associadas'); // título da aba do navegador / Google
  const [partners, setPartners] = useState(fallbackPartners);
  const [cfg, setCfg] = useState(DEFAULTS);
  // Hero só renderiza conteúdo/imagem após o banco responder (evita flash de exemplo)
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    http.get(`${API_BASE_URL}/associadas.php?active_only=1`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPartners(res.data.map(a => ({
            name: a.name,
            address: a.address || '',
            website: toExternalUrl(a.website),
            src: a.logo_url ? getImageUrl(a.logo_url, 320) : null,
          })));
        }
      })
      .catch(() => { /* mantém fallback */ });

    http.get(`${API_BASE_URL}/page_content.php?page=associadas`)
      .then((res) => {
        const data = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
        if (Object.keys(data).length > 0) {
          setCfg(prev => ({
            ...prev,
            ...data,
            benefits: Array.isArray(data.benefits) && data.benefits.length > 0 ? data.benefits : prev.benefits,
          }));
        }
      })
      .catch(() => { /* mantém DEFAULTS */ })
      .finally(() => setHeroReady(true));
  }, []);

  const heroBgUrl = cfg.hero_image && !cfg.hero_image.startsWith('http') ? getImageUrl(cfg.hero_image, 1920) : cfg.hero_image;

  return (
    <div className="sif-page min-h-screen font-sans text-[#1f2937] overflow-x-clip selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      {/* HERO */}
      <div className="relative min-h-[85vh] flex items-center pt-28 md:pt-32 pb-40 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-500" style={{ backgroundImage: heroReady && heroBgUrl ? `url('${heroBgUrl}')` : 'none' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f6f8f7] rounded-tr-[80px] z-10"></div>
        <div className={`container mx-auto px-6 md:px-12 relative z-10 transition-opacity duration-500 ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">{cfg.hero_badge}</span>
          </div>

          <h1 className="sif-title text-5xl md:text-8xl text-white leading-[0.9] tracking-tighter mb-8">
              {cfg.hero_title_line1} <br/>
              <span className="text-[#007a3d]">{cfg.hero_title_highlight}</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              {cfg.hero_subtitle}
          </p>

          <button
              onClick={() => {
                  const section = document.getElementById('beneficios');
                  if (section) {
                      const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
                      window.scrollTo({top: y, behavior: 'smooth'});
                  }
              }}
              className="group flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#007a3d]"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] group-hover:text-white transition-all shadow-sm">
                  <ChevronDown className="animate-bounce" size={20} />
              </div>
              {cfg.hero_scroll_label || ''}
          </button>
        </div>
      </div>

      {/* TEXTO CORRIDO — editável em Painel › Associadas › Texto */}
      {cfg.texto_enabled !== false && hasText(cfg.texto_html) && (
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-5xl">
            {cfg.texto_tag && <span className="sif-eyebrow mb-4">{cfg.texto_tag}</span>}
            {cfg.texto_title && <h2 className="sif-title sif-h2 text-[#1f2937] mb-8 leading-tight">{cfg.texto_title}</h2>}
            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d] prose-img:rounded-3xl"
              dangerouslySetInnerHTML={{ __html: cleanRichHtml(cfg.texto_html) }} />
          </div>
        </section>
      )}

      {/* BENEFÍCIOS: título fixo à esquerda + cards que passam com a rolagem */}
      <BenefitsScroller cfg={cfg} />

      {/* GRID DE LOGOS */}
      <div className="py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20">
            <span className="sif-eyebrow mb-4">{cfg.logos_tag}</span>
            <h2 className="sif-title sif-h2 text-[#1f2937]">{cfg.logos_title_line1} <br/><span className="text-[#007a3d]">{cfg.logos_title_highlight}</span></h2>
            <div className="w-16 h-1 bg-[#007a3d] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => {
              // Com site cadastrado, o card inteiro vira link (abre em nova aba)
              const Card = partner.website ? 'a' : 'div';
              const linkProps = partner.website
                ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer', title: `Visitar o site de ${partner.name}` }
                : {};
              return (
              <Card
                key={index}
                {...linkProps}
                className="bg-white rounded-3xl p-6 flex flex-col border border-white shadow-card hover:border-[#007a3d] hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group"
              >
                <div className="flex-1 flex items-center justify-center h-32 mb-4">
                  {partner.src ? (
                    <img
                      src={partner.src}
                      alt={partner.name}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-sm font-bold uppercase text-gray-400 text-center">{partner.name}</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-bold text-[#1f2937] uppercase tracking-tight leading-tight">{partner.name}</p>
                  {partner.address && (
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{partner.address}</p>
                  )}
                  {partner.website && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#007a3d] mt-2 group-hover:underline">
                      Visitar site <ExternalLink size={12} />
                    </span>
                  )}
                </div>
              </Card>
              );
            })}
          </div>

          <div className="mt-24 bg-white shadow-card rounded-panel p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1f2937] mb-4">{cfg.cta_title}</h3>
              <p className="text-gray-500 text-lg">{cfg.cta_text}</p>
            </div>
            <Button href={cfg.cta_btn_link} variant="primary" icon={ArrowRight} className="bg-[#007a3d] hover:bg-[#047857]">
              {cfg.cta_btn_label}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Benefícios: à esquerda o título fica parado e a lista acende o benefício
// da vez; à direita os cards sobem e se empilham conforme a rolagem.
function BenefitsScroller({ cfg }) {
  const items = (cfg.benefits || []).filter(b => b && (b.title || b.description));
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    refs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  if (!items.length) return null;
  const go = (i) => {
    const el = refs.current[i];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 140, behavior: 'smooth' });
  };

  return (
    <section id="beneficios" className="scroll-mt-32 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <span className="sif-eyebrow mb-5">Benefícios</span>
            <h2 className="sif-title sif-h2 text-[#1f2937] leading-tight">
              {cfg.beneficios_title_line1} <br/>
              <span className="text-[#007a3d]">{cfg.beneficios_title_highlight}</span>
            </h2>
            <ol className="mt-10 hidden lg:block space-y-1" data-no-reveal>
              {items.map((b, i) => (
                <li key={i}>
                  <button type="button" onClick={() => go(i)}
                    className={`w-full flex items-center gap-4 py-2.5 text-left transition-colors duration-300 ${active === i ? 'text-[#0b3320]' : 'text-gray-400 hover:text-gray-600'}`}>
                    <span className={`text-xs font-bold tabular-nums ${active === i ? 'text-[#007a3d]' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={`h-px transition-all duration-500 ${active === i ? 'w-12 bg-[#007a3d]' : 'w-6 bg-gray-300'}`} />
                    <span className="text-sm font-semibold">{b.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {items.map((b, i) => (
            <article key={i} ref={el => (refs.current[i] = el)} data-i={i}
              className="sticky rounded-card bg-gradient-to-br from-[#0f4a2b] to-[#0b3320] p-7 md:p-10 shadow-[0_24px_50px_-24px_rgba(11,51,32,0.7)] text-white"
              style={{ top: `calc(7rem + ${i * 0.9}rem)` }}>
              <div className="flex items-start gap-5 md:gap-7">
                <span className="text-4xl md:text-5xl font-semibold leading-none text-sif-lime/90 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold font-heading leading-tight mb-3">{b.title}</h3>
                  <p className="text-white/75 leading-relaxed">{b.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
