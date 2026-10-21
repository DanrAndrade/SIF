// Mapa do painel: telas, grupos do menu, endereço no painel e página no site.
// A chave (tab) é a mesma que o PHP confere (SIF_MODULES no api_guard.php).
// "inicio" é o resumo (todos veem); "usuarios" é só para administradores.
export const ADMIN_GROUPS = [
  { title: 'Visão geral', items: [
    { tab: 'inicio', label: 'Início', path: '/admin/dashboard', always: true },
  ] },
  { title: 'Atendimento', items: [
    { tab: 'leads',      label: 'Mensagens de contato', path: '/admin/leads' },
    { tab: 'candidates', label: 'Candidatos',           path: '/admin/candidatos' },
    { tab: 'jobs',       label: 'Vagas',                path: '/admin/jobs', site: '/trabalhe-conosco' },
  ] },
  { title: 'Conteúdo', items: [
    { tab: 'blog',         label: 'Blog',                  path: '/admin/blog', site: '/blog' },
    { tab: 'eventos',      label: 'Eventos',               path: '/admin/eventos', site: '/eventos' },
    { tab: 'treinamentos', label: 'Treinamentos',          path: '/admin/treinamentos', site: '/treinamentos' },
    { tab: 'in_company',   label: 'Treinamentos In-Company', path: '/admin/in-company', site: '/treinamentos-in-company' },
    { tab: 'gt',           label: 'Grupos Temáticos',      path: '/admin/gt', site: '/grupos-tematicos' },
    { tab: 'projetos',     label: 'Projetos P&D',          path: '/admin/projetos', site: '/projetos' },
  ] },
  { title: 'Páginas do site', items: [
    { tab: 'home',          label: 'Página inicial',         path: '/admin/home', site: '/' },
    { tab: 'banners',       label: 'Banners da página inicial', path: '/admin/banners', site: '/' },
    { tab: 'institucional', label: 'Institucional',          path: '/admin/institucional', site: '/institucional' },
    { tab: 'associadas',    label: 'Empresas associadas',    path: '/admin/associadas', site: '/associadas' },
    { tab: 'produtos',      label: 'Produtos e serviços',    path: '/admin/produtos', site: '/produtos-servicos' },
    { tab: 'embrapii',      label: 'Projetos SIF e EMBRAPII', path: '/admin/embrapii', site: '/projetos-sif-embrapii' },
    { tab: 'contato',       label: 'Contato',                path: '/admin/contato', site: '/contato' },
    { tab: 'rodape',        label: 'Rodapé',                 path: '/admin/rodape', site: '/' },
  ] },
  { title: 'Evento especial', items: [
    { tab: 'eincol', label: 'EINCOL', path: '/admin/eincol', site: '/eincol' },
  ] },
  { title: 'Administração', items: [
    { tab: 'usuarios', label: 'Usuários e permissões', path: '/admin/usuarios', adminOnly: true },
  ] },
];

export const ALL_ITEMS = ADMIN_GROUPS.flatMap(g => g.items.map(i => ({ ...i, group: g.title })));
export const TAB_PATHS = Object.fromEntries(ALL_ITEMS.map(i => [i.tab, i.path]));
export const findItem = (tab) => ALL_ITEMS.find(i => i.tab === tab);

// Módulos que podem ser liberados para um editor (tudo menos início e usuários)
export const MODULE_OPTIONS = ALL_ITEMS.filter(i => !i.adminOnly && !i.always);

// O usuário pode abrir esta tela?
export function canOpenTab(user, tab) {
  if (!user) return false;
  if (tab === 'inicio') return true;
  if (user.role === 'admin') return true;
  if (tab === 'usuarios') return false;
  if (tab === 'blog') return user.modules?.includes('blog') || (user.gt_ids?.length > 0) || !!user.blog_author;
  return !!user.modules?.includes(tab);
}

export function firstAllowedTab(user) {
  for (const i of ALL_ITEMS) if (canOpenTab(user, i.tab)) return i.tab;
  return null;
}
