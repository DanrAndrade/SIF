import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, X, ShieldCheck, PenLine } from 'lucide-react';
import { AdminPage, AdminCard, PrimaryButton, SecondaryButton, SaveButton, ItemActions, useConfirm, useDirty, useCanLeave } from '../../components/admin/kit';
import { API_BASE_URL } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';
import { MODULE_OPTIONS, ALL_ITEMS, canOpenTab } from '../../utils/adminModules';
import { useAdminUser } from '../../contexts/AdminUserContext';

const API = `${API_BASE_URL}/users.php`;
const EMPTY = { id: 0, name: '', cargo: '', email: '', password: '', role: 'editor', modules: [], gt_ids: [], active: 1 };

const post = (body) => apiRequest(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// Painel › Gestão › Usuários (só administradores)
export default function UsuariosAdmin() {
  const { user: me, reload: reloadMe } = useAdminUser();
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [gts, setGts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // objeto do formulário ou null

  const load = async () => {
    setLoading(true);
    try { setUsers(await apiRequest(API)); } catch (err) { toastError(err); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    load();
    fetch(`${API_BASE_URL}/gt.php?admin=1`).then(r => r.json()).then(d => setGts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const remove = async (u) => {
    if (!(await confirm({ title: 'Excluir usuário?', message: `${u.name || u.email} perde o acesso ao painel. Os conteúdos que ele publicou continuam no site.`, confirmLabel: 'Excluir', danger: true }))) return;
    try { await post({ action: 'delete', id: u.id }); window.showToast?.('Usuário excluído.'); load(); }
    catch (err) { toastError(err); }
  };

  const gtName = (id) => gts.find(g => Number(g.id) === Number(id))?.title || `GT ${id}`;

  if (editing) {
    return <UserForm initial={editing} gts={gts} isSelf={editing.id === me?.id}
      onCancel={() => setEditing(null)}
      onSaved={() => { setEditing(null); load(); reloadMe(); }} />;
  }

  return (
    <AdminPage title="Usuários" subtitle="Quem acessa o painel e o que cada pessoa pode alterar."
      actions={<PrimaryButton icon={Plus} onClick={() => setEditing({ ...EMPTY })}>Novo usuário</PrimaryButton>}>

      <AdminCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex gap-3"><ShieldCheck className="text-[#007a3d] shrink-0" size={20} /><p><strong>Administrador:</strong> acessa tudo, inclusive esta tela de usuários.</p></div>
          <div className="flex gap-3"><PenLine className="text-[#007a3d] shrink-0" size={20} /><p><strong>Editor:</strong> só as áreas marcadas, uma a uma (ex.: só Vagas ou só Candidatos). Quem é <strong>responsável por um Grupo Temático</strong> pode publicar no blog daquele grupo.</p></div>
        </div>
      </AdminCard>

      {loading ? (
        <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>
      ) : (
        <div className="grid gap-3">
          {users.map(u => (
            <div key={u.id} className={`bg-white p-5 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 ${u.active ? '' : 'opacity-60'}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-[#1f2937]">{u.name || u.email}</h3>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>{u.role === 'admin' ? 'Administrador' : 'Editor'}</span>
                  {!u.active && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-600">Desativado</span>}
                  {u.id === me?.id && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-lime-50 text-lime-700">Você</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{u.email}{u.cargo ? ` · ${u.cargo}` : ''}</p>
                {u.role === 'editor' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Áreas: {u.modules.length ? u.modules.map(m => MODULE_OPTIONS.find(o => o.tab === m)?.label || m).join(', ') : 'nenhuma'}
                    {u.gt_ids.length > 0 && <> · Responsável por: {u.gt_ids.map(gtName).join(', ')}</>}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">Último acesso: {u.last_login ? new Date(u.last_login.replace(' ', 'T')).toLocaleString('pt-BR') : 'nunca'}</p>
              </div>
              <ItemActions onEdit={() => setEditing({ ...EMPTY, ...u, password: '' })} onDelete={u.id === me?.id ? undefined : () => remove(u)} />
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}

function UserForm({ initial, gts, isSelf, onCancel, onSaved }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  const canLeave = useCanLeave();
  const { dirty, markClean } = useDirty(f);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggle = (k, v) => setF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  // Cancelar com alterações: pergunta antes de descartar
  const cancel = async () => { if (await canLeave()) onCancel(); };

  const save = async () => {
    // Administrador tirando o próprio acesso total: confirma (perde a tela de usuários na hora)
    if (isSelf && initial.role === 'admin' && f.role !== 'admin' && !(await confirm({
      title: 'Deixar de ser administrador?',
      message: 'Você vai perder o acesso a esta tela e às áreas não marcadas assim que salvar. Só outro administrador poderá desfazer.',
      confirmLabel: 'Sim, mudar meu perfil', danger: true,
    }))) return;
    setSaving(true);
    try {
      await post({ action: 'save', ...f });
      markClean();
      window.showToast?.(f.id ? 'Usuário atualizado.' : 'Usuário criado. Passe o e-mail e a senha para a pessoa.');
      onSaved();
    } catch (err) { toastError(err); }
    finally { setSaving(false); }
  };

  const groups = [...new Set(MODULE_OPTIONS.map(o => o.group))];
  const input = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600';
  const label = 'block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1';

  return (
    <AdminPage title={f.id ? 'Editar usuário' : 'Novo usuário'} subtitle={f.id ? (f.name || f.email) : 'Cadastre a pessoa e escolha o que ela pode alterar.'}
      actions={<SecondaryButton icon={X} onClick={cancel}>Cancelar</SecondaryButton>}
      save={{ onSave: save, saving, dirty, label: f.id ? 'Salvar usuário' : 'Criar usuário' }}>

      <AdminCard title="Dados de acesso">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>Nome *</label><input className={input} value={f.name} onChange={e => set('name', e.target.value)} /></div>
          <div><label className={label}>Cargo (aparece como autor no blog)</label><input className={input} value={f.cargo} onChange={e => set('cargo', e.target.value)} /></div>
          <div><label className={label}>E-mail (login) *</label><input className={input} type="email" autoComplete="off" value={f.email} onChange={e => set('email', e.target.value)} /></div>
          <div>
            <label className={label}>{f.id ? 'Nova senha (deixe vazio para manter)' : 'Senha * (mín. 8 caracteres)'}</label>
            <input className={input} type="password" autoComplete="new-password" value={f.password} onChange={e => set('password', e.target.value)} />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer w-fit">
          <input type="checkbox" className="w-4 h-4 accent-[#007a3d]" checked={!!f.active} disabled={isSelf} onChange={e => set('active', e.target.checked ? 1 : 0)} />
          Acesso ativo {isSelf && <span className="text-xs text-gray-400">(você não pode desativar a si mesmo)</span>}
        </label>
      </AdminCard>

      <AdminCard title="Perfil">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[['admin', 'Administrador', 'Acesso total, inclusive usuários.'], ['editor', 'Editor', 'Só as áreas marcadas abaixo.']].map(([v, t, d]) => (
            <button key={v} type="button" onClick={() => set('role', v)}
              className={`text-left p-4 rounded-xl border transition-colors ${f.role === v ? 'border-[#007a3d] bg-emerald-50 ring-2 ring-[#007a3d]/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <p className="font-bold text-sm text-[#1f2937]">{t}</p><p className="text-xs text-gray-500 mt-1">{d}</p>
            </button>
          ))}
        </div>
      </AdminCard>

      <AreasCard f={f} groups={groups} onToggle={(tab) => toggle('modules', tab)} onSetModules={(mods) => set('modules', mods)} />


      <AdminCard title="Responsável por Grupos Temáticos" subtitle="Edita a página destes grupos e publica no blog com a tag deles (mesmo sem as áreas marcadas acima). Cada grupo tem um só responsável: marcar aqui substitui o atual.">
        {gts.length === 0 ? <p className="text-sm text-gray-400">Nenhum grupo temático cadastrado.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {gts.map(g => (
              <label key={g.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input type="checkbox" className="w-4 h-4 accent-[#007a3d]" checked={f.gt_ids.includes(Number(g.id))} onChange={() => toggle('gt_ids', Number(g.id))} />
                <span className="min-w-0">
                  {g.title}
                  {g.responsavel?.name && Number(g.responsavel_id) !== Number(f.id) && <span className="block text-xs text-gray-400">Hoje: {g.responsavel.name}</span>}
                </span>
              </label>
            ))}
          </div>
        )}
      </AdminCard>

      <div className="flex justify-end"><SaveButton onSave={save} saving={saving} label={f.id ? 'Salvar usuário' : 'Criar usuário'} /></div>
    </AdminPage>
  );
}

// Áreas do painel que um editor pode alterar, agrupadas como no menu lateral.
// Cada área é independente: dá para liberar só "Vagas", só "Candidatos" etc.
function AreasCard({ f, groups, onToggle, onSetModules }) {
  const isAdmin = f.role === 'admin';
  const mods = f.modules || [];
  // O que a pessoa vai ver no menu (mesma regra do painel, inclui o efeito de ser responsável por GT)
  const preview = ALL_ITEMS.filter(i => i.tab !== 'inicio' && canOpenTab({ role: f.role, modules: mods, gt_ids: f.gt_ids || [] }, i.tab));
  const setGroup = (tabs, on) => onSetModules(on ? [...new Set([...mods, ...tabs])] : mods.filter(m => !tabs.includes(m)));

  return (
    <AdminCard title="Áreas que pode alterar"
      subtitle={isAdmin ? undefined : 'Marque só o que a pessoa precisa. Ex.: para alguém que cuida apenas das vagas, marque só “Vagas”.'}>
      {isAdmin ? (
        <p className="text-sm text-gray-600">Administradores veem e alteram todas as áreas, inclusive Usuários e permissões. Para limitar o acesso, escolha o perfil <strong>Editor</strong>.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
            <button type="button" onClick={() => onSetModules(MODULE_OPTIONS.map(o => o.tab))} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#007a3d] hover:text-[#007a3d]">Marcar todas</button>
            <button type="button" onClick={() => onSetModules([])} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#007a3d] hover:text-[#007a3d]">Desmarcar todas</button>
            <span className="text-gray-400 ml-auto">{mods.filter(m => MODULE_OPTIONS.some(o => o.tab === m)).length} de {MODULE_OPTIONS.length} áreas</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groups.map(g => {
              const opts = MODULE_OPTIONS.filter(o => o.group === g);
              const tabs = opts.map(o => o.tab);
              const n = tabs.filter(t => mods.includes(t)).length;
              return (
                <fieldset key={g} className="rounded-xl border border-gray-200 overflow-hidden">
                  <legend className="sr-only">{g}</legend>
                  <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer">
                    <GroupCheck checked={n === tabs.length} partial={n > 0 && n < tabs.length} onChange={(on) => setGroup(tabs, on)} />
                    <span className="text-sm font-semibold text-gray-800 flex-1">{g}</span>
                    <span className="text-xs text-gray-400">{n === tabs.length ? 'grupo inteiro' : `${n} de ${tabs.length}`}</span>
                  </label>
                  <div className="divide-y divide-gray-100">
                    {opts.map(o => (
                      <label key={o.tab} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-emerald-50/40">
                        <input type="checkbox" className="mt-0.5 w-4 h-4 accent-[#007a3d] shrink-0" checked={mods.includes(o.tab)} onChange={() => onToggle(o.tab)} />
                        <span className="min-w-0">
                          <span className="block text-sm text-gray-800">{o.label}</span>
                          {o.desc && <span className="block text-xs text-gray-500 mt-0.5">{o.desc}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-5 rounded-xl bg-emerald-50/60 border border-emerald-100 px-4 py-3" aria-live="polite">
        <p className="text-xs font-semibold text-emerald-800 mb-1.5">Este usuário verá no menu:</p>
        {isAdmin ? (
          <p className="text-sm text-gray-700">Todas as telas do painel.</p>
        ) : (
          <p className="text-sm text-gray-700">
            Início{preview.length ? ', ' + preview.map(i => i.label).join(', ') : ''}.
            {preview.length === 0 && <span className="text-amber-700"> Nenhuma área marcada: a pessoa entra no painel, mas não consegue alterar nada.</span>}
          </p>
        )}
      </div>
    </AdminCard>
  );
}

// Caixa "marcar grupo inteiro" (fica com traço quando só parte do grupo está marcada)
function GroupCheck({ checked, partial, onChange }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = partial; }, [partial]);
  return <input ref={ref} type="checkbox" className="w-4 h-4 accent-[#007a3d]" checked={checked} aria-label="Marcar grupo inteiro" onChange={e => onChange(e.target.checked)} />;
}
