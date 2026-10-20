import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

// Aviso padrão quando uma lista do site não carrega (servidor fora do ar,
// internet caiu). Antes a página mostrava "nenhum item", como se não
// houvesse conteúdo.
export default function LoadError({ onRetry, className = '' }) {
  return (
    <div role="alert" className={`col-span-full py-16 text-center ${className}`}>
      <WifiOff size={40} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-600 font-bold mb-1">Não foi possível carregar o conteúdo.</p>
      <p className="text-gray-400 text-sm mb-6">Verifique sua conexão e tente novamente.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#007a3d] text-white text-sm font-bold hover:bg-[#1B5E20] transition-colors"
        >
          <RefreshCw size={16} /> Tentar novamente
        </button>
      )}
    </div>
  );
}
