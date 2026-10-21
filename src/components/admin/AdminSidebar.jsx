import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, LogOut, X, Image as ImageIcon, FileText, Tent, BookOpen, CalendarDays,
  FlaskConical, Globe, Home, Building2, ShoppingBag, GraduationCap, Mail, PanelBottom, UserCog, KeyRound, Landmark,
  MessageSquare, ChevronDown, ExternalLink,
} from 'lucide-react';
import iconLogo from '../../assets/icone.svg';
import { ADMIN_GROUPS } from '../../utils/adminModules';
import { useAdminUser } from '../../contexts/AdminUserContext';
import { useCanLeave } from './kit';

const ICONS = {
  inicio: LayoutDashboard, leads: MessageSquare, candidates: Users, jobs: Briefcase, usuarios: UserCog,
  banners: ImageIcon, blog: FileText, eventos: CalendarDays, treinamentos: BookOpen, in_company: GraduationCap,
  gt: Globe, projetos: FlaskConical, embrapii: Landmark, home: Home, institucional: Building2, associadas: Users,
  produtos: ShoppingBag, contato: Mail, rodape: PanelBottom, eincol: Tent,
};

const OPEN_KEY = 'sif_admin_menu_fechados';
const readClosed = () => { try { return JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'); } catch { return []; } };

// Menu lateral: grupos por tarefa, só com as telas que o usuário pode abrir.
// Grupos podem ser recolhidos (lembra a escolha neste navegador).
export default function AdminSidebar({ activeTab, setActiveTab, logout, isOpen, closeMobile, onMyPassword }) {
  const navigate = useNavigate();
  const { user, can } = useAdminUser();
  const canLeave = useCanLeave();
  const [closed, setClosed] = useState(readClosed);

  const toggleGroup = (title) => setClosed(prev => {
    const next = prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title];
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(next)); } catch { /* ok */ }
    return next;
  });

  const handleLogout = async () => {
    if (!(await canLeave())) return;
    await logout();
    navigate('/admin', { replace: true });
  };

  const groups = ADMIN_GROUPS
    .map(g => ({ ...g, items: g.items.filter(i => can(i.tab)) }))
    .filter(g => g.items.length > 0);

  const initials = (user?.name || user?.email || '?').trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile}></div>}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0b2116] text-white flex flex-col h-full transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={iconLogo} alt="" className="w-8 h-8" />
            <div>
              <span className="block font-semibold text-[15px] leading-tight">Painel SIF</span>
              <span className="text-[11px] text-white/50">Gestão do site</span>
            </div>
          </div>
          <button onClick={closeMobile} className="lg:hidden text-white/60 hover:text-white" aria-label="Fechar menu"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto sif-admin-scroll" aria-label="Menu do painel">
          {groups.map(g => {
            const isClosed = closed.includes(g.title) && !g.items.some(i => i.tab === activeTab);
            return (
              <div key={g.title} className="mb-2">
                <button type="button" onClick={() => toggleGroup(g.title)} aria-expanded={!isClosed}
                  className="w-full flex items-center justify-between px-3 pt-3 pb-1.5 text-[11px] font-semibold text-white/45 hover:text-white/70">
                  {g.title}
                  <ChevronDown size={14} className={`transition-transform ${isClosed ? '-rotate-90' : ''}`} />
                </button>
                {!isClosed && g.items.map(i => {
                  const Icon = ICONS[i.tab] || FileText;
                  const active = activeTab === i.tab;
                  return (
                    <button key={i.tab} type="button" onClick={() => { setActiveTab(i.tab); closeMobile(); }}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-[14px] text-left transition-colors ${
                        active ? 'bg-white/12 text-white font-semibold shadow-[inset_3px_0_0_#b5e05c]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                      style={active ? { backgroundColor: 'rgba(255,255,255,.1)' } : undefined}>
                      <Icon size={18} className={active ? 'text-[#b5e05c]' : 'text-white/45'} />
                      <span className="truncate">{i.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-white/70 hover:bg-white/5 hover:text-white">
            <ExternalLink size={16} className="text-white/45" /> Ver o site
          </a>
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
              <span className="w-9 h-9 rounded-full bg-[#b5e05c] text-[#0b2116] text-xs font-bold flex items-center justify-center shrink-0">{initials}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold truncate">{user.name || user.email}</p>
                <p className="text-[11px] text-white/50">{user.role === 'admin' ? 'Administrador' : 'Editor'}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1">
            {onMyPassword && (
              <button onClick={onMyPassword} className="flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] text-white/60 hover:bg-white/5 hover:text-white">
                <KeyRound size={14} /> Minha senha
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] text-white/60 hover:bg-white/5 hover:text-red-300">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
