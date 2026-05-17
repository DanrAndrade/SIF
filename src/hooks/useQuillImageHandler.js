import { useRef, useCallback, useMemo } from 'react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const DEFAULT_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean'],
];

export function useQuillImageHandler(toolbar = DEFAULT_TOOLBAR) {
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem não pode exceder 5MB.');
        return;
      }

      const fd = new FormData();
      fd.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
          quill.setSelection(range.index + 1);
        } else if (!data.success) {
          alert(data.message || 'Erro ao fazer upload da imagem.');
        }
      } catch {
        alert('Falha ao conectar ao servidor de upload.');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: toolbar,
      handlers: { image: imageHandler },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [imageHandler]);

  return { quillRef, imageHandler, modules };
}
