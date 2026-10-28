import { useState, useEffect, useRef } from 'react';
import { useConfirm, AdminPage, PrimaryButton, SecondaryButton, ItemActions, useDirty, SaveButton, useCanLeave } from '../../components/admin/kit';
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/admin/kit/AdminButton'; // botão do painel (sem a seta do site)
import QuillEditor from '../../components/admin/QuillEditor';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContactForm from '../../components/admin/PageContactForm';
import { generateSlug, projectStatusColor, getEffectiveProjectStatus } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';

const API_URL = `${API_BASE_URL}/projetos.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070',
  hero_badge: 'P&D+I Estratégico',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Projetos',
  hero_subtitle: 'Transformando desafios em soluções aplicadas através de pesquisas de vanguarda e inovação florestal.',
  hero_scroll_label: 'Ver Projetos',
};
// value '' = automático pela data (antes gravava o texto "Automático (por data)" e ele aparecia no site)
const STATUS_OPTIONS = [{ value: '', label: 'Automático (por data)' }, { value: 'Em Andamento', label: 'Em Andamento' }, { value: 'Concluído', label: 'Concluído' }];
const normStatus = (s) => (!s || s === 'Automático (por data)' ? '' : s);

const emptyForm = {
  title: '', description: '', tag: '', lab: '',
  status: '', data_limite: '', link_url: '',
  image_url: '', imageFile: null, sections: [],
};

export default function ProjetosAdmin() {
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const [projetos, setProjetos] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const formRef = useRef(null);
  const { dirty } = useDirty(form, { ready: view === 'form', settleMs: 1200 });
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchProjetos(); }, []);

  const fetchProjetos = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1`);
      const data = await res.json();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Erro ao carregar projetos:', err); }
  };

  const handleEdit = async (p) => {
    if (!(await canLeave())) return; // cabeçalho/contato com edição não salva
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
      lab: p.lab || '', status: normStatus(p.status),
      data_limite: p.data_limite || '', link_url: p.link_url || '',
      image_url: p.image_url || '', imageFile: null, sections,
    });
    setPreview(p.image_url ? getImageUrl(p.image_url) : null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!(await confirm({ title: 'Excluir este projeto?', message: 'A página do projeto sai do site. Não dá para desfazer.' }))) return;
    try {
      await apiRequest(`${API_URL}?id=${id}`, { method: "DELETE" }); // erro (ex.: sem permissão) aparece
      fetchProjetos();
    } catch (err) { toastError(err); }
  };

  const handleToggleActive = async (p) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', p.id);
    fd.append('active', p.active == 1 ? 0 : 1);
    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(p.active == 1 ? 'Ocultado do site.' : 'Publicado no site.');
      fetchProjetos();
    } catch (err) { toastError(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sectionsUploading) { window.showToast?.('Aguarde o envio dos arquivos terminar para salvar.', 'error'); return; }
    setLoading(true);
    const fd = new FormData();
    // Na edição mantém o link (slug) já publicado — corrigir o título não quebra links divulgados
    fd.append('slug', (editingId && projetos.find(x => x.id == editingId)?.slug) || generateSlug(form.title));
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('tag', form.tag);
    fd.append('lab', form.lab);
    fd.append('status', form.status);
    fd.append('data_limite', form.data_limite || '');
    fd.append('link_url', form.link_url);
    fd.append('extra_data', JSON.stringify({ sections: form.sections }));
    if (editingId) fd.append('id', editingId);
    if (form.imageFile) fd.append('image', form.imageFile);
    if (editingId && form.removeImage && !form.imageFile) fd.append('remove_image', '1'); // imagem removida no formulário
    else if (form.image_url) fd.append('image_url', form.image_url);

    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(editingId ? 'Projeto salvo.' : 'Projeto publicado.');
      reset(); fetchProjetos();
    } catch (err) { toastError(err); } // em erro o formulário continua aberto, com o que foi digitado
    finally { setLoading(false); }
  };

  const reset = () => { setEditingId(null); setForm(emptyForm); setPreview(null); setView('list'); };

  return (
    <AdminPage
      title={view === 'list' ? 'Projetos P&D' : (editingId ? 'Editar Projeto' : 'Novo Projeto')}
      subtitle={view === 'list' ? 'Gerencie os projetos de pesquisa e inovação publicados no site' : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? <PrimaryButton icon={Plus} onClick={async () => { if (await canLeave()) setView('form'); }}>Novo projeto</PrimaryButton>
        : <SecondaryButton icon={X} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) reset(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: typeof sectionsUploading !== 'undefined' && sectionsUploading } : undefined}
    >

      {view === 'list' && <PageHeaderForm pageKey="projetos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /projetos" />}
      {view === 'list' && <PageContactForm pageKey="projetos" title="Contato responsável por Projetos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Projetos P&D cadastrados</h3>
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
                      {(() => { const es = getEffectiveProjectStatus(p); return es && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${projectStatusColor(es)}`}>{es}</span>; })()}
                      {p.data_limite && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Prazo: {new Date(p.data_limite + 'T12:00:00').toLocaleDateString('pt-BR')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ItemActions
                    visible={p.active == 1}
                    onToggleVisible={() => handleToggleActive(p)}
                    onEdit={() => handleEdit(p)}
                    onDelete={() => handleDelete(p.id)}
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
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
              onFileChange={file => { setPreview(URL.createObjectURL(file)); setForm(f => ({...f, removeImage: false, imageFile: file})); }}
              onClear={() => { setPreview(null); setForm(f => ({...f, imageFile: null, image_url: '', removeImage: true})); }}
              height="h-48"
              label="Imagem de Capa"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição do Projeto</label>
              {/* página em estilo blog (texto livre): permite escolher a fonte, como no Blog */}
              <QuillEditor fonts value={form.description} onChange={val => setForm(f => ({...f, description: val}))} height="h-[550px]" />
            </div>

            <ContentSections
              template="projetos" autoTemplate={!editingId}
              sections={form.sections}
              onChange={sections => setForm(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-12">
              <div className="flex justify-end"><SaveButton type="submit" saving={loading} disabled={sectionsUploading} label={editingId ? 'Salvar alterações' : 'Publicar Projeto'} /></div>
            </div>
          </form>
        </div>
      )}
    </AdminPage>
  );
}
