// URL do backend PHP.
//   - Desenvolvimento (vite dev): aponta para o XAMPP local.
//   - Produção (vite build): caminho RELATIVO derivado do base do Vite
//     (ex.: '/sif-novo-h7k2x9/sif-api'). Como o site e a API ficam no
//     mesmo domínio (same-origin), o caminho relativo funciona — e ao
//     mover o site para a raiz basta trocar o `base` do Vite: navegação,
//     assets E API se ajustam sozinhos, sem mexer aqui.
export const API_BASE_URL = import.meta.env.PROD
  ? `${import.meta.env.BASE_URL}sif-api`
  : 'http://localhost/sif-api';

// Pastas servidas estaticamente pelo Vite (/public/...) — NÃO concatenar com API_BASE_URL.
const STATIC_PREFIXES = ['/nossa-gente/', '/logos/', '/docs/', '/img/'];

// Prefixo base do site (ex.: '/sif-novo-h7k2x9/' em produção, '/' em dev).
const BASE_URL = import.meta.env.BASE_URL || '/';

// Espaço não-quebrável (U+00A0) como literal, para troca por espaço normal.
const NBSP_CHAR = String.fromCharCode(160);

// Troca só os espaços não-quebráveis por espaço normal (para texto puro).
export const stripNbsp = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .split(NBSP_CHAR)
    .join(' ');
};

// Extrai o link de embed (YouTube/Vimeo) a partir de qualquer URL do vídeo.
const toVideoEmbed = (url) => {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
};

// Player responsivo (16/9) para embutir no conteúdo.
const videoIframe = (src) =>
  `<div class="sif-video"><iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

// Converte referências de vídeo (YouTube/Vimeo) em players incorporados.
// Cobre 3 casos: <a href="...vídeo...">, o próprio <iframe> do Quill (ql-video)
// e URL "solta" no texto. Necessário porque o editor às vezes salva o vídeo
// como link em vez de iframe.
const embedVideos = (html) => {
  if (!html || typeof html !== 'string') return html;
  let out = html;

  // A ordem importa: primeiro os <iframe> originais, depois os <a> e as URLs
  // soltas — assim os players que criamos não são reprocessados (evita wrap duplo).

  // 1) <iframe ... src="URL de vídeo" ...></iframe>  ->  normaliza p/ responsivo
  out = out.replace(/<iframe\b[^>]*src="([^"]+)"[^>]*>\s*<\/iframe>/gi, (full, src) => {
    const embed = toVideoEmbed(src);
    return embed ? videoIframe(embed) : full;
  });

  // 2) <a href="URL de vídeo">...</a>  ->  player
  out = out.replace(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi, (full, href) => {
    const embed = toVideoEmbed(href);
    return embed ? videoIframe(embed) : full;
  });

  // 3) URL de vídeo "solta" no texto (precedida por espaço ou > e não por aspas)
  out = out.replace(/(^|[\s>])(https?:\/\/[^\s<"']+)/gi, (full, pre, url) => {
    const embed = toVideoEmbed(url);
    return embed ? pre + videoIframe(embed) : full;
  });

  return out;
};

// Prepara HTML de conteúdo rico para exibição:
//  - troca &nbsp; por espaço normal (evita cortar palavra no meio);
//  - transforma links de YouTube/Vimeo em players incorporados.
export const cleanRichHtml = (html) => {
  if (!html || typeof html !== 'string') return html;
  return embedVideos(stripNbsp(html));
};

export const getImageUrl = (path) => {
  if (!path) return null;

  // Ignora links externos, base64 e previews locais
  if (path.startsWith('http') || path.startsWith('data:image') || path.startsWith('blob:')) return path;

  // Paths estáticos do site (servidos pelo Vite/host) ficam relativos ao base
  if (STATIC_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return (BASE_URL.replace(/\/$/, '') + path);
  }

  // Demais paths (uploads/...) vão para o backend
  const cleanPath = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${cleanPath}`;
};
