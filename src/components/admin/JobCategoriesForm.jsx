import React, { useState, useEffect } from 'react';
import { AdminCard, SaveButton, SaveStatus, useDirty, useConfirm, ItemActions, moveItem } from './kit';
import { Plus, UploadCloud, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../apiConfig';
import { savePageConfig, uploadImageNow, toastError } from '../../utils/adminApi';
import Field from './kit/Field';
import { jobCategories, jobCategory, newCategoryId, emptyResp, MODO_CANDIDATURA, MODO_DIVULGACAO } from '../../utils/jobCategories';

const selectCls = 'w-full p-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#007a3d]';
const labelCls = 'block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1';

// Categorias de vaga: criar, renomear, escolher o tipo, reordenar, definir o
// responsável e excluir. Salvas em page_configs 'jobs' → categorias_vaga.
// cats: categorias já salvas · jobs: todas as vagas (para impedir excluir categoria em uso)
export default function JobCategoriesForm({ cats, jobs = [], onSaved }) {
  const confirm = useConfirm();
  const [list, setList] = useState(cats);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const { dirty, markClean } = useDirty(list, { ready: true });

  // Categorias novas vindas do servidor (ex.: depois de salvar)
  useEffect(() => { setList(cats); markClean(cats); }, [cats]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCat = (id, patch) => setList(l => l.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const setResp = (id, patch) => setList(l => l.map(c => (c.id === id ? { ...c, resp: { ...c.resp, ...patch } } : c)));

  const add = () => setList(l => [...l, { id: newCategoryId(), nome: '', modo: MODO_CANDIDATURA, resp: emptyResp() }]);

  const usedBy = (id) => jobs.filter(j => jobCategory(j, cats) === id).length;

  const remove = async (c) => {
    if (list.length <= 1) { window.showToast?.('Mantenha ao menos uma categoria.', 'error'); return; }
    const n = usedBy(c.id);
    if (n > 0) {
      window.showToast?.(`Há ${n} vaga${n > 1 ? 's' : ''} em "${c.nome || 'esta categoria'}". Mude a categoria dessas vagas ou exclua-as antes.`, 'error');
      return;
    }
    if (!(await confirm({ title: `Excluir a categoria "${c.nome || 'sem nome'}"?`, message: 'Ela sai do site ao salvar. Nenhuma vaga usa esta categoria.', confirmLabel: 'Excluir', danger: true }))) return;
    setList(l => l.filter(x => x.id !== c.id));
  };

  const pickPhoto = async (id, e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setUploading(n => n + 1);
    try {
      const url = await uploadImageNow(f);
      if (url) setResp(id, { photo: url });
    } catch (err) { toastError(err); }
    finally { setUploading(n => n - 1); }
  };

  const handleSave = async () => {
    setError('');
    const names = list.map(c => c.nome.trim().toLowerCase());
    if (names.some(n => !n)) { setError('Toda categoria precisa de um nome.'); return; }
    if (new Set(names).size !== names.length) { setError('Duas categorias estão com o mesmo nome.'); return; }
    if (!list.length) { setError('Mantenha ao menos uma categoria.'); return; }
    setSaving(true);
    try {
      const payload = list.map(c => ({ id: c.id, nome: c.nome.trim(), modo: c.modo, resp: c.resp }));
      const saved = await savePageConfig('jobs', { categorias_vaga: payload });
      const next = jobCategories(saved);
      markClean(next);
      setList(next);
      onSaved?.(next);
      window.showToast?.('Categorias salvas.');
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar as categorias.');
      toastError(err);
    } finally { setSaving(false); }
  };

  return (
    <AdminCard
      title="Categorias de vaga"
      subtitle="Crie, renomeie, reordene e exclua as categorias. Cada uma tem um tipo e um responsável, que aparece na janela da vaga."
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={uploading > 0} label="Salvar categorias" /></>}
    >
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-5">
        {list.map((c, i) => {
          const photo = c.resp.photo ? (c.resp.photo.startsWith('http') ? c.resp.photo : getImageUrl(c.resp.photo)) : '';
          const n = usedBy(c.id);
          return (
            <div key={c.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-5">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]"><Field label="Nome da categoria" value={c.nome} onChange={v => setCat(c.id, { nome: v })} placeholder="Ex.: Vagas SIF" /></div>
                <div className="w-full sm:w-72">
                  <label className={labelCls}>Tipo</label>
                  <select className={selectCls} value={c.modo} onChange={e => setCat(c.id, { modo: e.target.value })}>
                    <option value={MODO_CANDIDATURA}>Candidatura pela SIF (recebe currículo)</option>
                    <option value={MODO_DIVULGACAO}>Só divulgação (link da empresa)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  {n > 0 && <span className="text-[11px] font-semibold text-gray-500">{n} vaga{n > 1 ? 's' : ''}</span>}
                  <ItemActions size={14} onMove={(d) => setList(l => moveItem(l, i, d))} isFirst={i === 0} isLast={i === list.length - 1} onDelete={() => remove(c)} />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                {c.modo === MODO_DIVULGACAO
                  ? 'A SIF só divulga: o site mostra os dados da vaga e leva para o link da empresa. Não há formulário nem currículo.'
                  : 'A pessoa se candidata pelo site, anexa o currículo e a SIF recebe a candidatura em Candidatos.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-5">
                <div>
                  <label className={labelCls}>Foto do responsável</label>
                  <div className="relative w-24 h-24 bg-white border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-500 transition-colors">
                    {photo
                      ? <img src={photo} alt="" className="w-full h-full object-cover" />
                      : <div className="text-center p-2"><UploadCloud className="mx-auto h-5 w-5 text-gray-400" /><p className="mt-1 text-[10px] text-gray-500">Foto</p></div>}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => pickPhoto(c.id, e)} />
                  </div>
                  {photo && <button type="button" onClick={() => setResp(c.id, { photo: '' })} className="mt-2 text-[11px] font-bold text-gray-400 hover:text-red-600">Remover foto</button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Responsável: nome" value={c.resp.name} onChange={v => setResp(c.id, { name: v })} placeholder="Nome completo" />
                  <Field label="Cargo / função" value={c.resp.role} onChange={v => setResp(c.id, { role: v })} placeholder="Cargo" />
                  <Field label="E-mail" value={c.resp.email} onChange={v => setResp(c.id, { email: v })} placeholder="email@sif.org.br" />
                  <Field label="WhatsApp (só números)" value={c.resp.whatsapp} onChange={v => setResp(c.id, { whatsapp: v })} placeholder="(DDD) 00000-0000" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button type="button" onClick={add}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1B5E20] transition-colors">
          <Plus size={16} /> Nova categoria
        </button>
        {uploading > 0 && <span className="inline-flex items-center gap-2 text-xs text-gray-500"><Loader2 size={14} className="animate-spin" /> Enviando foto...</span>}
      </div>
    </AdminCard>
  );
}
