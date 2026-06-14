// URL do backend PHP.
//   - Desenvolvimento (vite dev): aponta para o XAMPP local.
//   - Produção (vite build): aponta para a subpasta no HostGator.
// O Vite troca automaticamente via import.meta.env.PROD.
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://sif.org.br/sif-novo-h7k2x9/sif-api'
  : 'http://localhost/sif-api';

// Pastas servidas estaticamente pelo Vite (/public/...) — NÃO concatenar com API_BASE_URL.
const STATIC_PREFIXES = ['/nossa-gente/', '/logos/', '/docs/', '/img/'];

// Prefixo base do site (ex.: '/sif-novo-h7k2x9/' em produção, '/' em dev).
const BASE_URL = import.meta.env.BASE_URL || '/';

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
