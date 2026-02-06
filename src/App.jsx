import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Adicionado Navigate

// 1. IMPORTAR OS COMPONENTES DE SEGURANÇA
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Adicionado useAuth
import ProtectedRoute from './components/ProtectedRoute';

// Importando as Páginas (Cliente/Público)
import Home from './pages/Home';
import Contact from './pages/Contact';
import History from './pages/History'; 
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';

// Importando as Páginas (Administrativo)
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// --- NOVO COMPONENTE: Proteção Exclusiva para Admin ---
// Isso garante que ao sair ou tentar entrar sem logar, ele vá para /admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
  }

  if (!user) {
    // AQUI ESTÁ A MÁGICA: Redireciona para o Login ADMIN, não o do cliente
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default function App() {
  return (
    // 2. ENVOLVER TUDO COM O AUTH PROVIDER
    <AuthProvider>
      <Routes>
        {/* --- ROTAS PÚBLICAS DO SITE --- */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/historia" element={<History />} />
        <Route path="/trabalhe-conosco" element={<Jobs />} />
        
        {/* Login do Cliente (Acessível via menu) */}
        <Route path="/login" element={<Login />}/>
        
        {/* --- ÁREA DO CLIENTE (PROTEGIDA PADRÃO) --- */}
        {/* ProtectedRoute original redireciona para /login (Cliente) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ÁREA ADMINISTRATIVA (OCULTA) --- */}
        {/* 1. Login do Funcionário */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* 2. Painel do Funcionário (Protegido por AdminRoute) */}
        {/* Agora usa AdminRoute para garantir o fluxo correto de logout */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}