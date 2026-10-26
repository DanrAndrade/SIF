// Página "Projetos SIF e EMBRAPII" — conteúdo inicial (esboço para aprovação).
// Tudo editável em Painel › Páginas › Projetos SIF e EMBRAPII (page_configs "embrapii").
import { newSectionId } from '../components/sections/sectionTypes';

const UNSPLASH = 'https://images.unsplash.com';
const UQ = '?q=80&w=1600&auto=format&fit=crop';

export const EMBRAPII_HERO_DEFAULTS = {
  hero_image: `${UNSPLASH}/photo-1639051119236-475ab61f5bc3${UQ}`,
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
  intro_image: `${UNSPLASH}/photo-1640125346217-e4bb9313d6bd${UQ}`,
  frentes_tag: 'Áreas de atuação',
  // Texto da faixa de áreas (aparece quando a área não tem texto próprio)
  frentes_text: 'As três áreas de trabalho conseguem abarcar praticamente toda a ciência florestal aplicada, desde a silvicultura até a produção de bens que têm as fibras florestais como matéria-prima.',
  // Foto ao lado dos passos da parceria
  parceria_image: `${UNSPLASH}/photo-1640125346217-e4bb9313d6bd${UQ}`,
  frentes: [
    { title: 'Produção e qualidade de fibras', text: 'Melhoramento, manejo e qualidade da madeira e das fibras florestais.', image: `${UNSPLASH}/photo-1517962123380-eac440fa8120${UQ}` },
    { title: 'Conversão em produtos e energia', text: 'Transformação das fibras em novos produtos, materiais e energia.', image: `${UNSPLASH}/photo-1615836671441-cc13250c2158${UQ}` },
    { title: 'Meio ambiente e sustentabilidade', text: 'Soluções que unem produtividade, conservação e responsabilidade ambiental.', image: `${UNSPLASH}/photo-1626657171364-4af23203469b${UQ}` },
  ],
  // Foto desfocada ao fundo da faixa escura do vídeo
  band_photo: `${UNSPLASH}/photo-1639051119236-475ab61f5bc3${UQ}`,
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
    {
      id: newSectionId(), type: 'logos', eyebrow: 'Realização e apoio', title: 'Quem torna a unidade possível',
      images: ['logo-sif', 'logo-embrapii-fibras-florestais', 'logo-ufv-100-anos', 'logo-bndes'].map(n => `uploads/pages/embrapii/logos/${n}.webp`),
    },
  ],
  projects_enabled: true,
  projects_tag: 'Portfólio',
  projects_title: 'Projetos em andamento',
  projects_limit: 6,
  cta_tag: 'Parceria com a EMBRAPII',
  cta_title: 'Tem um desafio de inovação?',
  cta_text: 'Fale com a nossa equipe e descubra como desenvolver um projeto em parceria com a SIF e a EMBRAPII.',
  // Fale conosco: frase abaixo do texto e botão do formulário
  form_note: 'Preencha os campos ao lado e fale conosco.',
  form_button: 'Quero uma demonstração',
};
