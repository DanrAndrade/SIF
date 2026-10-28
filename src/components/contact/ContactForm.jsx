import React, { useState } from 'react';
import { ArrowRight, Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import LineField from './LineField';
import { API_BASE_URL } from '../../apiConfig';

const SUBJECTS = [
  { label: 'Dúvida institucional', value: 'institucional' },
  { label: 'Parcerias de pesquisa', value: 'parceria' },
  { label: 'Trabalhe conosco', value: 'rh' },
];

const EMPTY = { name: '', email: '', phone: '', subject: 'institucional', message: '' };

const maskPhone = (value) => {
  if (!value) return '';
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  if (v.length > 0) return v.replace(/(\d*)/, '($1');
  return v;
};

const validate = (d) => {
  const e = {};
  if (!d.name.trim()) e.name = 'Informe seu nome.';
  else if (d.name.trim().length < 3) e.name = 'Digite o nome completo.';
  if (!d.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Confira o e-mail, parece incompleto.';
  const digits = d.phone.replace(/\D/g, '');
  if (!digits) e.phone = 'Informe um telefone para retorno.';
  else if (digits.length < 10) e.phone = 'Telefone com DDD, por favor.';
  if (!d.message.trim()) e.message = 'Escreva sua mensagem.';
  return e;
};

// Formulário da página de contato: mesmos campos e mesmo envio para
// sif-api/leads.php de antes, agora com validação campo a campo e botão
// com estados (enviando / enviado).
export default function ContactForm({ tag, titleLine1, titleLine2 }) {
  const [data, setData] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  const errors = validate(data);
  const show = (k) => (touched[k] || submitted) ? errors[k] : undefined;

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'phone') value = maskPhone(value);
    setData(d => ({ ...d, [name]: value }));
    if (status === 'error') setStatus(null);
  };
  const handleBlur = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const first = e.currentTarget.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      first?.focus();
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/leads.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setData(EMPTY);
        setTouched({});
        setSubmitted(false);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-9 sm:px-10 md:px-14 md:py-11 xl:px-16">
      <header className="mb-6 md:mb-8 max-w-xl">
        {tag && <span className="sif-eyebrow mb-4">{tag}</span>}
        <h2 className="sif-title sif-h2 text-sif-ink tracking-tight">
          {titleLine1}{titleLine2 && <><br /><span className="text-sif-green">{titleLine2}</span></>}
        </h2>
      </header>

      {status === 'success' ? (
        <div role="status" className="py-6 md:py-10">
          <div className="w-16 h-16 rounded-full bg-sif-green text-white flex items-center justify-center mb-8">
            <Check size={30} strokeWidth={2.5} />
          </div>
          <p className="sif-h3 sif-title text-sif-ink mb-3">Mensagem enviada.</p>
          <p className="text-gray-500 leading-relaxed max-w-md mb-10">
            Obrigado pelo contato. Sua mensagem foi entregue à nossa secretaria técnica.
          </p>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="group inline-flex items-center gap-2 text-sm font-bold text-sif-green"
          >
            <RotateCcw size={15} className="transition-transform duration-500 group-hover:-rotate-180" />
            <span className="border-b border-sif-green/30 group-hover:border-sif-green transition-colors">Enviar outra mensagem</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            <LineField label="Nome completo" name="name" maxLength={100} autoComplete="name" value={data.name} onChange={handleChange} onBlur={handleBlur} required error={show("name")} />
            <LineField label="E-mail" name="email" maxLength={100} type="email" autoComplete="email" value={data.email} onChange={handleChange} onBlur={handleBlur} required error={show("email")} />
            <LineField label="Telefone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={15} value={data.phone} onChange={handleChange} onBlur={handleBlur} required error={show("phone")} />
            <LineField label="Assunto" name="subject" value={data.subject} onChange={handleChange} options={SUBJECTS} />
            <LineField className="md:col-span-2" multiline label="Como podemos ajudar?" name="message" maxLength={5000} value={data.message} onChange={handleChange} onBlur={handleBlur} required error={show("message")} />
          </div>

          {status === 'error' && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 px-5 py-4 text-red-700">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <strong className="block font-bold">Não foi possível enviar agora.</strong>
                Tente novamente em instantes ou fale conosco pelo telefone ou <span className="whitespace-nowrap">e-mail</span> desta página.
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-gray-400"><span className="text-sif-green">*</span> Campos obrigatórios</p>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="group relative inline-flex self-start sm:self-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-sif-dark pl-8 pr-2 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-500 hover:bg-sif-green disabled:cursor-wait active:scale-[0.98]"
            >
              <span className="py-2">{loading ? 'Enviando' : status === 'error' ? 'Tentar novamente' : 'Enviar mensagem'}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:bg-white group-hover:text-sif-green">
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-rotate-45" />}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
