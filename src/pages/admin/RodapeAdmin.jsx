import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { AdminPage, AdminCard, SecondaryButton, ItemActions, moveItem, useDirty, useConfirm } from '../../components/admin/kit';
import { API_BASE_URL } from '../../apiConfig';
import { savePageConfig, toastError } from '../../utils/adminApi';
import { FOOTER_DEFAULTS, FOOTER_COLORS, footerBg } from '../../utils/footerDefaults';

const PAGE_KEY = 'footer';

// Painel › Páginas › Rodapé — tudo o que aparece no rodapé do site.
export default function RodapeAdmin() {
  const [cfg, setCfg] = useState(FOOTER_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(cfg, { ready: !loading });
  const confirm = useConfirm();

  useEffect(() => {
    fetch(`${API_BASE_URL}/page_content.php?page=${PAGE_KEY}`)
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...FOOTER_DEFAULTS };
        for (const [k, v] of Object.entries(incoming)) if (k in FOOTER_DEFAULTS) next[k] = v;
        if (!Array.isArray(next.nav_links)) next.nav_links = FOOTER_DEFAULTS.nav_links;
        setCfg(next);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));
  const setLink = (i, k, v) => setCfg(p => ({ ...p, nav_links: p.nav_links.map((l, j) => j === i ? { ...l, [k]: v } : l) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageConfig(PAGE_KEY, cfg);
      markClean(cfg);
      window.showToast?.('Rodapé salvo.');
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  const removeLink = async (i) => {
    const ok = await confirm({ title: 'Remover link?', message: `"${cfg.nav_links[i].label || 'sem nome'}" sai do rodapé.`, confirmLabel: 'Remover', danger: true });
    if (ok) set('nav_links', cfg.nav_links.filter((_, j) => j !== i));
  };

  return (
    <AdminPage
      title="Rodapé"
      subtitle="Textos, links, redes sociais, contato e cor do rodapé que aparece em todas as páginas."
      save={{ onSave: handleSave, saving, dirty, savedAt, disabled: loading, label: 'Salvar rodapé' }}
    >
      {loading ? (
        <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>
      ) : (
        <>
          <AdminCard title="Cor de fundo">
            <div className="flex flex-wrap gap-3">
              {Object.entries(FOOTER_COLORS).map(([key, c]) => (
                <ColorChip key={key} active={cfg.color === key} bg={c.bg} label={c.label} onClick={() => set('color', key)} />
              ))}
              <ColorChip active={cfg.color === 'custom'} bg={/^#[0-9a-f]{6}$/i.test(cfg.custom_bg) ? cfg.custom_bg : '#ffffff'} label="Personalizada" onClick={() => set('color', 'custom')} />
            </div>
            {cfg.color === 'custom' && (
              <div className="mt-4 flex items-center gap-3">
                <input type="color" value={/^#[0-9a-f]{6}$/i.test(cfg.custom_bg) ? cfg.custom_bg : '#0f3d24'} onChange={e => set('custom_bg', e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                <Field label="Código da cor (ex.: #0f3d24)" value={cfg.custom_bg} onChange={v => set('custom_bg', v.trim())} />
              </div>
            )}
            <div className="mt-4 rounded-2xl p-5 text-white text-sm" style={{ backgroundColor: footerBg(cfg) }}>
              Prévia da cor do rodapé
            </div>
          </AdminCard>

          <AdminCard title="Sobre e redes sociais">
            <div className="space-y-4">
              <Field label="Texto de apresentação (abaixo do logo)" type="textarea" rows={3} value={cfg.about} onChange={v => set('about', v)} />
              <p className="text-xs text-gray-500">Deixe o endereço vazio para esconder o ícone da rede.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Instagram (endereço completo)" value={cfg.instagram} onChange={v => set('instagram', v)} />
                <Field label="LinkedIn" value={cfg.linkedin} onChange={v => set('linkedin', v)} />
                <Field label="Facebook" value={cfg.facebook} onChange={v => set('facebook', v)} />
                <Field label="YouTube" value={cfg.youtube} onChange={v => set('youtube', v)} />
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="Coluna de navegação"
            actions={<SecondaryButton icon={Plus} onClick={() => set('nav_links', [...cfg.nav_links, { label: '', link: '' }])}>Adicionar link</SecondaryButton>}
          >
            <div className="space-y-4">
              <Field label="Título da coluna" value={cfg.nav_title} onChange={v => set('nav_title', v)} />
              <p className="text-xs text-gray-500">Link interno: comece com <code>/</code> (ex.: <code>/institucional</code>). Externo: endereço completo (https://...).</p>
              {cfg.nav_links.length === 0 && <p className="text-sm text-gray-400">Nenhum link. Clique em "Adicionar link".</p>}
              {cfg.nav_links.map((l, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-end gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1"><Field label="Texto" value={l.label} onChange={v => setLink(i, 'label', v)} /></div>
                  <div className="flex-1"><Field label="Link" value={l.link} onChange={v => setLink(i, 'link', v)} /></div>
                  <ItemActions
                    onMove={dir => set('nav_links', moveItem(cfg.nav_links, i, dir))}
                    isFirst={i === 0} isLast={i === cfg.nav_links.length - 1}
                    onDelete={() => removeLink(i)}
                  />
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Coluna de contato">
            <div className="space-y-4">
              <Field label="Título da coluna" value={cfg.contact_title} onChange={v => set('contact_title', v)} />
              <Field label="Endereço (Enter quebra a linha; vazio esconde)" type="textarea" rows={3} value={cfg.address} onChange={v => set('address', v)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Telefone" value={cfg.phone} onChange={v => set('phone', v)} />
                <Field label="E-mail" value={cfg.email} onChange={v => set('email', v)} />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Linha final">
            <Field label="Texto de direitos (o ano entra sozinho na frente)" value={cfg.copyright} onChange={v => set('copyright', v)} />
          </AdminCard>
        </>
      )}
    </AdminPage>
  );
}

function ColorChip({ active, bg, label, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${active ? 'border-[#007a3d] ring-2 ring-[#007a3d]/30 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <span className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: bg }} />
      {label}
    </button>
  );
}

function Field({ label, type = 'text', value, onChange, rows = 2 }) {
  const cls = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600';
  return (
    <div className="flex-1">
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea'
        ? <textarea className={`${cls} resize-y`} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input className={cls} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}
