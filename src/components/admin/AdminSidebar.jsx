import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X, FileText, KeyRound, ChevronDown, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import iconLogo from '../../assets/icone.svg';
import { ADMIN_GROUPS } from '../../utils/adminModules';
import { useAdminUser } from '../../contexts/AdminUserContext';
import { useCanLeave } from './kit';

const OPEN_KEY = 'sif_admin_menu_fechados';
const readClosed = () => { try { return JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'); } catch { return []; } };

// Tela de computador (lg)? O modo recolhido só vale nela; no celular o menu é gaveta.
const DESKTOP = '(min-width: 1024px)';
function useIsDesktop() {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(DESKTOP).matches : true);
  const [ok, setOk] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(DESKTOP);
    const on = () => setOk(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return ok;
}

const ICON = { size: 18, strokeWidth: 1.75 };

// Menu lateral: grupos por tarefa, só com as telas que o usuário pode abrir.
// - Grupos podem ser recolhidos (lembra a escolha neste navegador).
// - No computador o menu inteiro pode ser recolhido (mini): vira uma barra fina
//   só com ícones; o nome aparece ao passar o mouse. Atalho: Ctrl + \.
export default function AdminSidebar({ activeTab, setActiveTab, logout, isOpen, closeMobile, onMyPassword, mini = false, onToggleMini }) {
  const navigate = useNavigate();
  const { user, can } = useAdminUser();
  const canLeave = useCanLeave();
  const [closed, setClosed] = useState(readClosed);
  const isDesktop = useIsDesktop();
  const compact = mini && isDesktop;
  const [tip, setTip] = useState(null); // { text, top, left }

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

  // Dica com o nome (só no modo recolhido). Posição fixa para não ser cortada pela rolagem do menu.
  const tipProps = (text) => (compact ? {
    onMouseEnter: (e) => { const r = e.currentTarget.getBoundingClientRect(); setTip({ text, top: r.top + r.height / 2, left: r.right + 10 }); },
    onMouseLeave: () => setTip(null),
    onFocus: (e) => { const r = e.currentTarget.getBoundingClientRect(); setTip({ text, top: r.top + r.height / 2, left: r.right + 10 }); },
    onBlur: () => setTip(null),
  } : {});
  useEffect(() => { if (!compact) setTip(null); }, [compact]);

  const groups = ADMIN_GROUPS
    .map(g => ({ ...g, items: g.items.filter(i => can(i.tab)) }))
    .filter(g => g.items.length > 0);

  const initials = (user?.name || user?.email || '?').trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  const toggleLabel = compact ? 'Abrir menu (Ctrl + \\)' : 'Recolher menu (Ctrl + \\)';
  const footBtn = `flex items-center rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors ${compact ? 'justify-center w-11 h-10 mx-auto' : 'gap-2 justify-center py-2 text-[12px]'}`;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile}></div>}

      <aside aria-label="Menu do painel"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 ${compact ? 'lg:w-[76px]' : 'lg:w-72'} shrink-0 bg-[#0b2116] text-white flex flex-col h-full transition-[transform,width] duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Topo: marca + recolher */}
        <div className={`border-b border-white/10 flex items-center ${compact ? 'flex-col gap-3 py-4' : 'px-6 py-5 justify-between'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <img src={iconLogo} alt="" className="w-8 h-8 shrink-0" />
            {!compact && (
              <div className="min-w-0">
                <span className="block font-semibold text-[15px] leading-tight">Painel SIF</span>
                <span className="text-[11px] text-white/50">Gestão do site</span>
              </div>
            )}
          </div>
          {onToggleMini && (
            <button type="button" onClick={() => { setTip(null); onToggleMini(); }} aria-label={toggleLabel} title={compact ? undefined : toggleLabel}
              aria-expanded={!compact} {...tipProps(toggleLabel)}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors">
              {compact ? <PanelLeftOpen {...ICON} /> : <PanelLeftClose {...ICON} />}
            </button>
          )}
          <button onClick={closeMobile} className="lg:hidden text-white/60 hover:text-white" aria-label="Fechar menu"><X size={20} /></button>
        </div>

        <nav className={`flex-1 py-4 overflow-y-auto overflow-x-hidden sif-admin-scroll ${compact ? 'px-2' : 'px-3'}`} aria-label="Telas do painel">
          {groups.map((g, gi) => {
            const isClosed = !compact && closed.includes(g.title) && !g.items.some(i => i.tab === activeTab);
            return (
              <div key={g.title} className={compact ? '' : 'mb-2'}>
                {compact ? (
                  gi > 0 && <div className="mx-3 my-2 border-t border-white/10" role="separator" aria-label={g.title} />
                ) : (
                  <button type="button" onClick={() => toggleGroup(g.title)} aria-expanded={!isClosed}
                    className="w-full flex items-center justify-between px-3 pt-3 pb-1.5 text-[11px] font-semibold text-white/45 hover:text-white/70">
                    {g.title}
                    <ChevronDown size={14} className={`transition-transform ${isClosed ? '-rotate-90' : ''}`} />
                  </button>
                )}
                {!isClosed && g.items.map(i => {
                  const Icon = i.icon || FileText;
                  const active = activeTab === i.tab;
                  return (
                    <button key={i.tab} type="button" onClick={() => { setTip(null); setActiveTab(i.tab); closeMobile(); }}
                      aria-current={active ? 'page' : undefined} aria-label={compact ? i.label : undefined} {...tipProps(i.label)}
                      className={`w-full flex items-center rounded-xl text-[14px] text-left transition-colors my-0.5 ${compact ? 'justify-center h-11' : 'gap-3 px-3 py-2.5'} ${
                        active ? 'text-white font-semibold shadow-[inset_3px_0_0_#b5e05c]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                      style={active ? { backgroundColor: 'rgba(255,255,255,.1)' } : undefined}>
                      <Icon {...ICON} className={`shrink-0 ${active ? 'text-[#b5e05c]' : 'text-white/45'}`} />
                      {!compact && <span className="truncate">{i.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Rodapé: ver o site, quem está logado, senha e sair */}
        <div className={`border-t border-white/10 space-y-1 ${compact ? 'py-3 px-2' : 'p-3'}`}>
          <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer" aria-label="Ver o site" {...tipProps('Ver o site')}
            className={compact ? footBtn : 'flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-white/70 hover:bg-white/5 hover:text-white'}>
            <ExternalLink size={16} strokeWidth={1.75} className={compact ? '' : 'text-white/45'} /> {!compact && 'Ver o site'}
          </a>
          {user && (compact ? (
            <div className="flex justify-center py-1" {...tipProps(`${user.name || user.email} · ${user.role === 'admin' ? 'Administrador' : 'Editor'}`)} tabIndex={0}
              aria-label={`${user.name || user.email}, ${user.role === 'admin' ? 'Administrador' : 'Editor'}`}>
              <span className="w-9 h-9 rounded-full bg-[#b5e05c] text-[#0b2116] text-xs font-bold flex items-center justify-center">{initials}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
              <span className="w-9 h-9 rounded-full bg-[#b5e05c] text-[#0b2116] text-xs font-bold flex items-center justify-center shrink-0">{initials}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold truncate">{user.name || user.email}</p>
                <p className="text-[11px] text-white/50">{user.role === 'admin' ? 'Administrador' : 'Editor'}</p>
              </div>
            </div>
          ))}
          <div className={compact ? 'space-y-1' : 'grid grid-cols-2 gap-1'}>
            {onMyPassword && (
              <button type="button" onClick={onMyPassword} aria-label="Minha senha" {...tipProps('Minha senha')} className={footBtn}>
                <KeyRound size={compact ? 16 : 14} strokeWidth={1.75} /> {!compact && 'Minha senha'}
              </button>
            )}
            <button type="button" onClick={handleLogout} aria-label="Sair" {...tipProps('Sair')} className={`${footBtn} hover:text-red-300`}>
              <LogOut size={compact ? 16 : 14} strokeWidth={1.75} /> {!compact && 'Sair'}
            </button>
          </div>
        </div>
      </aside>

      {/* Dica com o nome da tela (modo recolhido) */}
      {compact && tip && (
        <div role="tooltip" className="fixed z-[60] pointer-events-none -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold shadow-lg whitespace-nowrap"
          style={{ top: tip.top, left: tip.left }}>
          {tip.text}
        </div>
      )}
    </>
  );
}
