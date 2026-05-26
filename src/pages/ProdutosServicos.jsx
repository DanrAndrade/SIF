import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import { Sprout, Briefcase, FileText, Microscope } from 'lucide-react';
import { usePageConfig } from '../hooks/usePageConfig';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
  hero_badge: 'Inovação & Mercado',
  hero_title_line1: 'Produtos',
  hero_title_highlight: '& Serviços',
  hero_subtitle: 'Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.',
  hero_scroll_label: 'Explorar Soluções',
};

// Conteúdo Germinar já é o texto final — pré-semeado aqui para aparecer
// assim que o admin abrir pela primeira vez, sem necessidade de redigitar.
const GERMINAR_SECTIONS_DEFAULT = [
  {
    id: 'germinar-obj',
    type: 'editor',
    title: 'Objetivos Específicos',
    content: '<ul><li>Preparar o futuro colaborador no final da formação acadêmica</li><li>Inserir o aluno nos processos técnicos, operacionais e culturais</li><li>Promover troca de experiências entre alunos e profissionais</li><li>Identificar talentos ainda durante a formação acadêmica</li><li>Facilitar contratações por meio do estágio</li><li>Desenvolver competências interpessoais</li><li>Atrair mão de obra qualificada</li><li>Integrar pesquisa acadêmica e prática empresarial</li></ul>',
  },
  {
    id: 'germinar-plano',
    type: 'tabs',
    title: 'Plano Pedagógico',
    tabs: [
      {
        title: 'Período & Pré-requisitos',
        content: '<p>A duração do programa depende do nível acadêmico, graduação ou pós-graduação: <strong>Mínimo: 6 meses | Máximo: 24 meses.</strong></p><h3>Graduação</h3><p><strong>Pré-requisitos:</strong> Ter cursado todas as disciplinas do curso.</p><p><strong>Exceção:</strong></p><ul><li>Estágio Supervisionado (ENF 498)</li><li>Trabalho de Conclusão de Curso (ENF 497/499)</li></ul><h3>Pós-Graduação</h3><p><strong>Pré-requisitos:</strong> Ter cursado todas as disciplinas do curso.</p><p><strong>Exceção:</strong></p><ul><li>Pesquisa (ENF 799)</li><li>Seminários I e II (ENF 797)</li></ul>',
      },
      {
        title: 'Benefícios',
        content: '<h3>Benefícios Gerais</h3><ul><li>Auxílio moradia</li><li>Auxílio alimentação</li><li>Deslocamento</li><li>Plano de Saúde</li><li>Seguro de Vida</li></ul><h3>Bolsa Auxílio Mensal</h3><p><strong>Graduação:</strong> R$ 1.500,00</p><p><strong>Mestrado:</strong> R$ 2.100,00</p><p><strong>Doutorado:</strong> R$ 3.100,00</p>',
      },
      {
        title: 'Etapas do Processo Seletivo',
        content: '<h3>Etapas</h3><ul><li>Análise de histórico escolar</li><li>Avaliação de currículo</li><li>Entrevista</li><li>Avaliação de perfil psicológico</li><li>Soft skills e perfil cultural</li></ul><h3>Avaliação e Acompanhamento</h3><ol><li><strong>Avaliação de Perfil:</strong> Avaliação inicial dos bolsistas com teste Disc Assessment, avaliação de personalidade, e um questionário de Soft Skills.</li><li><strong>Feedback para o Bolsista:</strong> Reunião individual com o bolsista para feedback dos resultados e levantamento dos pontos de desenvolvimento, de forma que os mesmos construam o próprio PD&amp;I.</li><li><strong>Reunião com o Gestor Responsável:</strong> Reunião de alinhamento com o Gestor Responsável pelo bolsista para definição do plano de atividades durante todo o período do estágio.</li><li><strong>Reuniões Individuais com o Bolsista:</strong> Reunião de acompanhamento do plano de atividades do bolsista, de forma a avaliar a evolução das ações, resultados e definição de novas ações quando necessário.</li><li><strong>Avaliação Final:</strong> Ao final da bolsa, o aluno passa por uma avaliação final de perfil, para traçar a evolução das soft skills trabalhadas no plano de ação.</li></ol>',
      },
      {
        title: 'Direitos e Deveres',
        content: '<h3>Bolsista</h3><ul><li>Cumprir a carga horária de 20 ou 30 horas semanais</li><li>Manter conduta ética, respeitosa e profissional durante todo o período</li><li>Apresentar relatórios de acompanhamento, quando solicitado</li><li>Zelar pelo bom uso das instalações da empresa</li><li>Manter sigilo sobre informações confidenciais</li></ul><h3>Empresa</h3><ul><li>Designar um supervisor para acompanhamento do bolsista</li><li>Garantir as condições necessárias para a execução da atividade</li><li>Oferecer ambiente seguro e condizente com as atividades de formação</li><li>Fornecer feedback regular sobre o desempenho do bolsista</li></ul><h3>SIF</h3><ul><li>Coordenar e supervisionar o cumprimento das atividades previstas</li><li>Oferecer suporte acadêmico aos bolsistas</li><li>Zelar pela qualidade do programa e pelo cumprimento das metas pedagógicas</li></ul>',
      },
      {
        title: 'Investimento & Outros',
        content: '<h3>Investimento</h3><p>Os custos envolvem a bolsa acadêmica, alimentação, moradia, deslocamento, formação de RH, plano de saúde e seguro de vida, variando conforme o nível acadêmico (graduação, mestrado e doutorado) e as demandas da empresa parceira.</p><p><strong>Forma de Pagamento:</strong></p><ul><li>1ª parcela — 50% do valor na assinatura do contrato</li><li>2ª parcela — 50% no início do sexto mês</li></ul><h3>Certificação</h3><p>Fim do programa: O aluno receberá um certificado de participação emitido pela SIF/UFV em parceria com a empresa envolvida.</p><h3>Confidencialidade</h3><p>Inovações, produtos, relatórios ou qualquer material intelectual desenvolvido durante o Programa, serão considerados de coautoria entre aluno, orientador e empresa, salvo acordo em contrato específico.</p><h3>Seguros e Suporte Emergencial</h3><p>Os participantes do programa devem estar cobertos por seguro contra acidentes pessoais, contratado pela SIF ou pela empresa. Também é recomendada a existência de suporte médico emergencial em caso de acidentes durante o período de imersão.</p><h3>Rescisão e Cancelamento</h3><p>O desligamento do aluno poderá ocorrer nos seguintes casos:</p><ul><li>Descumprimento das regras do programa</li><li>Abandono das atividades</li><li>Conduta inadequada ou antiética</li><li>A pedido do aluno, mediante justificativa formal</li><li>Por cancelamento do vínculo acadêmico com a universidade</li></ul>',
      },
    ],
  },
];

