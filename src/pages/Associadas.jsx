import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

// --- LOGOS DE FALLBACK (caso a API esteja offline) ---
import logoAgropalma from '../assets/logos/Agropalma-Logo.png';
import logoAperam from '../assets/logos/APERAM-LOGO-200x113.png';
import logoArauco from '../assets/logos/ARAUCO-LOGO-200x37.png';
import logoArborGen from '../assets/logos/ArborGen-2021-Logo-with-Tagline-SMALL-200x145.png';
import logoArcelor from '../assets/logos/ARCELORMITTAL-LOGO-200x113.png';
import logoBracell from '../assets/logos/bracell-logo-200x45.png';
import logoBunge from '../assets/logos/Bunge-Logo-200x46.png';
import logoCenibra from '../assets/logos/CENIBRA-LOGO-200x198.png';
import logoCmpc from '../assets/logos/Logo-CMPC-1024x496.png';
import logoConcrem from '../assets/logos/CONCREM.png';
import logoDeforsa from '../assets/logos/DEFORSA-LOGO-200x228.png';
import logoDexco from '../assets/logos/logo-dexco.jpg';
import logoGerdau from '../assets/logos/GERDAU-LOGO-HORIZONTAL-200x113.png';
import logoGrupoIndex from '../assets/logos/GRUPO-INDEX-LOGO-200x78.png';
import logoAssociadaUnknown from '../assets/logos/associadas-13-1-e1568898614510.jpg';
import logoLdCelulose from '../assets/logos/LD-CELULOSE-1.png';
import logoGrupoMaringa from '../assets/logos/GRUPO-MARINGA-LOGO-200x112.png';
import logoMetalSider from '../assets/logos/Metal-Sider-Logo-200x113.png';
import logoMontesDelPlata from '../assets/logos/Logo-Montes-del-Plata-200x100.png';
import logoPanBioenergia from '../assets/logos/PAN-BIOENERGIA.png';
import logoParacel from '../assets/logos/PARACEL-LOGO-200x47.png';
import logoPlacasDoBrasil from '../assets/logos/Placas-Do-Brasil-LOGO-200x67.png';
import logoSinobras from '../assets/logos/SINOBRAS-LOGO-200x71.png';
import logoSmurfit from '../assets/logos/SMURFIT-WESTROCK-1.png';
import logoSuzano from '../assets/logos/SUZANO-HORIZONTAL-LOGO-200x53.png';
import logoForestCompany from '../assets/logos/THE-FOREST-COMPANY.png';
import logoVallourec from '../assets/logos/VALLOUREC-LOGO-200x47.png';
import logoVeracel from '../assets/logos/VERACEL-LOGO-200x73.png';
import logoVetorial from '../assets/logos/Vetorial-Logo-200x113.png';

const fallbackPartners = [
  { name: 'Suzano', src: logoSuzano }, { name: 'Gerdau', src: logoGerdau },
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
  hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
  hero_badge: 'Parceria Estratégica',
  hero_title_line1: 'Empresas',
  hero_title_highlight: 'Associadas',
  hero_subtitle: 'O elo que une a ciência acadêmica às maiores potências da indústria florestal global.',

  beneficios_title_line1: 'Por que ser uma',
  beneficios_title_highlight: 'Associada SIF?',
  benefits: [
    { title: 'Projetos Cooperativos',  description: 'Participação em pesquisas de alto impacto com custos compartilhados entre grandes players do setor.' },
    { title: 'Tecnologia de Ponta',    description: 'Acesso direto aos laboratórios da UFV e suporte de pesquisadores nível internacional.' },
    { title: 'Networking Estratégico', description: 'Conexão direta com as maiores empresas de base florestal do mundo em fóruns exclusivos.' },
    { title: 'Segurança e Ética',      description: 'Governança robusta e transparência total na gestão de recursos e propriedade intelectual.' },
  ],

  logos_tag: 'Nossa Rede',
  logos_title_line1: 'Gigantes que',
  logos_title_highlight: 'Confiam na SIF',

  cta_title: 'Sua empresa quer fazer parte desta história?',
  cta_text: 'Junte-se ao maior cluster de inovação florestal da América Latina e transforme seus resultados através da ciência.',
  cta_btn_label: 'Seja uma Associada',
  cta_btn_link: '/contato',
};

export default function Associadas() {
  const [partners, setPartners] = useState(fallbackPartners);
  const [cfg, setCfg] = useState(DEFAULTS);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/associadas.php?active_only=1`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPartners(res.data.map(a => ({
            name: a.name,
            src: a.logo_url ? getImageUrl(a.logo_url) : null,
          })));
        }
      })
      .catch(() => { /* mantém fallback */ });

    axios.get(`${API_BASE_URL}/page_content.php?page=associadas`)
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
      .catch(() => { /* mantém DEFAULTS */ });
  }, []);

  const heroBgUrl = cfg.hero_image && !cfg.hero_image.startsWith('http') ? getImageUrl(cfg.hero_image) : cfg.hero_image;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      {/* HERO */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroBgUrl}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">{cfg.hero_badge}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
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
              className="group flex flex-col items-start gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#007a3d]"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] group-hover:text-white transition-all shadow-sm">
                  <ChevronDown className="animate-bounce" size={20} />
              </div>
          </button>
        </div>
      </div>

      {/* BENEFÍCIOS — só texto, sem ícones */}
      <div id="beneficios" className="py-24 bg-[#1f2937] text-white relative overflow-hidden scroll-mt-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007a3d] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase mb-6">
              {cfg.beneficios_title_line1} <br/>
              <span className="text-[#007a3d]">{cfg.beneficios_title_highlight}</span>
            </h2>
            <div className="w-20 h-1 bg-[#007a3d] mx-auto mt-6"></div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${cfg.benefits.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
            {(cfg.benefits || []).map((benefit, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[40px] hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-bold uppercase font-heading mb-4 text-emerald-400">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE LOGOS */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20">
            <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">{cfg.logos_tag}</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937]">{cfg.logos_title_line1} <br/><span className="text-[#007a3d]">{cfg.logos_title_highlight}</span></h2>
            <div className="w-16 h-1 bg-[#007a3d] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-[#f8f9fa] rounded-3xl p-6 flex items-center justify-center aspect-square border border-gray-100 hover:border-[#007a3d] hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group cursor-pointer"
                title={partner.name}
              >
                {partner.src ? (
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-h-[70%] max-w-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-xs font-bold uppercase text-gray-500 text-center px-2">{partner.name}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-24 bg-[#f8f9fa] rounded-[50px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-gray-100 italic">
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
