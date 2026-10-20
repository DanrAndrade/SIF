import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../apiConfig';
import { canOpenTab } from '../utils/adminModules';

// Usuário logado no painel (perfil e permissões), lido do session.php.
const Ctx = createContext({ user: null, loading: true, can: () => false, reload: () => {} });

export function AdminUserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    return fetch(`${API_BASE_URL}/session.php`)
      .then(r => r.json())
      .then(d => setUser(d && d.logged ? (d.user || { role: 'admin' }) : null))
      .catch(() => { /* sem conexão: mantém o que tinha */ })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const can = useCallback((tab) => canOpenTab(user, tab), [user]);
  const isAdmin = user?.role === 'admin';

  return <Ctx.Provider value={{ user, loading, can, isAdmin, reload }}>{children}</Ctx.Provider>;
}

export const useAdminUser = () => useContext(Ctx);
