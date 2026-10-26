import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JOB_CATEGORIES, jobCategory, jobCategoryLabel } from '../utils/jobCategories';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import GlowCta from '../components/ui/GlowCta';
import MissionValues from '../components/jobs/MissionValues';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import ApplicationModal from '../components/jobs/ApplicationModal';
import { usePageConfig } from '../hooks/usePageConfig';
import { API_BASE_URL } from '../apiConfig';
import { usePageTitle } from '../hooks/usePageTitle';

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Carreiras & Talentos SIF',
  hero_title_line1: 'Trabalhe',
  hero_title_highlight: 'Conosco',
  hero_subtitle: 'Faça parte de uma instituição que é referência nacional em ciência e tecnologia para o setor florestal.',
  hero_scroll_label: 'Ver Oportunidades',
};

const CONTENT_DEFAULTS = {
  missao_title: 'Missão',
  missao_text: 'Promover o desenvolvimento florestal gerando inovação com sinergia Universidade & Empresa.',
  visao_title: 'Visão',
  visao_text: 'Ser líder nacional em ciência e imprescindível no desenvolvimento tecnológico florestal.',
  valores_title: 'Valores',
  valores_text: 'Inovação • Proatividade • Sustentabilidade • Integridade • Comprometimento • Profissionalismo',
  vagas_tag: 'Oportunidades',
  vagas_title: 'Vagas Abertas',
  vagas_cat_interna: 'Vagas Internas',
  vagas_cat_associadas: 'Vagas nas Associadas',
  vagas_cat_germinar: 'Germinar',
  banco_tag: 'Banco de Talentos',
  banco_title: 'Cresça com a SIF',
  banco_text: 'Não encontrou sua vaga ideal? Cadastre seu currículo para futuras oportunidades estratégicas em nossos pilares técnicos.',
  banco_btn_label: 'Cadastrar Currículo',
};

const BANCO_JOB = {
  id: 'banco',
  title: 'Banco de Talentos',
  location: 'Geral',
  type: 'Cadastro reserva',
  description: 'Seu currículo ficará em nossa base estratégica para futuras oportunidades dentro dos nossos pilares técnicos e científicos.',
  requirements: [],
};

const ITEMS_PER_PAGE = 6;

const parseReqs = (r) => {
  if (Array.isArray(r)) return r;
  try { const v = JSON.parse(r || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
};

const scrollToJobs = () => {
  const section = document.getElementById('jobs-section');
  if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.pageYOffset - 120, behavior: 'smooth' });
};

