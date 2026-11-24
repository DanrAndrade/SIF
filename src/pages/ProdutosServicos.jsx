import React, { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import ContentSectionsRenderer from '../components/ContentSectionsRenderer';
import { Sprout, Briefcase, FileText, Microscope, ArrowRight, ArrowLeft, Download, Search, X } from 'lucide-react';
import { usePageConfig } from '../hooks/usePageConfig';
import { getImageUrl } from '../apiConfig';
import { PRODUTOS_TEXTS, withTexts } from '../utils/pageTextDefaults';
import { buttonClass, BtnArrow } from '../components/ui/Button';

const HERO_DEFAULTS = {
  hero_image: '',
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
  germinar_card_tag: 'Oportunidades',
  germinar_card_title: 'Conheça as vagas do',
  germinar_card_highlight: 'Programa Germinar',
  germinar_card_text: 'Estamos sempre buscando novos talentos. Veja todas as vagas abertas e como se candidatar.',
  germinar_card_btn: 'Ver vagas abertas',
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

const BOLETINS_POR_PAGINA = 9;

// Busca sem diferenciar maiúsculas e acentos ("protecao" acha "Proteção")
const semAcento = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function BoletimGrid({ pdfs: all, legacySections, tag = 'Boletim Técnico', searchPlaceholder = 'Buscar boletim pelo título' }) {
  // Só boletins com PDF (cadastro vazio no painel não vira card em branco)
  const allPdfs = (all || []).filter(p => p && p.pdf_url);
  const [query, setQuery] = useState('');
  const q = semAcento(query.trim());
  const pdfs = q ? allPdfs.filter(p => semAcento(p.title).includes(q)) : allPdfs;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [q]);
  const topRef = useRef(null);
  const totalPages = Math.max(1, Math.ceil(pdfs.length / BOLETINS_POR_PAGINA));
  const current = Math.min(page, totalPages);
  const visible = pdfs.slice((current - 1) * BOLETINS_POR_PAGINA, current * BOLETINS_POR_PAGINA);
  const goToPage = (n) => {
    setPage(n);
    const el = topRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 140, behavior: 'smooth' });
  };

  // Se ainda não houver PDFs novos publicados mas existir conteúdo legado
  // (boletim_sections antigo), mostra o legado pra não perder publicação.
  if (allPdfs.length === 0) {
    if (Array.isArray(legacySections) && legacySections.length > 0) {
      return <ContentSectionsRenderer sections={legacySections} />;
    }
    return (
      <p className="text-gray-400 text-sm italic text-center py-12">
        Nenhum boletim publicado ainda.
      </p>
    );
  }

  return (
    <div ref={topRef}>
    {/* Busca pelo título */}
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
      <label className="relative flex-1 max-w-xl">
        <span className="sr-only">Buscar boletim</span>
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder}
          className="w-full rounded-full border border-gray-200 bg-white pl-11 pr-11 py-3 text-[15px] text-[#1f2937] placeholder:text-gray-400 outline-none focus:border-[#007a3d] focus:ring-2 focus:ring-[#007a3d]/15 transition" />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1f2937] hover:bg-gray-100">
            <X size={15} />
          </button>
        )}
      </label>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 tabular-nums" aria-live="polite">
        {pdfs.length} {pdfs.length === 1 ? 'boletim' : 'boletins'}
      </span>
    </div>
    {pdfs.length === 0 && (
      <p className="text-gray-500 text-center py-12">Nenhum boletim encontrado para "{query.trim()}".</p>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.map((p, i) => (
        <a
          key={p.id || i}
          href={getImageUrl(p.pdf_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-card overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
        >
          {p.cover_url ? (
            <div className="h-48 bg-gray-100 overflow-hidden">
              <img
                src={getImageUrl(p.cover_url, 640)}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
              <FileText size={48} className="text-[#007a3d]/40" />
            </div>
          )}
          <div className="p-6 flex flex-col flex-grow">
            {tag && <span className="text-[9px] font-black uppercase tracking-widest text-[#007a3d] mb-2">{tag}</span>}
            <h3 className="text-base font-semibold font-heading text-[#1f2937] leading-tight mb-4 group-hover:text-[#007a3d] transition-colors flex-grow">
              {p.title || 'Boletim sem título'}
            </h3>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Abrir PDF</span>
              <Download size={16} className="text-[#007a3d] group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </a>
      ))}
    </div>
    {totalPages > 1 && (
      <nav className="mt-14 flex items-center justify-center gap-6" aria-label="Paginação dos boletins">
        <button type="button" onClick={() => goToPage(current - 1)} disabled={current === 1} aria-label="Página anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-sif-ink/15 text-sif-ink transition-all duration-300 hover:border-sif-dark hover:bg-sif-dark hover:text-white disabled:pointer-events-none disabled:opacity-30">
          <ArrowLeft size={18} />
        </button>
        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-sif-ink/70 tabular-nums">
          {current} <span className="text-gray-400">de</span> {totalPages}
        </span>
        <button type="button" onClick={() => goToPage(current + 1)} disabled={current === totalPages} aria-label="Próxima página"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-sif-ink/15 text-sif-ink transition-all duration-300 hover:border-sif-dark hover:bg-sif-dark hover:text-white disabled:pointer-events-none disabled:opacity-30">
          <ArrowRight size={18} />
        </button>
      </nav>
    )}
    </div>
  );
}

export default function ProdutosServicos() {
  usePageTitle('Produtos e Serviços'); // título da aba do navegador / Google
  const location = useLocation();
  const navigate = useNavigate();
  const tabFromUrl = () => {
    const a = new URLSearchParams(location.search).get('aba');
    return TABS.some(t => t.id === a) ? a : 'comercial';
  };
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  // Link do menu (?aba=...): troca a aba e leva até o conteúdo
  useEffect(() => {
    const a = new URLSearchParams(location.search).get('aba');
    if (!a || !TABS.some(t => t.id === a)) return;
    setActiveTabState(a);
    if (!location.hash) {
      const t = setTimeout(() => {
        const el = document.getElementById('produtos-content');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [location.search, location.hash]);
  // Clique numa aba: o endereço acompanha (dá para copiar e mandar o link da aba)
  const setActiveTab = (id) => {
    setActiveTabState(id);
    navigate({ pathname: location.pathname, search: `?aba=${id}` }, { replace: true });
  };
  const { config } = usePageConfig('produtos');

  // Merge: para arrays de seções, usa o banco apenas se já tiver conteúdo salvo
  const cfg = {
    ...CONTENT_DEFAULTS,
    ...config,
    germinar_sections: Array.isArray(config.germinar_sections)
      ? config.germinar_sections
      : CONTENT_DEFAULTS.germinar_sections,
    comercial_sections: config.comercial_sections || [],
    boletim_sections:   config.boletim_sections   || [],
    boletim_pdfs:       Array.isArray(config.boletim_pdfs) ? config.boletim_pdfs : [],
    pd_sections:        config.pd_sections         || [],
  };

  const pt = withTexts(PRODUTOS_TEXTS, config); // Painel › Produtos e serviços › Textos da página
  const tabName = (tab) => pt[`tab_${tab.id}`] || tab.name;
  // Aba aberta: título e apresentação
  const current = TABS.find(t => t.id === activeTab);
  const tabTitle1 = current ? cfg[`${current.id}_title_line1`] : '';
  const tabTitle2 = current ? cfg[`${current.id}_title_highlight`] : '';
  const tabIntro = current ? cfg[`${current.id}_intro`] : '';

  return (
    <div className="sif-page min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="produtos" defaults={HERO_DEFAULTS} scrollTargetId="produtos-content" />

      <main className="flex-grow pt-14 md:pt-24 pb-8 md:pb-12" id="produtos-content">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* NAVEGAÇÃO DE ABAS: mesmo padrão das abas da equipe (sublinhado verde).
              No celular ficam numa linha que desliza para o lado. */}
          <div className="-mx-6 px-6 mb-12 md:mb-20 overflow-x-auto no-scrollbar">
            <div className="flex gap-x-7 border-b border-gray-200 min-w-max" role="tablist" aria-label="Produtos e serviços">
              {TABS.map((tab) => {
                const on = activeTab === tab.id;
                return (
                  <button key={tab.id} type="button" role="tab" aria-selected={on} onClick={() => setActiveTab(tab.id)}
                    className={`relative shrink-0 flex items-center gap-2 pt-2 pb-3.5 text-sm font-semibold transition-colors ${on ? 'text-[#1f2937]' : 'text-gray-400 hover:text-gray-600'}`}>
                    <tab.icon size={16} className={on ? 'text-[#007a3d]' : ''} />
                    {tabName(tab)}
                    <span className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#007a3d] transition-transform duration-300 origin-left ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ABERTURA DA ABA: mesmo desenho do "Sobre" dos eventos e treinamentos
              (título à esquerda, apresentação à direita) */}
          {current && (
            <div key={current.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
              <div className={tabIntro ? 'lg:col-span-5' : 'lg:col-span-12'}>
                <span className="sif-eyebrow mb-4">{tabName(current)}</span>
                <h2 className="sif-title sif-h2 text-[#1f2937] tracking-tight">
                  {tabTitle1}{' '}
                  <span className="text-[#007a3d]">{tabTitle2}</span>
                </h2>
                <span className="hidden lg:block mt-8 h-px w-16 bg-sif-green/40" aria-hidden="true" />
              </div>
              {tabIntro && (
                <div className="lg:col-span-7 min-w-0">
                  <p className="text-xl leading-relaxed text-gray-700 whitespace-pre-line">{tabIntro}</p>
                </div>
              )}
            </div>
          )}

          {/* Boletim: grade com paginação, na largura da página */}
          {current?.id === 'boletim' && (
            <div className="max-w-6xl mx-auto mt-12 md:mt-16">
              <BoletimGrid pdfs={cfg.boletim_pdfs} legacySections={cfg.boletim_sections} tag={pt.boletim_card_tag} searchPlaceholder={pt.boletim_search_placeholder} />
            </div>
          )}
        </div>

        {/* Demais abas: blocos em faixas de largura total, no mesmo modelo dos
            Grupos Temáticos e eventos (fundo de cada faixa escolhido no painel) */}
        {current && current.id !== 'boletim' && (
          <div key={current.id} className="mt-6 md:mt-10">
            <ContentSectionsRenderer sections={cfg[`${current.id}_sections`]} layout="page" bgPhoto={cfg.hero_image ? getImageUrl(cfg.hero_image, 1600) : ''} />
          </div>
        )}
      </main>

      {/* ── CARD GERMINAR: sempre visível no final, leva para Trabalhe Conosco ── */}
      <section className="pb-14 md:pb-24 bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="relative overflow-hidden rounded-panel bg-gradient-to-br from-[#007a3d] via-[#1a3d20] to-[#0f1f11] p-10 md:p-16 shadow-xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#7FBA00]/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#007a3d]/40 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 text-center md:text-left">
                {/* textos editáveis em Painel › Produtos e serviços › aba Germinar */}
                {cfg.germinar_card_tag && <span className="block text-xs font-bold uppercase tracking-[0.25em] text-sif-lime mb-5">{cfg.germinar_card_tag}</span>}
                <h2 className="sif-title sif-h2 text-white tracking-tighter leading-[0.95] mb-4">
                  {cfg.germinar_card_title} {cfg.germinar_card_highlight && <span className="text-[#7FBA00]">{cfg.germinar_card_highlight}</span>}
                </h2>
                {cfg.germinar_card_text && <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-medium">{cfg.germinar_card_text}</p>}
              </div>
              <Link
                to={pt.germinar_card_btn_link || '/trabalhe-conosco'}
                className={`${buttonClass('light', 'lg')} flex-shrink-0`}
              >
                <span className="py-2">{cfg.germinar_card_btn || 'Ver vagas abertas'}</span>
                <BtnArrow variant="light" size="lg" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
