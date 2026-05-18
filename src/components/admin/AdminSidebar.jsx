import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LayoutGrid, Users, Briefcase, MessageSquare, LogOut, X, Image as ImageIcon, FileText, Star, Tent, BookOpen, CalendarDays, FlaskConical, Globe, Home, Building2 } from 'lucide-react';
import iconLogo from '../../assets/icone.svg'; 

// Componente do Item do Menu (Botão)
const SidebarItem = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            active 
            ? 'bg-[#007a3d] text-white shadow-md shadow-green-900/20' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
    >
        <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
            {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate">{label}</span>
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
                {/* GRUPO: Gestão */}
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

                {/* GRUPO: Site & Institucional */}
                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Site & Institucional</p>
                    
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
                        icon={<FileText size={18}/>} 
                        label="Gerenciar Blog" 
                        active={activeTab === 'blog'} 
                        onClick={() => {setActiveTab('blog'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<CalendarDays size={18}/>} 
                        label="Eventos" 
                        active={activeTab === 'eventos'} 
                        onClick={() => {setActiveTab('eventos'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<BookOpen size={18}/>} 
                        label="Treinamentos" 
                        active={activeTab === 'treinamentos'} 
                        onClick={() => {setActiveTab('treinamentos'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<LayoutGrid size={18}/>} 
                        label="Grupos Temáticos" 
                        active={activeTab === 'gt'} 
                        onClick={() => {setActiveTab('gt'); closeMobile();}} 
                    />
                    <SidebarItem 
                        icon={<FlaskConical size={18}/>} 
                        label="Projetos P&D" 
                        active={activeTab === 'projetos'} 
                        onClick={() => {setActiveTab('projetos'); closeMobile();}} 
                    />
                </div>

                {/* GRUPO: Páginas Estáticas */}
                <div className="mb-6 px-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Páginas</p>
                    <SidebarItem
                        icon={<Home size={18}/>}
                        label="Página Home"
                        active={activeTab === 'home'}
                        onClick={() => {setActiveTab('home'); closeMobile();}}
                    />
                    <SidebarItem
                        icon={<Building2 size={18}/>}
                        label="Institucional"
                        active={activeTab === 'institucional'}
                        onClick={() => {setActiveTab('institucional'); closeMobile();}}
                    />
                    <SidebarItem
                        icon={<Globe size={18}/>}
                        label="Associadas"
                        active={activeTab === 'associadas'}
                        onClick={() => {setActiveTab('associadas'); closeMobile();}}
                    />
                </div>

                {/* GRUPO: Evento Especial — EINCOL */}
                <div className="px-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">Evento Especial</p>
                    <SidebarItem 
                        icon={<Tent size={18}/>} 
                        label="EINCOL" 
                        active={activeTab === 'eincol'} 
                        onClick={() => {setActiveTab('eincol'); closeMobile();}} 
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
