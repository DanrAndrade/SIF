import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LayoutGrid, Users, Briefcase, MessageSquare, LogOut, X } from 'lucide-react';
import iconLogo from '../../assets/icone.svg';

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-[#D91A3C] text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
);

// Recebemos 'isOpen' e 'closeMobile' para controlar a visibilidade no mobile
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

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col h-full border-r border-gray-800 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <img src={iconLogo} alt="Logo" className="w-8 h-8 opacity-80" />
                    <div>
                        <span className="block font-bold uppercase text-sm tracking-wider">Intranet</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">Colaborador</span>
                    </div>
                </div>
                {/* Botão fechar só aparece no mobile */}
                <button onClick={closeMobile} className="lg:hidden text-gray-400"><X size={20} /></button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Gestão</p>
                    <SidebarItem icon={<MessageSquare size={18}/>} label="Leads / Contato" active={activeTab === 'leads'} onClick={() => {setActiveTab('leads'); closeMobile();}} />
                    <SidebarItem icon={<Users size={18}/>} label="Candidatos" active={activeTab === 'candidates'} onClick={() => {setActiveTab('candidates'); closeMobile();}} />
                </div>

                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Site & B2B</p>
                    <SidebarItem icon={<Briefcase size={18}/>} label="Gerenciar Vagas" active={activeTab === 'jobs'} onClick={() => {setActiveTab('jobs'); closeMobile();}} />
                    <SidebarItem icon={<LayoutGrid size={18}/>} label="Avisos Clientes" active={activeTab === 'notifications'} onClick={() => {setActiveTab('notifications'); closeMobile();}} />
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase">
                    <LogOut size={16} /> Sair do Sistema
                </button>
            </div>
        </aside>
    </>
  );
}