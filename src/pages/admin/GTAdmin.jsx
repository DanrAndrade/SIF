import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useConfirm, AdminPage, AdminCard, PrimaryButton, SecondaryButton, ItemActions, useDirty, SaveButton, ImageField, useCanLeave, Field } from '../../components/admin/kit';
import { X, Plus } from 'lucide-react';
import ImageUploadArea from '../../components/admin/ImageUploadArea';
import ContentSections from '../../components/admin/ContentSections';
import { withGtDefaults, normalizeSections, htmlExcerpt } from '../../components/sections/sectionTypes';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageTextsForm from '../../components/admin/PageTextsForm';
import { GT_LIST_TEXTS } from '../../utils/pageTextDefaults';
import { generateSlug } from '../../utils/helpers';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { apiRequest, toastError, uploadImageNow } from '../../utils/adminApi';
import { useAdminUser } from '../../contexts/AdminUserContext';
import { canManageAllGts } from '../../utils/adminModules';

const API_URL = `${API_BASE_URL}/gt.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070',
  hero_badge: 'Clusters de Pesquisa',
  hero_title_line1: 'Grupos',
  hero_title_highlight: 'Temáticos',
  hero_subtitle: 'Cooperação técnica especializada em áreas chave para a excelência do setor florestal.',
  hero_scroll_label: 'Ver Grupos',
};

// Perfil público do responsável (vem do usuário do painel)
const PROFILE_KEYS = ['name', 'cargo', 'photo', 'whatsapp', 'link', 'link_label', 'contact_email'];
const emptyResp = {
  tab: 'user',          // 'user' (escolher usuário) | 'new' (criar usuário aqui)
  origId: 0,            // responsável salvo no GT
  id: 0,                // responsável escolhido agora (0 = nenhum)
  profile: {},          // perfil do escolhido (editável)
  profileDirty: false,
  novo: { name: '', cargo: '', email: '', password: '', photo: '', whatsapp: '', link: '', link_label: '', contact_email: '' },
};

const emptyForm = {
  title: '', description: '', color: '#007a3d',
  imageFile: null, image_url: '',
  content_title: '',
  content_subtitle: '',
  summary: '', // resumo curto: topo da página e card da lista
  sections: [],
  resp: emptyResp,
  legacyResp: null, // responsável antigo em texto (extra_data.responsavel), até escolher um usuário
  extraRest: {}, // outras chaves do extra_data que esta tela não edita
};

export default function GTAdmin() {
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const { user: me, reload: reloadMe } = useAdminUser();
  const full = canManageAllGts(me);
  const [gts, setGts] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [sectionsUploading, setSectionsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const formRef = useRef(null);
  const { dirty } = useDirty(formData, { ready: view === 'form', settleMs: 1200 });

  useEffect(() => { fetchGts(); fetchUsers(); }, []);

  const fetchGts = async () => {
    try {
      const res = await fetch(`${API_URL}?admin=1&mine=1`);
      const data = await res.json();
      setGts(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Erro ao carregar GTs:', err); }
  };
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users.php?responsaveis=1`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { setUsers([]); }
  };

  const respFromGt = (gt) => {
    const id = Number(gt?.responsavel_id) || 0;
    const src = gt?.responsavel || {};
    return {
      ...emptyResp, origId: id, id,
      // gt.php devolve "role" = cargo
      profile: id ? { name: src.name || '', cargo: src.role || '', photo: src.photo || '', whatsapp: src.whatsapp || '', link: src.link || '', link_label: src.link_label || '', contact_email: undefined } : {}, // e-mail de contato vem da lista de usuários; sem ela, não é enviado
    };
  };

  const handleEdit = async (gt) => {
    if (!(await canLeave())) return; // cabeçalho com edição não salva
    let sections = [];
    let legacyResp = null;
    let extraRest = {};
    let summaryLoaded = '';
    if (gt.extra_data) {
      try {
        const { sections: s, responsavel: r, summary: sm, ...rest } = JSON.parse(gt.extra_data) || {};
        sections = s || [];
        summaryLoaded = sm || '';
        legacyResp = r && (r.name || r.email || r.whatsapp) ? r : null;
        extraRest = rest;
      } catch {}
    }
    const resp = respFromGt(gt);
    // Perfil completo (e-mail de contato) vem da lista de usuários
    const u = users.find(x => x.id === resp.id);
    if (u) resp.profile = pickProfile(u);
    setEditingId(gt.id);
    setFormData({
      title: gt.title, description: gt.description,
      color: gt.color || '#007a3d', imageFile: null,
      image_url: gt.image_url || '',
      content_title: gt.content_title || '',
      content_subtitle: gt.content_subtitle || '',
      summary: summaryLoaded,
      // Páginas antigas: o texto principal vira o bloco "Apresentação"; blog e responsável entram no fim
      sections: withGtDefaults(sections, gt.description || ''),
      resp, legacyResp, extraRest,
    });
    setPreview(gt.image_url || null);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!(await confirm({ title: 'Excluir este Grupo Temático?', message: 'A página pública do grupo sai do site. Não dá para desfazer.' }))) return;
    try {
      await apiRequest(`${API_URL}?id=${id}`, { method: "DELETE" }); // erro (ex.: sem permissão) aparece
      fetchGts();
    } catch (err) { toastError(err); }
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
    if (sectionsUploading) { window.showToast?.('Aguarde o envio dos arquivos terminar para salvar.', 'error'); return; }
    const r = formData.resp;
    if (full && r.tab === 'new') {
      const n = r.novo;
      if (!n.name.trim()) { window.showToast?.('Informe o nome do novo responsável.', 'error'); return; }
      if (!/^\S+@\S+\.\S+$/.test(n.email.trim())) { window.showToast?.('Informe um e-mail válido para o novo responsável.', 'error'); return; }
      if ((n.password || '').length < 8) { window.showToast?.('A senha inicial precisa ter pelo menos 8 caracteres.', 'error'); return; }
    }
    setLoading(true);
    const fd = new FormData();
    // Na edição mantém o link (slug) já publicado — corrigir o título não quebra links divulgados
    fd.append('slug', (editingId && gts.find(x => x.id == editingId)?.slug) || generateSlug(formData.title));
    fd.append('title', formData.title);
    // O texto do bloco "Apresentação" também vai para description (busca, lista e compatibilidade)
    const intro = normalizeSections(formData.sections).find(s => s.type === 'gt_intro');
    fd.append('description', intro ? (intro.content || '') : (formData.description || ''));
    fd.append('icon', 'Target');
    fd.append('color', formData.color);
    fd.append('bg_color', formData.color + '22');
    fd.append('content_title', intro?.title || formData.content_title || '');
    fd.append('content_subtitle', formData.content_subtitle || '');

    // Responsável
    let mode = 'keep';
    if (full) {
      if (r.tab === 'new') mode = 'new';
      else if (r.id !== r.origId) mode = r.id ? 'existing' : 'none';
    }
    const willHaveUser = mode === 'new' || (mode !== 'none' && r.id);
    fd.append('responsavel_mode', mode);
    if (mode === 'existing') fd.append('responsavel_id', String(r.id));
    // campo que não foi carregado (undefined) não vai: assim não apaga o que está salvo
    const putProfile = (p) => PROFILE_KEYS.forEach(k => { if (p[k] !== undefined) fd.append(`resp_${k}`, p[k] || ''); });
    if (mode === 'new') {
      putProfile(r.novo);
      fd.append('resp_email', r.novo.email.trim());
      fd.append('resp_password', r.novo.password);
    } else if (r.id && r.profileDirty) {
      fd.append('resp_profile', '1');
      putProfile(r.profile);
    }
    // Texto antigo some quando o grupo passa a ter um usuário como responsável
    const extra = { ...formData.extraRest, summary: formData.summary || '', sections: formData.sections };
    if (!willHaveUser && formData.legacyResp) extra.responsavel = formData.legacyResp;
    fd.append('extra_data', JSON.stringify(extra));
    if (editingId) fd.append('id', editingId);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    if (editingId && formData.removeImage && !formData.imageFile) fd.append('remove_image', '1'); // imagem removida no formulário

    try {
      await apiRequest(API_URL, { method: 'POST', body: fd });
      window.showToast?.(editingId ? 'Grupo temático salvo.' : 'Grupo temático publicado.');
      resetForm(); fetchGts(); fetchUsers(); reloadMe?.();
    } catch (err) { toastError(err); } // em erro o formulário continua aberto
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null); setPreview(null);
    setFormData(emptyForm); setView('list');
  };

  const setResp = (patch) => setFormData(f => ({ ...f, resp: typeof patch === 'function' ? patch(f.resp) : { ...f.resp, ...patch } }));

  return (
    <AdminPage
      title={view === 'list' ? 'Grupos Temáticos' : (editingId ? 'Editar Grupo' : 'Novo Grupo Temático')}
      subtitle={view === 'list'
        ? (full ? 'Gerencie os clusters de pesquisa e inovação da SIF' : 'Os grupos temáticos pelos quais você é responsável')
        : 'Preencha os campos e clique em Salvar. Cancelar volta para a lista sem salvar.'}
      actions={view === 'list'
        ? (full ? <PrimaryButton icon={Plus} onClick={async () => { if (await canLeave()) setView('form'); }}>Novo grupo temático</PrimaryButton> : null)
        : <SecondaryButton icon={X} onClick={async () => { if (!dirty || await confirm({ title: 'Descartar alterações?', message: 'O que foi editado neste formulário será perdido.', confirmLabel: 'Descartar' })) resetForm(); }}>Cancelar</SecondaryButton>}
      save={view === 'form' ? { onSave: () => formRef.current?.requestSubmit(), saving: loading, dirty, disabled: sectionsUploading } : undefined}
    >

      {view === 'list' && full && <PageHeaderForm pageKey="gt" defaults={HERO_DEFAULTS} title="Cabeçalho da página /grupos-tematicos" />}
      {view === 'list' && full && <PageTextsForm pageKey="gt" spec={GT_LIST_TEXTS} title="Textos da página /grupos-tematicos" />}

      {/* LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">{full ? 'Grupos temáticos cadastrados' : 'Seus grupos temáticos'}</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {gts.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">{full ? 'Nenhum grupo cadastrado.' : 'Você ainda não é responsável por nenhum grupo.'}</div>
            ) : gts.map(gt => (
              <div key={gt.id} className={`px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors ${gt.active == 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4 min-w-0">
                  {gt.image_url
                    ? <img src={getImageUrl(gt.image_url, 160)} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    : <span className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white font-semibold" style={{ backgroundColor: gt.color || '#007a3d' }}>{(gt.title || '?').trim().charAt(0).toUpperCase()}</span>}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{gt.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      /{gt.slug} · {gt.responsavel?.name ? `Responsável: ${gt.responsavel.name}` : 'Sem responsável'}
                    </p>
                  </div>
                </div>
                <ItemActions
                  visible={gt.active == 1}
                  onToggleVisible={full ? () => handleToggleActive(gt) : undefined}
                  onEdit={() => handleEdit(gt)}
                  onDelete={full ? () => handleDelete(gt.id) : undefined}
                />
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

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Resumo (aparece no topo da página e no card da lista de grupos)</label>
              <textarea rows={3} maxLength={320} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none border focus:border-[#007a3d] resize-y"
                placeholder={htmlExcerpt(formData.description, 200) || 'Uma ou duas frases sobre o grupo.'}
                value={formData.summary || ''} onChange={e => setFormData(f => ({ ...f, summary: e.target.value }))} />
              <p className="text-xs text-gray-400 ml-1">{(formData.summary || '').length}/320 · Vazio: usa o começo do texto de apresentação.</p>
            </div>

            <ResponsavelCard
              resp={formData.resp} setResp={setResp} users={users} full={full} me={me}
              legacy={formData.legacyResp} onClearLegacy={() => setFormData(f => ({ ...f, legacyResp: null }))}
              onUploading={setSectionsUploading}
            />

            <ContentSections
              template="gt" autoTemplate={!editingId} bands title="Blocos da página do grupo"
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

const pickProfile = (u) => Object.fromEntries(PROFILE_KEYS.map(k => [k, u?.[k] || '']));

// Campo de login do novo usuário (sem preenchimento automático do navegador,
// que colocaria o e-mail/senha de quem está logado)
function LoginInput({ label, hint, onChange, ...props }) {
  const id = React.useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[13px] font-semibold text-gray-600 mb-1.5">{label}</label>
      <input id={id} {...props} value={props.value || ''} onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 outline-none transition-colors focus:border-[#007a3d]" />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// Campos do perfil público (nome, cargo, foto, contatos)
function ProfileFields({ value, onChange, onUploading, readOnly, withLogin }) {
  const v = value || {};
  const [busy, setBusy] = useState(false);
  const set = (k) => (val) => onChange({ ...v, [k]: val });
  const onPhoto = async (file) => {
    setBusy(true); onUploading?.(true);
    try { const url = await uploadImageNow(file); if (url) onChange(cur => ({ ...cur, photo: url })); }
    catch (err) { toastError(err); }
    finally { setBusy(false); onUploading?.(false); }
  };
  if (readOnly) {
    return (
      <div className="flex items-center gap-4">
        {v.photo
          ? <img src={getImageUrl(v.photo, 160)} alt="" className="w-16 h-16 rounded-2xl object-cover" />
          : <span className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center font-semibold">{(v.name || '?').charAt(0).toUpperCase()}</span>}
        <div className="text-sm">
          <p className="font-semibold text-gray-900">{v.name}</p>
          {v.cargo && <p className="text-gray-500">{v.cargo}</p>}
          <p className="text-xs text-gray-400 mt-1">Só um administrador pode alterar este perfil.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
      <ImageField label={busy ? 'Enviando...' : 'Foto'} value={v.photo} onFile={onPhoto} onRemove={() => set('photo')('')} aspect="h-44" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome" value={v.name} onChange={set('name')} />
        <Field label="Cargo / função" value={v.cargo} onChange={set('cargo')} placeholder="Ex.: Coordenador(a) do GT" />
        {withLogin && <LoginInput label="E-mail de acesso ao painel" type="email" autoComplete="off" value={v.email} onChange={set('email')} hint="Usado só para entrar no painel. Não aparece no site." />}
        {withLogin && <LoginInput label="Senha inicial" type="password" autoComplete="new-password" value={v.password} onChange={set('password')} hint="Mínimo de 8 caracteres. Envie para a pessoa trocar no primeiro acesso." />}
        <Field label="E-mail de contato no site" type="email" value={v.contact_email ?? ''} onChange={set('contact_email')} hint="Opcional. Vazio: o site não mostra e-mail (o e-mail de acesso nunca aparece)." />
        <Field label="WhatsApp" value={v.whatsapp} onChange={set('whatsapp')} placeholder="Somente números, com DDD" />
        <Field label="Link (Lattes, LinkedIn...)" value={v.link} onChange={set('link')} placeholder="https://" />
        <Field label="Texto do link" value={v.link_label} onChange={set('link_label')} placeholder="Ver perfil" />
      </div>
    </div>
  );
}

// Responsável pelo grupo = um usuário do painel. Ele passa a poder editar
// esta página e publicar no blog com a tag deste grupo.
function ResponsavelCard({ resp, setResp, users, full, me, legacy, onClearLegacy, onUploading }) {
  const r = resp || emptyResp;
  const chosen = users.find(u => u.id === r.id);
  const options = useMemo(() => [...users].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR')), [users]);
  // Pode alterar o perfil do escolhido? (o servidor confere de novo)
  const canEditProfile = !!r.id && (r.id === me?.id || me?.role === 'admin' || (full && chosen?.role !== 'admin'));
  const pick = (id) => {
    const u = users.find(x => x.id === id);
    setResp({ id, profile: u ? pickProfile(u) : {}, profileDirty: false });
  };
  const setProfile = (p) => setResp(cur => ({ ...cur, profile: typeof p === 'function' ? p(cur.profile) : p, profileDirty: true }));
  const setNovo = (p) => setResp(cur => ({ ...cur, novo: typeof p === 'function' ? p(cur.novo) : p }));
  const fromLegacy = () => setResp(cur => ({
    ...cur, tab: 'new',
    novo: { ...cur.novo, name: legacy?.name || '', cargo: legacy?.role || '', email: legacy?.email || '', photo: legacy?.photo || '', whatsapp: legacy?.whatsapp || '', link: legacy?.link || '', link_label: legacy?.link_label || '' },
  }));
  const tabBtn = (tab, label) => (
    <button type="button" onClick={() => setResp({ tab })}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${r.tab === tab ? 'bg-[#007a3d] text-white' : 'text-gray-600 hover:text-[#007a3d]'}`}>
      {label}
    </button>
  );

  return (
    <AdminCard title="Responsável por este grupo"
      subtitle="O responsável aparece no fim da página do grupo e entra no painel para editar esta página e publicar no blog com a tag deste grupo.">
      {!full ? (
        r.id
          ? <ProfileFields value={r.profile} onChange={setProfile} onUploading={onUploading} readOnly={!canEditProfile} />
          : <p className="text-sm text-gray-500">Este grupo ainda não tem responsável.</p>
      ) : (
        <div className="space-y-5">
          <div className="inline-flex p-1 rounded-full bg-gray-100">
            {tabBtn('user', 'Escolher usuário do painel')}
            {tabBtn('new', 'Criar novo usuário')}
          </div>

          {r.tab === 'user' && (
            <>
              <div className="max-w-md">
                <label htmlFor="gt-resp-user" className="block text-[13px] font-semibold text-gray-600 mb-1.5">Usuário responsável</label>
                <select id="gt-resp-user" value={r.id || ''} onChange={e => pick(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d]">
                  <option value="">Sem responsável</option>
                  {options.map(u => <option key={u.id} value={u.id}>{u.name}{u.cargo ? ` (${u.cargo})` : ''}</option>)}
                </select>
                {r.id !== r.origId && <p className="text-xs text-amber-700 mt-1.5">{r.id ? 'Ao salvar, esta pessoa passa a ser a responsável pelo grupo.' : 'Ao salvar, o grupo fica sem responsável.'}</p>}
              </div>
              {r.id > 0 && <ProfileFields value={r.profile} onChange={setProfile} onUploading={onUploading} readOnly={!canEditProfile} />}
            </>
          )}

          {r.tab === 'new' && (
            <>
              <p className="text-sm text-gray-500">Cria um acesso ao painel só com permissão para este grupo (página e blog do grupo).</p>
              <ProfileFields value={r.novo} onChange={setNovo} onUploading={onUploading} withLogin />
            </>
          )}

          {legacy && !r.origId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p>
                Responsável antigo, cadastrado só como texto: <strong>{legacy.name || legacy.email}</strong>.
                Ele continua aparecendo no site até você escolher ou criar um usuário.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" onClick={fromLegacy} className="px-3 py-1.5 rounded-full bg-white border border-amber-300 text-xs font-semibold hover:border-amber-500">Criar usuário com estes dados</button>
                <button type="button" onClick={onClearLegacy} className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 hover:underline">Apagar o texto antigo</button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminCard>
  );
}
