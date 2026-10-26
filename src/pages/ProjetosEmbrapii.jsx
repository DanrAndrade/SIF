import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Factory, Sprout } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import SmartLink from '../components/ui/SmartLink';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePageConfig } from '../hooks/usePageConfig';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { getEffectiveProjectStatus } from '../utils/helpers';
import { EMBRAPII_DEFAULTS, EMBRAPII_HERO_DEFAULTS } from '../utils/embrapiiDefaults';
import { buttonClass, BtnArrow } from '../components/ui/Button';

const FRENTE_ICONS = [Sprout, Factory, Leaf];

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

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      <EditablePageHero pageKey="embrapii" defaults={EMBRAPII_HERO_DEFAULTS} scrollTargetId="embrapii-intro" />

      <main className="flex-grow">
        {/* APRESENTAÇÃO + FRENTES */}
        <section id="embrapii-intro" className="py-24 scroll-mt-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="max-w-3xl mb-16">
              {c.intro_tag && <span className="sif-eyebrow mb-4">{c.intro_tag}</span>}
              {c.intro_title && <h2 className="sif-title sif-h2 text-[#1f2937] leading-tight mb-6">{c.intro_title}</h2>}
              {c.intro_text && <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{c.intro_text}</p>}
            </div>
            {frentes.length > 0 && (
              <div className={`grid grid-cols-1 ${['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3'][Math.min(frentes.length, 3)]} gap-6`}>
                {frentes.map((f, i) => {
                  const Icon = FRENTE_ICONS[i % FRENTE_ICONS.length];
                  return (
                    <div key={i} className="bg-white rounded-card p-8 border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#007a3d] flex items-center justify-center mb-6"><Icon size={22} /></div>
                      <h3 className="text-xl font-semibold text-[#1f2937] mb-3">{f.title}</h3>
                      {f.text && <p className="text-gray-500 leading-relaxed">{f.text}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SEÇÕES LIVRES (texto, abas, PDFs, logos) */}
        {sections.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-5xl">
              <ContentSectionsRenderer sections={sections} />
            </div>
          </section>
        )}

        {/* PROJETOS EM ANDAMENTO (vêm do cadastro de Projetos) */}
        {c.projects_enabled !== false && shownProjects.length > 0 && (
          <section className="py-24">
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
                  <Link key={p.id} to={`/projetos/${p.slug}`} className="group bg-white rounded-card overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
                    {p.image_url && (
                      <div className="h-44 overflow-hidden bg-gray-100">
                        <img src={getImageUrl(p.image_url, 800)} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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

        {/* CHAMADA FINAL */}
        {(c.cta_title || c.cta_text) && (
          <section className="pb-24 pt-8">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="relative overflow-hidden rounded-panel bg-gradient-to-br from-[#007a3d] to-[#0f3d24] text-white p-10 md:p-16 text-center">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#7FBA00] rounded-full blur-[120px] opacity-25 pointer-events-none"></div>
                <div className="relative max-w-2xl mx-auto">
                  {c.cta_title && <h2 className="sif-title sif-h2 mb-5">{c.cta_title}</h2>}
                  {c.cta_text && <p className="text-white/80 text-lg leading-relaxed">{c.cta_text}</p>}
                  {c.cta_btn_label && (
                    <SmartLink href={c.cta_btn_link || '/contato'} className={`mt-8 ${buttonClass('light')}`}>
                      <span className="py-2">{c.cta_btn_label}</span><BtnArrow variant="light" />
                    </SmartLink>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
