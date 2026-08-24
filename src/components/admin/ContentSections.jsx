import { useState, useCallback, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2, Upload, X, Type, Layers, FileText, Loader2 } from 'lucide-react';
import QuillEditor from './QuillEditor';
import TabManager from './TabManager';
import { API_BASE_URL } from '../../apiConfig';

const PDF_UPLOAD_URL = `${API_BASE_URL}/upload_pdf.php`;

function PdfManager({ pdfs = [], onChange, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);

  const setUploadState = useCallback((val) => {
    setUploading(val);
    onUploadingChange?.(val);
  }, [onUploadingChange]);

  const handleUpload = async (file) => {
    setUploadState(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(PDF_UPLOAD_URL, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        onChange([...pdfs, { url: data.url, title: file.name.replace(/\.pdf$/i, '') }]);
      } else {
        window.showToast('Erro ao enviar PDF: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (err) {
      window.showToast('Erro ao enviar PDF: ' + err.message);
    } finally {
      setUploadState(false);
    }
  };

  const update = (i, field, val) => {
    const p = [...pdfs];
    p[i] = { ...p[i], [field]: val };
    onChange(p);
  };
  const remove = (i) => onChange(pdfs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {pdfs.map((pdf, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <FileText size={18} className="text-[#007a3d] flex-shrink-0" />
          <input
            className="flex-1 bg-transparent font-bold text-sm outline-none text-gray-700 placeholder-gray-400"
            placeholder="Título do PDF..."
            value={pdf.title || ''}
            onChange={e => update(i, 'title', e.target.value)}
          />
          <span className="text-[10px] text-gray-400 truncate max-w-[120px] hidden sm:block">
            {pdf.url?.split('/').pop()}
          </span>
          <button type="button" onClick={() => remove(i)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
            <X size={14}/>
          </button>
        </div>
      ))}

      {uploading && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <Loader2 size={16} className="text-amber-600 animate-spin flex-shrink-0" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Enviando PDF... aguarde antes de salvar
          </span>
        </div>
      )}

      <label className={`flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-dashed transition-colors ${uploading ? 'border-gray-200 cursor-not-allowed opacity-40 pointer-events-none' : 'border-gray-200 cursor-pointer hover:border-[#007a3d]'}`}>
        <Upload size={16} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Adicionar PDF (máx. 20 MB)
        </span>
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={e => { if (e.target.files[0]) { handleUpload(e.target.files[0]); e.target.value = ''; } }}
        />
      </label>
    </div>
  );
}

function SectionBlock({ section, index, total, onMoveUp, onMoveDown, onRemove, onUpdate, onUploadingChange }) {
  const typeLabel = section.type === 'editor' ? '✏️ Texto' : section.type === 'tabs' ? '📑 Abas' : '📎 PDFs';

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button type="button" onClick={onMoveUp} disabled={index === 0}
              className="p-1 text-gray-400 hover:text-[#007a3d] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
              <ChevronUp size={14}/>
            </button>
            <button type="button" onClick={onMoveDown} disabled={index === total - 1}
              className="p-1 text-gray-400 hover:text-[#007a3d] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
              <ChevronDown size={14}/>
            </button>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-shrink-0">{typeLabel}</span>
          <input
            className="flex-1 min-w-0 font-bold text-sm text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-gray-300 placeholder-gray-300 px-1"
            placeholder="Título da seção (opcional)..."
            value={section.title || ''}
            onChange={e => onUpdate({ title: e.target.value })}
          />
        </div>
        <button type="button" onClick={onRemove}
          className="ml-3 p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex-shrink-0">
          <Trash2 size={14}/>
        </button>
      </div>
      <div className="p-4">
        {section.type === 'editor' && (
          <QuillEditor
            value={section.content || ''}
            onChange={val => onUpdate({ content: val })}
            height="h-[420px]"
          />
        )}
        {section.type === 'tabs' && (
          <TabManager
            tabs={section.tabs || []}
            onChange={tabs => onUpdate({ tabs })}
            title=""
            itemLabel="Aba"
          />
        )}
        {section.type === 'pdfs' && (
          <PdfManager
            pdfs={section.pdfs || []}
            onChange={pdfs => onUpdate({ pdfs })}
            onUploadingChange={onUploadingChange}
          />
        )}
      </div>
    </div>
  );
}

const SECTION_TYPES = [
  { type: 'editor', label: 'Texto Rico', Icon: Type },
  { type: 'tabs',   label: 'Abas',       Icon: Layers },
  { type: 'pdfs',   label: 'PDFs',       Icon: FileText },
];

export default function ContentSections({ sections = [], onChange, onUploading }) {
  const [uploadCount, setUploadCount] = useState(0);

  const handleUploadingChange = useCallback((isUploading) => {
    setUploadCount(c => isUploading ? c + 1 : Math.max(0, c - 1));
  }, []);

  useEffect(() => {
    onUploading?.(uploadCount > 0);
  }, [uploadCount, onUploading]);

  const addSection = (type) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const s = { id, type, title: '' };
    if (type === 'editor') s.content = '';
    if (type === 'tabs')   s.tabs   = [];
    if (type === 'pdfs')   s.pdfs   = [];
    onChange([...sections, s]);
  };

  const moveUp   = (i) => { if (i === 0) return; const s = [...sections]; [s[i - 1], s[i]] = [s[i], s[i - 1]]; onChange(s); };
  const moveDown = (i) => { if (i === sections.length - 1) return; const s = [...sections]; [s[i], s[i + 1]] = [s[i + 1], s[i]]; onChange(s); };
  const remove   = (i) => onChange(sections.filter((_, idx) => idx !== i));
  const update   = (i, updates) => { const s = [...sections]; s[i] = { ...s[i], ...updates }; onChange(s); };

  const isUploading = uploadCount > 0;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">Seções de Conteúdo</h3>
        <p className="text-xs text-gray-400 mt-1">Adicione e reordene blocos de conteúdo da página usando as setas ↑↓</p>
      </div>

      {isUploading && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Loader2 size={18} className="text-amber-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">Upload em andamento</p>
            <p className="text-xs text-amber-600">Aguarde o envio terminar antes de salvar o formulário.</p>
          </div>
        </div>
      )}

      {sections.length === 0 && (
        <p className="text-gray-400 text-sm italic text-center py-6">
          Nenhuma seção. Clique abaixo para adicionar conteúdo.
        </p>
      )}

      <div className="space-y-4">
        {sections.map((section, i) => (
          <SectionBlock
            key={section.id || i}
            section={section}
            index={i}
            total={sections.length}
            onMoveUp={() => moveUp(i)}
            onMoveDown={() => moveDown(i)}
            onRemove={() => remove(i)}
            onUpdate={(updates) => update(i, updates)}
            onUploadingChange={handleUploadingChange}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        {SECTION_TYPES.map(({ type, label, Icon }) => (
          <button key={type} type="button" onClick={() => addSection(type)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#007a3d] hover:text-white transition-colors border border-gray-200 hover:border-[#007a3d]">
            <Icon size={14}/> + {label}
          </button>
        ))}
      </div>
    </div>
  );
}
