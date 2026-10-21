// Mesmo tratamento do apiInterceptor (firewall + login) para o axios, que só
// o PAINEL usa. Importado pelo AdminDashboard — não entra no site público.
import axios from 'axios';
import { isApiUrl, encodeFormData, wrapJson, warnSessionExpired } from './apiInterceptor';

// axios: usado em Banners, FAQ e algumas páginas públicas
axios.interceptors.request.use((config) => {
  if (!isApiUrl(config.url)) return config;
  config.withCredentials = true;
  const { data } = config;
  if (data == null) return config;
  if (data instanceof FormData) {
    config.data = encodeFormData(data);
  } else if (typeof data === 'object' || typeof data === 'string') {
    config.data = wrapJson(typeof data === 'string' ? data : JSON.stringify(data));
    config.headers.set('Content-Type', 'application/json');
  }
  return config;
});

axios.interceptors.response.use(undefined, (error) => {
  if (error?.response?.status === 401 && error.response.data?.error === 'nao_autorizado') {
    warnSessionExpired(error.response.data.message);
  }
  return Promise.reject(error);
});
