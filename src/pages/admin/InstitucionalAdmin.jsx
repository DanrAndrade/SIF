import React, { useState, useEffect } from 'react';
import {
  Save, Image as ImageIcon, UploadCloud, Plus, Trash2, ChevronUp, ChevronDown,
  Home as HomeIcon, FileText, Users, LayoutGrid, Scroll, Sparkles, Calendar, Loader2, Check,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import TeamManager from './inst/TeamManager';
import TimelineManager from './inst/TimelineManager';
import DocumentsManager from './inst/DocumentsManager';

const API = `${API_BASE_URL}/institucional.php`;

// Conteúdo padrão = espelho exato dos textos atuais da página /institucional.
// Aparece pré-preenchido nos forms para o usuário só editar.
const DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2071',
  hero_badge: 'A SIF & Sua História',
  hero_title_line1: 'Nossa',
  hero_title_highlight: 'História',
  hero_subtitle: 'Mais do que uma entidade, somos o catalisador da inovação florestal no Brasil e no mundo.',

  quem_somos_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
  quem_somos_title_line1: 'Nossa',
  quem_somos_title_highlight: 'História',
  quem_somos_text1: 'A Sociedade de Investigações Florestais (SIF) nasceu em 1974 da percepção estratégica de que o futuro do setor florestal brasileiro dependia de uma conexão indissociável entre a academia e a indústria. Naquele período, o crescimento da silvicultura exigia respostas que apenas a pesquisa científica aplicada poderia fornecer. Através de uma parceria pioneira com a Universidade Federal de Viçosa (UFV), a SIF foi estabelecida para ser o braço executor dessa transformação, convertendo o capital intelectual universitário em produtividade e sustentabilidade para as empresas.',
  quem_somos_text2: 'Ao longo de cinco décadas, a SIF deixou de ser apenas uma ponte de apoio para se tornar uma Instituição Científica, Tecnológica e de Inovação (ICT) essencial ao país. O modelo de cooperação público-privada desenvolvido em Viçosa permitiu a modernização de laboratórios, a formação de gerações de especialistas e a condução de projetos que posicionaram o Brasil como líder global em tecnologia florestal. Hoje, ao ultrapassar o marco de 50 anos, a instituição reafirma seu papel na vanguarda da bioeconomia, liderando frentes de inovação que vão do manejo clássico aos modernos ativos de crédito de carbono.',
  quem_somos_image_caption_top: 'Campus UFV',
  quem_somos_image_caption_main: 'Onde a Ciência Acontece',

  team_tag: 'Conheça',
  team_title: 'Nossa Gente',
  team_subtitle: 'As mentes que construíram cinco décadas de inovação e excelência florestal.',

  areas_tag: 'Fronteira Tecnológica',
  areas_title_line1: 'Nossas Áreas',
  areas_title_highlight: 'de Atuação',
  areas_subtitle: 'Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal de ponta.',
  areas: [
    { title: 'Silvicultura de Precisão', icon: 'Sprout',   desc: 'Desenvolvimento de protocolos avançados de biotecnologia, produção de sementes certificadas e mudas de alta performance. Atuamos na fronteira da nutrição florestal e técnicas silviculturais automatizadas para maximizar o ganho genético no campo.' },
    { title: 'Manejo & Inteligência',    icon: 'Map',      desc: 'Soluções integradas em inventário florestal contínuo, planejamento estratégico de colheita e economia de recursos. Utilizamos sensoriamento remoto e GIS de alta resolução para modelagem preditiva e tomada de decisão baseada em dados.' },
    { title: 'Ambiência & Clima',        icon: 'Leaf',     desc: 'Pesquisas focadas na conservação da biodiversidade, monitoramento hidrológico e recuperação de ecossistemas degradados. Lideramos projetos de regulação hídrica e estratégias de adaptação às mudanças climáticas para o setor florestal.' },
    { title: 'Proteção & Sanidade',      icon: 'Shield',   desc: 'Monitoramento ativo e controle biológico de pragas e doenças florestais. Desenvolvemos sistemas inteligentes de prevenção contra incêndios e protocolos de defesa fitossanitária que garantem a segurança do patrimônio biológico das empresas.' },
    { title: 'Tecnologia de Produtos',   icon: 'Settings', desc: 'Fomento à inovação em processos industriais para energia, celulose, papel e multiprodutos da madeira. Investigamos a anatomia e as propriedades físico-químicas das fibras para o desenvolvimento de bioprodutos de alto valor agregado.' },
  ],

  estatuto_tag: 'Governança',
  estatuto_title_line1: 'Documentação',
  estatuto_title_highlight: '& Transparência',
  estatuto_subtitle: 'A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.',
  estatuto_footer_title_line1: 'A importância do Estatuto',
  estatuto_footer_title_highlight: 'e das Normas',
  estatuto_footer_p1: 'O Estatuto Social e as normas internas são os pilares que garantem a governança, a transparência e a segurança jurídica de uma organização como a SIF.',
  estatuto_footer_p2: 'O Estatuto funciona como a constituição da entidade. É o seu documento de fundação, que define sua identidade, propósito, estrutura de poder e os direitos e deveres dos seus membros. Ele é o alicerce que confere legitimidade e orienta as decisões estratégicas mais importantes.',
  estatuto_footer_p3: 'As normas, como regulamentos e regimentos, são o desdobramento prático do estatuto. Elas detalham os procedimentos do dia a dia, garantindo que as atividades sejam conduzidas de forma justa, padronizada e eficiente.',
  estatuto_footer_quote: 'Em conjunto, o estatuto estabelece "o que" a organização é, enquanto as normas definem "como" ela deve operar para cumprir sua missão com integridade e organização.',

  historia_tag: 'Nossa Jornada',
  historia_title_line1: 'Cinco',
  historia_title_highlight: 'Décadas',
  historia_title_line2: 'de Ciência',

  cta_title_line1: 'O Amanhã é',
  cta_title_highlight: 'Científico',
  cta_btn1_label: 'Seja uma Associada',
  cta_btn1_link: '/contato',
  cta_btn2_label: 'Trabalhe Conosco',
  cta_btn2_link: '/trabalhe-conosco',
};

