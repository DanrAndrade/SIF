import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import logoSif from '../assets/sif.svg';
import SmartLink from './ui/SmartLink';
import { usePageConfig } from '../hooks/usePageConfig';
import { FOOTER_DEFAULTS, footerBg } from '../utils/footerDefaults';

// Rodapé — conteúdo e cor editáveis em Painel › Páginas › Rodapé.
// Sem configuração salva (ou backend fora do ar), mostra os textos padrão.
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = usePageConfig('footer');
  const c = { ...FOOTER_DEFAULTS, ...config };
  const navLinks = Array.isArray(c.nav_links) && c.nav_links.length ? c.nav_links : FOOTER_DEFAULTS.nav_links;
  const socials = [
    ['instagram', Instagram, 'Instagram'], ['linkedin', Linkedin, 'LinkedIn'],
    ['facebook', Facebook, 'Facebook'], ['youtube', Youtube, 'YouTube'],
  ].filter(([k]) => c[k]);

  return (
    <footer className="bg-[#f8f9fa] pt-0 pb-8 flex justify-center w-full">

      {/* Container Principal */}
      <div className="w-[95%] max-w-[1600px] rounded-[40px] relative overflow-hidden text-white shadow-2xl" style={{ backgroundColor: footerBg(c) }}>

        {/* Brilhos verdes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007a3d] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7FBA00] rounded-full blur-[120px] opacity-15 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 p-8 md:p-16">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-12 mb-12">

            {/* COLUNA 1: Logo e Sobre */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <Link to="/">
                    <img src={logoSif} alt="SIF - Sociedade de Investigações Florestais" className="h-12 w-auto object-contain" />
                </Link>
              </div>
              {c.about && <p className="text-white/70 leading-relaxed max-w-sm">{c.about}</p>}

              {socials.length > 0 && (
                <div className="flex gap-4 pt-2">
                  {socials.map(([k, Icon, name]) => <SocialLink key={k} href={c[k]} label={name} icon={<Icon size={20} />} />)}
                </div>
              )}
            </div>

            {/* COLUNA 2: Navegação */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-lg font-semibold tracking-wide text-white/90">{c.nav_title}</h4>
              <ul className="space-y-3">
                {navLinks.filter(l => l && l.label).map((l, i) => <FooterLink key={i} to={l.link} text={l.label} />)}
              </ul>
            </div>

            {/* COLUNA 3: Contato */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="text-lg font-semibold tracking-wide text-white/90">{c.contact_title}</h4>
              <ul className="space-y-4">
                {c.address && (
                  <li className="flex items-start gap-3 text-white/70">
                    <MapPin className="text-[#7FBA00] shrink-0 mt-1" size={20} />
                    <span className="whitespace-pre-line">{c.address}</span>
                  </li>
                )}
                {c.phone && (
                  <li className="flex items-center gap-3 text-white/70">
                    <Phone className="text-[#7FBA00] shrink-0" size={20} />
                    <a href={`tel:${c.phone.replace(/\D/g, '')}`} className="hover:text-white">{c.phone}</a>
                  </li>
                )}
                {c.email && (
                  <li className="flex items-center gap-3 text-white/70">
                    <Mail className="text-[#7FBA00] shrink-0" size={20} />
                    <a href={`mailto:${c.email}`} className="hover:text-white">{c.email}</a>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* RODAPÉ INFERIOR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50 font-medium">
            <p>&copy; {currentYear} {c.copyright}</p>
            <p className="flex items-center gap-1">
              Desenvolvido por
              <a href="https://www.avdasoftware.com.br" target="_blank" rel="noopener noreferrer"
                className="text-[#7FBA00] font-bold hover:text-white transition-colors ml-1">
                AVDA Software
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white
      hover:bg-[#7FBA00] hover:border-[#7FBA00] hover:text-[#1f2937] hover:-translate-y-1 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, text }) {
  return (
    <li>
      <SmartLink
        href={to}
        className="text-white/70 hover:text-[#7FBA00] transition-colors inline-block hover:translate-x-1 duration-200"
      >
        {text}
      </SmartLink>
    </li>
  );
}
