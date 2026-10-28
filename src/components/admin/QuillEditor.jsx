import React, { useEffect, useCallback, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useQuillImageHandler, DEFAULT_TOOLBAR } from '../../hooks/useQuillImageHandler';
import { BLOG_FONTS, loadBlogFonts } from '../../utils/blogFonts';
import { API_BASE_URL, getImageUrl, fixUploadUrls } from '../../apiConfig';
import { quillListsToSemantic } from '../../utils/quillHtml';

// Formatos aceitos = os botões da barra. Texto colado do Word/Google Docs
// trazia cor, fundo, fonte e tamanho (ex.: texto preto com fundo branco, que
// some na faixa verde escura do site). Com esta lista, só fica o que a barra
// oferece (negrito, títulos, listas, links, imagens, vídeo...).
const FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'list', 'indent', 'link', 'image', 'video', 'imageAlign'];

// Escolha de fonte (só no editor do blog, prop "fonts"): salva como class="ql-font-<nome>".
// Montserrat é o padrão (sem classe).
const FontClass = Quill.import('attributors/class/font');
FontClass.whitelist = BLOG_FONTS.map(f => f.key);
Quill.register(FontClass, true);
const FONT_TOOLBAR = [[{ font: [false, ...BLOG_FONTS.map(f => f.key)] }], ...DEFAULT_TOOLBAR];
const FONT_FORMATS = [...FORMATS, 'font'];

// Listas coladas do Word chegam como parágrafos "·  item". Aqui viram lista de verdade.
const Delta = Quill.import('delta');
const wordListLevel = (node) => {
  const st = node.getAttribute?.('style') || '';
  if (!/MsoListParagraph/i.test(node.className || '') && !/mso-list:\s*l\d/i.test(st)) return null;
  const m = st.match(/level(\d+)/i);
  return m ? Math.max(0, Number(m[1]) - 1) : 0;
};
const isWordMarker = (el) => /mso-list:\s*ignore/i.test(el.getAttribute('style') || '');
const WORD_MATCHERS = [
  // marcador do Word (·, o, §, 1.) fica num span "mso-list:Ignore": descarta
  ['span', (node, delta) => (isWordMarker(node) ? new Delta() : delta)],
  ['p', (node, delta) => {
    const level = wordListLevel(node);
    if (level === null || delta.length() < 1) return delta;
    const marker = [...node.querySelectorAll('span')].find(isWordMarker)?.textContent || '';
    const ordered = /^\s*\(?[0-9a-zA-Z]{1,4}[.)]/.test(marker);
    return delta.compose(new Delta().retain(delta.length() - 1).retain(1, { list: ordered ? 'ordered' : 'bullet', ...(level ? { indent: level } : {}) }));
  }],
];

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

export default function QuillEditor({ value, onChange, height = 'h-[550px]', className = '', fonts = false }) {
  const { quillRef, modules: baseModules } = useQuillImageHandler(fonts ? FONT_TOOLBAR : undefined);
  useEffect(() => { if (fonts) loadBlogFonts(); }, [fonts]); // prévia das fontes no editor
  const modules = React.useMemo(() => ({ ...baseModules, clipboard: { ...(baseModules.clipboard || {}), matchers: WORD_MATCHERS } }), [baseModules]);
  // Ao abrir, o editor "arruma" o HTML (ex.: põe <p>) e avisaria mudança sem
  // ninguém mexer — aparecia "Alterações não salvas" à toa. Só repassamos
  // mudanças feitas pela pessoa (digitação, colar, botões, imagem).
  // O valor arrumado pelo editor fica guardado aqui (não volta a ser
  // reaplicado a cada nova renderização do formulário).
  const [local, setLocal] = useState(() => fixUploadUrls(value || '')); // imagens antigas apontam para a API atual
  const sent = useRef(value || '');
  useEffect(() => {
    if ((value || '') !== sent.current) { sent.current = value || ''; setLocal(fixUploadUrls(value || '')); }
  }, [value]);
  const handleChange = useCallback((html, _delta, source) => {
    setLocal(html);
    if (source !== 'user') return;
    // Listas do Quill 2 (<ol data-list="bullet">) viram <ul>/<ol> normais para o site
    const out = quillListsToSemantic(html);
    sent.current = out;
    onChange?.(out);
  }, [onChange]);

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
        value={local}
        onChange={handleChange}
        formats={fonts ? FONT_FORMATS : FORMATS}
        useSemanticHTML={false}
        className="flex-1 min-h-0 flex flex-col"
      />
    </div>
  );
}
