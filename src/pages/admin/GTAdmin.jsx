import React, { useState, useEffect } from 'react';
import { Target, Trash2, Edit3, X, Plus, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/gt.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070',
  hero_badge: 'Clusters de Pesquisa',
  hero_title_line1: 'Grupos',
  hero_title_highlight: 'Temáticos',
  hero_subtitle: 'Cooperação técnica especializada em áreas chave para a excelência do setor florestal.',
  hero_scroll_label: '',
};

const emptyForm = {
  title: '', description: '', color: '#007a3d',
  imageFile: null, image_url: '',
  content_title: 'Objetivos do Cluster',
  content_subtitle: 'Linhas de Pesquisa e Inovação',
  sections: [],
};

export default function GTAdmin() {
  const [gts, setGts] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchGts(); }, []);

  const fetchGts = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Erro ao carregar GTs:', err); }
  };

  const handleEdit = (gt) => {
    let sections = [];
    if (gt.extra_data) {
      try { sections = JSON.parse(gt.extra_data).sections || []; } catch {}
    }
    setEditingId(gt.id);
    setFormData({
      title: gt.title, description: gt.description,
      color: gt.color || '#007a3d', imageFile: null,
      image_url: gt.image_url || '',
      content_title: gt.content_title || 'Objetivos do Cluster',
      content_subtitle: gt.content_subtitle || 'Linhas de Pesquisa e Inovação',
      sections,
    });
    setPreview(gt.image_url || null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este Grupo Temático? Isso removerá a página pública do mesmo.')) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchGts();
    } catch { alert('Erro ao excluir GT.'); }
  };

  const handleToggleActive = async (gt) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', gt.id);
    fd.append('active', gt.active == 1 ? 0 : 1);
    try {
      await fetch(API_URL, { method: 'POST', body: fd });
      fetchGts();
    } catch { alert('Erro ao alterar visibilidade.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('slug', generateSlug(formData.title));
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('icon', 'Target');
    fd.append('color', formData.color);
    fd.append('bg_color', formData.color + '22');
    fd.append('content_title', formData.content_title);
    fd.append('content_subtitle', formData.content_subtitle);
    fd.append('extra_data', JSON.stringify({ sections: formData.sections }));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      if (res.ok) { resetForm(); fetchGts(); }
    } catch { alert('Erro ao salvar Grupo Temático.'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setPreview(null);
    setFormData(emptyForm); setView('list');
  };

  return (
    <div className="w-full relative">

      {view === 'list' && <PageHeaderForm pageKey="gt" defaults={HERO_DEFAULTS} title="Cabeçalho da página /grupos-tematicos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Grupos Temáticos</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os clusters de pesquisa e inovação da SIF</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold">
              <Plus size={20}/> Novo Grupo Temático
            </Button>
          </div>

          <div className="divide-y divide-gray-50">
            {gts.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum grupo cadastrado no sistema.</div>
            ) : gts.map(gt => (
              <div key={gt.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all group ${gt.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: gt.color || '#007a3d' }}>
                    <Target size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#007a3d] transition-colors text-lg uppercase tracking-tight">{gt.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black leading-none">Slug: /{gt.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(gt)}
                    title={gt.active == 1 ? 'Publicado — clique para ocultar' : 'Oculto — clique para publicar'}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${gt.active == 1 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                  >
                    {gt.active == 1 ? <Eye size={18}/> : <EyeOff size={18}/>}
                  </button>
                  <button onClick={() => handleEdit(gt)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(gt.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORMULÁRIO */}
      {view === 'form' && (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-8 pb-6 border-b">
            <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">
              {editingId ? 'Editar Grupo' : 'Novo Grupo Temático'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome do Grupo (Ex: GT Solos)</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#007a3d]" placeholder="Nome do grupo..." value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Cor de Destaque</label>
                  <div className="flex gap-3 items-center">
                    <input type="color" className="p-1 h-12 w-12 bg-gray-50 rounded-lg border cursor-pointer" value={formData.color} onChange={e => setFormData(f => ({...f, color: e.target.value}))} />
                    <input className="flex-1 p-3 bg-gray-50 rounded-xl font-mono text-xs outline-none border" value={formData.color} readOnly />
                  </div>
                </div>
              </div>
              <ImageUploadArea
                preview={preview}
                onFileChange={file => { setPreview(URL.createObjectURL(file)); setFormData(f => ({...f, imageFile: file})); }}
                height="h-44"
                label="Foto de Capa do Grupo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título da Seção de Conteúdo</label>
                <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Objetivos do Cluster" value={formData.content_title} onChange={e => setFormData(f => ({...f, content_title: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subtítulo da Seção de Conteúdo</label>
                <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Linhas de Pesquisa e Inovação" value={formData.content_subtitle} onChange={e => setFormData(f => ({...f, content_subtitle: e.target.value}))} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição Principal (História, Objetivos, Empresas Participantes)</label>
              <QuillEditor value={formData.description} onChange={val => setFormData(f => ({...f, description: val}))} height="h-[500px]" />
            </div>

            <ContentSections
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-12">
              <Button type="submit" className="w-full font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading} disabled={loading || sectionsUploading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Grupo Temático'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
