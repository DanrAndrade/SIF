import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import NoiseOverlay from './ui/NoiseOverlay';
import { getImageUrl } from '../apiConfig';
import { readBootOrCache, writeCache, fetchPageContent } from '../utils/pageBoot';

// Hero reutilizável editável via /admin/<page>.
// pageKey -> chave em page_content.php (eventos, treinamentos, gt, projetos, blog)
// defaults -> { hero_image, hero_badge, hero_title_line1, hero_title_highlight, hero_subtitle, hero_scroll_label }
// scrollTargetId -> id do elemento abaixo para o botão de scroll
export default function EditablePageHero({ pageKey, defaults, scrollTargetId, bgColor = '#f8f9fa' }) {
  // Boot (HTML) ou cache local -> renderiza na hora, com a imagem real (já pré-carregada).
  const initial = readBootOrCache(pageKey);
  const [cfg, setCfg] = useState(initial);
  const [ready, setReady] = useState(!!initial || !pageKey);

  useEffect(() => {
    if (!pageKey) { setReady(true); return; }
    let alive = true;
    fetchPageContent(pageKey)
      .then(data => { if (!alive) return; setCfg(data); writeCache(pageKey, data); })
      .catch(() => { if (alive && !cfg) setCfg({}); })
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  // Enquanto o conteúdo real não chega, mostra um placeholder neutro —
  // nunca o conteúdo de exemplo (evita o "flash" de texto/imagem provisória).
  if (!ready) {
    return <div className="relative min-h-[85vh] bg-[#0f1f11] overflow-hidden" />;
  }

  const c = { ...defaults, ...(cfg || {}) };
  // A imagem vem SOMENTE do banco (imagem enviada pelo admin). Nunca usa
  // imagem de exemplo dos defaults — se o banco não tiver, fica o fundo escuro.
  const bancoImg = cfg && cfg.hero_image ? cfg.hero_image : '';
  const heroBgUrl = bancoImg ? (bancoImg.startsWith('http') ? bancoImg : getImageUrl(bancoImg)) : '';

  return (
    <div className="relative min-h-[85vh] flex items-center pt-28 md:pt-32 pb-40 overflow-hidden bg-[#0f1f11]">
      <div className="absolute inset-0 z-0">
        {heroBgUrl && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroBgUrl}')` }}></div>}
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
        <NoiseOverlay opacity={0.4} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 rounded-tr-[80px] z-10" style={{ backgroundColor: bgColor }}></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {c.hero_badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">{c.hero_badge}</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.95] md:leading-[0.9] tracking-tighter mb-6 md:mb-8">
          {c.hero_title_line1} <br/>
          <span className="text-[#007a3d]">{c.hero_title_highlight}</span>
        </h1>
        {c.hero_subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-8 md:mb-12">{c.hero_subtitle}</p>
        )}
        {scrollTargetId && (
          <button
            onClick={() => {
              const section = document.getElementById(scrollTargetId);
              if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-[10px] hover:text-[#007a3d] transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] transition-all">
              <ChevronDown size={20} className="animate-bounce" />
            </div>
            {c.hero_scroll_label || ''}
          </button>
        )}
      </div>
    </div>
  );
}
