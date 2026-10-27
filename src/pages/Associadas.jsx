import React, { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { http } from '../utils/http';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import PhotoBand from '../components/ui/PhotoBand';
import EditablePageHero from '../components/EditablePageHero';
import { ArrowRight, ExternalLink } from 'lucide-react';
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
;
  }, []);


  return (
    <div className="sif-page min-h-screen font-sans text-[#1f2937] overflow-x-clip selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      {/* HERO (mesmo topo padrão das outras páginas) */}
      <EditablePageHero pageKey="associadas" defaults={DEFAULTS} scrollTargetId="beneficios" />

      {/* Respiro entre o topo e as faixas de largura total (texto e benefícios) */}
      <div className="pt-16 md:pt-24">
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
      </div>

      {/* GRID DE LOGOS */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="text-center mb-10 md:mb-20">
            <span className="sif-eyebrow mb-4">{cfg.logos_tag}</span>
            <h2 className="sif-title sif-h2 text-[#1f2937]">{cfg.logos_title_line1} <br/><span className="text-[#007a3d]">{cfg.logos_title_highlight}</span></h2>
            <div className="w-16 h-1 bg-[#007a3d] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col min-w-0 border border-white shadow-card hover:border-[#007a3d] hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group"
              >
                {/* Caixa do logo com altura fixa: logos quadrados e largos ocupam o mesmo espaço */}
                <div className="shrink-0 flex items-center justify-center h-16 sm:h-20 md:h-28 mb-3 md:mb-4">
                  {partner.src ? (
                    <img
                      src={partner.src}
                      alt={partner.name}
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-[88%] md:max-w-[80%] w-auto h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                  {/* sem logo (ou logo que não abriu): o nome no lugar */}
                  {partner.src ? (
                    <span className="hidden text-sm font-bold uppercase text-gray-400 text-center">{partner.name}</span>
                  ) : (
                    <span className="text-sm font-bold uppercase text-gray-400 text-center">{partner.name}</span>
                  )}
                </div>
                <div className="mt-auto border-t border-gray-200 pt-3 md:pt-4">
                  <p className="text-[12px] md:text-sm font-bold text-[#1f2937] uppercase tracking-tight leading-tight break-words">{partner.name}</p>
                  {partner.address && (
                    <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-snug">{partner.address}</p>
                  )}
                  {partner.website && (
                    <span className="inline-flex items-center gap-1 text-[11px] md:text-xs font-bold text-[#007a3d] mt-2 group-hover:underline">
                      Visitar site <ExternalLink size={12} />
                    </span>
                  )}
                </div>
              </Card>
              );
            })}
          </div>

          <div className="mt-14 md:mt-24 bg-white shadow-card rounded-card md:rounded-panel p-7 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1f2937] mb-4">{cfg.cta_title}</h3>
              <p className="text-gray-500 text-lg">{cfg.cta_text}</p>
            </div>
            <Button href={cfg.cta_btn_link} variant="primary" icon={ArrowRight} className="shrink-0">
              {cfg.cta_btn_label}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Benefícios. No computador a seção TRAVA a rolagem: à esquerda o título e a
// lista; à direita UM card grande de texto, trocado pelo próximo com
// animação conforme a rolagem. A foto de fundo (desfocada) muda junto com
// o card. Depois do último há uma folga antes de a página voltar a rolar.
// No celular: lista simples.
const BENEFITS_BG = 'https://images.unsplash.com/photo-1509414556967-312906f278a0?q=80&w=1600&auto=format&fit=crop';
// Foto de fundo de cada benefício (por posição), do Unsplash
const BENEFIT_PHOTOS = [
  BENEFITS_BG,
  'https://images.unsplash.com/photo-1758343660101-10ee4fa1ca68?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615671524990-c0e871c5f806?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1627278631921-874a70b5f973?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1624905918163-bd455354cfed?q=80&w=1600&auto=format&fit=crop',
];
const EXIT_SLACK = 0.4;  // pequena pausa no último card antes de a página seguir rolando
const STEP_VH = 80;      // rolagem usada por card (vh)

function BenefitCard({ b }) {
  return (
    <article className="rounded-card bg-[#242b27] border border-white/10 p-7 text-white">
      <h3 className="text-xl font-semibold font-heading leading-tight mb-3">{b.title}</h3>
      <p className="text-white/75 leading-relaxed">{b.description}</p>
    </article>
  );
}

