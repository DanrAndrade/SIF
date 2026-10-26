import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Info, Layers, FolderKanban, Megaphone } from 'lucide-react';
import { AdminPage, AdminCard, SecondaryButton, ItemActions, moveItem, useDirty, useConfirm, ImageField } from '../../components/admin/kit';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import ContentSections from '../../components/admin/ContentSections';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, toastError, uploadImageNow } from '../../utils/adminApi';
import { EMBRAPII_DEFAULTS, EMBRAPII_HERO_DEFAULTS } from '../../utils/embrapiiDefaults';
import Field from '../../components/admin/kit/Field'; // campo padrão do painel

const PAGE_KEY = 'embrapii';
const TABS = [
  { id: 'intro',    label: 'Apresentação', icon: Info },
  { id: 'secoes',   label: 'Seções',       icon: Layers },
  { id: 'projetos', label: 'Projetos',     icon: FolderKanban },
  { id: 'cta',      label: 'Chamada final', icon: Megaphone },
];
const KEYS = Object.keys(EMBRAPII_DEFAULTS);

// Painel › Páginas › Projetos SIF e EMBRAPII (/projetos-sif-embrapii)
export default function EmbrapiiAdmin() {
  const [tab, setTab] = useState('intro');
  const [cfg, setCfg] = useState(EMBRAPII_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false); // carregar falhou: Salvar travado
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(cfg, { ready: !loading, settleMs: 1200 });
  const confirm = useConfirm();

  useEffect(() => {
    fetch(`${API_BASE_URL}/page_content.php?page=${PAGE_KEY}`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const inc = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...EMBRAPII_DEFAULTS };
        for (const k of KEYS) if (k in inc) next[k] = inc[k];
        setCfg(next);
      })
      .catch(() => { setLoadError(true); window.showToast?.('Não foi possível carregar os dados desta tela. Recarregue a página antes de salvar (para não apagar o conteúdo).', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));
  const frentes = Array.isArray(cfg.frentes) ? cfg.frentes : [];
  const setFrente = (i, k, v) => setCfg(p => ({ ...p, frentes: (p.frentes || []).map((f, j) => j === i ? { ...f, [k]: v } : f) }));
  // Envia a foto na hora e grava o caminho no campo (k) ou no card (i)
  const sendImage = async (file, apply) => {
    setUploading(true);
    try { const url = await uploadImageNow(file); if (url) apply(url); }
    catch (err) { toastError(err); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toSave = Object.fromEntries(KEYS.map(k => [k, cfg[k]]));
      await savePageConfig(PAGE_KEY, toSave);
      markClean(cfg);
      window.showToast?.('Página Projetos SIF e EMBRAPII salva.');
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) { toastError(err); }
    finally { setSaving(false); }
  };

  return (
    <AdminPage
      title="Projetos SIF e EMBRAPII"
      subtitle="Página /projetos-sif-embrapii. O cabeçalho tem botão próprio; o resto é salvo pelo botão do topo."
      save={{ onSave: handleSave, saving, dirty, savedAt, disabled: loading || uploading || loadError }}
      tabs={TABS} activeTab={tab} onTabChange={setTab}
    >
      <div className={tab === 'intro' ? '' : 'hidden'}><PageHeaderForm pageKey={PAGE_KEY} defaults={EMBRAPII_HERO_DEFAULTS} title="Cabeçalho da página" /></div>

      {loading ? (
        <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>
      ) : (
        <>
          {tab === 'intro' && (
            <>
              <AdminCard title="Apresentação">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Etiqueta" value={cfg.intro_tag} onChange={v => set('intro_tag', v)} />
                    <Field label="Título" value={cfg.intro_title} onChange={v => set('intro_title', v)} />
                  </div>
                  <Field label="Texto (deixe uma linha em branco entre parágrafos; o primeiro aparece em destaque)" type="textarea" rows={6} value={cfg.intro_text} onChange={v => set('intro_text', v)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageField label="Foto ao lado da apresentação" value={cfg.intro_image} onFile={f => sendImage(f, u => set('intro_image', u))} onRemove={() => set('intro_image', '')} aspect="h-40" />
                    <ImageField label="Foto de fundo da faixa do vídeo" value={cfg.band_photo} onFile={f => sendImage(f, u => set('band_photo', u))} onRemove={() => set('band_photo', '')} aspect="h-40" />
                  </div>
                </div>
              </AdminCard>
              <AdminCard title="Frentes de atuação (cards com foto)" actions={<SecondaryButton icon={Plus} onClick={() => set('frentes', [...frentes, { title: '', text: '', image: '' }])}>Adicionar card</SecondaryButton>}>
                <div className="space-y-3">
                  <div className="md:w-1/3"><Field label="Etiqueta acima dos cards" value={cfg.frentes_tag} onChange={v => set('frentes_tag', v)} /></div>
                  {frentes.length === 0 && <p className="text-sm text-gray-400">Nenhum card — a faixa não aparece no site.</p>}
                  {frentes.map((f, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-end gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="md:w-40 shrink-0"><ImageField value={f.image} onFile={file => sendImage(file, u => setFrente(i, 'image', u))} onRemove={() => setFrente(i, 'image', '')} aspect="h-24" /></div>
                      <div className="md:w-1/3"><Field label="Título" value={f.title} onChange={v => setFrente(i, 'title', v)} /></div>
                      <div className="flex-1"><Field label="Texto" value={f.text} onChange={v => setFrente(i, 'text', v)} /></div>
                      <ItemActions onMove={d => set('frentes', moveItem(frentes, i, d))} isFirst={i === 0} isLast={i === frentes.length - 1}
                        onDelete={async () => { if (await confirm({ title: 'Remover card?', message: f.title || '', confirmLabel: 'Remover', danger: true })) set('frentes', frentes.filter((_, j) => j !== i)); }} />
                    </div>
                  ))}
                </div>
              </AdminCard>
            </>
          )}

          {tab === 'secoes' && (
            <AdminCard title="Seções da página" subtitle="Blocos de texto, abas, PDFs ou logos — na ordem em que aparecem no site.">
              <ContentSections sections={cfg.sections || []} onChange={s => set('sections', s)} onUploading={setUploading} />
            </AdminCard>
          )}

          {tab === 'projetos' && (
            <AdminCard title="Bloco de projetos">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#007a3d]" checked={cfg.projects_enabled !== false} onChange={e => set('projects_enabled', e.target.checked)} />
                  Mostrar os projetos em andamento (vêm do cadastro em Projetos P&amp;D)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Etiqueta" value={cfg.projects_tag} onChange={v => set('projects_tag', v)} />
                  <Field label="Título" value={cfg.projects_title} onChange={v => set('projects_title', v)} />
                  <Field label="Quantos mostrar" value={String(cfg.projects_limit ?? 6)} onChange={v => set('projects_limit', v.replace(/\D/g, '').slice(0, 2))} />
                </div>
              </div>
            </AdminCard>
          )}

          {tab === 'cta' && (
            <AdminCard title="Chamada final">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Etiqueta" value={cfg.cta_tag} onChange={v => set('cta_tag', v)} />
                  <div className="md:col-span-2"><Field label="Título" value={cfg.cta_title} onChange={v => set('cta_title', v)} /></div>
                </div>
                <Field label="Texto" type="textarea" rows={3} value={cfg.cta_text} onChange={v => set('cta_text', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Botão — texto (vazio esconde)" value={cfg.cta_btn_label} onChange={v => set('cta_btn_label', v)} />
                  <Field label="Botão — link" value={cfg.cta_btn_link} onChange={v => set('cta_btn_link', v)} />
                </div>
              </div>
            </AdminCard>
          )}
        </>
      )}
    </AdminPage>
  );
}

