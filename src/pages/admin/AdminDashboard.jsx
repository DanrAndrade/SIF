import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../utils/axiosAdmin'; // axios do painel: mesmo tratamento de firewall/login
import { ConfirmProvider, UnsavedGuardProvider, useCanLeave } from '../../components/admin/kit';
import { Menu, Lock, ExternalLink, ChevronRight } from 'lucide-react';
import { AdminUserProvider, useAdminUser } from '../../contexts/AdminUserContext';
import { firstAllowedTab, TAB_PATHS, findItem } from '../../utils/adminModules';
import PainelInicio from './PainelInicio';
import MyPasswordModal from '../../components/admin/MyPasswordModal';
import UsuariosAdmin from './UsuariosAdmin';

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
import RodapeAdmin from './RodapeAdmin';
import EmbrapiiAdmin from './EmbrapiiAdmin';

// Endereço de cada tela do painel (o menu muda a URL: recarregar a página
// volta para a mesma tela, e dá para mandar o link de uma tela específica)
// Endereços de cada tela: utils/adminModules.js (TAB_PATHS)

export default function AdminDashboard(props) {
  return (
    <ConfirmProvider>
      <UnsavedGuardProvider>
        <AdminUserProvider>
          <DashboardInner {...props} />
        </AdminUserProvider>
      </UnsavedGuardProvider>
    </ConfirmProvider>
  );
}

const MINI_KEY = 'sif_admin_menu_recolhido';

function DashboardInner({ currentTab }) {
  const activeTab = currentTab || 'inicio';
  const item = findItem(activeTab);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const { logout } = useAuth();
  const navigate = useNavigate();
  const canLeave = useCanLeave();
  const { user, loading: userLoading, can } = useAdminUser();
  const [pwdOpen, setPwdOpen] = useState(false);

  // Menu lateral recolhido (só ícones) no computador. Lembra a escolha neste navegador.
  const [menuMini, setMenuMini] = useState(() => { try { return localStorage.getItem(MINI_KEY) === '1'; } catch { return false; } });
  const toggleMenuMini = () => setMenuMini(v => {
    try { localStorage.setItem(MINI_KEY, v ? '0' : '1'); } catch { /* navegador sem armazenamento: só não lembra */ }
    return !v;
  });
  // Atalho: Ctrl + \ (ou Cmd + \ no Mac) abre/recolhe o menu
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === '\\') { e.preventDefault(); toggleMenuMini(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Tela sem permissão (ex.: editor abrindo /admin/dashboard) → vai para a 1ª permitida
  const allowed = !user || can(activeTab);
  const fallbackTab = user && !allowed ? firstAllowedTab(user) : null;
  useEffect(() => {
    if (fallbackTab) navigate(TAB_PATHS[fallbackTab], { replace: true });
  }, [fallbackTab, navigate]);

  // Troca de tela pelo menu: avisa se há alterações não salvas
  const setActiveTab = async (tab) => {
    if (tab === activeTab) return;
    if (!(await canLeave())) return;
    navigate(TAB_PATHS[tab] || '/admin/dashboard');
  };

  return (
    <div data-menu={menuMini ? 'mini' : 'full'} className="sif-admin flex h-screen bg-[#f4f6f5] font-sans text-[#1f2937] overflow-hidden">
      
      {/* SIDEBAR */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        logout={logout}
        onMyPassword={() => setPwdOpen(true)}
        isOpen={sidebarOpen}
        closeMobile={() => setSidebarOpen(false)}
        mini={menuMini}
        onToggleMini={toggleMenuMini}
      />

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Barra do topo: onde estou + ver a página no site */}
        <header className="bg-white/90 backdrop-blur border-b border-gray-200/80 h-16 flex items-center justify-between gap-3 px-4 lg:px-10">
            <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 p-2 hover:bg-gray-100 rounded-lg" aria-label="Abrir menu">
                    <Menu size={22} />
                </button>
                <nav aria-label="Você está em" className="flex items-center gap-1.5 text-sm min-w-0">
                    <span className="text-gray-400 hidden sm:inline">{item?.group || 'Painel'}</span>
                    <ChevronRight size={14} className="text-gray-300 hidden sm:inline" />
                    <span className="font-semibold text-gray-800 truncate">{item?.label || 'Painel'}</span>
                </nav>
            </div>
            {item?.site && (
                <a href={import.meta.env.BASE_URL.replace(/\/$/, '') + item.site} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#007a3d] hover:text-[#007a3d] shrink-0">
                    <ExternalLink size={15} /> <span className="hidden sm:inline">Ver no site</span>
                </a>
            )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10">
            <div className="max-w-6xl lg:[[data-menu=mini]_&]:max-w-7xl mx-auto">
                {userLoading ? null : !allowed ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
                    <Lock className="mx-auto mb-3 text-gray-300" size={32} />
                    {fallbackTab ? 'Abrindo uma área liberada para você...' : 'Seu usuário ainda não tem nenhuma área liberada. Fale com um administrador.'}
                  </div>
                ) : (<>
                {/* --- RENDERIZAÇÃO CONDICIONAL ATUALIZADA --- */}
                {activeTab === 'inicio' && <PainelInicio />}
                {activeTab === 'leads' && <LeadsView />}
                {activeTab === 'leads_embrapii' && <LeadsView key="embrapii" source="embrapii" />}
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
                {activeTab === 'rodape' && <RodapeAdmin />}
                {activeTab === 'embrapii' && <EmbrapiiAdmin />}
                {activeTab === 'usuarios' && <UsuariosAdmin />}
                </>)}
            </div>
        </div>
      </main>
      {pwdOpen && <MyPasswordModal onClose={() => setPwdOpen(false)} />}
    </div>
  );
}
