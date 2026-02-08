import React from 'react';

// --- INPUT ---
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#3c7a43]/20 focus:border-[#3c7a43] disabled:bg-gray-100 disabled:text-gray-400 ${
          error ? "border-red-400 focus:border-red-400" : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-bold ml-1">{error}</span>}
    </div>
  );
}

// --- TEXTAREA (Corrigido para CamelCase para bater com o import) ---
export function TextArea({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#3c7a43]/20 focus:border-[#3c7a43] min-h-[100px] resize-y ${
          error ? "border-red-400 focus:border-red-400" : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-bold ml-1">{error}</span>}
    </div>
  );
}

// --- SELECT (Adicionado pois estava faltando) ---
export function Select({ label, options = [], error, className = "", children, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-800 appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-[#3c7a43]/20 focus:border-[#3c7a43] disabled:bg-gray-100 ${
            error ? "border-red-400 focus:border-red-400" : "border-gray-200"
          } ${className}`}
          {...props}
        >
          {/* Aceita tanto options via prop quanto children */}
          {children ? children : (
            options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>
        {/* Ícone de seta para baixo customizado */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-bold ml-1">{error}</span>}
    </div>
  );
}