import { useState, useCallback, useEffect, useRef } from 'react';
import { useConfirm, ItemActions, moveItem } from './kit';
import { SECTION_TYPES, BAND_STYLES, createSection, normalizeSections, PAGE_TEMPLATES, createTemplate, typesFor } from '../sections/sectionTypes';
import { TextImageEditor, CardsEditor, StatsEditor, PeopleEditor, GalleryEditor, VideoEditor, QuoteEditor, CtaEditor, SpecialNote } from './sections/BlockEditors';
import { Type, Image as ImageIcon, LayoutGrid, BarChart3, Users, GalleryHorizontal as Images, PlayCircle, Quote, Megaphone, Layers, FileText as FileTextIcon, Building2, Info, Newspaper, UserCircle2 as UserRound, Square } from 'lucide-react';
const Icons = { Type, ImageIcon, LayoutGrid, BarChart3, Users, Images, PlayCircle, Quote, Megaphone, Layers, FileText: FileTextIcon, Building2, Info, Newspaper, UserRound, Square };
import { TitleField, TitleExtraControls } from './sections/TitleStyleFields';
import LogosEditor from './sections/LogosEditor';
import { Upload, X, FileText, Loader2, Plus } from 'lucide-react';
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

const typeIcon = (type) => Icons[SECTION_TYPES[type]?.icon] || Icons.Square;

