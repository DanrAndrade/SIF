// Módulos do painel = telas do menu lateral. A chave é a mesma da aba
// (AdminDashboard/TAB_PATHS) e a mesma que o PHP confere (SIF_MODULES no
// api_guard.php). "usuarios" é só para administradores.
export const ADMIN_GROUPS = [
  { title: 'Gestão', items: [
    { tab: 'leads',      label: 'Leads / Contato' },
    { tab: 'candidates', label: 'Candidatos' },
    { tab: 'usuarios',   label: 'Usuários', adminOnly: true },
  ] },
  { title: 'Site & Institucional', items: [
    { tab: 'banners',      label: 'Banners Home' },
    { tab: 'jobs',         label: 'Gerenciar Vagas' },
    { tab: 'blog',         label: 'Gerenciar Blog' },
    { tab: 'eventos',      label: 'Eventos' },
    { tab: 'treinamentos', label: 'Treinamentos' },
    { tab: 'gt',           label: 'Grupos Temáticos' },
    { tab: 'projetos',     label: 'Projetos P&D' },
    { tab: 'embrapii',     label: 'Projetos SIF e EMBRAPII' },
  ] },
  { title: 'Páginas', items: [
    { tab: 'home',          label: 'Página Home' },
    { tab: 'institucional', label: 'Institucional' },
    { tab: 'associadas',    label: 'Associadas' },
    { tab: 'produtos',      label: 'Produtos & Serviços' },
    { tab: 'in_company',    label: 'Trein. In-Company' },
    { tab: 'contato',       label: 'Página Contato' },
    { tab: 'rodape',        label: 'Rodapé' },
  ] },
  { title: 'Evento Especial', items: [
    { tab: 'eincol', label: 'EINCOL' },
  ] },
];

// Módulos que podem ser liberados para um editor (tudo menos "usuarios")
export const MODULE_OPTIONS = ADMIN_GROUPS.flatMap(g => g.items.filter(i => !i.adminOnly).map(i => ({ ...i, group: g.title })));

// O usuário pode abrir esta tela?
export function canOpenTab(user, tab) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (tab === 'usuarios') return false;
  if (tab === 'blog') return user.modules?.includes('blog') || (user.gt_ids?.length > 0) || !!user.blog_author;
  return !!user.modules?.includes(tab);
}

export function firstAllowedTab(user) {
  for (const g of ADMIN_GROUPS) for (const i of g.items) if (canOpenTab(user, i.tab)) return i.tab;
  return null;
}
