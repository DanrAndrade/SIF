import React from 'react';
import { getImageUrl, toExternalUrl } from '../../apiConfig';

// Carrossel de logos (patrocinadores, organização, apoio, parceiros...).
// Com muitas logos, roda em marquee infinito (reaproveita a animação
// `.animate-scroll` do index.css, que já duplica o conteúdo). Com poucas,
// centraliza estático para não ficar com buracos girando.
// images: lista de caminhos (string) ou { url, link, alt }.
export default function LogoCarousel({ images = [], altPrefix = 'Logo' }) {
  const items = images
    .map(i => (typeof i === 'string' ? { url: i } : i))
    .filter(i => i && i.url);
  if (items.length === 0) return null;
  const many = items.length > 5;

  const Logo = ({ item, i }) => {
    const img = (
      <img src={getImageUrl(item.url, 320)} alt={item.alt || `${altPrefix} ${i + 1}`} loading="lazy" decoding="async"
        className="max-h-full max-w-[180px] object-contain" />
    );
    return (
      <div className="h-20 md:h-24 flex items-center justify-center shrink-0">
        {item.link ? <a href={toExternalUrl(item.link) || undefined} target="_blank" rel="noopener noreferrer">{img}</a> : img}
      </div>
    );
  };

  return many ? (
    <div className="relative overflow-hidden">
      <div className="flex items-center gap-12 w-max animate-scroll hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => <Logo key={i} item={item} i={i % items.length} />)}
      </div>
    </div>
  ) : (
    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
      {items.map((item, i) => <Logo key={i} item={item} i={i} />)}
    </div>
  );
}
