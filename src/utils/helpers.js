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