// Card grande de texto (computador)
function BenefitBig({ b, state }) {
  return (
    <article className={`sif-benefit absolute inset-0 rounded-panel bg-[#1f2622]/95 border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] p-10 xl:p-14 flex flex-col justify-center overflow-y-auto no-scrollbar ${state}`}
      aria-hidden={state !== 'is-active'}>
      <div className="sif-benefit__text max-w-2xl">
        <span className="block w-10 h-[3px] rounded-full bg-sif-lime mb-6" aria-hidden="true" />
        <h3 className="text-2xl xl:text-3xl font-semibold font-heading leading-snug mb-4">{b.title}</h3>
        <p className="text-white/80 text-base xl:text-lg leading-relaxed whitespace-pre-line">{b.description}</p>
      </div>
    </article>
  );
}

function BenefitsScroller({ cfg }) {
  const items = (cfg.benefits || []).filter(b => b && (b.title || b.description));
  const n = items.length;
  const wrap = useRef(null);
  const inner = useRef(null);
  const [active, setActive] = useState(0);
  const canPin = () => typeof window !== 'undefined'
    && !!window.matchMedia?.('(min-width: 1024px)').matches
    && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [pinned, setPinned] = useState(canPin);
  // Foto de cada card: a do benefício (se houver), a de fundo escolhida no
  // painel para o 1º, ou uma do Unsplash
  const slides = items.map((b, i) => getImageUrl(b.image || (i === 0 && cfg.beneficios_bg_image) || BENEFIT_PHOTOS[i % BENEFIT_PHOTOS.length], 1280));

  useEffect(() => {
    const mq = window.matchMedia?.('(min-width: 1024px)');
    if (!mq) return;
    const upd = () => setPinned(canPin());
    mq.addEventListener?.('change', upd);
    return () => mq.removeEventListener?.('change', upd);
  }, []);

  // Rolagem → qual card está na frente
  useEffect(() => {
    if (!pinned || n < 1) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / dist));
      const u = p * ((n - 1) + EXIT_SLACK);
      setActive(Math.min(n - 1, Math.floor(u + 0.15)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pinned, n]);

  if (!n) return null;

  const go = (i) => {
    const el = wrap.current;
    if (!el) return;
    const dist = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.pageYOffset + dist * ((i + 0.1) / ((n - 1) + EXIT_SLACK));
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const title = (
    <div>
      <span className="sif-eyebrow !text-sif-lime mb-5">Benefícios</span>
      <h2 className="sif-title sif-h2 text-white leading-tight">
        {cfg.beneficios_title_line1} <br/>
        <span className="text-sif-lime">{cfg.beneficios_title_highlight}</span>
      </h2>
    </div>
  );

  // Celular ou "menos movimento": lista simples sobre a foto
  if (!pinned) {
    return (
      <PhotoBand id="beneficios" photo={slides[0]} className="scroll-mt-32 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10">{title}</div>
          <div className="space-y-4">
            {items.map((b, i) => <BenefitCard key={i} b={b} />)}
          </div>
        </div>
      </PhotoBand>
    );
  }

  return (
    <section id="beneficios" ref={wrap} className="relative"
      style={{ height: `calc(100vh + ${((n - 1) + EXIT_SLACK) * STEP_VH}vh)` }}>
      <PhotoBand as="div" slides={slides} active={active} className="sticky top-0 h-screen flex items-center">
        <div ref={inner} className="container mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-12 gap-12 xl:gap-16 items-center w-full">
          <div className="col-span-5">
            {title}
            <ol className="mt-10 space-y-1" data-no-reveal>
              {items.map((b, i) => (
                <li key={i}>
                  <button type="button" onClick={() => go(i)}
                    className={`w-full flex items-center gap-4 py-2.5 text-left transition-colors duration-300 ${active === i ? 'text-white' : 'text-white/45 hover:text-white/80'}`}>
                    <span className={`h-px shrink-0 transition-all duration-500 ${active === i ? 'w-12 bg-sif-lime' : 'w-6 bg-white/25'}`} />
                    <span className="text-sm font-semibold">{b.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-7 relative h-[min(400px,54vh)]" data-no-reveal>
            {items.map((b, i) => (
              <BenefitBig key={i} b={b}
                state={i === active ? 'is-active' : i < active ? 'is-past' : 'is-next'} />
            ))}
          </div>
        </div>
      </PhotoBand>
    </section>
  );
}
