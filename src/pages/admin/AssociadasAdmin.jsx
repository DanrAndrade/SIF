import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save, Image as ImageIcon, UploadCloud, Plus, Trash2, ChevronUp, ChevronDown,
  Home as HomeIcon, Award, Building2, Sparkles, Loader2, Check, X, ToggleLeft, ToggleRight, AlertTriangle, Edit,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const ASSOC_URL = `${API_BASE_URL}/associadas.php`;
const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Lista atual da página estática — auto-seed silencioso quando o banco está vazio.
const STATIC_PARTNERS = [
  { name: 'Suzano',              logo: '/logos/SUZANO-HORIZONTAL-LOGO-200x53.png' },
  { name: 'Klabin',              logo: '' },
  { name: 'Gerdau',              logo: '/logos/GERDAU-LOGO-HORIZONTAL-200x113.png' },
  { name: 'ArcelorMittal',       logo: '/logos/ARCELORMITTAL-LOGO-200x113.png' },
  { name: 'Cenibra',             logo: '/logos/CENIBRA-LOGO-200x198.png' },
  { name: 'Veracel',             logo: '/logos/VERACEL-LOGO-200x73.png' },
  { name: 'Aperam',              logo: '/logos/APERAM-LOGO-200x113.png' },
  { name: 'Bracell',             logo: '/logos/bracell-logo-200x45.png' },
  { name: 'Vallourec',           logo: '/logos/VALLOUREC-LOGO-200x47.png' },
  { name: 'Arauco',              logo: '/logos/ARAUCO-LOGO-200x37.png' },
  { name: 'CMPC',                logo: '/logos/Logo-CMPC-1024x496.png' },
  { name: 'Smurfit Westrock',    logo: '/logos/SMURFIT-WESTROCK-1.png' },
  { name: 'Dexco',               logo: '/logos/logo-dexco.jpg' },
  { name: 'LD Celulose',         logo: '/logos/LD-CELULOSE-1.png' },
  { name: 'Agropalma',           logo: '/logos/Agropalma-Logo.png' },
  { name: 'Bunge',               logo: '/logos/Bunge-Logo-200x46.png' },
  { name: 'ArborGen',            logo: '/logos/ArborGen-2021-Logo-with-Tagline-SMALL-200x145.png' },
  { name: 'Placas do Brasil',    logo: '/logos/Placas-Do-Brasil-LOGO-200x67.png' },
  { name: 'Paracel',             logo: '/logos/PARACEL-LOGO-200x47.png' },
  { name: 'Montes del Plata',    logo: '/logos/Logo-Montes-del-Plata-200x100.png' },
  { name: 'Sinobras',            logo: '/logos/SINOBRAS-LOGO-200x71.png' },
  { name: 'Vetorial',            logo: '/logos/Vetorial-Logo-200x113.png' },
  { name: 'Metal Sider',         logo: '/logos/Metal-Sider-Logo-200x113.png' },
  { name: 'Grupo Maringá',       logo: '/logos/GRUPO-MARINGA-LOGO-200x112.png' },
  { name: 'Grupo Index',         logo: '/logos/GRUPO-INDEX-LOGO-200x78.png' },
  { name: 'Deforsa',             logo: '/logos/DEFORSA-LOGO-200x228.png' },
  { name: 'Concrem',             logo: '/logos/CONCREM.png' },
  { name: 'The Forest Company',  logo: '/logos/THE-FOREST-COMPANY.png' },
  { name: 'Pan Bioenergia',      logo: '/logos/PAN-BIOENERGIA.png' },
];

const DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
  hero_badge: 'Parceria Estratégica',
  hero_title_line1: 'Empresas',
  hero_title_highlight: 'Associadas',
  hero_subtitle: 'O elo que une a ciência acadêmica às maiores potências da indústria florestal global.',
  hero_scroll_label: 'Ver Benefícios',

  beneficios_title_line1: 'Por que ser uma',
  beneficios_title_highlight: 'Associada SIF?',
  benefits: [
    { title: 'Projetos Cooperativos',  description: 'Participação em pesquisas de alto impacto com custos compartilhados entre grandes players do setor.' },
    { title: 'Tecnologia de Ponta',    description: 'Acesso direto aos laboratórios da UFV e suporte de pesquisadores nível internacional.' },
    { title: 'Networking Estratégico', description: 'Conexão direta com as maiores empresas de base florestal do mundo em fóruns exclusivos.' },
    { title: 'Segurança e Ética',      description: 'Governança robusta e transparência total na gestão de recursos e propriedade intelectual.' },
  ],

  logos_tag: 'Nossa Rede',
  logos_title_line1: 'Empresas que',
  logos_title_highlight: 'Confiam na SIF',

  cta_title: 'Sua empresa quer fazer parte desta história?',
  cta_text: 'Junte-se ao maior cluster de inovação florestal da América Latina e transforme seus resultados através da ciência.',
  cta_btn_label: 'Seja uma Associada',
  cta_btn_link: '/contato',
};

