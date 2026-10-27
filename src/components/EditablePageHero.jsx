import React, { useState, useEffect } from 'react';
import DetailHero from './DetailHero';
import { getImageUrl } from '../apiConfig';
import { readBootOrCache, writeCache, fetchPageContent } from '../utils/pageBoot';

// Topo das páginas secundárias, no MESMO formato do topo das páginas de
// detalhe (Grupo Temático): capa com degradê, trilha de navegação, etiqueta,
// título e resumo.
// Conteúdo editável em Painel › <página> › Cabeçalho (campos hero_*).

// Versão "só visual": recebe os campos prontos (usada também no Institucional)
export function PageHeroView({ cfg, scrollTargetId }) {
  const img = cfg.hero_image || '';
  const cover = img ? (img.startsWith('http') ? img : getImageUrl(img, 1920)) : '';
  const title = [cfg.hero_title_line1, cfg.hero_title_highlight].filter(Boolean).join(' ').trim();
  // Sem botão: o de "descer" só levava a uma seção da própria página
  return <DetailHero cover={cover} eyebrow={cfg.hero_badge} title={title} summary={cfg.hero_subtitle} />;
}

// pageKey -> chave em page_content.php; defaults -> textos usados se o painel estiver vazio
// scrollTargetId -> id da seção logo abaixo (botão de descer)
export default function EditablePageHero({ pageKey, defaults, scrollTargetId }) {
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

  // Enquanto o conteúdo real não chega: fundo neutro do mesmo tamanho (sem
  // "flash" de texto ou imagem de exemplo).
  if (!ready) return <div className="min-h-[64vh] bg-[#0b2116] rounded-bl-[40px] md:rounded-bl-[80px]" />;

  // A imagem vem SOMENTE do banco (nunca a de exemplo dos defaults)
  const c = { ...defaults, ...(cfg || {}), hero_image: cfg?.hero_image || '' };
  return <PageHeroView cfg={c} scrollTargetId={scrollTargetId} />;
}
