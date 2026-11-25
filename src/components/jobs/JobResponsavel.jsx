import React, { useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { getImageUrl, whatsappLink } from '../../apiConfig';

// Responsável pela categoria da vaga (nome, cargo e formas de contato).
// resp: { contact_name, contact_role, contact_email, contact_whatsapp, contact_photo }
export default function JobResponsavel({ resp, label = 'Responsável pela vaga' }) {
  const [failed, setFailed] = useState(false);
  if (!resp) return null;
  const photo = resp.contact_photo && !failed
    ? (resp.contact_photo.startsWith('http') ? resp.contact_photo : getImageUrl(resp.contact_photo, 160))
    : null;
  const initials = String(resp.contact_name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const linkCls = 'inline-flex items-center gap-1.5 text-[13px] font-semibold text-sif-green hover:underline';

  return (
    <section className="mt-9 border-t border-sif-ink/10 pt-7" aria-label={label}>
      <h3 className="sif-eyebrow mb-4">{label}</h3>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sif-dark text-white">
          {photo
            ? <img src={photo} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />
            : <span className="flex h-full w-full items-center justify-center text-lg font-semibold">{initials || 'SIF'}</span>}
        </div>
        <div className="min-w-0">
          {resp.contact_name && <p className="font-semibold leading-tight text-sif-ink">{resp.contact_name}</p>}
          {resp.contact_role && <p className="mt-0.5 text-sm text-gray-500">{resp.contact_role}</p>}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {resp.contact_email && <a href={`mailto:${resp.contact_email}`} className={linkCls}><Mail size={14} aria-hidden="true" />{resp.contact_email}</a>}
            {resp.contact_whatsapp && <a href={whatsappLink(resp.contact_whatsapp)} target="_blank" rel="noopener noreferrer" className={linkCls}><MessageCircle size={14} aria-hidden="true" />WhatsApp</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
