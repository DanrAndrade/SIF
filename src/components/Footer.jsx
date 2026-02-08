import React from 'react';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
// Importando o logo
import logoSif from '../assets/sif.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8f9fa] pt-0 pb-8 flex justify-center w-full">
      
      {/* Container Principal */}
      <div className="w-[95%] max-w-[1600px] bg-[#1f2937] rounded-[40px] relative overflow-hidden text-white shadow-2xl">
        
        {/* EFEITOS DE LUZ (Glows) - Ajustados para Verde SIF */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3c7a43] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#92b735] rounded-full blur-[120px] opacity-15 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        {/* CONTEÚDO */}
        <div className="relative z-10 p-8 md:p-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-gray-700/50 pb-12 mb-12">
            
            {/* COLUNA 1: Logo e Sobre */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                {/* LOGO NO FOOTER */}
                <a href="/">
                    <img 
                        src={logoSif} 
                        alt="SIF - Sociedade de Investigações Florestais" 
                        className="h-12 w-auto object-contain" 
                    />
                </a>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Há 50 anos promovendo o desenvolvimento científico e tecnológico do setor florestal brasileiro, a SIF atua como um elo estratégico entre a universidade e as principais empresas do setor.
              </p>
              
              <div className="flex gap-4 pt-2">
                <SocialLink href="https://www.instagram.com/sif.ufv" icon={<Instagram size={20} />} />
                <SocialLink href="https://www.linkedin.com/company/sif-ufv/?originalSubdomain=br" icon={<Linkedin size={20} />} />
                <SocialLink href="https://www.facebook.com/sif.org/" icon={<Facebook size={20} />} />
                <SocialLink href="https://www.youtube.com/channel/UC5jaY6VxP9aw81aeECwBBBA" icon={<Youtube size={20} />} />
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
                  {/* Ícone Amarelo -> Verde Claro SIF */}
                  <MapPin className="text-[#92b735] shrink-0 mt-1" size={20} />
                  <span>Departamento de Engenharia Florestal<br/>Av. P.H. Rolfs, s/n – Campus da UFV<br/>CEP: 36570-900 – Viçosa/MG</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="text-[#92b735] shrink-0" size={20} />
                  <span>(31) 3612-3950</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="text-[#92b735] shrink-0" size={20} />
                  <span>contato@sif.org.br</span>
                </li>
              </ul>
            </div>

          </div>

          {/* RODAPÉ INFERIOR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
            <p>&copy; {currentYear} SIF - Sociedade de Investigações Florestais. Todos os direitos reservados.</p>
            
            <p className="flex items-center gap-1">
              Desenvolvido por 
              <a 
                href="https://www.avdasoftware.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                // Hover Vermelho/Amarelo -> Verde SIF/Verde Claro
                className="text-[#3c7a43] font-bold hover:text-[#92b735] transition-colors ml-1"
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
      target="_blank" 
      rel="noopener noreferrer"
      // Hover BG Amarelo/Borda Amarelo/Texto Vermelho -> BG Verde Claro/Borda Verde Claro/Texto Verde Escuro
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white 
      hover:bg-[#92b735] hover:border-[#92b735] hover:text-[#1f2937] hover:-translate-y-1 transition-all duration-300"
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
        // Hover Vermelho -> Verde SIF
        className="text-gray-400 hover:text-[#3c7a43] transition-colors inline-block hover:translate-x-1 duration-200"
      >
        {text}
      </a>
    </li>
  );
}