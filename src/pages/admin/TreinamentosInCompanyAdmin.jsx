import React from 'react';
import PageHeaderForm from '../../components/admin/PageHeaderForm';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070',
  hero_badge: 'Bespoke Solutions',
  hero_title_line1: 'Treinamentos',
  hero_title_highlight: 'In-Company',
  hero_subtitle: 'Soluções personalizadas em educação corporativa, levadas diretamente ao coração da sua empresa.',
  hero_scroll_label: '',
};

export default function TreinamentosInCompanyAdmin() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Treinamentos In-Company</h2>
        <p className="text-gray-500 text-sm mt-1">Configure o cabeçalho da página /treinamentos-in-company.</p>
      </div>
      <PageHeaderForm pageKey="treinamentos_in_company" defaults={HERO_DEFAULTS} title="Cabeçalho da página /treinamentos-in-company" />
    </div>
  );
}
