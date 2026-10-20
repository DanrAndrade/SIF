import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Info, Layers, FolderKanban, Megaphone } from 'lucide-react';
import { AdminPage, AdminCard, SecondaryButton, ItemActions, moveItem, useDirty, useConfirm } from '../../components/admin/kit';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import ContentSections from '../../components/admin/ContentSections';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, toastError } from '../../utils/adminApi';
import { EMBRAPII_DEFAULTS, EMBRAPII_HERO_DEFAULTS } from '../../utils/embrapiiDefaults';

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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(cfg, { ready: !loading, settleMs: 1200 });
  const confirm = useConfirm();

  useEffect(() => {
    fetch(`${API_BASE_URL}/page_content.php?page=${PAGE_KEY}`)
      .then(r => r.json())
      .then(data => {
        const inc = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...EMBRAPII_DEFAULTS };
        for (const k of KEYS) if (k in inc) next[k] = inc[k];
        setCfg(next);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));
  const frentes = Array.isArray(cfg.frentes) ? cfg.frentes : [];
  const setFrente = (i, k, v) => set('frentes', frentes.map((f, j) => j === i ? { ...f, [k]: v } : f));

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
      save={{ onSave: handleSave, saving, dirty, savedAt, disabled: loading || uploading }}
      tabs={TABS} activeTab={tab} onTabChange={setTab}
    >
      {tab === 'intro' && <PageHeaderForm pageKey={PAGE_KEY} defaults={EMBRAPII_HERO_DEFAULTS} title="Cabeçalho da página" />}

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
                  <Field label="Texto" type="textarea" rows={4} value={cfg.intro_text} onChange={v => set('intro_text', v)} />
                </div>
              </AdminCard>
              <AdminCard title="Frentes de atuação (cards)" actions={<SecondaryButton icon={Plus} onClick={() => set('frentes', [...frentes, { title: '', text: '' }])}>Adicionar card</SecondaryButton>}>
                <div className="space-y-3">
                  {frentes.length === 0 && <p className="text-sm text-gray-400">Nenhum card — a faixa não aparece no site.</p>}
                  {frentes.map((f, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-end gap-3 p-3 bg-gray-50 rounded-xl">
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
                <Field label="Título" value={cfg.cta_title} onChange={v => set('cta_title', v)} />
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

function Field({ label, type = 'text', value, onChange, rows = 2 }) {
  const cls = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600';
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea'
        ? <textarea className={`${cls} resize-y`} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input className={cls} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}
