import React from 'react';
import { ChevronUp, ChevronDown, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

// Ações de um item de lista, SEMPRE nesta ordem e com os mesmos ícones:
//   ↑ ↓  |  Visível  |  Editar  |  Excluir
// Passe só as ações que a lista suporta (as outras não aparecem).
//   onMove(dir)  dir = -1 sobe, +1 desce   (isFirst/isLast desabilitam)
//   visible + onToggleVisible
//   onEdit, editing (destaca o botão)
//   onDelete     (a confirmação fica por conta de quem chama — use useConfirm)
const base = 'p-2 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed';

export default function ItemActions({ onMove, isFirst, isLast, visible, onToggleVisible, onEdit, editing, onDelete, size = 16 }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      {onMove && (
        <>
          <button type="button" onClick={() => onMove(-1)} disabled={isFirst} title="Mover para cima" aria-label="Mover para cima"
            className={`${base} bg-white border-gray-200 text-gray-500 hover:text-[#007a3d] hover:border-[#007a3d]`}>
            <ChevronUp size={size} />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={isLast} title="Mover para baixo" aria-label="Mover para baixo"
            className={`${base} bg-white border-gray-200 text-gray-500 hover:text-[#007a3d] hover:border-[#007a3d]`}>
            <ChevronDown size={size} />
          </button>
        </>
      )}
      {onToggleVisible && (
        <button type="button" onClick={onToggleVisible}
          title={visible ? 'Visível no site — clique para ocultar' : 'Oculto no site — clique para mostrar'}
          aria-label={visible ? 'Ocultar no site' : 'Mostrar no site'}
          className={`${base} ${visible ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-600'}`}>
          {visible ? <Eye size={size} /> : <EyeOff size={size} />}
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} title="Editar" aria-label="Editar"
          className={`${base} ${editing ? 'bg-[#007a3d] border-[#007a3d] text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-[#007a3d] hover:border-[#007a3d]'}`}>
          <Edit size={size} />
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} title="Excluir" aria-label="Excluir"
          className={`${base} bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50`}>
          <Trash2 size={size} />
        </button>
      )}
    </div>
  );
}

// Troca o item i com o vizinho (dir = -1 / +1). Devolve um array novo.
export function moveItem(list, i, dir) {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
