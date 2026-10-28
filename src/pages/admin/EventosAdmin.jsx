import React, { useState, useEffect, useRef } from 'react';
import { apiRequest, toastError } from '../../utils/adminApi';
import { useConfirm, AdminPage, PrimaryButton, SecondaryButton, ItemActions, useDirty, SaveButton, useCanLeave } from '../../components/admin/kit';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, MapPin, Calendar, Clock, Eye, EyeOff } from 'lucide-react';
import { projectStatusColor } from '../../utils/helpers';
import Button from '../../components/admin/kit/AdminButton'; // botão do painel (sem a seta do site)
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageTextsForm from '../../components/admin/PageTextsForm';
import { EVENTOS_TEXTS } from '../../utils/pageTextDefaults';
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
// value '' = automático pela data (antes gravava o texto "Automático (por data)" e ele aparecia no site)
const STATUS_OPTIONS = [{ value: '', label: 'Automático (por data)' }, { value: 'Em Andamento', label: 'Em Andamento' }, { value: 'Concluído', label: 'Concluído' }];
const normStatus = (s) => (!s || s === 'Automático (por data)' ? '' : s);

const emptyForm = {
  title: '', description: '', date: '', event_date: '', time: '', location: '', video_url: '',
  status: '', image_url: '', imageFile: null, sections: [],
  // guardados em extra_data (não precisam de coluna nova no banco)
  cta_url: '', cta_label: '', summary: '',
};

