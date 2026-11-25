import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    // Desliga a restauração automática de scroll do navegador (que fazia a
    // página nova abrir "no meio", na posição da anterior).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Só sobe ao topo quando a PÁGINA muda. Trocar de aba ou de tema na mesma
    // página (o #tema entra ou sai do endereço) não pode jogar a pessoa para cima.
    const changedPage = lastPath.current !== pathname;
    lastPath.current = pathname;
    if (!changedPage) return;

    // Se a URL tem âncora (#secao), deixa o link/âncora cuidar — não força topo.
    if (hash) return;

    // rAF garante que roda após o render da nova página.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname, hash]);

  return null;
}
