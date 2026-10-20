import React, { useState, useEffect, useRef } from 'react';
import { useConfirm, AdminPage, PrimaryButton, SecondaryButton, ItemActions, useDirty, SaveButton } from '../../components/admin/kit';
import { Target, Trash2, Edit3, X, Plus, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContactForm from '../../components/admin/PageContactForm';
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';

const API_URL = `${API_BASE_URL}/gt.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070',
  hero_badge: 'Clusters de Pesquisa',
  hero_title_line1: 'Grupos',
  hero_title_highlight: 'Temáticos',
  hero_subtitle: 'Cooperação técnica especializada em áreas chave para a excelência do setor florestal.',
  hero_scroll_label: 'Ver Grupos',
};

const emptyForm = {
  title: '', description: '', color: '#007a3d',
  imageFile: null, image_url: '',
  content_title: 'Objetivos do Cluster',
  content_subtitle: 'Linhas de Pesquisa e Inovação',
  sections: [],
};

export default function GTAdmin() {
  const confirm = useConfirm();
  const [gts, setGts] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const formRef = useRef(null);
  const { dirty } = useDirty(formData, { ready: view === 'form', settleMs: 1200 });

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
    if (!(await confirm({ title: 'Excluir este Grupo Temático?', message: 'A página pública do grupo sai do site. Não dá para desfazer.' }))) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchGts();
    } catch { window.showToast('Erro ao excluir GT.'); }
  };

  const handleToggleActive = async (gt) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', gt.id);
    fd.append('active', gt.active == 1 ? 0 : 1);
    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(gt.active == 1 ? 'Ocultado do site.' : 'Publicado no site.');
      fetchGts();
    } catch (err) { toastError(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    // Na edição mantém o link (slug) já publicado — corrigir o título não quebra links divulgados
    fd.append('slug', (editingId && gts.find(x => x.id == editingId)?.slug) || generateSlug(formData.title));
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
    if (editingId && formData.removeImage && !formData.imageFile) fd.append('remove_image', '1'); // imagem removida no formulário

    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      resetForm(); fetchGts();
    } catch (err) { toastError(err); } // em erro o formulário continua aberto
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setPreview(null);
    setFormData(emptyForm); setView('list');
  };

  return (
    <AdminPage
      title={view === 'list' ? 'Grupos Temáticos' : (editingId ? 'Editar Grupo' : 'Novo Grupo Temático')}
      subtitle={view === 'list' ? 'Gerencie os clusters de pesquisa e inovação da SIF' : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? <PrimaryButton icon={Plus} onClick={() => setView('form')}>Novo grupo temático</PrimaryButton>
        : <SecondaryButton icon={X} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) resetForm(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: typeof sectionsUploading !== 'undefined' && sectionsUploading } : undefined}
    >

      {view === 'list' && <PageHeaderForm pageKey="gt" defaults={HERO_DEFAULTS} title="Cabeçalho da página /grupos-tematicos" />}
      {view === 'list' && <PageContactForm pageKey="gt" title="Contato responsável por Grupos Temáticos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Grupos Temáticos cadastrados</h3>
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
                  <ItemActions
                    visible={gt.active == 1}
                    onToggleVisible={() => handleToggleActive(gt)}
                    onEdit={() => handleEdit(gt)}
                    onDelete={() => handleDelete(gt.id)}
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
                onFileChange={file => { setPreview(URL.createObjectURL(file)); setFormData(f => ({...f, removeImage: false, imageFile: file})); }}
                onClear={() => { setPreview(null); setFormData(f => ({...f, imageFile: null, image_url: '', removeImage: true})); }}
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
              <div className="flex justify-end"><SaveButton type="submit" saving={loading} disabled={sectionsUploading} label={editingId ? 'Salvar alterações' : 'Publicar Grupo Temático'} /></div>
            </div>
          </form>
        </div>
      )}
    </AdminPage>
  );
}
