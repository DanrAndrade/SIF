import React, { useEffect, useState } from 'react';
import { http } from '../utils/http';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { API_BASE_URL, getImageUrl, toExternalUrl, whatsappLink } from '../apiConfig';

// Card de contato responsável por tipo de página.
// Configurado em /admin/<page> (Eventos/Treinamentos/GT/Projetos) e exibido
// em cada postagem do tipo.
// override: responsável próprio da postagem (ex.: o de cada Grupo Temático).
// Quando tem nome/e-mail/WhatsApp, é usado no lugar do contato geral da página.
// layout: 'compact' (coluna lateral das páginas) ou 'wide' (faixa larga, GT).
export default function EditablePageContact({ pageKey, fallbackTitle = 'Fale com o responsável', override = null, layout = 'compact' }) {
  const hasOverride = !!(override && (override.contact_name || override.contact_email || override.contact_whatsapp));
  const [fetched, setCfg] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const cfg = hasOverride ? override : fetched;

  useEffect(() => {
    if (!pageKey || hasOverride) return;
    http.get(`${API_BASE_URL}/page_content.php?page=${pageKey}`)
      .then(res => {
        const data = res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : {};
        if (data.contact_name || data.contact_email || data.contact_whatsapp) {
          setCfg(data);
        }
      })
      .catch(() => {});
  }, [pageKey, hasOverride]);

  // Sem dados de contato cadastrados → não renderiza nada
  if (!cfg) return null;

  const photoUrl = cfg.contact_photo && !photoFailed
    ? (cfg.contact_photo.startsWith('http') ? cfg.contact_photo : getImageUrl(cfg.contact_photo, 480))
    : null;
  const initials = String(cfg.contact_name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const wide = layout === 'wide';

  const avatar = (
    <div className={`relative shrink-0 overflow-hidden ${wide ? 'w-28 h-28 md:w-36 md:h-36 rounded-[28px]' : 'w-16 h-16 rounded-2xl'}`}>
      {photoUrl
        ? <img src={photoUrl} alt={cfg.contact_name || ''} loading="lazy" decoding="async" onError={() => setPhotoFailed(true)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent,#007a3d)] to-[#0b3320] text-white font-semibold tracking-wide" style={{ fontSize: wide ? 40 : 20 }}>{initials || 'SIF'}</div>}
    </div>
  );

  const actions = (
    <div className={`flex flex-wrap gap-2 ${wide ? 'mt-6' : 'mt-5'}`}>
      {cfg.contact_email && (
        <a href={`mailto:${cfg.contact_email}`} title={cfg.contact_email}
          className="group/btn inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[#0b3320] text-white text-xs font-semibold tracking-wide hover:bg-[var(--accent,#007a3d)] transition-colors">
          <Mail size={15} /> E-mail
        </a>
      )}
      {cfg.contact_whatsapp && (
        <a href={whatsappLink(cfg.contact_whatsapp)} target="_blank" rel="noopener noreferrer" title={cfg.contact_whatsapp}
          className="inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[#e8f3ec] text-[#0b3320] text-xs font-semibold tracking-wide hover:bg-[#d4ebdb] transition-colors">
          <MessageCircle size={15} /> WhatsApp
        </a>
      )}
      {cfg.contact_link && (
        <a href={toExternalUrl(cfg.contact_link)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-semibold text-[var(--accent,#007a3d)] hover:bg-[#f1f7f2] transition-colors">
          {cfg.contact_link_label || 'Ver perfil'} <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );

  return (
    <div className={`group relative overflow-hidden bg-white rounded-card border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow duration-500 ${wide ? 'p-6 md:p-10' : 'p-6'}`}>
      {/* brilho verde suave no canto */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(127,186,0,0.18),transparent_70%)]" aria-hidden="true" />
      <div className={`relative flex ${wide ? 'flex-col sm:flex-row sm:items-center gap-6 md:gap-10' : 'items-center gap-4'}`}>
        {avatar}
        <div className="min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1.5">{fallbackTitle}</span>
          {cfg.contact_name && <p className={`font-semibold text-[#1f2937] tracking-tight leading-tight ${wide ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{cfg.contact_name}</p>}
          {cfg.contact_role && <p className={`text-[var(--accent,#007a3d)] mt-1 ${wide ? 'text-base' : 'text-sm'}`}>{cfg.contact_role}</p>}
          {wide && actions}
        </div>
      </div>
      {!wide && actions}
      {/* contatos por extenso (copiáveis) */}
      {!wide && (cfg.contact_email || cfg.contact_whatsapp) && (
        <div className={`relative mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1`}>
          {cfg.contact_email && <p className="break-all">{cfg.contact_email}</p>}
          {cfg.contact_whatsapp && <p>{cfg.contact_whatsapp}</p>}
        </div>
      )}
    </div>
  );
}
