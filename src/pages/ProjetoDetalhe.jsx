import React, { useEffect, useMemo, useState } from 'react';
import { usePageConfig } from '../hooks/usePageConfig';
import { PROJETOS_TEXTS, withTexts } from '../utils/pageTextDefaults';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import EditablePageContact from '../components/EditablePageContact';
import { useSeo } from '../hooks/useSeo';
import { usePageTitle } from '../hooks/usePageTitle';
import { getEffectiveProjectStatus } from '../utils/helpers';
import { loadBlogFonts } from '../utils/blogFonts';
import ProjectDossier, { buildChapters } from '../components/projeto/ProjectDossier';

const API_URL = `${API_BASE_URL}/projetos.php`;

const parseJson = (s, fallback) => { try { return s ? JSON.parse(s) : fallback; } catch { return fallback; } };

// Projetos antigos (abas e PDF soltos) viram capítulos, sem perder nada
function legacySections(projeto) {
  const out = [];
  const tabs = parseJson(projeto.tabs, []);
  if (Array.isArray(tabs) && tabs.length) out.push({ id: 'legado-abas', type: 'tabs', title: 'Detalhamento', tabs });
  if (projeto.pdf_url) out.push({ id: 'legado-pdf', type: 'pdfs', title: 'Documentos', pdfs: [{ url: projeto.pdf_url, title: 'Documento do Projeto' }] });
  return out;
}

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { config: pageCfg } = usePageConfig('projetos');
  const tx = withTexts(PROJETOS_TEXTS, pageCfg); // Painel › Projetos P&D › Textos da página
  usePageTitle(projeto?.title);
  useSeo({ description: projeto?.lead || projeto?.description, image: projeto?.image_url ? getImageUrl(projeto.image_url) : undefined });
  useEffect(() => { if (projeto?.description) loadBlogFonts(projeto.description); }, [projeto?.description]); // fontes escolhidas no texto

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error || !data.id) navigate('/projetos');
        else setProjeto(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar projeto:', err);
        navigate('/projetos');
      });
  }, [slug, navigate]);

  const view = useMemo(() => {
    if (!projeto) return null;
    const extra = parseJson(projeto.extra_data, {}) || {};
    const saved = Array.isArray(extra.sections) && extra.sections.length > 0 ? extra.sections : null;
    return {
      lead: typeof extra.lead === 'string' ? extra.lead : '',
      ficha: Array.isArray(extra.ficha) ? extra.ficha : [],
      chapters: buildChapters({ description: projeto.description, sections: saved || legacySections(projeto) }),
    };
  }, [projeto]);

  if (loading) {
    return (
      <div className="min-h-screen sif-page flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!projeto || !view) return null;

  return (
    <div className="sif-page min-h-screen font-sans selection:bg-[#007a3d] selection:text-white flex flex-col overflow-x-clip">
      <Navbar scrolled />
      <main className="flex-grow">
        <ProjectDossier
          projeto={projeto}
          status={getEffectiveProjectStatus(projeto)}
          ficha={view.ficha}
          lead={view.lead}
          chapters={view.chapters}
          tx={tx}
          contact={(
            <section className="py-16 bg-transparent">
              <div className="container mx-auto px-6 max-w-3xl">
                {/* CONTATO RESPONSÁVEL: configurado em /admin/projetos */}
                <EditablePageContact pageKey="projetos" fallbackTitle={tx.contact_title} />
              </div>
            </section>
          )}
        />
      </main>
      <Footer />
    </div>
  );
}
