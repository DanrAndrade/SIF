import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronRight, User, ChevronDown } from 'lucide-react';
import logoSif from '../assets/sif.svg';

export default function Navbar({ scrolled: forceScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = forceScrolled || isScrolled;
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
      href: '#', 
      submenu: [
        { name: 'Quem Somos', href: '/#quem-somos' },
        { name: 'Nossa Gente', href: '/nossa-gente' },
        { name: 'Estatutos e Normas', href: '/normas' },
        { name: 'Áreas de Atuação', href: '/areas-atuacao' },
      ]
    },
    { 
      name: 'Projetos & Transparência', 
      href: '#', 
      submenu: [
        { name: 'EMBRAPII', href: '/embrapii' },
        // ATUALIZADO: Link externo para o portal da conveniar
        { name: 'Portal Transparência', href: 'https://sif.conveniar.com.br/portaltransparencia/#projetos', external: true },
        { name: 'Projetos', href: '/projetos' },
      ]
    },
    { name: 'Nossa História', href: '/historia' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contato' }
  ];

  const associadoLinks = [
    { name: 'Acesso ao Pesquisador', href: 'https://sif.conveniar.com.br/Pesquisador/Login.aspx?ReturnUrl=%2fpesquisador' },
    { name: 'Acesso do Fornecedor', href: 'https://sif.conveniar.com.br/Fornecedor/Login.aspx?ReturnUrl=%2ffornecedor' },
    { name: 'Administração', href: 'https://sif.conveniar.com.br/Fundacao/Login.aspx?ReturnUrl=%2ffundacao' }
  ];

  const headerBg = scrolled 
    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-gray-100' 
    : 'bg-transparent py-4 border-transparent';

  const commonTextColor = scrolled ? 'text-[#1f2937]' : 'text-white';
  const hoverColor = scrolled ? 'hover:text-[#3c7a43]' : 'hover:text-[#92b735]';

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
            
            <a href="/" className="flex items-center gap-2 cursor-pointer z-20">
                <img src={logoSif} alt="SIF" className="h-8 w-auto object-contain" />
            </a>

            <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                    <div key={link.name} className="relative group py-2">
                        <a 
                            href={link.href} 
                            className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${commonTextColor} ${hoverColor}`}
                        >
                            {link.name}
                            {link.submenu && <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                        </a>
                        
                        {link.submenu && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 overflow-hidden">
                                {link.submenu.map((sub) => (
                                    <a 
                                        key={sub.name} 
                                        href={sub.href}
                                        target={sub.external ? "_blank" : "_self"}
                                        rel={sub.external ? "noopener noreferrer" : ""}
                                        className="block px-6 py-4 text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#3c7a43] transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        {sub.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div className="hidden lg:block z-20 relative group py-2">
                <button className={`text-[10px] font-bold uppercase tracking-widest bg-transparent ${commonTextColor} hover:text-[#3c7a43] transition-all duration-300 flex items-center gap-2 cursor-pointer`}>
                    <User size={14} />
                    Área do Associado
                    <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />
                </button>

                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 overflow-hidden">
                    {associadoLinks.map((sub) => (
                        <a 
                            key={sub.name} 
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-6 py-4 text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#3c7a43] transition-colors border-b border-gray-50 last:border-0"
                        >
                            {sub.name}
                        </a>
                    ))}
                </div>
            </div>

            <button className={`lg:hidden p-2 rounded-md ${commonTextColor}`} onClick={() => setMobileMenuOpen(true)}>
                <Menu size={28} />
            </button>
        </div>
      </header>

      {/* --- MOBILE DRAWER --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeMenu}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-[85%] max-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <img src={logoSif} alt="SIF" className="h-8 w-auto object-contain" />
                <button onClick={closeMenu} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#3c7a43] hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                    <div key={link.name}>
                        {link.submenu ? (
                            <>
                                <button 
                                    onClick={() => toggleMobileExpanded(link.name)}
                                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-[#1f2937] font-bold uppercase tracking-widest text-sm transition-colors"
                                >
                                    {link.name}
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180 text-[#3c7a43]' : 'text-gray-300'}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 bg-gray-50 rounded-lg ${mobileExpanded === link.name ? 'max-h-80 opacity-100 my-2' : 'max-h-0 opacity-0'}`}>
                                    {link.submenu.map((sub) => (
                                        <a 
                                            key={sub.name} 
                                            href={sub.href} 
                                            target={sub.external ? "_blank" : "_self"}
                                            rel={sub.external ? "noopener noreferrer" : ""}
                                            onClick={closeMenu} 
                                            className="block p-4 pl-8 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#3c7a43]"
                                        >
                                            {sub.name}
                                        </a>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <a href={link.href} onClick={closeMenu} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-[#1f2937] font-bold uppercase tracking-widest text-sm group transition-colors">
                                {link.name}
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#3c7a43]" />
                            </a>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => toggleMobileExpanded('associado')}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl text-[#1f2937] font-bold uppercase tracking-widest text-xs shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-[#3c7a43]" />
                            Área do Associado
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${mobileExpanded === 'associado' ? 'rotate-180 text-[#3c7a43]' : 'text-gray-300'}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'associado' ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-2 mt-2">
                            {associadoLinks.map((sub) => (
                                <a 
                                    key={sub.name} 
                                    href={sub.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 pl-6 bg-white border border-gray-100 rounded-lg text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:text-[#3c7a43]"
                                >
                                    {sub.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#3c7a43] shadow-sm">
                            <Phone size={18} />
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Suporte</span>
                            <span className="text-sm font-bold text-[#1f2937]">(31) 3899-0000</span>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </>
  );
}