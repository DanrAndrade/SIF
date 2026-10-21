import { createContext, useContext, useRef } from 'react';

// Envio de arquivo em andamento dentro do editor de blocos: o ContentSections
// fornece este contexto e trava o "Salvar" até todos os envios terminarem.
// Fora dele (ex.: EINCOL) vira uma função que só devolve a promessa.
export const UploadTrackerContext = createContext(null);

export function useUploadTracker() {
  const ctx = useContext(UploadTrackerContext);
  return ctx || ((p) => p);
}

// Guarda sempre o valor mais recente (para callbacks de envio que terminam
// depois de o usuário já ter mexido na lista).
export function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
