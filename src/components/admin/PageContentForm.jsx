import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { API_BASE_URL } from '../../apiConfig';

const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Form generico para editar campos texto de uma pagina.
// pageKey -> chave em page_content.php
// defaults -> { campo: 'valor padrao', ... }
// fields -> array de { key, label, type?: 'text'|'textarea', rows?, group? }
//   group permite agrupar campos visualmente
// title -> titulo exibido no form
export default function PageContentForm({ pageKey, defaults, fields, title = 'Conteúdo da página' }) {
  const [cfg, setCfg] = useState(defaults);
  const [otherKeys, setOtherKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${pageKey}`)
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...defaults };
        const others = {};
        for (const [k, v] of Object.entries(incoming)) {
          if (k in defaults) next[k] = v;
          else others[k] = v;
        }
        setCfg(next);
        setOtherKeys(others);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('page', pageKey);
      fd.append('content_json', JSON.stringify({ ...otherKeys, ...cfg }));
      await fetch(PAGE_URL, { method: 'POST', body: fd });
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
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
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

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
    </div>
  );
}

function Field({ label, type, value, onChange, rows }) {
  const cls = "w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600";
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea'
        ? <textarea className={`${cls} resize-y`} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input className={cls} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}
