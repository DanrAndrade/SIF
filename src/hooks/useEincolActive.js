import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';

// Cache em módulo: evita refetch a cada montagem de Navbar/Eventos.
// Como o admin pode ativar/desativar a qualquer momento, o cache vira
// apenas no boot da SPA (uma vez por sessão de navegação).
let cached = null;
let inflight = null;

export function useEincolActive() {
  const [active, setActive] = useState(cached);

  useEffect(() => {
    if (cached !== null) {
      if (active !== cached) setActive(cached);
      return;
    }
    if (!inflight) {
      inflight = fetch(`${API_BASE_URL}/eincol.php`)
        .then(r => r.json())
        .then(d => {
          cached = Number(d?.active) === 0 ? false : true;
          return cached;
        })
        .catch(() => {
          cached = true; // em caso de erro, assume ativo
          return cached;
        });
    }
    inflight.then(v => setActive(v));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return active === null ? true : active; // default: ativo até saber o contrário
}
