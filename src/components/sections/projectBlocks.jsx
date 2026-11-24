import React from 'react';

// Blocos próprios da página de Projeto (layout "dossiê"). O título do capítulo
// é desenhado pela página (numerado); aqui só o conteúdo.

export const FASE_STATUS = {
  concluida: 'Concluída',
  andamento: 'Em andamento',
  prevista: 'Prevista',
};
const statusKey = (s) => (FASE_STATUS[s] ? s : 'prevista');

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthIdx = (s) => {
  const m = /^(\d{4})-(\d{1,2})/.exec(String(s || ''));
  return m ? Number(m[1]) * 12 + (Number(m[2]) - 1) : null;
};
const fmtMonth = (i) => `${MES[i % 12]}/${String(Math.floor(i / 12)).slice(2)}`;

// ── Objetivos: frase geral grande + específicos em linhas numeradas por letra
export function ObjetivosBlock({ sec }) {
  const items = (sec.items || []).filter(i => i && (i.title || i.text));
  return (
    <div>
      {sec.general && <p className="text-xl md:text-[26px] leading-snug font-light text-sif-ink whitespace-pre-line">{sec.general}</p>}
      {items.length > 0 && (
        <ol className={`${sec.general ? 'mt-10' : ''} divide-y divide-gray-200 border-y border-gray-200`}>
          {items.map((it, i) => (
            <li key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-5">
              <span className="text-sm font-semibold text-sif-green pt-0.5">{String.fromCharCode(97 + (i % 26))})</span>
              <div>
                {it.title && <h3 className="font-semibold text-sif-ink text-lg leading-snug">{it.title}</h3>}
                {it.text && <p className="mt-1 text-gray-600 leading-relaxed whitespace-pre-line">{it.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ── Metodologia por etapas: sequência vertical com marcador e situação
export function FasesBlock({ sec }) {
  const items = (sec.items || []).filter(i => i && String(i.name || '').trim());
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const st = statusKey(it.status);
        const last = i === items.length - 1;
        const marker = st === 'concluida' ? 'bg-sif-dark border-sif-dark text-white' : st === 'andamento' ? 'bg-sif-green border-sif-green text-white' : 'bg-white border-gray-300 text-gray-400';
        return (
          <li key={i} className={`relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 ${last ? '' : 'pb-9'}`}>
            {!last && <span aria-hidden="true" className="absolute left-[17px] top-9 bottom-0 w-px bg-gray-200" />}
            <span className={`relative z-10 w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${marker}`}>{i + 1}</span>
            <div className="pt-1">
              <h3 className="font-semibold text-sif-ink text-lg leading-snug">{it.name}</h3>
              <p className="mt-0.5 text-sm text-gray-500">
                <span className={st === 'andamento' ? 'text-sif-green font-semibold' : st === 'concluida' ? 'text-sif-dark font-semibold' : ''}>{FASE_STATUS[st]}</span>
                {it.period ? <span> · {it.period}</span> : null}
              </p>
              {it.text && <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">{it.text}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ── Cronograma: barras de tempo (início e fim em meses) com a linha de hoje
export function CronogramaBlock({ sec }) {
  const rows = (sec.items || [])
    .filter(i => i && String(i.name || '').trim() && monthIdx(i.start) !== null)
    .map(i => {
      const a = monthIdx(i.start);
      const b = monthIdx(i.end);
      return { name: i.name, status: statusKey(i.status), a, b: b !== null && b >= a ? b : a };
    });
  if (!rows.length) return null;
  const min = Math.min(...rows.map(r => r.a));
  const max = Math.max(...rows.map(r => r.b));
  const total = max - min + 1;
  const pct = (v) => `${(v / total) * 100}%`;
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  const showNow = nowIdx >= min && nowIdx <= max;
  const years = [];
  for (let y = Math.floor(min / 12); y <= Math.floor(max / 12); y++) {
    const from = Math.max(min, y * 12);
    const to = Math.min(max, y * 12 + 11);
    years.push({ y, left: from - min, span: to - from + 1 });
  }
  const bar = {
    concluida: 'bg-sif-dark',
    andamento: 'bg-sif-green',
    prevista: 'bg-sif-green/20 ring-1 ring-inset ring-sif-green/40',
  };
  return (
    <div>
      <div className="md:grid md:grid-cols-[minmax(140px,230px)_minmax(0,1fr)] md:gap-x-6">
        <div className="hidden md:block" />
        <div className="relative hidden md:block h-6 text-xs font-semibold text-gray-500">
          {years.map(({ y, left }) => (
            <span key={y} className="absolute top-0" style={{ left: pct(left) }}>{y}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div className="pt-4 md:py-3 md:pr-2">
              <p className="font-semibold text-sif-ink text-[15px] leading-snug">{r.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{fmtMonth(r.a)}{r.b !== r.a ? ` a ${fmtMonth(r.b)}` : ''}</p>
            </div>
            <div className="relative h-8 md:h-auto md:my-3 mt-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-gray-100" />
              {years.slice(1).map(({ y, left }) => (
                <span key={y} aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-gray-200" style={{ left: pct(left) }} />
              ))}
              <div className={`absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full ${bar[r.status]}`}
                style={{ left: pct(r.a - min), width: pct(r.b - r.a + 1), minWidth: 8 }} />
              {showNow && <span aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-sif-green/60" style={{ left: pct(nowIdx - min + 0.5) }} />}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
        {['concluida', 'andamento', 'prevista'].map(k => (
          <span key={k} className="inline-flex items-center gap-2"><span className={`inline-block w-6 h-2 rounded-full ${bar[k]}`} />{FASE_STATUS[k]}</span>
        ))}
        {showNow && <span className="inline-flex items-center gap-2"><span className="inline-block w-px h-4 bg-sif-green/60" />Hoje</span>}
      </div>
    </div>
  );
}

// ── Resultados: indicadores grandes com explicação
export function ResultadosBlock({ sec }) {
  const items = (sec.items || []).filter(i => i && (String(i.value || '').trim() || i.label));
  return (
    <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
      {items.map((it, i) => (
        <div key={i} className="border-t border-gray-200 pt-5">
          <dd className="text-5xl md:text-6xl font-light tracking-tight text-sif-dark leading-none">{it.value}</dd>
          {it.label && <dt className="mt-3 font-semibold text-sif-ink">{it.label}</dt>}
          {it.text && <p className="mt-1 text-sm text-gray-500 leading-relaxed">{it.text}</p>}
        </div>
      ))}
    </dl>
  );
}

export const PROJECT_BLOCKS = {
  proj_objetivos: ObjetivosBlock,
  proj_fases: FasesBlock,
  proj_cronograma: CronogramaBlock,
  proj_resultados: ResultadosBlock,
};
