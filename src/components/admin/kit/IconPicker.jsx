import React from 'react';
import { Sprout, Map, Leaf, Shield, Settings, Microscope, Globe, Users, Scale, FileText, FileBadge } from 'lucide-react';

// Escolha de ícone por clique (antes era preciso digitar o nome em inglês).
// O valor salvo continua sendo o nome do ícone (ex.: 'Sprout'), que o site já entende.
export const ICON_CHOICES = {
  Sprout: { Icon: Sprout, label: 'Muda' },
  Leaf: { Icon: Leaf, label: 'Folha' },
  Map: { Icon: Map, label: 'Mapa' },
  Globe: { Icon: Globe, label: 'Globo' },
  Microscope: { Icon: Microscope, label: 'Microscópio' },
  Settings: { Icon: Settings, label: 'Engrenagem' },
  Shield: { Icon: Shield, label: 'Escudo' },
  Users: { Icon: Users, label: 'Pessoas' },
  Scale: { Icon: Scale, label: 'Balança' },
  FileText: { Icon: FileText, label: 'Documento' },
  FileBadge: { Icon: FileBadge, label: 'Documento com selo' },
};

export default function IconPicker({ label = 'Ícone', value, onChange, options = Object.keys(ICON_CHOICES) }) {
  return (
    <div className="min-w-0">
      {label && <p className="block text-[13px] font-semibold text-gray-600 mb-1.5">{label}</p>}
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map(name => {
          const c = ICON_CHOICES[name];
          if (!c) return null;
          const active = value === name;
          return (
            <button key={name} type="button" role="radio" aria-checked={active} title={c.label} aria-label={c.label}
              onClick={() => onChange?.(name)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${active ? 'border-[#007a3d] bg-emerald-50 text-[#007a3d] ring-2 ring-[#007a3d]/15' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800'}`}>
              <c.Icon size={18} strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
