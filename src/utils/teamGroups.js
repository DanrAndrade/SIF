// Grupos da equipe (Institucional › Nossa Gente).
// "key" é o valor gravado em cada pessoa (team.group_name) e nunca muda;
// "label" é o nome exibido no site, editável no painel (page_configs
// "institucional" → team_groups). A ordem da lista é a ordem no site.
export const DEFAULT_TEAM_GROUPS = [
  'Diretoria',
  'Coordenadoras',
  'Coord. Fundação SIF & EMBRAPII',
  'Coord. Inovação e Projetos',
  'Coord. de CSC',
  'Coord. de Produtos e Serviços',
  'Coord. de RH & Facilities',
  'Consultores',
].map(key => ({ key, label: key }));

// Junta o que está salvo com os padrões e com grupos que só existem no banco.
export function resolveTeamGroups(saved, extraKeys = []) {
  const base = Array.isArray(saved) && saved.length
    ? saved.filter(g => g && g.key).map(g => ({ key: g.key, label: g.label ?? g.key })) // vazio = mostra o nome original no site
    : DEFAULT_TEAM_GROUPS.map(g => ({ ...g }));
  const known = new Set(base.map(g => g.key));
  for (const k of [...DEFAULT_TEAM_GROUPS.map(g => g.key), ...extraKeys]) {
    if (k && !known.has(k)) { base.push({ key: k, label: k }); known.add(k); }
  }
  return base;
}
