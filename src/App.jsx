import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';

// --- COMPONENTES LEVES (Carregamento Imediato) ---
import Home from './pages/Home'; 
import AdminLogin from './pages/admin/AdminLogin';

// --- LAZY LOADING (Carregamento sob Demanda) ---
const Contact = lazy(() => import('./pages/Contact'));
const Institucional = lazy(() => import('./pages/Institucional'));
const Jobs = lazy(() => import('./pages/Jobs'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Associadas = lazy(() => import('./pages/Associadas'));
const ProdutosServicos = lazy(() => import('./pages/ProdutosServicos'));
const Eventos = lazy(() => import('./pages/Eventos'));
const EventoDetalhe = lazy(() => import('./pages/EventoDetalhe'));
const Treinamentos = lazy(() => import('./pages/Treinamentos'));
const TreinamentoDetalhe = lazy(() => import('./pages/TreinamentoDetalhe'));
const TreinamentosInCompany = lazy(() => import('./pages/TreinamentosInCompany'));
const GruposTematicos = lazy(() => import('./pages/GruposTematicos'));
const GrupoTematicoDetalhe = lazy(() => import('./pages/GrupoTematicoDetalhe'));
const Projetos = lazy(() => import('./pages/Projetos'));
const Transparencia = lazy(() => import('./pages/Transparencia'));

// Admin Pages
const EventosAdmin = lazy(() => import('./pages/admin/EventosAdmin'));
const TreinamentosAdmin = lazy(() => import('./pages/admin/TreinamentosAdmin'));
const GTAdmin = lazy(() => import('./pages/admin/GTAdmin'));

// Tela de carregamento
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
    <div className="w-12 h-12 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- CORREÇÃO: PROTEÇÃO DO ADMIN ---
// Agora verificamos diretamente o "crachá" no navegador, independente do AuthContext
const AdminRoute = ({ children }) => {
  const adminUser = localStorage.getItem('admin_user');
  const isAdminMode = localStorage.getItem('admin_mode') === 'true';

  // Se não tiver o crachá de admin, manda pro login
  if (!adminUser || !isAdminMode) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/institucional" element={<Institucional />} />
          <Route path="/trabalhe-conosco" element={<Jobs />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          
          {/* ROTA DE ASSOCIADAS */}
          <Route path="/associadas" element={<Associadas />} />
          <Route path="/produtos-servicos" element={<ProdutosServicos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:slug" element={<EventoDetalhe />} />
          <Route path="/treinamentos" element={<Treinamentos />} />
          <Route path="/treinamentos/:slug" element={<TreinamentoDetalhe />} />
          <Route path="/treinamentos-in-company" element={<TreinamentosInCompany />} />
          <Route path="/grupos-tematicos" element={<GruposTematicos />} />
          <Route path="/grupos-tematicos/:slug" element={<GrupoTematicoDetalhe />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/transparencia" element={<Transparencia />} />
          


          {/* Rotas Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/eventos" 
            element={
              <AdminRoute>
                <AdminDashboard currentTab="eventos" />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/treinamentos" 
            element={
              <AdminRoute>
                <AdminDashboard currentTab="treinamentos" />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/gt" 
            element={
              <AdminRoute>
                <AdminDashboard currentTab="gt" />
              </AdminRoute>
            } 
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}