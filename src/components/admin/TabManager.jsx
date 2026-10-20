import React from 'react';
import { Plus } from 'lucide-react';
import { useConfirm, ItemActions } from './kit';
import QuillEditor from './QuillEditor';

// Editor de uma aba: usa o QuillEditor padrão do painel (barra fixa,
// imagem colada vira arquivo) e as ações padrão ↑ ↓ · Excluir.
function TabEditorItem({ tab, index, total, itemLabel, onMoveUp, onMoveDown, onRemove, onUpdate }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">
          {itemLabel} {index + 1}
        </span>
        <input
          className="flex-1 min-w-0 p-3 bg-white rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]"
          placeholder="Título..."
          value={tab.title}
          onChange={e => onUpdate('title', e.target.value)}
        />
        <ItemActions
          onMove={(dir) => (dir < 0 ? onMoveUp() : onMoveDown())}
          isFirst={index === 0}
          isLast={index === total - 1}
          onDelete={onRemove}
        />
      </div>
      <QuillEditor value={tab.content} onChange={val => onUpdate('content', val)} height="h-[420px]" />
    </div>
  );
}

export default function TabManager({
  tabs,
  onChange,
  title = 'Abas de Conteúdo',
  itemLabel = 'Aba',
  hint = '',
}) {
  const confirm = useConfirm();
  const addTab = () => onChange([...tabs, { _uid: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: '', content: '' }]);
  const removeTab = async (i) => {
    if (!(await confirm({ title: 'Remover esta aba?', message: tabs[i]?.title || '', confirmLabel: 'Remover' }))) return;
    onChange(tabs.filter((_, idx) => idx !== i));
  };
  const updateTab = (i, field, val) => {
    const next = [...tabs];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const moveTab = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= tabs.length) return;
    const next = [...tabs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const hasTitle = Boolean(title);

  const addButton = (
    <button type="button" onClick={addTab}
      className="flex items-center gap-2 px-4 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors">
      <Plus size={14}/> Adicionar {itemLabel}
    </button>
  );

  return (
    <div className={`space-y-4 ${hasTitle ? 'bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm' : ''}`}>
      {hasTitle ? (
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-lg font-bold uppercase text-[#1f2937] tracking-tight">{title}</h3>
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
          </div>
          {addButton}
        </div>
      ) : (
        <div className="flex justify-end">{addButton}</div>
      )}

      {tabs.length === 0 && (
        <p className="text-gray-400 text-sm italic text-center py-4">
          Nenhuma aba. Clique para criar.
        </p>
      )}

      {tabs.map((tab, i) => (
        <TabEditorItem
          key={tab._uid || tab.id || i}
          tab={tab}
          index={i}
          total={tabs.length}
          itemLabel={itemLabel}
          onMoveUp={() => moveTab(i, -1)}
          onMoveDown={() => moveTab(i, 1)}
          onRemove={() => removeTab(i)}
          onUpdate={(field, val) => updateTab(i, field, val)}
        />
      ))}
    </div>
  );
}
