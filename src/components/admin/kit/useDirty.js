import { useCallback, useEffect, useRef, useState } from 'react';
import { useUnsavedGuard } from './UnsavedGuard';

// Detecta "alterações não salvas" comparando o estado atual com a última
// versão carregada/salva. Também ativa o aviso ao sair da tela.
//   const { dirty, markClean } = useDirty(config, { ready: !loading });
//   ...depois de carregar ou salvar: markClean(novoEstado)
// `extra` (ex.: arquivos escolhidos e não enviados) também conta como pendente.
export default function useDirty(value, { ready = true, extra = false } = {}) {
  const baseline = useRef(null);
  const [, force] = useState(0);

  const snap = (v) => { try { return JSON.stringify(v); } catch { return String(Math.random()); } };

  // Primeira vez que fica pronto: o estado atual vira a referência
  useEffect(() => {
    if (ready && baseline.current === null) { baseline.current = snap(value); force(n => n + 1); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const markClean = useCallback((v) => {
    baseline.current = snap(v === undefined ? value : v);
    force(n => n + 1);
  }, [value]);

  const dirty = !!extra || (ready && baseline.current !== null && snap(value) !== baseline.current);
  useUnsavedGuard(dirty);
  return { dirty, markClean };
}
