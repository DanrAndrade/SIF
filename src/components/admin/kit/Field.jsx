import React, { useId } from 'react';

// Campo de texto padrão do painel (antes havia uma cópia em cada tela).
//   <Field label="Título" value={v} onChange={setV} />
//   <Field label="Texto" type="textarea" rows={4} value={v} onChange={setV} hint="..." />
export default function Field({ label, type = 'text', value, onChange, rows = 3, placeholder, hint, className = '' }) {
  const id = useId();
  const cls = 'w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 outline-none transition-colors focus:border-[#007a3d]';
  return (
    <div className={`min-w-0 ${className}`}>
      {label && <label htmlFor={id} className="block text-[13px] font-semibold text-gray-600 mb-1.5">{label}</label>}
      {type === 'textarea'
        ? <textarea id={id} className={`${cls} resize-y`} rows={rows} value={value ?? ''} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} />
        : <input id={id} className={cls} type={type} value={value ?? ''} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} />}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
