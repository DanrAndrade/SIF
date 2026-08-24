import { Quill } from 'react-quill-new';

// Registra (uma única vez) um atributo de classe para alinhar/posicionar imagens
// dentro do editor de texto rico. Ele grava classes diretamente na <img>, ex.:
//   ql-img-align-wrap-left  → imagem à esquerda, texto ao lado (float)
//   ql-img-align-wrap-right → imagem à direita, texto ao lado (float)
// O CSS correspondente vive em src/index.css e vale TANTO no editor (.ql-editor)
// QUANTO no conteúdo público renderizado (.prose) — por isso a formatação
// aparece igual pro usuário do admin e pro visitante do site.
//
// Para centralizar / alinhar à esquerda / alinhar à direita usamos o "align"
// nativo do Quill (já existe na toolbar) + CSS. Este atributo cobre só o caso
// de "texto ao lado da imagem" (wrap), que o align nativo não faz.
const WHITELIST = ['left', 'center', 'right', 'wrap-left', 'wrap-right'];

let registered = false;

export function registerQuillImageAlign() {
  if (registered) return;
  const Parchment = Quill.import('parchment');
  const ImageAlign = new Parchment.ClassAttributor('imageAlign', 'ql-img-align', {
    scope: Parchment.Scope.INLINE,
    whitelist: WHITELIST,
  });
  Quill.register(ImageAlign, true);
  registered = true;
}

// Aplica (ou remove, se já estiver aplicado) um posicionamento à imagem
// atualmente selecionada no editor. Se nenhuma imagem estiver selecionada,
// avisa o usuário e não faz nada — assim a opção nunca "some" texto por engano.
export function applyImageAlign(quill, value) {
  if (!quill) return;
  const range = quill.getSelection(true);
  if (!range) return;

  // Descobre se há uma imagem na posição do cursor (ou logo à esquerda dele).
  let index = range.index;
  let [leaf] = quill.getLeaf(index);
  const isImg = (l) => l && l.domNode && l.domNode.tagName === 'IMG';

  if (!isImg(leaf) && range.length === 0 && index > 0) {
    const [prev] = quill.getLeaf(index - 1);
    if (isImg(prev)) { leaf = prev; index -= 1; }
  }

  if (!isImg(leaf)) {
    window.showToast?.('Clique/selecione uma imagem primeiro para posicioná-la.', 'error');
    return;
  }

  const current = quill.getFormat(index, 1);
  const next = current.imageAlign === value ? false : value;
  quill.formatText(index, 1, 'imageAlign', next, 'user');
  quill.setSelection(index, 1, 'silent');
}
