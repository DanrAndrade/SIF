import React from 'react';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import PageContentForm from '../../components/admin/PageContentForm';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070',
  hero_badge: 'Bespoke Solutions',
  hero_title_line1: 'Treinamentos',
  hero_title_highlight: 'In-Company',
  hero_subtitle: 'Soluções personalizadas em educação corporativa, levadas diretamente ao coração da sua empresa.',
  hero_scroll_label: '',
};

const CONTENT_DEFAULTS = {
  intro_title_line1: 'Sua demanda,',
  intro_title_highlight: 'nossa expertise.',
  intro_text: 'Os treinamentos In-Company da SIF são desenhados sob medida para atender às necessidades específicas da sua organização, utilizando o conhecimento técnico-científico da UFV.',
  intro_bullet_1: 'Diagnóstico personalizado das necessidades',
  intro_bullet_2: 'Ajuste de carga horária e cronograma',
  intro_bullet_3: 'Foco em estudos de caso da própria empresa',
  intro_bullet_4: 'Redução de custos logísticos para grandes equipes',
  stat_value: '+10k',
  stat_label: 'Profissionais Treinados',
  foco_title: 'Foco Total',
  foco_text: 'Conteúdo adaptado ao seu ecossistema.',
  cta_tag: 'Como prosseguir',
  cta_title_line1: 'Vamos',
  cta_title_highlight: 'Planejar?',
  cta_text: 'Nossa equipe está pronta para formatar o melhor programa de treinamento para seu time.',
  contact_email_label: 'Analista de Eventos e Treinamentos',
  contact_email_value: 'eventos@sif.org.br',
  contact_phone_label: 'Atendimento Comercial',
  contact_phone_value: '(31) 3899-1185',
  form_title_line1: 'Solicitar',
  form_title_highlight: 'Proposta',
};

const CONTENT_FIELDS = [
  // Seção Introdutória
  { key: 'intro_title_line1',      label: 'Título linha 1',         group: 'Seção Introdutória' },
  { key: 'intro_title_highlight',  label: 'Título (destaque verde)', group: 'Seção Introdutória' },
  { key: 'intro_text',             label: 'Texto descritivo',        group: 'Seção Introdutória', type: 'textarea', rows: 3, fullWidth: true },
  { key: 'intro_bullet_1',         label: 'Bullet 1',                group: 'Seção Introdutória' },
  { key: 'intro_bullet_2',         label: 'Bullet 2',                group: 'Seção Introdutória' },
  { key: 'intro_bullet_3',         label: 'Bullet 3',                group: 'Seção Introdutória' },
  { key: 'intro_bullet_4',         label: 'Bullet 4',                group: 'Seção Introdutória' },
  // Card Estatística
  { key: 'stat_value',   label: 'Valor da estatística',  group: 'Card de Destaque' },
  { key: 'stat_label',   label: 'Rótulo da estatística', group: 'Card de Destaque' },
  { key: 'foco_title',   label: 'Título do card Foco',   group: 'Card de Destaque' },
  { key: 'foco_text',    label: 'Texto do card Foco',    group: 'Card de Destaque' },
  // Seção CTA
  { key: 'cta_tag',             label: 'Tag (acima do título)',    group: 'Seção CTA / Contato' },
  { key: 'cta_title_line1',     label: 'Título linha 1',           group: 'Seção CTA / Contato' },
  { key: 'cta_title_highlight', label: 'Título (destaque verde)',  group: 'Seção CTA / Contato' },
  { key: 'cta_text',            label: 'Texto descritivo',         group: 'Seção CTA / Contato', type: 'textarea', rows: 2, fullWidth: true },
  { key: 'contact_email_label', label: 'E-mail — rótulo',         group: 'Seção CTA / Contato' },
  { key: 'contact_email_value', label: 'E-mail — valor',          group: 'Seção CTA / Contato' },
  { key: 'contact_phone_label', label: 'Telefone — rótulo',       group: 'Seção CTA / Contato' },
  { key: 'contact_phone_value', label: 'Telefone — valor',        group: 'Seção CTA / Contato' },
  // Formulário
  { key: 'form_title_line1',      label: 'Título do formulário linha 1',           group: 'Formulário' },
  { key: 'form_title_highlight',  label: 'Título do formulário (destaque verde)',  group: 'Formulário' },
];

export default function TreinamentosInCompanyAdmin() {
  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Treinamentos In-Company</h2>
        <p className="text-gray-500 text-sm mt-1">Configure o cabeçalho e os textos da página /treinamentos-in-company.</p>
      </div>
      <PageHeaderForm pageKey="treinamentos_in_company" defaults={HERO_DEFAULTS} title="Cabeçalho da página" />
      <PageContentForm
        pageKey="treinamentos_in_company"
        defaults={CONTENT_DEFAULTS}
        fields={CONTENT_FIELDS}
        title="Textos da página /treinamentos-in-company"
      />
    </div>
  );
}
