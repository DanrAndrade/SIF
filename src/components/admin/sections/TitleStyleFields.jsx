import React from 'react';
import { TITLE_SIZES, TITLE_WEIGHTS, resolveTitleStyle } from '../../../utils/sectionTitle';

// Campos do título de uma seção (modelo único de seções).
// onUpdate(campo, valor) — campo: title | title_size | title_weight | title_upper | title_align

const selCls = "p-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:border-[#007a3d] shrink-0";

// Título + Tamanho + Peso na mesma linha; o campo já mostra o estilo escolhido.
export function TitleField({ sec, onUpdate, placeholder = 'Título da seção...', defaultSize = 'lg', defaultAlign = 'left' }) {
  const st = resolveTitleStyle(sec, defaultSize, defaultAlign);
  return (
    <>
      <input
        data-keep-style="1"
        className={`flex-1 min-w-0 p-3 bg-white rounded-xl outline-none border focus:border-[#007a3d] ${TITLE_SIZES[st.size].admin} ${TITLE_WEIGHTS[st.weight].cls} ${st.upper ? 'uppercase' : ''} ${st.align === 'center' ? 'text-center' : ''}`}
        placeholder={placeholder}
        value={sec.title || ''}
        onChange={e => onUpdate('title', e.target.value)}
      />
      <select className={selCls} value={st.size} onChange={e => onUpdate('title_size', e.target.value)} title="Tamanho do título">
        {Object.entries(TITLE_SIZES).map(([v, o]) => <option key={v} value={v}>Tamanho: {o.label}</option>)}
      </select>
      <select className={selCls} value={st.weight} onChange={e => onUpdate('title_weight', e.target.value)} title="Peso (grossura) do título">
        {Object.entries(TITLE_WEIGHTS).map(([v, o]) => <option key={v} value={v}>Peso: {o.label}</option>)}
      </select>
    </>
  );
}

// Opções extras do título: maiúsculas e alinhamento.
export function TitleExtraControls({ sec, onUpdate, defaultSize = 'lg', defaultAlign = 'left' }) {
  const st = resolveTitleStyle(sec, defaultSize, defaultAlign);
  const chip = (active) => `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${active ? 'bg-[#007a3d] text-white border-[#007a3d]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#007a3d]'}`;
  return (
    <div className="flex flex-wrap items-center gap-2 pl-1">
      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-1">Título:</span>
      <button type="button" className={chip(st.upper)} onClick={() => onUpdate('title_upper', !st.upper)} title="Tudo em maiúsculas">AA Maiúsculas</button>
      {[['left', 'Esquerda'], ['center', 'Centro']].map(([v, label]) => (
        <button key={v} type="button" className={chip(st.align === v)} onClick={() => onUpdate('title_align', v)}>{label}</button>
      ))}
    </div>
  );
}
