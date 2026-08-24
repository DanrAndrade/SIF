import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Leaf, Sprout, Microscope, Globe, Users, Download, FileText, FileBadge, Scale, X as CloseIcon, ChevronDown, Check, Map, Settings, Shield, ArrowLeft, Mail, Phone } from 'lucide-react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import iconLogo from '../assets/icone.svg';
import Button from '../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

// Conteúdo padrão (textos atuais hardcoded da página) — usado como fallback
// quando o admin ainda não preencheu nada.
const DEFAULTS = {
  hero_image: '',
  hero_badge: 'A SIF & Sua História',
  hero_title_line1: 'Nossa',
  hero_title_highlight: 'História',
  hero_subtitle: 'Mais do que uma entidade, somos o catalisador da inovação florestal no Brasil e no mundo.',

  quem_somos_image: '',
  quem_somos_title_line1: 'Nossa',
  quem_somos_title_highlight: 'História',
  quem_somos_text1: 'A Sociedade de Investigações Florestais (SIF) nasceu em 1974 da percepção estratégica de que o futuro do setor florestal brasileiro dependia de uma conexão indissociável entre a academia e a indústria. Naquele período, o crescimento da silvicultura exigia respostas que apenas a pesquisa científica aplicada poderia fornecer. Através de uma parceria pioneira com a Universidade Federal de Viçosa (UFV), a SIF foi estabelecida para ser o braço executor dessa transformação, convertendo o capital intelectual universitário em produtividade e sustentabilidade para as empresas.',
  quem_somos_text2: 'Ao longo de cinco décadas, a SIF deixou de ser apenas uma ponte de apoio para se tornar uma Instituição Científica, Tecnológica e de Inovação (ICT) essencial ao país. O modelo de cooperação público-privada desenvolvido em Viçosa permitiu a modernização de laboratórios, a formação de gerações de especialistas e a condução de projetos que posicionaram o Brasil como líder global em tecnologia florestal. Hoje, ao ultrapassar o marco de 50 anos, a instituição reafirma seu papel na vanguarda da bioeconomia, liderando frentes de inovação que vão do manejo clássico aos modernos ativos de crédito de carbono.',
  quem_somos_image_caption_top: 'Campus UFV',
  quem_somos_image_caption_main: 'Onde a Ciência Acontece',

  team_tag: 'Conheça',
  team_title: 'Nossa Gente',
  team_subtitle: 'As mentes que construíram cinco décadas de inovação e excelência florestal.',

  areas_tag: 'Fronteira Tecnológica',
  areas_title_line1: 'Nossas Áreas',
  areas_title_highlight: 'de Atuação',
  areas_subtitle: 'Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal de ponta.',

  estatuto_tag: 'Governança',
  estatuto_title_line1: 'Documentação',
  estatuto_title_highlight: '& Transparência',
  estatuto_subtitle: 'A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.',
  estatuto_blocks: [
    {
      icon: 'Scale',
      title: 'Estatuto Social',
      subtitle: 'O alicerce da nossa Governança',
      paragraphs: [
        'O Estatuto Social é o documento magno que estabelece a finalidade, a estrutura e as normas de funcionamento da SIF. Ele é a nossa constituição, definindo nossa identidade, propósito, estrutura de poder e os direitos e deveres dos nossos membros.',
        'O Estatuto é o alicerce que confere legitimidade e orienta as decisões estratégicas mais importantes da nossa organização.',
      ],
      pdfs: [
        { label: 'Estatuto Social SIF', url: '/docs/estatutosif.pdf', icon: 'Scale' },
      ],
    },
    {
      icon: 'FileText',
      title: 'Regulamentos Internos',
      subtitle: '',
      paragraphs: [
        'Os regulamentos que normatizam as políticas e os procedimentos internos da SIF são os desdobramentos práticos do nosso estatuto, detalhando as operações do dia a dia e garantindo que todas as atividades sejam conduzidas de forma justa, padronizada e eficiente.',
        'Sua função é oferecer clareza e segurança para todos os envolvidos, minimizando conflitos e assegurando a ordem operacional.',
      ],
      pdfs: [
        { label: 'Código de Conduta e Ética',                          url: '/docs/Codigo-de-Conduta-e-Etica-SIF-2022.pdf',                  icon: 'FileBadge' },
        { label: 'Declaração Anticorrupção e Antifraude',              url: '/docs/Dec_Anticorrup_Antifraude_SIF.pdf',                       icon: 'Shield' },
        { label: 'Regulamento de Bolsa 2024',                          url: '/docs/REGULAMENTO-DE-BOLSA-2024-1.pdf',                         icon: 'FileText' },
        { label: 'Regulamento de Aquisições e Contratações 2024',      url: '/docs/REGULAMENTO-PARA-AQUISICOES-E-CONTRATACOES-2024-1.pdf',   icon: 'FileText' },
      ],
    },
  ],
  estatuto_footer_title_line1: 'A importância do Estatuto',
  estatuto_footer_title_highlight: 'e das Normas',
  estatuto_footer_p1: 'O Estatuto Social e as normas internas são os pilares que garantem a governança, a transparência e a segurança jurídica de uma organização como a SIF.',
  estatuto_footer_p2: 'O Estatuto funciona como a constituição da entidade. É o seu documento de fundação, que define sua identidade, propósito, estrutura de poder e os direitos e deveres dos seus membros. Ele é o alicerce que confere legitimidade e orienta as decisões estratégicas mais importantes.',
  estatuto_footer_p3: 'As normas, como regulamentos e regimentos, são o desdobramento prático do estatuto. Elas detalham os procedimentos do dia a dia, garantindo que as atividades sejam conduzidas de forma justa, padronizada e eficiente.',
  estatuto_footer_quote: 'Em conjunto, o estatuto estabelece "o que" a organização é, enquanto as normas definem "como" ela deve operar para cumprir sua missão com integridade e organização.',

  historia_tag: 'Nossa Jornada',
  historia_title_line1: 'Cinco',
  historia_title_highlight: 'Décadas',
  historia_title_line2: 'de Ciência',

  cta_title_line1: 'O Amanhã é',
  cta_title_highlight: 'Científico',
  cta_btn1_label: 'Seja uma Associada',
  cta_btn1_link: '/contato',
  cta_btn2_label: 'Trabalhe Conosco',
  cta_btn2_link: '/trabalhe-conosco',
};

