import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. IMPORTAR OS COMPONENTES DE SEGURANÇA
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importando as Páginas
import Home from './pages/Home';
import Contact from './pages/Contact';
import History from './pages/History'; 
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';

export default function App() {
  return (
    // 2. ENVOLVER TUDO COM O AUTH PROVIDER
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas (Acesso Livre) */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/historia" element={<History />} />
        <Route path="/trabalhe-conosco" element={<Jobs />} />
        <Route path="/login" element={<Login />}/>
        
        {/* 3. ROTA PROTEGIDA (Acesso Restrito) */}
        {/* O usuário só entra aqui se o ProtectedRoute deixar */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}