import React, { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import TeamManager from './inst/TeamManager';
import TimelineManager from './inst/TimelineManager';
import DocumentsManager from './inst/DocumentsManager';

const API = `${API_BASE_URL}/institucional.php`;

// Imagens que estão hoje na página estática /institucional — usadas como
// preview no admin enquanto o usuário não fez upload das próprias.
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2071';
const DEFAULT_QUEM_SOMOS_IMAGE = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop';

const DEFAULT_QUEM_SOMOS_TEXT1 = 'Fundada em 1974, a Sociedade de Investigações Florestais (SIF) consolida uma trajetória de cinco décadas como o elo estratégico entre a Universidade Federal de Viçosa (UFV) e o setor produtivo florestal brasileiro.';
const DEFAULT_QUEM_SOMOS_TEXT2 = 'Conectamos mais de 28 empresas associadas em projetos de pesquisa, desenvolvimento e inovação, formando a maior rede de cooperação universidade-empresa do setor no país.';

const SECTIONS = [
  { id: 'geral',      label: '🖼️ Hero & Quem Somos' },
  { id: 'nossa-gente', label: '👥 Nossa Gente' },
  { id: 'documentos', label: '📄 Estatutos & Documentos' },
  { id: 'timeline',   label: '📅 Linha do Tempo' },
];

function CollapsibleSection({ id, label, active, onToggle, children }) {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base font-bold uppercase text-[#1f2937] tracking-tight">{label}</h3>
        {active ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {active && <div className="px-8 pb-8">{children}</div>}
    </div>
  );
}

export default function InstitucionalAdmin() {
  const [activeSection, setActiveSection] = useState('geral');
  const [config, setConfig] = useState({
    hero_badge: 'A SIF & Sua História',
    hero_title_line1: 'Nossa',
    hero_title_highlight: 'História',
    hero_subtitle: 'Mais do que uma entidade, somos o catalisador da inovação florestal no Brasil e no mundo.',
    quem_somos_title: 'Nossa História',
    quem_somos_text1: '',
    quem_somos_text2: '',
    areas_tagline: 'Fronteira Tecnológica',
    areas_title: 'Nossas Áreas de Atuação',
    areas_subtitle: 'Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal de ponta.',
    estatuto_section_title: 'Documentação & Transparência',
    estatuto_section_subtitle: 'A transparência e a ética são os pilares da nossa estrutura organizacional. Acesse os documentos oficiais que regem nossas atividades.',
    historia_tagline: 'Nossa Jornada',
    cta_title: 'O Amanhã é Científico',
  });
  const [heroImage, setHeroImage] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [quemSomosImage, setQuemSomosImage] = useState(null);
  const [quemSomosPreview, setQuemSomosPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(API + '?resource=config')
      .then(r => r.json())
      .then(data => {
        const merged = (data && Object.keys(data).length > 0) ? data : {};
        setConfig(prev => ({
          ...prev,
          ...merged,
          // Garante que os textos do "Quem Somos" venham com o conteúdo atual
          // da página caso o admin ainda não tenha editado nada.
          quem_somos_text1: merged.quem_somos_text1 || prev.quem_somos_text1 || DEFAULT_QUEM_SOMOS_TEXT1,
          quem_somos_text2: merged.quem_somos_text2 || prev.quem_somos_text2 || DEFAULT_QUEM_SOMOS_TEXT2,
        }));
        // Imagens: mostra o que está no banco; se vazio, mostra o que está hoje
        // na página estática (fallback). Assim o admin sempre vê a imagem atual.
        setHeroPreview(merged.hero_image ? getImageUrl(merged.hero_image) : DEFAULT_HERO_IMAGE);
        setQuemSomosPreview(merged.quem_somos_image ? getImageUrl(merged.quem_somos_image) : DEFAULT_QUEM_SOMOS_IMAGE);
      })
      .catch(() => {
        // Backend offline — pelo menos exibe as imagens atuais da página
        setHeroPreview(DEFAULT_HERO_IMAGE);
        setQuemSomosPreview(DEFAULT_QUEM_SOMOS_IMAGE);
        setConfig(prev => ({
          ...prev,
          quem_somos_text1: prev.quem_somos_text1 || DEFAULT_QUEM_SOMOS_TEXT1,
          quem_somos_text2: prev.quem_somos_text2 || DEFAULT_QUEM_SOMOS_TEXT2,
        }));
      });
  }, []);

  const toggleSection = (id) => setActiveSection(prev => prev === id ? null : id);

  const handleSaveGeral = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('content_json', JSON.stringify(config));
    if (heroImage) fd.append('hero_image', heroImage);
    if (quemSomosImage) fd.append('quem_somos_image', quemSomosImage);
    await fetch(API + '?resource=config', { method: 'POST', body: fd });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (field, value) => setConfig(p => ({ ...p, [field]: value }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Institucional</h2>
          <p className="text-gray-500 text-sm mt-1">Configure textos, equipe, documentos e linha do tempo.</p>
        </div>
        {saved && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">✓ Salvo!</span>
        )}
      </div>

      {SECTIONS.map(sec => (
        <CollapsibleSection key={sec.id} id={sec.id} label={sec.label} active={activeSection === sec.id} onToggle={toggleSection}>

          {/* ── SEÇÃO: Hero & Quem Somos ── */}
          {sec.id === 'geral' && (
            <div className="space-y-6">
              {/* Hero */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase text-gray-500 tracking-widest border-b pb-2">Hero da Página</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload imagem hero */}
                  <div
                    className="h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#007a3d] transition-colors relative group"
                    onClick={() => document.getElementById('hero-img-input').click()}
                  >
                    {heroPreview ? (
                      <>
                        <img src={heroPreview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ImageIcon size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <ImageIcon size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">Imagem de Fundo do Hero</span>
                      </div>
                    )}
                    <input id="hero-img-input" type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files[0];
                      if (f) { setHeroImage(f); setHeroPreview(URL.createObjectURL(f)); }
                    }} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Badge</label>
                      <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.hero_badge || ''} onChange={e => set('hero_badge', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título (linha 1)</label>
                      <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.hero_title_line1 || ''} onChange={e => set('hero_title_line1', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título (palavra em verde)</label>
                      <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.hero_title_highlight || ''} onChange={e => set('hero_title_highlight', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Subtítulo</label>
                      <textarea className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={2} value={config.hero_subtitle || ''} onChange={e => set('hero_subtitle', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quem Somos */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase text-gray-500 tracking-widest border-b pb-2">Seção "Quem Somos"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#007a3d] transition-colors relative group"
                    onClick={() => document.getElementById('quem-somos-img-input').click()}
                  >
                    {quemSomosPreview ? (
                      <>
                        <img src={quemSomosPreview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><ImageIcon size={24} className="text-white" /></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300"><ImageIcon size={28} /><span className="text-xs font-bold uppercase tracking-widest text-center">Foto lateral<br/>(Quem Somos)</span></div>
                    )}
                    <input id="quem-somos-img-input" type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files[0];
                      if (f) { setQuemSomosImage(f); setQuemSomosPreview(URL.createObjectURL(f)); }
                    }} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Parágrafo 1</label>
                      <textarea className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={4} value={config.quem_somos_text1 || ''} onChange={e => set('quem_somos_text1', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Parágrafo 2</label>
                      <textarea className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={4} value={config.quem_somos_text2 || ''} onChange={e => set('quem_somos_text2', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA e Títulos de Seção */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase text-gray-500 tracking-widest border-b pb-2">Títulos de Seção</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Tagline — Áreas de Atuação</label>
                    <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.areas_tagline || ''} onChange={e => set('areas_tagline', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Tagline — Linha do Tempo</label>
                    <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.historia_tagline || ''} onChange={e => set('historia_tagline', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título — Estatutos (Governança)</label>
                    <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.estatuto_section_title || ''} onChange={e => set('estatuto_section_title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título CTA Final</label>
                    <input className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={config.cta_title || ''} onChange={e => set('cta_title', e.target.value)} />
                  </div>
                </div>
                <textarea className="w-full p-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={2} placeholder="Subtítulo — Estatutos" value={config.estatuto_section_subtitle || ''} onChange={e => set('estatuto_section_subtitle', e.target.value)} />
              </div>

              <Button onClick={handleSaveGeral} isLoading={saving} icon={Save} className="w-full">
                Salvar Hero & Textos Gerais
              </Button>
            </div>
          )}

          {sec.id === 'nossa-gente' && <TeamManager />}
          {sec.id === 'documentos' && <DocumentsManager />}
          {sec.id === 'timeline' && <TimelineManager />}
        </CollapsibleSection>
      ))}
    </div>
  );
}
