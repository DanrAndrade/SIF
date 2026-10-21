import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getImageUrl } from '../../apiConfig';

// Link do YouTube/Vimeo → endereço de "embed" (com autoplay). Outros links
// (MP4 enviado ou externo) tocam no player do próprio navegador.
export function videoEmbedUrl(url = '') {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
}

// Janela com o vídeo completo (com som e controles). Fecha no X, no fundo ou no Esc.
export default function VideoModal({ url, title = 'Vídeo', onClose }) {
  const closeRef = useRef(null);
  const embed = videoEmbedUrl(url);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar vídeo"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
        <X size={22} />
      </button>
      <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {embed ? (
          <iframe src={embed} title={title} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <video src={getImageUrl(url)} className="w-full h-full" controls autoPlay playsInline />
        )}
      </div>
    </div>,
    document.body
  );
}