export default function Jobs() {
  usePageTitle('Trabalhe Conosco');
  const { config: pageConfig } = usePageConfig('jobs');
  const cfg = { ...CONTENT_DEFAULTS, ...pageConfig };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [catFilter, setCatFilter] = useState('todas');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/jobs.php`)
      .then(res => res.json())
      .then(data => {
        const formatted = (Array.isArray(data) ? data : [])
          .map(j => ({ ...j, requirements: parseReqs(j.requirements) }))
          .filter(job => job.active == 1 || job.active === true);
        setJobs(formatted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filtro por categoria (só aparecem as categorias que têm vaga aberta)
  const catCounts = JOB_CATEGORIES
    .map(c => ({ ...c, count: jobs.filter(j => jobCategory(j) === c.key).length }))
    .filter(c => c.count > 0);
  const filteredJobs = catFilter === 'todas' ? jobs : jobs.filter(j => jobCategory(j) === catFilter);
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => { setCurrentPage(page); scrollToJobs(); };
  const openBanco = () => setSelectedJob(BANCO_JOB);
  const closeModal = useCallback(() => setSelectedJob(null), []);

  const filterItems = [
    { key: 'todas', label: 'Todas', count: jobs.length },
    ...catCounts.map(c => ({ key: c.key, label: jobCategoryLabel(c.key, cfg), count: c.count })),
  ];

  return (
    <div className="sif-page min-h-screen font-sans text-sif-ink overflow-x-hidden selection:bg-sif-green selection:text-white flex flex-col">
      <Navbar />

      <EditablePageHero pageKey="jobs" defaults={HERO_DEFAULTS} scrollTargetId="jobs-section" />

      <main className="flex-grow">
        <MissionValues cfg={cfg} />

        {/* LISTA DE VAGAS */}
        <section id="jobs-section" className="sif-container px-4 sm:px-6 md:px-10 pb-20 md:pb-28 scroll-mt-32">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="sif-eyebrow mb-4">{cfg.vagas_tag}</span>
              <h2 className="sif-title sif-h2 text-sif-ink tracking-tight">{cfg.vagas_title}</h2>
            </div>
            {!loading && jobs.length > 0 && (
              <p className="text-[15px] text-gray-500 md:pb-2">
                <strong className="font-semibold text-sif-ink">{jobs.length}</strong> {jobs.length === 1 ? 'oportunidade aberta' : 'oportunidades abertas'} agora
              </p>
            )}
          </div>

          {catCounts.length > 1 && (
            <div className="mb-10">
              <JobFilters items={filterItems} value={catFilter} onChange={(k) => { setCatFilter(k); setCurrentPage(1); }} />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Carregando vagas" data-no-reveal>
              {[0, 1, 2].map(i => (
                <div key={i} className="h-[300px] rounded-card bg-white/70 p-8 shadow-card">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-sif-ink/10" />
                  <div className="mt-6 h-6 w-4/5 animate-pulse rounded-full bg-sif-ink/10" />
                  <div className="mt-3 h-6 w-3/5 animate-pulse rounded-full bg-sif-ink/10" />
                  <div className="mt-6 h-3 w-full animate-pulse rounded-full bg-sif-ink/5" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-sif-ink/5" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-panel bg-white px-6 py-14 text-center shadow-card sm:px-12 md:py-20">
              <span className="sif-eyebrow mb-4">Nenhuma vaga no momento</span>
              <p className="sif-title sif-h3 mx-auto max-w-xl text-sif-ink">
                As próximas oportunidades <span className="text-sif-green">aparecem aqui.</span>
              </p>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-500">
                Enquanto isso, deixe seu currículo no banco de talentos. Quando surgir uma vaga com o seu perfil, falamos com você.
              </p>
              <button type="button" onClick={openBanco} className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-sif-green">
                <span className="border-b border-sif-green/30 transition-colors group-hover:border-sif-green">Cadastrar meu currículo</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentJobs.map(job => (
                <JobCard key={job.id} job={job} category={jobCategoryLabel(jobCategory(job), cfg)} onOpen={setSelectedJob} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-6" aria-label="Paginação das vagas">
              <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-sif-ink/15 text-sif-ink transition-all duration-300 hover:border-sif-dark hover:bg-sif-dark hover:text-white disabled:pointer-events-none disabled:opacity-30">
                <ArrowLeft size={18} />
              </button>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-sif-ink/70 tabular-nums">
                {currentPage} <span className="text-gray-400">de</span> {totalPages}
              </span>
              <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Próxima página"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-sif-ink/15 text-sif-ink transition-all duration-300 hover:border-sif-dark hover:bg-sif-dark hover:text-white disabled:pointer-events-none disabled:opacity-30">
                <ArrowRight size={18} />
              </button>
            </nav>
          )}
        </section>

        {/* BANCO DE TALENTOS: o card é um link "#"; o clique abre a janela de envio */}
        <section className="sif-container px-4 sm:px-6 md:px-10 pb-24 md:pb-32">
          <div onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); openBanco(); }}>
            <GlowCta
              eyebrow={cfg.banco_tag}
              title={cfg.banco_title}
              text={cfg.banco_text}
              btnLabel={cfg.banco_btn_label}
              href="#banco-de-talentos"
            />
          </div>
        </section>
      </main>

      <Footer />

      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          catLabel={selectedJob.id === 'banco' ? cfg.banco_tag : jobCategoryLabel(jobCategory(selectedJob), cfg)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
