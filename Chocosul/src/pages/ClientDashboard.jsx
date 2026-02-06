import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, User, LogOut, Bell, ChevronRight, 
  TrendingUp, Calendar, DollarSign, Menu, X, Truck, PackageCheck, 
  Filter, Download, Clock
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import { useAuth } from '../contexts/AuthContext'; // Importando Autenticação
import iconLogo from '../assets/icone.svg';

// --- MOCK DATA (DADOS ESTÁTICOS) ---

const mockCategoryData = [
  { subject: 'Alimentos', A: 120, fullMark: 150, topItem: 'Arroz Tio João' },
  { subject: 'Bebidas', A: 98, fullMark: 150, topItem: 'Coca-Cola 2L' },
  { subject: 'Bomboniere', A: 86, fullMark: 150, topItem: 'Bis Xtra' },
  { subject: 'Limpeza', A: 99, fullMark: 150, topItem: 'Detergente Ypê' },
  { subject: 'Perfumaria', A: 85, fullMark: 150, topItem: 'Sabonete Lux' },
  { subject: 'Pet', A: 65, fullMark: 150, topItem: 'Pedigree 1kg' },
];

// Cálculo do Total para Porcentagem
const totalVolume = mockCategoryData.reduce((acc, item) => acc + item.A, 0);

const mockAllProducts = [
  { id: 1, nome: "Fardo Coca-Cola 2L", categoria: "Bebidas", qtd: "120 un", total: "R$ 5.080,00" },
  { id: 2, nome: "Guaraná Antarctica 1.5L", categoria: "Bebidas", qtd: "80 un", total: "R$ 3.200,00" },
  { id: 3, nome: "Suco Del Valle Uva", categoria: "Bebidas", qtd: "45 cx", total: "R$ 1.100,00" },
  { id: 4, nome: "Arroz Tio João 5kg", categoria: "Alimentos", qtd: "85 fardos", total: "R$ 9.750,00" },
  { id: 5, nome: "Feijão Camil 1kg", categoria: "Alimentos", qtd: "60 fardos", total: "R$ 4.200,00" },
  { id: 6, nome: "Detergente Ypê", categoria: "Limpeza", qtd: "50 cx", total: "R$ 2.500,00" },
  { id: 7, nome: "Sabão Omo 1kg", categoria: "Limpeza", qtd: "30 cx", total: "R$ 1.800,00" },
  { id: 8, nome: "Bis Xtra ao Leite", categoria: "Bomboniere", qtd: "30 cx", total: "R$ 1.200,00" },
  { id: 9, nome: "Batom Garoto", categoria: "Bomboniere", qtd: "20 cx", total: "R$ 800,00" },
  { id: 10, nome: "Sabonete Lux", categoria: "Perfumaria", qtd: "40 cx", total: "R$ 900,00" },
  { id: 11, nome: "Pedigree Carne", categoria: "Pet", qtd: "15 sc", total: "R$ 1.500,00" },
];

const mockProfile = {
  razaoSocial: "Mercadinho Exemplo LTDA",
  cnpj: "12.345.678/0001-90",
  responsavel: "João Silva",
  email: "compras@mercadinho.com.br",
  telefone: "(73) 99999-8888",
  endereco: "Av. Porto Seguro, 500 - Centro, Eunápolis - BA"
};

const mockOrders = [
  { id: "30245", nfe: "001.234", emissao: "03/01/2026", valor: "R$ 4.520,00", status: "Entregue" },
  { id: "29880", nfe: "001.110", emissao: "20/12/2025", valor: "R$ 12.150,00", status: "Entregue" },
  { id: "29540", nfe: "000.950", emissao: "05/12/2025", valor: "R$ 3.200,50", status: "Entregue" },
];

