// Chamadas do painel à API com checagem de verdade.
//
// apiRequest() lê a resposta, confere o código HTTP e os campos de erro do
// PHP ({success:false}, {status:'error'}, {error}) e, se algo falhou, lança
// um Error com a mensagem do servidor. Assim nenhuma tela mostra "Salvo"
// quando não salvou, nem "Erro de conexão" quando o servidor respondeu.
import { API_BASE_URL } from '../apiConfig';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new ApiError('Sem conexão com o servidor. Verifique a internet e tente de novo.', 0);
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* resposta não é JSON */ }

  const failed = !res.ok
    || (data && typeof data === 'object' && (data.success === false || data.status === 'error'));

  if (failed) {
    const msg = (data && (data.message || data.error))
      || (res.status === 406 || res.status === 403
        ? `O servidor bloqueou o envio (erro ${res.status}).`
        : `Erro ao salvar (resposta ${res.status} do servidor).`);
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

// Grava campos de uma página em page_configs. Envie SÓ os campos do próprio
// formulário: o PHP mescla com o que já existe, então os outros blocos da
// página (hero, contato, conteúdo...) não são sobrescritos com dados antigos.
export async function savePageConfig(pageKey, fields, files = {}) {
  const fd = new FormData();
  fd.append('page', pageKey);
  fd.append('content_json', JSON.stringify(fields));
  for (const [name, file] of Object.entries(files)) {
    if (file) fd.append(name, file);
  }
  const data = await apiRequest(`${API_BASE_URL}/page_content.php`, { method: 'POST', body: fd });
  return (data && data.data) || {};
}

// Envia uma imagem na hora (upload.php) e devolve o caminho salvo.
export async function uploadImageNow(file) {
  if (!file) return null;
  if (file.size > 10 * 1024 * 1024) throw new ApiError('Imagem muito grande. Máximo 10 MB.', 400);
  const fd = new FormData();
  fd.append('image', file);
  const data = await apiRequest(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
  return data.url;
}

// Pega só as chaves listadas de um objeto.
export const pickKeys = (obj, keys) =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

// Mostra o erro no toast padrão do painel. (Sessão expirada já é avisada
// pelo apiInterceptor — não repete o aviso.)
export const toastError = (err) => {
  if (err?.status === 401 && err?.data?.error === 'nao_autorizado') return;
  window.showToast?.(err?.message || 'Erro ao salvar.', 'error');
};
