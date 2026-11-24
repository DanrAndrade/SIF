import React from 'react';
import { LayoutGrid, Building2, Users, Sprout } from 'lucide-react';

// Ícone de cada aba (chave da categoria)
const ICONS = { todas: LayoutGrid, Interna: Building2, Associadas: Users, Germinar: Sprout };

// Categorias de vaga em abas com sublinhado verde, no mesmo padrão das abas
// de Produtos e Serviços (rola de lado no celular).
// items: [{ key, label, count }]
export default function JobFilters({ items, value, onChange }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div role="tablist" aria-label="Categorias de vaga" className="flex min-w-max gap-x-7 border-b border-gray-200">
        {items.map((c) => {
          const on = value === c.key;
          const Icon = ICONS[c.key] || LayoutGrid;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(c.key)}
              className={`relative flex shrink-0 items-center gap-2 pb-3.5 pt-2 text-sm font-semibold transition-colors ${on ? 'text-[#1f2937]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={16} className={on ? 'text-[#007a3d]' : ''} />
              {c.label}
              <span className={`text-xs font-bold tabular-nums ${on ? 'text-[#007a3d]' : 'text-gray-400'}`}>{c.count}</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-px left-0 right-0 h-[2px] origin-left bg-[#007a3d] transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
