import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, pickKeys, toastError } from '../../utils/adminApi';
import { AdminCard, SaveButton, SaveStatus, useDirty } from './kit';
import Field from './kit/Field';

// Textos de uma página (ex.: apresentação e chamada final), salvos na mesma
// configuração do cabeçalho. Só os campos deste formulário são enviados: o
// servidor junta com o que já existe, então o cabeçalho não é apagado.
//   spec: { defaults, groups: [{ title, fields: [{ key, label, type, rows, wide }] }] }
export default function PageTextsForm({ pageKey, spec, title = 'Textos da página' }) {
  const keys = spec.groups.flatMap(g => g.fields.map(f => f.key));
  const [cfg, setCfg] = useState(spec.defaults);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(pickKeys(cfg, keys), { ready: !loading });

  useEffect(() => {
    fetch(`${API_BASE_URL}/page_content.php?page=${pageKey}`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const inc = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        setCfg({ ...spec.defaults, ...pickKeys(inc, keys.filter(k => inc[k] != null)) });
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageConfig(pageKey, pickKeys(cfg, keys));
      markClean(pickKeys(cfg, keys));
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
      window.showToast?.('Textos salvos.');
    } catch (err) { toastError(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;

  return (
    <AdminCard title={title}
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={loadError} label="Salvar textos" /></>}>
      {loadError && <p className="mb-4 text-sm text-red-600">Não foi possível carregar os textos. Recarregue a página antes de salvar.</p>}
      <div className="space-y-8">
        {spec.groups.map(g => (
          <div key={g.title}>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">{g.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {g.fields.map(f => (
                <div key={f.key} className={f.wide ? 'md:col-span-3' : ''}>
                  <Field label={f.label} type={f.type} rows={f.rows} value={cfg[f.key] ?? ''} onChange={v => set(f.key, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
