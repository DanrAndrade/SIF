import { useState, useCallback, useEffect } from 'react';
import { useConfirm, ItemActions, moveItem } from './kit';
import { SECTION_TYPES, createSection, normalizeSections } from '../sections/sectionTypes';
import { TitleField, TitleExtraControls } from './sections/TitleStyleFields';
import LogosEditor from './sections/LogosEditor';
import { Upload, X, Type, Layers, FileText, Loader2, Users } from 'lucide-react';
import QuillEditor from './QuillEditor';
import TabManager from './TabManager';
import { API_BASE_URL } from '../../apiConfig';

const PDF_UPLOAD_URL = `${API_BASE_URL}/upload_pdf.php`;

function PdfManager({ pdfs = [], onChange, onUploadingChange }) {
  const confirm = useConfirm();
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
  const remove = async (i) => {
    if (!(await confirm({ title: 'Remover este PDF?', message: pdfs[i]?.title || '', confirmLabel: 'Remover' }))) return;
    onChange(pdfs.filter((_, idx) => idx !== i));
  };

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
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Loader2 size={16} className="text-emerald-600 animate-spin flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
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

const TYPE_LABEL = { editor: '✏️ Texto', tabs: '📑 Abas', pdfs: '📎 PDFs', logos: '🏷️ Carrossel de logos' };

function SectionBlock({ section, index, total, onMove, onRemove, onUpdate, onUploadingChange }) {
  const hidden = section.visible === false;
  const setField = (k, v) => onUpdate({ [k]: v });

  return (
    <div className={`border rounded-2xl bg-white shadow-sm overflow-hidden ${hidden ? 'border-dashed border-gray-300' : 'border-gray-200'}`}>
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-200 ${hidden ? 'bg-gray-100' : 'bg-gray-50'}`}>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-shrink-0">{TYPE_LABEL[section.type] || section.type}</span>
        {section.type === 'logos' ? (
          <TitleField sec={section} onUpdate={setField} placeholder="Título (ex: Patrocinadores, Apoio...)" defaultSize="md" defaultAlign="center" />
        ) : (
          <input
            className="flex-1 min-w-0 font-bold text-sm text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-gray-300 placeholder-gray-300 px-1"
            placeholder="Título da seção (opcional)..."
            value={section.title || ''}
            onChange={e => onUpdate({ title: e.target.value })}
          />
        )}
        {hidden && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">Oculta</span>}
        <ItemActions
          size={14}
          onMove={onMove}
          isFirst={index === 0}
          isLast={index === total - 1}
          visible={!hidden}
          onToggleVisible={() => onUpdate({ visible: hidden })}
          onDelete={onRemove}
        />
      </div>
      <div className={`p-4 ${hidden ? 'opacity-60' : ''}`}>
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
        {section.type === 'logos' && (
          <div className="space-y-3">
            <TitleExtraControls sec={section} onUpdate={setField} defaultSize="md" defaultAlign="center" />
            <LogosEditor images={section.images || []} onChange={images => onUpdate({ images })} />
          </div>
        )}
      </div>
    </div>
  );
}

// Botões "adicionar" — tipos e conteúdo inicial vêm de components/sections/sectionTypes.js
const ADD_BUTTONS = [
  { type: 'editor', Icon: Type },
  { type: 'tabs',   Icon: Layers },
  { type: 'pdfs',   Icon: FileText },
  { type: 'logos',  Icon: Users },
];

export default function ContentSections({ sections = [], onChange, onUploading }) {
  const confirm = useConfirm();
  const [uploadCount, setUploadCount] = useState(0);

  const handleUploadingChange = useCallback((isUploading) => {
    setUploadCount(c => isUploading ? c + 1 : Math.max(0, c - 1));
  }, []);

  useEffect(() => {
    onUploading?.(uploadCount > 0);
  }, [uploadCount, onUploading]);

  // Sempre no formato atual (ids estáveis; aceita formatos antigos)
  const list = normalizeSections(sections);

  const addSection = (type) => onChange([...list, createSection(type)]);
  const move     = (i, dir) => onChange(moveItem(list, i, dir));
  const remove   = async (i) => {
    if (!(await confirm({ title: 'Remover esta seção?', message: 'O conteúdo dela sai da página ao salvar.', confirmLabel: 'Remover' }))) return;
    onChange(list.filter((_, idx) => idx !== i));
  };
  const update   = (i, updates) => { const s = [...list]; s[i] = { ...s[i], ...updates }; onChange(s); };

  const isUploading = uploadCount > 0;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">Seções de Conteúdo</h3>
        <p className="text-xs text-gray-400 mt-1">Adicione blocos de conteúdo, mude a ordem com as setas ↑↓ e use o olho para ocultar uma seção sem apagá-la.</p>
      </div>

      {isUploading && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <Loader2 size={18} className="text-emerald-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Upload em andamento</p>
            <p className="text-xs text-emerald-600">Aguarde o envio terminar antes de salvar o formulário.</p>
          </div>
        </div>
      )}

      {list.length === 0 && (
        <p className="text-gray-400 text-sm italic text-center py-6">
          Nenhuma seção. Clique abaixo para adicionar conteúdo.
        </p>
      )}

      <div className="space-y-4">
        {list.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            index={i}
            total={list.length}
            onMove={(dir) => move(i, dir)}
            onRemove={() => remove(i)}
            onUpdate={(updates) => update(i, updates)}
            onUploadingChange={handleUploadingChange}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        {ADD_BUTTONS.map(({ type, Icon }) => (
          <button key={type} type="button" onClick={() => addSection(type)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#007a3d] hover:text-white transition-colors border border-gray-200 hover:border-[#007a3d]">
            <Icon size={14}/> + {SECTION_TYPES[type].label}
          </button>
        ))}
      </div>
    </div>
  );
}
