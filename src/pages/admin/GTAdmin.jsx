import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, Target, Users, Book, Palette, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/gt.php`;

export default function GTAdmin() {
  const [gts, setGts] = useState([]);
  const [view, setView] = useState('list'); 
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Target',
    color: '#059669',
    bg_color: '#ECFDF5'
  });

  useEffect(() => {
    fetchGts();
  }, []);

  const fetchGts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar GTs:", err);
    }
  };

  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleEdit = (gt) => {
    setEditingId(gt.id);
    setFormData({
      title: gt.title,
      description: gt.description,
      icon: gt.icon || 'Target',
      color: gt.color || '#059669',
      bg_color: gt.bg_color || '#ECFDF5'
    });
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este Grupo Temático? Isso removerá a página pública do mesmo.")) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchGts();
    } catch (err) {
      alert("Erro ao excluir GT.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = generateSlug(formData.title);
    const dataToSend = new FormData();
    dataToSend.append('slug', slug);
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
    dataToSend.append('icon', formData.icon);
    dataToSend.append('color', formData.color);
    dataToSend.append('bg_color', formData.bg_color);
    
    if (editingId) {
        dataToSend.append('id', editingId);
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: dataToSend
      });
      
      if (res.ok) {
        resetForm();
        fetchGts();
      }
    } catch (err) {
      alert("Erro ao salvar Grupo Temático.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Target',
      color: '#059669',
      bg_color: '#ECFDF5'
    });
    setView('list');
  };

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
        }
      } catch (err) {
        console.error("Erro upload:", err);
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), [imageHandler]);

  const quillRef = React.useRef(null);

  const iconOptions = ['Target', 'Users', 'Book', 'Zap', 'Shield', 'Globe', 'Activity'];

  return (
    <div className="w-full relative">
      {/* TELA 1: LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#059669] tracking-tighter">Grupos Temáticos</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os clusters de pesquisa e inovação da SIF</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold">
              <Plus size={20}/> Novo Grupo Temático
            </Button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {gts.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum grupo cadastrado no sistema.</div>
            ) : (
              gts.map(gt => (
                <div key={gt.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-inner"
                      style={{ backgroundColor: gt.color || '#059669' }}
                    >
                      <Target size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#059669] transition-colors text-lg uppercase tracking-tight">{gt.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black leading-none">Slug: /{gt.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(gt)} className="p-4 bg-emerald-50 text-[#059669] rounded-2xl hover:bg-[#059669] hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(gt.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {view === 'form' && (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-8 pb-6 border-b">
            <h2 className="text-3xl font-bold uppercase text-[#059669] tracking-tighter">
              {editingId ? 'Editar Grupo' : 'Novo Grupo Temático'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome do Grupo (Ex: GT Solos)</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#059669]" placeholder="Nome do grupo..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Ícone</label>
                    <select className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#059669]" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                      {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Cor Principal</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" className="p-1 h-12 w-12 bg-gray-50 rounded-lg border cursor-pointer" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                      <input className="flex-1 p-3 bg-gray-50 rounded-xl font-mono text-xs outline-none border" value={formData.color} readOnly />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 text-center block">Visualização do Card</label>
                <div className="flex items-center justify-center h-full min-h-[150px] bg-[#f8f9fa] rounded-[40px] border border-dashed p-8">
                  <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-6 w-full max-w-sm border border-gray-100">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: formData.color }}
                    >
                      <Target size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 uppercase tracking-tight">{formData.title || 'Título do GT'}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black leading-none">Ver detalhes →</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Página do GT (História, Objetivos, Empresas Participantes)</label>
              <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  modules={modules} 
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                  className="h-80" 
                />
              </div>
            </div>

            <div className="pt-12">
              <Button type="submit" className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Grupo Temático'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
