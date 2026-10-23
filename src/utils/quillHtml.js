// Ajustes no HTML do editor de texto (Quill 2 / react-quill-new).
//
// 1) O Quill 2 grava TODA lista como <ol> e marca o tipo no item:
//      <ol><li data-list="bullet"><span class="ql-ui"></span>item</li></ol>
//    Fora do editor (site), isso aparece como lista NUMERADA, mesmo quando a
//    pessoa escolheu marcadores. Aqui a lista vira HTML normal (<ul>/<ol>,
//    com sub-listas aninhadas pelo recuo) e os pedaços internos do editor
//    (ql-ui, ql-cursor) saem. O Quill lê esse HTML normal de volta sem perda.
export function quillListsToSemantic(html) {
  if (!html || typeof html !== 'string' || typeof DOMParser === 'undefined') return html;
  if (html.indexOf('data-list') === -1 && html.indexOf('ql-ui') === -1 && html.indexOf('ql-cursor') === -1) return html;
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return html;
  root.querySelectorAll('span.ql-ui, span.ql-cursor').forEach(n => n.remove());
  root.querySelectorAll('ol').forEach(ol => {
    const items = [...ol.children].filter(li => li.tagName === 'LI');
    if (!items.some(li => li.hasAttribute('data-list'))) return;
    const frag = doc.createDocumentFragment();
    const stack = []; // [{ level, el, type }]
    for (const li of items) {
      const type = li.getAttribute('data-list') === 'ordered' ? 'ol' : 'ul';
      const m = (li.getAttribute('class') || '').match(/ql-indent-(\d+)/);
      const level = m ? Number(m[1]) : 0;
      li.removeAttribute('data-list');
      if (m) li.classList.remove(`ql-indent-${level}`);
      if (!li.getAttribute('class')) li.removeAttribute('class');
      while (stack.length) {
        const t = stack[stack.length - 1];
        if (t.level > level || (t.level === level && t.type !== type)) stack.pop();
        else break;
      }
      let top = stack[stack.length - 1];
      if (!top || top.level < level) {
        const list = doc.createElement(type);
        if (!top) frag.appendChild(list);
        else (top.el.lastElementChild || top.el).appendChild(list);
        top = { level, el: list, type };
        stack.push(top);
      }
      top.el.appendChild(li);
    }
    ol.replaceWith(frag);
  });
  return root.innerHTML;
}