const TABS = [
  { id: 'hero',       label: 'Hero',          icon: HomeIcon },
  { id: 'quem_somos', label: 'Quem Somos',    icon: FileText },
  { id: 'team',       label: 'Nossa Gente',   icon: Users },
  { id: 'areas',      label: 'Áreas',         icon: LayoutGrid },
  { id: 'estatuto',   label: 'Estatutos',     icon: Scroll },
  { id: 'timeline',   label: 'Linha do Tempo',icon: Calendar },
  { id: 'cta',        label: 'CTA Final',     icon: Sparkles },
];

const mergeCfg = (base, incoming) => {
  const out = { ...base };
  if (!incoming) return out;
  for (const k of Object.keys(incoming)) {
    out[k] = incoming[k];
  }
  if (!Array.isArray(incoming.areas) || incoming.areas.length === 0) {
    out.areas = base.areas;
  }
  return out;
};

export default function InstitucionalAdmin() {
  const [activeTab, setActiveTab] = useState('hero');
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState({});
  const [pendingPreviews, setPendingPreviews] = useState({});

  useEffect(() => {
    fetch(API + '?resource=config')
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        setConfig(mergeCfg(DEFAULTS, incoming));
      })
      .catch(() => setConfig(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

  const handleFile = (fieldName, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Imagem muito pesada (máx 5MB).'); return; }
    setPendingFiles(p => ({ ...p, [fieldName]: file }));
    setPendingPreviews(p => ({ ...p, [fieldName]: URL.createObjectURL(file) }));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('content_json', JSON.stringify(config));
      for (const [field, file] of Object.entries(pendingFiles)) fd.append(field, file);
      const res = await fetch(API + '?resource=config', { method: 'POST', body: fd });
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
          <h2 className="text-xl font-bold text-gray-800">Página Institucional</h2>
          <p className="text-xs text-gray-500 mt-1">Os campos vêm pré-preenchidos com o conteúdo atual do site.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          {!['team', 'timeline', 'estatuto'].includes(activeTab) && (
            <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
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
      {activeTab === 'quem_somos' && (
        <QuemSomosForm cfg={config} set={set} onFile={handleFile} preview={pendingPreviews.quem_somos_image} />
      )}
      {activeTab === 'team' && (
        <div>
          <SectionHeader cfg={config} set={set} prefix="team" />
          <hr className="my-6 border-gray-100" />
          <p className="text-xs text-gray-500 mb-4">Cada membro tem seu próprio botão de salvar. Edite contato (e-mail/WhatsApp) clicando em "Editar".</p>
          <TeamManager />
        </div>
      )}
      {activeTab === 'areas' && (
        <AreasForm cfg={config} set={set} />
      )}
      {activeTab === 'estatuto' && (
        <div>
          <EstatutoForm cfg={config} set={set} />
          <div className="flex justify-end mb-6">
            <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
              <Save size={16} /> Salvar textos do Estatuto
            </Button>
          </div>
          <hr className="my-6 border-gray-100" />
          <p className="text-xs text-gray-500 mb-4">Documentos PDF (CRUD):</p>
          <DocumentsManager />
        </div>
      )}
      {activeTab === 'timeline' && (
        <div>
          <TimelineHeaderForm cfg={config} set={set} />
          <div className="flex justify-end mb-6">
            <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
              <Save size={16} /> Salvar título da Linha do Tempo
            </Button>
          </div>
          <hr className="my-6 border-gray-100" />
          <p className="text-xs text-gray-500 mb-4">Marcos históricos (CRUD):</p>
          <TimelineManager />
        </div>
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
        <div />
        <Field label="Título — linha 1" value={cfg.hero_title_line1} onChange={v => set('hero_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.hero_title_highlight} onChange={v => set('hero_title_highlight', v)} />
      </div>
      <Field label="Subtítulo (parágrafo abaixo do título)" type="textarea" rows={2} value={cfg.hero_subtitle} onChange={v => set('hero_subtitle', v)} />
    </div>
  );
}

// ─── QUEM SOMOS ────────────────────────────────────────────────
function QuemSomosForm({ cfg, set, onFile, preview }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título — linha 1" value={cfg.quem_somos_title_line1} onChange={v => set('quem_somos_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.quem_somos_title_highlight} onChange={v => set('quem_somos_title_highlight', v)} />
      </div>
      <Field label="Parágrafo 1" type="textarea" rows={5} value={cfg.quem_somos_text1} onChange={v => set('quem_somos_text1', v)} />
      <Field label="Parágrafo 2" type="textarea" rows={5} value={cfg.quem_somos_text2} onChange={v => set('quem_somos_text2', v)} />

      <ImageField label="Imagem lateral (Quem Somos)" currentUrl={cfg.quem_somos_image} previewUrl={preview} fieldName="quem_somos_image" onFile={onFile} hint="Imagem quadrada exibida ao lado dos textos." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Legenda da imagem (linha superior)" value={cfg.quem_somos_image_caption_top} onChange={v => set('quem_somos_image_caption_top', v)} />
        <Field label="Legenda da imagem (linha principal)" value={cfg.quem_somos_image_caption_main} onChange={v => set('quem_somos_image_caption_main', v)} />
      </div>
    </div>
  );
}

// ─── ÁREAS DE ATUAÇÃO ─────────────────────────────────────────
function AreasForm({ cfg, set }) {
  const areas = Array.isArray(cfg.areas) ? cfg.areas : [];
  const updateArea = (idx, patch) => set('areas', areas.map((a, i) => i === idx ? { ...a, ...patch } : a));
  const addArea = () => set('areas', [...areas, { title: 'Nova área', icon: 'Sprout', desc: '' }]);
  const removeArea = (idx) => { if (window.confirm('Remover esta área?')) set('areas', areas.filter((_, i) => i !== idx)); };
  const moveArea = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= areas.length) return;
    const next = [...areas];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    set('areas', next);
  };

  return (
    <div className="space-y-5">
      <SectionHeader cfg={cfg} set={set} prefix="areas" />
      <div className="space-y-4">
        {areas.map((area, idx) => (
          <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Área #{idx + 1}</h4>
              <div className="flex items-center gap-1">
                <button onClick={() => moveArea(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                <button onClick={() => moveArea(idx, 1)} disabled={idx === areas.length - 1} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronDown size={16} /></button>
                <button onClick={() => removeArea(idx)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Título" value={area.title} onChange={v => updateArea(idx, { title: v })} />
              <Field label="Ícone (Sprout/Map/Leaf/Shield/Settings/Microscope/Globe/Users)" value={area.icon} onChange={v => updateArea(idx, { icon: v })} />
            </div>
            <div className="mt-3">
              <Field label="Descrição" type="textarea" rows={3} value={area.desc} onChange={v => updateArea(idx, { desc: v })} />
            </div>
          </div>
        ))}
        <button onClick={addArea} className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-700 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Plus size={18} /> Adicionar área
        </button>
      </div>
    </div>
  );
}

// ─── ESTATUTOS ────────────────────────────────────────────────
function EstatutoForm({ cfg, set }) {
  return (
    <div className="space-y-5">
      <SectionHeader cfg={cfg} set={set} prefix="estatuto" />
      <hr className="my-6 border-gray-100" />
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Texto final ("A importância do Estatuto e das Normas")</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título — linha 1" value={cfg.estatuto_footer_title_line1} onChange={v => set('estatuto_footer_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.estatuto_footer_title_highlight} onChange={v => set('estatuto_footer_title_highlight', v)} />
      </div>
      <Field label="Parágrafo 1" type="textarea" rows={3} value={cfg.estatuto_footer_p1} onChange={v => set('estatuto_footer_p1', v)} />
      <Field label="Parágrafo 2" type="textarea" rows={3} value={cfg.estatuto_footer_p2} onChange={v => set('estatuto_footer_p2', v)} />
      <Field label="Parágrafo 3" type="textarea" rows={3} value={cfg.estatuto_footer_p3} onChange={v => set('estatuto_footer_p3', v)} />
      <Field label="Citação final (itálico verde)" type="textarea" rows={2} value={cfg.estatuto_footer_quote} onChange={v => set('estatuto_footer_quote', v)} />
    </div>
  );
}

// ─── TIMELINE HEADER ──────────────────────────────────────────
function TimelineHeaderForm({ cfg, set }) {
  return (
    <div className="space-y-5">
      <Field label="Tag (acima do título)" value={cfg.historia_tag} onChange={v => set('historia_tag', v)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Título — linha 1" value={cfg.historia_title_line1} onChange={v => set('historia_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.historia_title_highlight} onChange={v => set('historia_title_highlight', v)} />
        <Field label="Título — final" value={cfg.historia_title_line2} onChange={v => set('historia_title_line2', v)} />
      </div>
    </div>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────
function CtaForm({ cfg, set }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Título — linha 1" value={cfg.cta_title_line1} onChange={v => set('cta_title_line1', v)} />
        <Field label="Título — destaque em verde" value={cfg.cta_title_highlight} onChange={v => set('cta_title_highlight', v)} />
        <Field label="Botão 1 — texto" value={cfg.cta_btn1_label} onChange={v => set('cta_btn1_label', v)} />
        <Field label="Botão 1 — link" value={cfg.cta_btn1_link} onChange={v => set('cta_btn1_link', v)} />
        <Field label="Botão 2 — texto" value={cfg.cta_btn2_label} onChange={v => set('cta_btn2_label', v)} />
        <Field label="Botão 2 — link" value={cfg.cta_btn2_link} onChange={v => set('cta_btn2_link', v)} />
      </div>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────
function SectionHeader({ cfg, set, prefix }) {
  return (
    <div className="space-y-3">
      <Field label="Tag (etiqueta acima do título)" value={cfg[`${prefix}_tag`] || ''} onChange={v => set(`${prefix}_tag`, v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={prefix === 'team' ? 'Título da seção' : 'Título — linha 1'} value={cfg[`${prefix}_title${prefix === 'team' ? '' : '_line1'}`] || ''} onChange={v => set(`${prefix}_title${prefix === 'team' ? '' : '_line1'}`, v)} />
        {prefix !== 'team' && (
          <Field label="Título — destaque em verde" value={cfg[`${prefix}_title_highlight`] || ''} onChange={v => set(`${prefix}_title_highlight`, v)} />
        )}
      </div>
      <Field label="Subtítulo" type="textarea" rows={2} value={cfg[`${prefix}_subtitle`] || ''} onChange={v => set(`${prefix}_subtitle`, v)} />
    </div>
  );
}

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
