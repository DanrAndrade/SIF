import { useCallback, useEffect, useRef, useState } from 'react';
import { useUnsavedGuard } from './UnsavedGuard';

// Detecta "alterações não salvas" comparando o estado atual com a última
// versão carregada/salva. Também ativa o aviso ao sair da tela.
//   const { dirty, markClean, markCleanSoon } = useDirty(config, { ready: !loading });
//   ...depois de salvar: markClean(novoEstado)
// Opções:
//   ready    → só começa a comparar depois de carregar
//   extra    → algo pendente fora do estado (ex.: arquivo escolhido e não enviado)
//   settleMs → espera X ms antes de tirar a "foto" de referência. Necessário
//              em telas com editor rico: o Quill reescreve o HTML ao carregar
//              e isso não pode contar como alteração do usuário.
export default function useDirty(value, { ready = true, extra = false, settleMs = 0 } = {}) {
  const baseline = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [, force] = useState(0);
  const timer = useRef(null);

  const snap = (v) => { try { return JSON.stringify(v); } catch { return String(Math.random()); } };

  // Referência = estado atual (agora ou daqui a `ms`)
  const markCleanSoon = useCallback((ms = settleMs) => {
    clearTimeout(timer.current);
    const apply = () => { baseline.current = snap(valueRef.current); force(n => n + 1); };
    if (ms > 0) timer.current = setTimeout(apply, ms); else apply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settleMs]);

  const markClean = useCallback((v) => {
    clearTimeout(timer.current);
    baseline.current = snap(v === undefined ? valueRef.current : v);
    force(n => n + 1);
    if (settleMs > 0) markCleanSoon(settleMs); // editor rico pode reescrever de novo
  }, [settleMs, markCleanSoon]);

  // Ficou pronto: tira a foto de referência. Deixou de estar pronto (ex.:
  // fechou o formulário): esquece, para a próxima abertura começar limpa.
  useEffect(() => {
    if (!ready) { clearTimeout(timer.current); baseline.current = null; return; }
    if (baseline.current === null) markCleanSoon(settleMs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const dirty = !!extra || (ready && baseline.current !== null && snap(value) !== baseline.current);
  useUnsavedGuard(dirty);
  return { dirty, markClean, markCleanSoon };
}
