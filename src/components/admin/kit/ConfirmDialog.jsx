import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

// Confirmação padrão do painel (substitui o confirm() do navegador e os
// modais copiados em cada tela). Uso:
//   const confirm = useConfirm();
//   if (!(await confirm({ title: 'Excluir evento?', message: '...' }))) return;
const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((o = {}) => new Promise(resolve => {
    resolver.current = resolve;
    setOpts({
      title: 'Tem certeza?',
      message: '',
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      danger: true,
      ...o,
    });
  }), []);

  const close = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => close(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') close(false); }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sif-confirm-title"
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${opts.danger ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <AlertTriangle className={opts.danger ? 'text-red-600' : 'text-emerald-700'} size={24} />
            </div>
            <h3 id="sif-confirm-title" className="text-lg font-bold text-gray-800 mb-2">{opts.title}</h3>
            {opts.message && <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">{opts.message}</p>}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                autoFocus
                onClick={() => close(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
              >
                {opts.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`px-4 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 ${opts.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#007a3d] hover:bg-[#1B5E20]'}`}
              >
                {opts.danger && <Trash2 size={16} />} {opts.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  // Fora do provider (não deveria acontecer): cai no confirm do navegador
  return ctx || ((o = {}) => Promise.resolve(window.confirm(o.title || 'Tem certeza?')));
}
