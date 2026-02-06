import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import NotificationsPanel from '../components/dashboard/NotificationsPanel'; // <--- IMPORT NOVO
import { DashboardView, OrdersView, AgendaView, ProfileView } from '../components/dashboard/Views';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // <--- ESTADO DO MODAL
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#1f2937] overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        logout={logout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 lg:px-10 shrink-0 relative z-30">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
                <h2 className="text-xl font-bold uppercase text-[#1f2937] hidden sm:block">
                    {activeTab === 'dashboard' && 'Painel de Inteligência'}
                    {activeTab === 'orders' && 'Central de Notas Fiscais'}
                    {activeTab === 'agenda' && 'Programação Logística'}
                    {activeTab === 'profile' && 'Dados da Empresa'}
                </h2>
            </div>
            
            <div className="flex items-center gap-6">
                
                {/* ÁREA DE NOTIFICAÇÕES */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)} // <--- TOGGLE
                        className={`relative p-2 transition-colors ${showNotifications ? 'text-[#D91A3C] bg-red-50 rounded-lg' : 'text-gray-400 hover:text-[#D91A3C]'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#FFC107] rounded-full animate-pulse"></span>
                    </button>

                    {/* COMPONENTE DO MODAL */}
                    <NotificationsPanel 
                        isOpen={showNotifications} 
                        onClose={() => setShowNotifications(false)} 
                    />
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block"><p className="text-xs font-bold text-[#1f2937]">João Silva</p><p className="text-[10px] text-gray-400 uppercase">Mercadinho Exemplo</p></div>
                    <div className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center font-bold text-xs border border-gray-200">JS</div>
                </div>
            </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth relative z-0">
            <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && <DashboardView timeFilter={timeFilter} setTimeFilter={setTimeFilter} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
                {activeTab === 'orders' && <OrdersView />}
                {activeTab === 'agenda' && <AgendaView />}
                {activeTab === 'profile' && <ProfileView />}
            </div>
        </div>
      </main>
    </div>
  );
}