import React from 'react';
import PageHeaderForm from '../../components/admin/PageHeaderForm';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1557426272-fc759fbb7a8d?q=80&w=2070',
  hero_badge: 'Conecte-se Conosco',
  hero_title_line1: 'Fale com',
  hero_title_highlight: 'Nossa Equipe',
  hero_subtitle: 'Transparência e proximidade são nossos pilares. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas.',
  hero_scroll_label: '',
};

export default function ContatoAdmin() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Contato</h2>
        <p className="text-gray-500 text-sm mt-1">Configure o cabeçalho da página /contato. O formulário em si continua enviando os leads para a aba "Leads / Contato".</p>
      </div>
      <PageHeaderForm pageKey="contato" defaults={HERO_DEFAULTS} title="Cabeçalho da página /contato" />
    </div>
  );
}
