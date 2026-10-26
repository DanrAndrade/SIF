import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { buttonClass, BtnArrow } from './Button';

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
          className={buttonClass('primary')}
        >
          <span className="py-2">Tentar novamente</span>
          <BtnArrow variant="primary" icon={RefreshCw} />
        </button>
      )}
    </div>
  );
}
