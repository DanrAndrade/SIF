import React from 'react';

// Rede de segurança: se uma página quebrar (ou o arquivo dela não carregar
// porque saiu versão nova do site), mostra um aviso com botão de recarregar
// em vez de deixar a tela em branco.
const isChunkError = (e) => /Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i.test(String(e?.message || e));

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    // Carregou bem: libera o recarregamento automático para uma próxima versão
    setTimeout(() => { try { sessionStorage.removeItem('sif_chunk_reload'); } catch { /* ok */ } }, 15000);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // Arquivo de versão antiga: recarrega uma vez sozinho para pegar a nova
    if (isChunkError(error)) {
      try {
        const k = 'sif_chunk_reload';
        if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); window.location.reload(); return; }
      } catch { /* sem sessionStorage: segue para o aviso */ }
    }
    console.error('[SIF] erro na página:', error);
  }

  componentDidUpdate(prevProps) {
    // Mudou de página: tenta de novo
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f6f8f7]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-[#1f2937] mb-3">Não foi possível abrir esta página</h1>
          <p className="text-gray-500 mb-8">Pode ter saído uma versão nova do site. Recarregue para continuar.</p>
          <button type="button" onClick={() => window.location.reload()}
            className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#007a3d] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1B5E20]">
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
