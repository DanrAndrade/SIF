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
  const img = config.image ? getImageUrl(config.image, 1024) : '';

  // Faixa compacta e clara: texto à esquerda, vagas abertas e botão à direita
  return (
    <section className="py-10 md:py-14 px-4">
      <div className="max-w-[1280px] mx-auto">
        <SmartLink href={link}
          className="group relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10 rounded-card bg-white border border-gray-100 shadow-card hover:shadow-card-hover p-6 md:p-10 transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7FBA00]">
          <div className="shrink-0">
            {img ? (
              <img src={img} alt="" loading="lazy" decoding="async" className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover" />
            ) : (
              <span className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#eef6ef] text-[#007a3d] flex items-center justify-center">
                <Briefcase size={30} strokeWidth={1.6} />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {config.tag && <span className="sif-eyebrow mb-2">{config.tag}</span>}
            {config.title && <h2 className="sif-title text-2xl md:text-4xl leading-tight text-[#1f2937]">{config.title}</h2>}
            {config.text && <p className="mt-2 text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">{config.text}</p>}
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
            {counts.length > 0 && (
              <ul className="flex flex-wrap md:justify-end gap-2">
                {counts.map(c => (
                  <li key={c.key} className="px-3 py-1.5 rounded-full bg-[#eef6ef] text-[#0b3320] text-xs font-semibold">
                    {c.n} {c.n === 1 ? 'vaga' : 'vagas'} · {jobCategoryLabel(c.key)}
                  </li>
                ))}
              </ul>
            )}
            <span className={`w-fit ${buttonClass('primary')}`}>
              {config.btn_label || 'Ver vagas'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </SmartLink>
      </div>
    </section>
  );
}
