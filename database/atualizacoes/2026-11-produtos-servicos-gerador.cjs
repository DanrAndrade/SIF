// Monta o conteúdo novo de Produtos e Serviços a partir do que está no ar
// (produtos_live.json) + apresentações enviadas pela SIF em 19/11/2026.
// Saída: produtos_novo.json (só as chaves que mudam).
const fs = require('fs');
const live = JSON.parse(fs.readFileSync(__dirname + '/produtos_live.json', 'utf8'));
const IMG = (n) => `uploads/pages/produtos/slides/${n}.webp`;
const ul = (items) => '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
const table = (head, rows, foot) => `<div class="sif-table-wrap" contenteditable="false"><table class="sif-table"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>${foot ? `<tfoot><tr>${foot.map(c => `<td>${c}</td>`).join('')}</tr></tfoot>` : ''}</table></div>`;
let n = 0; const id = (p) => `prod-${p}-${++n}`;

const tabC = Object.fromEntries((live.comercial_sections[0].tabs || []).map(t => [t.title, t.content]));
const editorFinal = live.comercial_sections[1]; // "Não perca tempo..." (conteúdo original da SIF)

// ── COMERCIAL ─────────────────────────────────────────────────────────
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Anual'];
const clima = [
  ['Zacapa', 'Finca los Cocos', '120 m', [[30.9,32.6,35.3,36,35.5,35.5,32.7,33.4,32.9,31.9,31.3,30.5,33.2],[25,26.2,28.3,29.2,29.1,27.7,27.1,27.4,27.2,26.5,25.9,25.2,27.1],[19.2,19.9,21.3,22.4,22.7,21.9,21.6,21.5,21.6,21.2,20.5,19.9,21.1],[1,2,4,13,59,143,117,103,147,69,17,2,677]]],
  ['Monterrey', '', '1.500 m', [[30,32.1,32,33.9,33.9,31.2,29.1,30.2,29.8,28.6,29.9,28.8,30.8],[24.3,25.8,26.8,27.8,27.1,25.8,25.4,25.5,25.1,24.7,24.2,23.9,25.5],[13.2,13.6,14.6,16,16.8,16.8,16.3,16.5,16.4,16,14.7,13.7,15.4],[2.8,5.4,6,31,128.9,271.8,202.6,202.7,236.6,131.6,48.8,6.6,1275]]],
  ['Finca Retana', '', '1.475 m', [[22.5,23.4,24.7,25,24.7,23.6,23.5,23.8,23.1,22.7,22.8,22.3,23.5],[16.6,17.2,18.3,19.1,19.5,19.4,19,19,18.7,18.3,17.7,16.8,18.3],[10.8,11.1,11.9,13.3,14.3,15.3,14.6,14.3,14.4,13.9,12.7,11.3,13.2],[1,3,4,25,118,231,170,141,220,131,16,5,1065]]],
  ['Pastores', 'Finca Siguampar', '1.800 m', [[22,23,24,25,24,23,23,23,22,22,22,22,22.9],[16,16,18,19,19,18,18,18,18,17,16,16,17.4],[11,11,12,14,15,15,14,15,15,14,13,12,13.4],[2.7,2.8,8.3,29.9,99.2,178.2,146.9,158.8,185.6,126.9,39.6,7.1,986]]],
  ['Pueblos Nuevos Viña', 'Finca Nueva Jerusalen', '1.270 m', [[28.5,29,30,30.1,29.6,28.4,29.2,29,28,28.4,28.1,28.1,28.9],[22.6,23.1,24,24.7,24.6,24.1,24.5,24.3,23.7,23.7,22.9,22.6,23.7],[16.8,17.2,18.1,19.3,19.7,19.8,19.8,19.6,19.5,19,17.8,17.1,18.6],[2,3,11,48,189,300,232,218,284,190,36,8,1521]]],
];
const br = (v) => String(v).replace('.', ',');
const climaTabs = clima.map(([local, finca, alt, [max, med, min, pre]]) => ({
  title: local,
  content: `<p><strong>${local}${finca ? ` · ${finca}` : ''}</strong> · altitude ${alt}</p>` +
    table(['Mês', ...MESES], [['Temp. máx. (°C)', ...max.map(br)], ['Temp. média (°C)', ...med.map(br)], ['Temp. mín. (°C)', ...min.map(br)], ['Precipitação (mm)', ...pre.map(br)]]),
}));

