import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import PhotoBand from '../ui/PhotoBand';
import { getImageUrl } from '../../apiConfig';

const PANEL_PHOTO = getImageUrl('https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1600&auto=format&fit=crop', 1200);

// Uma linha da lista de contatos: rótulo pequeno + valor grande clicável.
function ChannelRow({ label, value, href, action }) {
  return (
    <div className="group border-t border-white/15 py-5 md:py-6">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-2">{label}</span>
      <div className="flex items-center justify-between gap-3">
        <a
          href={href}
          className="min-w-0 break-words py-2 -my-2 text-xl sm:text-2xl font-medium leading-tight tracking-tight text-white transition-colors duration-300 hover:text-sif-lime"
        >
          {value}
        </a>
        <div className="flex shrink-0 items-center gap-1">
          {action}
          <a
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-500 group-hover:border-sif-lime group-hover:bg-sif-lime group-hover:text-sif-dark"
          >
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch { /* navegador sem acesso à área de transferência */ }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? 'E-mail copiado' : 'Copiar e-mail'}
      title={done ? 'Copiado' : 'Copiar e-mail'}
      className={`flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-bold transition-colors duration-300 ${done ? 'text-sif-lime' : 'text-white/50 hover:text-white'}`}
    >
      {done ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
      <span className="hidden sm:inline">{done ? 'Copiado' : 'Copiar'}</span>
    </button>
  );
}

// Lado escuro do painel de contato: canais diretos (telefone, e-mail) e
// endereço. Todos os textos vêm do painel (/admin/contato).
export default function ContactChannels({ title, phrase, phraseMuted, phoneLabel, phoneValue, emailLabel, emailValue, addressLabel, addressValue }) {
  const phoneDigits = String(phoneValue || '').replace(/[^\d+]/g, '');
  const mapsUrl = addressValue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(addressValue).replace(/\s*\n\s*/g, ', ').replace(/\s*\|\s*/g, ', '))}`
    : null;

  return (
    <PhotoBand as="aside" photo={PANEL_PHOTO} className="h-full px-6 py-9 sm:px-10 md:px-12 md:py-11 flex flex-col">
      <div>
        {title && <span className="block text-xs font-bold uppercase tracking-[0.2em] text-sif-lime mb-4">{title}</span>}
        {(phrase || phraseMuted) && (
          <p className="text-2xl md:text-[28px] leading-snug tracking-tight text-white max-w-sm mb-10">
            {phrase} {phraseMuted && <span className="text-white/55">{phraseMuted}</span>}
          </p>
        )}
      </div>

      <div className="border-b border-white/15">
        {phoneValue && <ChannelRow label={phoneLabel} value={phoneValue} href={phoneDigits ? `tel:${phoneDigits}` : undefined} />}
        {emailValue && <ChannelRow label={emailLabel} value={emailValue} href={`mailto:${emailValue}`} action={<CopyButton text={emailValue} />} />}
      </div>

      {addressValue && (
        <div className="mt-10 lg:mt-auto lg:pt-8">
          <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">{addressLabel}</span>
          <p className="whitespace-pre-line text-[15px] md:text-base leading-relaxed text-white/85 mb-6">{addressValue}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 py-3 -my-3 text-sm font-bold text-white"
          >
            <span className="border-b border-white/30 pb-0.5 transition-colors duration-300 group-hover:border-sif-lime group-hover:text-sif-lime">Como chegar</span>
            <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sif-lime" />
          </a>
        </div>
      )}
    </PhotoBand>
  );
}
