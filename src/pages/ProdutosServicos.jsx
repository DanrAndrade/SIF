import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import EditablePageHero from '../components/EditablePageHero';
import { Sprout, Briefcase, FileText, Microscope, ArrowRight, CheckCircle2, ChevronDown, Plus, Minus } from 'lucide-react';
import Button from '../components/ui/Button';
import { usePageConfig } from '../hooks/usePageConfig';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
  hero_badge: 'Inovação & Mercado',
  hero_title_line1: 'Produtos',
  hero_title_highlight: '& Serviços',
  hero_subtitle: 'Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.',
  hero_scroll_label: '',
};

const CONTENT_DEFAULTS = {
  // === ABA COMERCIAL ===
  comercial_title_line1: 'Setor',
  comercial_title_highlight: 'Comercial',
  comercial_overview_text: 'Oferecemos sementes de alta qualidade genética e a tecnologia Ellepot para otimização do seu viveiro, além de oportunidades exclusivas de patrocínio nos maiores eventos do setor.',
  comercial_frente_1: 'Sementes com melhoramento genético',
  comercial_frente_2: 'Sistemas Ellepot',
  comercial_frente_3: 'Patrocínios em eventos técnicos',
  comercial_frente_4: 'Visibilidade de marca',
  comercial_acc_tag: 'Informações Adicionais',
  comercial_acc_title_line1: 'Detalhes',
  comercial_acc_title_highlight: 'Comerciais',
  comercial_acc1_title: 'Tópico de Informação 1',
  comercial_acc1_body: 'Subtítulo 1: Descrição detalhada sobre este tópico.',
  comercial_acc2_title: 'Tópico de Informação 2',
  comercial_acc2_body: 'Subtítulo 2: Descrição detalhada sobre este tópico.',
  comercial_acc3_title: 'Tópico de Informação 3',
  comercial_acc3_body: 'Subtítulo 3: Descrição detalhada sobre este tópico.',

  // === ABA GERMINAR ===
  germinar_title_line1: 'Programa',
  germinar_title_highlight: 'Germinar',
  germinar_overview_subtitle: 'Formação de talentos florestais\nOBJETIVO GERAL',
  germinar_overview_text: 'Conectar a formação universitária à prática do setor privado, oferecendo aos estudantes a oportunidade de vivenciar a rotina das empresas, entender sua cultura organizacional e se preparar para futuras oportunidades de atuação profissional.',
  germinar_obj_1: 'Preparar o futuro colaborador no final da formação acadêmica',
  germinar_obj_2: 'Inserir o aluno nos processos técnicos, operacionais e culturais',
  germinar_obj_3: 'Promover troca de experiências entre alunos e profissionais',
  germinar_obj_4: 'Identificar talentos ainda durante a formação acadêmica',
  germinar_obj_5: 'Facilitar contratações por meio do estágio',
  germinar_obj_6: 'Desenvolver competências interpessoais',
  germinar_obj_7: 'Atrair mão de obra qualificada',
  germinar_obj_8: 'Integrar pesquisa acadêmica e prática empresarial',
  germinar_acc_tag: 'Regulamento',
  germinar_acc_title_line1: 'Plano',
  germinar_acc_title_highlight: 'Pedagógico',
  germinar_acc1_title: 'Período do Programa & Pré-requisitos',
  germinar_acc1_intro: 'A duração do programa depende do nível acadêmico, graduação ou pós-graduação: Mínimo: 6 meses | Máximo: 24 meses.',
  germinar_acc2_title: 'Benefícios',
  germinar_bolsa_grad: 'R$ 1.500,00',
  germinar_bolsa_mest: 'R$ 2.100,00',
  germinar_bolsa_dout: 'R$ 3.100,00',
  germinar_acc3_title: 'Etapas do Processo Seletivo & Avaliação',
  germinar_acc3_intro: 'Programa de formação de RH: Conjunto de ações voltadas à capacitação de Recursos Humanos para a realização de Pesquisa, Desenvolvimento e Inovação (PD&I).',
  germinar_acc4_title: 'Direitos e Deveres',
  germinar_acc5_title: 'Investimento & Outros',
  germinar_investimento_text: 'Os custos envolvem a bolsa acadêmica, alimentação, moradia, deslocamento, formação de RH, plano de saúde e seguro de vida, variando conforme o nível acadêmico (graduação, mestrado e doutorado) e as demandas da empresa parceira.',
  germinar_certificacao_text: 'Fim do programa: O aluno receberá um certificado de participação emitido pela SIF/UFV em parceria com a empresa envolvida.',
  germinar_confidencialidade_text: 'Inovações, produtos, relatórios ou qualquer material intelectual desenvolvido durante o Programa, serão considerados de coautoria entre aluno, orientador e empresa, salvo acordo em contrato específico.',
  germinar_seguros_text: 'Os participantes do programa devem estar cobertos por seguro contra acidentes pessoais, contratado pela SIF ou pela empresa. Também é recomendada a existência de suporte médico emergencial em caso de acidentes durante o período de imersão.',

  // === ABA BOLETIM ===
  boletim_title_line1: 'Boletim',
  boletim_title_highlight: 'Técnico SIF',
  boletim_overview_text: 'Transmissão de conhecimento técnico e atualizações sobre o estado da arte na ciência florestal aplicada.',
  boletim_acc_tag: 'Informações Adicionais',
  boletim_acc_title_line1: 'Detalhes do',
  boletim_acc_title_highlight: 'Boletim',
  boletim_acc1_title: 'Tópico de Informação 1',
  boletim_acc1_body: 'Subtítulo 1: Descrição detalhada sobre este tópico.',
  boletim_acc2_title: 'Tópico de Informação 2',
  boletim_acc2_body: 'Subtítulo 2: Descrição detalhada sobre este tópico.',
  boletim_acc3_title: 'Tópico de Informação 3',
  boletim_acc3_body: 'Subtítulo 3: Descrição detalhada sobre este tópico.',

  // === ABA P&D ===
  pd_title_line1: 'Pesquisa &',
  pd_title_highlight: 'Desenvolvimento',
  pd_overview_title: 'Soluções Customizadas',
  pd_overview_text: 'Ofertamos excelência técnica em consultoria, estudos de viabilidade e desenvolvimento de novas tecnologias para toda a cadeia produtiva.',
  pd_stat1_value: '+350',
  pd_stat1_label: 'Projetos Entregues',
  pd_stat2_value: '+50',
  pd_stat2_label: 'Doutores Envolvidos',
  pd_acc_tag: 'Informações Adicionais',
  pd_acc_title_line1: 'Detalhes',
  pd_acc_title_highlight: 'P&D',
  pd_acc1_title: 'Tópico de Informação 1',
  pd_acc1_body: 'Subtítulo 1: Descrição detalhada sobre este tópico.',
  pd_acc2_title: 'Tópico de Informação 2',
  pd_acc2_body: 'Subtítulo 2: Descrição detalhada sobre este tópico.',
  pd_acc3_title: 'Tópico de Informação 3',
  pd_acc3_body: 'Subtítulo 3: Descrição detalhada sobre este tópico.',
};

