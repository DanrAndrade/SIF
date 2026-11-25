import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, User, ChevronDown, ExternalLink } from 'lucide-react';
import logoSif from '../assets/sif.svg';
import { useEincolActive } from '../hooks/useEincolActive';
import { usePageConfig } from '../hooks/usePageConfig';
import { buttonClass, BtnArrow } from './ui/Button';

// adaptive: o texto do menu (sem fundo) usa a cor --sif-nav-fg, que a página
// atualiza ao rolar (ex.: topo do projeto, com a foto subindo por trás do menu).
// Enquanto <html data-nav-hold="1">, o menu fica visível e sem fundo (não esconde).
export default function Navbar({ scrolled: forceScrolled, adaptive = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // O menu completo só aparece se CABE: a logo (que leva para a Home) nunca pode
  // encolher e nenhum item pode ficar cortado. Se não couber, vira o menu lateral
  // (botão de menu). Uma cópia invisível do menu completo, na mesma largura, é medida
  // antes de cada pintura, então não há "piscada".
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const measureRef = useRef(null);
  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const { pathname, search, hash } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false); // some ao descer, volta ao subir
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const eincolActive = useEincolActive();
  // Abas de Produtos e Serviços escondidas no painel saem do menu
  const { config: prodCfg } = usePageConfig('produtos');
  const tabOn = (id) => !prodCfg?.[`${id}_hidden`];

  useEffect(() => {
    let lastY = window.scrollY, raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (document.documentElement.dataset.navHold === '1') { setHidden(false); setIsScrolled(false); lastY = y; return; }
      // No topo: transparente e visível.
      // Descendo: o menu só sobe, SEM trocar de cor (antes ele ficava branco
      // e depois sumia, dando uma "piscada").
      // Subindo: volta já com o fundo branco.
      if (y <= 50) { setHidden(false); setIsScrolled(false); }
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) { setIsScrolled(true); setHidden(false); }
      if (y <= 50 || Math.abs(y - lastY) > 6) lastY = y;
    };
    const handleScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Avisa a página (CSS) quando o menu está escondido: submenus fixos sobem junto
  useEffect(() => {
    document.documentElement.dataset.navHidden = hidden && !mobileMenuOpen ? '1' : '0';
  }, [hidden, mobileMenuOpen]);
  useEffect(() => () => { document.documentElement.dataset.navHidden = '0'; }, []);

  // Menu do celular aberto: página parada atrás e Esc fecha
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') { setMobileMenuOpen(false); setMobileExpanded(null); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [mobileMenuOpen]);

  useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return undefined;
    const check = () => {
      if (window.innerWidth < 1024) { setCompact(true); return; }
      const logo = box.querySelector('[data-logo]');
      const links = [...box.querySelectorAll('[data-navitem]')];
      const naturalW = logo && logo.naturalWidth ? (logo.naturalWidth / logo.naturalHeight) * logo.clientHeight : 0;
      const logoOk = !logo || !naturalW || logo.getBoundingClientRect().width >= naturalW - 1;
      // nenhum item (nem o "Conveniar") pode chegar a menos de 16 px da borda da tela
      const edge = box.getBoundingClientRect().right - 16;
      const last = box.querySelector('[data-last]');
      const inside = [...links, last].filter(Boolean).every(a => a.getBoundingClientRect().right <= edge);
      const lines = links.every(a => {
        const cs = getComputedStyle(a);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
        return a.getBoundingClientRect().height <= lh * 2.2;
      });
      setCompact(!(logoOk && inside && lines));
    };
    check();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
    ro?.observe(box);
    window.addEventListener('resize', check);
    const img = box.querySelector('[data-logo]');
    img?.addEventListener('load', check);
    document.fonts?.ready?.then(check).catch(() => {});
    return () => { ro?.disconnect(); window.removeEventListener('resize', check); img?.removeEventListener('load', check); };
  }, []);

  // Voltou a caber: o menu lateral fecha; a altura do cabeçalho acompanha o modo
  useEffect(() => { if (!compact) { setMobileMenuOpen(false); setMobileExpanded(null); } }, [compact]);
  useEffect(() => {
    document.documentElement.style.setProperty('--sif-nav-h', compact ? '76px' : '81px');
    return () => document.documentElement.style.removeProperty('--sif-nav-h');
  }, [compact]);

  const scrolled = forceScrolled || isScrolled;
  
  // Se estivermos em uma página que NÃO inicia com Hero escuro, podemos forçar o estado 'scrolled'
  // Ou simplesmente usar a prop forceScrolled que já existe.
  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  const toggleMobileExpanded = (name) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  // Rota atual (para destacar no menu lateral)
  const isCurrent = (href) => {
    const base = String(href || '').split(/[?#]/)[0];
    if (!base || base === '#') return false;
    return base === pathname || (base !== '/' && pathname.startsWith(base + '/'));
  };
  // Item de submenu atual: compara também ?aba= e #tema (ex.: Produtos > Comercial > Sementes)
  const isCurrentSub = (href) => {
    const [rest, frag = ''] = String(href || '').split('#');
    const [base, qs = ''] = rest.split('?');
    if (!base || base === '#') return false;
    if (base !== pathname) return !qs && !frag && base !== '/' && pathname.startsWith(base + '/');
    const want = new URLSearchParams(qs).get('aba') || '';
    const have = new URLSearchParams(search).get('aba') || '';
    return want === have && (frag ? '#' + frag : '') === (hash || '');
  };
  const linkIsActive = (link) => isCurrent(link.href) || (link.submenu || []).some(s => !s.external && isCurrent(s.href));

  // Fecha e devolve o foco ao botão de menu (teclado e leitores de tela)
  const closeAndFocus = () => { closeMenu(); burgerRef.current?.focus(); };
  // Tab fica preso dentro do painel enquanto ele está aberto
  const onPanelKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const f = [...(panelRef.current?.querySelectorAll('a[href], button:not([disabled])') || [])].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const navLinks = [
    { 
      name: 'Institucional', 
      href: '/institucional',
      submenu: [
        { name: 'Visão Geral', href: '/institucional', mobileOnly: true },
        { name: 'Quem Somos / História', href: '/institucional#quem-somos' },
        { name: 'Nossa Gente', href: '/institucional#nossa-gente' },
        { name: 'Estatuto e Normas', href: '/institucional#estatutos-normas' },
        { name: 'Áreas de Atuação', href: '/institucional#areas-atuacao' }
      ]
    },
    { 
      name: 'Empresas Associadas', 
      href: '/associadas', 
    },
    { 
      name: 'Produtos e Serviços', 
      href: '/produtos-servicos', 
      // Cada item abre a aba correspondente da página Produtos e Serviços.
      // Os itens do Comercial usam o "Atalho no topo da aba" dos blocos
      // (Sementes, Tubetes Biodegradáveis, Treinamentos In Company).
      submenu: [
        { name: 'Visão Geral', href: '/produtos-servicos', mobileOnly: true },
        { name: 'Comercial', href: '/produtos-servicos?aba=comercial', group: true, tab: 'comercial' },
        { name: 'Sementes', href: '/produtos-servicos?aba=comercial#sementes', indent: true, tab: 'comercial' },
        { name: 'Tubetes Biodegradáveis', href: '/produtos-servicos?aba=comercial#tubetes-biodegradaveis', indent: true, tab: 'comercial' },
        { name: 'Treinamentos In Company', href: '/produtos-servicos?aba=comercial#treinamentos-in-company', indent: true, tab: 'comercial' },
        { name: 'Programa Germinar', href: '/produtos-servicos?aba=germinar', tab: 'germinar' },
        { name: 'Boletim Técnico', href: '/produtos-servicos?aba=boletim', tab: 'boletim' },
        { name: 'Serviços de P&D', href: '/produtos-servicos?aba=pd', tab: 'pd' },
        { name: 'Proteção de Cultivares', href: '/produtos-servicos?aba=cultivares', tab: 'cultivares' },
        { name: 'Importação e Exportação', href: '/produtos-servicos?aba=importacao', tab: 'importacao' },
      ].filter(i => !i.tab || tabOn(i.tab)),
    },
    {
      name: 'Eventos & Treinamentos',
      href: '#',
      submenu: [
        { name: 'Eventos', href: '/eventos' },
        { name: 'Treinamentos', href: '/treinamentos' },
        { name: 'Treinamentos In-Company', href: '/treinamentos-in-company' },
        ...(eincolActive ? [{ name: 'EINCOL', href: '/eincol' }] : []),
      ]
    },
    { name: 'Grupos Temáticos', href: '/grupos-tematicos' },
    { name: 'Blog', href: '/blog' },
    { 
      name: 'Projetos', 
      href: '#', 
      submenu: [
        { name: 'Projetos SIF', href: '/projetos' },
        { name: 'Embrapii', href: '/projetos-sif-embrapii' },
      ]
    },
    { 
      name: 'Contato', 
      href: '#', 
      submenu: [
        { name: 'Fale Conosco', href: '/contato' },
        { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
      ]
    }
  ];

  // Ao abrir o menu lateral: foco no botão de fechar e abre o grupo da página atual
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const cur = navLinks.find(l => l.submenu && linkIsActive(l));
    setMobileExpanded(cur ? cur.name : null);
    const tm = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 120);
    return () => clearTimeout(tm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMenuOpen]);

  const associadoLinks = [
    { name: 'Acesso ao Pesquisador', href: 'https://sif.conveniar.com.br/Pesquisador/Login.aspx?ReturnUrl=%2fpesquisador' },
    { name: 'Acesso do Fornecedor', href: 'https://sif.conveniar.com.br/Fornecedor/Login.aspx?ReturnUrl=%2ffornecedor' },
    { name: 'Administração', href: 'https://sif.conveniar.com.br/Fundacao/Login.aspx?ReturnUrl=%2ffundacao' }
  ];

  const headerBg = scrolled 
    ? 'bg-white/[0.97] shadow-sm py-4 border-gray-100' 
    : 'bg-transparent py-4 border-transparent';

  const commonTextColor = scrolled ? 'text-[#1f2937]' : adaptive ? 'text-[color:var(--sif-nav-fg,#1f2937)]' : 'text-white';
  const hoverColor = scrolled ? 'hover:text-[#7FBA00]' : 'hover:text-[#7FBA00]'; // Estabilizando cor de hover
  
// Se a página for branca e não tivermos scroll, a navbar transparente com texto branco fica invisível.
// O ideal é que páginas sem Hero passem a prop scrolled={true} ou definamos um padrão.

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${headerBg} ${hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center gap-6 min-[1280px]:gap-10 min-[1440px]:gap-16">
            
            <Link to="/" aria-label="SIF: página inicial" className="flex items-center gap-2 cursor-pointer z-20 shrink-0">
                <img src={logoSif} alt="SIF" className="h-10 w-auto max-w-none shrink-0 object-contain" />
            </Link>

            <nav className={`${compact ? 'hidden' : 'flex'} items-center gap-5 min-[1280px]:gap-7 min-[1440px]:gap-10`}>
                {navLinks.map((link) => {
                    const parentClasses = `flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${commonTextColor} ${hoverColor}`;
                    const hasRoute = link.href && link.href !== '#';
                    return (
                    <div key={link.name} className="relative group py-2">
                        {hasRoute ? (
                            <Link to={link.href} className={parentClasses}>
                                {link.name}
                                {link.submenu && <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                            </Link>
                        ) : (
                            <span className={`${parentClasses} cursor-default`}>
                                {link.name}
                                {link.submenu && <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                            </span>
                        )}

                        {link.submenu && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 overflow-hidden">
                                {link.submenu.filter(s => !s.mobileOnly).map((sub, si, arr) => (
                                    sub.external ? (
                                        <a
                                            key={sub.name}
                                            href={sub.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-6 py-4 text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#007a3d] transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            {sub.name}
                                        </a>
                                    ) : (
                                        <Link
                                            key={sub.name}
                                            to={sub.href}
                                            className={sub.indent
                                              ? 'block pl-10 pr-6 py-2.5 text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-[#007a3d] transition-colors'
                                              : `block px-6 py-4 text-[10px] uppercase tracking-widest hover:bg-gray-50 hover:text-[#007a3d] transition-colors border-b border-gray-50 last:border-0 ${sub.group ? 'font-bold text-[#1f2937] border-b-0 pb-2' : 'font-medium text-gray-600'} ${arr[si - 1]?.indent ? 'border-t border-gray-100 mt-1' : ''}`}
                                        >
                                            {sub.name}
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    );
                })}
            </nav>

            <div className={`${compact ? 'hidden' : 'block'} shrink-0 z-20 relative group py-2`}>
                <button className={`text-[10px] font-bold uppercase tracking-widest bg-transparent ${commonTextColor} hover:text-[#007a3d] transition-all duration-300 flex items-center gap-2 cursor-pointer`}>
                    <User size={14} />
                    Conveniar
                    <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />
                </button>

                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 overflow-hidden">
                    {associadoLinks.map((sub) => (
                        <a 
                            key={sub.name} 
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-6 py-4 text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#007a3d] transition-colors border-b border-gray-50 last:border-0"
                        >
                            {sub.name}
                        </a>
                    ))}
                </div>
            </div>

            <button ref={burgerRef} aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={mobileMenuOpen} className={`${compact ? 'block' : 'hidden'} shrink-0 p-2 rounded-md ${commonTextColor}`} onClick={() => setMobileMenuOpen(true)}>
                <Menu size={28} />
            </button>
        </div>

        {/* Cópia invisível do menu completo, só para medir se cabe (não aparece nem recebe clique) */}
        <div ref={measureRef} aria-hidden="true" className="invisible pointer-events-none absolute left-0 right-0 top-0 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center gap-6 min-[1280px]:gap-10 min-[1440px]:gap-16">
            <span className="flex items-center gap-2 shrink-0"><img data-logo src={logoSif} alt="" className="h-10 w-auto max-w-none shrink-0 object-contain" /></span>
            <span className="flex items-center gap-5 min-[1280px]:gap-7 min-[1440px]:gap-10">
              {navLinks.map((link) => (
                <span key={link.name} className="relative py-2">
                  <span data-navitem className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.15em]">
                    {link.name}{link.submenu && <ChevronDown size={12} />}
                  </span>
                </span>
              ))}
            </span>
            <span className="shrink-0 py-2"><span data-last className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><User size={14} />Conveniar<ChevronDown size={12} /></span></span>
          </div>
        </div>
      </header>

      {/* --- MENU LATERAL: tela cheia de vidro fosco (cinza-escuro translúcido com desfoque).
          Aparece no celular e sempre que o menu completo não cabe no cabeçalho. --- */}
      <div
        role="dialog" aria-modal="true" aria-label="Menu"
        onKeyDown={onPanelKeyDown}
        ref={panelRef}
        className={`fixed inset-0 z-[70] ${compact ? '' : 'hidden'} flex flex-col bg-[#121614]/85 backdrop-blur-xl text-white transition-[opacity,visibility] duration-300 ease-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="mx-auto w-full max-w-md flex flex-col h-full">
          <div className="flex justify-between items-center px-6 h-[72px] shrink-0">
            <Link to="/" onClick={closeMenu} aria-label="SIF: página inicial" className="shrink-0"><img src={logoSif} alt="SIF" className="h-9 w-auto max-w-none object-contain" /></Link>
            <button ref={closeRef} onClick={() => closeAndFocus()} aria-label="Fechar menu" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 active:bg-white/15 transition-colors">
              <X size={18} />
            </button>
          </div>

          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto overscroll-contain px-6 pt-1 pb-5">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {navLinks.map((link, idx) => {
                const open = mobileExpanded === link.name;
                const active = linkIsActive(link);
                const enter = { transitionDelay: mobileMenuOpen ? `${80 + idx * 40}ms` : '0ms' };
                const item = `transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;
                return (
                  <li key={link.name} style={enter} className={item}>
                    {link.submenu ? (
                      <>
                        <button onClick={() => toggleMobileExpanded(link.name)} aria-expanded={open}
                          className="w-full min-h-[50px] flex items-center justify-between py-3 text-left text-base font-semibold">
                          <span className={open || active ? 'text-sif-lime' : ''}>{link.name}</span>
                          <ChevronDown size={17} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-sif-lime' : 'text-white/40'}`} />
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <div className="pb-3 pl-4 border-l border-white/15 ml-1 flex flex-col">
                              {link.submenu.map((sub) => {
                                const cur = !sub.external && isCurrentSub(sub.href);
                                const cls = `py-2 text-sm leading-snug transition-colors hover:text-white ${cur ? 'text-sif-lime font-semibold' : sub.indent ? 'pl-4 text-white/55' : sub.group ? 'text-white font-semibold' : 'text-white/70'}`;
                                return sub.external
                                  ? <a key={sub.name} href={sub.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={cls}>{sub.name}</a>
                                  : <Link key={sub.name} to={sub.href} onClick={closeMenu} className={cls}>{sub.name}</Link>;
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link to={link.href} onClick={closeMenu} aria-current={active ? 'page' : undefined}
                        className="group min-h-[50px] flex items-center justify-between py-3 text-base font-semibold">
                        <span className={active ? 'text-sif-lime' : ''}>{link.name}</span>
                        <ChevronRight size={17} className="shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sif-lime" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Conveniar: mesmo botão do site (contorno branco, seta no círculo) */}
            <div style={{ transitionDelay: mobileMenuOpen ? `${80 + navLinks.length * 40}ms` : '0ms' }}
              className={`mt-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <button type="button" onClick={() => toggleMobileExpanded('associado')} aria-expanded={mobileExpanded === 'associado'}
                className={`${buttonClass('ghostLight', 'sm')} w-full justify-between`}>
                <span className="flex items-center gap-2"><User size={14} className="text-sif-lime" /> Conveniar</span>
                <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors duration-500 group-hover/btn:bg-white group-hover/btn:text-sif-dark" aria-hidden="true">
                  <ChevronDown size={15} className={`transition-transform duration-300 ${mobileExpanded === 'associado' ? 'rotate-180' : ''}`} />
                </span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileExpanded === 'associado' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <ul className="pt-2 px-1">
                    {associadoLinks.map((sub) => (
                      <li key={sub.name}>
                        <a href={sub.href} target="_blank" rel="noopener noreferrer"
                          className="group flex items-center justify-between py-2.5 text-sm text-white/70 hover:text-white transition-colors">
                          {sub.name}
                          <ExternalLink size={14} className="shrink-0 text-white/30 group-hover:text-sif-lime transition-colors" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </nav>

          {/* Contato: botão do site + telefone */}
          <div className="shrink-0 px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-white/10 flex flex-col gap-3">
            <Link to="/contato" onClick={closeMenu} className={`${buttonClass('light', 'md')} w-full justify-between`}>
              <span className="py-1">Fale conosco</span>
              <BtnArrow variant="light" size="md" />
            </Link>
            <a href="tel:+553136123950"
              className="group flex items-center gap-3 rounded-full border border-white/15 pl-1.5 pr-5 py-1.5 transition-colors hover:bg-white/10 hover:border-white/30">
              <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sif-lime transition-colors group-hover:bg-sif-lime group-hover:text-sif-dark"><Phone size={16} /></span>
              <span className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Ligue para a SIF</span>
                <span className="block text-[15px] font-semibold">(31) 3612-3950</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