const DEFAULT_AREAS = [
  { title: 'Silvicultura de Precisão', icon: 'Sprout',   desc: 'Desenvolvimento de protocolos avançados de biotecnologia, produção de sementes certificadas e mudas de alta performance. Atuamos na fronteira da nutrição florestal e técnicas silviculturais automatizadas para maximizar o ganho genético no campo.' },
  { title: 'Manejo & Inteligência',    icon: 'Map',      desc: 'Soluções integradas em inventário florestal contínuo, planejamento estratégico de colheita e economia de recursos. Utilizamos sensoriamento remoto e GIS de alta resolução para modelagem preditiva e tomada de decisão baseada em dados.' },
  { title: 'Ambiência & Clima',        icon: 'Leaf',     desc: 'Pesquisas focadas na conservação da biodiversidade, monitoramento hidrológico e recuperação de ecossistemas degradados. Lideramos projetos de regulação hídrica e estratégias de adaptação às mudanças climáticas para o setor florestal.' },
  { title: 'Proteção & Sanidade',      icon: 'Shield',   desc: 'Monitoramento ativo e controle biológico de pragas e doenças florestais. Desenvolvemos sistemas inteligentes de prevenção contra incêndios e protocolos de defesa fitossanitária que garantem a segurança do patrimônio biológico das empresas.' },
  { title: 'Tecnologia de Produtos',   icon: 'Settings', desc: 'Fomento à inovação em processos industriais para energia, celulose, papel e multiprodutos da madeira. Investigamos a anatomia e as propriedades físico-químicas das fibras para o desenvolvimento de bioprodutos de alto valor agregado.' },
];

const AREA_ICON_MAP = { Sprout, Map, Leaf, Shield, Settings, Microscope, Globe, Users, Scale, FileBadge, FileText };

