import React, { useState, useEffect } from 'react';
import { Save, UploadCloud, Check, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Form reutilizável para editar o cabeçalho (hero) de uma página.
// pageKey -> chave em page_content.php
// defaults -> defaults dos campos hero_*
export default function PageHeaderForm({ pageKey, defaults, title = 'Cabeçalho da página' }) {
  const [cfg, setCfg] = useState(defaults || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${pageKey}`)
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        setCfg({ ...(defaults || {}), ...incoming });
      })
      .catch(() => setCfg(defaults || {}))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError('Imagem muito pesada (máx 10MB).'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('page', pageKey);
      fd.append('content_json', JSON.stringify(cfg));
      if (file) fd.append('hero_image', file);
      const res = await fetch(PAGE_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (data && data.data) setCfg(p => ({ ...p, ...data.data }));
      setFile(null);
      setPreview(null);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch {
      setError('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;
  }

  const displayUrl = preview || (cfg.hero_image ? (cfg.hero_image.startsWith('http') ? cfg.hero_image : getImageUrl(cfg.hero_image)) : '');

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar cabeçalho'}
          </Button>
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2">Imagem de fundo do Hero</label>
          <div className="relative w-full h-36 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-500 transition-colors">
            {displayUrl ? (
              <img src={displayUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-xs text-gray-500">Clique para enviar imagem</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Badge (etiqueta verde acima do título)" value={cfg.hero_badge} onChange={v => set('hero_badge', v)} />
          <Field label="Texto do botão de scroll" value={cfg.hero_scroll_label} onChange={v => set('hero_scroll_label', v)} />
          <Field label="Título — linha 1" value={cfg.hero_title_line1} onChange={v => set('hero_title_line1', v)} />
          <Field label="Título — destaque em verde" value={cfg.hero_title_highlight} onChange={v => set('hero_title_highlight', v)} />
        </div>
        <Field label="Subtítulo" type="textarea" rows={2} value={cfg.hero_subtitle} onChange={v => set('hero_subtitle', v)} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', rows = 2 }) {
  const cls = "w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600";
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
