// Leitura dos dados de Evento / Treinamento / In-Company para as páginas de
// detalhe. Nada aqui grava no banco: o que já está salvo (inclusive nos
// formatos antigos) é só convertido na hora para o modelo de blocos.

import { toExternalUrl } from '../../apiConfig';

export function parseExtra(item) {
  const raw = item?.extra_data;
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw) || {}; } catch { return {}; }
}

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// "2026-04-07" → Date (meio-dia, sem problema de fuso)
export const isoDate = (v) => {
  const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], 12);
  return isNaN(d) ? null : d;
};

// 7 de abril de 2026
export const longDate = (d) => (d ? `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}` : '');
export const weekday = (d) => (d ? WEEKDAYS[d.getDay()] : '');

// Período: "12 a 14 de maio de 2026", "30 de abril a 2 de maio de 2026"
export function dateRange(a, b) {
  if (!a) return '';
  if (!b || b.getTime() === a.getTime()) return longDate(a);
  if (a.getFullYear() !== b.getFullYear()) return `${longDate(a)} a ${longDate(b)}`;
  if (a.getMonth() !== b.getMonth()) return `${a.getDate()} de ${MONTHS[a.getMonth()]} a ${longDate(b)}`;
  return `${a.getDate()} a ${longDate(b)}`;
}

// Carga horária: "16" → "16h"; "16 horas" fica como está
export const hoursText = (h) => {
  const s = String(h || '').trim();
  return s ? `${s}${/\d$/.test(s) ? 'h' : ''}` : '';
};

// Situação do evento: respeita o status escolhido no painel; no automático usa a data.
export function eventSituation(ev) {
  const st = String(ev?.status || '');
  if (st === 'Concluído') return 'Realizado';
  if (st === 'Em Andamento') return 'Em andamento';
  const d = isoDate(ev?.event_date);
  if (!d) return '';
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const days = Math.round((d - today) / 86400000);
  if (days < 0) return 'Realizado';
  if (days === 0) return 'É hoje';
  if (days === 1) return 'É amanhã';
  return `Faltam ${days} dias`;
}

// Link de inscrição/proposta salvo no painel (extra_data.cta_url / cta_label)
export function ctaFrom(extra, defaultLabel) {
  const raw = String(extra?.cta_url || '').trim();
  if (!raw) return null;
  // rota interna ("/contato") fica como está; o resto vira link completo
  const href = raw.startsWith('/') ? raw : toExternalUrl(raw);
  if (!href) return null;
  return { href, label: String(extra.cta_label || '').trim() || defaultLabel };
}

// Evento sem blocos salvos: programação (extra.tabs) e PDFs antigos (pdf1..3)
export function eventLegacySections(extra) {
  if (Array.isArray(extra.sections) && extra.sections.length) return extra.sections;
  const out = [];
  if (Array.isArray(extra.tabs) && extra.tabs.length) out.push({ id: 's-legado-prog', type: 'tabs', title: 'Programação', tabs: extra.tabs });
  const pdfs = [1, 2, 3].map(n => extra[`pdf${n}_url`] && { url: extra[`pdf${n}_url`], title: extra[`pdf${n}_title`] || `PDF ${n}` }).filter(Boolean);
  if (pdfs.length) out.push({ id: 's-legado-pdfs', type: 'pdfs', title: 'Materiais', pdfs });
  return out;
}

// Treinamento sem blocos salvos: descrição antiga (texto ou JSON com
// apresentação / público / módulos) e o PDF do curso (pdf_url)
export function trainingLegacy(training, extra) {
  const hasSections = Array.isArray(extra.sections) && extra.sections.length > 0;
  let parsed = null;
  try { const p = JSON.parse(training?.description || ''); if (p && typeof p === 'object') parsed = p; } catch { /* texto comum */ }
  // Com blocos salvos, a descrição antiga não aparece (o painel já levou o
  // texto para os blocos ao editar; a página antiga também fazia assim)
  const aboutHtml = hasSections ? '' : (parsed ? (parsed.presentation || '') : (training?.description || ''));
  const sections = hasSections ? [...extra.sections] : [];
  if (!hasSections && parsed) {
    if (parsed.audience) sections.push({ id: 's-legado-publico', type: 'editor', title: 'Público-alvo', content: parsed.audience });
    if (Array.isArray(parsed.tabs) && parsed.tabs.length) sections.push({ id: 's-legado-modulos', type: 'tabs', title: 'Módulos do treinamento', tabs: parsed.tabs });
    else if (parsed.modules_content) sections.push({ id: 's-legado-modulos', type: 'editor', title: 'Módulos do treinamento', content: parsed.modules_content });
  }
  // PDF do curso: mostra se ainda não estiver dentro de um bloco de arquivos
  const pdf = String(training?.pdf_url || '').trim();
  const pdfInBlocks = sections.some(s => s.type === 'pdfs' && (s.pdfs || []).some(p => (p.url || p.pdf_url) === pdf));
  if (pdf && !pdfInBlocks) sections.push({ id: 's-legado-pdf', type: 'pdfs', title: 'Materiais', pdfs: [{ url: pdf, title: 'Material do curso' }] });
  return { aboutHtml, sections };
}
