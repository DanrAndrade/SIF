import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight, User, ChevronDown } from 'lucide-react';
import logoSif from '../assets/sif.svg';
import { useEincolActive } from '../hooks/useEincolActive';

export default function Navbar({ scrolled: forceScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false); // some ao descer, volta ao subir
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const eincolActive = useEincolActive();

  useEffect(() => {
    let lastY = window.scrollY, raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
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
        { name: 'Projetos', href: '/projetos' },
        { name: 'Portal da Transparência', href: 'https://sif.conveniar.com.br/portaltransparencia/', external: true },
        { name: 'Conveniar', href: 'https://sif.conveniar.com.br/', external: true },
        { name: 'SIF e EMBRAPII', href: '/projetos-sif-embrapii' },
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

  const associadoLinks = [
    { name: 'Acesso ao Pesquisador', href: 'https://sif.conveniar.com.br/Pesquisador/Login.aspx?ReturnUrl=%2fpesquisador' },
    { name: 'Acesso do Fornecedor', href: 'https://sif.conveniar.com.br/Fornecedor/Login.aspx?ReturnUrl=%2ffornecedor' },
    { name: 'Administração', href: 'https://sif.conveniar.com.br/Fundacao/Login.aspx?ReturnUrl=%2ffundacao' }
  ];

  const headerBg = scrolled 
    ? 'bg-white/[0.97] shadow-sm py-4 border-gray-100' 
    : 'bg-transparent py-4 border-transparent';

  const commonTextColor = scrolled ? 'text-[#1f2937]' : 'text-white';
  const hoverColor = scrolled ? 'hover:text-[#7FBA00]' : 'hover:text-[#7FBA00]'; // Estabilizando cor de hover
  
// Se a página for branca e não tivermos scroll, a navbar transparente com texto branco fica invisível.
// O ideal é que páginas sem Hero passem a prop scrolled={true} ou definamos um padrão.

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${headerBg} ${hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center gap-16">
            
            <Link to="/" className="flex items-center gap-2 cursor-pointer z-20">
                <img src={logoSif} alt="SIF" className="h-10 w-auto object-contain" />
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
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
                                {link.submenu.filter(s => !s.mobileOnly).map((sub) => (
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
                                            className="block px-6 py-4 text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#007a3d] transition-colors border-b border-gray-50 last:border-0"
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

            <div className="hidden lg:block z-20 relative group py-2">
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

            <button aria-label="Abrir menu" className={`lg:hidden p-2 rounded-md ${commonTextColor}`} onClick={() => setMobileMenuOpen(true)}>
                <Menu size={28} />
            </button>
        </div>
      </header>

      {/* --- MENU DO CELULAR: tela cheia, cinza-escuro translúcido com desfoque, texto branco --- */}
      <div
        role="dialog" aria-modal="true" aria-label="Menu"
        className={`fixed inset-0 z-[70] lg:hidden flex flex-col bg-[#121614]/85 backdrop-blur-xl text-white transition-[opacity,visibility] duration-300 ease-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="flex justify-between items-center px-6 h-20 shrink-0">
          <Link to="/" onClick={closeMenu}><img src={logoSif} alt="SIF" className="h-9 w-auto object-contain" /></Link>
          <button onClick={closeMenu} aria-label="Fechar menu" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white active:bg-white/15 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {navLinks.map((link, idx) => {
              const open = mobileExpanded === link.name;
              const enter = { transitionDelay: mobileMenuOpen ? `${80 + idx * 45}ms` : '0ms' };
              const item = `transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;
              return (
                <li key={link.name} style={enter} className={item}>
                  {link.submenu ? (
                    <>
                      <button onClick={() => toggleMobileExpanded(link.name)} aria-expanded={open}
                        className="w-full flex items-center justify-between py-4 text-left text-lg font-semibold tracking-tight">
                        <span className={open ? 'text-sif-lime' : ''}>{link.name}</span>
                        <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-sif-lime' : 'text-white/40'}`} />
                      </button>
                      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                          <div className="pb-4 pl-4 border-l border-white/15 ml-1 flex flex-col">
                            {link.submenu.map((sub) => {
                              const cls = 'py-2.5 text-[15px] text-white/70 hover:text-white transition-colors';
                              return sub.external
                                ? <a key={sub.name} href={sub.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={cls}>{sub.name}</a>
                                : <Link key={sub.name} to={sub.href} onClick={closeMenu} className={cls}>{sub.name}</Link>;
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link to={link.href} onClick={closeMenu} className="group flex items-center justify-between py-4 text-lg font-semibold tracking-tight">
                      {link.name}
                      <ChevronRight size={18} className="shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sif-lime" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Conveniar */}
          <div style={{ transitionDelay: mobileMenuOpen ? `${80 + navLinks.length * 45}ms` : '0ms' }}
            className={`mt-8 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <button onClick={() => toggleMobileExpanded('associado')} aria-expanded={mobileExpanded === 'associado'}
              className="w-full flex items-center justify-between rounded-full border border-white/20 pl-5 pr-4 py-3 text-xs font-bold uppercase tracking-[0.18em]">
              <span className="flex items-center gap-2"><User size={15} className="text-sif-lime" /> Conveniar</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${mobileExpanded === 'associado' ? 'rotate-180 text-sif-lime' : 'text-white/40'}`} />
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileExpanded === 'associado' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="flex flex-col pt-3 pl-5">
                  {associadoLinks.map((sub) => (
                    <a key={sub.name} href={sub.href} target="_blank" rel="noopener noreferrer" className="py-2.5 text-[15px] text-white/70 hover:text-white transition-colors">{sub.name}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <a href="tel:+553136123950" className="shrink-0 flex items-center gap-3 px-6 py-5 border-t border-white/10 text-white/80 hover:text-white">
          <Phone size={17} className="text-sif-lime" />
          <span className="text-sm"><span className="text-white/50 mr-2">Contato</span>(31) 3612-3950</span>
        </a>
      </div>
    </>
  );
}
