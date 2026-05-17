export const API_BASE_URL = 'http://localhost/sif-api';

export const getImageUrl = (path) => {
  if (!path) return null;
  
  // Ignora links externos, imagens em base64 e previews temporários locais
  if (path.startsWith('http') || path.startsWith('data:image') || path.startsWith('blob:')) return path;
  
  // Limpa as barras iniciais para evitar duplicação
  const cleanPath = path.replace(/^\/+/, '');
  return `${API_BASE_URL}/${cleanPath}`;
};