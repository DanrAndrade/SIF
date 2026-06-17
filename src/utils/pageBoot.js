import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

// Camada de dados das páginas editáveis com 3 níveis (do mais rápido ao mais lento):
//   1. window.__BOOT__   -> JSON injetado pelo index.php no HTML inicial (1ª visita rápida)
//   2. localStorage      -> cache da última visita (stale-while-revalidate)
//   3. API page_content  -> busca normal (fallback — comportamento original)
//
// Tudo é tolerante a falha: se o boot/cache não existir ou der erro, cai para a API.
// Se a API falhar, mantém o que tinha. Nada quebra.

const PREFIX = 'pc_'; // page content cache

// Lê o dado inicial síncrono (boot do HTML ou cache local). Retorna null se não houver.
export function readBootOrCache(pageKey) {
  if (typeof window === 'undefined' || !pageKey) return null;

  // 1) Boot injetado pelo PHP — só vale se for desta mesma página
  try {
    if (window.__BOOT__ && window.__BOOT_PAGE__ === pageKey && typeof window.__BOOT__ === 'object') {
      return window.__BOOT__;
    }
  } catch { /* ignora */ }

  // 2) Cache local da última visita
  try {
    const raw = localStorage.getItem(PREFIX + pageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch { /* ignora */ }

  return null;
}

export function writeCache(pageKey, data) {
  if (typeof window === 'undefined' || !pageKey || !data) return;
  try { localStorage.setItem(PREFIX + pageKey, JSON.stringify(data)); } catch { /* quota/privado: ignora */ }
}

// Busca o conteúdo da página na API (fonte da verdade). Sempre retorna objeto.
export async function fetchPageContent(pageKey) {
  const res = await axios.get(`${API_BASE_URL}/page_content.php?page=${pageKey}`);
  return (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) ? res.data : {};
}
