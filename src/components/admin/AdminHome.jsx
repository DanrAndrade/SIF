import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Save, UploadCloud, Plus, Trash2, ChevronUp, ChevronDown,
  Home as HomeIcon, Award, FileText, LayoutGrid, Compass, HelpCircle, Loader2, Check,
} from 'lucide-react';
import { Input, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
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
  { id: 'hero',        label: 'Hero',         icon: HomeIcon },
  { id: 'performance', label: 'Missão/Visão', icon: Award },
  { id: 'about',       label: 'Sobre Nós',    icon: FileText },
  { id: 'services',    label: 'Serviços',     icon: LayoutGrid },
  { id: 'process',     label: 'Explore Recursos', icon: Compass },
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
      if (res.data && res.data.data) setConfig(mergeConfig(DEFAULTS, res.data.data));
      setPendingFiles({});
      setPendingPreviews({});
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
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
          <h2 className="text-xl font-bold text-gray-800">Página Home</h2>
          <p className="text-xs text-gray-500 mt-1">Os campos abaixo já vêm preenchidos com o conteúdo atual do site. Edite e salve.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          {activeTab !== 'faq' && (
            <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary">
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((t) => {
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
        <HeroForm config={config.hero} update={(p) => updateSection('hero', p)} onFile={handleFile} preview={pendingPreviews.hero_bg} currentImage={config.hero_bg} />
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
      {activeTab === 'faq' && (
        <div>
          <p className="text-xs text-gray-500 mb-4">Cada pergunta tem botão próprio de salvar.</p>
          <AboutFAQSide config={config.faq_side} update={(p) => updateSection('faq_side', p)} onMainSave={handleSave} saving={saving} />
          <hr className="my-6 border-gray-100" />
          <AdminFAQ pageKey="home" />
        </div>
      )}
    </div>
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
                <ImageField label="Imagem de fundo do card" currentUrl={step.img} previewUrl={pendingPreviews[fieldName]} fieldName={fieldName} onFile={(name, file) => {
                  onFile(name, file);
                }} hint="Imagem horizontal, 1200×800px." />
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
  const cards = config.cards || [];
  const updateCard = (idx, patch) => update({ cards: cards.map((c, i) => i === idx ? { ...c, ...patch } : c) });
  const addCard = () => update({ cards: [...cards, { id: String(cards.length + 1).padStart(2, '0'), tag: '', title: 'Novo card', desc: '', link: '/', image: '' }] });
  const removeCard = (idx) => { if (window.confirm('Remover este card?')) update({ cards: cards.filter((_, i) => i !== idx) }); };
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
                <ImageField label="Imagem do card" currentUrl={card.image} previewUrl={pendingPreviews[fieldName]} fieldName={fieldName} onFile={(name, file) => onFile(name, file)} hint="Após salvar, atualize a página para ver a imagem processada." />
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
function AboutFAQSide({ config, update, onMainSave, saving }) {
  return (
    <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl mb-2">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Bloco lateral (verde, à esquerda das perguntas)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Título (usa &lt;br/&gt; para quebra)" value={config.title || ''} onChange={(e) => update({ title: e.target.value })} />
        <Input label="Subtítulo" value={config.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} />
        <Input label="Texto do botão" value={config.cta_label || ''} onChange={(e) => update({ cta_label: e.target.value })} />
        <Input label="Link do botão" value={config.cta_link || ''} onChange={(e) => update({ cta_link: e.target.value })} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onMainSave} disabled={saving} isLoading={saving} variant="primary">
          <Save size={16} /> Salvar bloco lateral
        </Button>
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
