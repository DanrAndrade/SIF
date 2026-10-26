import { useState, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { ItemActions, moveItem, useConfirm } from '../kit';
import { useLatest } from './uploadTracker';
import { apiRequest, toastError } from '../../../utils/adminApi';
import { API_BASE_URL } from '../../../apiConfig';
import { FILE_ACCEPT, FILE_MAX_MB, fileExt, fileIcon, fileMetaLabel, fileUrl } from '../../sections/fileMeta';

// Editor do bloco "Arquivos e documentos" (tipo 'pdfs').
// Envia na hora para upload_file.php; o nome que aparece no site é editável.
export default function FilesEditor({ files = [], onChange, onUploadingChange }) {
  const confirm = useConfirm();
  const latest = useLatest(files);
  const [sending, setSending] = useState(0);

  const track = useCallback((delta) => {
    setSending(n => {
      const next = Math.max(0, n + delta);
      onUploadingChange?.(next > 0);
      return next;
    });
  }, [onUploadingChange]);

  const sendOne = async (file) => {
    if (file.size > FILE_MAX_MB * 1024 * 1024) {
      window.showToast?.(`"${file.name}" passa de ${FILE_MAX_MB} MB.`, 'error');
      return;
    }
    track(1);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const d = await apiRequest(`${API_BASE_URL}/upload_file.php`, { method: 'POST', body: fd });
      const item = { url: d.url, title: d.name || file.name.replace(/\.[^.]+$/, ''), ext: d.ext, size: d.size };
      onChange([...(latest.current || []), item]);
    } catch (err) { toastError(err); }
    finally { track(-1); }
  };

  const onPick = (list) => { Array.from(list || []).forEach(sendOne); };
  const update = (i, patch) => onChange(files.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const remove = async (i) => {
    const target = files[i];
    if (!(await confirm({ title: 'Remover este arquivo?', message: target?.title || '', confirmLabel: 'Remover' }))) return;
    onChange((latest.current || []).filter(f => f !== target));
  };

  return (
    <div className="space-y-2">
      {files.map((f, i) => {
        const Icon = fileIcon(fileExt(f));
        return (
          <div key={fileUrl(f) || i} className="flex items-center gap-3 p-2.5 pl-3 bg-gray-50 rounded-xl border border-gray-200">
            <Icon size={18} className="text-[#007a3d] shrink-0" aria-hidden="true" />
            <input
              className="flex-1 min-w-0 bg-transparent text-sm font-semibold outline-none text-gray-700 placeholder-gray-400"
              placeholder="Nome que aparece no site"
              aria-label="Nome do arquivo no site"
              value={f.title || ''}
              onChange={e => update(i, { title: e.target.value })}
            />
            <span className="text-[11px] text-gray-400 shrink-0 hidden sm:block">{fileMetaLabel(f)}</span>
            <ItemActions size={14} onMove={(dir) => onChange(moveItem(files, i, dir))} isFirst={i === 0} isLast={i === files.length - 1} onDelete={() => remove(i)} />
          </div>
        );
      })}

      {sending > 0 && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
          <Loader2 size={16} className="animate-spin shrink-0" />
          Enviando {sending > 1 ? `${sending} arquivos` : 'arquivo'}... aguarde antes de salvar.
        </div>
      )}

      <label className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#007a3d] transition-colors">
        <Upload size={16} className="text-gray-400 shrink-0" />
        <span className="text-sm text-gray-600">
          Adicionar arquivos
          <span className="block text-xs text-gray-400">PDF, Word, Excel, PowerPoint, ODT/ODS, CSV ou imagem. Até {FILE_MAX_MB} MB cada.</span>
        </span>
        <input type="file" multiple accept={FILE_ACCEPT} className="hidden"
          onChange={e => { onPick(e.target.files); e.target.value = ''; }} />
      </label>
    </div>
  );
}
