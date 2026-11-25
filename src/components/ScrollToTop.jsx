import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { isRestoringScroll, markRestored, restoreScroll, saveScroll, savedScroll, scrollKey, lastScrollY, trackScroll } from "../utils/scrollMemory";

export default function ScrollToTop() {
  const { pathname, hash, key: navKey } = useLocation();
  const navType = useNavigationType();
  const lastPath = useRef(null);
  const lastKey = useRef(null);

  useEffect(() => { trackScroll(); }, []);

  useEffect(() => {
    // O navegador não restaura sozinho (o conteúdo chega depois): quem cuida é utils/scrollMemory.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const key = scrollKey();
    const first = lastPath.current === null;
    const changedPage = lastPath.current !== pathname;
    // guarda onde a pessoa estava na página que ficou para trás
    if (!first && changedPage && lastKey.current) saveScroll(lastKey.current, lastScrollY);
    lastPath.current = pathname;
    lastKey.current = key;

    // Só mexe na rolagem quando a PÁGINA muda. Trocar de aba ou de tema na mesma
    // página (o #tema entra ou sai do endereço) não pode jogar a pessoa para cima.
    if (!changedPage) return;

    // Primeira carga: se é um recarregamento, scrollMemory já está devolvendo a pessoa
    // para onde ela parou — não força o topo por cima.
    if (first && isRestoringScroll()) return;

    // Voltar/avançar dentro do site: volta para onde a pessoa estava naquela página.
    if (!first && navType === 'POP') {
      const y = savedScroll(key);
      if (y > 4) { restoreScroll(y); markRestored(navKey); return; }
    }

    // Se a URL tem âncora (#secao), deixa o link/âncora cuidar — não força topo.
    if (hash) return;

    // Link novo: topo. rAF garante que roda após o render da nova página.
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname, hash, navType, navKey]);

  return null;
}
