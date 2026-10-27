import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, pickKeys, toastError } from '../../utils/adminApi';
import { AdminCard, SaveButton, SaveStatus, ImageField, useDirty } from './kit';
import Field from './kit/Field'; // campo padrão do painel

const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Form reutilizável para editar o cabeçalho (hero) de uma página.
// pageKey -> chave em page_content.php
// defaults -> defaults dos campos hero_*
export default function PageHeaderForm({ pageKey, defaults, title = 'Cabeçalho da página' }) {
  const [cfg, setCfg] = useState(defaults || {});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false); // carregar falhou: Salvar travado
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  // Só os campos do cabeçalho entram na comparação de "não salvo"
  const heroKeys = Object.keys(cfg).filter(k => k.startsWith('hero_') || k in (defaults || {}));
  const { dirty, markClean } = useDirty(pickKeys(cfg, heroKeys), { ready: !loading, extra: !!file });

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${pageKey}`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        setCfg({ ...(defaults || {}), ...incoming });
      })
      .catch(() => { setCfg(defaults || {}); setLoadError(true); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Envia só os campos do cabeçalho (hero_*): o restante da página
      // (contato, conteúdo) fica como está no banco.
      const saved = await savePageConfig(pageKey, pickKeys(cfg, heroKeys), { hero_image: file });
      const next = { ...cfg, ...pickKeys(saved, Object.keys(saved).filter(k => k.startsWith('hero_'))) };
      setCfg(next);
      markClean(pickKeys(next, heroKeys));
      setFile(null);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
      window.showToast?.('Cabeçalho salvo.');
    } catch (err) {
      setError(err.message || 'Erro ao salvar.');
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;
  }

  return (
    <AdminCard
      title={title}
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={loadError} label="Salvar cabeçalho" /></>}
    >
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="space-y-4">
        <ImageField
          label="Imagem de fundo do cabeçalho"
          value={cfg.hero_image}
          file={file}
          onFile={setFile}
          onRemove={() => { setFile(null); set('hero_image', ''); }}
          aspect="h-40"
          hint="Imagem horizontal, de preferência 1920×1080px. Sem imagem, o cabeçalho usa o fundo verde."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Etiqueta (acima do título)" value={cfg.hero_badge} onChange={v => set('hero_badge', v)} />
          <Field label="Título (começo)" value={cfg.hero_title_line1} onChange={v => set('hero_title_line1', v)} />
          <Field label="Título (continuação, opcional)" value={cfg.hero_title_highlight} onChange={v => set('hero_title_highlight', v)} />
        </div>
        <Field label="Subtítulo" type="textarea" rows={2} value={cfg.hero_subtitle} onChange={v => set('hero_subtitle', v)} />
      </div>
    </AdminCard>
  );
}

