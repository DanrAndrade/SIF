// Página "Projetos SIF e EMBRAPII" — conteúdo inicial (esboço para aprovação).
// Tudo editável em Painel › Páginas › Projetos SIF e EMBRAPII (page_configs "embrapii").
import { newSectionId } from '../components/sections/sectionTypes';

export const EMBRAPII_HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Pesquisa, Desenvolvimento e Inovação',
  hero_title_line1: 'Projetos SIF e',
  hero_title_highlight: 'EMBRAPII',
  hero_subtitle: 'Unidade EMBRAPII Fibras Florestais: a ciência da UFV conectada às demandas reais do setor produtivo.',
  hero_scroll_label: 'Conheça a unidade',
};

export const EMBRAPII_DEFAULTS = {
  intro_tag: 'Unidade EMBRAPII Fibras Florestais',
  intro_title: 'Inovação florestal com risco compartilhado',
  intro_text: 'Credenciada pela EMBRAPII e sediada no Departamento de Engenharia Florestal da UFV, a unidade desenvolve projetos de PD&I em parceria com empresas, da silvicultura até o produto final. Conta também com apoio do BNDES em temas como economia circular, bioeconomia florestal e biocombustíveis.',
  frentes: [
    { title: 'Produção e qualidade de fibras', text: 'Melhoramento, manejo e qualidade da madeira e das fibras florestais.' },
    { title: 'Conversão em produtos e energia', text: 'Transformação das fibras em novos produtos, materiais e energia.' },
    { title: 'Meio ambiente e sustentabilidade', text: 'Soluções que unem produtividade, conservação e responsabilidade ambiental.' },
  ],
  sections: [
    {
      id: newSectionId(), type: 'editor', title: 'Como fazer uma parceria',
      content: '<ol><li><strong>Negociação direta</strong> com a unidade, sem intermediários.</li><li><strong>Contratação direta</strong> do projeto.</li><li><strong>Recursos já disponíveis</strong> para cofinanciamento.</li><li><strong>Fluxo contínuo</strong>: não depende de edital.</li><li><strong>Retorno</strong> estimado para a empresa e para a sociedade.</li></ol>',
    },
    {
      id: newSectionId(), type: 'editor', title: 'Programa de Formação de Recursos Humanos',
      content: '<p>Capacitação de estudantes e pesquisadores para atuar em projetos de PD&amp;I, com metodologias práticas e aprendizagem baseada em projetos e na resolução de problemas reais.</p>',
    },
    {
      id: newSectionId(), type: 'editor', title: 'Comitê de aprovação de projetos',
      content: '<p>Os projetos são avaliados de forma imparcial por um comitê, considerando:</p><ul><li>Maturidade tecnológica (nível TRL)</li><li>Objetivo do projeto</li><li>Coordenação e equipe</li><li>Área de concentração</li><li>Empresas financiadoras</li><li>Viabilidade técnica e econômica</li></ul>',
    },
  ],
  projects_enabled: true,
  projects_tag: 'Portfólio',
  projects_title: 'Projetos em andamento',
  projects_limit: 6,
  cta_title: 'Tem um desafio de inovação?',
  cta_text: 'Fale com a nossa equipe e descubra como desenvolver um projeto em parceria com a SIF e a EMBRAPII.',
  cta_btn_label: 'Falar com a equipe',
  cta_btn_link: '/contato',
};