const TABS = [
  { id: 'hero',       label: 'Hero',         icon: HomeIcon },
  { id: 'beneficios', label: 'Benefícios',   icon: Award },
  { id: 'empresas',   label: 'Empresas',     icon: Building2 },
  { id: 'cta',        label: 'CTA Final',    icon: Sparkles },
];

const mergeCfg = (base, incoming) => {
  const out = { ...base };
  if (!incoming) return out;
  for (const k of Object.keys(incoming)) out[k] = incoming[k];
  if (!Array.isArray(incoming.benefits) || incoming.benefits.length === 0) out.benefits = base.benefits;
  return out;
};

export default function AssociadasAdmin() {
  const [activeTab, setActiveTab] = useState('hero');
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState({});
  const [pendingPreviews, setPendingPreviews] = useState({});

  // Empresas (CRUD próprio — endpoint associadas.php)
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const seedingRef = useRef(false); // evita auto-seed duplo (React StrictMode)

  // Carrega config geral
  useEffect(() => {
    fetch(`${PAGE_URL}?page=associadas`)
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        setConfig(mergeCfg(DEFAULTS, incoming));
      })
      .catch(() => setConfig(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  // Carrega empresas (com auto-seed silencioso, protegido contra StrictMode)
  const fetchPartners = useCallback(async () => {
    setLoadingPartners(true);
    try {
      const res = await fetch(ASSOC_URL);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      if (list.length === 0 && !seedingRef.current) {
        seedingRef.current = true;
        for (const p of STATIC_PARTNERS) {
          const fd = new FormData();
          fd.append('name', p.name);
          if (p.logo) fd.append('logo_url', p.logo);
          await fetch(ASSOC_URL, { method: 'POST', body: fd });
        }
        const res2 = await fetch(ASSOC_URL);
        const data2 = await res2.json();
        setPartners(Array.isArray(data2) ? data2 : []);
      } else {
        setPartners(list);
      }
    } catch { setPartners([]); }
    finally { setLoadingPartners(false); }
  }, []);

  useEffect(() => { fetchPartners(); }, []);

  const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

  const handleFile = (fieldName, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('Imagem muito pesada (máx 10MB).'); return; }
    setPendingFiles(p => ({ ...p, [fieldName]: file }));
    setPendingPreviews(p => ({ ...p, [fieldName]: URL.createObjectURL(file) }));
    setError('');
  };

  const handleSavePage = async () => {
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('page', 'associadas');
      fd.append('content_json', JSON.stringify(config));
      for (const [field, file] of Object.entries(pendingFiles)) fd.append(field, file);
      const res = await fetch(PAGE_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (data && data.data) setConfig(mergeCfg(DEFAULTS, data.data));
      setPendingFiles({});
      setPendingPreviews({});
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      setError('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
        <p className="text-sm text-gray-500 mt-3">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Página Empresas Associadas</h2>
          <p className="text-xs text-gray-500 mt-1">Textos vêm pré-preenchidos com o conteúdo atual da página.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          {activeTab !== 'empresas' && (
            <Button onClick={handleSavePage} disabled={saving} isLoading={saving} variant="primary">
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${active ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {activeTab === 'hero' && (
        <HeroForm cfg={config} set={set} onFile={handleFile} preview={pendingPreviews.hero_image} />
      )}
      {activeTab === 'beneficios' && (
        <BeneficiosForm cfg={config} set={set} />
      )}
      {activeTab === 'empresas' && (
        <EmpresasManager partners={partners} loading={loadingPartners} reload={fetchPartners} />
      )}
      {activeTab === 'cta' && (
        <CtaForm cfg={config} set={set} />
      )}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────
function HeroForm({ cfg, set, onFile, preview }) {
  return (
    <div className="space-y-5">
      <ImageField label="Imagem de fundo do Hero" currentUrl={cfg.hero_image} previewUrl={preview} fieldName="hero_image" onFile={onFile} hint="Atualmente: a imagem mostrada acima. Clique para trocar." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Badge (etiqueta verde acima do título)" value={cfg.hero_badge} onChange={v => set('hero_badge', v)} />
        <Field label="Texto do botão de scroll" value={cfg.hero_scroll_label} onChange={v => set('hero_scroll_label', v)} />
        <Field label="Título — linha 1" value={cfg.hero_title_line1} onChange={v => set('hero_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.hero_title_highlight} onChange={v => set('hero_title_highlight', v)} />
      </div>
      <Field label="Subtítulo" type="textarea" rows={2} value={cfg.hero_subtitle} onChange={v => set('hero_subtitle', v)} />
    </div>
  );
}

// ─── BENEFÍCIOS (quantidade fixa em 4 — só edição de texto) ───
function BeneficiosForm({ cfg, set }) {
  const benefits = Array.isArray(cfg.benefits) ? cfg.benefits : [];
  const updateBenefit = (idx, patch) => set('benefits', benefits.map((b, i) => i === idx ? { ...b, ...patch } : b));
  const move = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= benefits.length) return;
    const next = [...benefits];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    set('benefits', next);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título — linha 1" value={cfg.beneficios_title_line1} onChange={v => set('beneficios_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.beneficios_title_highlight} onChange={v => set('beneficios_title_highlight', v)} />
      </div>

      <p className="text-xs text-gray-500">Cards exibidos sobre fundo escuro. Cada card tem título + descrição.</p>
      <div className="space-y-4">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card #{idx + 1}</h4>
              <div className="flex items-center gap-1">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === benefits.length - 1} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronDown size={16} /></button>
              </div>
            </div>
            <Field label="Título" value={benefit.title} onChange={v => updateBenefit(idx, { title: v })} />
            <div className="mt-3">
              <Field label="Descrição" type="textarea" rows={3} value={benefit.description} onChange={v => updateBenefit(idx, { description: v })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA ──────────────────────────────────────────────────────
function CtaForm({ cfg, set }) {
  return (
    <div className="space-y-5">
      <Field label="Título do CTA" value={cfg.cta_title} onChange={v => set('cta_title', v)} />
      <Field label="Texto do CTA" type="textarea" rows={3} value={cfg.cta_text} onChange={v => set('cta_text', v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Texto do botão" value={cfg.cta_btn_label} onChange={v => set('cta_btn_label', v)} />
        <Field label="Link do botão" value={cfg.cta_btn_link} onChange={v => set('cta_btn_link', v)} />
      </div>

      <hr className="my-6 border-gray-100" />
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cabeçalho da seção "Empresas que Confiam na SIF"</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Tag (cima)" value={cfg.logos_tag} onChange={v => set('logos_tag', v)} />
        <Field label="Título — linha 1" value={cfg.logos_title_line1} onChange={v => set('logos_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.logos_title_highlight} onChange={v => set('logos_title_highlight', v)} />
      </div>
    </div>
  );
}

// ─── EMPRESAS (CRUD) ──────────────────────────────────────────
function EmpresasManager({ partners, loading, reload }) {
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState(null);
  const [newLogoPreview, setNewLogoPreview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const newLogoRef = useRef();

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const fd = new FormData();
      fd.append('name', newName.trim());
      if (newLogo) fd.append('logo', newLogo);
      await fetch(ASSOC_URL, { method: 'POST', body: fd });
      setNewName('');
      setNewLogo(null);
      setNewLogoPreview(null);
      reload();
    } finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`${ASSOC_URL}?id=${id}`, { method: 'DELETE' });
    reload();
    setToDelete(null);
  };

  const handleToggle = async (id, currentActive) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('active', currentActive == 1 ? '0' : '1');
    fd.append('_method', 'PUT');
    await fetch(ASSOC_URL, { method: 'POST', body: fd });
    reload();
  };

  const handleEditField = async (id, field, value) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append(field, value);
    fd.append('_method', 'PUT');
    await fetch(ASSOC_URL, { method: 'POST', body: fd });
    reload();
  };
  const handleEditName    = (id, name)    => handleEditField(id, 'name', name);
  const handleEditAddress = (id, address) => handleEditField(id, 'address', address);

  const handleUploadLogo = async (id, file) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('logo', file);
    fd.append('_method', 'PUT');
    await fetch(ASSOC_URL, { method: 'POST', body: fd });
    reload();
  };

  const activeCount = partners.filter(p => p.active == 1).length;
  const inactiveCount = partners.length - activeCount;

  return (
    <div className="relative space-y-6">
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-red-600" size={24} /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Excluir empresa?</h3>
            <p className="text-sm text-gray-500 mb-6"><strong>{toDelete.name}</strong> será removida do site.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setToDelete(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(toDelete.id)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 flex items-center gap-2"><Trash2 size={16} /> Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Adicionar nova */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={16} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Adicionar nova empresa</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div
            className="w-24 h-24 shrink-0 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors relative overflow-hidden"
            onClick={() => newLogoRef.current?.click()}
          >
            {newLogoPreview ? (
              <>
                <img src={newLogoPreview} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
                <button onClick={e => { e.stopPropagation(); setNewLogo(null); setNewLogoPreview(null); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X size={10} /></button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-300"><ImageIcon size={20} /><span className="text-[9px] font-bold uppercase">Logo</span></div>
            )}
            <input ref={newLogoRef} type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files[0];
              if (f) { setNewLogo(f); setNewLogoPreview(URL.createObjectURL(f)); }
            }} />
          </div>
          <div className="flex-1 space-y-3">
            <input
              className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
              placeholder="Nome da empresa"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button onClick={handleAdd} disabled={adding || !newName.trim()} className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Adicionar empresa
            </button>
          </div>
        </div>
      </div>

      {/* Listagem */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Empresas cadastradas</h3>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">{activeCount} visíveis</span>
            {inactiveCount > 0 && <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">{inactiveCount} ocultas</span>}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Building2 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma empresa cadastrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
            {partners.map(p => (
              <PartnerCard
                key={p.id}
                partner={p}
                onToggle={handleToggle}
                onDelete={() => setToDelete(p)}
                onEditName={handleEditName}
                onEditAddress={handleEditAddress}
                onUploadLogo={handleUploadLogo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PartnerCard({ partner, onToggle, onDelete, onEditName, onEditAddress, onUploadLogo }) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(partner.name);
  const [address, setAddress] = useState(partner.address || '');
  const fileRef = useRef();

  // Mantém local sincronizado quando o pai recarregar
  useEffect(() => { setName(partner.name); setAddress(partner.address || ''); }, [partner.name, partner.address]);

  const saveName = () => {
    if (name.trim() && name.trim() !== partner.name) onEditName(partner.id, name.trim());
  };
  const saveAddress = () => {
    if ((address || '') !== (partner.address || '')) onEditAddress(partner.id, address.trim());
  };

  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${partner.active == 1 ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-16 h-16 shrink-0 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors relative group"
          onClick={() => fileRef.current?.click()}
          title="Clique para trocar o logo"
        >
          {partner.logo_url ? (
            <>
              <img src={getImageUrl(partner.logo_url)} alt={partner.name} className="max-w-[80%] max-h-[80%] object-contain" onError={e => { e.target.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><ImageIcon size={14} className="text-white" /></div>
            </>
          ) : (
            <ImageIcon size={18} className="text-gray-300" />
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) onUploadLogo(partner.id, e.target.files[0]); }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-800 truncate" title={partner.name}>{partner.name}</p>
          {partner.address && (
            <p className="text-[11px] text-gray-500 truncate" title={partner.address}>{partner.address}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onToggle(partner.id, partner.active)} className={`p-1.5 rounded ${partner.active == 1 ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`} title={partner.active == 1 ? 'Ocultar' : 'Mostrar'}>
            {partner.active == 1 ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <button onClick={() => setExpanded(e => !e)} className={`p-1.5 rounded ${expanded ? 'text-blue-700 bg-blue-50' : 'text-blue-500 hover:bg-blue-50'}`} title="Editar dados">
            <Edit size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={14} /></button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-3 space-y-2 bg-gray-50">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">Nome</label>
            <input
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => { if (e.key === 'Enter') { saveName(); setExpanded(false); } }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">Endereço</label>
            <input
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600"
              placeholder="Endereço da empresa"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onBlur={saveAddress}
              onKeyDown={e => { if (e.key === 'Enter') { saveAddress(); setExpanded(false); } }}
            />
          </div>
          <p className="text-[10px] text-gray-400">As alterações são salvas ao sair do campo (ou Enter).</p>
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, rows = 2 }) {
  const cls = "w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d] focus:ring-2 focus:ring-emerald-200";
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea className={`${cls} resize-y`} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
      ) : (
        <input className={cls} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ImageField({ label, currentUrl, previewUrl, fieldName, onFile, hint }) {
  const displayUrl = previewUrl || (currentUrl ? (currentUrl.startsWith('http') ? currentUrl : getImageUrl(currentUrl)) : '');
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2">{label}</label>
      <div className="relative w-full h-44 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-500 transition-colors">
        {displayUrl ? (
          <img src={displayUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-xs text-gray-500">Clique para enviar imagem</p>
          </div>
        )}
        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onFile(fieldName, e.target.files[0])} />
      </div>
      {hint && <p className="text-[11px] text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}
