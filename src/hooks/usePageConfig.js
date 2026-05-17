import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

// Lê config JSON de uma página via page_content.php.
// Retorna sempre um objeto (nunca null) para o consumidor não precisar checar.
// Se backend offline, retorna {} silenciosamente — componentes caem nos fallbacks.
export function usePageConfig(pageKey) {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    if (!pageKey) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/page_content.php?page=${pageKey}`);
      setConfig(res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {});
      setError(null);
    } catch (err) {
      setError(err);
      setConfig({});
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
}
