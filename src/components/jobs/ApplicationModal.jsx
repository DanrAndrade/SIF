import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react';
import LineField from '../contact/LineField';
import CvUpload from './CvUpload';
import { API_BASE_URL, stripNbsp } from '../../apiConfig';
import { jobDate, maskPhone } from './jobFormat';

const EMPTY = { name: '', email: '', phone: '', linkedin: '' };

const validate = (d, file) => {
  const e = {};
  if (!d.name.trim()) e.name = 'Informe seu nome.';
  else if (d.name.trim().length < 3) e.name = 'Digite o nome completo.';
  if (!d.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Confira o e-mail, parece incompleto.';
  const digits = d.phone.replace(/\D/g, '');
  if (!digits) e.phone = 'Informe um telefone para retorno.';
  else if (digits.length < 10) e.phone = 'Telefone com DDD, por favor.';
  if (!file) e.cv = 'Anexe o seu currículo (PDF ou Word).';
  return e;
};

// Entrada da janela e troca de etapa (sem depender de plugin do Tailwind)
const MOTION_CSS = `
@keyframes sifJobFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes sifJobSheet { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
@keyframes sifJobStep { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
.sif-job-fade { animation: sifJobFade .3s ease both }
.sif-job-sheet { animation: sifJobSheet .55s cubic-bezier(.2,.7,.2,1) both }
.sif-job-step { animation: sifJobStep .45s cubic-bezier(.2,.7,.2,1) both }
@media (prefers-reduced-motion: reduce) { .sif-job-fade, .sif-job-sheet, .sif-job-step { animation: none } }
`;

// Botão principal no mesmo estilo do formulário de contato
const PRIMARY = 'group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-sif-dark pl-8 pr-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-sif-green disabled:cursor-wait active:scale-[0.98]';
const PRIMARY_ICON = 'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:bg-white group-hover:text-sif-green';

// Janela da vaga em dois passos: 1) detalhes  2) candidatura.
// Envio para sif-api/candidates.php (multipart com o currículo em "cv").
export default function ApplicationModal({ job, catLabel, onClose }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [data, setData] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);

  const errors = validate(data, file);
  const show = (k) => (touched[k] || submitted) ? errors[k] : undefined;
  const isBanco = job.id === 'banco';
  const date = jobDate(job);

  // Trava a rolagem da página, fecha no Esc e foca o botão de fechar
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, []);

  // Ao trocar de etapa os erros somem: só voltam depois que a pessoa sair de
  // um campo que mexeu (blur) ou clicar em Enviar na etapa 2.
  const resetErrors = () => { dirty.current = {}; setTouched({}); setSubmitted(false); };
  const goStep = (s) => {
    resetErrors();
    if (status === 'error') setStatus('idle');
    setStep(s);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Outra vaga aberta na mesma janela: volta ao início, sem erros
  useEffect(() => { setStep(1); setTouched({}); setSubmitted(false); setStatus('idle'); }, [job.id]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'phone') value = maskPhone(value);
    dirty.current[name] = true;
    setData(d => ({ ...d, [name]: value }));
    if (status === 'error') setStatus('idle');
  };
  // Só marca o campo se a pessoa digitou algo nele (clicar e sair não acusa erro)
  const dirty = useRef({});
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (dirty.current[name] || value.trim()) setTouched(t => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      const el = e.currentTarget.querySelector(`[name="${first}"]`);
      if (first === 'cv') el?.closest('div')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else el?.focus();
      return;
    }
    setStatus('loading');

    const body = new FormData();
    body.append('job_id', job.id);
    body.append('job_title', job.title);
    body.append('name', data.name);
    body.append('email', data.email);
    body.append('phone', data.phone);
    body.append('linkedin', data.linkedin);
    body.append('cv', file);

    try {
      const response = await fetch(`${API_BASE_URL}/candidates.php`, { method: 'POST', body });
      const result = await response.json();
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const meta = [
    { label: 'Local', value: job.location },
    { label: 'Regime', value: job.type },
    { label: 'Remuneração', value: job.salary },
    { label: 'Publicação', value: date.replace(/^Publicada /, '') },
  ].filter(m => m.value);

  const paragraphs = stripNbsp(job.description || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const steps = ['Sobre a vaga', 'Seus dados'];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="vaga-titulo">
      <style>{MOTION_CSS}</style>
      <div className="absolute inset-0 bg-sif-dark/70 backdrop-blur-sm sif-job-fade" onClick={onClose} aria-hidden="true" />

      <div className="sif-job-sheet relative z-10 flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-card bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-panel">
        {/* Cabeçalho */}
        <header className="shrink-0 px-6 pt-7 sm:px-10 sm:pt-10">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <span className="sif-eyebrow mb-3">{catLabel}</span>
              <h2 id="vaga-titulo" className="sif-title text-[26px] leading-tight text-sif-ink sm:text-4xl">{job.title}</h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="group -mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sif-ink/60 transition-colors duration-300 hover:bg-sif-dark hover:text-white"
            >
              <X size={22} className="transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>

          {status !== 'success' && (
            <ol className="mt-7 grid grid-cols-2 gap-3" aria-label="Etapas">
              {steps.map((label, i) => {
                const n = i + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <li key={label} aria-current={active ? 'step' : undefined}>
                    <span className="block h-[2px] w-full overflow-hidden rounded-full bg-sif-ink/10">
                      <span className={`block h-full bg-sif-green transition-transform duration-700 ease-out origin-left ${active || done ? 'scale-x-100' : 'scale-x-0'}`} />
                    </span>
                    <span className={`mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${active || done ? 'text-sif-ink' : 'text-gray-400'}`}>
                      <span className="tabular-nums text-sif-green">0{n}</span> {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </header>

        {/* Conteúdo */}
        <div ref={scrollRef} className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-8 pt-6 sm:px-10 sm:pb-10">
          {status === 'success' ? (
            <div role="status" className="py-6 sm:py-10">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-sif-green text-white">
                <Check size={30} strokeWidth={2.5} />
              </div>
              <p className="sif-title sif-h3 mb-3 text-sif-ink">Candidatura recebida.</p>
              <p className="mb-10 max-w-md leading-relaxed text-gray-500">
                Obrigado, {data.name.trim().split(' ')[0]}. {isBanco
                  ? 'Seu currículo entrou para o nosso banco de talentos.'
                  : <>Sua candidatura para <strong className="font-semibold text-sif-ink">{job.title}</strong> foi registrada.</>} Se o seu perfil avançar, entraremos em contato pelo e-mail ou telefone informados.
              </p>
              <button type="button" onClick={onClose} className={PRIMARY}>
                <span className="py-2">Fechar</span>
                <span className={PRIMARY_ICON}><Check size={18} /></span>
              </button>
            </div>
          ) : step === 1 ? (
            <div key="s1" className="sif-job-step">
              {meta.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-y border-sif-ink/10 py-5 sm:flex sm:flex-wrap sm:gap-x-12">
                  {meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{m.label}</dt>
                      <dd className="mt-1.5 text-[15px] font-medium text-sif-ink">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {paragraphs.length > 0 && (
                <section className="mt-8">
                  <h3 className="sif-eyebrow mb-4">Descrição</h3>
                  <div className="space-y-4 text-[16px] leading-relaxed text-gray-600">
                    {paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
                  </div>
                </section>
              )}

              {job.requirements?.length > 0 && (
                <section className="mt-9">
                  <h3 className="sif-eyebrow mb-4">Requisitos e diferenciais</h3>
                  <ul className="divide-y divide-sif-ink/10">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-4 py-3 text-[16px] leading-relaxed text-sif-ink/80">
                        <Check size={17} strokeWidth={2.5} className="mt-1 shrink-0 text-sif-green" aria-hidden="true" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <form id="form-candidatura" key="s2" onSubmit={handleSubmit} noValidate className="sif-job-step">
              <p className="mb-5 text-[15px] leading-relaxed text-gray-500">
                Preencha seus dados e anexe o currículo. Levamos menos de dois minutos.
              </p>
              <div className="grid grid-cols-1 gap-x-10 gap-y-1 md:grid-cols-2">
                <LineField label="Nome completo" name="name" autoComplete="name" value={data.name} onChange={handleChange} onBlur={handleBlur} required error={show('name')} />
                <LineField label="E-mail" name="email" type="email" autoComplete="email" value={data.email} onChange={handleChange} onBlur={handleBlur} required error={show('email')} />
                <LineField label="Telefone / WhatsApp" name="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={15} value={data.phone} onChange={handleChange} onBlur={handleBlur} required error={show('phone')} />
                <LineField label="LinkedIn" name="linkedin" autoComplete="url" value={data.linkedin} onChange={handleChange} hint="Opcional" />
              </div>
              <CvUpload file={file} onChange={(f) => { setFile(f); setTouched(t => ({ ...t, cv: true })); }} error={submitted ? errors.cv : undefined} />

              {status === 'error' && (
                <div role="alert" className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <div className="text-sm leading-relaxed">
                    <strong className="block font-bold">Não foi possível enviar agora.</strong>
                    Seus dados continuam aqui. Tente novamente em instantes.
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Rodapé com ações */}
        {status !== 'success' && (
          <footer className="shrink-0 border-t border-sif-ink/10 bg-white px-6 py-5 sm:px-10">
            {step === 1 ? (
              <div key="rodape-1" className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-[12px] text-gray-400 sm:text-left">Etapa 1 de 2</p>
                <button key="avancar" type="button" onClick={() => goStep(2)} className={PRIMARY}>
                  <span className="py-2">{isBanco ? 'Enviar currículo' : 'Quero me candidatar'}</span>
                  <span className={PRIMARY_ICON}><ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-rotate-45" /></span>
                </button>
              </div>
            ) : (
              <div key="rodape-2" className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button key="voltar" type="button" onClick={() => goStep(1)} className="group inline-flex items-center justify-center gap-2 text-sm font-bold text-sif-ink/60 transition-colors hover:text-sif-green">
                  <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                  Voltar aos detalhes
                </button>
                <button key="enviar" type="submit" form="form-candidatura" disabled={status === 'loading'} aria-busy={status === 'loading'} className={PRIMARY}>
                  <span className="py-2">{status === 'loading' ? 'Enviando' : status === 'error' ? 'Tentar novamente' : 'Enviar candidatura'}</span>
                  <span className={PRIMARY_ICON}>
                    {status === 'loading'
                      ? <Loader2 size={18} className="animate-spin" />
                      : <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-rotate-45" />}
                  </span>
                </button>
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
