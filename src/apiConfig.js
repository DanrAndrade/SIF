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

// Limpa HTML vindo do editor de texto rico antes de exibir.
// Conteúdo colado de Word/Google Docs/Quill costuma vir com &nbsp; (espaço
// não-quebrável) entre TODAS as palavras. Isso impede a quebra de linha normal:
// o navegador trata a frase como uma "palavra" gigante e acaba cortando no meio
// quando não cabe na coluna. Troca por espaço normal (entidade e caractere já
// decodificado), preservando o resto do HTML.
export const cleanRichHtml = (html) => {
  if (!html || typeof html !== 'string') return html;
  return html
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .split(NBSP_CHAR)
    .join(' ');
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
