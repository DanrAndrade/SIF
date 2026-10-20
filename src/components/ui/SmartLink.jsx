import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../apiConfig';

// Prefixo do site (ex.: '/sif-novo-h7k2x9' em produção, '' em dev).
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

// Arquivos estáticos e uploads não são rotas do React — viram URL completa.
const FILE_RE = /^\/(docs|logos|nossa-gente|img|uploads)\//;

// Classifica um link digitado no painel ou fixo no código:
//   - rota interna ('/contato')   → <Link> do React Router (respeita a subpasta)
//   - arquivo ('/docs/x.pdf')     → <a> com o caminho certo da subpasta
//   - externo / âncora / mailto   → <a> normal
export function resolveHref(href) {
  if (!href || typeof href !== 'string') return { type: 'none' };
  let h = href.trim();
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(h)) return { type: 'external', href: h };
  if (!h.startsWith('/')) h = '/' + h;
  // Link já salvo com a subpasta: tira o prefixo para virar rota interna
  if (BASE && h.startsWith(BASE + '/')) h = h.slice(BASE.length);
  if (FILE_RE.test(h)) return { type: 'file', href: getImageUrl(h) };
  return { type: 'internal', to: h };
}

// Link que funciona igual para rota interna, arquivo e site externo.
// newTabExternal: abre links externos em nova aba (padrão).
const SmartLink = React.forwardRef(function SmartLink(
  { href, children, newTabExternal = true, ...props }, ref
) {
  const r = resolveHref(href);
  if (r.type === 'internal') return <Link ref={ref} to={r.to} {...props}>{children}</Link>;
  if (r.type === 'none') return <span ref={ref} {...props}>{children}</span>;
  const ext = r.type === 'external' && newTabExternal && /^https?:/i.test(r.href);
  return (
    <a ref={ref} href={r.href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
      {children}
    </a>
  );
});

export default SmartLink;
