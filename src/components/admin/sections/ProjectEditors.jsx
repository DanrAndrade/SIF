import React from 'react';
import { Field, ItemList } from './BlockEditors';

// Editores dos blocos próprios da página de Projeto (layout "dossiê") e da
// ficha técnica. Os dados vão em extra_data do projeto.

const selectCls = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d]';
const labelCls = 'block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1';

const STATUS = [
  ['prevista', 'Prevista'],
  ['andamento', 'Em andamento'],
  ['concluida', 'Concluída'],
];

function StatusSelect({ value, onChange }) {
  return (
    <div className="min-w-0">
      <label className={labelCls}>Situação</label>
      <select className={selectCls} value={value || 'prevista'} onChange={e => onChange(e.target.value)}>
        {STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
    </div>
  );
}

export function ObjetivosEditor({ sec, onUpdate }) {
  return (
    <div className="space-y-4">
      <Field label="Objetivo geral (frase de destaque)" textarea rows={3} value={sec.general}
        placeholder="Ex.: Desenvolver um método de monitoramento remoto de pragas em plantios de eucalipto."
        onChange={(general) => onUpdate({ general })} />
      <div>
        <p className={labelCls}>Objetivos específicos</p>
        <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} addLabel="Adicionar objetivo"
          empty="Nenhum objetivo específico." newItem={() => ({ title: '', text: '' })}
          render={(it, set) => (
            <div className="space-y-3">
              <Field label="Objetivo" value={it.title} onChange={(title) => set({ title })} />
              <Field label="Explicação (opcional)" textarea rows={2} value={it.text} onChange={(text) => set({ text })} />
            </div>
          )} />
      </div>
    </div>
  );
}

export function FasesEditor({ sec, onUpdate }) {
  return (
    <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} addLabel="Adicionar etapa"
      empty="Nenhuma etapa." newItem={() => ({ name: '', period: '', text: '', status: 'prevista' })}
      render={(it, set) => (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1"><Field label="Nome da etapa" value={it.name} onChange={(name) => set({ name })} placeholder="Ex.: Coleta de dados em campo" /></div>
            <Field label="Período (texto livre)" value={it.period} onChange={(period) => set({ period })} placeholder="Ex.: mar a jun/2026" />
            <StatusSelect value={it.status} onChange={(status) => set({ status })} />
          </div>
          <Field label="O que acontece nesta etapa" textarea rows={3} value={it.text} onChange={(text) => set({ text })} />
        </div>
      )} />
  );
}

export function CronogramaEditor({ sec, onUpdate }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Cada atividade vira uma barra de tempo. A linha de hoje aparece sozinha. Atividade sem nome ou sem mês de início não aparece.</p>
      <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} addLabel="Adicionar atividade"
        empty="Nenhuma atividade." newItem={() => ({ name: '', start: '', end: '', status: 'prevista' })}
        render={(it, set) => (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1"><Field label="Atividade" value={it.name} onChange={(name) => set({ name })} /></div>
            <div className="min-w-0">
              <label className={labelCls}>Início</label>
              <input type="month" className={selectCls} value={it.start || ''} onChange={e => set({ start: e.target.value })} />
            </div>
            <div className="min-w-0">
              <label className={labelCls}>Fim</label>
              <input type="month" className={selectCls} value={it.end || ''} onChange={e => set({ end: e.target.value })} />
            </div>
            <StatusSelect value={it.status} onChange={(status) => set({ status })} />
          </div>
        )} />
    </div>
  );
}

export function ResultadosEditor({ sec, onUpdate }) {
  return (
    <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} grid addLabel="Adicionar indicador"
      empty="Nenhum indicador." newItem={() => ({ value: '', label: '', text: '' })}
      render={(it, set) => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Número (ex.: 40% ou 12 mil ha)" value={it.value} onChange={(value) => set({ value })} />
            <Field label="Nome do indicador" value={it.label} onChange={(label) => set({ label })} />
          </div>
          <Field label="Explicação (opcional)" textarea rows={2} value={it.text} onChange={(text) => set({ text })} />
        </div>
      )} />
  );
}

const FICHA_SUGESTOES = ['Coordenação', 'Instituição executora', 'Financiamento', 'Empresas parceiras', 'Período', 'Investimento', 'Localização', 'Código do projeto'];

// Ficha técnica: linhas "rótulo + valor" na faixa abaixo da capa
export function FichaEditor({ rows, onChange }) {
  return (
    <div className="space-y-3">
      <datalist id="ficha-sugestoes">{FICHA_SUGESTOES.map(s => <option key={s} value={s} />)}</datalist>
      <ItemList items={rows} onChange={onChange} addLabel="Adicionar linha da ficha"
        empty="Nenhuma linha extra. Situação, área, laboratório e prazo já entram sozinhos a partir dos campos acima."
        newItem={() => ({ label: '', value: '' })}
        render={(it, set) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 min-w-0">
              <label className={labelCls}>Rótulo</label>
              <input list="ficha-sugestoes" className={selectCls} value={it.label || ''} placeholder="Ex.: Financiamento" onChange={e => set({ label: e.target.value })} />
            </div>
            <div className="md:col-span-2"><Field label="Valor" value={it.value} onChange={(value) => set({ value })} placeholder="Ex.: EMBRAPII e empresas associadas" /></div>
          </div>
        )} />
    </div>
  );
}
