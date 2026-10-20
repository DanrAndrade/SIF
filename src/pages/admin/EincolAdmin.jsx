import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Plus, Save, FileText, Upload, X, Eye, EyeOff, Users, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import QuillEditor from '../../components/admin/QuillEditor';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { TITLE_SIZES, TITLE_WEIGHTS, resolveTitleStyle } from '../../utils/sectionTitle';

const API_URL = `${API_BASE_URL}/eincol.php`;

// Faz upload de uma imagem avulsa (patrocinadores) e devolve a URL salva.
async function uploadEincolImage(file) {
  if (!file) return null;
  if (file.size > 10 * 1024 * 1024) {
    window.showToast?.('Imagem muito grande. Máximo 10 MB.', 'error');
    return null;
  }
  const fd = new FormData();
  fd.append('image', file);
  try {
    const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) return data.url;
    window.showToast?.(data.message || 'Erro ao enviar imagem.', 'error');
  } catch {
    window.showToast?.('Falha ao conectar ao servidor de upload.', 'error');
  }
  return null;
}

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

  // Troca o item i com o vizinho (dir = -1 sobe, +1 desce) — define a ordem no site
  const moveItem = (list, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };
  const moveTab = (i, dir) => setForm(f => ({ ...f, tabs: moveItem(f.tabs, i, dir) }));

  // Sections (texto e grupos de patrocinadores compartilham o mesmo array)
  const addSection = () => setForm(f => ({ ...f, sections: [...f.sections, { _uid: `sec-${Date.now()}-${Math.random()}`, title: '', text: '' }] }));
  const addSponsorGroup = () => setForm(f => ({ ...f, sections: [...f.sections, { _uid: `spon-${Date.now()}-${Math.random()}`, type: 'sponsors', title: '', images: [] }] }));
  const removeSection = (i) => setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  const updateSection = (i, field, val) => setForm(f => {
    const sections = [...f.sections];
    sections[i] = { ...sections[i], [field]: val };
    return { ...f, sections };
  });
  const moveSection = (i, dir) => setForm(f => ({ ...f, sections: moveItem(f.sections, i, dir) }));

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
    // PDFs: arquivo novo, ou URL vazia quando foi removido no painel
    [1, 2, 3].forEach(i => {
      if (files[`pdf${i}_file`]) fd.append(`pdf${i}_file`, files[`pdf${i}_file`]);
      else if (!form[`pdf${i}_url`]) fd.append(`pdf${i}_url`, '');
    });

    let res;
    try {
      res = await fetch(API_URL, { method: 'POST', body: fd });
    } catch (err) {
      window.showToast('Sem conexão com o servidor. Verifique a internet e tente de novo.');
      setLoading(false);
      return;
    }
    try {
      // Lê como texto: se o servidor devolver HTML (firewall, erro PHP), mostramos o status real
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { /* não é JSON */ }
      if (data?.success) {
        setFiles({}); // arquivos já enviados — não reenviar no próximo salvar
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchConfig();
      } else if (data?.message) {
        window.showToast(data.message);
      } else if (res.status === 406 || res.status === 403) {
        window.showToast(`O servidor bloqueou o envio (erro ${res.status} – firewall da hospedagem).`);
      } else {
        window.showToast(`Erro ao salvar (resposta ${res.status} do servidor).`);
      }
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
          <QuillEditor
            value={form.main_content}
            onChange={val => setForm(prev => ({ ...prev, main_content: val }))}
            height="h-[600px]"
          />
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
              onMove={(dir) => moveTab(i, dir)}
              isFirst={i === 0}
              isLast={i === form.tabs.length - 1}
            />
          ))}
        </div>

        {/* SEÇÃO 7: SEÇÕES CONFIGURÁVEIS + PATROCINADORES */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 gap-3">
            <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">✏️ Seções Adicionais</h3>
            <AddSectionButtons onAddText={addSection} onAddLogos={addSponsorGroup} />
          </div>
          <p className="text-xs text-gray-400">Seções de texto para informações extras (localização, hospedagem...) ou <strong>carrossel de logos</strong> com título (ex: Patrocinadores, Organização e apoio). Para logos, use o carrossel em vez de colar uma imagem no texto.</p>
          {form.sections.length === 0 && (
            <p className="text-gray-400 text-sm italic text-center py-6">Nenhuma seção adicional. Use os botões acima para criar.</p>
          )}
          {form.sections.map((sec, i) => (
            sec.type === 'sponsors'
              ? <SponsorGroupEditor
                  key={sec._uid || i}
                  index={i}
                  group={sec}
                  onUpdate={(field, val) => updateSection(i, field, val)}
                  onRemove={() => removeSection(i)}
                  onMove={(dir) => moveSection(i, dir)}
                  isFirst={i === 0}
                  isLast={i === form.sections.length - 1}
                />
              : <QuillSection
                  key={sec._uid || i}
                  index={i}
                  sec={sec}
                  onUpdate={(field, val) => updateSection(i, field, val)}
                  onRemove={() => removeSection(i)}
                  onMove={(dir) => moveSection(i, dir)}
                  isFirst={i === 0}
                  isLast={i === form.sections.length - 1}
                />
          ))}
          {form.sections.length > 0 && (
            <div className="flex justify-center pt-2">
              <AddSectionButtons onAddText={addSection} onAddLogos={addSponsorGroup} />
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" icon={Save} className="w-full rounded-2xl font-black uppercase tracking-widest" isLoading={loading}>
          Salvar Configuração EINCOL
        </Button>
      </form>
    </div>
  );
}

// --- SUB-COMPONENTES ---

// Estilo do título da seção no site (ver src/utils/sectionTitle.js).
// Tamanho e peso ficam na mesma linha do título; o campo já mostra o estilo.
const selCls = "p-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:border-[#007a3d] shrink-0";

function TitleField({ sec, onUpdate, placeholder, defaultSize, defaultAlign }) {
  const st = resolveTitleStyle(sec, defaultSize, defaultAlign);
  return (
    <>
      <input
        className={`flex-1 min-w-0 p-3 bg-white rounded-xl outline-none border focus:border-[#007a3d] ${TITLE_SIZES[st.size].admin} ${TITLE_WEIGHTS[st.weight].cls} ${st.upper ? 'uppercase' : ''} ${st.align === 'center' ? 'text-center' : ''}`}
        placeholder={placeholder}
        value={sec.title}
        onChange={e => onUpdate('title', e.target.value)}
      />
      <select className={selCls} value={st.size} onChange={e => onUpdate('title_size', e.target.value)} title="Tamanho do título">
        {Object.entries(TITLE_SIZES).map(([v, o]) => <option key={v} value={v}>Tamanho: {o.label}</option>)}
      </select>
      <select className={selCls} value={st.weight} onChange={e => onUpdate('title_weight', e.target.value)} title="Peso (grossura) do título">
        {Object.entries(TITLE_WEIGHTS).map(([v, o]) => <option key={v} value={v}>Peso: {o.label}</option>)}
      </select>
    </>
  );
}

// Opções extras do título: maiúsculas e alinhamento.
function TitleExtraControls({ sec, onUpdate, defaultSize, defaultAlign }) {
  const st = resolveTitleStyle(sec, defaultSize, defaultAlign);
  const chip = (active) => `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${active ? 'bg-[#007a3d] text-white border-[#007a3d]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#007a3d]'}`;
  return (
    <div className="flex flex-wrap items-center gap-2 pl-1">
      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-1">Título:</span>
      <button type="button" className={chip(st.upper)} onClick={() => onUpdate('title_upper', !st.upper)} title="Tudo em maiúsculas">AA Maiúsculas</button>
      {[['left', 'Esquerda'], ['center', 'Centro']].map(([v, label]) => (
        <button key={v} type="button" className={chip(st.align === v)} onClick={() => onUpdate('title_align', v)}>{label}</button>
      ))}
    </div>
  );
}

// Setas para mudar a ordem (a ordem aqui é a ordem em que aparece no site)
function MoveButtons({ onMove, isFirst, isLast }) {
  const cls = "p-2 bg-white text-gray-500 rounded-xl border border-gray-200 hover:text-[#007a3d] hover:border-[#007a3d] disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all";
  return (
    <div className="flex gap-1 shrink-0">
      <button type="button" onClick={() => onMove(-1)} disabled={isFirst} className={cls} title="Mover para cima">
        <ChevronUp size={16} />
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={isLast} className={cls} title="Mover para baixo">
        <ChevronDown size={16} />
      </button>
    </div>
  );
}

function AddSectionButtons({ onAddText, onAddLogos }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onAddText}
        className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
        <Plus size={14} /> Seção de Texto
      </button>
      <button type="button" onClick={onAddLogos}
        className="flex items-center gap-2 px-4 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors">
        <Users size={14} /> Carrossel de Logos
      </button>
    </div>
  );
}

