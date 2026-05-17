import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Sprout, Briefcase, FileText, Microscope, ArrowRight, CheckCircle2, ChevronDown, Plus, Minus } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ProdutosServicos() {
  const [activeTab, setActiveTab] = useState('comercial');
  const [expandedAccordion, setExpandedAccordion] = useState(null);
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
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Inovação & Mercado</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Produtos <br/>
              <span className="text-[#007a3d]">& Serviços</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.
          </p>
        </div>
      </div>

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
                {/* Intro Section - Standard 2 Column */}
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Setor <span className="text-[#007a3d]">Comercial</span></h2>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Visão Geral</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">
                        Oferecemos sementes de alta qualidade genética e a tecnologia Ellepot para otimização do seu viveiro, além de oportunidades exclusivas de patrocínio nos maiores eventos do setor.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Nossas Frentes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          'Sementes com melhoramento genético',
                          'Sistemas Ellepot',
                          'Patrocínios em eventos técnicos',
                          'Visibilidade de marca'
                        ].map((item, idx) => (
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

                {/* Detalhes - Accordion Genérico */}
                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">Informações Adicionais</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">Detalhes <span className="text-[#007a3d]">Comerciais</span></h3>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((num) => (
                      <div key={`comercial-${num}`} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === `comercial-${num}` ? null : `comercial-${num}`)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Tópico de Informação {num}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === `comercial-${num}` ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === `comercial-${num}` ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 mb-4"><strong>Subtítulo {num}:</strong> Descrição detalhada sobre este tópico.</p>
                            <p className="text-sm text-gray-600">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener.</p>
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
                {/* Intro Section - Standard 2 Column */}
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Programa <span className="text-[#007a3d]">Germinar</span></h2>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Formação de talentos florestais<br/>OBJETIVO GERAL</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">
                        Conectar a formação universitária à prática do setor privado, oferecendo aos estudantes a oportunidade de vivenciar a rotina das empresas, entender sua cultura organizacional e se preparar para futuras oportunidades de atuação profissional.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Objetivos Específicos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          'Preparar o futuro colaborador no final da formação acadêmica',
                          'Inserir o aluno nos processos técnicos, operacionais e culturais',
                          'Promover troca de experiências entre alunos e profissionais',
                          'Identificar talentos ainda durante a formação acadêmica',
                          'Facilitar contratações por meio do estágio',
                          'Desenvolver competências interpessoais',
                          'Atrair mão de obra qualificada',
                          'Integrar pesquisa acadêmica e prática empresarial'
                        ].map((item, idx) => (
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

                {/* Detalhes do Programa - Accordion */}
                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">Regulamento</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">Plano <span className="text-[#007a3d]">Pedagógico</span></h3>
                  </div>

                  <div className="space-y-4">
                    {/* ACCORDION 1 */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-pedagogico' ? null : 'germinar-pedagogico')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Período do Programa & Pré-requisitos</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-pedagogico' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-pedagogico' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <p className="text-sm text-gray-600 mb-8">A duração do programa depende do nível acadêmico, graduação ou pós-graduação: Mínimo: 6 meses | Máximo: 24 meses.</p>
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
                          <p className="mt-8 text-[10px] text-gray-400 italic">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener</p>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 2 */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-beneficios' ? null : 'germinar-beneficios')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Benefícios</span>
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
                                  <span className="text-base font-black text-[#1f2937]">R$ 1.500,00</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                                  <span className="text-xs font-bold uppercase text-gray-500">Mestrado</span>
                                  <span className="text-base font-black text-[#1f2937]">R$ 2.100,00</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                                  <span className="text-xs font-bold uppercase text-gray-500">Doutorado</span>
                                  <span className="text-base font-black text-[#1f2937]">R$ 3.100,00</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-8 text-[10px] text-gray-400 italic">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener</p>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 3 */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-etapas' ? null : 'germinar-etapas')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Etapas do Processo Seletivo & Avaliação</span>
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
                          <p className="text-sm text-gray-600 mb-6">Programa de formação de RH: Conjunto de ações voltadas à capacitação de Recursos Humanos para a realização de Pesquisa, Desenvolvimento e Inovação (PD&I).</p>
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
                          
                          <p className="mt-8 text-[10px] text-gray-400 italic">Reforestation is an important step restoring the environment and maintainithe balance of nature. By raising awareneand participation in reforestation program.</p>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 4 */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-direitos' ? null : 'germinar-direitos')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Direitos e Deveres</span>
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
                                  <li key={idx} className="text-xs text-gray-600 font-medium">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">2 Empresa</h5>
                              <ul className="space-y-3">
                                {['1 Designar um supervisor para acompanhamento do bolsista', '2 Garantir as condições necessária para a execução da atividade', '3 Oferecer ambiente seguro e condizente com as atividades de formação', '4 Fornecer feedback regular sobre o desempenho do bolsista'].map((item, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 font-medium">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-4">3 SIF</h5>
                              <ul className="space-y-3">
                                {['1 Coordenar e supervisionar o cumprimento das atividades previstas', '2 Oferecer suporte acadêmico aos bolsistas', '3 Zelar pela qualidade do programa e pelo cumprimento das metas pedagógicas'].map((item, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 font-medium">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </div>
                          <p className="mt-8 text-[10px] text-gray-400 italic">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener</p>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION 5 */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                      <button onClick={() => setExpandedAccordion(expandedAccordion === 'germinar-investimento' ? null : 'germinar-investimento')} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Investimento & Outros</span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === 'germinar-investimento' ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === 'germinar-investimento' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                          
                          <div className="space-y-8">
                            <div>
                              <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Investimento</h5>
                              <p className="text-sm text-gray-600 leading-relaxed">Os custos envolvem a bolsa acadêmica, alimentação, moradia, deslocamento, formação de RH, plano de saúde e seguro de vida, variando conforme o nível acadêmico (graduação, mestrado e doutorado) e as demandas da empresa parceira.</p>
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
                                <p className="text-xs text-gray-600 leading-relaxed">Fim do programa: O aluno receberá um certificado de participação emitido pela SIF/UFV em parceria com a empresa envolvida.</p>
                              </div>
                              <div>
                                <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Confidencialidade</h5>
                                <p className="text-xs text-gray-600 leading-relaxed">Inovações, produtos, relatórios ou qualquer material intelectual desenvolvido durante o Programa, serão considerados de coautoria entre aluno, orientador e empresa, salvo acordo em contrato específico.</p>
                              </div>
                            </div>

                            <div>
                                <h5 className="text-[#007a3d] font-black uppercase text-[10px] tracking-widest mb-2">Seguros e Suporte emergencial</h5>
                                <p className="text-xs text-gray-600 leading-relaxed">Os participantes do programa devem estar cobertos por seguro contra acidentes pessoais, contratado pela SIF ou pela empresa. Também é recomendada a existência de suporte médico emergencial em caso de acidentes durante o período de imersão.</p>
                            </div>
                            
                            <div>
                              <h5 className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2">Rescisão e Cancelamento</h5>
                              <p className="text-xs text-gray-500 mb-2">O desligamento do aluno poderá ocorrer nos seguintes casos:</p>
                              <ul className="flex flex-wrap gap-3">
                                {['1 Descumprimento das regras do programa', '2 Abandono das atividades', '3 Conduta inadequada ou antiética', '4 A pedido do aluno, mediante justificativa formal', '5 Por cancelamento do vínculo acadêmico com a universidade'].map((item, idx) => (
                                  <li key={idx} className="bg-red-50 px-3 py-1.5 rounded-full text-[10px] font-bold text-red-700">
                                    {item}
                                  </li>
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
                {/* Intro Section - Standard 2 Column */}
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Boletim <span className="text-[#007a3d]">Técnico SIF</span></h2>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Visão Geral</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">
                        Transmissão de conhecimento técnico e atualizações sobre o estado da arte na ciência florestal aplicada.
                      </p>
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

                {/* Detalhes - Accordion Genérico */}
                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">Informações Adicionais</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">Detalhes do <span className="text-[#007a3d]">Boletim</span></h3>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((num) => (
                      <div key={`boletim-${num}`} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === `boletim-${num}` ? null : `boletim-${num}`)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Tópico de Informação {num}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === `boletim-${num}` ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === `boletim-${num}` ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 mb-4"><strong>Subtítulo {num}:</strong> Descrição detalhada sobre este tópico.</p>
                            <p className="text-sm text-gray-600">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener.</p>
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
                {/* Intro Section - Standard 2 Column */}
                <div className="max-w-5xl mx-auto items-start">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Pesquisa & <br/><span className="text-[#007a3d]">Desenvolvimento</span></h2>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#007a3d]/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
                      <h4 className="text-sm font-black uppercase text-[#007a3d] tracking-widest mb-4">Soluções Customizadas</h4>
                      <p className="text-[#1f2937] text-base leading-relaxed font-medium">
                        Ofertamos excelência técnica em consultoria, estudos de viabilidade e desenvolvimento de novas tecnologias para toda a cadeia produtiva.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">Impacto</h4>
                      <div className="flex flex-wrap gap-12 py-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-[#007a3d] line-clamp-1">+350</span>
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Projetos Entregues</span>
                        </div>
                        <div className="w-[1px] h-16 bg-gray-200 hidden sm:block"></div>
                        <div className="flex flex-col gap-2">
                          <span className="text-4xl font-bold font-heading text-[#007a3d] line-clamp-1">+50</span>
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Doutores Envolvidos</span>
                        </div>
                      </div>
                    </div>


                  </div>
                  

                </div>

                {/* Detalhes - Accordion Genérico */}
                <div className="max-w-4xl mx-auto pt-16 border-t border-gray-100">
                  <div className="text-center mb-12">
                    <span className="text-[#007a3d] font-bold uppercase tracking-widest text-xs mb-4 block">Informações Adicionais</span>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937]">Detalhes <span className="text-[#007a3d]">P&D</span></h3>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((num) => (
                      <div key={`pd-${num}`} className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setExpandedAccordion(expandedAccordion === `pd-${num}` ? null : `pd-${num}`)} className="w-full p-6 sm:p-8 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <span className="text-lg font-bold font-heading uppercase text-[#1f2937] text-left">Tópico de Informação {num}</span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${expandedAccordion === `pd-${num}` ? 'bg-[#007a3d] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedAccordion === `pd-${num}` ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 bg-gray-50/50">
                            <p className="text-sm text-gray-600 mb-4"><strong>Subtítulo {num}:</strong> Descrição detalhada sobre este tópico.</p>
                            <p className="text-sm text-gray-600">Reforestation is an important step in restoring the environment and maintaining the balance of nature. By raising awareness and participation in reforestation programs, we can help preserve forests and combat climate change. Let's contribute to a greener.</p>
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
