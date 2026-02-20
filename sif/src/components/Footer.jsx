import React from 'react';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react';
// Importando o logo
import logoChocosul from '../assets/chocosul.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8f9fa] pt-0 pb-8 flex justify-center w-full">
      
      {/* Container Principal */}
      <div className="w-[95%] max-w-[1600px] bg-[#1f2937] rounded-[40px] relative overflow-hidden text-white shadow-2xl">
        
        {/* EFEITOS DE LUZ (Glows) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D91A3C] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC107] rounded-full blur-[120px] opacity-15 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        {/* CONTEÚDO */}
        <div className="relative z-10 p-8 md:p-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-gray-700/50 pb-12 mb-12">
            
            {/* COLUNA 1: Logo e Sobre */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                {/* LOGO NO FOOTER */}
                {/* Ajustei para h-12 (48px) para ficar um pouco maior que no menu */}
                <a href="/">
                    <img 
                        src={logoChocosul} 
                        alt="Chocosul Distribuidora" 
                        className="h-12 w-auto object-contain" 
                    />
                </a>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Há mais de 20 anos transformando a logística no sul da Bahia. Compromisso, pontualidade e inovação para o seu negócio ir mais longe.
              </p>
              
              <div className="flex gap-4 pt-2">
                <SocialLink href="#" icon={<Instagram size={20} />} />
                <SocialLink href="#" icon={<Linkedin size={20} />} />
                <SocialLink href="#" icon={<Facebook size={20} />} />
              </div>
            </div>

            {/* COLUNA 2: Navegação */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-lg font-bold font-heading uppercase tracking-wider text-gray-200">Navegação</h4>
              <ul className="space-y-3">
                <FooterLink to="/" text="Início" />
                <FooterLink to="/historia" text="Nossa História" />
                <FooterLink to="/trabalhe-conosco" text="Trabalhe Conosco" />
                <FooterLink to="/contato" text="Fale Conosco" />
              </ul>
            </div>

            {/* COLUNA 3: Contato */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="text-lg font-bold font-heading uppercase tracking-wider text-gray-200">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="text-[#FFC107] shrink-0 mt-1" size={20} />
                  <span>Av. Exemplo, 1234, Distrito Industrial<br/>Eunápolis - BA, 45820-000</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="text-[#FFC107] shrink-0" size={20} />
                  <span>(73) 3281-0000</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="text-[#FFC107] shrink-0" size={20} />
                  <span>comercial@chocosul.com.br</span>
                </li>
              </ul>
            </div>

          </div>

          {/* RODAPÉ INFERIOR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
            <p>&copy; {currentYear} Chocosul Distribuidora. Todos os direitos reservados.</p>
            
            <p className="flex items-center gap-1">
              Desenvolvido por 
              <a 
                href="https://www.avdasoftware.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D91A3C] font-bold hover:text-[#FFC107] transition-colors ml-1"
              >
                AVDA Software
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white 
      hover:bg-[#FFC107] hover:border-[#FFC107] hover:text-[#D91A3C] hover:-translate-y-1 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, text }) {
  return (
    <li>
      <a 
        href={to} 
        className="text-gray-400 hover:text-[#D91A3C] transition-colors inline-block hover:translate-x-1 duration-200"
      >
        {text}
      </a>
    </li>
  );
}