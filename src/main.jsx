import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import ScrollToTop from './components/ScrollToTop' // 1. Importe aqui

// basename = prefixo da subpasta em produção ('/sif-novo-h7k2x9'), vazio em dev.
// Deriva de import.meta.env.BASE_URL (definido pelo `base` no vite.config.js).
const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ScrollToTop /> {/* 2. Adicione aqui */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
