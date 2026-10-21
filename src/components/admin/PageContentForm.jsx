import React, { useState, useEffect } from 'react';
import { AdminCard, SaveButton, SaveStatus, useDirty } from './kit';
import { Save, Check, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, toastError } from '../../utils/adminApi';
import Field from './kit/Field'; // campo padrão do painel

const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Form generico para editar campos texto de uma pagina.
// pageKey -> chave em page_content.php
// defaults -> { campo: 'valor padrao', ... }
// fields -> array de { key, label, type?: 'text'|'textarea', rows?, group? }
//   group permite agrupar campos visualmente
// title -> titulo exibido no form
export default function PageContentForm({ pageKey, defaults, fields, title = 'Conteúdo da página' }) {
  const [cfg, setCfg] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false); // carregar falhou: Salvar travado
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(cfg, { ready: !loading });

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${pageKey}`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...defaults };
        for (const [k, v] of Object.entries(incoming)) {
          if (k in defaults) next[k] = v;
        }
        setCfg(next);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // Só os campos deste formulário — o PHP preserva o resto da página.
      await savePageConfig(pageKey, cfg);
      markClean(cfg);
      window.showToast?.('Conteúdo salvo.');
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  // Agrupa fields por `group`
  const grouped = {};
  for (const f of fields) {
    const g = f.group || '__default';
    (grouped[g] = grouped[g] || []).push(f);
  }
  const groupNames = Object.keys(grouped);

  if (loading) {
    return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;
  }

  return (
    <AdminCard
      title={title}
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={loadError} label="Salvar" /></>}
    >

      <div className="space-y-5">
        {groupNames.map(groupName => (
          <div key={groupName} className={groupName !== '__default' ? 'p-4 bg-gray-50 rounded-xl' : ''}>
            {groupName !== '__default' && (
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">{groupName}</p>
            )}
            <div className={`grid ${grouped[groupName].length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {grouped[groupName].map(f => (
                <div key={f.key} className={f.fullWidth ? 'md:col-span-2' : ''}>
                  <Field
                    label={f.label}
                    type={f.type || 'text'}
                    rows={f.rows || 3}
                    value={cfg[f.key]}
                    onChange={v => set(f.key, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

