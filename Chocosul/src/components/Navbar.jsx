import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronRight, User } from 'lucide-react';
// Importando o logo
import logoChocosul from '../assets/chocosul.svg';

export default function Navbar({ scrolled: forceScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Controle de Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = forceScrolled || isScrolled;
  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Nossa História', href: '/historia' },
    { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
    { name: 'Contato', href: '/contato' }
  ];

  // Estilos do Header Desktop
  const headerBg = scrolled 
    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-gray-100' 
    : 'bg-transparent py-4 border-transparent';

  const commonTextColor = scrolled ? 'text-[#1f2937]' : 'text-white';
  // commonBorderColor removido pois não vamos usar borda no botão desktop
  const hoverColor = scrolled ? 'hover:text-[#D91A3C]' : 'hover:text-gray-200';

  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
            
            {/* 1. LOGO */}
            <a href="/" className="flex items-center gap-2 cursor-pointer z-20">
                <img 
                    src={logoChocosul} 
                    alt="Chocosul Distribuidora" 
                    className="h-8 w-auto object-contain" 
                />
            </a>

            {/* 2. MENU DESKTOP */}
            <nav className="hidden lg:flex items-center gap-10">
                {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href} 
                        className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors ${commonTextColor} ${hoverColor}`}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>

            {/* 3. LINK ÁREA DO CLIENTE (Desktop) */}
            {/* ALTERAÇÃO: Removido estilo de pílula (border, rounded, bg). Agora é apenas link texto+ícone */}
            <div className="hidden lg:block z-20">
                <a 
                    href="/login"
                    className={`
                        text-[10px] font-bold uppercase tracking-widest
                        bg-transparent
                        ${commonTextColor}
                        hover:text-[#D91A3C]
                        transition-all duration-300 flex items-center gap-2 cursor-pointer
                    `}
                >
                    <User size={14} />
                    Área do Cliente
                </a>
            </div>

            {/* MENU HAMBURGUER (Mobile) */}
            <button 
                className={`lg:hidden p-2 rounded-md ${commonTextColor}`}
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu size={28} />
            </button>
        </div>
      </header>

      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={closeMenu}
      ></div>

      {/* --- MOBILE DRAWER --- */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
            
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <img src={logoChocosul} alt="Chocosul" className="h-8 w-auto object-contain" />
                </div>
                <button onClick={closeMenu} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#D91A3C] hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Mobile Links List */}
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-[#1f2937] font-bold uppercase tracking-wide text-sm group transition-colors"
                    >
                        {link.name}
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#D91A3C]" />
                    </a>
                ))}
            </div>

            {/* Mobile Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#D91A3C] shadow-sm">
                            <Phone size={18} />
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-gray-500">Suporte</span>
                            <span className="text-sm font-bold text-[#1f2937]">+55 (73) 3511-1050</span>
                        </div>
                    </div>
                    
                    {/* BOTÃO MOBILE (Mantido estilo sólido original, apenas mudado para Link) */}
                    <a 
                        href="/login"
                        className="w-full py-4 bg-[#D91A3C] text-white shadow-lg hover:bg-[#b01530] font-bold rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                    >
                        <User size={16} />
                        Acessar Área do Cliente
                    </a>
                </div>
            </div>
      </div>
    </>
  );
}