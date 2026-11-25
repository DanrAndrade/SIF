// Memória de rolagem do site.
//   - Recarregar (F5) ou voltar/avançar no navegador: volta para ONDE A PESSOA PAROU.
//   - Abrir um link ou entrar de novo: vai para o topo (ou para a âncora #seção).
// O navegador não consegue restaurar sozinho porque o conteúdo chega depois (API,
// fotos), então a posição é guardada por endereço e restaurada assim que a página
// tem altura suficiente. Se a pessoa rolar, clicar ou usar o teclado, a restauração
// para na hora (nunca briga com o que ela está fazendo).

const KEY = 'sif:scroll:v1';
const MAX_ENTRIES = 40;
const USER_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'];

let restoring = false;
let finishRestore = null;
// Navegações (chave do React Router) cuja posição foi restaurada: as rolagens automáticas
// da página (âncora, aba) NÃO podem rodar nelas, mesmo depois que a restauração terminar.
const restoredNavs = new Set();
export const markRestored = (navKey) => { restoredNavs.add(navKey); };
export const wasRestored = (navKey) => restoredNavs.has(navKey);

// Páginas com rolagem automática (âncoras, abas) devem pular a delas enquanto isto for true
export const isRestoringScroll = () => restoring;

export const scrollKey = (loc = window.location) => loc.pathname + loc.search + loc.hash;

const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } };
const write = (m) => { try { sessionStorage.setItem(KEY, JSON.stringify(m)); } catch { /* sem armazenamento: segue sem memória */ } };

export function saveScroll(key, y) {
  const m = read();
  delete m[key];
  m[key] = Math.max(0, Math.round(y));
  const keys = Object.keys(m);
  while (keys.length > MAX_ENTRIES) delete m[keys.shift()];
  write(m);
}
export const savedScroll = (key) => { const v = read()[key]; return typeof v === 'number' ? v : 0; };

export function cancelRestore() { if (finishRestore) finishRestore(); }

// Leva a página até y quando ela já tiver altura para isso (tenta por até ~4 s)
export function restoreScroll(y) {
  cancelRestore();
  if (!(y > 4)) return false;
  restoring = true;
  let tries = 0;
  let stable = 0;
  const iv = setInterval(() => {
    tries += 1;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max >= y - 2) {
      if (Math.abs(window.scrollY - y) > 2) { window.scrollTo({ top: y, behavior: 'instant' }); stable = 0; }
      else stable += 1;
      if (stable >= 4) finish(); // ficou parada na posição por ~0,4 s
    }
    if (tries > 40) { // conteúdo menor que o esperado: vai até onde der
      if (max > 0 && window.scrollY < y) window.scrollTo({ top: Math.min(y, max), behavior: 'instant' });
      finish();
    }
  }, 100);
  function finish() {
    if (!restoring) return;
    restoring = false;
    clearInterval(iv);
    USER_EVENTS.forEach(e => window.removeEventListener(e, finish));
    finishRestore = null;
  }
  USER_EVENTS.forEach(e => window.addEventListener(e, finish, { passive: true }));
  finishRestore = finish;
  return true;
}

// Guarda a posição de cada endereço enquanto a pessoa rola
let tracking = false;
export let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
export function trackScroll() {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;
  let timer = 0;
  let pending = null;
  const flush = () => { clearTimeout(timer); timer = 0; if (pending) { saveScroll(pending.key, pending.y); pending = null; } };
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    // a chave é lida NA HORA do evento (um salvamento atrasado não cai no endereço novo)
    pending = { key: scrollKey(), y: window.scrollY };
    if (!timer) timer = setTimeout(flush, 250);
  }, { passive: true });
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
}

// Carregamento da página: recarregar ou voltar restaura onde parou; o resto começa no topo
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  let type = 'navigate';
  try { type = performance.getEntriesByType('navigation')[0]?.type || 'navigate'; } catch { /* navegador antigo */ }
  if (type === 'reload' || type === 'back_forward') {
    // 'default' é a chave da primeira entrada do histórico no React Router
    if (restoreScroll(savedScroll(scrollKey()))) markRestored('default');
  }
}
