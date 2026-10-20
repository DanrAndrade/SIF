import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useConfirm } from './ConfirmDialog';

// Aviso de "alterações não salvas": ao fechar/recarregar a aba do navegador
// e ao trocar de tela pelo menu do painel.
//   Na tela:   useUnsavedGuard(dirty)
//   No menu:   const canLeave = useCanLeave(); if (!(await canLeave())) return;
const GuardContext = createContext(null);

export function UnsavedGuardProvider({ children }) {
  const dirtyRef = useRef(new Set());
  const confirm = useConfirm();

  const register = useCallback((id, dirty) => {
    if (dirty) dirtyRef.current.add(id); else dirtyRef.current.delete(id);
  }, []);

  const canLeave = useCallback(async () => {
    if (dirtyRef.current.size === 0) return true;
    const ok = await confirm({
      title: 'Sair sem salvar?',
      message: 'Há alterações nesta tela que ainda não foram salvas. Se sair agora, elas serão perdidas.',
      confirmLabel: 'Sair sem salvar',
      cancelLabel: 'Continuar editando',
    });
    if (ok) dirtyRef.current.clear();
    return ok;
  }, [confirm]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirtyRef.current.size === 0) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return <GuardContext.Provider value={{ register, canLeave }}>{children}</GuardContext.Provider>;
}

let guardSeq = 0;
export function useUnsavedGuard(dirty) {
  const ctx = useContext(GuardContext);
  const idRef = useRef(null);
  if (idRef.current === null) idRef.current = `g${++guardSeq}`;
  useEffect(() => { ctx?.register(idRef.current, !!dirty); }, [ctx, dirty]);
  useEffect(() => () => ctx?.register(idRef.current, false), [ctx]);
}

export function useCanLeave() {
  const ctx = useContext(GuardContext);
  return ctx ? ctx.canLeave : async () => true;
}
