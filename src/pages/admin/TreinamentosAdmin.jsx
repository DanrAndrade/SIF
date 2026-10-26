import React, { useState, useEffect, useRef } from 'react';
import { useConfirm, AdminPage, PrimaryButton, SecondaryButton, ItemActions, useDirty, SaveButton, useCanLeave } from '../../components/admin/kit';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, Clock, Layers, Eye, EyeOff, Calendar } from 'lucide-react';
import Button from '../../components/admin/kit/AdminButton'; // botão do painel (sem a seta do site)
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContactForm from '../../components/admin/PageContactForm';
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { savePageConfig, toastError, apiRequest } from '../../utils/adminApi';

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
  title: '', segment: 'Silvicultura', hours: '', location: '', start_date: '', end_date: '',
  video_url: '', image_url: '', imageFile: null, sections: [],
};

const segmentsDefault = ['Silvicultura', 'Gestão', 'Tecnologia', 'Sustentabilidade'];

export default function TreinamentosAdmin() {
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [segments, setSegments] = useState(segmentsDefault);
  const [newSegment, setNewSegment] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const formRef = useRef(null);
  const { dirty } = useDirty(formData, { ready: view === 'form', settleMs: 1200 });

  useEffect(() => { fetchTrainings(); }, []);

  // Lista de segmentos salva no banco (antes só existia na tela e sumia ao recarregar)
  useEffect(() => {
    fetch(`${API_BASE_URL}/page_content.php?page=treinamentos`)
      .then(r => r.json())
      .then(cfg => {
        if (Array.isArray(cfg?.segments_list) && cfg.segments_list.length) {
          setSegments(prev => [...new Set([...cfg.segments_list, ...prev.filter(s => !segmentsDefault.includes(s))])]);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSegments = (list) =>
    savePageConfig('treinamentos', { segments_list: list }).catch(toastError);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrainings(data);

        setSegments(prev => [...new Set([...prev, ...data.map(t => t.segment).filter(Boolean)])]); // junta com a lista atual (sem corrida com a lista salva)
      }
    } catch (err) { console.error('Erro ao carregar treinamentos:', err); }
  };

  const handleEdit = async (training) => {
    if (!(await canLeave())) return; // cabeçalho/contato com edição não salva
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
      start_date: training.start_date || '', end_date: training.end_date || '',
      video_url: training.video_url || '',
      image_url: training.image_url, imageFile: null, sections,
    });
    setPreview(training.image_url);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!(await confirm({ title: 'Excluir este treinamento?', message: 'A página do treinamento sai do site. Não dá para desfazer.' }))) return;
    try {
      await apiRequest(`${API_URL}?id=${id}`, { method: "DELETE" }); // erro (ex.: sem permissão) aparece
      fetchTrainings();
    } catch (err) { toastError(err); }
  };

  const handleToggleActive = async (training) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', training.id);
    fd.append('active', training.active == 1 ? 0 : 1);
    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(training.active == 1 ? 'Ocultado do site.' : 'Publicado no site.');
      fetchTrainings();
    } catch (err) { toastError(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sectionsUploading) { window.showToast?.('Aguarde o envio dos arquivos terminar para salvar.', 'error'); return; }
    setLoading(true);
    const fd = new FormData();
    // Na edição mantém o link (slug) já publicado — corrigir o título não quebra links divulgados
    fd.append('slug', (editingId && trainings.find(x => x.id == editingId)?.slug) || generateSlug(formData.title));
    fd.append('title', formData.title);
    fd.append('description', '');
    fd.append('segment', formData.segment);
    fd.append('hours', formData.hours);
    fd.append('location', formData.location);
    fd.append('start_date', formData.start_date || '');
    fd.append('end_date', formData.end_date || '');
    fd.append('video_url', formData.video_url);
    fd.append('extra_data', JSON.stringify({ sections: formData.sections }));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    if (editingId && formData.removeImage && !formData.imageFile) fd.append('remove_image', '1'); // imagem removida no formulário
    else if (formData.image_url) fd.append('image_url', formData.image_url);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') { window.showToast?.(editingId ? 'Treinamento salvo.' : 'Treinamento publicado.'); resetForm(); fetchTrainings(); }
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
      const next = [...segments, trimmed];
      setSegments(next);
      persistSegments(next);
      setNewSegment('');
    }
  };

  const removeSegment = async (seg) => {
    const inUse = trainings.some(t => t.segment === seg);
    if (inUse && !(await confirm({ title: 'Remover este segmento?', message: `O segmento "${seg}" está sendo usado em treinamentos existentes. Remover da lista não altera os treinamentos já salvos. Continuar?`, confirmLabel: 'Remover' }))) return;
    const next = segments.filter(s => s !== seg);
    setSegments(next);
    persistSegments(next);
    // Se o segmento removido estiver selecionado no form, troca para o primeiro disponível
    if (formData.segment === seg) {
      const remaining = segments.filter(s => s !== seg);
      setFormData(f => ({ ...f, segment: remaining[0] || '' }));
    }
  };

  return (
    <AdminPage
      title={view === 'list' ? 'Treinamentos' : (editingId ? 'Editar Treinamento' : 'Novo Treinamento Técnico')}
      subtitle={view === 'list' ? 'Gerencie os cursos e capacitações técnicas' : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? <PrimaryButton icon={Plus} onClick={async () => { if (await canLeave()) setView('form'); }}>Novo treinamento</PrimaryButton>
        : <SecondaryButton icon={X} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) resetForm(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: typeof sectionsUploading !== 'undefined' && sectionsUploading } : undefined}
    >

      {view === 'list' && <PageHeaderForm pageKey="treinamentos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /treinamentos" />}
      {view === 'list' && <PageContactForm pageKey="treinamentos" title="Contato responsável por Treinamentos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Treinamentos cadastrados</h3>
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
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                      <span className="flex items-center gap-1"><Layers size={12} className="text-[#007a3d]"/> {t.segment}</span>
                      {t.hours && <span className="flex items-center gap-1"><Clock size={12} className="text-[#007a3d]"/> {t.hours}</span>}
                      {t.date && <span className="flex items-center gap-1"><Calendar size={12} className="text-[#007a3d]"/> {t.date}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ItemActions
                    visible={t.active == 1}
                    onToggleVisible={() => handleToggleActive(t)}
                    onEdit={() => handleEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORMULÁRIO */}
      {view === 'form' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200">

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data de início</label>
                    <input type="date" className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={formData.start_date || ''} onChange={e => setFormData(f => ({...f, start_date: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data de fim</label>
                    <input type="date" className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={formData.end_date || ''} min={formData.start_date || undefined} onChange={e => setFormData(f => ({...f, end_date: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Link do Vídeo (YouTube)</label>
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
                onFileChange={file => { setPreview(URL.createObjectURL(file)); setFormData(f => ({...f, removeImage: false, imageFile: file})); /* prévia só em 'preview': endereço temporário (blob:) nunca vai para o banco */ }}
                onClear={() => { setPreview(null); setFormData(f => ({...f, imageFile: null, image_url: '', removeImage: true})); }}
                height="h-full min-h-[300px]"
                label="Imagem Ilustrativa"
              />
            </div>

            <ContentSections
              template="treinamentos" autoTemplate={!editingId}
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-12">
              <div className="flex justify-end"><SaveButton type="submit" saving={loading} disabled={sectionsUploading} label={editingId ? 'Salvar alterações' : 'Publicar Treinamento'} /></div>
            </div>
          </form>
        </div>
      )}
    </AdminPage>
  );
}
