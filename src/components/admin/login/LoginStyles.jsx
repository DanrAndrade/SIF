import React from 'react';

// Animações exclusivas da tela de login (escopadas pelo prefixo "lg-").
// Ficam aqui para não mexer no CSS global do site.
const CSS = `
@keyframes lg-kenburns {
  0%   { transform: scale(1.06) translate3d(0, 0, 0); }
  50%  { transform: scale(1.16) translate3d(-1.5%, -1%, 0); }
  100% { transform: scale(1.06) translate3d(0, 0, 0); }
}
@keyframes lg-rise {
  from { opacity: 0; transform: translate3d(0, 18px, 0); }
  to   { opacity: 1; transform: none; }
}
@keyframes lg-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes lg-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-7px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(2px); }
}
@keyframes lg-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
@keyframes lg-light {
  0%, 100% { opacity: .35; transform: translate3d(-4%, 0, 0) rotate(8deg); }
  50%      { opacity: .6;  transform: translate3d(4%, 0, 0) rotate(8deg); }
}
@keyframes lg-arrow {
  0%   { transform: translateX(0); opacity: 1; }
  45%  { transform: translateX(130%); opacity: 0; }
  46%  { transform: translateX(-130%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
/* seta do botão: sai pela direita e volta pela esquerda enquanto o mouse/foco está no botão */
.group:hover:not(:disabled) .lg-arrow,
.group:focus-visible:not(:disabled) .lg-arrow { animation: lg-arrow 1.15s cubic-bezier(.65,0,.35,1) .35s infinite; }
.lg-kenburns { animation: lg-kenburns 38s ease-in-out infinite; will-change: transform; }
.lg-light    { animation: lg-light 14s ease-in-out infinite; }
.lg-rise     { opacity: 0; animation: lg-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
.lg-fade     { opacity: 0; animation: lg-fade 1.4s ease forwards; }
.lg-shake    { animation: lg-shake .45s cubic-bezier(.36,.07,.19,.97); }
.lg-sweep    { animation: lg-sweep 1.2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .lg-kenburns, .lg-light, .lg-sweep, .lg-arrow { animation: none !important; }
  .lg-rise, .lg-fade { animation: none !important; opacity: 1 !important; transform: none !important; }
  .lg-shake { animation: none !important; }
  .lg-motion { transition: none !important; }
}
`;

export default function LoginStyles() {
  return <style>{CSS}</style>;
}
