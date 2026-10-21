import React, { useState, useEffect } from 'react';
import { useConfirm, AdminPage, AdminCard, useDirty, ItemActions, moveItem, ImageField as KitImageField } from './kit';
import { GRADIENT_PRESETS, TEXTURES, resolveGradient } from '../../utils/homeVisual';
import axios from 'axios';
import {
  Save, UploadCloud, Plus, Trash2, ChevronUp, ChevronDown,
  Home as HomeIcon, Award, FileText, LayoutGrid, Compass, HelpCircle, Loader2, Check, BarChart3, Briefcase,
} from 'lucide-react';
import { Input, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { uploadImageNow, toastError, apiRequest } from '../../utils/adminApi';
import AdminFAQ from './AdminFAQ';

const PAGE_KEY = 'home';
const API_URL = `${API_BASE_URL}/page_content.php`;

// Conteúdo atual hardcoded da Home — usado como valor inicial dos forms.
// O admin vê isto e edita. Ao salvar, vira config_json no banco.
const DEFAULTS = {
  hero: {
    tag: 'Sustentabilidade & Inovação',
    title_line1: 'Sociedade de',
    title_line2: 'Investigações Florestais',
    subtitle: 'Há mais de 40 anos promovendo o desenvolvimento científico e tecnológico do setor florestal brasileiro. Conexão entre universidade e grandes empresas.',
    cta1_label: 'Seja Associada',
    cta1_link: '/contato',
    cta2_label: 'Nossos Projetos',
    cta2_link: '/projetos',
    scroll_label: 'Conheça',
  },
  performance: {
    items: [
      { title: 'Missão', text: 'Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.' },
      { title: 'Visão', text: 'Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.' },
      { title: 'Valores', text: 'Inovação - Proatividade - Sustentabilidade - Integridade - Comprometimento – Profissionalismo' },
    ],
  },
  about: {
    tag: 'Quem Somos',
    title: 'Referência em <span class="text-[#007a3d]">Pesquisa Florestal</span>',
    paragraph_1: 'Fundada em 1974, a Sociedade de Investigações Florestais (SIF) consolida uma trajetória de cinco décadas como o elo estratégico entre a Universidade Federal de Viçosa (UFV) e o setor produtivo. Nossa missão é impulsionar o desenvolvimento do setor florestal através da pesquisa aplicada, da geração de conhecimento e da qualificação profissional de excelência.',
    paragraph_2: 'Atualmente, conectamos mais de 28 empresas associadas, abrangendo segmentos fundamentais como celulose e papel, siderurgia, painéis de madeira e o mercado de crédito de carbono. Essa cooperação público-privada permite que projetos de Pesquisa, Desenvolvimento e Inovação (PD&I) sejam conduzidos por especialistas renomados, utilizando a infraestrutura avançada e o capital intelectual do Departamento de Engenharia Florestal da UFV.',
    paragraph_3: 'Nosso compromisso estende-se à sociedade por meio da democratização do saber técnico. Os avanços científicos gerados em nossos grupos temáticos e parcerias são compartilhados através da Revista Árvore, de boletins técnicos e de treinamentos especializados, garantindo que a inovação e a sustentabilidade norteiem o futuro das florestas.',
    cta_label: 'Conheça Nossa História',
    cta_link: '/institucional',
    video_url: 'https://www.youtube.com/embed/9AWrRQWYIcw?rel=0&modestbranding=1',
    badge_value: '+50 Anos',
    badge_label: 'De excelência',
  },
  services: {
    section_tag: 'Áreas de Atuação',
    section_title: 'Nossos Serviços',
    cards: [
      { id: '01', tag: 'Comercial', title: 'Comercial', desc: 'Nossa área comercial atua estrategicamente na venda de sementes de alta qualidade, tecnologia Ellepot e captação de patrocínios para eventos florestais.', link: '/comercial', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2674&auto=format&fit=crop' },
      { id: '02', tag: 'Germinar', title: 'Programa Germinar', desc: 'Uma iniciativa focada no desenvolvimento e atração de talentos. Descubra como funciona o programa e acesse nosso banco de vagas exclusivas.', link: '/trabalhe-conosco', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop' },
      { id: '03', tag: 'Informativo', title: 'Boletim Técnico', desc: 'Conteúdos aprofundados e atualizações das principais inovações do setor florestal. Acesse nossas edições técnicas focadas em ciência e aplicação de campo.', link: '/blog', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=2670&auto=format&fit=crop' },
      { id: '04', tag: 'Pesquisa', title: 'Serviços de P&D', desc: 'Realizamos projetos especializados de Pesquisa e Desenvolvimento, conectando as demandas reais da indústria florestal com a excelência acadêmica.', link: '/projetos', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop' },
    ],
  },
  process: {
    section_tag: 'Inovação e Transparência',
    section_title: 'Explore nossos recursos',
    section_subtitle: 'Acesse as principais áreas e conteúdos da nossa plataforma.',
    steps: [
      { id: '01', title: 'Blog e Notícias', icon_type: 'Newspaper', img: 'https://images.unsplash.com/photo-1624269305548-1527ef905ff6', shortDesc: 'Fique por dentro das novidades.', fullDesc: 'Acompanhe as últimas notícias, eventos e inovações do setor florestal brasileiro.', benefits: 'Novidades, Artigos, Eventos', link: '/blog', external: false },
      { id: '02', title: 'Treinamentos', icon_type: 'BookOpen', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015', shortDesc: 'Qualificação profissional.', fullDesc: 'Consulte nossa agenda completa de treinamentos e cursos especializados para o setor.', benefits: 'Cursos, Certificados, Expertise', link: '/treinamentos', external: false },
      { id: '03', title: 'Nossos Projetos', icon_type: 'TreePine', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=2070', shortDesc: 'Inovação em P&D+I.', fullDesc: 'Conheça os projetos de pesquisa e desenvolvimento que estamos realizando no campo.', benefits: 'P&D+I, Tecnologia, Campo', link: '/projetos', external: false },
      { id: '04', title: 'Transparência', icon_type: 'ScrollText', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071', shortDesc: 'Ética e Integridade.', fullDesc: 'Acesse nosso Código de Conduta e diretrizes de conformidade aplicadas a todos os processos.', benefits: 'Ética, Compliance, Governança', link: 'https://sif.conveniar.com.br/portaltransparencia/', external: true },
    ],
  },
  // Fundo do topo (degradê + textura) — ver src/utils/homeVisual.js
  visual: { gradient: 'atual', from: '#007a3d', to: '#1B5E20', texture: 'ruido' },
  // Bloco de números (bento). Começa DESLIGADO: só aparece no site depois de
  // preenchido e ativado aqui no painel.
  numbers: {
    enabled: false,
    tag: 'A SIF em números',
    title: 'Ciência florestal que gera resultado',
    subtitle: '',
    cards: [
      { prefix: '+', number: '50', unit: 'anos', label: 'de pesquisa florestal aplicada, desde 1974', image: '', link: '/institucional' },
      { prefix: '+', number: '28', unit: 'empresas', label: 'associadas', image: '', link: '/associadas' },
      { prefix: '', number: '', unit: '', label: '', image: '', link: '' },
      { prefix: '', number: '', unit: '', label: '', image: '', link: '' },
    ],
  },
  // Seção "Trabalhe Conosco" (abaixo das empresas associadas)
  jobs_cta: {
    enabled: true,
    tag: 'Trabalhe Conosco',
    title: 'Faça parte da SIF',
    text: 'Vagas na SIF, nas empresas associadas e no programa Germinar.',
    btn_label: 'Ver vagas abertas',
    link: '/trabalhe-conosco',
    image: '',
  },
  faq_side: {
    title: 'Ainda tem<br/>Dúvidas?',
    subtitle: 'Nossa equipe técnica e comercial está pronta para atender você.',
    cta_label: 'Falar com Consultor',
    cta_link: '/contato',
  },
};

// Faz merge profundo limitado a 1 nível por chave-de-seção.
// Mantém DEFAULTS quando o backend ainda não tem aquele campo.
const mergeConfig = (base, incoming) => {
  const out = JSON.parse(JSON.stringify(base));
  if (!incoming) return out;
  for (const key of Object.keys(base)) {
    if (incoming[key] !== undefined) {
      if (Array.isArray(base[key]) || typeof base[key] !== 'object' || base[key] === null) {
        out[key] = incoming[key];
      } else {
        out[key] = { ...base[key], ...incoming[key] };
        // Se a seção tem array (cards/items/steps), respeita o do backend
        for (const subKey of Object.keys(base[key])) {
          if (Array.isArray(base[key][subKey]) && Array.isArray(incoming[key]?.[subKey])) {
            out[key][subKey] = incoming[key][subKey];
          }
        }
      }
    }
  }
  // Preserva campos extras que vieram do backend e não estão no DEFAULTS (ex: hero_bg)
  for (const key of Object.keys(incoming)) {
    if (out[key] === undefined) out[key] = incoming[key];
  }
  return out;
};

const TABS = [
  { id: 'hero',        label: 'Topo',         icon: HomeIcon },
  { id: 'numbers',     label: 'Números',      icon: BarChart3 },
  { id: 'performance', label: 'Missão/Visão', icon: Award },
  { id: 'about',       label: 'Sobre Nós',    icon: FileText },
  { id: 'services',    label: 'Serviços',     icon: LayoutGrid },
  { id: 'process',     label: 'Explore Recursos', icon: Compass },
  { id: 'jobs_cta',    label: 'Trabalhe Conosco', icon: Briefcase },
  { id: 'faq',         label: 'FAQ',          icon: HelpCircle },
];

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('hero');
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState({});
  const [pendingPreviews, setPendingPreviews] = useState({});
  const { dirty, markClean } = useDirty(config, { ready: !loading, extra: Object.keys(pendingFiles).length > 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}?page=${PAGE_KEY}`);
        const incoming = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
        setConfig(mergeConfig(DEFAULTS, incoming));
      } catch (err) {
        console.error(err);
        setConfig(DEFAULTS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSection = (section, patch) => {
    setConfig((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const handleFile = (fieldName, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('Imagem muito pesada (máx 10MB).'); return; }
    setPendingFiles((p) => ({ ...p, [fieldName]: file }));
    setPendingPreviews((p) => ({ ...p, [fieldName]: URL.createObjectURL(file) }));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('page', PAGE_KEY);
      fd.append('content_json', JSON.stringify(config));
      for (const [field, file] of Object.entries(pendingFiles)) fd.append(field, file);
      const res = await axios.post(API_URL, fd);
      const next = res.data && res.data.data ? mergeConfig(DEFAULTS, res.data.data) : config;
      setConfig(next);
      markClean(next);
      setPendingFiles({});
      setPendingPreviews({});
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
      window.showToast?.('Página Home salva.');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar.';
      setError(msg);
      window.showToast?.(msg, 'error');
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
    <AdminPage
      title="Página Home"
      subtitle="Os campos já vêm preenchidos com o conteúdo atual do site. Edite e clique em Salvar."
      save={{ onSave: handleSave, saving, dirty, savedAt }}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
     <AdminCard>
      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {activeTab === 'hero' && (
        <div className="space-y-8">
          <HeroForm config={config.hero} update={(p) => updateSection('hero', p)} onFile={handleFile} preview={pendingPreviews.hero_bg} currentImage={config.hero_bg} />
          <VisualForm config={config.visual} update={(p) => updateSection('visual', p)} />
        </div>
      )}
      {activeTab === 'numbers' && (
        <NumbersForm config={config.numbers} update={(p) => updateSection('numbers', p)} />
      )}
      {activeTab === 'performance' && (
        <PerformanceForm config={config.performance} update={(p) => updateSection('performance', p)} />
      )}
      {activeTab === 'about' && (
        <AboutForm config={config.about} update={(p) => updateSection('about', p)} />
      )}
      {activeTab === 'services' && (
        <CardsEditor section="services" config={config.services} update={(p) => updateSection('services', p)} onFile={handleFile} pendingPreviews={pendingPreviews} hint="Cards horizontais com imagem e link" />
      )}
      {activeTab === 'process' && (
        <ProcessForm config={config.process} update={(p) => updateSection('process', p)} onFile={handleFile} pendingPreviews={pendingPreviews} />
      )}
      {activeTab === 'jobs_cta' && (
        <JobsCtaForm config={config.jobs_cta} update={(p) => updateSection('jobs_cta', p)} />
      )}
      {activeTab === 'faq' && (
        <div>
          <p className="text-xs text-gray-500 mb-4">O bloco lateral é salvo pelo botão <strong>Salvar alterações</strong> do topo. Cada pergunta tem o próprio botão de salvar.</p>
          <AboutFAQSide config={config.faq_side} update={(p) => updateSection('faq_side', p)} />
          <hr className="my-6 border-gray-100" />
          <AdminFAQ pageKey="home" />
        </div>
      )}
     </AdminCard>
    </AdminPage>
  );
}

// ─── HERO ──────────────────────────────────────────────────────
function HeroForm({ config, update, onFile, preview, currentImage }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Tag (etiqueta verde acima do título)" value={config.tag} onChange={(e) => update({ tag: e.target.value })} />
        <Input label="Texto da seta de scroll" value={config.scroll_label} onChange={(e) => update({ scroll_label: e.target.value })} />
        <Input label="Título — linha 1" value={config.title_line1} onChange={(e) => update({ title_line1: e.target.value })} />
        <Input label="Título — linha 2 (destaque em verde)" value={config.title_line2} onChange={(e) => update({ title_line2: e.target.value })} />
      </div>
      <TextArea label="Subtítulo" value={config.subtitle} onChange={(e) => update({ subtitle: e.target.value })} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Texto Botão 1" value={config.cta1_label} onChange={(e) => update({ cta1_label: e.target.value })} />
        <Input label="Link Botão 1" value={config.cta1_link} onChange={(e) => update({ cta1_link: e.target.value })} />
        <Input label="Texto Botão 2" value={config.cta2_label} onChange={(e) => update({ cta2_label: e.target.value })} />
        <Input label="Link Botão 2" value={config.cta2_link} onChange={(e) => update({ cta2_link: e.target.value })} />
      </div>

      <HeroVideoFields config={config} update={update} />

      <ImageField
        label="Imagem de fundo do Hero"
        currentUrl={currentImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop'}
        previewUrl={preview}
        fieldName="hero_bg"
        onFile={onFile}
        hint="A imagem mostrada acima é a que está sendo exibida na Home. Clique para trocar."
      />
    </div>
  );
}

// ─── FUNDO DO TOPO (degradê + textura) ─────────────────────────
function VisualForm({ config = {}, update }) {
  const sel = config.gradient || 'atual';
  const g = resolveGradient(config);
  return (
    <div className="space-y-4 pt-6 border-t border-gray-100">
      <div>
        <h4 className="text-sm font-bold text-gray-800">Fundo do topo da Home</h4>
        <p className="text-xs text-gray-500 mt-1">Cor do degradê e textura atrás do título. Só tons de verde, seguindo a identidade da SIF.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(GRADIENT_PRESETS).map(([id, p]) => (
          <button key={id} type="button" onClick={() => update({ gradient: id })}
            className={`rounded-xl overflow-hidden border-2 text-left transition-all ${sel === id ? 'border-[#007a3d] ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="h-14" style={{ background: `radial-gradient(circle at 50% 0%, ${p.from}, ${p.to})` }} />
            <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-700">{p.label}</div>
          </button>
        ))}
        <button type="button" onClick={() => update({ gradient: 'custom', from: config.from || g.from, to: config.to || g.to })}
          className={`rounded-xl overflow-hidden border-2 text-left transition-all ${sel === 'custom' ? 'border-[#007a3d] ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className="h-14" style={{ background: `radial-gradient(circle at 50% 0%, ${config.from || g.from}, ${config.to || g.to})` }} />
          <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-700">Personalizado</div>
        </button>
      </div>
      {sel === 'custom' && (
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-xs">Cor de cima
            <input type="color" value={config.from || g.from} onChange={(e) => update({ from: e.target.value })} className="w-10 h-8 rounded border border-gray-200" />
          </label>
          <label className="flex items-center gap-2 text-xs">Cor de baixo
            <input type="color" value={config.to || g.to} onChange={(e) => update({ to: e.target.value })} className="w-10 h-8 rounded border border-gray-200" />
          </label>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">Textura</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEXTURES).map(([id, t]) => (
            <button key={id} type="button" onClick={() => update({ texture: id })}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${(config.texture || 'ruido') === id ? 'bg-[#007a3d] text-white border-[#007a3d]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#007a3d]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NÚMEROS (bento grid com contagem animada) ─────────────────
function NumbersForm({ config = {}, update }) {
  const confirm = useConfirm();
  const cards = config.cards || [];
  const setCard = (i, patch) => update({ cards: cards.map((c, j) => j === i ? { ...c, ...patch } : c) });
  const addCard = () => update({ cards: [...cards, { prefix: '', number: '', unit: '', label: '', image: '', link: '' }] });
  const removeCard = async (i) => {
    if (!(await confirm({ title: 'Remover este card?', confirmLabel: 'Remover' }))) return;
    update({ cards: cards.filter((_, j) => j !== i) });
  };
  const POS_LABEL = ['Card 1 — grande (esquerda)', 'Card 2 — meio, em cima', 'Card 3 — meio, embaixo', 'Card 4 — alto (direita)'];

  return (
    <div className="space-y-6">
      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${config.enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
        <input type="checkbox" checked={!!config.enabled} onChange={(e) => update({ enabled: e.target.checked })} className="w-5 h-5 accent-[#007a3d]" />
        <span>
          <span className="block text-sm font-bold text-gray-800">{config.enabled ? 'Bloco de números visível na Home' : 'Bloco de números desligado'}</span>
          <span className="block text-xs text-gray-500">Aparece logo abaixo dos banners. Ligue só depois de conferir os números.</span>
        </span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Etiqueta (acima do título)" value={config.tag || ''} onChange={(e) => update({ tag: e.target.value })} />
        <Input label="Título do bloco" value={config.title || ''} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <Input label="Frase abaixo do título (opcional)" value={config.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} />
      <p className="text-xs text-gray-500">
        Os 4 primeiros cards formam o mosaico (grande, dois empilhados e um alto). O número conta do zero até o valor quando o visitante chega na seção —
        use vírgula para decimais (ex.: <strong>10,73</strong>). Card sem número não aparece.
      </p>

      <div className="space-y-4">
        {cards.map((c, i) => (
          <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{POS_LABEL[i] || `Card ${i + 1} — linha extra`}</h4>
              <ItemActions size={14} onMove={(dir) => update({ cards: moveItem(cards, i, dir) })} isFirst={i === 0} isLast={i === cards.length - 1} onDelete={() => removeCard(i)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Antes (ex.: +)" value={c.prefix || ''} onChange={(e) => setCard(i, { prefix: e.target.value })} />
                  <Input label="Número (ex.: 10,73)" value={c.number || ''} onChange={(e) => setCard(i, { number: e.target.value })} />
                  <Input label="Unidade (ex.: milhões)" value={c.unit || ''} onChange={(e) => setCard(i, { unit: e.target.value })} />
                </div>
                <Input label="Legenda" value={c.label || ''} onChange={(e) => setCard(i, { label: e.target.value })} />
                <Input label="Link ao clicar (opcional)" value={c.link || ''} onChange={(e) => setCard(i, { link: e.target.value })} placeholder="/institucional ou https://..." />
              </div>
              <KitImageField
                label="Foto de fundo"
                value={c.image}
                onFile={(file) => uploadImageNow(file).then(url => url && setCard(i, { image: url })).catch(toastError)}
                onRemove={() => setCard(i, { image: '' })}
                aspect="h-40"
                hint="Envia na hora; Salvar publica."
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addCard} className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-700 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Plus size={18} /> Adicionar card
        </button>
      </div>
    </div>
  );
}

// ─── VÍDEO DO TOPO ──────────────────────────────────────────────
function HeroVideoFields({ config, update }) {
  const [busy, setBusy] = React.useState(false);
  const send = async (file) => {
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) { window.showToast?.('Vídeo muito grande. Máximo 40 MB.', 'error'); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await apiRequest(`${API_BASE_URL}/upload_video.php`, { method: 'POST', body: fd });
      update({ video_loop: data.url });
      window.showToast?.('Vídeo enviado. Clique em Salvar para publicar.');
    } catch (err) { toastError(err); }
    finally { setBusy(false); }
  };
  return (
    <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
      <div>
        <p className="text-sm font-bold text-gray-800">Vídeo de fundo (opcional)</p>
        <p className="text-xs text-gray-500">Toca sem som, em loop, atrás do texto. Use um trecho curto (10 a 20 s), MP4, sem áudio, até 40 MB (ideal: menos de 8 MB). A imagem de fundo abaixo aparece enquanto o vídeo carrega.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer ${busy ? 'opacity-50 pointer-events-none' : 'bg-white border-gray-200 text-gray-700 hover:border-[#007a3d] hover:text-[#007a3d]'}`}>
          <UploadCloud size={16} /> {busy ? 'Enviando...' : (config.video_loop ? 'Trocar vídeo' : 'Enviar vídeo')}
          <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => { send(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
        {config.video_loop && (
          <>
            <span className="text-xs text-gray-500 truncate max-w-[260px]">{config.video_loop.split('/').pop()}</span>
            <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => update({ video_loop: '' })}>Remover vídeo</button>
          </>
        )}
      </div>
      {config.video_loop && <video src={getImageUrl(config.video_loop)} className="w-full max-w-md rounded-lg" muted loop autoPlay playsInline />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Vídeo completo (link do YouTube, Vimeo ou MP4)" value={config.video_full_url || ''} onChange={(e) => update({ video_full_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
        <Input label="Texto do botão (discreto, no canto)" value={config.video_full_label || ''} onChange={(e) => update({ video_full_label: e.target.value })} placeholder="Assistir vídeo completo" />
      </div>
      <p className="text-xs text-gray-500">Sem link do vídeo completo, o botão não aparece.</p>
    </div>
  );
}

// ─── TRABALHE CONOSCO (seção da Home) ─────────────────────────
function JobsCtaForm({ config = {}, update }) {
  return (
    <div className="space-y-6">
      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${config.enabled !== false ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
        <input type="checkbox" checked={config.enabled !== false} onChange={(e) => update({ enabled: e.target.checked })} className="w-5 h-5 accent-[#007a3d]" />
        <span>
          <span className="block text-sm font-bold text-gray-800">{config.enabled !== false ? 'Seção visível na Home' : 'Seção desligada'}</span>
          <span className="block text-xs text-gray-500">Card abaixo das empresas associadas que leva para a página de vagas. Mostra sozinho quantas vagas estão abertas.</span>
        </span>
      </label>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Etiqueta" value={config.tag || ''} onChange={(e) => update({ tag: e.target.value })} />
            <Input label="Título" value={config.title || ''} onChange={(e) => update({ title: e.target.value })} />
          </div>
          <Input label="Texto" value={config.text || ''} onChange={(e) => update({ text: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Texto do botão" value={config.btn_label || ''} onChange={(e) => update({ btn_label: e.target.value })} />
            <Input label="Link" value={config.link || ''} onChange={(e) => update({ link: e.target.value })} placeholder="/trabalhe-conosco" />
          </div>
        </div>
        <KitImageField label="Foto (opcional)" value={config.image}
          onFile={(file) => uploadImageNow(file).then(url => url && update({ image: url })).catch(toastError)}
          onRemove={() => update({ image: '' })} aspect="h-48" hint="Envia na hora; Salvar publica." />
      </div>
    </div>
  );
}

// ─── PERFORMANCE (Missão/Visão/Valores) ────────────────────────
// Quantidade fixa de 3 blocos — o layout depende disso (grid 3 colunas).
// Só edição inline; sem adicionar/remover/reordenar.
function PerformanceForm({ config, update }) {
  const items = config.items || [];
  const updateItem = (idx, patch) => {
    const newItems = items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    update({ items: newItems });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Blocos exibidos abaixo do Hero (sobre fundo verde). Quantidade fixa em 3 para manter o layout.</p>
      {items.map((item, idx) => (
        <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Bloco #{idx + 1}</h4>
          <Input label="Título" value={item.title} onChange={(e) => updateItem(idx, { title: e.target.value })} />
          <div className="mt-3">
            <TextArea label="Texto" rows={2} value={item.text} onChange={(e) => updateItem(idx, { text: e.target.value })} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────
function AboutForm({ config, update }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Tag (etiqueta acima do título)" value={config.tag} onChange={(e) => update({ tag: e.target.value })} />
        <Input label="Título (aceita HTML — span destaca em verde)" value={config.title} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <TextArea label="Parágrafo 1 (ao lado do vídeo)" rows={4} value={config.paragraph_1} onChange={(e) => update({ paragraph_1: e.target.value })} />
      <TextArea label="Parágrafo 2 (abaixo do vídeo)" rows={4} value={config.paragraph_2} onChange={(e) => update({ paragraph_2: e.target.value })} />
      <TextArea label="Parágrafo 3 (abaixo do vídeo)" rows={4} value={config.paragraph_3} onChange={(e) => update({ paragraph_3: e.target.value })} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Texto botão" value={config.cta_label} onChange={(e) => update({ cta_label: e.target.value })} />
        <Input label="Link botão" value={config.cta_link} onChange={(e) => update({ cta_link: e.target.value })} />
      </div>
      <Input label="URL do vídeo (YouTube)" value={config.video_url} onChange={(e) => update({ video_url: e.target.value })} hint="Cole qualquer link do YouTube: normal (watch?v=...), curto (youtu.be/...) ou embed" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Badge — valor (canto)" value={config.badge_value} onChange={(e) => update({ badge_value: e.target.value })} />
        <Input label="Badge — legenda" value={config.badge_label} onChange={(e) => update({ badge_label: e.target.value })} />
      </div>
    </div>
  );
}

// ─── PROCESS (Explore nossos recursos) ─────────────────────────
// Quantidade de cards é fixa — sem adicionar, remover ou alterar ícone.
function ProcessForm({ config, update, onFile, pendingPreviews }) {
  const steps = config.steps || [];
  const updateStep = (idx, patch) => update({ steps: steps.map((s, i) => i === idx ? { ...s, ...patch } : s) });
  const moveStep = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= steps.length) return;
    const next = [...steps];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    update({ steps: next });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Tag da seção" value={config.section_tag} onChange={(e) => update({ section_tag: e.target.value })} />
        <Input label="Título da seção" value={config.section_title} onChange={(e) => update({ section_title: e.target.value })} />
      </div>
      <Input label="Subtítulo" value={config.section_subtitle} onChange={(e) => update({ section_subtitle: e.target.value })} />

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const fieldName = `process_step_${idx}_img`;
          return (
            <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recurso #{idx + 1}</h4>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                  <button onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronDown size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Número (01, 02...)" value={step.id || ''} onChange={(e) => updateStep(idx, { id: e.target.value })} />
                <Input label="Título" value={step.title || ''} onChange={(e) => updateStep(idx, { title: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <Input label="Texto curto (negrito verde)" value={step.shortDesc || ''} onChange={(e) => updateStep(idx, { shortDesc: e.target.value })} />
                <Input label="Tags (separadas por vírgula)" value={step.benefits || ''} onChange={(e) => updateStep(idx, { benefits: e.target.value })} />
              </div>
              <div className="mt-3">
                <TextArea label="Descrição longa" rows={2} value={step.fullDesc || ''} onChange={(e) => updateStep(idx, { fullDesc: e.target.value })} />
              </div>
              <div className="mt-3">
                <Input label="Link" value={step.link || ''} onChange={(e) => updateStep(idx, { link: e.target.value })} />
              </div>
              <div className="mt-3">
                {/* Envia na hora e grava o caminho no próprio card: reordenar ou
                    remover antes de salvar não troca a imagem de card */}
                <ImageField label="Imagem de fundo do card" currentUrl={step.img} fieldName={fieldName}
                  onFile={(_, file) => uploadImageNow(file).then(url => url && updateStep(idx, { img: url })).catch(toastError)}
                  hint="Imagem horizontal, 1200×800px. Envia na hora; clique em Salvar para publicar." />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CARDS (Services) ──────────────────────────────────────────
function CardsEditor({ section, config, update, onFile, pendingPreviews, hint }) {
  const confirm = useConfirm();
  const cards = config.cards || [];
  const updateCard = (idx, patch) => update({ cards: cards.map((c, i) => i === idx ? { ...c, ...patch } : c) });
  const addCard = () => update({ cards: [...cards, { id: String(cards.length + 1).padStart(2, '0'), tag: '', title: 'Novo card', desc: '', link: '/', image: '' }] });
  const removeCard = async (idx) => { if (await confirm({ title: 'Remover este card?', message: 'O card sai da Home ao salvar.', confirmLabel: 'Remover' })) update({ cards: cards.filter((_, i) => i !== idx) }); };
  const moveCard = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= cards.length) return;
    const next = [...cards];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    update({ cards: next });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Tag da seção" value={config.section_tag || ''} onChange={(e) => update({ section_tag: e.target.value })} />
        <Input label="Título da seção" value={config.section_title || ''} onChange={(e) => update({ section_title: e.target.value })} />
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      <div className="space-y-4">
        {cards.map((card, idx) => {
          const fieldName = `${section}_card_${idx}_image`;
          return (
            <div key={idx} className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card #{idx + 1}</h4>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveCard(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                  <button onClick={() => moveCard(idx, 1)} disabled={idx === cards.length - 1} className="p-1.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronDown size={16} /></button>
                  <button onClick={() => removeCard(idx)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Número (01, 02...)" value={card.id || ''} onChange={(e) => updateCard(idx, { id: e.target.value })} />
                <Input label="Tag (ex: Comercial)" value={card.tag || ''} onChange={(e) => updateCard(idx, { tag: e.target.value })} />
                <Input label="Título" value={card.title || ''} onChange={(e) => updateCard(idx, { title: e.target.value })} />
              </div>
              <div className="mt-3">
                <TextArea label="Descrição" rows={2} value={card.desc || ''} onChange={(e) => updateCard(idx, { desc: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-4 mt-3">
                <Input label="Link" value={card.link || ''} onChange={(e) => updateCard(idx, { link: e.target.value })} />
              </div>
              <div className="mt-3">
                <ImageField label="Imagem do card" currentUrl={card.image} fieldName={fieldName}
                  onFile={(_, file) => uploadImageNow(file).then(url => url && updateCard(idx, { image: url })).catch(toastError)}
                  hint="Envia na hora; clique em Salvar para publicar." />
              </div>
            </div>
          );
        })}
        <button onClick={addCard} className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-700 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Plus size={18} /> Adicionar card
        </button>
      </div>
    </div>
  );
}

// ─── FAQ — bloco lateral (texto fixo ao lado das perguntas) ────
function AboutFAQSide({ config, update }) {
  return (
    <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl mb-2">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Bloco lateral (verde, à esquerda das perguntas)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Título (usa &lt;br/&gt; para quebra)" value={config.title || ''} onChange={(e) => update({ title: e.target.value })} />
        <Input label="Subtítulo" value={config.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} />
        <Input label="Texto do botão" value={config.cta_label || ''} onChange={(e) => update({ cta_label: e.target.value })} />
        <Input label="Link do botão" value={config.cta_link || ''} onChange={(e) => update({ cta_link: e.target.value })} />
      </div>
    </div>
  );
}

// ─── CAMPO DE IMAGEM ──────────────────────────────────────────
function ImageField({ label, currentUrl, previewUrl, fieldName, onFile, hint }) {
  const displayUrl = previewUrl || (currentUrl ? (currentUrl.startsWith('http') ? currentUrl : getImageUrl(currentUrl)) : '');
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative w-full h-44 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-500 transition-colors">
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
