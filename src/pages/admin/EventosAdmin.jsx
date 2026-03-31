import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, FileText, Play, MapPin, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/eventos.php`;

export default function EventosAdmin() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('list'); 
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    video_url: '',
    planta_url: '',
    image_url: '',
    imageFile: null
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
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

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      video_url: event.video_url,
      planta_url: event.planta_url,
      image_url: event.image_url,
      imageFile: null
    });
    setPreview(event.image_url);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      alert("Erro ao excluir evento.");
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
    dataToSend.append('date', formData.date);
    dataToSend.append('location', formData.location);
    dataToSend.append('video_url', formData.video_url);
    dataToSend.append('planta_url', formData.planta_url);
    
    if (editingId) {
        dataToSend.append('id', editingId);
    }
    if (formData.imageFile) {
        dataToSend.append('image', formData.imageFile);
    } else if (formData.image_url) {
        dataToSend.append('image_url', formData.image_url);
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: dataToSend
      });
      
      if (res.ok) {
        resetForm();
        fetchEvents();
      }
    } catch (err) {
      alert("Erro ao salvar evento.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      video_url: '',
      planta_url: '',
      image_url: '',
      imageFile: null
    });
    setView('list');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
        setFormData({ ...formData, image_url: reader.result, imageFile: file }); 
      };
      reader.readAsDataURL(file);
    }
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
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
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

  return (
    <div className="w-full relative">
      {/* TELA 1: LISTA DE EVENTOS */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#059669] tracking-tighter">Eventos SIF</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os eventos e o EINCOL do site</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl">
              <Plus size={20}/> Novo Evento
            </Button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {events.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum evento cadastrado no sistema.</div>
            ) : (
              events.map(event => (
                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 border overflow-hidden flex items-center justify-center text-gray-300">
                      {event.image_url ? <img src={getImageUrl(event.image_url)} className="w-full h-full object-cover" /> : <ImageIcon />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#059669] transition-colors text-lg uppercase tracking-tight">{event.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                        <Calendar size={12} className="text-[#059669]"/> {event.date || 'Sem data'}
                        <MapPin size={12} className="text-[#059669]"/> {event.location || 'Sem local'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(event)} className="p-4 bg-emerald-50 text-[#059669] rounded-2xl hover:bg-[#059669] hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(event.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
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
              {editingId ? 'Editar Evento' : 'Novo Evento / EINCOL'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Evento</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#059669]" placeholder="Ex: II EINCOL Internacional" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#059669]" placeholder="15-20 Out" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Localização</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#059669]" placeholder="Viçosa-MG" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Link do Vídeo (YouTube)</label>
                  <div className="relative">
                    <Play className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input className="w-full p-4 pl-12 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#059669]" placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">URL Planta Baixa (PDF)</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input className="w-full p-4 pl-12 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#059669]" placeholder="Ex: drive.google.com/..." value={formData.planta_url} onChange={e => setFormData({...formData, planta_url: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Imagem / Render (Capa)</label>
                <div className="relative h-full min-h-[300px] bg-gray-50 rounded-[40px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all">
                  {preview ? <img src={getImageUrl(preview)} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição do Evento</label>
              <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden">
                <ReactQuill 
                  theme="snow" 
                  modules={modules} 
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                  className="h-96" 
                />
              </div>
            </div>

            <div className="pt-12">
              <Button type="submit" className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Evento'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
