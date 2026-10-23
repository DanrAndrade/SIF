import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getImageUrl } from '../../../apiConfig';
import { uploadImageNow, toastError } from '../../../utils/adminApi';
import { useUploadTracker, useLatest } from './uploadTracker';
import { useConfirm, moveItem } from '../kit';

// Editor das logos de um carrossel (patrocinadores, apoio, parceiros...).
// As imagens sobem na hora (upload.php); a lista só vale depois de Salvar.
export default function LogosEditor({ images = [], onChange, hint }) {
  const confirm = useConfirm();
  const [uploading, setUploading] = useState(false);
  const list = Array.isArray(images) ? images : [];
  const latest = useLatest(list);
  const track = useUploadTracker();

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      try { const url = await track(uploadImageNow(file)); if (url) urls.push(url); }
      catch (err) { toastError(err); }
    }
    if (urls.length) onChange([...latest.current, ...urls]);
    setUploading(false);
  };

  const remove = async (i) => {
    if (!(await confirm({ title: 'Remover esta logo do carrossel?', confirmLabel: 'Remover' }))) return;
    // lista atual: logos enviadas durante a confirmação não se perdem
    const cur = latest.current;
    const j = cur[i] === list[i] ? i : cur.indexOf(list[i]);
    if (j >= 0) onChange(cur.filter((_, idx) => idx !== j));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {list.map((img, i) => (
          <div key={`${img}-${i}`} className="relative group bg-white rounded-xl border border-gray-200 h-24 flex items-center justify-center overflow-hidden">
            <img src={getImageUrl(typeof img === 'string' ? img : img.url)} alt={`Logo ${i + 1}`} className="max-w-[85%] max-h-[85%] object-contain" />
            <button type="button" onClick={() => remove(i)} aria-label="Remover logo"
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
              <X size={12} />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button type="button" onClick={() => onChange(moveItem(list, i, -1))} disabled={i === 0} aria-label="Mover para a esquerda"
                className="px-1.5 bg-white/90 rounded text-gray-600 text-xs font-bold disabled:opacity-30">‹</button>
              <button type="button" onClick={() => onChange(moveItem(list, i, 1))} disabled={i === list.length - 1} aria-label="Mover para a direita"
                className="px-1.5 bg-white/90 rounded text-gray-600 text-xs font-bold disabled:opacity-30">›</button>
            </div>
          </div>
        ))}
        <label className="h-24 bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#007a3d] transition-colors text-gray-400">
          {uploading ? (
            <span className="text-[10px] font-bold uppercase tracking-widest">Enviando...</span>
          ) : (
            <>
              <Plus size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Adicionar logos</span>
            </>
          )}
          <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
            onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
        </label>
      </div>
      <p className="text-[11px] text-gray-400">{hint || 'As imagens são enviadas na hora; clique em Salvar para publicar o carrossel.'}</p>
    </div>
  );
}
