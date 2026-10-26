import React from 'react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { jobDate, jobSummary } from './jobFormat';

// Card de vaga: categoria e data no alto, título, resumo curto e
// local/regime. O card inteiro abre a janela de detalhes.
export default function JobCard({ job, category, onOpen }) {
  const date = jobDate(job);
  const summary = jobSummary(job);
  const open = () => onOpen(job);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Ver vaga: ${job.title}`}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
      className="group relative flex h-full cursor-pointer flex-col rounded-card bg-white p-7 sm:p-8 shadow-card transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1.5 hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-sif-leaf/40"
    >
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-sif-green">{category}</span>

      <h3 className="mt-5 font-heading text-[22px] md:text-2xl font-medium leading-snug text-sif-ink transition-colors duration-300 group-hover:text-sif-green">
        {job.title}
      </h3>

      {summary && (
        <p className="mt-3 text-[15px] leading-relaxed text-gray-500 line-clamp-2">{summary}</p>
      )}

      <div className="mt-auto pt-7">
        <dl className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-sif-ink/80">
          {job.location && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Local</dt>
              <MapPin size={15} className="shrink-0 text-sif-green/70" aria-hidden="true" />
              <dd>{job.location}</dd>
            </div>
          )}
          {job.type && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Regime</dt>
              <Clock size={15} className="shrink-0 text-sif-green/70" aria-hidden="true" />
              <dd>{job.type}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex items-center justify-between border-t border-sif-ink/10 pt-5">
          <span className="text-[13px] text-gray-400">{date || 'Ver detalhes'}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sif-ink/10 text-sif-ink/60 transition-all duration-500 group-hover:border-sif-dark group-hover:bg-sif-dark group-hover:text-white">
            <ArrowRight size={17} className="transition-transform duration-500 group-hover:-rotate-45" />
          </span>
        </div>
      </div>
    </article>
  );
}
