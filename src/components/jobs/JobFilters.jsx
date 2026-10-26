import React from 'react';

// Filtro por categoria em abas com sublinhado verde (rola de lado no celular).
// items: [{ key, label, count }]
export default function JobFilters({ items, value, onChange }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div role="tablist" aria-label="Categorias de vaga" className="flex w-max gap-7 border-b border-sif-ink/10">
        {items.map((c) => {
          const active = value === c.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(c.key)}
              className={`group relative whitespace-nowrap pb-4 pt-1 text-[14px] font-semibold transition-colors duration-300 ${active ? 'text-sif-ink' : 'text-gray-400 hover:text-sif-ink'}`}
            >
              {c.label}
              <sup className={`ml-1 text-[11px] font-bold ${active ? 'text-sif-green' : 'text-gray-400'}`}>{c.count}</sup>
              <span
                aria-hidden="true"
                className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-sif-green transition-transform duration-500 ease-out ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
