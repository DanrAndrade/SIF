export const generateSlug = (text) =>
  text.toString().toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

// Cores de status — só tons de verde e cinza (identidade visual SIF)
export const projectStatusColor = (status) => {
  if (status === 'Concluído') return 'bg-emerald-50 text-emerald-800';
  if (status === 'Em Planejamento') return 'bg-gray-100 text-gray-600';
  if (status === 'Suspenso') return 'bg-gray-100 text-gray-400';
  return 'bg-lime-50 text-lime-700'; // Em Andamento
};

// Bolinha de status nos cards públicos (mesma lógica de cores)
export const STATUS_DOT = {
  'Em Andamento': 'bg-[#7FBA00]',
  'Concluído': 'bg-[#1B5E20]',
  'Em Planejamento': 'bg-gray-400',
  'Suspenso': 'bg-gray-300',
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
