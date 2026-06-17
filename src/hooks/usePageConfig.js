import { useEffect, useState, useCallback } from 'react';
import { readBootOrCache, writeCache, fetchPageContent } from '../utils/pageBoot';

// Lê config JSON de uma página com estratégia stale-while-revalidate:
//   - Mostra imediatamente o que veio do boot (HTML) ou do cache local.
//   - Revalida em segundo plano via API e atualiza o cache.
// Se backend offline e sem cache, retorna {} — componentes caem nos fallbacks.
export function usePageConfig(pageKey) {
  const initial = readBootOrCache(pageKey);
  const [config, setConfig] = useState(initial || {});
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    if (!pageKey) return;
    try {
      const data = await fetchPageContent(pageKey);
      setConfig(data);
      writeCache(pageKey, data);
      setError(null);
    } catch (err) {
      setError(err);
      // mantém o que já tinha (boot/cache) — não zera
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
}
