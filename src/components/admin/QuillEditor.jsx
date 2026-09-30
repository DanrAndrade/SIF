import React, { useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useQuillImageHandler } from '../../hooks/useQuillImageHandler';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

// Imagem colada (Ctrl+V de print/Word) ou arrastada entra no Quill como
// base64 dentro do HTML — deixa o conteúdo gigante (centenas de KB) e a
// página pesada. Aqui ela é enviada ao servidor como arquivo normal e o
// base64 é trocado pela URL. Vale também para conteúdo antigo ao abrir.
async function uploadDataImage(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
  const fd = new FormData();
  fd.append('image', new File([blob], `colada.${ext}`, { type: blob.type }));
  const res = await fetch(`${API_BASE_URL}/upload.php`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'upload falhou');
  return getImageUrl(data.url);
}

export default function QuillEditor({ value, onChange, height = 'h-[550px]', className = '' }) {
  const { quillRef, modules } = useQuillImageHandler();

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const inFlight = new WeakSet();

    const replaceDataImages = () => {
      quill.root.querySelectorAll('img[src^="data:image"]').forEach(async (img) => {
        if (inFlight.has(img)) return;
        inFlight.add(img);
        try {
          const url = await uploadDataImage(img.getAttribute('src'));
          const blot = Quill.find(img);
          if (!blot || !img.isConnected) return;
          const index = quill.getIndex(blot);
          quill.deleteText(index, 1, 'user');
          quill.insertEmbed(index, 'image', url, 'user');
        } catch {
          window.showToast?.('Não foi possível enviar a imagem colada. Use o botão de imagem da barra.', 'error');
        }
      });
    };

    quill.on('text-change', replaceDataImages);
    replaceDataImages();
    return () => quill.off('text-change', replaceDataImages);
  }, [quillRef]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden ${height} ${className}`}>
      {/* useSemanticHTML={false}: serializa pelo DOM real do editor
          (root.innerHTML). O padrão (getSemanticHTML) convertia o vídeo em
          link <a> e bagunçava os parágrafos. Assim o vídeo é salvo como
          <iframe class="ql-video">. */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        useSemanticHTML={false}
        className="flex-1 min-h-0 flex flex-col"
      />
    </div>
  );
}
