import React, { useState } from 'react';
import { ArrowRight, Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import LineField from '../contact/LineField';
import { API_BASE_URL } from '../../apiConfig';

// Formulário próprio da página EMBRAPII (mesmos campos da página de referência).
// Vai para sif-api/leads.php com source "embrapii": no painel aparece em
// "Mensagens EMBRAPII", separado das mensagens do Contato.
const EMPTY = { name: '', email: '', empresa: '', cargo: '', message: '', website: '' };

const validate = (d) => {
  const e = {};
  if (!d.name.trim()) e.name = 'Informe seu nome.';
  if (!d.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Confira o e-mail, parece incompleto.';
  if (!d.empresa.trim()) e.empresa = 'Informe a empresa.';
  if (!d.cargo.trim()) e.cargo = 'Informe seu cargo.';
  if (!d.message.trim()) e.message = 'Conte como podemos ajudar.';
  return e;
};

export default function EmbrapiiForm({ buttonLabel = 'Quero uma demonstração' }) {
  const [data, setData] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  const errors = validate(data);
  const show = (k) => ((touched[k] || submitted) ? errors[k] : undefined);
  const onChange = (e) => { const { name, value } = e.target; setData(d => ({ ...d, [name]: value })); if (status === 'error') setStatus(null); };
  // Só marca como "visto" se a pessoa digitou algo (não acusa erro ao só passar pelo campo)
  const onBlur = (e) => { if (e.target.value.trim()) setTouched(t => ({ ...t, [e.target.name]: true })); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const keys = Object.keys(errors);
    if (keys.length) { e.currentTarget.querySelector(`[name="${keys[0]}"]`)?.focus(); return; }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/leads.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'embrapii' }),
      });
      const out = await res.json();
      if (out.success) { setStatus('success'); setData(EMPTY); setTouched({}); setSubmitted(false); }
      else setStatus('error');
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  if (status === 'success') {
    return (
      <div role="status" className="py-6 md:py-10">
        <div className="w-16 h-16 rounded-full bg-sif-green text-white flex items-center justify-center mb-8"><Check size={30} strokeWidth={2.5} /></div>
        <p className="sif-h3 sif-title text-sif-ink mb-3">Mensagem enviada.</p>
        <p className="text-gray-500 leading-relaxed max-w-md mb-10">Obrigado pelo interesse. A equipe da Unidade EMBRAPII Fibras Florestais vai retornar o contato.</p>
        <button type="button" onClick={() => setStatus(null)} className="group inline-flex items-center gap-2 text-sm font-bold text-sif-green">
          <RotateCcw size={15} className="transition-transform duration-500 group-hover:-rotate-180" />
          <span className="border-b border-sif-green/30 group-hover:border-sif-green transition-colors">Enviar outra mensagem</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Campo escondido contra robôs */}
      <input type="text" name="website" value={data.website} onChange={onChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
        <LineField label="Nome" name="name" autoComplete="name" value={data.name} onChange={onChange} onBlur={onBlur} required error={show('name')} />
        <LineField label="E-mail" name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} onBlur={onBlur} required error={show('email')} />
        <LineField label="Empresa" name="empresa" autoComplete="organization" value={data.empresa} onChange={onChange} onBlur={onBlur} required error={show('empresa')} />
        <LineField label="Cargo" name="cargo" autoComplete="organization-title" value={data.cargo} onChange={onChange} onBlur={onBlur} required error={show('cargo')} />
        <LineField className="md:col-span-2" multiline label="Como podemos te ajudar?" name="message" value={data.message} onChange={onChange} onBlur={onBlur} required error={show('message')} />
      </div>

      {status === 'error' && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed"><strong className="block font-bold">Não foi possível enviar agora.</strong>Tente novamente em instantes.</p>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-gray-400">Seus dados estão protegidos conosco.</p>
        <button type="submit" disabled={loading} aria-busy={loading}
          className="group relative inline-flex self-start sm:self-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-sif-dark pl-8 pr-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-sif-green disabled:cursor-wait active:scale-[0.98]">
          <span className="py-2">{loading ? 'Enviando' : status === 'error' ? 'Tentar novamente' : buttonLabel}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:bg-white group-hover:text-sif-green">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-rotate-45" />}
          </span>
        </button>
      </div>
    </form>
  );
}
