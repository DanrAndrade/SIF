import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LayoutGrid, Users, Briefcase, MessageSquare, LogOut, X, Image as ImageIcon } from 'lucide-react';
import iconLogo from '../../assets/icone.svg'; // Verifique se o caminho do logo está correto

// Componente do Item do Menu (Botão)
const SidebarItem = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick} 
        // CORREÇÃO DE COR: Trocado bg-[#D91A3C] (Vermelho) por bg-[#3c7a43] (Verde SIF)
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            active 
            ? 'bg-[#3c7a43] text-white shadow-md shadow-green-900/20' // Ativo: Verde
            : 'text-gray-400 hover:bg-gray-800 hover:text-white' // Inativo: Cinza escuro
        }`}
    >
        <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
            {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
);

export default function AdminSidebar({ activeTab, setActiveTab, logout, isOpen, closeMobile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
      await logout(); 
      navigate('/admin', { replace: true });
  };

  return (
    <>
        {/* Overlay Escuro para Mobile */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile}></div>}

        {/* Sidebar Principal */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col h-full border-r border-gray-800 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            
            {/* Cabeçalho da Sidebar */}
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <img src={iconLogo} alt="Logo SIF" className="w-8 h-8 opacity-90" />
                    <div>
                        <span className="block font-bold uppercase text-sm tracking-wider text-green-500">SIF Admin</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">Painel de Controle</span>
                    </div>
                </div>
                <button onClick={closeMobile} className="lg:hidden text-gray-400"><X size={20} /></button>
            </div>

            {/* Menu de Navegação */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Gestão</p>
                    <SidebarItem 
                        icon={<MessageSquare size={18}/>} 
                        label="Leads / Contato" 
                        active={activeTab === 'leads'} 
                        onClick={() => {setActiveTab('leads'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<Users size={18}/>} 
                        label="Candidatos" 
                        active={activeTab === 'candidates'} 
                        onClick={() => {setActiveTab('candidates'); closeMobile();}} 
                    />
                </div>

                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Site & Institucional</p>
                    
                    {/* Botão de Banners */}
                    <SidebarItem 
                        icon={<ImageIcon size={18}/>} 
                        label="Banners Home" 
                        active={activeTab === 'banners'} 
                        onClick={() => {setActiveTab('banners'); closeMobile();}} 
                    />
                    
                    <SidebarItem 
                        icon={<Briefcase size={18}/>} 
                        label="Gerenciar Vagas" 
                        active={activeTab === 'jobs'} 
                        onClick={() => {setActiveTab('jobs'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<LayoutGrid size={18}/>} 
                        label="Notificações" 
                        active={activeTab === 'notifications'} 
                        onClick={() => {setActiveTab('notifications'); closeMobile();}} 
                    />
                </div>
            </nav>

            {/* Rodapé / Sair */}
            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors uppercase">
                    <LogOut size={16} /> Sair do Sistema
                </button>
            </div>
        </aside>
    </>
  );
}