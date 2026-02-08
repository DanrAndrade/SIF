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
          DEFAULT: '#2E7D32', // Verde Floresta (Identidade SIF)
          dark: '#1B5E20',    // Verde Escuro
          light: '#4CAF50',   // Verde Claro
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