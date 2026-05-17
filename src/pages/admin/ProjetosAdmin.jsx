import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import { generateSlug, projectStatusColor } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/projetos.php`;
const STATUS_OPTIONS = ['Em Andamento', 'Concluído', 'Em Planejamento', 'Suspenso'];

const emptyForm = {
  title: '', description: '', tag: '', lab: '',
  status: 'Em Andamento', data_limite: '', link_url: '',
  image_url: '', imageFile: null, sections: [],
};

export default function ProjetosAdmin() {
  const [projetos, setProjetos] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchProjetos(); }, []);

  const fetchProjetos = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Erro ao carregar projetos:', err); }
  };

  const handleEdit = (p) => {
    let sections = null;
    if (p.extra_data) {
      try { const s = JSON.parse(p.extra_data).sections; sections = Array.isArray(s) && s.length > 0 ? s : null; } catch {}
    }
    if (!sections) {
      sections = [];
      let parsedTabs = [];
      try { parsedTabs = p.tabs ? JSON.parse(p.tabs) : []; } catch {}
      if (parsedTabs.length) sections.push({ id: `${Date.now()}-tabs`, type: 'tabs', title: 'Seções', tabs: parsedTabs });
      if (p.pdf_url)         sections.push({ id: `${Date.now()}-pdfs`, type: 'pdfs', title: 'Documentos', pdfs: [{ url: p.pdf_url, title: 'Documento do Projeto' }] });
    }
    setEditingId(p.id);
    setForm({
      title: p.title, description: p.description || '', tag: p.tag || '',
      lab: p.lab || '', status: p.status || 'Em Andamento',
      data_limite: p.data_limite || '', link_url: p.link_url || '',
      image_url: p.image_url || '', imageFile: null, sections,
    });
    setPreview(p.image_url ? getImageUrl(p.image_url) : null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este projeto?')) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchProjetos();
    } catch { alert('Erro ao excluir projeto.'); }
  };

  const handleToggleActive = async (p) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', p.id);
    fd.append('active', p.active == 1 ? 0 : 1);
    try {
      await fetch(API_URL, { method: 'POST', body: fd });
      fetchProjetos();
    } catch { alert('Erro ao alterar visibilidade.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('slug', generateSlug(form.title));
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('tag', form.tag);
    fd.append('lab', form.lab);
    fd.append('status', form.status);
    fd.append('data_limite', form.data_limite || '');
    fd.append('link_url', form.link_url);
    fd.append('image_url', form.image_url);
    fd.append('extra_data', JSON.stringify({ sections: form.sections }));
    if (editingId) fd.append('id', editingId);
    if (form.imageFile) fd.append('image', form.imageFile);

    try {
      await fetch(API_URL, { method: 'POST', body: fd });
      reset(); fetchProjetos();
    } catch { alert('Erro ao salvar projeto.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setEditingId(null); setForm(emptyForm); setPreview(null); setView('list'); };

  return (
    <div className="w-full relative">

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Projetos P&D</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os projetos de pesquisa e inovação publicados no site</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold">
              <Plus size={20}/> Novo Projeto
            </Button>
          </div>
          <div className="divide-y divide-gray-50">
            {projetos.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum projeto cadastrado.</div>
            ) : projetos.map(p => (
              <div key={p.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all group ${p.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.image_url
                      ? <img src={getImageUrl(p.image_url)} className="w-full h-full object-cover" alt={p.title} />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24}/></div>
                    }
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#007a3d] transition-colors text-base uppercase tracking-tight">{p.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      {p.tag && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{p.tag}</span>}
                      {p.status && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${projectStatusColor(p.status)}`}>{p.status}</span>}
                      {p.data_limite && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Prazo: {new Date(p.data_limite + 'T12:00:00').toLocaleDateString('pt-BR')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(p)}
                    title={p.active == 1 ? 'Publicado — clique para ocultar' : 'Oculto — clique para publicar'}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${p.active == 1 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                  >
                    {p.active == 1 ? <Eye size={18}/> : <EyeOff size={18}/>}
                  </button>
                  <button onClick={() => handleEdit(p)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(p.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORMULÁRIO */}
      {view === 'form' && (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12">
          <div className="flex justify-between items-center mb-8 pb-6 border-b">
            <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">
              {editingId ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <button onClick={reset} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Projeto *</label>
                <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Monitoramento Remoto de Pragas" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Tag / Área</label>
                <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Tecnologia, P&D, IA..." value={form.tag} onChange={e => setForm(f => ({...f, tag: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Laboratório / GT</label>
                <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: GTSolos, LabProteção..." value={form.lab} onChange={e => setForm(f => ({...f, lab: e.target.value}))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data Limite (opcional)</label>
                <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={form.data_limite} onChange={e => setForm(f => ({...f, data_limite: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Link Externo (opcional)</label>
                <input type="url" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="https://..." value={form.link_url} onChange={e => setForm(f => ({...f, link_url: e.target.value}))} />
              </div>
            </div>

            <ImageUploadArea
              preview={preview}
              onFileChange={file => { setPreview(URL.createObjectURL(file)); setForm(f => ({...f, imageFile: file})); }}
              height="h-48"
              label="Imagem de Capa"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição do Projeto</label>
              <QuillEditor value={form.description} onChange={val => setForm(f => ({...f, description: val}))} height="h-[400px]" />
            </div>

            <ContentSections
              sections={form.sections}
              onChange={sections => setForm(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-12">
              <Button type="submit" className="w-full font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading} disabled={loading || sectionsUploading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Projeto'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
