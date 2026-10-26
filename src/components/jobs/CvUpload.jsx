import React, { useId, useRef, useState } from 'react';
import { AlertCircle, FileText, UploadCloud, X } from 'lucide-react';
import { formatSize } from './jobFormat';

const MAX = 10 * 1024 * 1024;
const OK_EXT = /\.(pdf|docx?|DOCX?|PDF)$/;

// Envio do currículo: área de soltar arquivo (ou clicar para escolher),
// mostra nome e tamanho do arquivo escolhido e permite trocar/remover.
// Aceita PDF, DOC e DOCX até 10 MB.
export default function CvUpload({ file, onChange, error }) {
  const id = useId();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [localError, setLocalError] = useState('');
  const shownError = localError || error;

  const pick = (f) => {
    if (!f) return;
    if (!OK_EXT.test(f.name)) { setLocalError('Envie o currículo em PDF, DOC ou DOCX.'); return; }
    if (f.size > MAX) { setLocalError('Arquivo muito grande (máx. 10 MB). Reduza o currículo antes de enviar.'); return; }
    setLocalError('');
    onChange(f);
  };

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="pt-6">
      <span className="block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
        Currículo<span aria-hidden="true" className="text-sif-green"> *</span>
      </span>

      {file ? (
        <div className="flex items-center gap-4 rounded-2xl border border-sif-green/30 bg-sif-green/[0.04] px-5 py-4">
          <FileText size={26} strokeWidth={1.5} className="shrink-0 text-sif-green" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-sif-ink">{file.name}</p>
            <p className="text-[12px] text-gray-500">{formatSize(file.size)} · pronto para enviar</p>
          </div>
          <label htmlFor={id} className="hidden sm:inline cursor-pointer text-[12px] font-bold uppercase tracking-[0.14em] text-sif-green border-b border-sif-green/30 hover:border-sif-green">
            Trocar
          </label>
          <button type="button" onClick={clear} aria-label="Remover arquivo" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sif-ink/50 transition-colors hover:bg-sif-ink/5 hover:text-sif-ink">
            <X size={17} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
          className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-9 text-center transition-all duration-300
            ${drag ? 'border-sif-green bg-sif-green/[0.06]' : shownError ? 'border-red-300' : 'border-sif-ink/20 hover:border-sif-green hover:bg-sif-green/[0.03]'}`}
        >
          <UploadCloud size={30} strokeWidth={1.4} aria-hidden="true" className={`transition-all duration-500 ${drag ? 'text-sif-green -translate-y-1' : 'text-sif-ink/40 group-hover:text-sif-green group-hover:-translate-y-1'}`} />
          <span className="text-[15px] text-sif-ink">
            <strong className="font-semibold text-sif-green">Escolha um arquivo</strong> ou arraste aqui
          </span>
          <span className="text-[12px] text-gray-400">PDF, DOC ou DOCX, até 10 MB</span>
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        name="cv"
        type="file"
        accept=".pdf,.doc,.docx"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div className="min-h-[22px] pt-2">
        {shownError && (
          <p role="alert" className="flex items-center gap-1.5 text-[13px] font-medium text-red-600">
            <AlertCircle size={14} className="shrink-0" /> {shownError}
          </p>
        )}
      </div>
    </div>
  );
}
