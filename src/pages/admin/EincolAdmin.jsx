import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Plus, Save, FileText, Upload, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/eincol.php`;

// Componente para upload de uma imagem com preview
const ImageUploadField = ({ label, value, fileKey, onFileChange, hint, onRemove }) => {
  const [preview, setPreview] = useState(value ? getImageUrl(value) : null);

  useEffect(() => {
    setPreview(value ? getImageUrl(value) : null);
  }, [value]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileChange(fileKey, file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    if(onRemove) onRemove(fileKey);
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 ml-1">{hint}</p>}
      <div className="relative h-48 bg-gray-50 rounded-[24px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all cursor-pointer">
        {preview ? (
          <>
            <img src={preview} className="w-full h-full object-cover" alt="preview" />
            {onRemove && (
              <button type="button" onClick={handleRemove} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md z-10">
                <Trash2 size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageIcon size={36} />
            <span className="text-[10px] font-black uppercase tracking-widest">Clique para Upload</span>
          </div>
        )}
        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-0" onChange={handleChange} />
      </div>
    </div>
  );
};

// Componente para upload de PDF com campo de título
const PdfUploadField = ({ index, title, url, onTitleChange, onFileChange }) => (
  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">PDF {index}</label>
    <input
      className="w-full p-3 bg-white rounded-xl text-sm font-medium outline-none border focus:border-[#007a3d]"
      placeholder={`Título do PDF ${index}...`}
      value={title}
      onChange={e => onTitleChange(e.target.value)}
    />
    {url
      ? <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
          <FileText size={18} className="text-[#007a3d]" />
          <span className="text-xs font-bold text-gray-600 truncate flex-1">{url.split('/').pop()}</span>
          <button type="button" onClick={() => onFileChange(null)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
        </div>
      : <label className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#007a3d] transition-colors">
          <Upload size={16} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selecionar PDF</span>
          <input type="file" accept=".pdf" className="hidden" onChange={e => onFileChange(e.target.files[0])} />
        </label>
    }
  </div>
);

export default function EincolAdmin() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [files, setFiles] = useState({});
  const [form, setForm] = useState({
    active: 1,
    hero_title: 'EINCOL',
    hero_subtitle: '',
    main_content: '',
    planta_url: '',
    pdf1_title: '', pdf1_url: '',
    pdf2_title: '', pdf2_url: '',
    pdf3_title: '', pdf3_url: '',
    tabs: [],
    sections: [],
    // imagens existentes
    hero_image: '', render_image: '', planta_image: ''
  });

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        active: data.active == 0 ? 0 : 1,
        hero_title: data.hero_title || 'EINCOL',
        hero_subtitle: data.hero_subtitle || '',
        main_content: data.main_content || '',
        planta_url: data.planta_url || '',
        pdf1_title: data.pdf1_title || '', pdf1_url: data.pdf1_url || '',
        pdf2_title: data.pdf2_title || '', pdf2_url: data.pdf2_url || '',
        pdf3_title: data.pdf3_title || '', pdf3_url: data.pdf3_url || '',
        tabs: (data.tabs || []).map((t, i) => ({ ...t, _uid: t._uid || `tab-${Date.now()}-${i}` })),
        sections: (data.sections || []).map((s, i) => ({ ...s, _uid: s._uid || `sec-${Date.now()}-${i}` })),
        hero_image: data.hero_image || '',
        render_image: data.render_image || '',
        planta_image: data.planta_image || '',
      }));
    } catch (err) { console.error('Erro ao carregar EINCOL:', err); }
  };

  const quillInstance = React.useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const fd = new FormData(); fd.append('image', file);
      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && quillInstance.current) {
          const quill = quillInstance.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
          quill.setSelection(range.index + 1);
        }
      } catch (err) { console.error('Upload erro:', err); }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  // Toggle ativar/desativar a página EINCOL inteira.
  // Salva imediatamente no backend (sem precisar clicar "Salvar Configuração").
  const handleToggleActive = async () => {
    const novo = form.active ? 0 : 1;
    if (form.active && !window.confirm('Desativar a página EINCOL? Ela vai sumir do menu e do card na página de Eventos. Você poderá reativar a qualquer momento.')) return;
    try {
      const fd = new FormData();
      fd.append('active', String(novo));
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, active: novo }));
      } else {
        window.showToast('Erro ao alterar visibilidade.');
      }
    } catch {
      window.showToast('Erro de conexão ao alterar visibilidade.');
    }
  };

  // Tabs
  const addTab = () => setForm(f => ({ ...f, tabs: [...f.tabs, { _uid: `tab-${Date.now()}-${Math.random()}`, title: 'Nova Aba', content: '' }] }));
  const removeTab = (i) => setForm(f => ({ ...f, tabs: f.tabs.filter((_, idx) => idx !== i) }));
  const updateTab = (i, field, val) => setForm(f => {
    const tabs = [...f.tabs];
    tabs[i] = { ...tabs[i], [field]: val };
    return { ...f, tabs };
  });

  // Sections
  const addSection = () => setForm(f => ({ ...f, sections: [...f.sections, { _uid: `sec-${Date.now()}-${Math.random()}`, title: '', text: '' }] }));
  const removeSection = (i) => setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  const updateSection = (i, field, val) => setForm(f => {
    const sections = [...f.sections];
    sections[i] = { ...sections[i], [field]: val };
    return { ...f, sections };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();

    // Campos de texto
    fd.append('active', form.active ? '1' : '0');
    fd.append('hero_title', form.hero_title);
    fd.append('hero_subtitle', form.hero_subtitle);
    fd.append('main_content', form.main_content);
    fd.append('planta_url', form.planta_url);
    fd.append('pdf1_title', form.pdf1_title);
    fd.append('pdf2_title', form.pdf2_title);
    fd.append('pdf3_title', form.pdf3_title);
    fd.append('tabs_json', JSON.stringify(form.tabs));
    fd.append('sections_json', JSON.stringify(form.sections));

    // Arquivos de imagem
    if (files.hero_image)   fd.append('hero_image',   files.hero_image);
    else if (form.hero_image === '') fd.append('hero_image', '');

    if (files.render_image) fd.append('render_image', files.render_image);
    else if (form.render_image === '') fd.append('render_image', '');

    if (files.planta_image) fd.append('planta_image', files.planta_image);
    else if (form.planta_image === '') fd.append('planta_image', '');
    if (files.pdf1_file)    fd.append('pdf1_file',    files.pdf1_file);
    if (files.pdf2_file)    fd.append('pdf2_file',    files.pdf2_file);
    if (files.pdf3_file)    fd.append('pdf3_file',    files.pdf3_file);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchConfig();
      } else { window.showToast('Erro ao salvar.'); }
    } catch (err) {
      window.showToast('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página EINCOL</h2>
          <p className="text-gray-500 text-sm mt-1">Configure todas as seções do evento especial EINCOL</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
              ✓ Salvo com sucesso!
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleActive}
            title={form.active ? 'Página publicada — clique para desativar' : 'Página desativada — clique para reativar'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm border ${
              form.active
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-500 hover:text-white hover:border-gray-500'
            }`}
          >
            {form.active ? <Eye size={14}/> : <EyeOff size={14}/>}
            {form.active ? 'Publicada' : 'Desativada'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEÇÃO 1: HERO */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4">
            🖼️ Hero da Página
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              label="Imagem do Hero (ocupa todo o espaço)"
              fileKey="hero_image"
              value={form.hero_image}
              onFileChange={handleFileChange}
              onRemove={(key) => { setForm(f => ({...f, [key]: ''})); setFiles(p => { const n={...p}; delete n[key]; return n; }) }}
              hint="Recomendado: imagem quadrada ou paisagem em alta resolução"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Evento</label>
                <input className="w-full p-4 bg-gray-50 rounded-xl font-black text-2xl outline-none border focus:border-[#007a3d]"
                  placeholder="EINCOL 2025"
                  value={form.hero_title}
                  onChange={e => setForm({ ...form, hero_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subtítulo / Chamada</label>
                <textarea className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d] resize-none"
                  rows={4}
                  placeholder="Ex: Encontro Internacional de Ciência Florestal..."
                  value={form.hero_subtitle}
                  onChange={e => setForm({ ...form, hero_subtitle: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: CONTEÚDO PRINCIPAL */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4">
            📝 Conteúdo Principal
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <ReactQuill
              ref={quillInstance}
              theme="snow"
              modules={modules}
              value={form.main_content}
              onChange={val => setForm(prev => ({ ...prev, main_content: val }))}
              className="h-96"
            />
          </div>
        </div>

        {/* SEÇÃO 3: RENDER DO EVENTO */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4 mb-6">
            🏛️ Render / Foto do Evento
          </h3>
          <ImageUploadField
            label="Imagem da Render ou Foto do Evento"
            fileKey="render_image"
            value={form.render_image}
            onFileChange={handleFileChange}
            onRemove={(key) => { setForm(f => ({...f, [key]: ''})); setFiles(p => { const n={...p}; delete n[key]; return n; }) }}
            hint="Será exibida em destaque na seção de apresentação visual do evento"
          />
        </div>

        {/* SEÇÃO 4: PLANTA BAIXA */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4">
            📐 Planta do Evento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              label="Imagem da Planta Baixa"
              fileKey="planta_image"
              value={form.planta_image}
              onFileChange={handleFileChange}
              onRemove={(key) => { setForm(f => ({...f, [key]: ''})); setFiles(p => { const n={...p}; delete n[key]; return n; }) }}
              hint="Foto ou render da planta baixa para exibir na página"
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">URL para Download da Planta (PDF)</label>
              <input
                className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d]"
                placeholder="https://... ou link do arquivo"
                value={form.planta_url}
                onChange={e => setForm({ ...form, planta_url: e.target.value })}
              />
              <p className="text-xs text-gray-400 ml-1">Deixe em branco para ocultar o botão de download</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: PDFs PARA DOWNLOAD */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4">
            📂 PDFs para Download (até 3)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <PdfUploadField
                key={i}
                index={i}
                title={form[`pdf${i}_title`]}
                url={form[`pdf${i}_url`] || (files[`pdf${i}_file`] ? files[`pdf${i}_file`].name : '')}
                onTitleChange={val => setForm({ ...form, [`pdf${i}_title`]: val })}
                onFileChange={file => {
                  if (file) {
                    handleFileChange(`pdf${i}_file`, file);
                  } else {
                    setForm(f => ({ ...f, [`pdf${i}_url`]: '' }));
                    setFiles(p => { const n = {...p}; delete n[`pdf${i}_file`]; return n; });
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* SEÇÃO 6: ABAS DE PROGRAMAÇÃO */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">📅 Abas de Programação</h3>
            <button type="button" onClick={addTab}
              className="flex items-center gap-2 px-4 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors">
              <Plus size={14} /> Adicionar Aba
            </button>
          </div>
          {form.tabs.length === 0 && (
            <p className="text-gray-400 text-sm italic text-center py-6">Nenhuma aba adicionada. Clique em "Adicionar Aba" para criar a programação do evento.</p>
          )}
          {form.tabs.map((tab, i) => (
            <QuillTab
              key={tab._uid || i}
              index={i}
              tab={tab}
              onUpdate={(field, val) => updateTab(i, field, val)}
              onRemove={() => removeTab(i)}
            />
          ))}
        </div>

        {/* SEÇÃO 7: SEÇÕES CONFIGURÁVEIS */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">✏️ Seções Adicionais</h3>
            <button type="button" onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              <Plus size={14} /> Adicionar Seção
            </button>
          </div>
          <p className="text-xs text-gray-400">Use para adicionar informações extras como patrocinadores, localização, hospedagem, etc.</p>
          {form.sections.length === 0 && (
            <p className="text-gray-400 text-sm italic text-center py-6">Nenhuma seção adicional. Clique em "Adicionar Seção" para criar.</p>
          )}
          {form.sections.map((sec, i) => (
            <QuillSection
              key={sec._uid || i}
              index={i}
              sec={sec}
              onUpdate={(field, val) => updateSection(i, field, val)}
              onRemove={() => removeSection(i)}
            />
          ))}
        </div>

        <Button type="submit" variant="primary" icon={Save} className="w-full rounded-2xl font-black uppercase tracking-widest" isLoading={loading}>
          Salvar Configuração EINCOL
        </Button>
      </form>
    </div>
  );
}

// --- SUB-COMPONENTES ISOLADOS PARA QUILL (cada um tem seu próprio ref) ---

function QuillTab({ tab, index, onUpdate, onRemove }) {
  const ref = React.useRef(null);
  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.click();
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      const fd = new FormData(); fd.append('image', file);
      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && ref.current) {
          const quill = ref.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
          quill.setSelection(range.index + 1);
        }
      } catch (err) { console.error('Upload erro tab:', err); }
    };
  }, []);
  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">Aba {index + 1}</span>
        <input
          className="flex-1 p-3 bg-white rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]"
          placeholder="Título da aba (ex: Dia 1 – 12/08)"
          value={tab.title}
          onChange={e => onUpdate('title', e.target.value)}
        />
        <button type="button" onClick={onRemove} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ReactQuill ref={ref} theme="snow" modules={modules} value={tab.content} onChange={val => onUpdate('content', val)} className="h-64" />
      </div>
    </div>
  );
}

function QuillSection({ sec, index, onUpdate, onRemove }) {
  const ref = React.useRef(null);
  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.click();
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      const fd = new FormData(); fd.append('image', file);
      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && ref.current) {
          const quill = ref.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
          quill.setSelection(range.index + 1);
        }
      } catch (err) { console.error('Upload erro section:', err); }
    };
  }, []);
  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">Seção {index + 1}</span>
        <input
          className="flex-1 p-3 bg-white rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]"
          placeholder="Título da seção..."
          value={sec.title}
          onChange={e => onUpdate('title', e.target.value)}
        />
        <button type="button" onClick={onRemove} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ReactQuill ref={ref} theme="snow" modules={modules} value={sec.text} onChange={val => onUpdate('text', val)} className="h-64" />
      </div>
    </div>
  );
}