const comercial = [
  // Sementes
  { id: id('sementes'), type: 'text_image', nav_label: 'Sementes', eyebrow: 'Venda de sementes', title: 'Sementes SIF | Deforsa', image: IMG('sementes-dossel-eucalipto'), image_side: 'right',
    content: '<h3>Seu programa de melhoramento pode ir além!</h3><p>Nossas sementes, resultado da parceria SIF e Deforsa, são originárias da Guatemala (América Central). Foram coletadas de matrizes-elite, selecionadas com critérios rigorosos de volume, tolerância a doenças e pragas, e adaptabilidade a diversas condições climáticas.</p><p>Com 368 progênies de 6 espécies estratégicas, a parceria SIF &amp; Deforsa amplia a variabilidade genética e fortalece o potencial de ganhos reais em produtividade, adaptação e qualidade no campo.</p><p>Traga variabilidade genética para o seu programa de melhoramento genético com sementes SIF.</p>' },
  { id: id('sementes'), type: 'cards', title: 'Por que escolher as Sementes SIF', items: [
    { title: 'Variabilidade genética', subtitle: '368 progênies de 6 espécies', text: 'Acesso a sementes de novas progênies e de 6 espécies estratégicas para ampliar a base genética do seu programa.' },
    { title: 'Materiais exclusivos', subtitle: 'Parceria com a Deforsa', text: 'Acesso a materiais genéticos estratégicos e exclusivos e ao programa de melhoramento robusto da empresa Deforsa.' },
    { title: 'Alta qualidade', subtitle: 'Beneficiamento e germinação', text: 'Alto grau de beneficiamento e qualidade, com alta taxa de germinação.' },
    { title: 'Armazenamento', subtitle: 'Laboratório de Sementes da UFV', text: 'As sementes ficam armazenadas em câmara fria no Laboratório de Sementes da UFV.' },
    { title: 'Logística rápida', subtitle: 'Envio em 24 horas', text: 'Processamento e envio das sementes em 24 horas, com logística rápida e eficiente.' },
    { title: 'Banco de dados', subtitle: 'Informações climáticas e genéticas', text: 'Banco de dados com as informações climáticas e genéticas dos materiais.' },
  ] },
  { id: id('sementes'), type: 'editor', title: 'Espécies e progênies',
    content: '<p>As sementes, originárias da Guatemala (América Central), estão divididas em 6 espécies, totalizando 368 progênies:</p>' +
      table(['Espécies', 'Progênies'], [['E. urophylla', '168'], ['E. camaldulensis', '134'], ['E. grandis', '53'], ['E. robusta', '6'], ['E. pellita', '6'], ['C. torelliana', '1']], ['6', '368']) },
  { id: id('sementes'), type: 'tabs', title: 'Dados climáticos dos locais de coleta', tabs: climaTabs },
  { id: id('sementes'), type: 'stats', title: 'Valor comercial', items: [
    { value: '$100', label: 'por 5 g de sementes Deforsa' },
    { value: '300', label: 'mudas, em média, com 5 g' },
    { value: '-5 g', label: 'também comercializamos quantidades inferiores a 5 g' },
  ] },
  { id: id('sementes'), type: 'logos', title: 'Empresas que já adquiriram nossas sementes', images: ['arborgen', 'paracel', 'suzano', 'bracell', 'cmpc', 'amcel', 'klabin', 'eldorado'].map(l => ({ url: IMG('logo-' + l), alt: l })) },
  { id: id('sementes'), type: 'cta', title: 'Aumente a variabilidade genética do seu programa',
    text: 'Assim como essas empresas, eleve seus resultados em campo com as sementes da SIF, em parceria de exclusividade com a Deforsa. Fale com Camila Paixão, Coordenadora de Produtos e Serviços: (31) 97127-3863 · coordenacao.produtos@sif.org.br',
    btn_label: 'Falar pelo WhatsApp', btn_link: 'https://wa.me/5531971273863' },

  // Tubetes Ellepot
  { id: id('tubetes'), type: 'text_image', nav_label: 'Tubetes Biodegradáveis', eyebrow: 'Inovação sustentável', title: 'Tubetes biodegradáveis Ellepot', image: IMG('ellepot-tubetes-esteira'), image_side: 'left',
    content: '<p>A SIF desenvolveu uma parceria com a empresa Ellepot e tem em sua unidade uma máquina de produção pronta para oferecer ao seu empreendimento os benefícios das embalagens biodegradáveis e a qualidade e confiabilidade que a marca Ellepot oferece.</p><p>Nosso compromisso é oferecer uma tecnologia que vem ganhando espaço no mercado e disponibilizar qualidade na produção de mudas. <strong>Queremos ser a sua parceira na produção de mudas mais sustentáveis.</strong></p>' },
  { id: id('tubetes'), type: 'stats', eyebrow: 'Fonte: Ellepot®', title: 'Ellepot pelo mundo', items: [
    { value: '6', label: 'continentes' }, { value: '130', label: 'países' }, { value: '10 bilhões', label: 'de unidades produzidas por ano' },
  ] },
  { id: id('tubetes'), type: 'highlights', title: 'Vantagens da tecnologia Ellepot', items: [
    { title: 'Sustentabilidade', text: 'Redução de 100% do resíduo plástico e dos desperdícios.', image: IMG('ellepot-dossel-eucalipto') },
    { title: 'Redução de custo', text: 'Redução de até 30% em mão de obra no plantio.', image: IMG('ellepot-mudas-viveiro') },
    { title: 'Eficiência operacional', text: 'Eliminação de etapas, agilidade na produção e personalização exclusiva.', image: IMG('ellepot-tubetes-comparativo-viveiro') },
    { title: 'Qualidade de mudas', text: 'Aumento de 25% na sobrevivência das mudas no campo e melhoria do sistema radicular.', image: IMG('ellepot-muda-na-mao') },
  ] },
  { id: id('tubetes'), type: 'editor', title: 'Tubete plástico x tubete Ellepot',
    content: (tabC['Tubetes Biodegradáveis Ellepots'] || '').replace(/<p[^>]*>\s*Entre em contato[\s\S]*$/i, '') +
      table(['', 'Tubete de plástico', 'Tubete Ellepot biodegradável'], [
        ['Impacto ambiental', 'Gera resíduos plásticos persistentes (não degradáveis)', 'Degrada-se no solo em curto prazo, reduzindo a poluição'],
        ['Custos operacionais', 'Exige retorno, desinfecção, reposição e armazenamento', 'Elimina custos com retorno, desinfecção, logística reversa e armazenamento'],
        ['Eficiência no plantio', 'Necessidade de remoção antes do plantio', 'Plantio direto com o tubete'],
      ]) },
  { id: id('tubetes'), type: 'stats', eyebrow: 'Fonte: Ellepot®', title: 'Estudos e resultados', items: [
    { value: '+350%', label: 'de crescimento em raízes secundárias' },
    { value: '+35%', label: 'de crescimento na altura das plantas' },
    { value: '-40%', label: 'nos custos com logística' },
    { value: '+40%', label: 'de rapidez nos plantios' },
  ] },
  { id: id('tubetes'), type: 'cards', title: 'Personalização e exclusividade', items: [
    { title: 'Substrato', subtitle: 'Carolina Soil', text: 'Substrato de qualidade para a formação das mudas.' },
    { title: 'Adubação', subtitle: 'Osmocote + Supersimples', text: 'Adubação adequada ao desenvolvimento das mudas.' },
    { title: 'Alturas', subtitle: '10, 12, 20 e 24 cm', text: 'Tubetes nas alturas de 10 cm, 12 cm, 20 cm e 24 cm.' },
    { title: 'Diâmetros', subtitle: '30, 35 e 50 mm', text: 'Tubetes nos diâmetros de 30 mm, 35 mm e 50 mm.' },
  ] },
  { id: id('tubetes'), type: 'editor', title: 'Expanda seu negócio',
    content: '<p>Valores simulados por tamanho de tubete e quantidade:</p>' +
      table(['Tamanho', '2 mil unid.', '5 mil unid.', '10 mil unid.'], [
        ['10 x 5 cm', 'R$ 1.720,00', 'R$ 4.300,00', 'R$ 8.600,00'],
        ['20 x 5 cm', 'R$ 3.280,00', 'R$ 8.200,00', 'R$ 16.400,00'],
        ['24 x 8 cm', 'R$ 9.740,00', 'R$ 24.350,00', 'R$ 48.700,00'],
      ]) },
  { id: id('tubetes'), type: 'cta', title: 'Leve a tecnologia Ellepot para o seu viveiro',
    text: 'Fale com Pedro Gabriel Almada, Representante Comercial: (31) 9 8359-1868 · comercial@sif.org.br',
    btn_label: 'Falar com o comercial', btn_link: 'mailto:comercial@sif.org.br' },

  // Treinamentos In Company
  { id: id('treinamentos'), type: 'text_image', nav_label: 'Treinamentos In Company', eyebrow: 'Capacitação', title: 'Treinamentos In Company', image: IMG('germinar-reuniao-mapas'), image_side: 'right',
    content: tabC['Treinamentos'] || '' },
  { id: id('treinamentos'), type: 'cta', title: 'Conheça os treinamentos In Company',
    text: 'Veja os programas disponíveis e leve um treinamento alinhado às necessidades da sua equipe.',
    btn_label: 'Ver treinamentos', btn_link: '/treinamentos-in-company' },

  // Bloco final original da SIF ("Não perca tempo...")
  editorFinal,
];

