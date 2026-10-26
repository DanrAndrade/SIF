import React from 'react';
import logo from '../../../assets/sif.svg';

const PHOTO =
  'https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1800&auto=format&fit=crop';

// Lado da foto: eucaliptos com zoom lento contínuo, logo e frase da SIF.
export default function LoginHero() {
  return (
    <aside className="relative h-[42vh] min-h-[300px] overflow-hidden bg-sif-dark lg:h-auto lg:min-h-screen">
      <div className="lg-fade absolute inset-0">
        <img
          src={PHOTO}
          alt=""
          aria-hidden="true"
          className="lg-kenburns h-full w-full object-cover"
        />
      </div>

      {/* feixe de luz suave atravessando as copas */}
      <div
        aria-hidden="true"
        className="lg-light pointer-events-none absolute -top-1/4 left-1/4 h-[150%] w-1/3 bg-gradient-to-b from-white/25 via-white/5 to-transparent blur-3xl"
      />

      {/* escurecimento para leitura do texto */}
      <div aria-hidden="true" className="absolute inset-0 bg-sif-dark/25" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sif-dark from-5% via-sif-dark/75 via-45% to-sif-dark/30" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sif-dark/60 to-transparent" />
      {/* vinheta escura local atrás do logo, para leitura das cores originais */}
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-[340px] w-[520px] bg-[radial-gradient(closest-side,rgba(3,18,10,0.85),rgba(3,18,10,0.45)_55%,transparent)]"
      />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-r from-sif-dark/40 via-transparent to-sif-dark/30 lg:block" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="lg-rise flex items-center justify-between" style={{ animationDelay: '.15s' }}>
          <img
            src={logo}
            alt="SIF"
            className="h-12 w-auto [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.5))_drop-shadow(0_4px_14px_rgba(0,0,0,0.55))] sm:h-14 lg:h-16"
          />
          <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-sif-lime sm:inline-block">
            Área restrita
          </span>
        </div>

        <div className="max-w-xl pb-8 lg:pb-0">
          <p
            className="lg-rise mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sif-lime sm:text-[11px] sm:tracking-[0.28em] lg:mb-5"
            style={{ animationDelay: '.35s' }}
          >
            Sociedade de Investigações Florestais
          </p>
          <h2
            className="lg-rise font-heading text-[28px] font-extrabold tracking-tight text-white sm:text-4xl lg:text-[56px] leading-[1.12] sm:leading-[1.1] lg:leading-[1.06]"
            style={{ animationDelay: '.5s' }}
          >
            Ciência que cresce
            <br />
            com a floresta.
          </h2>
          <p
            className="lg-rise mt-5 hidden max-w-md text-[15px] leading-relaxed text-white/70 lg:block"
            style={{ animationDelay: '.7s' }}
          >
            Painel de gestão do site da SIF. Publique notícias, eventos, publicações e mantenha tudo atualizado.
          </p>
        </div>
      </div>
    </aside>
  );
}
