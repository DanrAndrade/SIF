import { API_BASE_URL } from '../apiConfig';

// Categorias de vaga: criadas, editadas e excluídas em Painel › Trabalhe Conosco.
// Ficam em page_configs 'jobs' → categorias_vaga: [{ id, nome, modo, resp }]
//   id    texto curto e estável, gravado em jobs.tipo_vaga (não muda ao renomear)
//   nome  nome exibido no site (filtro, card e janela da vaga)
//   modo  'candidatura' → a pessoa se candidata no site e a SIF recebe o currículo
//         'divulgacao'  → a SIF só divulga: mostra os dados e leva para o link da
//                         empresa (a SIF não recebe currículo)
//   resp  responsável da categoria { name, role, email, whatsapp, photo }
// Sem lista salva, valem as três categorias originais abaixo (Interna, Germinar,
// Associadas), com os nomes e responsáveis antigos, se existirem.
export const MODO_CANDIDATURA = 'candidatura';
export const MODO_DIVULGACAO = 'divulgacao';

const DEFAULTS = [
  { id: 'Interna',    nome: 'Vagas SIF',            modo: MODO_CANDIDATURA, legacy: 'vagas_cat_interna',    resp: 'resp_interna' },
  { id: 'Germinar',   nome: 'Programa Germinar',    modo: MODO_CANDIDATURA, legacy: 'vagas_cat_germinar',   resp: 'resp_germinar' },
  { id: 'Associadas', nome: 'Vagas nas Associadas', modo: MODO_DIVULGACAO,  legacy: 'vagas_cat_associadas', resp: 'resp_associadas' },
];

const s = (v) => String(v ?? '').trim();
const cleanResp = (r) => ({ name: s(r?.name), role: s(r?.role), email: s(r?.email), whatsapp: s(r?.whatsapp), photo: s(r?.photo) });
export const emptyResp = () => cleanResp({});

// Lista de categorias a partir da configuração da página 'jobs'
export function jobCategories(cfg = {}) {
  const saved = cfg?.categorias_vaga;
  if (Array.isArray(saved) && saved.length) {
    return saved.filter(c => c && s(c.id)).map(c => ({
      id: s(c.id),
      nome: s(c.nome) || s(c.id),
      modo: c.modo === MODO_DIVULGACAO ? MODO_DIVULGACAO : MODO_CANDIDATURA,
      resp: cleanResp(c.resp),
    }));
  }
  return DEFAULTS.map(d => ({
    id: d.id,
    nome: s(cfg?.[d.legacy]) || d.nome,
    modo: d.modo,
    resp: cleanResp({
      name: cfg?.[`${d.resp}_name`], role: cfg?.[`${d.resp}_role`], email: cfg?.[`${d.resp}_email`],
      whatsapp: cfg?.[`${d.resp}_whatsapp`], photo: cfg?.[`${d.resp}_photo`],
    }),
  }));
}

// Busca as categorias salvas (usado no painel)
export async function loadJobCategories() {
  try {
    const r = await fetch(`${API_BASE_URL}/page_content.php?page=jobs`);
    const data = await r.json();
    return jobCategories(data && typeof data === 'object' && !Array.isArray(data) ? data : {});
  } catch {
    return jobCategories({});
  }
}

// Id novo para uma categoria criada no painel (cabe em jobs.tipo_vaga, 30 caracteres)
export const newCategoryId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// Id da categoria da vaga. "Externa" (antigo) = Associadas; id desconhecido
// (categoria apagada) ou vazio = a primeira categoria.
export function jobCategory(job, cats = jobCategories()) {
  let t = job?.tipo_vaga;
  if (t === 'Externa') t = 'Associadas';
  return cats.some(c => c.id === t) ? t : (cats[0]?.id || 'Interna');
}

export const categoryOf = (job, cats = jobCategories()) => cats.find(c => c.id === jobCategory(job, cats)) || null;

// Vaga só de divulgação: sem candidatura pela SIF, só os dados + link da empresa
export const isDivulgacaoJob = (job, cats = jobCategories()) => categoryOf(job, cats)?.modo === MODO_DIVULGACAO;

export const jobCategoryLabel = (id, cats = jobCategories()) => (cats.find(c => c.id === id) || cats[0] || {}).nome || '';

// Responsável da categoria no formato do card de contato; null se não cadastrado
export function categoryResponsavel(id, cats = jobCategories()) {
  const r = (cats.find(c => c.id === id) || {}).resp;
  if (!r) return null;
  const out = { contact_name: r.name, contact_role: r.role, contact_email: r.email, contact_whatsapp: r.whatsapp, contact_photo: r.photo };
  return out.contact_name || out.contact_email || out.contact_whatsapp ? out : null;
}
