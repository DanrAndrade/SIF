import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DetailHero from '../components/DetailHero';
import { buttonClass, BtnArrow } from '../components/ui/Button';

// Atalhos para as páginas mais procuradas
const LINKS = [
  { to: '/institucional', label: 'Institucional' },
  { to: '/associadas', label: 'Empresas associadas' },
  { to: '/grupos-tematicos', label: 'Grupos Temáticos' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/blog', label: 'Blog e notícias' },
  { to: '/contato', label: 'Contato' },
];

// Página para endereços que não existem: mesmo topo das outras páginas,
// botão para voltar à página inicial e atalhos.
export default function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada | SIF';
    // não indexar no Google
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <DetailHero
        eyebrow="Erro 404"
        title="Página não encontrada"
        summary="O endereço que você acessou não existe ou foi alterado. Volte para a página inicial ou use um dos atalhos abaixo."
        actions={
          <Link to="/" className={buttonClass('light', 'sm')}>
            <span className="py-2">Voltar para a página inicial</span>
            <BtnArrow variant="light" size="sm" icon={ArrowLeft} rotate={false} />
          </Link>
        }
      />

      <main className="flex-1 py-16 md:py-24">
        <div className="sif-container">
          <span className="sif-eyebrow mb-6">Páginas mais acessadas</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to}
                  className="group flex items-center justify-between gap-4 bg-white shadow-card px-6 py-5 text-[15px] font-semibold text-sif-ink hover:text-sif-green transition-colors">
                  {l.label}
                  <ArrowRight size={18} className="shrink-0 text-sif-green transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
