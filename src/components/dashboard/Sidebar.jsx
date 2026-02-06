import React from 'react';
import { LayoutDashboard, FileText, User, LogOut, Truck, X, ChevronRight } from 'lucide-react';
import iconLogo from '../../assets/icone.svg'; // Ajuste o caminho se necessário

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active ? 'bg-[#D91A3C] text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
        <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
);

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, logout }) {
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1f2937] text-white transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
            <div className="p-8 flex items-center gap-3 border-b border-gray-700">
                <img src={iconLogo} alt="Logo" className="w-8 h-8 object-contain" />
                <div><span className="block font-bold uppercase tracking-widest text-sm leading-none">Chocosul</span><span className="block text-[9px] text-[#FFC107] uppercase tracking-[0.2em] font-bold">Portal B2B</span></div>
                <button onClick={() => setIsOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                <SidebarItem icon={<LayoutDashboard size={20}/>} label="Inteligência" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <SidebarItem icon={<FileText size={20}/>} label="Notas Fiscais" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                <SidebarItem icon={<Truck size={20}/>} label="Agenda Entregas" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                <SidebarItem icon={<User size={20}/>} label="Dados Cadastrais" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button 
                    onClick={logout} 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#D91A3C] hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut size={18} /> Sair do Sistema
                </button>
            </div>
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}