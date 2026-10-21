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
    // Imagens viram arquivos próprios (não base64 dentro do JS): o código fica
    // menor e cada logo só é baixado quando aparece na tela.
    assetsInlineLimit: 1024,
    rollupOptions: {
      output: {
        // Bibliotecas que raramente mudam em arquivos próprios: o visitante
        // reaproveita o cache delas entre as atualizações do site.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
          if (/[\\/]node_modules[\\/](gsap|@studio-freight)[\\/]/.test(id)) return 'animation';
          return undefined;
        },
      },
    },
  },
}))