// ── GERMINAR ──────────────────────────────────────────────────────────
const [gObjetivos, gPlano] = live.germinar_sections;
const germinar = [
  { id: id('germinar'), type: 'text_image', eyebrow: 'Programa de talentos florestais', title: 'O que é o Germinar', image: IMG('germinar-viveiro-dupla'), image_side: 'right',
    content: '<p>O Programa Germinar é uma iniciativa estratégica ligada às associadas SIF e à UFV, atuando como ponte entre novos talentos e a indústria.</p><p>Atua facilitando a inserção de profissionais no mercado de trabalho. Além de encaminhar para vagas, oferece suporte com avaliações técnicas e comportamentais para preparar os candidatos para a transição acadêmica-corporativa.</p>' },
  { id: id('germinar'), type: 'text_image', eyebrow: 'Objetivo geral', title: 'Conectar novos talentos ao setor florestal brasileiro', image: IMG('germinar-equipe-floresta'), image_side: 'left',
    content: '<p>Conectar estagiários e trainees à prática do setor privado, oferecendo a oportunidade de vivenciar a rotina das empresas, entender sua cultura organizacional e se preparar para futuras oportunidades de atuação profissional.</p>' },
  gObjetivos,
  { id: id('germinar'), type: 'tabs', title: 'Benefícios', tabs: [
    { title: 'Para a empresa', content: ul(['<strong>Formação de novos talentos:</strong> oportunidade de desenvolver profissionais alinhados à cultura, aos valores e às necessidades da empresa.', '<strong>Renovação e inovação:</strong> entrada de jovens talentos com novas ideias, conhecimentos atualizados e diferentes perspectivas.', '<strong>Formação de futuros profissionais:</strong> possibilidade de identificar e preparar talentos para futuras posições estratégicas.', '<strong>Otimização do recrutamento:</strong> acesso a candidatos selecionados e direcionados conforme o perfil e as demandas da empresa.']) },
    { title: 'Para o candidato', content: ul(['<strong>Desenvolvimento profissional:</strong> oportunidade de colocar em prática os conhecimentos adquiridos na formação acadêmica.', '<strong>Experiência no mercado de trabalho:</strong> vivência da rotina corporativa e contato com desafios reais da profissão.', '<strong>Desenvolvimento de competências:</strong> aprimoramento de habilidades técnicas, comportamentais e relacionais.', '<strong>Possibilidade de efetivação:</strong> oportunidade de crescimento profissional e futuras contratações.']) },
    { title: 'Para a SIF', content: ul(['<strong>Fortalecimento de parcerias:</strong> aproximação com empresas e ampliação do relacionamento institucional, gerando conexão entre empresas, instituições de ensino e novos talentos.', '<strong>Valorização institucional:</strong> fortalecimento da imagem da SIF como agente de desenvolvimento profissional e de formação de talentos.', '<strong>Ampliação do impacto social:</strong> contribuição para a empregabilidade, a qualificação profissional e o desenvolvimento de novos talentos.']) },
  ] },
  { id: id('germinar'), type: 'stats', title: 'O programa em números', items: [
    { value: '6 a 24', label: 'meses de duração para o mesmo candidato' },
    { value: '2', label: 'modalidades: estagiário e trainee' },
    { value: '6', label: 'estados com talentos do programa' },
  ] },
  { id: id('germinar'), type: 'text_image', eyebrow: 'Presença nacional', title: 'Agregando talentos ao longo do país', image: IMG('germinar-mapa-brasil'), image_side: 'right',
    content: ul(['<strong>Bahia:</strong> Alagoinhas', '<strong>Maranhão:</strong> Imperatriz e região', '<strong>Minas Gerais:</strong> Capelinha, Itamarandiba e Três Marias', '<strong>Mato Grosso do Sul:</strong> Bataguassu e Três Lagoas', '<strong>Rio Grande do Sul:</strong> Guaíba', '<strong>São Paulo:</strong> Jacareí e Lençóis Paulista']) },
  { id: id('germinar'), type: 'quote', title: 'Exportando talentos para o mundo',
    text: 'No Germinar, encontrei na CMPC Chile a ponte entre a pesquisa do meu doutorado e a escala operacional. Hoje lidero um projeto de otimização da micropropagação de Eucalyptus nitens e aprendi a transitar entre ciência, gestão e trabalho em outro idioma e país. É uma experiência que recomendo a quem quer ver a ciência florestal acontecer na prática.',
    author: 'Paloma Brás', role: 'Pesquisadora Trainee · CMPC Chile' },
  { id: id('germinar'), type: 'highlights', title: 'Modalidades do programa', items: [
    { title: 'Estagiário', text: 'Vagas destinadas a estudantes que estejam cursando a graduação, com obrigatoriedade de vínculo acadêmico ativo.', image: IMG('germinar-laboratorio-estagiaria') },
    { title: 'Trainee', text: 'Vagas destinadas a pessoas com graduação concluída, incluindo profissionais que estejam cursando ou já tenham concluído a pós-graduação.', image: IMG('germinar-trainee-floresta') },
    { title: 'Oportunidades internacionais', text: 'O Germinar conecta talentos universitários a grandes empresas do setor florestal no exterior, promovendo experiências internacionais e o intercâmbio de conhecimentos. Um exemplo é a atuação de estudantes na CMPC, no Chile.', image: IMG('germinar-capa-floresta-eucalipto') },
  ] },
  { id: id('germinar'), type: 'cards', title: 'Fluxograma do programa', items: [
    { title: 'Demanda', subtitle: 'Busca ativa ou passiva', text: 'A demanda é recebida por meio da busca ativa pelo setor comercial ou de forma passiva, pela empresa.' },
    { title: 'Proposta', subtitle: 'Conforme a vaga', text: 'A proposta é elaborada conforme as exigências e os requisitos da vaga solicitados pela empresa no formulário.' },
    { title: 'Validação', subtitle: 'Junto à empresa', text: 'A proposta é submetida à validação junto à empresa.' },
    { title: 'Contrato', subtitle: 'Formalização', text: 'Após a validação, a proposta é encaminhada ao setor de contratos para formalização entre as partes.' },
    { title: 'Faturamento', subtitle: 'Nota fiscal', text: 'Após a assinatura do contrato, o processo é direcionado ao setor de faturamento para emissão da nota fiscal.' },
  ] },
  gPlano,
  { id: id('germinar'), type: 'tabs', title: 'Segurança, certificação e investimento', tabs: [
    { title: 'Certificação', content: '<p>No fim do programa, o candidato receberá um certificado de participação emitido pela SIF/UFV em parceria com a empresa envolvida.</p><p>Inovações, produtos, relatórios ou qualquer material intelectual desenvolvido durante o programa serão considerados de coautoria entre aluno, orientador e empresa, salvo acordo em contrato específico.</p>' },
    { title: 'Seguro e saúde', content: '<p>Os participantes do programa devem estar cobertos por seguro contra acidentes pessoais, contratado pela SIF ou pela empresa.</p><p>Também é obrigatória a existência de plano de saúde para todos os candidatos vinculados ao programa.</p>' },
    { title: 'Investimento', content: '<p>Os custos envolvem a bolsa acadêmica, alimentação, moradia, deslocamento, seguro de vida, plano de saúde, formação de RH e gestão SIF, variando conforme os objetivos e a especialidade de cada proposta.</p>' + ul(['1ª parcela: 50% do valor na assinatura do contrato;', '2ª parcela: 50% no início do terceiro mês.']) },
    { title: 'Rescisão e cancelamento', content: '<p>O desligamento do aluno poderá ocorrer nos seguintes casos:</p>' + ul(['descumprimento das regras do programa;', 'abandono das atividades;', 'conduta inadequada ou antiética;', 'a pedido do candidato, mediante justificativa formal;', 'cancelamento do vínculo acadêmico com a universidade, no caso da modalidade estagiário.']) },
  ] },
  { id: id('germinar'), type: 'cta', title: 'Sua empresa quer contratar talentos do Programa Germinar?',
    text: 'O formulário busca identificar as demandas de contratação e o perfil profissional desejado por cada empresa, permitindo elaborar propostas mais assertivas e conectar os talentos do Programa Germinar às oportunidades disponíveis.',
    btn_label: 'Registrar a demanda da empresa', btn_link: 'https://docs.google.com/forms/d/e/1FAIpQLSdQ3ZKbQCZn_OLMnkeK4ynmQauKu8sYo1D_GT0LV_kiMn2fXA/viewform?usp=header' },
];

