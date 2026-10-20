/** @type {import('tailwindcss').Config} */
export default {
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
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}