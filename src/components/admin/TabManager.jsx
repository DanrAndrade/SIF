import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useQuillImageHandler } from '../../hooks/useQuillImageHandler';

function TabEditorItem({ tab, index, total, itemLabel, onMoveUp, onMoveDown, onRemove, onUpdate }) {
  const { quillRef, modules } = useQuillImageHandler();

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button type="button" onClick={onMoveUp} disabled={index === 0}
            className="p-1 text-gray-400 hover:text-[#007a3d] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronUp size={13}/>
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1}
            className="p-1 text-gray-400 hover:text-[#007a3d] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronDown size={13}/>
          </button>
        </div>
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest shrink-0">
          {itemLabel} {index + 1}
        </span>
        <input
          className="flex-1 p-3 bg-white rounded-xl font-bold text-sm outline-none border focus:border-[#007a3d]"
          placeholder="Título..."
          value={tab.title}
          onChange={e => onUpdate('title', e.target.value)}
        />
        <button type="button" onClick={onRemove}
          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0">
          <Trash2 size={16}/>
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          modules={modules}
          value={tab.content}
          onChange={val => onUpdate('content', val)}
          useSemanticHTML={false}
          className="h-[420px]"
        />
      </div>
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
  const addTab = () => onChange([...tabs, { title: '', content: '' }]);
  const removeTab = (i) => onChange(tabs.filter((_, idx) => idx !== i));
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
          key={i}
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
