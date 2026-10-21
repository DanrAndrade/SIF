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
      {/* A área de rolagem do painel tem margem interna (p-4 / lg:p-12). O topo
          negativo + margem negativa + padding de mesmo valor faz a barra colar
          na borda de cima de verdade, cobrindo essa margem (sem frestinha de
          conteúdo aparecendo por cima) e sem mudar a posição inicial. */}
      <div className="sticky -top-4 lg:-top-10 z-30 -mt-4 lg:-mt-10 -mx-4 lg:-mx-10 px-4 lg:px-10 pt-4 lg:pt-8 pb-4 bg-[#f4f6f5]/95 backdrop-blur border-b border-gray-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h2>
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
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${active ? 'border-[#007a3d] text-[#007a3d]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
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
      <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <CircleDot size={12} className="text-amber-500" /> Alterações não salvas
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
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
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a3d] text-white text-sm font-semibold shadow-sm hover:bg-[#1B5E20] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-[#007a3d] hover:text-[#007a3d] transition-colors ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#007a3d] text-white text-sm font-semibold shadow-sm hover:bg-[#1B5E20] disabled:opacity-60 transition-colors ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}

// Card branco padrão para agrupar campos
export function AdminCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 md:p-7 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
