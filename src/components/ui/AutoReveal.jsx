import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Animação de entrada padrão do site público: títulos, textos de destaque e
// cards surgem suavemente (subindo um pouco) quando entram na tela, em
// sequência quando estão lado a lado.
//
// Funciona sozinho em todas as páginas, inclusive no conteúdo que chega do
// painel depois (observa a página). Para tirar um trecho da animação, use
// data-no-reveal nele; para incluir um elemento qualquer, use data-reveal.
//
// Só mexe em opacity e "translate" (não briga com os efeitos de hover) e
// devolve o elemento ao normal assim que a animação termina.
const TARGETS = [
  'h1', 'h2', '.sif-eyebrow', '.sif-lead', '[data-reveal]',
  '.rounded-card', '.rounded-panel', '.rounded-3xl', '.shadow-card',
].join(',');
const SKIP = 'nav, footer, button, [data-no-reveal], .animate-scroll, .pin-spacer, .ql-editor, [role="dialog"]';

export default function AutoReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const seen = new WeakSet();
    const finish = (el) => {
      el.classList.remove('sif-reveal', 'is-in');
      el.style.removeProperty('--sif-reveal-delay');
    };

    const io = new IntersectionObserver((entries) => {
      // Elementos que entram juntos aparecem um depois do outro
      const now = entries.filter(e => e.isIntersecting).map(e => e.target);
      now.forEach((el, i) => {
        io.unobserve(el);
        el.style.setProperty('--sif-reveal-delay', `${Math.min(i, 5) * 90}ms`);
        el.classList.add('is-in');
        setTimeout(() => finish(el), 1400 + Math.min(i, 5) * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    const scan = () => {
      document.querySelectorAll(`.sif-page :is(${TARGETS})`).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.closest(SKIP)) return;
        if (el.parentElement?.closest('.sif-reveal')) return; // pai já anima
        const cs = getComputedStyle(el);
        if (cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') return;
        if (cs.opacity === '0' || cs.display === 'none') return;
        el.classList.add('sif-reveal');
        io.observe(el);
      });
    };

    let t = 0;
    const later = () => { clearTimeout(t); t = setTimeout(scan, 120); };
    const mo = new MutationObserver(later);
    mo.observe(document.body, { childList: true, subtree: true });
    later();

    return () => {
      clearTimeout(t);
      mo.disconnect();
      io.disconnect();
      document.querySelectorAll('.sif-reveal').forEach(finish);
    };
  }, [pathname]);

  return null;
}
