import React, { useState, useEffect } from 'react';
import { Save, Sprout, Briefcase, FileText, Microscope, Home as HomeIcon, Check, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import ContentSections from '../../components/admin/ContentSections';
import { API_BASE_URL } from '../../apiConfig';

const PAGE_KEY = 'produtos';
const PAGE_URL = `${API_BASE_URL}/page_content.php`;

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
  hero_badge: 'Inovação & Mercado',
  hero_title_line1: 'Produtos',
  hero_title_highlight: '& Serviços',
  hero_subtitle: 'Soluções tecnológicas integradas para o desenvolvimento sustentável da indústria florestal.',
  hero_scroll_label: '',
};

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

const SECTION_TABS = [
  { id: 'hero',      label: 'Hero',              icon: HomeIcon  },
  { id: 'comercial', label: 'Comercial',          icon: Sprout    },
  { id: 'germinar',  label: 'Programa Germinar',  icon: Briefcase },
  { id: 'boletim',   label: 'Boletim Técnico',    icon: FileText  },
  { id: 'pd',        label: 'Serviços de P&D',    icon: Microscope},
];

const CONTENT_IDS = ['comercial', 'germinar', 'boletim', 'pd'];

function mergeCfg(defaults, data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return defaults;
  return {
    ...defaults,
    ...data,
    // Arrays de seções: usa o banco só se já tiver conteúdo salvo
    germinar_sections: (data.germinar_sections?.length > 0) ? data.germinar_sections : defaults.germinar_sections,
    comercial_sections: data.comercial_sections || [],
    boletim_sections:   data.boletim_sections   || [],
    pd_sections:        data.pd_sections         || [],
  };
}

export default function ProdutosAdmin() {
  const [activeTab, setActiveTab]   = useState('hero');
  const [config, setConfig]         = useState(CONTENT_DEFAULTS);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [savedAt, setSavedAt]       = useState(null);
  const [error, setError]           = useState('');
  const [uploading, setUploading]   = useState(false);

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${PAGE_KEY}`)
      .then(r => r.json())
      .then(data => setConfig(mergeCfg(CONTENT_DEFAULTS, data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (uploading) { alert('Aguarde o upload de arquivo terminar antes de salvar.'); return; }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('page', PAGE_KEY);
      fd.append('content_json', JSON.stringify(config));
      const res  = await fetch(PAGE_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.data) setConfig(mergeCfg(CONTENT_DEFAULTS, data.data));
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
        <p className="text-sm text-gray-500 mt-3">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Página Produtos &amp; Serviços</h2>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Check size={14} /> Salvo
            </span>
          )}
          {activeTab !== 'hero' && (
            <Button onClick={handleSave} disabled={saving || uploading} isLoading={saving} variant="primary">
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {SECTION_TABS.map(t => {
            const Icon   = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  active ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Conteúdo das abas */}
      {activeTab === 'hero' && (
        <PageHeaderForm
          pageKey={PAGE_KEY}
          defaults={HERO_DEFAULTS}
          title="Cabeçalho da página /produtos-servicos"
        />
      )}

      {CONTENT_IDS.includes(activeTab) && (
        <SectionEditor
          prefix={activeTab}
          config={config}
          set={set}
          onUploading={setUploading}
        />
      )}
    </div>
  );
}

// ─── Editor de seção (título + intro + ContentSections) ────────
function SectionEditor({ prefix, config, set, onUploading }) {
  const k = (suffix) => `${prefix}_${suffix}`;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Título — parte 1"
          value={config[k('title_line1')] || ''}
          onChange={v => set(k('title_line1'), v)}
        />
        <Field
          label="Título — destaque em verde"
          value={config[k('title_highlight')] || ''}
          onChange={v => set(k('title_highlight'), v)}
        />
      </div>
      <Field
        label="Parágrafo de introdução (caixa verde)"
        type="textarea"
        rows={3}
        value={config[k('intro')] || ''}
        onChange={v => set(k('intro'), v)}
      />
      <ContentSections
        sections={config[k('sections')] || []}
        onChange={v => set(k('sections'), v)}
        onUploading={onUploading}
      />
    </div>
  );
}

// ─── Campo genérico ────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, rows = 3 }) {
  const cls = 'w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d] focus:ring-2 focus:ring-emerald-200';
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea'
        ? <textarea className={`${cls} resize-y`} rows={rows} value={value} onChange={e => onChange(e.target.value)} />
        : <input className={cls} type="text" value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}
