import { Quill } from 'react-quill-new';

// Tabela no editor de texto: um bloco único (não se edita célula a célula
// dentro do editor). Clicar nela abre a janela de edição.
// Fica salva como HTML comum:
// <div class="sif-table-wrap"><table class="sif-table"><thead>…</thead><tbody>…</tbody><tfoot>…</tfoot></table></div>

const BlockEmbed = Quill.import('blots/block/embed');
const Delta = Quill.import('delta');

const cellText = (c) => (c.textContent || '').replace(/\s+/g, ' ').trim();

// Lê uma <table> qualquer (nossa ou colada do Excel/Word) no formato { rows, head, foot }
export function parseTable(table) {
  const trs = [...table.querySelectorAll('tr')];
  const rows = trs.map(tr => [...tr.children].filter(c => /^(TD|TH)$/.test(c.tagName)).map(cellText)).filter(r => r.length);
  if (!rows.length) return null;
  const cols = Math.max(...rows.map(r => r.length));
  rows.forEach(r => { while (r.length < cols) r.push(''); });
  const first = trs[0];
  const head = !!(first && (first.parentElement?.tagName === 'THEAD' || [...first.children].some(c => c.tagName === 'TH')));
  const foot = !!table.querySelector('tfoot tr');
  return { rows, head: table.classList.contains('sif-table') ? head : (head || rows.length > 1), foot };
}

export function buildTable(value) {
  const { rows = [], head = true, foot = false } = value || {};
  const table = document.createElement('table');
  table.className = 'sif-table';
  const addRow = (parent, cells, tag) => {
    const tr = document.createElement('tr');
    cells.forEach(t => { const c = document.createElement(tag); c.textContent = t; tr.appendChild(c); });
    parent.appendChild(tr);
  };
  let body = rows;
  if (head && rows.length) {
    const thead = document.createElement('thead');
    addRow(thead, rows[0], 'th');
    table.appendChild(thead);
    body = rows.slice(1);
  }
  let last = null;
  if (foot && body.length > 1) { last = body[body.length - 1]; body = body.slice(0, -1); }
  const tbody = document.createElement('tbody');
  body.forEach(r => addRow(tbody, r, 'td'));
  table.appendChild(tbody);
  if (last) {
    const tfoot = document.createElement('tfoot');
    addRow(tfoot, last, 'td');
    table.appendChild(tfoot);
  }
  return table;
}

class TableBlot extends BlockEmbed {
  static blotName = 'sifTable';
  static tagName = 'DIV';
  static className = 'sif-table-wrap';

  static create(value) {
    const node = super.create();
    node.setAttribute('contenteditable', 'false');
    node.appendChild(buildTable(value));
    return node;
  }

  static value(node) {
    const t = node.querySelector('table');
    return (t && parseTable(t)) || { rows: [['']], head: true, foot: false };
  }
}

let registered = false;
export function registerQuillTable() {
  if (registered) return;
  registered = true;
  Quill.register(TableBlot, true);
  const icons = Quill.import('ui/icons');
  icons.sifTable = '<svg viewBox="0 0 18 18"><rect class="ql-stroke" x="2.5" y="3.5" width="13" height="11" rx="1"/><line class="ql-stroke" x1="2.5" y1="7.5" x2="15.5" y2="7.5"/><line class="ql-stroke" x1="2.5" y1="11" x2="15.5" y2="11"/><line class="ql-stroke" x1="7" y1="7.5" x2="7" y2="14.5"/><line class="ql-stroke" x1="11" y1="7.5" x2="11" y2="14.5"/></svg>';
}

// Tabela colada do Excel, Word ou Google Docs vira o bloco de tabela
export const TABLE_MATCHER = ['table', (node, delta) => {
  const v = parseTable(node);
  return v ? new Delta().insert({ sifTable: v }) : delta;
}];
