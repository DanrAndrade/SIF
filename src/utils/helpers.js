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

// Retorna o status efetivo do projeto.
// REGRA: se tem data_limite e ela já passou, sempre "Concluído" (ignora status manual).
// Caso contrário, respeita o status manual; se for "Automático"/vazio, devolve "Em Andamento".
export const getEffectiveProjectStatus = (proj) => {
  if (!proj) return '';

  // 1. Data limite passada → sempre Concluído (regra global automática)
  if (proj.data_limite) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(proj.data_limite + 'T12:00:00');
    if (!isNaN(d) && d < today) return 'Concluído';
  }

  // 2. Status manual válido → respeita
  const s = proj.status;
  if (s === 'Em Andamento' || s === 'Concluído' || s === 'Em Planejamento' || s === 'Suspenso') return s;

  // 3. Automático/vazio sem data passada → Em Andamento
  return 'Em Andamento';
};
