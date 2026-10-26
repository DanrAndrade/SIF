import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../apiConfig';
import { JOB_CATEGORIES, jobCategory, jobCategoryLabel } from '../utils/jobCategories';
import GlowCta from './ui/GlowCta';

// Home › seção "Trabalhe Conosco" (abaixo das empresas associadas).
// Card que leva para a página de vagas; mostra quantas vagas estão abertas
// por categoria. Editável em Painel › Home › Trabalhe Conosco.
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
  const [counts, setCounts] = useState([]);
  const enabled = config.enabled !== false;

  useEffect(() => {
    if (!enabled) return;
    fetch(`${API_BASE_URL}/jobs.php`)
      .then(r => r.json())
      .then(list => {
        const open = (Array.isArray(list) ? list : []).filter(j => j.active == 1 || j.active === true);
        setCounts(JOB_CATEGORIES.map(c => ({ key: c.key, n: open.filter(j => jobCategory(j) === c.key).length })).filter(c => c.n > 0));
      })
      .catch(() => setCounts([]));
  }, [enabled]);

  if (!enabled) return null;
  const link = config.link || '/trabalhe-conosco';

  // Mesmo visual do card "Quer tornar sua empresa parceira de um GT?":
  // verde escuro com brilho que segue o mouse (components/ui/GlowCta.jsx)
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <GlowCta eyebrow={config.tag} title={config.title} text={config.text}
          btnLabel={config.btn_label || 'Ver vagas'} href={link}>
          {counts.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {counts.map(c => (
                <li key={c.key} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                  {c.n} {c.n === 1 ? 'vaga' : 'vagas'} · {jobCategoryLabel(c.key)}
                </li>
              ))}
            </ul>
          )}
        </GlowCta>
      </div>
    </section>
  );
}
