import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from 'lucide-react'; 

// --- CAMINHOS DE IMPORTAÇÃO ---
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminBanners from '../../components/admin/AdminBanners';
import { LeadsView, CandidatesView, JobsManagerView } from '../../components/admin/AdminViews';

// 1. IMPORTAÇÃO DO GERENCIADOR DE BLOG E NOVOS MÓDULOS
import BlogAdmin from '../BlogAdmin'; 
import EventosAdmin from './EventosAdmin';
import TreinamentosAdmin from './TreinamentosAdmin';
import GTAdmin from './GTAdmin';
import EincolAdmin from './EincolAdmin';
import ProjetosAdmin from './ProjetosAdmin';
import AssociadasAdmin from './AssociadasAdmin';
import InstitucionalAdmin from './InstitucionalAdmin';
import AdminHome from '../../components/admin/AdminHome';
import ProdutosAdmin from './ProdutosAdmin';
import TreinamentosInCompanyAdmin from './TreinamentosInCompanyAdmin';
import ContatoAdmin from './ContatoAdmin';

export default function AdminDashboard({ currentTab }) {
  const [activeTab, setActiveTab] = useState(currentTab || 'leads');
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
                {/* 2. CONDIÇÃO PARA EXIBIR O BLOG E NOVOS ITENS */}
                {activeTab === 'blog' && <BlogAdmin />}
                {activeTab === 'eventos' && <EventosAdmin />}
                {activeTab === 'treinamentos' && <TreinamentosAdmin />}
                {activeTab === 'gt' && <GTAdmin />}
                {activeTab === 'eincol' && <EincolAdmin />}
                {activeTab === 'projetos' && <ProjetosAdmin />}
                {activeTab === 'associadas' && <AssociadasAdmin />}
                {activeTab === 'institucional' && <InstitucionalAdmin />}
                {activeTab === 'home' && <AdminHome />}
                {activeTab === 'produtos' && <ProdutosAdmin />}
                {activeTab === 'in_company' && <TreinamentosInCompanyAdmin />}
                {activeTab === 'contato' && <ContatoAdmin />}
            </div>
        </div>
      </main>
    </div>
  );
}
