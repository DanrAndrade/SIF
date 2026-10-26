import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import ContactChannels from '../components/contact/ContactChannels';
import ContactForm from '../components/contact/ContactForm';
import { usePageConfig } from '../hooks/usePageConfig';
import { usePageTitle } from '../hooks/usePageTitle';

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Conecte-se Conosco',
  hero_title_line1: 'Fale com',
  hero_title_highlight: 'Nossa Equipe',
  hero_subtitle: 'Transparência e proximidade são nossos pilares. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas.',
  hero_scroll_label: '',
};

// Mesmos campos editáveis em /admin/contato (ContatoAdmin.jsx)
const CONTENT_DEFAULTS = {
  canais_title: 'Canais Diretos',
  phone_label: 'Telefone Centex',
  phone_value: '+55 (31) 3612-3950',
  email_label: 'E-mail Corporativo',
  email_value: 'contato@sif.org.br',
  address_label: 'Sede Administrativa',
  address_value: 'DEP de Engenharia Florestal\nAv. P.H. Rolfs, s/n – Campus da UFV\nViçosa - MG | CEP: 36570-900',
  form_tag: 'Mensagem',
  form_title_line1: 'Atendimento',
  form_title_line2: 'Técnico',
};

export default function Contact() {
  usePageTitle('Contato');
  const { hash } = useLocation();
  const { config } = usePageConfig('contato');
  const cfg = { ...CONTENT_DEFAULTS, ...config };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300);
      }
    }
  }, [hash]);

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="contato" defaults={HERO_DEFAULTS} bgColor="#f6f8f7" scrollTargetId="contact-form" />

      <main className="flex-grow pt-4 pb-24 md:pt-6 md:pb-32">
        <div id="contact-form" className="sif-container px-4 sm:px-6 md:px-10 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-panel shadow-card overflow-hidden">
            <div className="lg:col-span-5">
              <ContactChannels
                title={cfg.canais_title}
                phoneLabel={cfg.phone_label}
                phoneValue={cfg.phone_value}
                emailLabel={cfg.email_label}
                emailValue={cfg.email_value}
                addressLabel={cfg.address_label}
                addressValue={cfg.address_value}
              />
            </div>
            <div className="lg:col-span-7">
              <ContactForm tag={cfg.form_tag} titleLine1={cfg.form_title_line1} titleLine2={cfg.form_title_line2} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
