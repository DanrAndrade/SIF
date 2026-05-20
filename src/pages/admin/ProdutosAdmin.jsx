import React from 'react';
import PageHeaderForm from '../../components/admin/PageHeaderForm';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
  hero_badge: 'Inovação & Mercado',
  hero_title_line1: 'Produtos',
  hero_title_highlight: '& Serviços',
  hero_subtitle: 'Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.',
  hero_scroll_label: '',
};

export default function ProdutosAdmin() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Produtos & Serviços</h2>
        <p className="text-gray-500 text-sm mt-1">Configure o cabeçalho da página /produtos-servicos.</p>
      </div>
      <PageHeaderForm pageKey="produtos" defaults={HERO_DEFAULTS} title="Cabeçalho da página /produtos-servicos" />
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">📌 Observação</p>
        <p className="text-sm text-amber-800">
          O conteúdo das abas internas (Comercial, Germinar, Boletim, P&D) ainda está fixo no código —
          essa página tem estrutura complexa. Se precisar editar textos das abas, me avise para evoluir
          este admin com mais campos.
        </p>
      </div>
    </div>
  );
}