const mockDeliveries = [
  { id: 1, data: "Hoje, 06 Jan", status: "Em Rota", previsao: "14:00 - 16:00", motorista: "Carlos Souza", placa: "PKD-1234" },
  { id: 2, data: "08 Jan, Quarta", status: "Programado", previsao: "Manhã", motorista: "A definir", placa: "-" },
];

// --- COMPONENTES AUXILIARES (Definidos fora para Performance) ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Cálculo da porcentagem
    const percentage = ((data.A / totalVolume) * 100).toFixed(1);
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-xs z-50">
        <p className="font-bold text-[#1f2937] uppercase mb-1">{label}</p>
        <p className="text-[#D91A3C] font-bold text-sm">{percentage}% do Total</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-gray-400 text-[10px] uppercase tracking-wider">Top Produto:</p>
          <p className="text-gray-600 font-medium">{data.topItem}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 italic">Clique para filtrar</p>
      </div>
    );
  }
  return null;
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active ? 'bg-[#D91A3C] text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
        <div className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
);

// VIEW 1: DASHBOARD DE INTELIGÊNCIA
const DashboardView = ({ timeFilter, setTimeFilter, selectedCategory, setSelectedCategory, filteredProducts, renderPolarAngleAxis }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div><h2 className="text-2xl font-bold text-[#1f2937]">Inteligência de Compras</h2><p className="text-gray-500 text-sm">Analise seu perfil de consumo e mix de produtos.</p></div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {['15days', 'month', '3months'].map(t => (
                  <button key={t} onClick={() => setTimeFilter(t)} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${timeFilter === t ? 'bg-[#1f2937] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                      {t === '15days' ? '15 Dias' : t === 'month' ? 'Este Mês' : 'Trimestre'}
                  </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total no Período</p><h3 className="text-2xl font-bold text-[#1f2937]">R$ 45.230,00</h3></div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600"><TrendingUp size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Limite Disponível</p><h3 className="text-2xl font-bold text-[#1f2937]">R$ 12.500,00</h3></div>
            <div className="w-12 h-12 bg-[#FFC107]/20 rounded-full flex items-center justify-center text-[#b45309]"><DollarSign size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status Financeiro</p><h3 className="text-xl font-bold text-green-600">Em Dia</h3></div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><PackageCheck size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="mb-2 flex justify-between items-center">
                  <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm flex items-center gap-2"><TrendingUp size={16} className="text-[#FFC107]"/> Mix de Categorias</h3>
                  {selectedCategory && (
                    <button onClick={() => setSelectedCategory(null)} className="text-[10px] flex items-center gap-1 font-bold text-[#D91A3C] bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"><X size={12}/> Limpar Filtro</button>
                  )}
              </div>
              <p className="text-xs text-gray-400 mb-6">Passe o mouse para ver a representatividade e clique para detalhar.</p>
              <div className="h-[350px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockCategoryData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={renderPolarAngleAxis} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="Compras" dataKey="A" stroke="#D91A3C" strokeWidth={3} fill="#D91A3C" fillOpacity={0.2} />
                      <RechartsTooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300">
              <div className={`p-6 border-b border-gray-100 ${selectedCategory ? 'bg-[#D91A3C]/5' : 'bg-gray-50/50'}`}>
                  <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm flex items-center gap-2">
                      <FileText size={16} className={selectedCategory ? "text-[#D91A3C]" : "text-gray-400"}/> 
                      {selectedCategory ? `Detalhes: ${selectedCategory}` : "Top Produtos (Geral)"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{selectedCategory ? "Exibindo apenas itens desta categoria." : "Produtos com maior representatividade no período."}</p>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar max-h-[350px]">
                  {filteredProducts.length > 0 ? (
                      filteredProducts.map((prod) => (
                          <div key={prod.id} className="group flex items-center gap-4 p-4 mb-3 bg-white border border-gray-100 rounded-xl hover:border-[#D91A3C]/30 hover:shadow-md transition-all relative overflow-hidden animate-in slide-in-from-right-2 duration-300">
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${prod.categoria === 'Bebidas' ? 'bg-blue-400' : prod.categoria === 'Alimentos' ? 'bg-yellow-400' : prod.categoria === 'Limpeza' ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                              <div className="flex-1"><span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{prod.categoria}</span><h4 className="text-sm font-bold text-[#1f2937] leading-tight mt-0.5">{prod.nome}</h4></div>
                              <div className="text-right"><span className="block text-xs font-medium text-gray-500">{prod.qtd}</span><span className="block text-sm font-bold text-[#D91A3C]">{prod.total}</span></div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-10 text-gray-400 text-xs">Nenhum produto encontrado.</div>
                  )}
                  {!selectedCategory && (
                    <button className="w-full py-3 mt-2 text-xs font-bold text-gray-400 uppercase hover:text-[#1f2937] hover:bg-gray-50 rounded-lg transition-colors">Ver Manifesto Completo</button>
                  )}
              </div>
          </div>
      </div>
    </div>
);

// VIEW 2: NOTAS FISCAIS
const OrdersView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm">Notas Fiscais Emitidas</h3>
            <div className="flex gap-2">
                <button className="text-xs font-bold text-gray-500 hover:text-[#D91A3C] px-3 py-1 rounded-md hover:bg-gray-50">2025</button>
                <button className="text-xs font-bold text-[#D91A3C] bg-red-50 px-3 py-1 rounded-md">2026</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr><th className="px-6 py-4">Emissão</th><th className="px-6 py-4">Nº NFe</th><th className="px-6 py-4">Valor Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Documentos</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-600 font-medium">{order.emissao}</td>
                            <td className="px-6 py-4 font-bold text-[#1f2937]">{order.nfe}</td>
                            <td className="px-6 py-4 text-gray-600">{order.valor}</td>
                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200"><PackageCheck size={12} /> {order.status}</span></td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#1f2937] text-xs font-bold transition-colors"><FileText size={16} /> XML</button>
                                    <button className="flex items-center gap-1 text-[#D91A3C] hover:text-[#b01530] text-xs font-bold transition-colors"><Download size={16} /> PDF</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// VIEW 3: AGENDA LOGÍSTICA
const AgendaView = () => (
    <div className="animate-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div><h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-lg">Programação Logística</h3><p className="text-gray-500 text-sm">Acompanhe a chegada dos seus pedidos.</p></div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Calendar size={16} /> Janeiro 2026</span>
        </div>
        <div className="grid gap-6">
            {mockDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${delivery.status === 'Em Rota' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="flex flex-col items-center justify-center w-full md:w-32 bg-gray-50 rounded-xl py-4 border border-gray-100"><span className="text-[#1f2937] font-bold text-sm uppercase">{delivery.data.split(',')[0]}</span><span className="text-gray-500 text-xs font-medium">{delivery.data.split(',')[1]}</span></div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center md:text-left">
                        <div><span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Previsão</span><div className="flex items-center justify-center md:justify-start gap-2 text-[#1f2937] font-bold text-sm"><Clock size={16} className="text-[#FFC107]"/> {delivery.previsao}</div></div>
                        <div><span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Status</span><span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${delivery.status === 'Em Rota' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{delivery.status}</span></div>
                        <div><span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Motorista</span><span className="text-sm font-medium text-gray-600">{delivery.motorista}</span></div>
                        <div><span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Veículo</span><span className="text-sm font-medium text-gray-600">{delivery.placa}</span></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// VIEW 4: PERFIL
const ProfileView = () => (
    <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div><h3 className="font-bold text-[#1f2937] uppercase tracking-wide text-sm">Dados Cadastrais</h3><p className="text-xs text-gray-500 mt-1">Mantenha seus dados atualizados.</p></div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Ativo</span>
        </div>
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Razão Social</label><input type="text" defaultValue={mockProfile.razaoSocial} className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#D91A3C] focus:border-[#D91A3C]" /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">CNPJ</label><input type="text" defaultValue={mockProfile.cnpj} disabled className="w-full bg-gray-100 border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed" /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Responsável</label><input type="text" defaultValue={mockProfile.responsavel} className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#D91A3C] focus:border-[#D91A3C]" /></div>
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Telefone</label><input type="text" defaultValue={mockProfile.telefone} className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#D91A3C] focus:border-[#D91A3C]" /></div>
            </div>
            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Endereço de Entrega</label><input type="text" defaultValue={mockProfile.endereco} className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#D91A3C] focus:border-[#D91A3C]" /></div>
            <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 mt-6">
                <button type="button" className="px-8 py-3 bg-[#D91A3C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b01530] transition-colors shadow-lg">Solicitar Atualização</button>
            </div>
        </form>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { logout } = useAuth(); // Hook de Logout

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return mockAllProducts.slice(0, 5);
    }
    return mockAllProducts.filter(p => p.categoria === selectedCategory);
  }, [selectedCategory]);

  const renderPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }) => {
    return (
      <text
        {...rest}
        x={x}
        y={y}
        cx={cx}
        cy={cy}
        textAnchor="middle"
        onClick={() => setSelectedCategory(payload.value === selectedCategory ? null : payload.value)}
        className={`text-[10px] font-bold cursor-pointer transition-all ${selectedCategory === payload.value ? 'fill-[#D91A3C] text-lg' : 'fill-gray-500 hover:fill-[#1f2937]'}`}
        style={{ fontSize: '11px', fontWeight: 'bold' }}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#1f2937] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1f2937] text-white transition-transform duration-300 transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
            <div className="p-8 flex items-center gap-3 border-b border-gray-700">
                <img src={iconLogo} alt="Logo" className="w-8 h-8 object-contain" />
                <div><span className="block font-bold uppercase tracking-widest text-sm leading-none">Chocosul</span><span className="block text-[9px] text-[#FFC107] uppercase tracking-[0.2em] font-bold">Portal B2B</span></div>
                <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                <SidebarItem icon={<LayoutDashboard size={20}/>} label="Inteligência" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <SidebarItem icon={<FileText size={20}/>} label="Notas Fiscais" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                <SidebarItem icon={<Truck size={20}/>} label="Agenda Entregas" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                <SidebarItem icon={<User size={20}/>} label="Dados Cadastrais" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button 
                    onClick={logout} 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#D91A3C] hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut size={18} /> Sair do Sistema
                </button>
            </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 lg:px-10 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
                <h2 className="text-xl font-bold uppercase text-[#1f2937] hidden sm:block">
                    {activeTab === 'dashboard' && 'Painel de Inteligência'}
                    {activeTab === 'orders' && 'Central de Notas Fiscais'}
                    {activeTab === 'agenda' && 'Programação Logística'}
                    {activeTab === 'profile' && 'Dados da Empresa'}
                </h2>
            </div>
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-[#D91A3C] transition-colors"><Bell size={20} /><span className="absolute top-1.5 right-2 w-2 h-2 bg-[#FFC107] rounded-full"></span></button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block"><p className="text-xs font-bold text-[#1f2937]">João Silva</p><p className="text-[10px] text-gray-400 uppercase">Mercadinho Exemplo</p></div>
                    <div className="w-10 h-10 bg-[#1f2937] text-white rounded-full flex items-center justify-center font-bold text-xs border border-gray-200">JS</div>
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && <DashboardView 
                    timeFilter={timeFilter} 
                    setTimeFilter={setTimeFilter} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                    filteredProducts={filteredProducts} 
                    renderPolarAngleAxis={renderPolarAngleAxis} 
                />}
                {activeTab === 'orders' && <OrdersView />}
                {activeTab === 'agenda' && <AgendaView />}
                {activeTab === 'profile' && <ProfileView />}
            </div>
        </div>
      </main>
    </div>
  );
}