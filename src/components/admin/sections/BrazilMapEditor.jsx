import React from 'react';
import { Plus } from 'lucide-react';
import { ItemActions, moveItem, useConfirm } from '../kit';
import QuillEditor from '../QuillEditor';
import { states } from '../../sections/brazilStates';

// Editor do bloco "Mapa do Brasil" (tipo 'brazil_map').
// Dados: sec.items = [{ uf: 'BA', text: 'Alagoinhas' }], sec.content = texto ao lado do mapa.

const inputCls = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d]';
const labelCls = 'block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1';
const SORTED = [...states].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

export default function BrazilMapEditor({ sec, onUpdate }) {
  const confirm = useConfirm();
  const items = sec.items || [];
  const setItems = (next) => onUpdate({ items: next });
  const set = (i, patch) => setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = async (i) => {
    if (!(await confirm({ title: 'Remover este estado?', confirmLabel: 'Remover', danger: true }))) return;
    setItems(items.filter((_, k) => k !== i));
  };
  const used = new Set(items.map(i => i.uf));

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 bg-[#007a3d]/5 border border-[#007a3d]/15 rounded-xl p-3">
        No site aparece um mapa do Brasil em relevo: os estados abaixo sobem com animação e mostram as cidades em um balão. Cada estado pode aparecer uma vez.
      </p>
      <div>
        <label className={labelCls}>Texto ao lado do mapa (opcional)</label>
        <QuillEditor value={sec.content || ''} onChange={(v) => onUpdate({ content: v })} height="h-[200px]" />
      </div>
      <div className="space-y-3">
        <label className={labelCls}>Estados e cidades</label>
        {items.length === 0 && <p className="text-sm text-gray-400 italic">Nenhum estado adicionado.</p>}
        {items.map((it, i) => (
          <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Item {i + 1}</span>
              <ItemActions size={14} onMove={(d) => setItems(moveItem(items, i, d))} isFirst={i === 0} isLast={i === items.length - 1} onDelete={() => remove(i)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3">
              <div>
                <label className={labelCls}>Estado</label>
                <select className={inputCls} value={it.uf || ''} onChange={e => set(i, { uf: e.target.value })}>
                  <option value="">Selecione...</option>
                  {SORTED.map(s => (
                    <option key={s.id} value={s.id} disabled={used.has(s.id) && it.uf !== s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cidades</label>
                <input className={inputCls} value={it.text || ''} placeholder="Ex.: Capelinha, Itamarandiba e Três Marias" onChange={e => set(i, { text: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, { uf: '', text: '' }])}
          className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#007a3d] hover:text-[#007a3d] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Plus size={16} /> Adicionar estado
        </button>
      </div>
    </div>
  );
}
