// Tudo que o site envia para a API (sif-api) passa por aqui. Duas funções:
//
// 1) Proteção contra o firewall da hospedagem (ModSecurity da HostGator).
//    O firewall bloqueia (HTTP 406) qualquer envio que contenha, por exemplo,
//    link completo para outro site ("https://www.instagram.com/...") ou o
//    "<p><br></p>" que o editor gera em toda linha em branco. Ou seja: quase
//    todo conteúdo do editor rico era barrado e o painel mostrava "Erro de conexão".
//    Solução: os textos vão codificados em base64url (só letras, números, "-"
//    e "_"), que o firewall não confunde com ataque. O PHP decodifica de volta
//    em sif-api/api_guard.php, antes de usar.
//      - FormData: cada campo de texto vira "__sifb64:<base64url>" (arquivos vão intactos)
//      - JSON:     o corpo inteiro vira {"__sif_b64":"<base64url>"}
//
// 2) Login: envia o cookie da sessão do painel em toda chamada (o PHP exige
//    login para gravar) e avisa quando a sessão expirou.
import { API_BASE_URL } from '../apiConfig';

export const MARK = '__sifb64:';

const toB64Url = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const isApiUrl = (url) => typeof url === 'string' && url.startsWith(API_BASE_URL);

export const encodeFormData = (fd) => {
  const out = new FormData();
  for (const [key, value] of fd.entries()) {
    out.append(key, typeof value === 'string' && value !== '' ? MARK + toB64Url(value) : value);
  }
  return out;
};

export const wrapJson = (json) => JSON.stringify({ __sif_b64: toB64Url(json) });

// Sessão expirada: avisa uma vez (evita vários toasts seguidos)
let lastSessionWarning = 0;
export const warnSessionExpired = (message) => {
  if (Date.now() - lastSessionWarning < 5000) return;
  lastSessionWarning = Date.now();
  window.showToast?.(message || 'Sua sessão do painel expirou. Faça login novamente para salvar.');
};

// fetch(): usado pela maior parte do painel
const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input?.url;
  if (!isApiUrl(url)) return originalFetch(input, init);

  init = { credentials: 'include', ...init };
  if (init.body instanceof FormData) init.body = encodeFormData(init.body);
  else if (typeof init.body === 'string') init.body = wrapJson(init.body);

  const res = await originalFetch(input, init);
  if (res.status === 401) {
    res.clone().json().then(d => { if (d?.error === 'nao_autorizado') warnSessionExpired(d.message); }).catch(() => {});
  }
  return res;
};

