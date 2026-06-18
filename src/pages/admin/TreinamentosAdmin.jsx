import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, Clock, Layers, Play, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContactForm from '../../components/admin/PageContactForm';
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/treinamentos.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
  hero_badge: 'Educação Executiva & Técnica',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Treinamentos',
  hero_subtitle: 'Capacitação técnica de alto nível para os desafios contínuos do setor florestal brasileiro.',
  hero_scroll_label: 'Explorar Cursos',
};

const emptyForm = {
  title: '', segment: 'Silvicultura', hours: '', location: '',
  video_url: '', image_url: '', imageFile: null, sections: [],
};

export default function TreinamentosAdmin() {
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [segments, setSegments] = useState(['Silvicultura', 'Gestão', 'Tecnologia', 'Sustentabilidade']);
  const [newSegment, setNewSegment] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchTrainings(); }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrainings(data);
        const unique = [...new Set([...segments, ...data.map(t => t.segment).filter(Boolean)])];
        setSegments(unique);
      }
    } catch (err) { console.error('Erro ao carregar treinamentos:', err); }
  };

  const handleEdit = (training) => {
    // Load sections from extra_data, or auto-migrate legacy description JSON
    let sections = null;
    if (training.extra_data) {
      try { const s = JSON.parse(training.extra_data).sections; sections = Array.isArray(s) && s.length > 0 ? s : null; } catch {}
    }
    if (!sections) {
      sections = [];
      let parsed = {};
      try { parsed = JSON.parse(training.description); } catch { parsed.presentation = training.description || ''; }
      if (parsed.presentation) sections.push({ id: `${Date.now()}-1`, type: 'editor', title: 'Apresentação', content: parsed.presentation });
      if (parsed.audience)     sections.push({ id: `${Date.now()}-2`, type: 'editor', title: 'Público-Alvo', content: parsed.audience });
      const tabs = parsed.tabs || [];
      if (tabs.length)         sections.push({ id: `${Date.now()}-3`, type: 'tabs',   title: 'Módulos',       tabs });
      
      // Migrate legacy PDF field
      if (training.pdf_url) {
        sections.push({ 
          id: `${Date.now()}-pdfs`, 
          type: 'pdfs', 
          title: 'Documentos', 
          pdfs: [{ url: training.pdf_url, title: 'Informações do Treinamento' }] 
        });
      }
    }
    setEditingId(training.id);
    setFormData({
      title: training.title, segment: training.segment,
      hours: training.hours, location: training.location || '',
      video_url: training.video_url || '',
      image_url: training.image_url, imageFile: null, sections,
    });
    setPreview(training.image_url);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este treinamento permanentemente?')) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchTrainings();
    } catch { window.showToast('Erro ao excluir treinamento.'); }
  };

  const handleToggleActive = async (training) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', training.id);
    fd.append('active', training.active == 1 ? 0 : 1);
    try {
      await fetch(API_URL, { method: 'POST', body: fd });
      fetchTrainings();
    } catch { window.showToast('Erro ao alterar visibilidade.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('slug', generateSlug(formData.title));
    fd.append('title', formData.title);
    fd.append('description', '');
    fd.append('segment', formData.segment);
    fd.append('hours', formData.hours);
    fd.append('location', formData.location);
    fd.append('video_url', formData.video_url);
    fd.append('extra_data', JSON.stringify({ sections: formData.sections }));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image_url) fd.append('image_url', formData.image_url);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') { resetForm(); fetchTrainings(); }
      else window.showToast('Erro: ' + result.message);
    } catch { window.showToast('Erro ao salvar treinamento.'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setPreview(null);
    setFormData({ ...emptyForm, segment: segments[0] || 'Silvicultura', sections: [] });
    setView('list');
  };

  const addSegment = () => {
    const trimmed = newSegment.trim();
    if (trimmed && !segments.includes(trimmed)) {
      setSegments([...segments, trimmed]);
      setNewSegment('');
    }
  };

  const removeSegment = (seg) => {
    const inUse = trainings.some(t => t.segment === seg);
    if (inUse && !window.confirm(`O segmento "${seg}" está sendo usado em treinamentos existentes. Remover da lista não altera os treinamentos já salvos. Continuar?`)) return;
    setSegments(prev => prev.filter(s => s !== seg));
    // Se o segmento removido estiver selecionado no form, troca para o primeiro disponível
    if (formData.segment === seg) {
      const remaining = segments.filter(s => s !== seg);
      setFormData(f => ({ ...f, segment: remaining[0] || '' }));
    }
  };

  return (
    <div className="w-full relative">

      {view === 'list' && <PageHeaderForm pageKey="treinamentos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /treinamentos" />}
      {view === 'list' && <PageContactForm pageKey="treinamentos" title="Contato responsável por Treinamentos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Treinamentos SIF</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os cursos e capacitações técnicas</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold">
              <Plus size={20}/> Novo Treinamento
            </Button>
          </div>

          <div className="divide-y divide-gray-50">
            {trainings.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum treinamento cadastrado no sistema.</div>
            ) : trainings.map(t => (
              <div key={t.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all group ${t.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border overflow-hidden flex items-center justify-center text-gray-300">
                    {t.image_url ? <img src={getImageUrl(t.image_url)} className="w-full h-full object-cover" alt="" /> : <ImageIcon />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#007a3d] transition-colors text-lg uppercase tracking-tight">{t.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                      <Layers size={12} className="text-[#007a3d]"/> {t.segment}
                      <Clock size={12} className="text-[#007a3d]"/> {t.hours}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(t)}
                    title={t.active == 1 ? 'Publicado — clique para ocultar' : 'Oculto — clique para publicar'}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${t.active == 1 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                  >
                    {t.active == 1 ? <Eye size={18}/> : <EyeOff size={18}/>}
                  </button>
                  <button onClick={() => handleEdit(t)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(t.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
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
              {editingId ? 'Editar Treinamento' : 'Novo Treinamento Técnico'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Treinamento</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#007a3d]" placeholder="Nome do curso..." value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Segmento</label>
                    <select className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={formData.segment} onChange={e => setFormData(f => ({...f, segment: e.target.value}))}>
                      {segments.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Carga Horária</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: 24h" value={formData.hours} onChange={e => setFormData(f => ({...f, hours: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2"><Play size={10}/> Link do Vídeo (YouTube)</label>
                  <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-xs outline-none border focus:border-[#007a3d]" placeholder="YouTube URL..." value={formData.video_url} onChange={e => setFormData(f => ({...f, video_url: e.target.value}))} />
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50">
                  <label className="text-[10px] font-black uppercase text-[#007a3d] tracking-widest block mb-3">Gerenciar Segmentos</label>
                  {/* Chips dos segmentos existentes */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {segments.map(seg => (
                      <span key={seg} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-[10px] font-black uppercase tracking-widest text-[#007a3d] rounded-full">
                        {seg}
                        <button
                          type="button"
                          onClick={() => removeSegment(seg)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title={`Remover segmento "${seg}"`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Adicionar novo segmento */}
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-3 bg-white rounded-xl text-xs font-bold outline-none border focus:border-[#007a3d]"
                      placeholder="Novo segmento..."
                      value={newSegment}
                      onChange={e => setNewSegment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSegment())}
                    />
                    <button type="button" onClick={addSegment} className="p-3 bg-[#007a3d] text-white rounded-xl hover:bg-[#047857] transition-all"><Plus size={20}/></button>
                  </div>
                </div>
              </div>
              <ImageUploadArea
                preview={preview}
                onFileChange={file => { setPreview(URL.createObjectURL(file)); setFormData(f => ({...f, imageFile: file, image_url: URL.createObjectURL(file)})); }}
                height="h-full min-h-[300px]"
                label="Imagem Ilustrativa"
              />
            </div>

            <ContentSections
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-12">
              <Button type="submit" className="w-full font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading} disabled={loading || sectionsUploading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Treinamento'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
