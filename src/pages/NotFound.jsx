import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Página para endereços que não existem (antes ficava uma tela em branco).
export default function NotFound() {
  useEffect(() => { document.title = 'Página não encontrada | SIF'; }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-40 pb-24">
        <div className="text-center max-w-lg">
          <p className="text-[#007a3d] text-sm font-bold tracking-widest mb-4">ERRO 404</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-4">Página não encontrada</h1>
          <p className="text-gray-500 mb-10">
            O endereço que você acessou não existe ou foi alterado.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#007a3d] text-white text-sm font-bold hover:bg-[#1B5E20] transition-colors">
            <ArrowLeft size={18} /> Voltar para o início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
