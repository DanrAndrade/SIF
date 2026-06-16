import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Subpasta de homologação no HostGator: https://sif.org.br/sif-novo-h7k2x9/
// Em desenvolvimento (vite dev) o site roda na raiz (localhost:5173/).
// No build de produção (vite build) usa a subpasta.
// Quando o site for movido para a raiz do domínio, troque PROD_BASE para '/'.
const PROD_BASE = '/sif-novo-h7k2x9/'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? PROD_BASE : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Separa bibliotecas que raramente mudam em chunks próprios.
        // Assim o visitante reaproveita o cache delas entre as atualizações
        // do site (só re-baixa o código da aplicação, que é pequeno).
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['gsap', '@studio-freight/lenis'],
        },
      },
    },
  },
}))
