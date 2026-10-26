// Tipos de arquivo do bloco "Arquivos e documentos" (tipo 'pdfs', nome mantido
// para os blocos já salvos). Cada item: { url, title, ext?, size? }.
// Itens antigos ({ url|pdf_url, title }) continuam valendo: a extensão sai do link.
import { FileText, FileSpreadsheet, Presentation, FileImage, File } from 'lucide-react';

export const FILE_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.csv,.jpg,.jpeg,.png,.webp,.gif';
export const FILE_MAX_MB = 20;

const KIND = {
  pdf: 'doc', doc: 'doc', docx: 'doc', odt: 'doc',
  xls: 'sheet', xlsx: 'sheet', ods: 'sheet', csv: 'sheet',
  ppt: 'slides', pptx: 'slides',
  jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', gif: 'image', avif: 'image', bmp: 'image',
};
const ICONS = { doc: FileText, sheet: FileSpreadsheet, slides: Presentation, image: FileImage };

export const fileUrl = (f) => (f && (f.url || f.pdf_url)) || '';

export function fileExt(f) {
  if (f?.ext) return String(f.ext).toLowerCase();
  const m = /\.([a-z0-9]{2,5})(?:[?#].*)?$/i.exec(fileUrl(f));
  return m ? m[1].toLowerCase() : '';
}

export const fileIcon = (ext) => ICONS[KIND[ext]] || File;

export function fileSize(bytes) {
  const n = Number(bytes);
  if (!n || n < 0) return '';
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

// "PDF · 1,2 MB"
export const fileMetaLabel = (f) => [fileExt(f).toUpperCase(), fileSize(f?.size)].filter(Boolean).join(' · ');
