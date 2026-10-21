import React from 'react';

// Granulado sutil por cima de fundos escuros/verdes. Usa uma imagem pronta
// (classe .sif-noise em styles/noise.css): leve para o navegador desenhar.
export default function NoiseOverlay({ opacity = 0.4, className = '' }) {
  return <div className={`sif-noise absolute inset-0 z-0 ${className}`} style={{ opacity }} aria-hidden="true" />;
}
