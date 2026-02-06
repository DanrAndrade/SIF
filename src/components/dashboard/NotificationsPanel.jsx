import React from 'react';
import { X, Info, Truck, Tag, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NotificationsPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Mock de Notificações (Simulando o Backend)
  const notifications = [
    {
      id: 1,
      type: 'promo',
      title: 'Oferta Relâmpago!',
      message: 'Coca-Cola 2L com 15% de desconto para pedidos acima de 50 fardos. Só até amanhã!',
      time: '2 horas atrás',
      read: false
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Entrega Programada',
      message: 'Seu pedido #30245 saiu para entrega e deve chegar hoje até as 16h.',
      time: '4 horas atrás',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Manutenção no Sistema',
      message: 'O portal passará por atualização no domingo (10/01) das 02h às 04h.',
      time: '1 dia atrás',
      read: true
    },
    {
      id: 4,
      type: 'finance',
      title: 'Nota Fiscal Disponível',
      message: 'A NFe do pedido #29880 já está disponível para download.',
      time: '2 dias atrás',
      read: true
    },
    {
      id: 5,
      type: 'alert',
      title: 'Limite de Crédito',
      message: 'Você utilizou 85% do seu limite de crédito disponível.',
      time: '1 semana atrás',
      read: true
    }
  ];

  // Função auxiliar para ícones e cores
  const getIcon = (type) => {
    switch (type) {
      case 'promo': return <div className="p-2 rounded-full bg-pink-100 text-pink-600"><Tag size={16} /></div>;
      case 'delivery': return <div className="p-2 rounded-full bg-blue-100 text-blue-600"><Truck size={16} /></div>;
      case 'alert': return <div className="p-2 rounded-full bg-yellow-100 text-yellow-600"><AlertTriangle size={16} /></div>;
      case 'finance': return <div className="p-2 rounded-full bg-green-100 text-green-600"><CheckCircle2 size={16} /></div>;
      default: return <div className="p-2 rounded-full bg-gray-100 text-gray-600"><Info size={16} /></div>;
    }
  };

  return (
    <>
        {/* Overlay transparente para fechar ao clicar fora */}
        <div className="fixed inset-0 z-40" onClick={onClose}></div>

        {/* O Painel em si */}
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Cabeçalho */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="font-bold text-[#1f2937] text-sm uppercase tracking-wide">Notificações</h3>
                    <p className="text-[10px] text-gray-400 font-bold">Você tem 2 mensagens não lidas</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={16} className="text-gray-500" />
                </button>
            </div>

            {/* Lista com Rolagem */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.map((item) => (
                    <div key={item.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!item.read ? 'bg-red-50/10' : ''}`}>
                        <div className="shrink-0 mt-1">
                            {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-xs font-bold ${!item.read ? 'text-[#1f2937]' : 'text-gray-500'}`}>{item.title}</h4>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">{item.time}</span>
                            </div>
                            <p className={`text-xs leading-relaxed ${!item.read ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                {item.message}
                            </p>
                        </div>
                        {!item.read && <div className="w-2 h-2 rounded-full bg-[#D91A3C] mt-2 shrink-0"></div>}
                    </div>
                ))}
            </div>

            {/* Rodapé */}
            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#D91A3C] hover:text-[#b01530] transition-colors">
                    Marcar todas como lidas
                </button>
            </div>
        </div>
    </>
  );
}