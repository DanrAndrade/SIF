import React from 'react';

// Campos extras das páginas de Treinamento e Treinamento In-Company
// (formato, local, botão de inscrição e frase do topo). Ficam guardados em
// extra_data, sem precisar de coluna nova no banco.
//
//   <DetailExtraFields value={formData} onChange={(patch) => setFormData(f => ({ ...f, ...patch }))} ctaHint="Quero me inscrever" />

const label = 'text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1';
const input = 'w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d]';
const MODALITIES = ['', 'Online', 'Presencial', 'Híbrido'];

export default function DetailExtraFields({ value, onChange, ctaHint = 'Quero me inscrever', showLocation = true }) {
  const set = (k) => (e) => onChange({ [k]: e.target.value });
  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 ${showLocation ? 'sm:grid-cols-2' : ''} gap-4`}>
        <div className="space-y-2">
          <label className={label}>Formato</label>
          <select className={input} value={value.modality || ''} onChange={set('modality')}>
            {MODALITIES.map(m => <option key={m} value={m}>{m || 'Não mostrar'}</option>)}
          </select>
        </div>
        {showLocation && (
          <div className="space-y-2">
            <label className={label}>Local (opcional)</label>
            <input className={input} placeholder="Ex.: Viçosa - MG" value={value.location || ''} onChange={set('location')} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={label}>Link de inscrição (opcional)</label>
          <input className={input} placeholder="https://..." value={value.cta_url || ''} onChange={set('cta_url')} />
          <p className="text-[9px] text-gray-400 ml-1">Link externo (Sympla, formulário...). Aparece como botão no topo da página, ao lado de "Falar com a equipe".</p>
        </div>
        <div className="space-y-2">
          <label className={label}>Texto do botão</label>
          <input className={input} placeholder={ctaHint} value={value.cta_label || ''} onChange={set('cta_label')} />
        </div>
      </div>
      <div className="space-y-2">
        <label className={label}>Frase de apresentação no topo (opcional)</label>
        <textarea rows={2} maxLength={260} className={`${input} resize-y`} placeholder="Uma ou duas frases que aparecem embaixo do título" value={value.summary || ''} onChange={set('summary')} />
      </div>
    </div>
  );
}

// Lê os campos extras salvos (para abrir o formulário)
export const readDetailExtra = (raw) => {
  let o = {};
  try { o = (typeof raw === 'string' ? JSON.parse(raw || '{}') : raw) || {}; } catch { o = {}; }
  return { modality: o.modality || '', cta_url: o.cta_url || '', cta_label: o.cta_label || '', summary: o.summary || '' };
};

// Monta o extra_data para gravar: mantém chaves que já existiam e grava as do formulário
export const buildDetailExtra = (prevRaw, form) => {
  let prev = {};
  try { prev = (typeof prevRaw === 'string' ? JSON.parse(prevRaw || '{}') : prevRaw) || {}; } catch { prev = {}; }
  return JSON.stringify({
    ...prev,
    sections: form.sections,
    modality: form.modality || '',
    cta_url: String(form.cta_url || '').trim(),
    cta_label: String(form.cta_label || '').trim(),
    summary: String(form.summary || '').trim(),
  });
};
