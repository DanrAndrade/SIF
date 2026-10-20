// Categorias de vaga (coluna jobs.tipo_vaga). O nome exibido no site é
// editável em Painel › Trabalhe Conosco › Textos (chaves vagas_cat_*).
export const JOB_CATEGORIES = [
  { key: 'Interna',    cfgKey: 'vagas_cat_interna',    label: 'Vagas Internas' },
  { key: 'Associadas', cfgKey: 'vagas_cat_associadas', label: 'Vagas nas Associadas' },
  { key: 'Germinar',   cfgKey: 'vagas_cat_germinar',   label: 'Germinar' },
];

// Vagas antigas: "Externa" virou "Associadas"; vazio = "Interna".
export function jobCategory(job) {
  const t = job?.tipo_vaga;
  if (t === 'Externa') return 'Associadas';
  return JOB_CATEGORIES.some(c => c.key === t) ? t : 'Interna';
}

export const jobCategoryLabel = (key, cfg = {}) => {
  const c = JOB_CATEGORIES.find(x => x.key === key) || JOB_CATEGORIES[0];
  return cfg[c.cfgKey] || c.label;
};
