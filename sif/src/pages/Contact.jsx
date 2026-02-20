import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans text-gray-900 bg-[#f8f9fa] min-h-screen flex flex-col">
      <Navbar 
        scrolled={true} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <div className="flex-grow pt-32 pb-16 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
            
            <div className="text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 border border-[#D91A3C]/30 rounded-full mb-6 bg-[#D91A3C]/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D91A3C]">Fale Conosco</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-none tracking-tight text-[#1f2937] section-heading mb-6">
                    Vamos Iniciar uma<br/><span className="text-[#D91A3C]">Parceria?</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium">
                    Preencha o formulário abaixo e nossa equipe comercial entrará em contato em até 24 horas úteis.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Lateral: Informações */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <h3 className="text-xl font-bold uppercase mb-8 section-heading">Canais Diretos</h3>
                        
                        <div className="flex flex-col gap-8">
                            {/* ITEM TELEFONE */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#D91A3C]/10 text-[#D91A3C] rounded-2xl flex items-center justify-center shrink-0">
                                    <Phone size={24} />
                                </div>
                                {/* Adicionado min-w-0 e flex-1 para evitar quebra de layout */}
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Telefone</span>
                                    <p className="font-bold text-lg text-[#1f2937] break-words">+55 (73) 3511-1050</p>
                                    <p className="text-sm text-gray-500">Seg a Sex: 08h às 18h</p>
                                </div>
                            </div>

                            {/* ITEM EMAIL */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFC107]/10 text-[#b45309] rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</span>
                                    {/* break-all garante que emails longos não estourem no mobile */}
                                    <p className="font-bold text-lg text-[#1f2937] break-all">comercial@chocosul.com.br</p>
                                    <p className="text-sm text-gray-500">Respondemos em até 24h</p>
                                </div>
                            </div>

                            {/* ITEM ENDEREÇO */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Sede</span>
                                    <p className="font-bold text-sm text-[#1f2937] leading-relaxed break-words">
                                        Rod. BR 101 – Km 717,5 – nº 2251<br/>
                                        Eunápolis - BA<br/>
                                        CEP: 45825-970
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D91A3C]/5 rounded-bl-[100px] pointer-events-none"></div>
                        
                        <h3 className="text-2xl font-bold uppercase mb-8 section-heading">Envie sua Mensagem</h3>
                        
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Nome Completo</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937]" placeholder="Seu nome ou da empresa" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">E-mail Corporativo</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937]" placeholder="email@empresa.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Telefone / WhatsApp</label>
                                <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937]" placeholder="(73) 99999-9999" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Assunto</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937]">
                                    <option>Quero ser Fornecedor</option>
                                    <option>Quero revender (Varejo)</option>
                                    <option>Trabalhe Conosco</option>
                                    <option>Outros Assuntos</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Mensagem</label>
                                <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937] resize-none" placeholder="Como podemos ajudar sua empresa?"></textarea>
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <button type="submit" className="w-full md:w-auto px-12 py-4 bg-gradient-to-br from-[#D91A3C] to-[#900f24] text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    Enviar Mensagem <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}