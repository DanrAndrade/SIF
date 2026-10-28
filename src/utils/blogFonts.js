// Fontes que podem ser escolhidas no texto dos posts do blog (Painel › Blog).
// O site todo continua em Montserrat; estas valem só dentro do texto do post.
// A fonte extra só é baixada quando o texto realmente usa (deixa o site leve).
//   key: nome salvo no HTML (class="ql-font-<key>")
export const BLOG_FONTS = [
  { key: 'merriweather', label: 'Merriweather', css: "'Merriweather', Georgia, serif", google: 'Merriweather:ital,wght@0,400;0,700;1,400' },
  { key: 'playfair', label: 'Playfair Display', css: "'Playfair Display', Georgia, serif", google: 'Playfair+Display:ital,wght@0,400;0,700;1,400' },
];

// Carrega (uma vez) as fontes usadas no HTML. Sem HTML: carrega todas (editor do painel).
export function loadBlogFonts(html) {
  if (typeof document === 'undefined') return;
  const used = BLOG_FONTS.filter(f => html === undefined || String(html || '').includes(`ql-font-${f.key}`));
  for (const f of used) {
    const id = `blog-font-${f.key}`;
    if (document.getElementById(id)) continue;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${f.google}&display=swap`;
    document.head.appendChild(link);
  }
}
