// Conteúdo padrão do rodapé (= o que estava fixo no código antes da 2ª etapa).
// Editável em Painel › Páginas › Rodapé (page_configs, chave "footer").

export const FOOTER_COLORS = {
  verde:    { label: 'Verde SIF escuro (novo)', bg: '#092416' },
  floresta: { label: 'Floresta',                bg: '#0f2e1f' },
  musgo:    { label: 'Verde-musgo',             bg: '#1f3a12' },
  grafite:  { label: 'Grafite (antigo)',        bg: '#1f2937' },
};

export const FOOTER_DEFAULTS = {
  color: 'verde',
  custom_bg: '',
  about: 'Há 50 anos promovendo o desenvolvimento científico e tecnológico do setor florestal brasileiro, a SIF atua como um elo estratégico entre a universidade e as principais empresas do setor.',
  instagram: 'https://www.instagram.com/sif.ufv',
  linkedin: 'https://www.linkedin.com/company/sif-ufv/?originalSubdomain=br',
  facebook: 'https://www.facebook.com/sif.org/',
  youtube: 'https://www.youtube.com/channel/UC5jaY6VxP9aw81aeECwBBBA',
  nav_title: 'Navegação',
  nav_links: [
    { label: 'Início', link: '/' },
    { label: 'Nossa História', link: '/institucional' },
    { label: 'Trabalhe Conosco', link: '/trabalhe-conosco' },
    { label: 'Fale Conosco', link: '/contato' },
  ],
  contact_title: 'Contato',
  address: 'Departamento de Engenharia Florestal\nAv. P.H. Rolfs, s/n – Campus da UFV\nCEP: 36570-900 – Viçosa/MG',
  phone: '(31) 3612-3950',
  email: 'contato@sif.org.br',
  copyright: 'SIF - Sociedade de Investigações Florestais. Todos os direitos reservados.',
};

export function footerBg(cfg) {
  if (cfg.color === 'custom' && /^#[0-9a-f]{6}$/i.test(cfg.custom_bg || '')) return cfg.custom_bg;
  return (FOOTER_COLORS[cfg.color] || FOOTER_COLORS.verde).bg;
}
