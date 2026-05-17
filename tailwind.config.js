/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007a3d', // Verde Floresta (Identidade SIF)
          dark: '#005a2d',    // Verde Escuro (Ajustado)
          light: '#009a4d',   // Verde Claro (Ajustado)
        },
        secondary: {
          DEFAULT: '#1565C0', // Azul Institucional
          dark: '#0D47A1',
        },
        accent: {
          DEFAULT: '#F9A825', // Amarelo/Dourado (Detalhes)
        },
        background: '#F1F8E9', // Fundo levemente esverdeado/off-white
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}