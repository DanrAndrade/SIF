import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import { visibleSections, isSectionEmpty } from '../components/sections/sectionTypes';
import { EmbIntro, EmbAreas, EmbSteps, EmbTextDoc, EmbTeam, EmbCommittee, EmbLogos, EmbContact, matchBios } from '../components/embrapii/EmbrapiiBlocks';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePageConfig } from '../hooks/usePageConfig';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { getEffectiveProjectStatus } from '../utils/helpers';
import { EMBRAPII_DEFAULTS, EMBRAPII_HERO_DEFAULTS } from '../utils/embrapiiDefaults';
import { buttonClass, BtnArrow } from '../components/ui/Button';

const namedPeople = (sec) => (sec?.items || []).filter(p => p && p.name);

// Junta os blocos do painel em "cenas" com desenho próprio desta página:
//   cards                             → passos da parceria (lista ao lado da foto)
//   vídeo                             → vai para a apresentação (ao lado do texto)
//   texto + arquivos (sem título)     → texto com o documento em destaque
//   pessoas (com título)              → grade da equipe
//   texto + pessoas (sem título) [+ abas com os nomes] → comitê com minibios
//   logos                             → grade de logos sobre fundo branco (fim da página)
// Qualquer outro bloco usa o desenho padrão (ContentSectionsRenderer).
function buildScenes(sections) {
  const list = visibleSections(sections).filter(s => !isSectionEmpty(s));
  const scenes = [];
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    const next = list[i + 1];
    const after = list[i + 2];
    if (s.type === 'editor' && next?.type === 'pdfs' && !next.title) {
      scenes.push({ kind: 'textdoc', sec: s, docs: next }); i += 1; continue;
    }
    if (s.type === 'editor' && next?.type === 'people' && !next.title) {
      const bios = after?.type === 'tabs' && matchBios(namedPeople(next), after.tabs).size > 0 ? after : null;
      scenes.push({ kind: 'committee', intro: s, people: next, bios }); i += bios ? 2 : 1; continue;
    }
    if (s.type === 'people' && next?.type === 'tabs' && matchBios(namedPeople(s), next.tabs).size > 0) {
      scenes.push({ kind: 'committee', people: s, bios: next }); i += 1; continue;
    }
    if (s.type === 'cards') { scenes.push({ kind: 'steps', sec: s }); continue; }
    if (s.type === 'people') { scenes.push({ kind: 'team', sec: s }); continue; }
    if (s.type === 'logos') { scenes.push({ kind: 'logos', sec: s }); continue; }
    scenes.push({ kind: 'default', sec: s });
  }
  return scenes;
}

// Página "Projetos SIF e EMBRAPII" — editável em Painel › Páginas.
export default function ProjetosEmbrapii() {
  usePageTitle('Projetos SIF e EMBRAPII');
  const { config } = usePageConfig('embrapii');
  const c = { ...EMBRAPII_DEFAULTS, ...config };
  const frentes = Array.isArray(c.frentes) ? c.frentes.filter(f => f && f.title) : [];
  const sections = Array.isArray(c.sections) ? c.sections : [];
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    if (c.projects_enabled === false) return;
    fetch(`${API_BASE_URL}/projetos.php`)
      .then(r => r.json())
      .then(d => setProjetos((Array.isArray(d) ? d : []).filter(p => getEffectiveProjectStatus(p) !== 'Concluído')))
      .catch(() => setProjetos([]));
  }, [c.projects_enabled]);

  const shownProjects = projetos.slice(0, Number(c.projects_limit) || 6);
  const bandPhoto = [c.band_photo, c.hero_image, c.intro_image].filter(Boolean).map(p => getImageUrl(p, 1600));
  // O primeiro vídeo fica na apresentação, ao lado do texto (como na página de referência)
  const video = visibleSections(sections).find(s => s.type === 'video' && !isSectionEmpty(s));
  // Lado verde do formulário: mesma foto do painel da página de Contato
  const contactPhoto = getImageUrl('https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1600&auto=format&fit=crop', 1200);
  const scenes = buildScenes(sections.filter(s => !video || s.id !== video.id));
  // Logos no fim; o "Fale conosco" (formulário) vem logo abaixo deles
  const logoScenes = scenes.filter(s => s.kind === 'logos');
  const bodyScenes = scenes.filter(s => s.kind !== 'logos');

  const renderScene = (s, i) => {
    switch (s.kind) {
      case 'steps': return <EmbSteps key={s.sec.id} sec={s.sec} photo={c.parceria_image} />;
      case 'textdoc': return <EmbTextDoc key={s.sec.id} sec={s.sec} docs={s.docs} />;
      case 'team': return <EmbTeam key={s.sec.id} sec={s.sec} />;
      case 'committee': return <EmbCommittee key={(s.intro || s.people).id} intro={s.intro} people={s.people} bios={s.bios} photo={bandPhoto} />;
      case 'logos': return <EmbLogos key={s.sec.id} sec={s.sec} />;
      default: return <ContentSectionsRenderer key={s.sec.id || i} sections={[s.sec]} layout="page" bgPhoto={bandPhoto} />;
    }
  };

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      <EditablePageHero pageKey="embrapii" defaults={EMBRAPII_HERO_DEFAULTS} scrollTargetId="embrapii-intro" />

      <main className="flex-grow">
        <EmbIntro c={c} video={video} />
        <EmbAreas c={c} frentes={frentes} />

        {bodyScenes.map(renderScene)}

        {/* PROJETOS EM ANDAMENTO (vêm do cadastro de Projetos) */}
        {c.projects_enabled !== false && shownProjects.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  {c.projects_tag && <span className="sif-eyebrow mb-3">{c.projects_tag}</span>}
                  {c.projects_title && <h2 className="sif-title sif-h2 text-[#1f2937]">{c.projects_title}</h2>}
                </div>
                <Link to="/projetos" className={`shrink-0 self-start md:self-auto ${buttonClass('outline', 'sm')}`}>
                  <span className="py-2">Ver todos os projetos</span>
                  <BtnArrow variant="outline" size="sm" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shownProjects.map(p => (
                  <Link key={p.id} to={`/projetos/${p.slug}`} className="group bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 flex flex-col">
                    {p.image_url && (
                      <div className="h-44 overflow-hidden bg-gray-100">
                        <img src={getImageUrl(p.image_url, 800)} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-7 flex-grow flex flex-col">
                      {p.tag && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{p.tag}</span>}
                      <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#007a3d] transition-colors leading-snug">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {logoScenes.map(renderScene)}

        {/* FALE CONOSCO: texto + formulário próprio (mensagens em Painel › Mensagens EMBRAPII) */}
        {(c.cta_title || c.cta_text) && <EmbContact c={c} photo={contactPhoto} />}
      </main>

      <Footer />
    </div>
  );
}