// --- EQUIPE ---
// As fotos da equipe vêm 100% do banco (admin de Institucional → aba Equipe),
// passando pelo helper getImageUrl no fetch. Ordem de exibição dos grupos:
const TEAM_GROUP_ORDER = [
  'Diretoria',
  'Coordenadoras',
  'Coord. Fundação SIF & EMBRAPII',
  'Coord. Inovação e Projetos',
  'Coord. de CSC',
  'Coord. de Produtos e Serviços',
  'Coord. de RH & Facilities',
  'Consultores',
];

// --- COMPONENTE TIMELINE ITEM ---
const HistoryItem = ({ year, title, children, imgSrc, layout = "image-left" }) => {
    const isRight = layout === "image-right";
    return (
        <div className="relative mb-32 md:mb-64 last:mb-0 group/item">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                {/* Texto */}
                <div className={`space-y-6 ${isRight ? 'order-2 md:order-1 text-right' : 'order-2 md:order-2'}`}>
                     <div className="flex items-center gap-4 group-hover/item:pl-2 transition-all">
                        {!isRight && <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300 group-hover/item:bg-[#007a3d] transition-colors"></div>}
                        <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937]">
                            <span dangerouslySetInnerHTML={{ __html: title }} />
                        </h2>
                        {isRight && <div className="timeline-marker w-4 h-4 rounded-full bg-gray-300 group-hover/item:bg-[#007a3d] transition-colors"></div>}
                     </div>
                     <div className={`w-20 h-1.5 bg-[#007a3d] ${isRight ? 'ml-auto' : ''}`}></div>
                     <p className="text-gray-500 text-base font-medium leading-relaxed">
                        {children}
                     </p>
                </div>
                {/* Imagem */}
                <div className={`relative ${isRight ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}>
                    <div className="absolute inset-0 bg-emerald-50 rounded-[40px] translate-x-4 translate-y-4 -z-10 group-hover/item:translate-x-6 group-hover/item:translate-y-6 transition-transform"></div>
                    <div className="rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3] relative bg-gradient-to-br from-[#0f1f11] to-[#007a3d]">
                        {imgSrc && <img src={imgSrc} alt={year} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110" />}
                        <div className="absolute inset-0 bg-[#1f2937]/20"></div>
                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-2xl font-black text-2xl text-[#1f2937] shadow-xl">{year}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE CARROSSEL DE GALERIA (dinâmico) ---
const GalleryCarousel = ({ title, data }) => {
    const scrollRef = useRef(null);
    // true = precisa de carrossel | false = cabe tudo, centralizado
    const [needsScroll, setNeedsScroll] = useState(true);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const check = () => {
            // +2 para evitar falso positivo por sub-pixel
            setNeedsScroll(el.scrollWidth > el.clientWidth + 2);
        };

        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [data]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            // Rola por 3 cards por vez
            const cardWidth = scrollRef.current.firstChild?.offsetWidth || 160;
            const gap = 24;
            const amount = (cardWidth + gap) * 3;
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft + (direction === 'left' ? -amount : amount),
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="mb-20 last:mb-0">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-[#1f2937] border-l-4 border-[#007a3d] pl-4">
                    {title}
                </h3>
                {/* Botões de navegação: só aparecem quando o carrossel é necessário */}
                {needsScroll && (
                    <div className="flex gap-3 shrink-0 ml-4">
                        <button
                            onClick={() => scroll('left')}
                            aria-label="Anterior"
                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1f2937] hover:bg-[#007a3d] hover:border-[#007a3d] hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            aria-label="Próximo"
                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1f2937] hover:bg-[#007a3d] hover:border-[#007a3d] hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>

            {/* Track: quando não precisa de carrossel → centralizado; quando precisa → scroll horizontal */}
            <div
                ref={scrollRef}
                className={`flex gap-5 sm:gap-6 md:gap-8 snap-x snap-mandatory ${
                    needsScroll
                        ? 'overflow-x-auto no-scrollbar'
                        : 'flex-wrap justify-start overflow-x-visible'
                }`}
            >
                {data.map((member) => (
                    <div
                        key={member.id}
                        className="w-[130px] sm:w-[155px] md:w-[180px] shrink-0 snap-start group text-center"
                    >
                        {/* Foto circular */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-3 ring-4 ring-transparent group-hover:ring-[#007a3d] transition-all duration-500 bg-gray-100">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                        {/* Cargo */}
                        {member.role && (
                            <span className="text-[#007a3d] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] mb-1 block leading-snug">
                                {member.role}
                            </span>
                        )}
                        {/* Nome */}
                        <h4 className="font-bold text-[#1f2937] text-xs sm:text-sm uppercase tracking-tight leading-tight">
                            {member.name}
                        </h4>
                        {/* Contatos por extenso (só aparece quando preenchido no admin) */}
                        {(member.link_email || member.link_whatsapp) && (
                            <div className="mt-2 space-y-0.5">
                                {member.link_email && (
                                    <a
                                        href={`mailto:${member.link_email}`}
                                        className="block text-[10px] sm:text-[11px] text-gray-500 hover:text-[#007a3d] break-all leading-tight"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {member.link_email}
                                    </a>
                                )}
                                {member.link_whatsapp && (
                                    <a
                                        href={`https://wa.me/55${member.link_whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-[10px] sm:text-[11px] text-gray-500 hover:text-[#007a3d] leading-tight"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {member.link_whatsapp}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Institucional() {
  const mainRef = useRef(null);
  const areasScrollRef = useRef(null);
  const location = useLocation();

  // Equipe vinda do banco (admin de Institucional → aba Equipe).
  // Se a API responder vazio ou falhar, cai nos arrays estáticos como fallback.
  const [teamFromApi, setTeamFromApi] = useState(null);

  // Config geral (textos/imagens da página)
  const [cfg, setCfg] = useState(DEFAULTS);
  // Áreas de atuação (vem do config_json como array)
  const [areas, setAreas] = useState(DEFAULT_AREAS);
  // Linha do tempo (do banco — tabela timeline_items)
  const [timeline, setTimeline] = useState(null);
  // Hero só renderiza conteúdo/imagem após o banco responder (evita flash de exemplo)
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    // Config geral + áreas
    axios.get(`${API_BASE_URL}/institucional.php?resource=config`).then(res => {
      const data = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
      setCfg(prev => ({ ...prev, ...data }));
      if (Array.isArray(data.areas) && data.areas.length > 0) setAreas(data.areas);
    }).catch(() => {}).finally(() => setHeroReady(true));

    // Linha do tempo (tabela própria)
    axios.get(`${API_BASE_URL}/institucional.php?resource=timeline`).then(res => {
      const list = Array.isArray(res.data) ? res.data : [];
      const active = list.filter(t => t.active == 1 || t.active === undefined);
      if (active.length > 0) setTimeline(active);
    }).catch(() => {});

    axios.get(`${API_BASE_URL}/institucional.php?resource=team`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length === 0) return;
        // Filtra inativos e remapeia para o shape esperado pelo GalleryCarousel
        const active = list.filter(m => m.active == 1 || m.active === undefined);
        const byGroup = {};
        for (const m of active) {
          (byGroup[m.group_name] = byGroup[m.group_name] || []).push({
            id: m.id,
            name: m.name,
            role: m.role,
            image: m.photo_url ? getImageUrl(m.photo_url) : null,
            link_email: m.link_email,
            link_whatsapp: m.link_whatsapp,
          });
        }
        setTeamFromApi(byGroup);
      })
      .catch(() => setTeamFromApi(null));
  }, []);

  // Grupos da equipe a renderizar: somente o que veio do banco (já com getImageUrl),
  // ordenados por TEAM_GROUP_ORDER; grupos fora da lista vão para o fim.
  const teamGroups = teamFromApi
    ? Object.keys(teamFromApi)
        .filter((g) => teamFromApi[g] && teamFromApi[g].length > 0)
        .sort((a, b) => {
          const ia = TEAM_GROUP_ORDER.indexOf(a);
          const ib = TEAM_GROUP_ORDER.indexOf(b);
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        })
    : [];

  const scrollAreas = (direction) => {
    const el = areasScrollRef.current;
    if (!el) return;
    // Rola por CARD (largura do card + gap), garantindo que cada card sempre
    // pare inteiro na visualização — nunca cortado. Avança quantos cards
    // couberem na área visível (no mínimo 1).
    const first = el.children[0];
    const second = el.children[1];
    const step = second ? (second.offsetLeft - first.offsetLeft) : (first?.offsetWidth || 300);
    const perView = Math.max(1, Math.floor(el.clientWidth / step));
    const delta = step * perView;
    el.scrollTo({ left: direction === 'left' ? el.scrollLeft - delta : el.scrollLeft + delta, behavior: 'smooth' });
  };
  
  // Scroll automático para a seção SOMENTE quando há hash explícito na URL
  // (ex: /institucional#nossa-gente). Sem hash (reload normal), vai para o topo
  // e desliga a restauração de scroll do navegador.
  useEffect(() => {
    const hash = location.hash;
    if (!hash) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.replace('#', '');
    const scrollToSection = () => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };
    // Pequeno delay para garantir que a página terminou de renderizar
    const timer = setTimeout(scrollToSection, 350);
    return () => clearTimeout(timer);
  }, [location.hash]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#007a3d] selection:text-white flex flex-col">
      <Navbar />

      <div className="relative min-h-[85vh] flex items-center pt-28 md:pt-32 pb-40 overflow-hidden bg-[#0f1f11]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-500" style={{ backgroundImage: heroReady && cfg.hero_image ? `url('${cfg.hero_image.startsWith('http') ? cfg.hero_image : getImageUrl(cfg.hero_image)}')` : 'none' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-tr-[80px] z-10"></div>
        <div className={`container mx-auto px-6 md:px-12 relative z-10 transition-opacity duration-500 ${heroReady ? 'opacity-100' : 'opacity-0'}`}>
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
                  const section = document.getElementById('quem-somos');
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

      {/* QUEM SOMOS */}
      <div id="quem-somos" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                    <div className="w-16 h-1.5 bg-[#007a3d]"></div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[1.0] tracking-tight">
                        {cfg.quem_somos_title_line1} <br/><span className="text-[#007a3d]">{cfg.quem_somos_title_highlight}</span>
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">{cfg.quem_somos_text1}</p>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">{cfg.quem_somos_text2}</p>
                </div>
                <div className="relative animate-in zoom-in duration-1000">
                    <div className="absolute inset-0 bg-emerald-100/50 rounded-[60px] translate-x-10 translate-y-10 -z-10 blur-3xl"></div>
                    <div className="rounded-[60px] overflow-hidden shadow-2xl relative aspect-[4/5] lg:aspect-square">
                        <img
                            src={cfg.quem_somos_image && !cfg.quem_somos_image.startsWith('http') ? getImageUrl(cfg.quem_somos_image) : cfg.quem_somos_image}
                            alt="Quem Somos"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-[#1f2937] via-transparent to-transparent">
                            <p className="text-white text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{cfg.quem_somos_image_caption_top}</p>
                            <p className="text-white text-2xl font-bold uppercase font-heading">{cfg.quem_somos_image_caption_main}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-[#f8f9fa] pt-20">
        {/* NOSSA GENTE */}
        <div id="nossa-gente" className="py-32">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="text-center mb-20">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block underline underline-offset-8">{cfg.team_tag}</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937]">{cfg.team_title}</h2>
                    <p className="text-gray-400 mt-8 max-w-2xl mx-auto font-medium text-base">{cfg.team_subtitle}</p>
                </div>

                {/* CARROSSEIS — dados 100% do banco (admin → Equipe), via getImageUrl */}
                {teamGroups.map((g) => (
                    <GalleryCarousel key={g} title={g} data={teamFromApi[g]} />
                ))}
            </div>
        </div>
        
        {/* ÁREAS DE ATUAÇÃO / REGIONAL */}
        <div id="areas-atuacao" className="bg-[#f8f9fa] py-32 border-t border-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
                    <div className="w-full max-w-2xl text-left">
                        <span className="text-[#007a3d] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">{cfg.areas_tag}</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">{cfg.areas_title_line1} <br/><span className="text-[#007a3d]">{cfg.areas_title_highlight}</span></h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start lg:items-center w-full lg:w-auto">
                        <p className="text-gray-400 font-medium text-base max-w-sm">{cfg.areas_subtitle}</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => scrollAreas('left')}
                                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#1f2937] hover:border-[#007a3d] hover:bg-[#007a3d] hover:text-white transition-all shadow-md active:scale-95"
                            >
                                <ArrowLeft size={24} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => scrollAreas('right')}
                                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#1f2937] hover:border-[#007a3d] hover:bg-[#007a3d] hover:text-white transition-all shadow-md active:scale-95"
                            >
                                <ArrowRight size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={areasScrollRef}
                    className="flex overflow-x-auto gap-10 no-scrollbar pb-16 snap-x snap-mandatory scroll-pl-4 px-4"
                >
                    {areas.map((area, i) => {
                        const Icon = AREA_ICON_MAP[area.icon] || Sprout;
                        return (
                          <div
                            key={i}
                            className="group flex-shrink-0 w-[350px] md:w-[450px] bg-white p-12 rounded-[56px] transition-all duration-500 snap-start border border-gray-100 shadow-[inset_0_0_20px_rgba(255,255,255,1),0_15px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_70px_-25px_rgba(0,0,0,0.15)]"
                          >
                            <div className="text-[#007a3d] mb-10 group-hover:scale-110 transition-transform origin-left duration-500">
                                <Icon size={42} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] mb-6 group-hover:text-[#007a3d] transition-colors leading-tight">{area.title}</h3>
                            <p className="text-gray-500 text-base leading-relaxed font-medium">
                                {area.desc}
                            </p>
                          </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* ESTATUTO E NORMAS */}
        <div id="estatutos-normas" className="bg-[#f8f9fa] py-24 md:py-32 border-t border-gray-100">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">

                {/* Cabeçalho */}
                <div className="mb-20 max-w-3xl">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-6 block underline underline-offset-8">{cfg.estatuto_tag}</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-tight mb-6">
                        {cfg.estatuto_title_line1} <br/><span className="text-[#007a3d]">{cfg.estatuto_title_highlight}</span>
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed font-medium max-w-2xl">{cfg.estatuto_subtitle}</p>
                </div>

                {/* BLOCOS DE DOCUMENTOS — vêm de cfg.estatuto_blocks (editáveis no admin) */}
                {(Array.isArray(cfg.estatuto_blocks) ? cfg.estatuto_blocks : []).map((block, bIdx) => {
                    const BlockIcon = AREA_ICON_MAP[block.icon] || FileText;
                    return (
                      <div key={bIdx} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16 pb-16 border-b border-gray-200">
                          <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-[#007a3d]/10 flex items-center justify-center text-[#007a3d]">
                                      <BlockIcon size={20} />
                                  </div>
                                  <h3 className="text-2xl font-bold uppercase text-[#1f2937] font-heading tracking-tight">{block.title}</h3>
                              </div>
                              {block.subtitle && (
                                <p className="text-[#007a3d] text-xs font-black uppercase tracking-[0.2em]">{block.subtitle}</p>
                              )}
                              {(block.paragraphs || []).map((p, i) => (
                                <p key={i} className={i === 0 ? "text-gray-600 text-base leading-relaxed font-medium" : "text-gray-500 text-base leading-relaxed font-medium"}>{p}</p>
                              ))}
                          </div>
                          <div className="flex flex-col gap-4">
                              {(block.pdfs || []).map((pdf, i) => {
                                const PdfIcon = AREA_ICON_MAP[pdf.icon] || FileText;
                                const url = pdf.url && !pdf.url.startsWith('http') && !pdf.url.startsWith('/docs/') ? getImageUrl(pdf.url) : pdf.url;
                                return (
                                  <a key={i} href={url} download className="group flex items-center gap-6 bg-gradient-to-br from-[#004d26] to-[#00a855] border border-transparent rounded-2xl p-6 hover:from-[#003d1e] hover:to-[#007a3d] transition-all duration-300 shadow-md">
                                    <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-white group-hover:bg-white/25 group-hover:scale-110 transition-all shrink-0">
                                        <PdfIcon size={24} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold uppercase text-sm tracking-widest text-white mb-1">{pdf.label}</p>
                                        <p className="text-xs text-white/70 font-bold uppercase tracking-widest group-hover:text-white">PDF • Faça o download</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all shrink-0">
                                        <Download size={16} />
                                    </div>
                                  </a>
                                );
                              })}
                          </div>
                      </div>
                    );
                })}

                {/* Texto de Encerramento — centralizado */}
                <div className="text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold uppercase text-[#1f2937] font-heading leading-tight mb-10">
                        {cfg.estatuto_footer_title_line1} <span className="text-[#007a3d]">{cfg.estatuto_footer_title_highlight}</span>
                    </h3>
                    <div className="space-y-5 text-gray-500 text-base leading-relaxed font-medium text-left">
                        <p>{cfg.estatuto_footer_p1}</p>
                        <p>{cfg.estatuto_footer_p2}</p>
                        <p>{cfg.estatuto_footer_p3}</p>
                        <p className="text-gray-400 italic border-l-2 border-[#007a3d] pl-4">{cfg.estatuto_footer_quote}</p>
                    </div>
                </div>

            </div>
        </div>

        <div id="historia" className="history-container py-24 bg-white" ref={mainRef}>
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="text-center mb-32 relative z-10 flex flex-col items-center">
                    <div className="start-marker w-1 h-1 bg-transparent mb-16"></div>
                    <span className="text-[#007a3d] font-bold uppercase tracking-[0.4em] text-xs mb-6 block">{cfg.historia_tag}</span>
                    <h2 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] leading-[0.9] tracking-tighter">
                        {cfg.historia_title_line1} <span className="text-[#007a3d]">{cfg.historia_title_highlight}</span><br/>{cfg.historia_title_line2}
                    </h2>
                </div>

                <div className="relative space-y-10">
                    {(timeline || [
                        { year: 1974, title: "A <span class='text-[#007a3d]'>Fundação</span>", content: "Criação da SIF através da união entre a UFV e as principais empresas florestais do país, estabelecendo um modelo inédito de parceria universidade-empresa no Brasil.", image_url: "", layout: "image-left" },
                        { year: 1975, title: "Revista <span class='text-[#007a3d]'>Árvore</span>", content: "Lançamento da Revista Árvore, que se consolidaria como um dos principais periódicos científicos do setor, democratizando o conhecimento gerado em âmbito acadêmico.", image_url: "", layout: "image-right" },
                        { year: 2020, title: "Unidade <span class='text-[#007a3d]'>EMBRAPII</span>", content: "O credenciamento do Departamento de Engenharia Florestal da UFV como Unidade EMBRAPII Fibras Florestais, sob gestão da SIF, potencializou o aporte de recursos para projetos de alta densidade tecnológica.", image_url: "", layout: "image-left" },
                        { year: 2021, title: "Expansão e <span class='text-[#007a3d]'>Startups</span>", content: "Início do Ciclo 2 da EMBRAPII, ampliando a atuação da SIF para o suporte a startups e a inserção de novos produtos tecnológicos no mercado.", image_url: "", layout: "image-right" },
                        { year: 2024, title: "O <span class='text-[#007a3d]'>Cinquentenário</span>", content: "Celebração de 50 anos de história, marcando a maturidade institucional e a renovação dos compromissos com a inovação sustentável e o setor produtivo nacional.", image_url: "", layout: "image-left" },
                    ]).map((item, i) => (
                        <HistoryItem
                            key={item.id ?? i}
                            year={item.year}
                            title={item.title}
                            imgSrc={item.image_url && !item.image_url.startsWith('http') ? getImageUrl(item.image_url) : item.image_url}
                            layout={item.layout || 'image-left'}
                        >
                            {item.content}
                        </HistoryItem>
                    ))}
                </div>

                {/* CTA FINAL */}
                <div className="mt-32 text-center">
                    <div className="timeline-marker w-1 h-1 bg-transparent mb-12 mx-auto"></div>
                    <h2 className="text-5xl md:text-8xl font-bold font-heading uppercase text-[#1f2937] mb-12 leading-none">
                        {cfg.cta_title_line1}<br/><span className="text-[#007a3d]">{cfg.cta_title_highlight}</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button href={cfg.cta_btn1_link} variant="primary" icon={ArrowRight}>
                            {cfg.cta_btn1_label}
                        </Button>
                        <Button href={cfg.cta_btn2_link} variant="outline">
                            {cfg.cta_btn2_label}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
