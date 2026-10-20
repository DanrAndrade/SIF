import { useEffect } from 'react';

const DEFAULT_TITLE = 'SIF | Sociedade de Investigações Florestais';

// Título da aba do navegador (e do Google) para cada página.
//   usePageTitle('Eventos')            → "Eventos | SIF"
//   usePageTitle(evento?.title)        → espera carregar; sem título usa o padrão
// Ao sair da página, volta para o título padrão.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | SIF` : DEFAULT_TITLE;
    return () => { document.title = DEFAULT_TITLE; };
  }, [title]);
}
