import React, { useEffect, useState } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import SmartLink from './ui/SmartLink';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { JOB_CATEGORIES, jobCategory, jobCategoryLabel } from '../utils/jobCategories';
import { buttonClass } from './ui/Button';

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
  const img = config.image ? getImageUrl(config.image) : '';

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-[1280px] mx-auto">
        <SmartLink href={link}
          className="group relative grid grid-cols-1 md:grid-cols-[1.1fr_1fr] overflow-hidden rounded-panel bg-[#0b3320] text-white shadow-[var(--sif-shadow-card-hover)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7FBA00]">
          <div className="relative p-8 md:p-14 flex flex-col justify-center">
            {config.tag && <span className="text-[#b5e05c] font-bold uppercase tracking-widest text-xs mb-4 block">{config.tag}</span>}
            {config.title && <h2 className="sif-title sif-h2 leading-tight mb-5">{config.title}</h2>}
            {config.text && <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-xl">{config.text}</p>}

            {counts.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {counts.map(c => (
                  <li key={c.key} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
                    {c.n} {c.n === 1 ? 'vaga' : 'vagas'} · {jobCategoryLabel(c.key)}
                  </li>
                ))}
              </ul>
            )}

            <span className={`mt-8 w-fit ${buttonClass('light')} group-hover:bg-sif-leaf group-hover:text-white`}>
              {config.btn_label || 'Ver vagas'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>

          <div className="relative min-h-[220px] md:min-h-[380px]">
            {img ? (
              <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase size={120} strokeWidth={1} className="text-white/15" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b3320] via-[#0b3320]/30 to-transparent md:from-[#0b3320] md:via-transparent pointer-events-none" />
          </div>
        </SmartLink>
      </div>
    </section>
  );
}
