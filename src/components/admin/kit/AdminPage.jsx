import React from 'react';
import { Save, Check, Loader2, CircleDot } from 'lucide-react';

// Estrutura padrão de toda tela do painel:
//   ┌ título / subtítulo ─────────────── [status] [ações] [Salvar] ┐  ← fixo no topo ao rolar
//   ├ abas (opcional)                                              ┤
//   └ conteúdo                                                     ┘
//
// Props:
//   title, subtitle
//   actions   → botões extras à direita (ex.: "Novo evento")
//   save      → { onSave, saving, dirty, savedAt, label } — mostra o botão Salvar padrão
//   tabs      → [{ id, label, icon }], activeTab, onTabChange
export default function AdminPage({ title, subtitle, actions, save, tabs, activeTab, onTabChange, children }) {
  return (
    <div className="w-full">
      <div className="sticky top-0 z-30 -mx-4 lg:-mx-12 px-4 lg:px-12 py-4 bg-[#f3f4f6]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {(actions || save) && (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {save && <SaveStatus {...save} />}
                {actions}
                {save && <SaveButton {...save} />}
              </div>
            )}
          </div>

          {tabs && tabs.length > 0 && (
            <div className="mt-4 border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {tabs.map(t => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onTabChange?.(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${active ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                    >
                      {Icon && <Icon size={14} />} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-6">{children}</div>
    </div>
  );
}

// "Alterações não salvas" / "Salvo"
export function SaveStatus({ dirty, savedAt }) {
  if (dirty) {
    return (
      <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <CircleDot size={12} className="text-emerald-600" /> Alterações não salvas
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <Check size={14} /> Salvo
      </span>
    );
  }
  return null;
}

// Botão Salvar padrão (verde, mesmo tamanho e texto em todo o painel)
export function SaveButton({ onSave, saving, disabled, label = 'Salvar alterações', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onSave}
      disabled={saving || disabled}
      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#007a3d] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#1B5E20] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {saving ? 'Salvando...' : label}
    </button>
  );
}

// Botão secundário padrão (Cancelar, Voltar, Novo...)
export function SecondaryButton({ children, icon: Icon, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider hover:border-[#007a3d] hover:text-[#007a3d] transition-colors ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

// Botão primário para ações que não são "salvar" (ex.: "Novo evento")
export function PrimaryButton({ children, icon: Icon, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a3d] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#1B5E20] disabled:opacity-60 transition-colors ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

// Card branco padrão para agrupar campos
export function AdminCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            {title && <h3 className="text-base font-bold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
