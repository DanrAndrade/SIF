import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// --- CARREGAMENTO IMEDIATO (páginas leves/críticas) ---
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';

// --- LAZY LOADING (carregamento sob demanda) ---
const Contact             = lazy(() => import('./pages/Contact'));
const Institucional       = lazy(() => import('./pages/Institucional'));
const Jobs                = lazy(() => import('./pages/Jobs'));
const Associadas          = lazy(() => import('./pages/Associadas'));
const ProdutosServicos    = lazy(() => import('./pages/ProdutosServicos'));
const Eventos             = lazy(() => import('./pages/Eventos'));
const EventoDetalhe       = lazy(() => import('./pages/EventoDetalhe'));
const Treinamentos        = lazy(() => import('./pages/Treinamentos'));
const TreinamentoDetalhe  = lazy(() => import('./pages/TreinamentoDetalhe'));
const TreinamentosInCompany = lazy(() => import('./pages/TreinamentosInCompany'));
const GruposTematicos     = lazy(() => import('./pages/GruposTematicos'));
const GrupoTematicoDetalhe = lazy(() => import('./pages/GrupoTematicoDetalhe'));
const Eincol              = lazy(() => import('./pages/Eincol'));
const Projetos            = lazy(() => import('./pages/Projetos'));
const ProjetoDetalhe      = lazy(() => import('./pages/ProjetoDetalhe'));

// --- ADMIN ---
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// --- TELA DE CARREGAMENTO ---
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
    <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- PROTEÇÃO DE ROTA ADMIN ---
const AdminRoute = ({ children }) => {
  const adminUser  = localStorage.getItem('admin_user');
  const isAdminMode = localStorage.getItem('admin_mode') === 'true';
  if (!adminUser || !isAdminMode) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Helper: Dashboard protegido com aba específica
const AdminTab = ({ tab }) => (
  <AdminRoute>
    <AdminDashboard currentTab={tab} />
  </AdminRoute>
);

// =============================================================
export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* ── ROTAS PÚBLICAS ─────────────────────────────── */}
          <Route path="/"                      element={<Home />} />
          <Route path="/contato"               element={<Contact />} />
          <Route path="/institucional"         element={<Institucional />} />
          <Route path="/trabalhe-conosco"      element={<Jobs />} />

          {/* Blog */}
          <Route path="/blog"                  element={<Blog />} />
          <Route path="/blog/:slug"            element={<BlogPost />} />

          {/* Institucional / Produtos */}
          <Route path="/associadas"            element={<Associadas />} />
          <Route path="/produtos-servicos"     element={<ProdutosServicos />} />

          {/* Eventos */}
          <Route path="/eventos"               element={<Eventos />} />
          <Route path="/eventos/:slug"         element={<EventoDetalhe />} />

          {/* Treinamentos */}
          <Route path="/treinamentos"          element={<Treinamentos />} />
          <Route path="/treinamentos/:slug"    element={<TreinamentoDetalhe />} />
          <Route path="/treinamentos-in-company" element={<TreinamentosInCompany />} />

          {/* Grupos Temáticos */}
          <Route path="/grupos-tematicos"      element={<GruposTematicos />} />
          <Route path="/grupos-tematicos/:slug" element={<GrupoTematicoDetalhe />} />

          {/* EINCOL */}
          <Route path="/eincol"                element={<Eincol />} />

          {/* Projetos P&D */}
          <Route path="/projetos"              element={<Projetos />} />
          <Route path="/projetos/:slug"        element={<ProjetoDetalhe />} />

          {/* ── ROTAS ADMIN ────────────────────────────────── */}
          <Route path="/admin"                 element={<AdminLogin />} />

          {/* Dashboard → redireciona para leads por padrão */}
          <Route path="/admin/dashboard"       element={<AdminTab tab="leads" />} />

          {/* Módulos específicos */}
          <Route path="/admin/blog"            element={<AdminTab tab="blog" />} />
          <Route path="/admin/banners"         element={<AdminTab tab="banners" />} />
          <Route path="/admin/jobs"            element={<AdminTab tab="jobs" />} />
          <Route path="/admin/eventos"         element={<AdminTab tab="eventos" />} />
          <Route path="/admin/treinamentos"    element={<AdminTab tab="treinamentos" />} />
          <Route path="/admin/gt"              element={<AdminTab tab="gt" />} />
          <Route path="/admin/projetos"        element={<AdminTab tab="projetos" />} />
          <Route path="/admin/eincol"          element={<AdminTab tab="eincol" />} />
          <Route path="/admin/institucional"   element={<AdminTab tab="institucional" />} />
          <Route path="/admin/associadas"      element={<AdminTab tab="associadas" />} />

          {/* Fallback: rota admin desconhecida → login */}
          <Route path="/admin/*"              element={<Navigate to="/admin" replace />} />

        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
