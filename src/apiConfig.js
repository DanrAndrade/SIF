export const API_BASE_URL = 'http://localhost/sif-api';

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/1200x800?text=SIF+Noticias';
  if (path.startsWith('http')) return path;
  // Remove slash inicial se houver
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