export default function ProdutosServicos() {
  const [activeTab, setActiveTab] = useState('comercial');
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const { config } = usePageConfig('produtos');
  const cfg = { ...CONTENT_DEFAULTS, ...config };

  useEffect(() => { setExpandedAccordion(null); }, [activeTab]);

  const tabs = [
    { id: 'comercial', name: 'Comercial', icon: Sprout },
    { id: 'germinar', name: 'Programa Germinar', icon: Briefcase },
    { id: 'boletim', name: 'Boletim Técnico', icon: FileText },
    { id: 'pd', name: 'Serviços de P&D', icon: Microscope },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="produtos" defaults={HERO_DEFAULTS} />

      <main className="flex-grow py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* NAVEGAÇÃO DE ABAS */}
          <div className="flex flex-wrap gap-4 mb-20 border-b border-gray-100 pb-8">
            {tabs.map((tab) => (
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

            {/* =========================================
                ABA: COMERCIAL
            ========================================= */}
            {activeTab === 'comercial' && (
              <div className="space-y-16">
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">
                      {cfg.comercial_title_line1} <span className="text-[#007a3d]">{cfg.comercial_title_highlight}</span>
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Visão Geral</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">{cfg.comercial_overview_text}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Nossas Frentes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[cfg.comercial_frente_1, cfg.comercial_frente_2, cfg.comercial_frente_3, cfg.comercial_frente_4].filter(Boolean).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#007a3d]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[#007a3d] text-[10px] font-black">{idx + 1}</span>
                            </div>
                            <span className="text-gray-600 text-xs font-medium leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">{cfg.comercial_acc_tag}</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">
                      {cfg.comercial_acc_title_line1} <span className="text-[#007a3d]">{cfg.comercial_acc_title_highlight}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'comercial-1', title: cfg.comercial_acc1_title, body: cfg.comercial_acc1_body },
                      { id: 'comercial-2', title: cfg.comercial_acc2_title, body: cfg.comercial_acc2_body },
                      { id: 'comercial-3', title: cfg.comercial_acc3_title, body: cfg.comercial_acc3_body },
                    ].map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{item.title}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === item.id ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 whitespace-pre-line">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                ABA: GERMINAR
            ========================================= */}
            {activeTab === 'germinar' && (
              <div className="space-y-16">
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">
                      {cfg.germinar_title_line1} <span className="text-[#007a3d]">{cfg.germinar_title_highlight}</span>
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4 whitespace-pre-line">{cfg.germinar_overview_subtitle}</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">{cfg.germinar_overview_text}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Objetivos Específicos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          cfg.germinar_obj_1, cfg.germinar_obj_2, cfg.germinar_obj_3, cfg.germinar_obj_4,
                          cfg.germinar_obj_5, cfg.germinar_obj_6, cfg.germinar_obj_7, cfg.germinar_obj_8,
                        ].filter(Boolean).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#007a3d]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[#007a3d] text-[10px] font-black">{idx + 1}</span>
                            </div>
                            <span className="text-gray-600 text-xs font-medium leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">{cfg.germinar_acc_tag}</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">
                      {cfg.germinar_acc_title_line1} <span className="text-[#007a3d]">{cfg.germinar_acc_title_highlight}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* ACCORDION 1: Período & Pré-requisitos */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-pedagogico' ? null : 'germinar-pedagogico')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{cfg.germinar_acc1_title}</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-pedagogico' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-pedagogico' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <p className="text-sm text-gray-600 mb-8">{cfg.germinar_acc1_intro}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">Graduação</h5>
                              <p className="text-sm text-gray-600 mb-2"><strong>Pré-requisitos:</strong> Ter cursado todas as disciplinas do curso.</p>
                              <p className="text-sm text-gray-600"><strong>Exceção:</strong><br/>● Estágio Supervisionado (ENF 498)<br/>● Trabalho de Conclusão de Curso (ENF 497/499)</p>
                            </div>
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">Pós-Graduação</h5>
                              <p className="text-sm text-gray-600 mb-2"><strong>Pré-requisitos:</strong> Ter cursado todas as disciplinas do curso.</p>
                              <p className="text-sm text-gray-600"><strong>Exceção:</strong><br/>● Pesquisa (ENF 799)<br/>● Seminários I e II (ENF 797)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 2: Benefícios */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-beneficios' ? null : 'germinar-beneficios')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{cfg.germinar_acc2_title}</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-beneficios' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-beneficios' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-6">Benefícios Gerais</h5>
                              <ul className="space-y-3">
                                {['Auxílio moradia', 'Auxílio alimentação', 'Deslocamento', 'Plano de Saúde', 'Seguro de Vida'].map((b, i) => (
                                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <span className="w-5 h-5 rounded-full bg-[#007a3d]/10 flex items-center justify-center shrink-0">
                                      <span className="text-[#007a3d] text-[10px] font-black">{i + 2}</span>
                                    </span>
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-6">Bolsa Auxílio Mensal</h5>
                              <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                                  <span className="text-xs font-bold uppercase text-gray-500">Graduação</span>
                                  <span className="text-base font-black text-[#1f2937]">{cfg.germinar_bolsa_grad}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                                  <span className="text-xs font-bold uppercase text-gray-500">Mestrado</span>
                                  <span className="text-base font-black text-[#1f2937]">{cfg.germinar_bolsa_mest}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                                  <span className="text-xs font-bold uppercase text-gray-500">Doutorado</span>
                                  <span className="text-base font-black text-[#1f2937]">{cfg.germinar_bolsa_dout}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 3: Etapas */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-etapas' ? null : 'germinar-etapas')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{cfg.germinar_acc3_title}</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-etapas' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-etapas' ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-6 mt-4">Etapas do Processo Seletivo</h5>
                          <div className="flex flex-wrap gap-3 mb-10">
                            {['Análise de histórico escolar', 'Avaliação de currículo', 'Entrevista', 'Avaliação de perfil psicológico', 'soft skills e perfil cultural'].map((etapa, idx) => (
                              <span key={idx} className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-500 shadow-sm">{etapa}</span>
                            ))}
                          </div>

                          <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-6">Avaliação e Acompanhamento</h5>
                          <p className="text-sm text-gray-600 mb-6">{cfg.germinar_acc3_intro}</p>
                          <div className="space-y-6">
                            {[
                              { title: '1 AVALIAÇÃO DE PERFIL', desc: 'Avaliação inicial dos bolsistas com teste Disc Assessment, avaliação de personalidade, e um questionário de Soft Skills.' },
                              { title: '2 FEEDBACK PARA O BOLSISTA', desc: 'Reunião individual com o bolsista para feedback dos resultados e levantamento dos pontos de desenvolvimento, de forma que os mesmos construam o próprio PD&I.' },
                              { title: '3 REUNIÃO COM O GESTOR RESPONSÁVEL', desc: 'Reunião de alinhamento com o Gestor Responsável pelo bolsista para definição do plano de atividades durante todo o período do estágio.' },
                              { title: '4 REUNIÕES INDIVIDUAIS COM O BOLSISTA', desc: 'Reunião de acompanhamento do plano de atividades do bolsista, de forma a avaliar a evolução das ações, resultados e definição de novas ações quando necessário.' },
                              { title: '5 AVALIAÇÃO FINAL', desc: 'Ao final da bolsa, o aluno passa por uma avaliação final de perfil, para traçar a evolução das soft skills trabalhadas no plano de ação.' }
                            ].map((item, idx) => (
                              <div key={idx} className="flex gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div>
                                  <h6 className="text-sm font-black uppercase text-[#1f2937] mb-2">{item.title}</h6>
                                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 4: Direitos e Deveres */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-direitos' ? null : 'germinar-direitos')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{cfg.germinar_acc4_title}</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-direitos' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-direitos' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">1 Bolsista</h5>
                              <ul className="space-y-3">
                                {['1 Cumprir a carga horária de 20 ou 30 horas semanais', '2 Manter conduta ética, respeitosa e profissional durante todo o período', '3 Apresentar relatórios de acompanhamento, quando solicitado', '4 Zelar pelo bom uso das instalações da empresa', '5 Manter sigilo sobre informações confidenciais'].map((item, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 font-medium">{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">2 Empresa</h5>
                              <ul className="space-y-3">
                                {['1 Designar um supervisor para acompanhamento do bolsista', '2 Garantir as condições necessária para a execução da atividade', '3 Oferecer ambiente seguro e condizente com as atividades de formação', '4 Fornecer feedback regular sobre o desempenho do bolsista'].map((item, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 font-medium">{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">3 SIF</h5>
                              <ul className="space-y-3">
                                {['1 Coordenar e supervisionar o cumprimento das atividades previstas', '2 Oferecer suporte acadêmico aos bolsistas', '3 Zelar pela qualidade do programa e pelo cumprimento das metas pedagógicas'].map((item, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 font-medium">{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 5: Investimento */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-investimento' ? null : 'germinar-investimento')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{cfg.germinar_acc5_title}</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-investimento' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-investimento' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <div className="space-y-8">
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Investimento</h5>
                              <p className="text-sm text-gray-600 leading-relaxed">{cfg.germinar_investimento_text}</p>
                              <div className="mt-4">
                                <span className="text-xs font-bold uppercase text-gray-500 block mb-2">Forma de Pagamento</span>
                                <div className="flex gap-4">
                                  <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 shadow-sm">1ª parcela - 50% do valor na assinatura do contrato</span>
                                  <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 shadow-sm">2ª parcela - 50% no início do sexto mês</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Certificação</h5>
                                <p className="text-xs text-gray-600 leading-relaxed">{cfg.germinar_certificacao_text}</p>
                              </div>
                              <div>
                                <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Confidencialidade</h5>
                                <p className="text-xs text-gray-600 leading-relaxed">{cfg.germinar_confidencialidade_text}</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Seguros e Suporte emergencial</h5>
                              <p className="text-xs text-gray-600 leading-relaxed">{cfg.germinar_seguros_text}</p>
                            </div>
                            <div>
                              <h5 className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2">Rescisão e Cancelamento</h5>
                              <p className="text-xs text-gray-500 mb-2">O desligamento do aluno poderá ocorrer nos seguintes casos:</p>
                              <ul className="flex flex-wrap gap-3">
                                {['1 Descumprimento das regras do programa', '2 Abandono das atividades', '3 Conduta inadequada ou antiética', '4 A pedido do aluno, mediante justificativa formal', '5 Por cancelamento do vínculo acadêmico com a universidade'].map((item, idx) => (
                                  <li key={idx} className="bg-red-50 px-3 py-1.5 rounded-full text-[10px] font-bold text-red-700">{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                ABA: BOLETIM
            ========================================= */}
            {activeTab === 'boletim' && (
              <div className="space-y-16">
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">
                      {cfg.boletim_title_line1} <span className="text-[#007a3d]">{cfg.boletim_title_highlight}</span>
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Visão Geral</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">{cfg.boletim_overview_text}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Arquivos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { year: '2024', issues: '04 Edições', color: 'bg-emerald-50' },
                          { year: '2023', issues: '12 Edições', color: 'bg-white' }
                        ].map((item) => (
                          <div key={item.year} className={`${item.color} p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{item.issues}</span>
                            <h4 className="text-3xl font-bold text-[#1f2937] font-heading mb-6">{item.year}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">{cfg.boletim_acc_tag}</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">
                      {cfg.boletim_acc_title_line1} <span className="text-[#007a3d]">{cfg.boletim_acc_title_highlight}</span>
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 'boletim-1', title: cfg.boletim_acc1_title, body: cfg.boletim_acc1_body },
                      { id: 'boletim-2', title: cfg.boletim_acc2_title, body: cfg.boletim_acc2_body },
                      { id: 'boletim-3', title: cfg.boletim_acc3_title, body: cfg.boletim_acc3_body },
                    ].map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{item.title}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === item.id ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 whitespace-pre-line">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                ABA: P&D
            ========================================= */}
            {activeTab === 'pd' && (
              <div className="space-y-16">
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">
                      {cfg.pd_title_line1} <br/><span className="text-[#007a3d]">{cfg.pd_title_highlight}</span>
                    </h2>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">{cfg.pd_overview_title}</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">{cfg.pd_overview_text}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Impacto</h4>
                      <div className="flex flex-wrap gap-12 py-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-[#007a3d] line-clamp-1">{cfg.pd_stat1_value}</span>
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">{cfg.pd_stat1_label}</span>
                        </div>
                        <div className="w-[1px] h-16 bg-gray-200 hidden sm:block"></div>
                        <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-[#007a3d] line-clamp-1">{cfg.pd_stat2_value}</span>
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">{cfg.pd_stat2_label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">{cfg.pd_acc_tag}</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">
                      {cfg.pd_acc_title_line1} <span className="text-[#007a3d]">{cfg.pd_acc_title_highlight}</span>
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 'pd-1', title: cfg.pd_acc1_title, body: cfg.pd_acc1_body },
                      { id: 'pd-2', title: cfg.pd_acc2_title, body: cfg.pd_acc2_body },
                      { id: 'pd-3', title: cfg.pd_acc3_title, body: cfg.pd_acc3_body },
                    ].map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">{item.title}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === item.id ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 whitespace-pre-line">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
