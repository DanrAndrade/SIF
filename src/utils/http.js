// Leitura simples da API para as páginas públicas (sem axios: deixa o site
// mais leve). Mesmo formato de resposta do axios ({ data }), para as telas
// não precisarem mudar. Erro HTTP vira exceção, como no axios.
export const http = {
  async get(url, options = {}) {
    const res = await fetch(url, options);
    let data = null;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.response = { status: res.status, data };
      throw err;
    }
    return { data, status: res.status };
  },
};
