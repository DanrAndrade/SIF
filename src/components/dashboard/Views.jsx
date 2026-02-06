import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, PackageCheck, X, FileText, Calendar, Clock, Download, AlertCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Input } from '../ui/FormElements';
import Button from '../ui/Button';

// --- MOCK DATA (DADOS PARA SIMULAÇÃO) ---
const mockCategoryData = [
  { subject: 'Alimentos', A: 120, fullMark: 150, topItem: 'Arroz Tio João 5kg', spend: 'R$ 12.500' },
  { subject: 'Bebidas', A: 98, fullMark: 150, topItem: 'Coca-Cola 2L', spend: 'R$ 8.200' },
  { subject: 'Bomboniere', A: 86, fullMark: 150, topItem: 'Bis Xtra', spend: 'R$ 4.100' },
  { subject: 'Limpeza', A: 99, fullMark: 150, topItem: 'Detergente Ypê', spend: 'R$ 5.300' },
  { subject: 'Perfumaria', A: 85, fullMark: 150, topItem: 'Sabonete Lux', spend: 'R$ 3.200' },
  { subject: 'Pet', A: 65, fullMark: 150, topItem: 'Pedigree 1kg', spend: 'R$ 2.100' },
];

const mockAllProducts = [
  { id: 1, nome: "Fardo Coca-Cola 2L", categoria: "Bebidas", qtd: "120 un", total: "R$ 5.080,00" },
  { id: 2, nome: "Guaraná Antarctica 1.5L", categoria: "Bebidas", qtd: "80 un", total: "R$ 3.200,00" },
  { id: 3, nome: "Arroz Tio João 5kg", categoria: "Alimentos", qtd: "85 fardos", total: "R$ 9.750,00" },
  { id: 4, nome: "Feijão Camil", categoria: "Alimentos", qtd: "40 fardos", total: "R$ 4.200,00" },
  { id: 6, nome: "Detergente Ypê", categoria: "Limpeza", qtd: "50 cx", total: "R$ 2.500,00" },
  { id: 7, nome: "Bis Xtra Ao Leite", categoria: "Bomboniere", qtd: "20 cx", total: "R$ 1.200,00" },
];

const mockOrders = [
  { id: "30245", nfe: "001.234", emissao: "03/01/2026", valor: "R$ 4.520,00", status: "Entregue" },
  { id: 29880, nfe: "001.110", emissao: "20/12/2025", valor: "R$ 12.150,00", status: "Entregue" },
  { id: 28100, nfe: "001.050", emissao: "10/12/2025", valor: "R$ 8.400,00", status: "Entregue" },
];

const mockDeliveries = [
    { id: 1, data: "Hoje, 06 Jan", status: "Em Rota", previsao: "14:00 - 16:00", motorista: "Carlos Souza", placa: "PKD-1234" },
    { id: 2, data: "08 Jan, Quarta", status: "Programado", previsao: "Manhã", motorista: "A definir", placa: "-" },
];

const mockProfile = {
    razaoSocial: "Mercadinho Exemplo LTDA",
    cnpj: "12.345.678/0001-90",
    responsavel: "João Silva",
    email: "compras@mercadinho.com.br",
    telefone: "(73) 99999-8888",
    endereco: "Av. Porto Seguro, 500 - Centro, Eunápolis - BA"
};

// --- COMPONENTES DE VISUALIZAÇÃO (VIEWS) ---