// ── Abas novas: conteúdo que estava nas sub-abas do Comercial ────────
const cultivares = [{ id: id('cultivares'), type: 'editor', title: '', content: tabC['Proteção de Cultivares'] || '' }];
const importacao = [{ id: id('importacao'), type: 'editor', title: '', content: tabC['Importação e Exportação Florestal'] || '' }];

// ── Boletim: documentos para autores ─────────────────────────────────
const boletimDocs = [{ id: id('boletim'), type: 'pdfs', eyebrow: 'Para autores', title: 'Envie seu boletim', pdfs: [
  { title: 'Diretrizes de submissão do Boletim Técnico', url: 'uploads/pdfs/boletim-diretrizes-de-submissao.pdf' },
] }];

const out = {
  comercial_title_line1: String(live.comercial_title_line1 || '').replace(/^Cenheça/, 'Conheça'),
  comercial_sections: comercial,
  germinar_sections: germinar,
  cultivares_sections: cultivares,
  importacao_sections: importacao,
  boletim_sections: boletimDocs,
};
for (const k of ['cultivares', 'importacao']) if (!out[k + '_sections'][0].content) throw new Error('conteúdo vazio: ' + k);
if (!tabC['Treinamentos'] || !tabC['Tubetes Biodegradáveis Ellepots']) throw new Error('sub-abas não encontradas');
fs.writeFileSync(__dirname + '/produtos_novo.json', JSON.stringify(out));
console.log('ok', Object.keys(out).join(', '), '| comercial', comercial.length, 'blocos | germinar', germinar.length, 'blocos');