const CONTENT_DEFAULTS = {
  comercial_title_line1: 'Setor',
  comercial_title_highlight: 'Comercial',
  comercial_intro: 'Oferecemos sementes de alta qualidade genética e a tecnologia Ellepot para otimização do seu viveiro, além de oportunidades exclusivas de patrocínio nos maiores eventos do setor.',
  comercial_sections: [],

  germinar_title_line1: 'Programa',
  germinar_title_highlight: 'Germinar',
  germinar_intro: 'Conectar a formação universitária à prática do setor privado, oferecendo aos estudantes a oportunidade de vivenciar a rotina das empresas, entender sua cultura organizacional e se preparar para futuras oportunidades de atuação profissional.',
  germinar_sections: GERMINAR_SECTIONS_DEFAULT,

  boletim_title_line1: 'Boletim',
  boletim_title_highlight: 'Técnico SIF',
  boletim_intro: 'Transmissão de conhecimento técnico e atualizações sobre o estado da arte na ciência florestal aplicada.',
  boletim_sections: [],

  pd_title_line1: 'Pesquisa &',
  pd_title_highlight: 'Desenvolvimento',
  pd_intro: 'Ofertamos excelência técnica em consultoria, estudos de viabilidade e desenvolvimento de novas tecnologias para toda a cadeia produtiva florestal.',
  pd_sections: [],
};

const TABS = [
  { id: 'comercial', name: 'Comercial',         icon: Sprout },
  { id: 'germinar',  name: 'Programa Germinar', icon: Briefcase },
  { id: 'boletim',   name: 'Boletim Técnico',   icon: FileText },
  { id: 'pd',        name: 'Serviços de P&D',   icon: Microscope },
];

export default function ProdutosServicos() {
  const [activeTab, setActiveTab] = useState('comercial');
  const { config } = usePageConfig('produtos');

  // Merge: para arrays de seções, usa o banco apenas se já tiver conteúdo salvo
  const cfg = {
    ...CONTENT_DEFAULTS,
    ...config,
    germinar_sections: (config.germinar_sections?.length > 0)
      ? config.germinar_sections
      : CONTENT_DEFAULTS.germinar_sections,
    comercial_sections: config.comercial_sections || [],
    boletim_sections:   config.boletim_sections   || [],
    pd_sections:        config.pd_sections         || [],
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="produtos" defaults={HERO_DEFAULTS} scrollTargetId="produtos-content" />

      <main className="flex-grow py-24" id="produtos-content">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex flex-wrap gap-4 mb-20 border-b border-gray-100 pb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1f2937] text-white shadow-xl'
                    : 'bg-white text-gray-400 hover:text-[#007a3d] border border-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* CONTEÚDO DAS ABAS */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {TABS.map((tab) => {
              if (activeTab !== tab.id) return null;
              const titleLine1  = cfg[`${tab.id}_title_line1`];
              const titleHighlight = cfg[`${tab.id}_title_highlight`];
              const intro       = cfg[`${tab.id}_intro`];
              const sections    = cfg[`${tab.id}_sections`];

              return (
                <div key={tab.id} className="space-y-10 max-w-5xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">
                    {titleLine1}{' '}
                    <span className="text-[#007a3d]">{titleHighlight}</span>
                  </h2>

                  {intro && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium relative">{intro}</p>
                    </div>
                  )}

                  <ContentSectionsRenderer sections={sections} />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
