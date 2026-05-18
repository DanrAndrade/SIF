import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, Play, MapPin, Calendar, Clock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContactForm from '../../components/admin/PageContactForm';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070',
  hero_badge: 'Networking & Negócios',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Eventos',
  hero_subtitle: 'Conectando lideranças e transformando o conhecimento em prática nos maiores fóruns florestais.',
  hero_scroll_label: 'Ver Agenda',
};
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/eventos.php`;

const emptyForm = {
  title: '', description: '', date: '', time: '', location: '', video_url: '',
  image_url: '', imageFile: null, sections: [],
};

export default function EventosAdmin() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    }
  };

  const handleEdit = (event) => {
    let extra = {};
    try { extra = JSON.parse(event.extra_data || '{}'); } catch {}

    // Load sections or auto-migrate legacy tabs/pdfs
    let sections = Array.isArray(extra.sections) && extra.sections.length > 0 ? extra.sections : null;
    if (!sections) {
      sections = [];
      if (extra.tabs?.length) {
        sections.push({ id: `${Date.now()}-tabs`, type: 'tabs', title: 'Programação', tabs: extra.tabs });
      }
      const legacyPdfs = [
        extra.pdf1_url && { url: extra.pdf1_url, title: extra.pdf1_title || 'PDF 1' },
        extra.pdf2_url && { url: extra.pdf2_url, title: extra.pdf2_title || 'PDF 2' },
        extra.pdf3_url && { url: extra.pdf3_url, title: extra.pdf3_title || 'PDF 3' },
      ].filter(Boolean);
      if (legacyPdfs.length) {
        sections.push({ id: `${Date.now()}-pdfs`, type: 'pdfs', title: 'Documentos', pdfs: legacyPdfs });
      }
    }

    setEditingId(event.id);
    setFormData({
      title: event.title || '', description: event.description || '',
      date: event.date || '', time: extra.time || event.time || '',
      location: event.location || '', video_url: event.video_url || '',
      image_url: event.image_url || '', imageFile: null, sections,
    });
    setPreview(event.image_url || null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch {
      alert('Erro ao excluir evento.');
    }
  };

  const handleToggleActive = async (event) => {
    const newActive = event.active == 1 ? 0 : 1;
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', event.id);
    fd.append('active', newActive);
    try {
      await fetch(API_URL, { method: 'POST', body: fd });
      fetchEvents();
    } catch {
      alert('Erro ao alterar visibilidade.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('slug', generateSlug(formData.title));
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('date', formData.date);
    fd.append('time', formData.time);
    fd.append('location', formData.location);
    fd.append('video_url', formData.video_url);
    fd.append('extra_data', JSON.stringify({ sections: formData.sections, time: formData.time }));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image_url) fd.append('image_url', formData.image_url);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        resetForm();
        fetchEvents();
      } else {
        alert('Erro ao salvar evento: ' + (result.message || `HTTP ${res.status}`));
      }
    } catch (err) {
      alert('Erro ao salvar evento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null); setPreview(null);
    setFormData(emptyForm); setView('list');
  };

  const handleImageFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFormData(f => ({ ...f, imageFile: file, image_url: url }));
  };


  return (
    <div className="w-full relative">

      {/* Cabeçalho da página /eventos (hero editável) */}
      {view === 'list' && <PageHeaderForm pageKey="eventos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /eventos" />}
      {view === 'list' && <PageContactForm pageKey="eventos" title="Contato responsável por Eventos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Eventos SIF</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os eventos e encontros do site</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl">
              <Plus size={20}/> Novo Evento
            </Button>
          </div>

          <div className="divide-y divide-gray-50">
            {events.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum evento cadastrado no sistema.</div>
            ) : events.map(event => (
              <div key={event.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all group ${event.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border overflow-hidden flex items-center justify-center text-gray-300">
                    {event.image_url ? <img src={getImageUrl(event.image_url)} className="w-full h-full object-cover" alt="" /> : <ImageIcon />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#007a3d] transition-colors text-lg uppercase tracking-tight">{event.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                      <Calendar size={12} className="text-[#007a3d]"/> {event.date || 'Sem data'}
                      {event.time && <><Clock size={12} className="text-[#007a3d]"/> {event.time}</>}
                      <MapPin size={12} className="text-[#007a3d]"/> {event.location || 'Sem local'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(event)}
                    title={event.active == 1 ? 'Publicado — clique para ocultar' : 'Oculto — clique para publicar'}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${event.active == 1 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                  >
                    {event.active == 1 ? <Eye size={18}/> : <EyeOff size={18}/>}
                  </button>
                  <button onClick={() => handleEdit(event)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(event.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
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
              {editingId ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Evento</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#007a3d]" placeholder="Ex: Seminário Florestal 2025" value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1"><Calendar size={10}/> Data</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: 15-20 Out" value={formData.date} onChange={e => setFormData(f => ({...f, date: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1"><Clock size={10}/> Horário</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: 08h00 – 18h00" value={formData.time} onChange={e => setFormData(f => ({...f, time: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1"><MapPin size={10}/> Localização</label>
                  <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Viçosa - MG" value={formData.location} onChange={e => setFormData(f => ({...f, location: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1"><Play size={10}/> Link do Vídeo (YouTube)</label>
                  <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d]" placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => setFormData(f => ({...f, video_url: e.target.value}))} />
                </div>
              </div>
              <ImageUploadArea
                preview={preview}
                onFileChange={handleImageFile}
                onClear={() => { setPreview(null); setFormData(f => ({...f, imageFile: null, image_url: ''})); }}
                height="h-full min-h-[300px]"
                label="Foto de Capa (opcional)"
                hint="Sem foto = sem foto no site"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição do Evento</label>
              <QuillEditor
                value={formData.description}
                onChange={val => setFormData(f => ({...f, description: val}))}
                height="h-96"
              />
            </div>

            <ContentSections
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading} disabled={loading || sectionsUploading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Evento'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
