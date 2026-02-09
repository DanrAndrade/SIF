import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from 'lucide-react'; 

// --- CAMINHOS DE IMPORTAÇÃO ---
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminBanners from '../../components/admin/AdminBanners';
import { LeadsView, CandidatesView, JobsManagerView, NotificationsManagerView } from '../../components/admin/AdminViews';

// 1. IMPORTAÇÃO DO GERENCIADOR DE BLOG
// Assumindo que você criou o arquivo em src/pages/BlogAdmin.jsx
import BlogAdmin from '../BlogAdmin'; 

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-[#1f2937] overflow-hidden">
      
      {/* SIDEBAR */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        logout={logout}
        isOpen={sidebarOpen}
        closeMobile={() => setSidebarOpen(false)}
      />

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 hidden sm:block">
                    Painel Administrativo
                </h2>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600">Sistema Online</span>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12">
            <div className="max-w-6xl mx-auto">
                {/* --- RENDERIZAÇÃO CONDICIONAL ATUALIZADA --- */}
                {activeTab === 'leads' && <LeadsView />}
                {activeTab === 'candidates' && <CandidatesView />}
                {activeTab === 'banners' && <AdminBanners />}
                {activeTab === 'jobs' && <JobsManagerView />}
                {activeTab === 'notifications' && <NotificationsManagerView />}
                
                {/* 2. CONDIÇÃO PARA EXIBIR O BLOG */}
                {activeTab === 'blog' && <BlogAdmin />}
            </div>
        </div>
      </main>
    </div>
  );
}