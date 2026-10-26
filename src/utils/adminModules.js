// Mapa do painel: telas, grupos do menu, endereço no painel e página no site.
// A chave (tab) é a mesma que o PHP confere (SIF_MODULES no api_guard.php).
// "inicio" é o resumo (todos veem); "usuarios" é só para administradores.
//
// Ordem do menu: do uso diário para o eventual.
//   1. Atendimento: o que chega pelo site e precisa de resposta.
//   2. Publicações: o que se publica toda semana (vagas logo abaixo de candidatos).
//   3. Eventos e treinamentos: agenda, EINCOL e cursos.
//   4. Pesquisa e inovação: grupos temáticos e projetos.
//   5. Páginas do site: textos fixos, na mesma ordem do menu do site.
//   6. Administração: usuários e permissões.
// icon: ícone do menu (lucide-react, mesmo tamanho e traço em todo o painel).
// desc: frase curta exibida na tela de Usuários ao escolher as áreas.
import {
  LayoutDashboard, MessageSquare, UserCheck, Briefcase, Newspaper, CalendarDays, Tent, BookOpen, GraduationCap,
  Globe, FlaskConical, Lightbulb, Inbox, Home, GalleryHorizontal, Landmark, Building2, ShoppingBag, Mail, PanelBottom, UserCog,
} from 'lucide-react';

export const ADMIN_GROUPS = [
  { title: 'Visão geral', items: [
    { tab: 'inicio', label: 'Início', icon: LayoutDashboard, path: '/admin/dashboard', always: true },
  ] },
  { title: 'Atendimento', items: [
    { tab: 'leads',      label: 'Mensagens de contato', icon: MessageSquare, path: '/admin/leads', desc: 'Ler e responder mensagens enviadas pelo formulário de contato.' },
    { tab: 'leads_embrapii', label: 'Mensagens EMBRAPII', icon: Inbox, path: '/admin/leads-embrapii', desc: 'Ler e responder mensagens do formulário da página EMBRAPII.' },
    { tab: 'candidates', label: 'Candidatos',           icon: UserCheck, path: '/admin/candidatos', desc: 'Ver candidaturas e baixar currículos. Não inclui criar vagas.' },
  ] },
  { title: 'Publicações', items: [
    { tab: 'jobs', label: 'Vagas', icon: Briefcase, path: '/admin/jobs', site: '/trabalhe-conosco', desc: 'Criar e editar vagas e os textos da página Trabalhe Conosco.' },
    { tab: 'blog', label: 'Blog',  icon: Newspaper, path: '/admin/blog', site: '/blog', desc: 'Escrever e publicar posts e notícias de todos os grupos.' },
  ] },
  { title: 'Eventos e treinamentos', items: [
    { tab: 'eventos',      label: 'Eventos',                 icon: CalendarDays, path: '/admin/eventos', site: '/eventos', desc: 'Cadastrar eventos da agenda.' },
    { tab: 'eincol',       label: 'EINCOL',                  icon: Tent, path: '/admin/eincol', site: '/eincol', desc: 'Página do evento especial EINCOL.' },
    { tab: 'treinamentos', label: 'Treinamentos',            icon: BookOpen, path: '/admin/treinamentos', site: '/treinamentos', desc: 'Cursos e treinamentos abertos.' },
    { tab: 'in_company',   label: 'Treinamentos In-Company', icon: GraduationCap, path: '/admin/in-company', site: '/treinamentos-in-company', desc: 'Cursos feitos sob medida para empresas.' },
  ] },
  { title: 'Pesquisa e inovação', items: [
    { tab: 'gt',       label: 'Grupos Temáticos',        icon: Globe, path: '/admin/gt', site: '/grupos-tematicos', desc: 'Todas as páginas dos grupos temáticos.' },
    { tab: 'projetos', label: 'Projetos P&D',            icon: FlaskConical, path: '/admin/projetos', site: '/projetos', desc: 'Projetos de pesquisa e desenvolvimento.' },
    { tab: 'embrapii', label: 'Projetos SIF e EMBRAPII', icon: Lightbulb, path: '/admin/embrapii', site: '/projetos-sif-embrapii', desc: 'Página da parceria SIF e EMBRAPII.' },
  ] },
  { title: 'Páginas do site', items: [
    { tab: 'home',          label: 'Página inicial',            icon: Home, path: '/admin/home', site: '/', desc: 'Textos, números e seções da página inicial.' },
    { tab: 'banners',       label: 'Banners da página inicial', icon: GalleryHorizontal, path: '/admin/banners', site: '/', desc: 'Imagens do carrossel no topo da página inicial.' },
    { tab: 'institucional', label: 'Institucional',             icon: Landmark, path: '/admin/institucional', site: '/institucional', desc: 'História, equipe, estatutos e linha do tempo.' },
    { tab: 'associadas',    label: 'Empresas associadas',       icon: Building2, path: '/admin/associadas', site: '/associadas', desc: 'Logos e textos da página de associadas.' },
    { tab: 'produtos',      label: 'Produtos e serviços',       icon: ShoppingBag, path: '/admin/produtos', site: '/produtos-servicos', desc: 'Abas de produtos, Germinar e boletins.' },
    { tab: 'contato',       label: 'Contato',                   icon: Mail, path: '/admin/contato', site: '/contato', desc: 'Telefone, e-mail e endereço exibidos no site.' },
    { tab: 'rodape',        label: 'Rodapé',                    icon: PanelBottom, path: '/admin/rodape', site: '/', desc: 'Links e informações do rodapé de todas as páginas.' },
  ] },
  { title: 'Administração', items: [
    { tab: 'usuarios', label: 'Usuários e permissões', icon: UserCog, path: '/admin/usuarios', adminOnly: true },
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
  // Responsável por GT (gt_ids): abre Grupos Temáticos (só os seus grupos) e Blog (só o blog dos seus grupos)
  if (tab === 'gt') return user.modules?.includes('gt') || (user.gt_ids?.length > 0);
  if (tab === 'blog') return user.modules?.includes('blog') || (user.gt_ids?.length > 0) || !!user.blog_author;
  return !!user.modules?.includes(tab);
}

// Pode administrar TODOS os GTs (criar, excluir, publicar, trocar responsável)?
export const canManageAllGts = (user) => !!user && (user.role === 'admin' || !!user.modules?.includes('gt'));

export function firstAllowedTab(user) {
  for (const i of ALL_ITEMS) if (canOpenTab(user, i.tab)) return i.tab;
  return null;
}
