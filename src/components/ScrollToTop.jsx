import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Desliga a restauração automática de scroll do navegador (que fazia a
    // página nova abrir "no meio", na posição da anterior).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Se a URL tem âncora (#secao), deixa o link/âncora cuidar — não força topo.
    if (hash) return;

    // Sobe ao topo a cada troca de rota. rAF garante que roda após o render
    // da nova página.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname, hash]);

  return null;
}