function QuillTab({ tab, index, onUpdate, onRemove, onMove, isFirst, isLast }) {
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
        <MoveButtons onMove={onMove} isFirst={isFirst} isLast={isLast} />
        <button type="button" onClick={onRemove} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <QuillEditor value={tab.content} onChange={val => onUpdate('content', val)} height="h-[420px]" />
    </div>
  );
}

function QuillSection({ sec, index, onUpdate, onRemove, onMove, isFirst, isLast }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">Seção {index + 1}</span>
        <TitleField sec={sec} onUpdate={onUpdate} placeholder="Título da seção..." defaultSize="lg" defaultAlign="left" />
        <MoveButtons onMove={onMove} isFirst={isFirst} isLast={isLast} />
        <button type="button" onClick={onRemove} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <TitleExtraControls sec={sec} onUpdate={onUpdate} defaultSize="lg" defaultAlign="left" />
      <QuillEditor value={sec.text} onChange={val => onUpdate('text', val)} height="h-[420px]" />
    </div>
  );
}

// Grupo de patrocinadores: título + lista de logos (viram carrossel no site).
function SponsorGroupEditor({ group, index, onUpdate, onRemove, onMove, isFirst, isLast }) {
  const [uploading, setUploading] = useState(false);
  const images = Array.isArray(group.images) ? group.images : [];

  const handleAddImages = async (fileList) => {
    const arr = Array.from(fileList || []);
    if (arr.length === 0) return;
    setUploading(true);
    const urls = [];
    for (const file of arr) {
      const url = await uploadEincolImage(file);
      if (url) urls.push(url);
    }
    if (urls.length) onUpdate('images', [...images, ...urls]);
    setUploading(false);
  };

  const removeImage = (i) => onUpdate('images', images.filter((_, idx) => idx !== i));
  const moveImage = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onUpdate('images', next);
  };

  return (
    <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-700 tracking-widest shrink-0">
          <Users size={13} /> Carrossel de logos
        </span>
        <TitleField sec={group} onUpdate={onUpdate} placeholder="Título (ex: Organização e apoio, Patrocinadores...)" defaultSize="md" defaultAlign="center" />
        <MoveButtons onMove={onMove} isFirst={isFirst} isLast={isLast} />
        <button type="button" onClick={onRemove} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16} />
        </button>
      </div>

      <TitleExtraControls sec={group} onUpdate={onUpdate} defaultSize="md" defaultAlign="center" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative group bg-white rounded-xl border border-gray-200 h-24 flex items-center justify-center overflow-hidden">
            <img src={getImageUrl(img)} alt={`Patrocinador ${i + 1}`} className="max-w-[85%] max-h-[85%] object-contain" />
            <button type="button" onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={12} />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                className="px-1.5 bg-white/90 rounded text-gray-600 text-xs font-bold disabled:opacity-30">‹</button>
              <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}
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
              <span className="text-[9px] font-bold uppercase tracking-widest">Add logos</span>
            </>
          )}
          <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
            onChange={e => { handleAddImages(e.target.files); e.target.value = ''; }} />
        </label>
      </div>
      <p className="text-[11px] text-gray-400">As imagens são enviadas na hora. Lembre de clicar em "Salvar Configuração EINCOL" no final para persistir o grupo.</p>
    </div>
  );
}
