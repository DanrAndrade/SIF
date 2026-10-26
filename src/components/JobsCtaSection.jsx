import React from 'react';
import GlowCta from './ui/GlowCta';

// Home › seção "Trabalhe Conosco" (abaixo das empresas associadas).
// Card que leva para a página de vagas (sem contagem de vagas).
// Editável em Painel › Home › Trabalhe Conosco.
export const JOBS_CTA_DEFAULTS = {
  enabled: true,
  tag: 'Trabalhe Conosco',
  title: 'Faça parte da SIF',
  text: 'Vagas na SIF, nas empresas associadas e no programa Germinar.',
  btn_label: 'Ver vagas abertas',
  link: '/trabalhe-conosco',
  image: '',
};

export default function JobsCtaSection({ config: saved }) {
  const config = { ...JOBS_CTA_DEFAULTS, ...(saved || {}) };
  if (config.enabled === false) return null;

  // Mesmo visual do card "Quer tornar sua empresa parceira de um GT?":
  // verde escuro com brilho que segue o mouse (components/ui/GlowCta.jsx)
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <GlowCta eyebrow={config.tag} title={config.title} text={config.text}
          btnLabel={config.btn_label || 'Ver vagas'} href={config.link || '/trabalhe-conosco'} />
      </div>
    </section>
  );
}