export const DashboardView = ({ timeFilter, setTimeFilter, selectedCategory, setSelectedCategory }) => {
    // Calcula o volume total para fazer a porcentagem
    const totalVolume = mockCategoryData.reduce((acc, item) => acc + item.A, 0);
    
    // Filtra a lista lateral
    const filteredProducts = useMemo(() => {
        if (!selectedCategory) return mockAllProducts.slice(0, 5); // Se não filtrar, mostra top 5 geral
        return mockAllProducts.filter(p => p.categoria === selectedCategory);
    }, [selectedCategory]);

    // TOOLTIP PERSONALIZADO (AQUI ESTÁ A MÁGICA DA INFORMAÇÃO)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload; // Pega o objeto inteiro do mockCategoryData
          const percentage = ((data.A / totalVolume) * 100).toFixed(1);
          
          return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-100 shadow-2xl rounded-xl min-w-[200px] z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                  <span className="font-bold text-[#1f2937] uppercase text-xs tracking-wider flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#D91A3C]"></div>
                    {data.subject}
                  </span>
                  <span className="text-[#D91A3C] font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full">{percentage}% do Mix</span>
              </div>
              
              <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Investimento</span>
                    <span className="text-sm font-bold text-gray-700">{data.spend}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Produto Campeão</span>
                    <div className="text-xs font-bold text-[#1f2937] bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-2">
                        <TrendingUp size={14} className="text-green-500" /> 
                        {data.topItem}
                    </div>
                  </div>
              </div>
            </div>
          );
        }
        return null;
    };

    // Renderiza os textos do gráfico (clicáveis)
    const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }) => {
        return (
          <text 
            {...rest} 
            x={x} y={y} cx={cx} cy={cy} 
            textAnchor="middle" 
            onClick={() => setSelectedCategory(payload.value === selectedCategory ? null : payload.value)} 
            className={`text-[10px] font-bold cursor-pointer transition-all uppercase tracking-wider ${selectedCategory === payload.value ? 'fill-[#D91A3C] font-black underline decoration-2 underline-offset-4' : 'fill-gray-400 hover:fill-[#1f2937]'}`}
          >
            {payload.value}
          </text>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* TOPO: Título e Filtros */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold text-[#1f2937]">Inteligência de Compras</h2>
                  <p className="text-gray-500 text-sm">Visão geral do seu perfil de consumo e oportunidades.</p>
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                  {['15days', 'month', '3months'].map(t => (
                      <button key={t} onClick={() => setTimeFilter(t)} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${timeFilter === t ? 'bg-[#1f2937] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                          {t === '15days' ? '15 Dias' : t === 'month' ? 'Este Mês' : 'Trimestre'}
                      </button>
                  ))}
              </div>
          </div>
    
          {/* CARDS DE KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total no Período</p><h3 className="text-3xl font-bold text-[#1f2937] tracking-tight">R$ 45.230<span className="text-lg text-gray-400">,00</span></h3></div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100"><TrendingUp size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Limite Disponível</p><h3 className="text-3xl font-bold text-[#1f2937] tracking-tight">R$ 12.500<span className="text-lg text-gray-400">,00</span></h3></div>
                <div className="w-12 h-12 bg-[#FFC107]/20 rounded-full flex items-center justify-center text-[#b45309] border border-[#FFC107]/30"><DollarSign size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status Financeiro</p><h3 className="text-2xl font-bold text-green-600">Em Dia</h3></div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100"><PackageCheck size={24} /></div>
            </div>
          </div>
    
          {/* GRÁFICO E LISTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* ÁREA DO GRÁFICO RADAR */}
              <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0"></div>
                  
                  <div className="mb-2 flex justify-between items-center relative z-10">
                      <div>
                        <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#FFC107]"/> Mix de Categorias
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Distribuição do volume de compras.</p>
                      </div>
                      
                      {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} className="text-[10px] flex items-center gap-1 font-bold text-[#D91A3C] bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors animate-in fade-in slide-in-from-right-4">
                            <X size={12}/> Limpar Filtro: {selectedCategory}
                        </button>
                      )}
                  </div>

                  <div className="h-[400px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockCategoryData}>
                          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                          <PolarAngleAxis dataKey="subject" tick={renderPolarAngleAxis} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                          <Radar 
                            name="Compras" 
                            dataKey="A" 
                            stroke="#D91A3C" 
                            strokeWidth={3} 
                            fill="#D91A3C" 
                            fillOpacity={0.15} 
                            activeDot={{ r: 6, fill: '#D91A3C', strokeWidth: 0 }}
                          />
                          <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#D91A3C', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>
                  
                  <div className="text-center mt-[-20px] pb-2">
                    <p className="text-[10px] text-gray-400 italic flex items-center justify-center gap-1">
                        <AlertCircle size={10} /> Clique nos nomes das categorias para filtrar a lista ao lado
                    </p>
                  </div>
              </div>
    
              {/* ÁREA DA LISTA DE PRODUTOS */}
              <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300">
                  <div className={`p-6 border-b border-gray-100 transition-colors duration-300 ${selectedCategory ? 'bg-[#D91A3C]/5' : 'bg-gray-50/50'}`}>
                      <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm flex items-center gap-2">
                          <FileText size={16} className={selectedCategory ? "text-[#D91A3C]" : "text-gray-400"}/> 
                          {selectedCategory ? `Detalhes: ${selectedCategory}` : "Top Produtos (Geral)"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                          {selectedCategory ? "Produtos comprados nesta categoria." : "Os itens mais comprados no período."}
                      </p>
                  </div>
                  
                  <div className="p-4 overflow-y-auto flex-1 custom-scrollbar max-h-[400px]">
                      {filteredProducts.length > 0 ? (
                          filteredProducts.map((prod) => (
                              <div key={prod.id} className="group flex items-center gap-4 p-4 mb-3 bg-white border border-gray-100 rounded-xl hover:border-[#D91A3C]/30 hover:shadow-md transition-all relative overflow-hidden animate-in slide-in-from-right-2 duration-300 cursor-default">
                                  {/* Indicador lateral colorido */}
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${prod.categoria === 'Bebidas' ? 'bg-blue-400' : prod.categoria === 'Alimentos' ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                                  
                                  <div className="flex-1 pl-2">
                                      <div className="flex justify-between">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{prod.categoria}</span>
                                      </div>
                                      <h4 className="text-sm font-bold text-[#1f2937] leading-tight mt-0.5 group-hover:text-[#D91A3C] transition-colors">{prod.nome}</h4>
                                  </div>
                                  
                                  <div className="text-right">
                                      <span className="block text-xs font-medium text-gray-500">{prod.qtd}</span>
                                      <span className="block text-sm font-bold text-[#D91A3C]">{prod.total}</span>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                              <PackageCheck size={40} className="mb-2 opacity-20" />
                              <p className="text-xs font-medium">Nenhum produto encontrado nesta categoria.</p>
                          </div>
                      )}
                  </div>
                  
                  {/* Botão ver todos */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <button className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#1f2937] hover:text-[#D91A3C] hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                          Ver Relatório Completo
                      </button>
                  </div>
              </div>
          </div>
        </div>
    );
};

export const OrdersView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
                <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm">Notas Fiscais Emitidas</h3>
                <p className="text-xs text-gray-500 mt-0.5">Histórico financeiro e documentos.</p>
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button className="text-xs font-bold text-gray-500 hover:text-[#D91A3C] px-3 py-1 rounded-md hover:bg-white transition-all">2025</button>
                <button className="text-xs font-bold text-[#D91A3C] bg-white shadow-sm px-3 py-1 rounded-md">2026</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                    <tr><th className="px-6 py-4">Emissão</th><th className="px-6 py-4">Nº NFe</th><th className="px-6 py-4">Valor Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Documentos</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 text-gray-600 font-medium group-hover:text-[#1f2937]">{order.emissao}</td>
                            <td className="px-6 py-4 font-bold text-[#1f2937]">{order.nfe}</td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{order.valor}</td>
                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200"><PackageCheck size={12} /> {order.status}</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#1f2937] text-xs font-bold transition-colors hover:underline"><FileText size={14} /> XML</button>
                                    <button className="flex items-center gap-1 text-[#D91A3C] hover:text-[#b01530] text-xs font-bold transition-colors border border-[#D91A3C]/20 px-3 py-1.5 rounded-lg hover:bg-[#D91A3C] hover:text-white"><Download size={14} /> PDF</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const AgendaView = () => (
    <div className="animate-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div><h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-lg">Programação Logística</h3><p className="text-gray-500 text-sm">Acompanhe a chegada dos seus pedidos em tempo real.</p></div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-blue-100"><Calendar size={16} /> Janeiro 2026</span>
        </div>
        <div className="grid gap-6">
            {mockDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                    {/* Barra lateral de status */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 ${delivery.status === 'Em Rota' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="flex flex-col items-center justify-center w-full md:w-32 bg-gray-50 rounded-xl py-4 border border-gray-100 shrink-0">
                        <span className="text-[#1f2937] font-bold text-sm uppercase">{delivery.data.split(',')[0]}</span>
                        <span className="text-gray-500 text-xs font-medium">{delivery.data.split(',')[1]}</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center md:text-left items-center">
                        <div>
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Previsão</span>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-[#1f2937] font-bold text-sm">
                                <Clock size={16} className="text-[#FFC107]"/> {delivery.previsao}
                            </div>
                        </div>
                        <div>
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Status</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${delivery.status === 'Em Rota' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                                {delivery.status}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Motorista</span>
                            <span className="text-sm font-medium text-gray-600">{delivery.motorista}</span>
                        </div>
                        
                        <div className="md:text-right">
                             {delivery.status === 'Em Rota' && (
                                 <button className="text-xs font-bold text-white bg-[#1f2937] px-4 py-2 rounded-lg hover:bg-[#D91A3C] transition-colors shadow-lg shadow-gray-200">
                                     Rastrear no Mapa
                                 </button>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ProfileView = () => (
    <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div><h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm">Dados Cadastrais</h3><p className="text-xs text-gray-500 mt-1">Informações utilizadas para faturamento e entrega.</p></div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-200 flex items-center gap-1"><PackageCheck size={12}/> Cadastro Ativo</span>
        </div>
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Razão Social" defaultValue={mockProfile.razaoSocial} />
                <Input label="CNPJ" defaultValue={mockProfile.cnpj} disabled className="opacity-70 bg-gray-100" />
                <Input label="Responsável" defaultValue={mockProfile.responsavel} />
                <Input label="Telefone" defaultValue={mockProfile.telefone} />
            </div>
            <Input label="Endereço de Entrega" defaultValue={mockProfile.endereco} />
            <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 mt-6">
                <Button variant="outline" type="button">Cancelar</Button>
                <Button variant="primary">Solicitar Atualização</Button>
            </div>
        </form>
    </div>
);