import React, { useId, useLayoutEffect, useRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

// Campo de linha inferior com rótulo flutuante: o rótulo fica dentro do
// campo e sobe quando a pessoa clica ou digita. No foco, uma linha verde
// cresce da esquerda para a direita. Com erro, linha e mensagem em vermelho.
// multiline: área de texto que cresce sozinha conforme o texto.
// options: vira uma caixa de seleção (rótulo sempre no alto, seta própria).
const FLOAT = 'top-0 text-[11px] font-bold uppercase tracking-[0.18em]';

export default function LineField({ label, name, error, required, multiline = false, options, hint, className = '', ...props }) {
  const id = useId();
  const errId = `${id}-erro`;
  const ref = useRef(null);
  const isSelect = Array.isArray(options);
  const Tag = isSelect ? 'select' : multiline ? 'textarea' : 'input';

  // Área de texto acompanha o tamanho do conteúdo
  useLayoutEffect(() => {
    if (!multiline || !ref.current) return;
    const el = ref.current;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 132)}px`;
  }, [multiline, props.value]);

  const labelPos = isSelect
    ? `${FLOAT} ${error ? 'text-red-600' : 'text-gray-400 peer-focus:text-sif-green'}`
    : `top-8 text-[15px]
       peer-focus:top-0 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.18em]
       peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em]
       ${error ? 'text-red-600' : 'text-gray-500 peer-focus:text-sif-green peer-[:not(:placeholder-shown)]:text-gray-400'}`;

  return (
    <div className={className}>
      <div className="relative pt-6">
        <Tag
          ref={ref}
          id={id}
          name={name}
          placeholder={isSelect ? undefined : ' '}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : undefined}
          rows={multiline ? 3 : undefined}
          className={`peer block w-full bg-transparent border-0 border-b px-0 pt-2 pb-3 text-[17px] text-sif-ink placeholder-transparent caret-sif-green transition-colors duration-300 focus:outline-none focus:ring-0
            ${multiline ? 'resize-none leading-relaxed overflow-hidden' : ''}
            ${isSelect ? 'appearance-none cursor-pointer pr-10 bg-none' : ''}
            ${error ? 'border-red-400' : 'border-sif-ink/15 hover:border-sif-ink/30'}`}
          {...props}
        >
          {isSelect ? options.map(o => <option key={o.value} value={o.value}>{o.label}</option>) : undefined}
        </Tag>
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-out ${labelPos}`}
        >
          {label}{required && <span aria-hidden="true" className="text-sif-green"> *</span>}
        </label>
        {isSelect && (
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-4 text-sif-ink/40 transition-all duration-300 peer-hover:text-sif-ink peer-focus:text-sif-green peer-focus:translate-y-0.5"
          />
        )}
        <span
          aria-hidden="true"
          className={`absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out peer-focus:scale-x-100 ${error ? 'bg-red-500' : 'bg-sif-green'}`}
        />
      </div>
      <div className="min-h-[22px] pt-2">
        {error ? (
          <p id={errId} role="alert" className="flex items-center gap-1.5 text-[13px] font-medium text-red-600">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </p>
        ) : hint ? (
          <p className="text-[12px] text-gray-400">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
