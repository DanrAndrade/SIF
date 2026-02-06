/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // As cores exatas usadas no design
        primary: '#D91A3C',
        'primary-dark': '#b01530',
        'pill-green': '#22c55e',
        'accent-yellow': '#FFC107',
        'hero-bg': '#0a0a0a',
        'text-main': '#1f2937',
        'text-secondary': '#4b5563',
        'bg-body': '#ffffff',
      },
      fontFamily: {
        // Fontes Google importadas no CSS
        sans: ['Montserrat', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'], // Usada nos títulos h2.section-heading
      },
      maxWidth: {
        'container': '1280px',
      }
    },
  },
  plugins: [],
}