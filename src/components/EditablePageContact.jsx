import React, { useEffect, useState } from 'react';
import { http } from '../utils/http';
import { Mail, Phone, User, ExternalLink } from 'lucide-react';
import { API_BASE_URL, getImageUrl, toExternalUrl, whatsappLink } from '../apiConfig';

// Card de contato responsável por tipo de página.
// Configurado em /admin/<page> (Eventos/Treinamentos/GT/Projetos) e exibido
// em cada postagem do tipo.
// override: responsável próprio da postagem (ex.: o de cada Grupo Temático).
// Quando tem nome/e-mail/WhatsApp, é usado no lugar do contato geral da página.
export default function EditablePageContact({ pageKey, fallbackTitle = 'Fale com o responsável', override = null }) {
  const hasOverride = !!(override && (override.contact_name || override.contact_email || override.contact_whatsapp));
  const [fetched, setCfg] = useState(null);
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

  const photoUrl = cfg.contact_photo
    ? (cfg.contact_photo.startsWith('http') ? cfg.contact_photo : getImageUrl(cfg.contact_photo))
    : null;
  const whatsappDigits = (cfg.contact_whatsapp || '').replace(/\D/g, '');

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#007a3d] mb-5">
        <User size={14} /> {fallbackTitle}
      </div>
      <div className="flex items-start gap-5">
        {photoUrl ? (
          <img src={photoUrl} alt={cfg.contact_name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-100 shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-[#007a3d] shrink-0">
            <User size={28} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {cfg.contact_name && (
            <p className="text-lg font-semibold text-[#1f2937] tracking-tight leading-tight">{cfg.contact_name}</p>
          )}
          {cfg.contact_role && (
            <p className="text-sm text-[var(--accent,#007a3d)] mt-1">{cfg.contact_role}</p>
          )}
          <div className="mt-3 space-y-1">
            {cfg.contact_email && (
              <a href={`mailto:${cfg.contact_email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#007a3d] break-all">
                <Mail size={14} className="shrink-0" /> {cfg.contact_email}
              </a>
            )}
            {cfg.contact_whatsapp && (
              <a href={whatsappLink(cfg.contact_whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#007a3d]">
                <Phone size={14} className="shrink-0" /> {cfg.contact_whatsapp}
              </a>
            )}
            {cfg.contact_link && (
              <a href={toExternalUrl(cfg.contact_link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-[#007a3d] hover:underline">
                <ExternalLink size={14} className="shrink-0" /> {cfg.contact_link_label || 'Ver perfil'}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
