/** @type {import('tailwindcss').Config} */
export default {
  // Efeitos de hover só em aparelhos com mouse: no celular nada fica "preso" depois do toque
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Fontes centralizadas: trocar a fonte do site inteiro = mudar as
      // variáveis --sif-font-* em src/index.css (ver "TIPOGRAFIA" lá).
      fontFamily: {
        sans: ['var(--sif-font-sans)'],
        heading: ['var(--sif-font-heading)'],
      },
      // Paleta oficial (use "bg-sif-green", "text-sif-ink"...)
      colors: {
        sif: {
          green: '#007a3d', // verde principal
          deep: '#1B5E20',  // verde escuro (degradês)
          dark: '#0b3320',  // fundo verde escuro (blocos/chamadas)
          leaf: '#7FBA00',  // verde-folha (destaques)
          lime: '#b5e05c',  // etiqueta sobre fundo escuro
          ink: '#1f2937',   // texto principal
          bg: '#f6f8f7',    // fundo da página
        },
      },
      // Cantos padrão dos cards e painéis
      borderRadius: {
        card: '28px',
        panel: '40px',
      },
      boxShadow: {
        card: 'var(--sif-shadow-card)',
        'card-hover': 'var(--sif-shadow-card-hover)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