export default function EventosAdmin() {
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const formRef = useRef(null);
  const { dirty } = useDirty(formData, { ready: view === 'form', settleMs: 1200 });

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

  const handleEdit = async (event) => {
    if (!(await canLeave())) return; // cabeçalho/contato com edição não salva
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
      date: event.date || '', event_date: event.event_date || '',
      time: extra.time || event.time || '',
      location: event.location || '', video_url: event.video_url || '',
      status: normStatus(event.status),
      image_url: event.image_url || '', imageFile: null, sections,
      cta_url: extra.cta_url || '', cta_label: extra.cta_label || '', summary: extra.summary || '',
    });
    setPreview(event.image_url || null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!(await confirm({ title: 'Excluir este evento?', message: 'A página do evento sai do site. Não dá para desfazer.' }))) return;
    try {
      await apiRequest(`${API_URL}?id=${id}`, { method: "DELETE" }); // erro (ex.: sem permissão) aparece
      fetchEvents();
    } catch (err) {
      toastError(err);
    }
  };

  const handleToggleActive = async (event) => {
    const newActive = event.active == 1 ? 0 : 1;
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', event.id);
    fd.append('active', newActive);
    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(event.active == 1 ? 'Ocultado do site.' : 'Publicado no site.');
      fetchEvents();
    } catch (err) { toastError(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sectionsUploading) { window.showToast?.('Aguarde o envio dos arquivos terminar para salvar.', 'error'); return; }
    setLoading(true);
    const fd = new FormData();
    // Na edição mantém o link (slug) já publicado — corrigir o título não quebra links divulgados
    fd.append('slug', (editingId && events.find(x => x.id == editingId)?.slug) || generateSlug(formData.title));
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('event_date', formData.event_date || '');
    fd.append('time', formData.time);
    fd.append('location', formData.location);
    fd.append('video_url', formData.video_url);
    fd.append('status', formData.status);
    // extra_data: mantém chaves desconhecidas que já existiam e grava os campos do formulário.
    // Programação e PDFs antigos (tabs, pdf1..3) já foram trazidos para os blocos ao abrir; saem daqui
    // para não voltarem a aparecer se a equipe apagar todos os blocos.
    const prevExtra = (() => { try { const o = JSON.parse(events.find(x => x.id == editingId)?.extra_data || '{}') || {}; ['tabs', 'pdf1_url', 'pdf1_title', 'pdf2_url', 'pdf2_title', 'pdf3_url', 'pdf3_title'].forEach(k => delete o[k]); return o; } catch { return {}; } })();
    fd.append('extra_data', JSON.stringify({ ...(editingId ? prevExtra : {}), sections: formData.sections, time: formData.time,
      cta_url: formData.cta_url.trim(), cta_label: formData.cta_label.trim(), summary: formData.summary.trim() }));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image_url) fd.append('image_url', formData.image_url);
    else if (editingId) fd.append('remove_image', '1'); // imagem removida no formulário

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      const result = await res.json();
      if (res.ok && result.status === 'success') {
        window.showToast?.(editingId ? 'Evento salvo.' : 'Evento publicado.');
        resetForm();
        fetchEvents();
      } else {
        window.showToast('Erro ao salvar evento: ' + (result.message || `HTTP ${res.status}`));
      }
    } catch (err) {
      window.showToast('Erro ao salvar evento: ' + err.message);
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
    <AdminPage
      title={view === 'list' ? 'Eventos' : (editingId ? 'Editar Evento' : 'Novo Evento')}
      subtitle={view === 'list' ? 'Gerencie os eventos e encontros do site' : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? <PrimaryButton icon={Plus} onClick={async () => { if (await canLeave()) setView('form'); }}>Novo evento</PrimaryButton>
        : <SecondaryButton icon={X} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) resetForm(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: typeof sectionsUploading !== 'undefined' && sectionsUploading } : undefined}
    >

      {/* Cabeçalho da página /eventos (hero editável) */}
      {view === 'list' && <PageHeaderForm pageKey="eventos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /eventos" />}
      {view === 'list' && <PageTextsForm pageKey="eventos" spec={EVENTOS_TEXTS} title="Textos da página /eventos" />}
      {view === 'list' && <PageContactForm pageKey="eventos" title="Contato responsável por Eventos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Eventos cadastrados</h3>
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
                      {normStatus(event.status) && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${projectStatusColor(event.status)}`}>{event.status}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ItemActions
                    visible={event.active == 1}
                    onToggleVisible={() => handleToggleActive(event)}
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event.id)}
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

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Evento</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#007a3d]" placeholder="Ex: Seminário Florestal 2025" value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data do evento</label>
                    <input type="date" className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={formData.event_date || ''} onChange={e => setFormData(f => ({...f, event_date: e.target.value}))} />
                    <p className="text-[9px] text-gray-400 ml-1">Exibida formatada no site (ex: 20 Out 2026) e usada para mover ao histórico após passar.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Horário</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: 08h00 – 18h00" value={formData.time} onChange={e => setFormData(f => ({...f, time: e.target.value}))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                    <select className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" value={formData.status} onChange={e => setFormData(f => ({...f, status: e.target.value}))}>
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Localização</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]" placeholder="Ex: Viçosa - MG" value={formData.location} onChange={e => setFormData(f => ({...f, location: e.target.value}))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Link de inscrição (opcional)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d]" placeholder="https://..." value={formData.cta_url} onChange={e => setFormData(f => ({...f, cta_url: e.target.value}))} />
                    <p className="text-[9px] text-gray-400 ml-1">Link externo (Sympla, formulário...). Aparece como botão no topo da página, ao lado de "Falar com a equipe".</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Texto do botão</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d]" placeholder="Fazer inscrição" value={formData.cta_label} onChange={e => setFormData(f => ({...f, cta_label: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Frase de apresentação no topo (opcional)</label>
                  <textarea rows={2} maxLength={260} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm outline-none border focus:border-[#007a3d] resize-y" placeholder="Uma ou duas frases que aparecem embaixo do título" value={formData.summary} onChange={e => setFormData(f => ({...f, summary: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Link do Vídeo (YouTube)</label>
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
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sobre o evento (texto principal)</label>
              <p className="text-[11px] text-gray-400 ml-1">Aparece logo depois das informações rápidas, em duas colunas. Os demais conteúdos (eixos, programação, palestrantes, fotos...) entram nos blocos abaixo.</p>
              <QuillEditor
                value={formData.description}
                onChange={val => setFormData(f => ({...f, description: val}))}
                height="h-[550px]"
              />
            </div>

            <ContentSections
              template="eventos" autoTemplate={!editingId} bands
              title="Blocos da página do evento"
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-4">
              <div className="flex justify-end"><SaveButton type="submit" saving={loading} disabled={sectionsUploading} label={editingId ? 'Salvar alterações' : 'Publicar Evento'} /></div>
            </div>
          </form>
        </div>
      )}
    </AdminPage>
  );
}
