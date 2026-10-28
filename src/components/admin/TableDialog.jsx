import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Trash2 } from 'lucide-react';

// Janela para montar/editar a tabela do editor de texto.
// value: { rows: [[texto]], head, foot }
const EMPTY = { rows: [['', ''], ['', ''], ['', '']], head: true, foot: false };

export default function TableDialog({ initial, onSave, onRemove, onClose }) {
  const [t, setT] = useState(() => {
    const v = initial || EMPTY;
    return { rows: v.rows.map(r => [...r]), head: v.head !== false, foot: !!v.foot };
  });
  const cols = t.rows[0]?.length || 1;

  const setCell = (r, c, val) => setT(p => ({ ...p, rows: p.rows.map((row, i) => i === r ? row.map((x, j) => j === c ? val : x) : row) }));
  const addRow = () => setT(p => ({ ...p, rows: [...p.rows, Array(cols).fill('')] }));
  const addCol = () => setT(p => ({ ...p, rows: p.rows.map(r => [...r, '']) }));
  const delRow = (r) => setT(p => (p.rows.length > 1 ? { ...p, rows: p.rows.filter((_, i) => i !== r) } : p));
  const delCol = (c) => setT(p => (cols > 1 ? { ...p, rows: p.rows.map(r => r.filter((_, j) => j !== c)) } : p));

  const isHead = (r) => t.head && r === 0;
  const isFoot = (r) => t.foot && r === t.rows.length - 1 && t.rows.length > (t.head ? 2 : 1);

  const save = () => {
    const rows = t.rows.map(r => r.map(x => x.trim()));
    onSave({ rows, head: t.head, foot: t.foot });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="sif-table-title"
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <h3 id="sif-table-title" className="text-lg font-bold text-gray-800">{initial ? 'Editar tabela' : 'Inserir tabela'}</h3>
          <p className="text-sm text-gray-500">Digite o conteúdo de cada célula. Também é possível colar uma tabela do Excel ou do Word direto no texto.</p>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="border-separate border-spacing-1">
            <thead>
              <tr>
                {Array.from({ length: cols }).map((_, c) => (
                  <th key={c} className="text-center">
                    <button type="button" onClick={() => delCol(c)} disabled={cols < 2} title="Excluir coluna"
                      className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-30 inline-flex items-center gap-1 px-2 py-1 rounded">
                      <X size={13} /> coluna
                    </button>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <input value={cell} onChange={(e) => setCell(r, c, e.target.value)}
                        aria-label={`Linha ${r + 1}, coluna ${c + 1}`}
                        className={`w-40 px-2.5 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[#007a3d]/30 ${isHead(r) || isFoot(r) ? 'bg-[#e6f2ea] border-[#bcd9c6] font-bold text-[#0b3320]' : 'bg-white border-gray-200'}`} />
                    </td>
                  ))}
                  <td>
                    <button type="button" onClick={() => delRow(r)} disabled={t.rows.length < 2} title="Excluir linha"
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30 rounded"><X size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap gap-2 mt-3">
            <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"><Plus size={15} /> Linha</button>
            <button type="button" onClick={addCol} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"><Plus size={15} /> Coluna</button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={t.head} onChange={(e) => setT(p => ({ ...p, head: e.target.checked }))} className="accent-[#007a3d] w-4 h-4" />
              Primeira linha é o cabeçalho
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={t.foot} onChange={(e) => setT(p => ({ ...p, foot: e.target.checked }))} className="accent-[#007a3d] w-4 h-4" />
              Destacar a última linha (total)
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
          {initial && onRemove && (
            <button type="button" onClick={onRemove} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50">
              <Trash2 size={15} /> Remover tabela
            </button>
          )}
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">Cancelar</button>
            <button type="button" onClick={save} className="px-4 py-2 rounded-lg text-white text-sm font-bold bg-[#007a3d] hover:bg-[#1B5E20]">{initial ? 'Salvar tabela' : 'Inserir tabela'}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
