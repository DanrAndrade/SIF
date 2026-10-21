import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Users, Briefcase, LogOut, X, Image as ImageIcon, FileText, Tent, BookOpen, CalendarDays,
  FlaskConical, Globe, Home, Building2, ShoppingBag, GraduationCap, Mail, PanelBottom, UserCog, KeyRound, Landmark,
} from 'lucide-react';
import iconLogo from '../../assets/icone.svg';
import { ADMIN_GROUPS } from '../../utils/adminModules';
import { useAdminUser } from '../../contexts/AdminUserContext';
import { useCanLeave } from './kit';

const ICONS = {
  leads: LayoutGrid, candidates: Users, usuarios: UserCog,
  banners: ImageIcon, jobs: Briefcase, blog: FileText, eventos: CalendarDays, treinamentos: BookOpen,
  gt: Globe, projetos: FlaskConical, embrapii: Landmark,
  home: Home, institucional: Building2, associadas: Users, produtos: ShoppingBag, in_company: GraduationCap,
  contato: Mail, rodape: PanelBottom, eincol: Tent,
};

// Item do menu (botão)
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

// Menu lateral: mostra só as telas que o usuário logado pode abrir.
export default function AdminSidebar({ activeTab, setActiveTab, logout, isOpen, closeMobile, onMyPassword }) {
  const navigate = useNavigate();
  const { user, can } = useAdminUser();
  const canLeave = useCanLeave();

  const handleLogout = async () => {
      if (!(await canLeave())) return;
      await logout();
      navigate('/admin', { replace: true });
  };

  const groups = ADMIN_GROUPS
    .map(g => ({ ...g, items: g.items.filter(i => can(i.tab)) }))
    .filter(g => g.items.length > 0);

  return (
    <>
        {/* Overlay escuro (celular) */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile}></div>}

        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col h-full border-r border-gray-800 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

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

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {groups.map(g => (
                    <div key={g.title} className="mb-6 px-2 last:mb-0">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3">{g.title}</p>
                        {g.items.map(i => {
                            const Icon = ICONS[i.tab] || FileText;
                            return (
                                <SidebarItem key={i.tab} icon={<Icon size={18} />} label={i.label}
                                    active={activeTab === i.tab}
                                    onClick={() => { setActiveTab(i.tab); closeMobile(); }} />
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
                {user && (
                    <div className="px-2 pb-1">
                        <p className="text-xs font-bold text-gray-200 truncate">{user.name || user.email}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.role === 'admin' ? 'Administrador' : 'Editor'}</p>
                    </div>
                )}
                {onMyPassword && (
                    <button onClick={onMyPassword} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase">
                        <KeyRound size={16} /> Minha senha
                    </button>
                )}
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors uppercase">
                    <LogOut size={16} /> Sair do Sistema
                </button>
            </div>
        </aside>
    </>
  );
}
