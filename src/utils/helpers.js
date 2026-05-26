export const generateSlug = (text) =>
  text.toString().toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const projectStatusColor = (status) => {
  if (status === 'Concluído') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Em Planejamento') return 'bg-blue-50 text-blue-700';
  if (status === 'Suspenso') return 'bg-red-50 text-red-600';
  return 'bg-amber-50 text-amber-700';
};

// Retorna o status efetivo do projeto: se o usuário escolheu "Automático" ou deixou vazio,
// computa "Em Andamento" ou "Concluído" baseado em data_limite. Caso contrário, retorna
// o status manual como está.
export const getEffectiveProjectStatus = (proj) => {
  if (!proj) return '';
  const s = proj.status;
  if (s === 'Em Andamento' || s === 'Concluído' || s === 'Em Planejamento' || s === 'Suspenso') return s;
  // Automático ou vazio
  if (!proj.data_limite) return 'Em Andamento';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(proj.data_limite + 'T12:00:00');
  if (isNaN(d)) return 'Em Andamento';
  return d >= today ? 'Em Andamento' : 'Concluído';
};
