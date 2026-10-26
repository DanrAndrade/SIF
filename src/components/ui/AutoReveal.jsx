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
  // textos longos, fotos soltas e formulários também entram com animação
  '.prose', 'figure', 'img[class*="rounded"]', 'form',
].join(',');
const SKIP = 'nav, footer, button, [data-no-reveal], .animate-scroll, .pin-spacer, .ql-editor, [role="dialog"]';

export default function AutoReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // Estados (data-rv): wait = escondido esperando; in = animando; done = normal.
    // Quando um elemento já mostrado sai pela PARTE DE BAIXO da tela (a pessoa
    // rolou de volta para cima), ele é "rearmado" e anima de novo ao voltar.
    const timers = new Map();
    const finish = (el) => {
      el.classList.remove('sif-reveal', 'is-in');
      el.style.removeProperty('--sif-reveal-delay');
    };

    const io = new IntersectionObserver((entries) => {
      let i = 0; // elementos que entram juntos aparecem um depois do outro
      entries.forEach((e) => {
        const el = e.target;
        const enough = e.isIntersecting && (e.intersectionRatio >= 0.12 || e.intersectionRect.height > 120);
        if (enough && el.dataset.rv === 'wait') {
          const d = Math.min(i++, 5) * 90;
          el.dataset.rv = 'in';
          el.style.setProperty('--sif-reveal-delay', `${d}ms`);
          el.classList.add('is-in');
          clearTimeout(timers.get(el));
          timers.set(el, setTimeout(() => { finish(el); el.dataset.rv = 'done'; }, 1400 + d));
        } else if (!e.isIntersecting && e.boundingClientRect.top >= window.innerHeight && el.dataset.rv !== 'wait') {
          clearTimeout(timers.get(el));
          el.classList.remove('is-in');
          el.classList.add('sif-reveal');
          el.dataset.rv = 'wait';
        }
      });
    }, { threshold: [0, 0.12, 0.25] });

    const scan = () => {
      document.querySelectorAll(`.sif-page :is(${TARGETS})`).forEach((el) => {
        if (el.dataset.rv) return;
        if (el.closest(SKIP)) return;
        if (el.parentElement?.closest('[data-rv]')) return; // o pai já anima
        const cs = getComputedStyle(el);
        if (cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') return;
        if (cs.opacity === '0' || cs.display === 'none') return;
        el.dataset.rv = 'wait';
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
      timers.forEach(clearTimeout);
      document.querySelectorAll('[data-rv]').forEach((el) => { finish(el); delete el.dataset.rv; });
    };
  }, [pathname]);

  return null;
}
