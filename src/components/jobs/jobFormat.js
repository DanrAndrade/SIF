import { stripNbsp } from '../../apiConfig';

// Data de publicação da vaga (coluna created_at) em texto curto:
// "Publicada hoje", "Publicada há 3 dias" ou "12 out. 2026".
export function jobDate(job) {
  const raw = job?.created_at;
  if (!raw) return '';
  const d = new Date(String(raw).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'Publicada hoje';
  if (days === 1) return 'Publicada ontem';
  if (days < 30) return `Publicada há ${days} dias`;
  return `Publicada em ${d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
}

// Primeiro parágrafo da descrição, para o resumo do card
export function jobSummary(job) {
  const text = stripNbsp(job?.description || '').trim();
  return text.split(/\n\s*\n/)[0] || '';
}

export const maskPhone = (value) => {
  if (!value) return '';
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  if (v.length > 0) return v.replace(/(\d*)/, '($1');
  return v;
};

export const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
