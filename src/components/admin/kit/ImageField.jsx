import React, { useEffect, useMemo, useRef } from 'react';
import { UploadCloud, X, RefreshCw } from 'lucide-react';
import { getImageUrl } from '../../../apiConfig';

const MAX_MB = 10;

// Campo de imagem padrão do painel: prévia, trocar e REMOVER.
//   value     → caminho/URL salvo (string) ou ''
//   file      → File escolhido e ainda não enviado (ou null)
//   onFile(f) → nova imagem escolhida
//   onRemove  → remover (quem chama decide como persistir; se omitido, sem botão)
//   aspect    → classe de altura/proporção (padrão h-48)
export default function ImageField({ label, hint, value, file, onFile, onRemove, aspect = 'h-48', fit = 'cover' }) {
  const inputRef = useRef(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const src = preview || (value ? getImageUrl(value) : '');

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      window.showToast?.(`Imagem muito grande. Máximo ${MAX_MB} MB.`, 'error');
      return;
    }
    onFile?.(f);
  };

  return (
    <div>
      {label && <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</label>}
      <div className={`relative w-full ${aspect} bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden group`}>
        {src ? (
          <>
            <img src={src} alt={label || 'Imagem'} className={`w-full h-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-100">
                <RefreshCw size={14} /> Trocar
              </button>
              {onRemove && (
                <button type="button" onClick={onRemove}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-red-700">
                  <X size={14} /> Remover
                </button>
              )}
            </div>
            {file && (
              <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/90 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Nova — salve para publicar
              </span>
            )}
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-[#007a3d] hover:bg-emerald-50/40 transition-colors">
            <UploadCloud size={28} />
            <span className="mt-2 text-xs font-bold">Clique para enviar imagem</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      </div>
      {hint && <p className="text-[11px] text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}
