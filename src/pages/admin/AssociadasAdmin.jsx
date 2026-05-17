import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, GripVertical, Eye, EyeOff, X, DownloadCloud } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL   = `${API_BASE_URL}/associadas.php`;
const PAGE_URL  = `${API_BASE_URL}/page_content.php`;

// Lista atual da página estática /associadas — usada apenas para o botão
// "Importar conteúdo atual" quando o banco está vazio.
const STATIC_PARTNERS = [
  { name: 'Suzano',              logo: '/logos/SUZANO-HORIZONTAL-LOGO-200x53.png' },
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

// ─────────────────────────────────────────────────────────
// Sub-componente: Card de empresa no admin
// ─────────────────────────────────────────────────────────
function PartnerCard({ partner, onToggle, onDelete, onEditName, onUploadLogo }) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(partner.name);
  const fileRef = useRef();

  const handleNameBlur = () => {
    setEditingName(false);
    if (name.trim() && name.trim() !== partner.name) {
      onEditName(partner.id, name.trim());
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all ${partner.active == 1 ? 'border-gray-100 shadow-sm' : 'border-dashed border-gray-200 opacity-60'}`}>
      <div className="flex items-center gap-4 p-4">
        {/* Logo */}
        <div
          className="w-20 h-20 shrink-0 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#007a3d] transition-colors relative group"
          onClick={() => fileRef.current?.click()}
          title="Clique para trocar o logo"
        >
          {partner.logo_url ? (
            <>
              <img
                src={getImageUrl(partner.logo_url)}
                alt={partner.name}
                className="max-w-[80%] max-h-[80%] object-contain"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon size={18} className="text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-300">
              <ImageIcon size={20} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Logo</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files[0]) onUploadLogo(partner.id, e.target.files[0]);
            }}
          />
        </div>

        {/* Nome */}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              className="w-full p-2 border border-[#007a3d] rounded-lg text-sm font-bold text-[#1f2937] outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleNameBlur(); if (e.key === 'Escape') { setName(partner.name); setEditingName(false); } }}
              autoFocus
            />
          ) : (
            <p
              className="font-bold text-[#1f2937] text-sm truncate cursor-pointer hover:text-[#007a3d] transition-colors"
              onClick={() => setEditingName(true)}
              title="Clique para editar o nome"
            >
              {partner.name}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-0.5">
            {partner.active == 1 ? '✓ Visível no site' : '✕ Oculto'}
          </p>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(partner.id, partner.active == 1 ? 0 : 1)}
            title={partner.active == 1 ? 'Ocultar' : 'Mostrar'}
            className={`p-2 rounded-xl transition-all ${partner.active == 1 ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
          >
            {partner.active == 1 ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => { if (window.confirm(`Remover "${partner.name}"?`)) onDelete(partner.id); }}
            className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
            title="Remover empresa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────
export default function AssociadasAdmin() {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState(null);
  const [newLogoPreview, setNewLogoPreview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [savedPage, setSavedPage] = useState(false);
  const newLogoRef = useRef();

  // Textos da página
  const [pageConfig, setPageConfig] = useState({
    hero_title: 'Empresas <br/><span class="text-[#007a3d]">Associadas</span>',
    hero_subtitle: 'O elo que une a ciência acadêmica às maiores potências da indústria florestal global.',
    hero_badge: 'Parceria Estratégica',
    benefits_section_title: 'Por que ser uma Associada SIF?',
    cta_title: 'Sua empresa quer fazer parte desta história?',
    cta_text: 'Junte-se ao maior cluster de inovação florestal da América Latina e transforme seus resultados através da ciência.',
    benefits: [
      { title: 'Projetos Cooperativos', description: 'Participação em pesquisas de alto impacto com custos compartilhados entre grandes players do setor.' },
      { title: 'Tecnologia de Ponta', description: 'Acesso direto aos laboratórios da UFV e suporte de pesquisadores nível internacional.' },
      { title: 'Networking Estratégico', description: 'Conexão direta com as maiores empresas de base florestal do mundo em fóruns exclusivos.' },
      { title: 'Segurança e Ética', description: 'Governança robusta e transparência total na gestão de recursos e propriedade intelectual.' },
    ]
  });

  useEffect(() => {
    fetchPartners();
    fetchPageConfig();
  }, []);

  const fetchPartners = async () => {
    setLoadingPartners(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch { setPartners([]); }
    finally { setLoadingPartners(false); }
  };

  const fetchPageConfig = async () => {
    try {
      const res = await fetch(`${PAGE_URL}?page=associadas`);
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setPageConfig(prev => ({ ...prev, ...data }));
      }
    } catch {}
  };

  // ── Importar lista da página estática (one-shot) ──────
  const [importing, setImporting] = useState(false);
  const handleImportStatic = async () => {
    if (!window.confirm(`Importar as ${STATIC_PARTNERS.length} empresas que estão hoje na página? Isso adiciona ao que já existe — não substitui nem apaga.`)) return;
    setImporting(true);
    try {
      for (const p of STATIC_PARTNERS) {
        const fd = new FormData();
        fd.append('name', p.name);
        fd.append('logo_url', p.logo);
        await fetch(API_URL, { method: 'POST', body: fd });
      }
      fetchPartners();
    } finally { setImporting(false); }
  };

  // ── Adicionar novo parceiro ───────────────────────────
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const fd = new FormData();
      fd.append('name', newName.trim());
      if (newLogo) fd.append('logo', newLogo);
      await fetch(API_URL, { method: 'POST', body: fd });
      setNewName('');
      setNewLogo(null);
      setNewLogoPreview(null);
      fetchPartners();
    } finally { setAdding(false); }
  };

  // ── Deletar ───────────────────────────────────────────
  const handleDelete = async (id) => {
    await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  // ── Toggle ativo/inativo ──────────────────────────────
  const handleToggle = async (id, newActive) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('active', newActive);
    fd.append('_method', 'PUT');
    await fetch(API_URL, { method: 'POST', body: fd });
    setPartners(prev => prev.map(p => p.id === id ? { ...p, active: newActive } : p));
  };

  // ── Editar nome ───────────────────────────────────────
  const handleEditName = async (id, name) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('name', name);
    fd.append('_method', 'PUT');
    await fetch(API_URL, { method: 'POST', body: fd });
    setPartners(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  // ── Upload de logo para parceiro existente ────────────
  const handleUploadLogo = async (id, file) => {
    const fd = new FormData();
    fd.append('id', id);
    fd.append('logo', file);
    fd.append('_method', 'PUT');
    const res = await fetch(API_URL, { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) fetchPartners();
  };

  // ── Salvar textos da página ───────────────────────────
  const handleSavePage = async () => {
    setSavingPage(true);
    try {
      const fd = new FormData();
      fd.append('page', 'associadas');
      fd.append('content_json', JSON.stringify(pageConfig));
      await fetch(PAGE_URL, { method: 'POST', body: fd });
      setSavedPage(true);
      setTimeout(() => setSavedPage(false), 3000);
    } finally { setSavingPage(false); }
  };

  const updateBenefit = (i, field, value) => {
    const benefits = [...(pageConfig.benefits || [])];
    benefits[i] = { ...benefits[i], [field]: value };
    setPageConfig(prev => ({ ...prev, benefits }));
  };

  const activeCount   = partners.filter(p => p.active == 1).length;
  const inactiveCount = partners.length - activeCount;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Empresas Associadas</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie os logos, textos e configurações da página de associadas.
          </p>
        </div>
        {savedPage && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
            ✓ Salvo!
          </span>
        )}
      </div>

      {/* Banner de importação — aparece se o banco está vazio */}
      {!loadingPartners && partners.length === 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <DownloadCloud size={22} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-emerald-900">Importar conteúdo atual do site</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Detectamos que a lista está vazia. Posso importar as {STATIC_PARTNERS.length} empresas que estão hoje
              na página <code>/associadas</code> (com logos) para você começar a editar.
            </p>
          </div>
          <Button onClick={handleImportStatic} isLoading={importing} className="shrink-0">
            <DownloadCloud size={16} /> Importar {STATIC_PARTNERS.length} empresas
          </Button>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          SEÇÃO 1 — TEXTOS DA PÁGINA
      ════════════════════════════════════════════════ */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4">
          📝 Textos da Página
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Badge do Hero</label>
            <input
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#007a3d]"
              value={pageConfig.hero_badge || ''}
              onChange={e => setPageConfig(p => ({ ...p, hero_badge: e.target.value }))}
              placeholder="Ex: Parceria Estratégica"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtítulo do Hero</label>
            <input
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#007a3d]"
              value={pageConfig.hero_subtitle || ''}
              onChange={e => setPageConfig(p => ({ ...p, hero_subtitle: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Título CTA Final</label>
            <input
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#007a3d]"
              value={pageConfig.cta_title || ''}
              onChange={e => setPageConfig(p => ({ ...p, cta_title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Texto CTA Final</label>
            <textarea
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#007a3d] resize-none"
              rows={2}
              value={pageConfig.cta_text || ''}
              onChange={e => setPageConfig(p => ({ ...p, cta_text: e.target.value }))}
            />
          </div>
        </div>

        {/* Cards de Benefícios */}
        <div>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Cards de Benefícios (4 fixos)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(pageConfig.benefits || []).map((b, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <input
                  className="w-full p-2 bg-white rounded-lg border text-sm font-bold outline-none focus:border-[#007a3d]"
                  placeholder="Título do benefício"
                  value={b.title || ''}
                  onChange={e => updateBenefit(i, 'title', e.target.value)}
                />
                <textarea
                  className="w-full p-2 bg-white rounded-lg border text-xs font-medium outline-none focus:border-[#007a3d] resize-none"
                  rows={2}
                  placeholder="Descrição..."
                  value={b.description || ''}
                  onChange={e => updateBenefit(i, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSavePage} isLoading={savingPage} icon={Save} className="w-full">
          Salvar Textos da Página
        </Button>
      </div>

      {/* ════════════════════════════════════════════════
          SEÇÃO 2 — ADICIONAR NOVO PARCEIRO
      ════════════════════════════════════════════════ */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight border-b pb-4 mb-6">
          ➕ Adicionar Nova Empresa
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Preview logo */}
          <div
            className="w-24 h-24 shrink-0 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#007a3d] transition-colors relative overflow-hidden"
            onClick={() => newLogoRef.current?.click()}
          >
            {newLogoPreview ? (
              <>
                <img src={newLogoPreview} alt="preview" className="max-w-[80%] max-h-[80%] object-contain" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setNewLogo(null); setNewLogoPreview(null); }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={10} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-300">
                <ImageIcon size={24} />
                <span className="text-[8px] font-bold uppercase tracking-wider text-center">Logo<br/>(opcional)</span>
              </div>
            )}
            <input
              ref={newLogoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files[0];
                if (f) { setNewLogo(f); setNewLogoPreview(URL.createObjectURL(f)); }
              }}
            />
          </div>

          <div className="flex-1 space-y-3">
            <input
              className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium outline-none focus:border-[#007a3d]"
              placeholder="Nome da empresa (ex: Suzano, Gerdau...)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            />
            <Button onClick={handleAdd} isLoading={adding} icon={Plus} className="w-full sm:w-auto">
              Adicionar Empresa
            </Button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          SEÇÃO 3 — LISTA DE PARCEIROS
      ════════════════════════════════════════════════ */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">
            🏢 Empresas Cadastradas
          </h3>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
              {activeCount} visíveis
            </span>
            {inactiveCount > 0 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                {inactiveCount} ocultas
              </span>
            )}
          </div>
        </div>

        {loadingPartners ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Nenhuma empresa cadastrada.</p>
            <p className="text-xs">Adicione empresas usando o formulário acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {partners.map(partner => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEditName={handleEditName}
                onUploadLogo={handleUploadLogo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