function SectionBlock({ section, index, total, onMove, onRemove, onUpdate, onUploadingChange, bands }) {
  const hidden = section.visible === false;
  const setField = (k, v) => onUpdate({ [k]: v });
  const def = SECTION_TYPES[section.type] || { label: section.type };
  const TIcon = typeIcon(section.type);
  const [open, setOpen] = useState(true);

  return (
    <div className={`border rounded-2xl bg-white shadow-sm overflow-hidden ${hidden ? 'border-dashed border-gray-300' : 'border-gray-200'}`}>
      <div className={`flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-200 ${hidden ? 'bg-gray-100' : 'bg-gray-50'}`}>
        <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center gap-2 shrink-0 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#007a3d]" title={open ? 'Recolher' : 'Abrir'}>
          <span className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#007a3d]"><TIcon size={14} /></span>
          {def.label}
        </button>
        <div className="flex-1 min-w-[180px]">
          <TitleField sec={section} onUpdate={setField} placeholder="Título do bloco (opcional)" defaultSize={section.type === 'logos' ? 'md' : 'lg'} defaultAlign={section.type === 'logos' || section.type === 'stats' ? 'center' : 'left'} />
        </div>
        {hidden && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">Oculto</span>}
        <ItemActions size={14} onMove={onMove} isFirst={index === 0} isLast={index === total - 1}
          visible={!hidden} onToggleVisible={() => onUpdate({ visible: hidden })} onDelete={onRemove} />
      </div>
      {open && (
      <div className={`p-4 space-y-4 ${hidden ? 'opacity-60' : ''}`}>
        <div className="flex flex-wrap items-end gap-3">
          {!['cta', 'quote', 'gt_contact'].includes(section.type) && (
            <div className="w-full sm:w-56">
              <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">Etiqueta acima do título</label>
              <input className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm outline-none focus:border-[#007a3d]" value={section.eyebrow || ''} placeholder="opcional" onChange={e => onUpdate({ eyebrow: e.target.value })} />
            </div>
          )}
          {bands && (
            <div className="w-full sm:w-48">
              <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">Fundo da faixa</label>
              <select className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm outline-none focus:border-[#007a3d]" value={section.bg || 'auto'} onChange={e => onUpdate({ bg: e.target.value })}>
                {Object.entries(BAND_STYLES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
          )}
          <div className="flex-1"><TitleExtraControls sec={section} onUpdate={setField} defaultSize={section.type === 'logos' ? 'md' : 'lg'} defaultAlign={section.type === 'logos' || section.type === 'stats' ? 'center' : 'left'} /></div>
        </div>

        {(section.type === 'editor' || section.type === 'gt_intro') && (
          <QuillEditor value={section.content || ''} onChange={val => onUpdate({ content: val })} height="h-[380px]" />
        )}
        {section.type === 'text_image' && <TextImageEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'cards' && <CardsEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'stats' && <StatsEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'people' && <PeopleEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'gallery' && <GalleryEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'video' && <VideoEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'quote' && <QuoteEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'cta' && <CtaEditor sec={section} onUpdate={onUpdate} />}
        {section.type === 'tabs' && (
          <TabManager tabs={section.tabs || []} onChange={tabs => onUpdate({ tabs })} title="" itemLabel="Aba" />
        )}
        {section.type === 'pdfs' && (
          <PdfManager pdfs={section.pdfs || []} onChange={pdfs => onUpdate({ pdfs })} onUploadingChange={onUploadingChange} />
        )}
        {section.type === 'logos' && (
          <LogosEditor images={section.images || []} onChange={images => onUpdate({ images })} />
        )}
        {section.type === 'gt_blog' && (
          <div className="flex flex-wrap items-end gap-4">
            <SpecialNote>Mostra sozinho os últimos posts do blog ligados a este grupo. Some enquanto o grupo não tiver posts.</SpecialNote>
            <label className="text-sm text-gray-600">Quantos posts
              <select className="ml-2 p-2 bg-white rounded-lg border border-gray-200 text-sm" value={section.limit || 3} onChange={e => onUpdate({ limit: Number(e.target.value) })}>
                {[3, 6, 9].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
        )}
        {section.type === 'gt_contact' && (
          <SpecialNote>Mostra o card do responsável (preenchido em “Responsável por este grupo”, acima). Sem responsável preenchido, usa o contato geral de Grupos Temáticos.</SpecialNote>
        )}
      </div>
      )}
    </div>
  );
}

// Botões "adicionar" — tipos e conteúdo inicial vêm de components/sections/sectionTypes.js
// Menu "Adicionar bloco": tipos permitidos para o tipo de página (kind)

// template: tipo de página (PAGE_TEMPLATES) → oferece a estrutura padrão.
// autoTemplate: item novo → já começa com a estrutura padrão.
// bands: mostra a escolha de fundo da faixa (páginas em layout "página", ex.: GT)
export default function ContentSections({ sections = [], onChange, onUploading, template, autoTemplate = false, bands = false, title = 'Seções de Conteúdo' }) {
  const [menuOpen, setMenuOpen] = useState(false);
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
  const hasTemplate = !!(template && PAGE_TEMPLATES[template]);
  const applyTemplate = () => onChange([...list, ...createTemplate(template)]);
  // Item novo: começa com a estrutura padrão (uma vez só)
  const autoDone = useRef(false);
  useEffect(() => {
    if (autoDone.current) return;
    autoDone.current = true;
    if (autoTemplate && hasTemplate && list.length === 0) onChange(createTemplate(template));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        <h3 className="text-lg font-bold text-[#1f2937] tracking-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Monte a página com blocos: adicione, mude a ordem com ↑↓, use o olho para ocultar sem apagar. Clique no nome do bloco para recolher.</p>
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
        <div className="text-center py-6 space-y-3">
          <p className="text-gray-400 text-sm italic">Nenhuma seção. Clique abaixo para adicionar conteúdo.</p>
          {hasTemplate && (
            <button type="button" onClick={applyTemplate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1B5E20] transition-colors">
              Usar a estrutura padrão
            </button>
          )}
        </div>
      )}
      {list.length > 0 && hasTemplate && (
        <p className="text-xs text-gray-400">Blocos deixados vazios não aparecem no site.</p>
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
            bands={bands}
          />
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <button type="button" onClick={() => setMenuOpen(o => !o)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1B5E20] transition-colors">
          <Plus size={16} /> Adicionar bloco
        </button>
        {menuOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {typesFor(template).filter(t => !(t.unique && list.some(s => s.type === t.type))).map(t => {
              const I = Icons[t.icon] || Icons.Square;
              return (
                <button key={t.type} type="button" onClick={() => { addSection(t.type); setMenuOpen(false); }}
                  className="text-left flex gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-[#007a3d] hover:bg-emerald-50/50 transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-emerald-50 text-[#007a3d] flex items-center justify-center shrink-0"><I size={18} /></span>
                  <span><span className="block text-sm font-bold text-gray-800">{t.label}</span><span className="block text-xs text-gray-500 leading-snug">{t.desc}</span></span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
