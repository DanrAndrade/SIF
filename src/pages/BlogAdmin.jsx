import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest, toastError } from '../utils/adminApi';
import { useConfirm, AdminPage, PrimaryButton, SecondaryButton, ItemActions, useDirty, useCanLeave } from '../components/admin/kit';
import PageContactForm from '../components/admin/PageContactForm';
import { Trash2, Edit3, X, Plus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/admin/kit/AdminButton';
import QuillEditor from '../components/admin/QuillEditor';
import ImageUploadArea from '../components/admin/ImageUploadArea';
import ContentSections from '../components/admin/ContentSections';
import PageHeaderForm from '../components/admin/PageHeaderForm';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { useAdminUser } from '../contexts/AdminUserContext';

const API_URL = `${API_BASE_URL}/blog.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071',
  hero_badge: 'SIF Media Center',
  hero_title_line1: 'Blog e',
  hero_title_highlight: 'Notícias',
  hero_subtitle: 'Conhecimento técnico, inovações e as principais atualizações da Sociedade de Investigações Florestais.',
  hero_scroll_label: '',
};

const AVAILABLE_TAGS = [
  'Silvicultura', 'Inovação', 'Sustentabilidade', 'Tecnologia',
  'Mercado', 'Pesquisa', 'Eventos', 'UFV', 'Manejo', 'Celulose',
];

export default function BlogAdmin() {
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageFile: null, sections: [], gt_id: '', responsavel_ids: [] });
  // Permissões: quem tem o módulo Blog (ou é admin) publica em qualquer lugar;
  // responsável por GT publica só no blog dos seus grupos.
  const { user: me } = useAdminUser();
  const fullBlog = me?.role === 'admin' || !!me?.modules?.includes('blog');
  const myGtIds = (me?.gt_ids || []).map(Number);
  const [gts, setGts] = useState([]);
  const [people, setPeople] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/gt.php?admin=1`).then(r => r.json()).then(d => setGts(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API_BASE_URL}/users.php?responsaveis=1`).then(r => r.json()).then(d => setPeople(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);
  const gtOptions = fullBlog ? gts : gts.filter(g => myGtIds.includes(Number(g.id)));
  const gtTitle = (id) => gts.find(g => Number(g.id) === Number(id))?.title;
  const newPost = async () => {
    if (!(await canLeave())) return;
    setFormData(f => ({ ...f, gt_id: fullBlog ? '' : (myGtIds[0] || ''), responsavel_ids: me?.id ? [me.id] : [] }));
    setView('form');
  };
  const formRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { dirty } = useDirty({ formData: { ...formData, imageFile: !!formData.imageFile }, selectedTags }, { ready: view === 'form', settleMs: 1200 });

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}?admin=1`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
      setError('Não foi possível carregar as publicações. Verifique sua conexão.');
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleToggleActive = async (post) => {
    const fd = new FormData();
    fd.append('toggle_active', '1');
    fd.append('id', post.id);
    fd.append('active', post.active == 1 ? 0 : 1);
    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(post.active == 1 ? 'Ocultado do site.' : 'Publicado no site.');
      fetchPosts();
    } catch (err) { toastError(err); }
  };

  const toggleTag = (tag) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  // Exclusão com a confirmação padrão do painel
  const requestDelete = async (post) => {
    if (!(await confirm({ title: 'Excluir esta publicação?', message: post.title }))) return;
    setLoading(true);
    try {
      await apiRequest(`${API_URL}?id=${post.id}`, { method: 'DELETE' });
      window.showToast?.('Publicação excluída.');
      await fetchPosts();
    } catch (err) {
      toastError(err);
    } finally { setLoading(false); }
  };

  const handleEdit = async (post) => {
    if (!(await canLeave())) return; // cabeçalho/contato com edição não salva
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}?slug=${post.slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const fullPost = await res.json();
      if (!fullPost?.id) throw new Error('Publicação não encontrada');

      let sections = [];
      if (fullPost.extra_data) {
        try { sections = JSON.parse(fullPost.extra_data).sections || []; } catch {}
      }
      setEditingId(fullPost.id);
      let respIds = [];
      try { respIds = JSON.parse(fullPost.responsavel_ids || '[]'); } catch {}
      setFormData({ title: fullPost.title || '', content: fullPost.content || '', imageFile: null, sections, gt_id: fullPost.gt_id || '', responsavel_ids: Array.isArray(respIds) ? respIds.map(Number) : [] });
      setSelectedTags(fullPost.tags ? fullPost.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
      setPreview(fullPost.image_url ? getImageUrl(fullPost.image_url) : null);
      setView('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Erro ao carregar artigo:', err);
      window.showToast('Erro ao carregar os dados do artigo. Tente novamente.');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sectionsUploading) { window.showToast?.('Aguarde o envio dos arquivos terminar para salvar.', 'error'); return; }
    if (!formData.title.trim()) { window.showToast('O título é obrigatório.'); return; }
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      window.showToast('O conteúdo é obrigatório.'); return;
    }
    if (!fullBlog && !formData.gt_id && !editingId) { window.showToast('Escolha o grupo temático do post.'); return; }
    setLoading(true); setError(null);
    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('content', formData.content);
    data.append('tags', selectedTags.join(', '));
    data.append('extra_data', JSON.stringify({ sections: formData.sections }));
    data.append('gt_id', formData.gt_id || '');
    data.append('responsavel_ids', JSON.stringify(formData.responsavel_ids || []));
    if (editingId) data.append('id', editingId);
    if (formData.imageFile) data.append('image', formData.imageFile);
    if (editingId && formData.removeImage && !formData.imageFile) data.append('remove_image', '1'); // imagem removida no formulário

    try {
      await apiRequest(API_URL, { method: 'POST', body: data });
      resetForm(); await fetchPosts();
      window.showToast(editingId ? 'Artigo atualizado com sucesso!' : 'Artigo publicado com sucesso!');
    } catch (err) {
      toastError(err); // mostra a mensagem do servidor (ex.: sem permissão)
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setEditingId(null); setPreview(null);
    setFormData({ title: '', content: '', imageFile: null, sections: [], gt_id: '', responsavel_ids: [] });
    setSelectedTags([]); setView('list'); setError(null);
  };

  return (
    <AdminPage
      title={view === 'list' ? 'Blog' : (editingId ? 'Editar publicação' : 'Nova publicação')}
      subtitle={view === 'list' ? 'Gerencie as publicações do blog.' : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? ((fullBlog || myGtIds.length > 0) ? <PrimaryButton icon={Plus} onClick={newPost}>Nova publicação</PrimaryButton> : null)
        : <SecondaryButton icon={X} disabled={loading} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) resetForm(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: sectionsUploading } : undefined}
    >


      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20}/>
          <div><p className="text-red-800 font-semibold">Erro</p><p className="text-red-600 text-sm">{error}</p></div>
        </div>
      )}

      {view === 'list' && fullBlog && <PageHeaderForm pageKey="blog" defaults={HERO_DEFAULTS} title="Cabeçalho da página /blog" />}
      {view === 'list' && fullBlog && <PageContactForm pageKey="blog" title="Contato responsável pelo Blog" />}
      {view === 'list' && !fullBlog && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
          Você vê aqui os posts que pode editar: os dos seus grupos temáticos{myGtIds.length ? ` (${myGtIds.map(gtTitle).filter(Boolean).join(', ')})` : ''} e os que têm você como responsável.
        </div>
      )}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Publicações cadastradas</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {posts.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">
                {loading ? 'Carregando publicações...' : 'Nenhuma publicação encontrada. Crie a primeira!'}
              </div>
            ) : posts.map(post => (
              <div key={post.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all group ${post.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border flex-shrink-0">
                    {post.image_url ? (
                      <img src={getImageUrl(post.image_url)} className="w-full h-full object-cover" alt=""
                        onError={e => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f3f4f6"/%3E%3C/svg%3E'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-[#007a3d] transition-colors text-lg line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {post.gt_id ? <span className="text-[#007a3d] font-bold">Blog do GT: {gtTitle(post.gt_id) || post.gt_id}</span> : 'Blog geral'}
                      {post.responsaveis?.length > 0 && <> · Responsáveis: {post.responsaveis.map(r => r.name).join(', ')}</>}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  <ItemActions
                    visible={post.active == 1}
                    onToggleVisible={() => handleToggleActive(post)}
                    onEdit={() => handleEdit(post)}
                    onDelete={() => requestDelete(post)}
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
            <div>
              <input
                className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-2xl outline-none border focus:border-[#007a3d] transition-colors disabled:opacity-50"
                placeholder="Título do Post"
                value={formData.title}
                onChange={e => setFormData(f => ({...f, title: e.target.value}))}
                required maxLength={200} disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-2 ml-2">{formData.title.length}/200 caracteres</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUploadArea
                preview={preview}
                onFileChange={file => {
                  if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
                  setPreview(URL.createObjectURL(file));
                  setFormData(f => ({...f, imageFile: file, removeImage: false}));
                }}
                onClear={() => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview); setPreview(null); setFormData(f => ({...f, imageFile: null, removeImage: true})); }}
                height="h-56"
                label="Imagem de Capa (Hero)"
                hint="Máximo 10MB (JPG, PNG, WebP)"
              />
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Tags do Artigo</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} disabled={loading}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border disabled:opacity-50 ${
                        selectedTags.includes(tag)
                          ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 ml-2">{selectedTags.length} tag(s) selecionada(s)</p>
              </div>
            </div>

            {/* GRUPO TEMÁTICO + RESPONSÁVEIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Grupo temático {fullBlog ? '(opcional)' : '*'}</label>
                <select className="w-full p-3 bg-white rounded-xl border text-sm outline-none focus:border-[#007a3d]"
                  value={formData.gt_id || ''} onChange={e => setFormData(f => ({ ...f, gt_id: e.target.value }))} disabled={loading}>
                  {fullBlog && <option value="">Nenhum — post do blog geral</option>}
                  {!fullBlog && !formData.gt_id && <option value="">Escolha...</option>}
                  {gtOptions.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                  {formData.gt_id && !gtOptions.some(g => String(g.id) === String(formData.gt_id)) && <option value={formData.gt_id}>{gtTitle(formData.gt_id) || `GT ${formData.gt_id}`}</option>}
                </select>
                <p className="text-xs text-gray-400 ml-1">Com grupo escolhido, o post aparece também na página do grupo.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Responsáveis pelo post</label>
                <div className="flex flex-wrap gap-2">
                  {people.map(p => {
                    const on = formData.responsavel_ids.includes(p.id);
                    return (
                      <button key={p.id} type="button" disabled={loading}
                        onClick={() => setFormData(f => ({ ...f, responsavel_ids: on ? f.responsavel_ids.filter(x => x !== p.id) : [...f.responsavel_ids, p.id] }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${on ? 'bg-[#007a3d] text-white border-[#007a3d]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#007a3d] hover:text-[#007a3d]'}`}>
                        {p.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 ml-1">Aparecem como autores no site e também podem editar este post.</p>
              </div>
            </div>

            <QuillEditor
              fonts
              value={formData.content}
              onChange={val => setFormData(f => ({...f, content: val}))}
              height="h-[800px]"
            />

            <ContentSections
              template="blog"
              sections={formData.sections}
              onChange={sections => setFormData(f => ({...f, sections}))}
              onUploading={setSectionsUploading}
            />

            <div className="pt-10">
              <Button type="submit" className="w-full font-bold uppercase tracking-widest rounded-2xl"
                variant="primary" isLoading={loading} disabled={loading || sectionsUploading}>
                {editingId ? 'Salvar Alterações' : 'Publicar no Blog'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminPage>
  );
}
