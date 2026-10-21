import { useEffect } from 'react';

// Metatags de cada página (descrição, Open Graph/Twitter, canonical e dados
// estruturados). O conteúdo vem do painel, então tudo é calculado na hora
// a partir do que a página carregou. Ao sair, volta aos valores do index.html.
//
//   useSeo({ description, image, type: 'article', jsonLd: {...} })
//
// O título continua com usePageTitle(). O servidor (public/index.php) também
// injeta estas tags na 1ª carga para robôs que não executam JavaScript.

const SITE = 'https://sif.org.br';
const ORIGINAL = {};

function setMeta(attr, key, value) {
  if (value == null || value === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); el.dataset.seo = '1'; document.head.appendChild(el); }
  if (!(key in ORIGINAL)) ORIGINAL[key] = el.getAttribute('content');
  el.setAttribute('content', value);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
  if (!('canonical' in ORIGINAL)) ORIGINAL.canonical = el.getAttribute('href');
  el.setAttribute('href', href);
}

const clean = (t = '', max = 160) => {
  const s = String(t).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : s;
};

export function useSeo({ description, image, type = 'website', jsonLd, noindex = false } = {}) {
  const desc = clean(description);
  const json = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const path = window.location.pathname.replace(base, '') || '/';
    const url = SITE + path;
    if (desc) {
      setMeta('name', 'description', desc);
      setMeta('property', 'og:description', desc);
      setMeta('name', 'twitter:description', desc);
    }
    setMeta('property', 'og:title', document.title);
    setMeta('name', 'twitter:title', document.title);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    if (image) { setMeta('property', 'og:image', image); setMeta('name', 'twitter:image', image); }
    if (noindex) setMeta('name', 'robots', 'noindex');
    setCanonical(url);

    let script;
    if (json) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = '1';
      script.textContent = json;
      document.head.appendChild(script);
    }
    return () => {
      if (script) script.remove();
      for (const [k, v] of Object.entries(ORIGINAL)) {
        if (k === 'canonical') { document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', v || SITE + '/'); continue; }
        const el = document.head.querySelector(`meta[name="${k}"], meta[property="${k}"]`);
        if (!el) continue;
        if (v == null) el.remove(); else el.setAttribute('content', v);
      }
    };
  }, [desc, image, type, json, noindex]);
}
