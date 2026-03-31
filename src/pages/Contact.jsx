import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Input, Select, TextArea } from '../components/ui/FormElements';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

// Importando o icone para o favicon
import iconLogo from '../assets/icone.svg'; 

const API_URL = 'http://localhost/sif-api/leads.php';

export default function Contact() {
  const { hash } = useLocation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [formData, setFormData] = useState({
      name: '', email: '', phone: '', subject: 'institucional', message: ''
  });

  useEffect(() => {
    document.title = "SIF | Contato";
    
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = iconLogo;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = iconLogo;
      document.head.appendChild(newLink);
    }

    window.scrollTo(0, 0);
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const yOffset = -120;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300);
      }
    }
  }, [hash]);

  const scrollToContent = () => {
    const section = document.getElementById('contact-form');
    if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .slice(0, 15);
  };

  const handleChange = (e) => {
      let { name, value } = e.target;
      if (name === 'phone') value = maskPhone(value);
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);

      try {
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });
          const result = await response.json();
          if (result.success) {
              setStatus('success');
              setFormData({ name: '', email: '', phone: '', subject: 'institucional', message: '' }); 
          } else {
              setStatus('error');
          }
      } catch (error) {
          setStatus('error');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#059669] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF COM IMAGEM */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fbb7a8d?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Conecte-se Conosco</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Fale com <br/>
              <span className="text-[#059669]">Nossa Equipe</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Transparência e proximidade são nossos pilares. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas.
          </p>

          <button 
              onClick={scrollToContent} 
              className="group flex flex-col items-start gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#059669]"
          >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-all shadow-sm">
                  <ChevronDown className="animate-bounce" size={20} />
              </div>
          </button>
        </div>
      </div>

      <main className="flex-grow py-24 px-6">
        <div id="contact-form" className="container mx-auto max-w-7xl scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* Lateral: Informações */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[80px] -z-0"></div>
                        
                        <h3 className="text-xs font-black uppercase mb-12 tracking-[0.3em] text-[#059669] flex items-center gap-4 relative z-10">
                            <span className="w-10 h-[2px] bg-[#059669]"></span> Canais Diretos
                        </h3>
                        
                        <div className="flex flex-col gap-10 relative z-10">
                            <div className="flex items-start gap-6 group/item">
                                <div className="w-14 h-14 bg-[#f8f9fa] text-[#1f2937] rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover/item:bg-[#059669] group-hover/item:text-white shadow-sm border border-gray-50"><Phone size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Telefone Centex</span>
                                    <p className="font-bold text-xl text-[#1f2937]">+55 (31) 3612-3950</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-6 group/item">
                                <div className="w-14 h-14 bg-[#f8f9fa] text-[#1f2937] rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover/item:bg-[#059669] group-hover/item:text-white shadow-sm border border-gray-50"><Mail size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">E-mail Corporativo</span>
                                    <p className="font-bold text-xl text-[#1f2937] break-all">contato@sif.org.br</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-6 group/item pt-10 border-t border-gray-50">
                                <div className="w-14 h-14 bg-[#f8f9fa] text-[#1f2937] rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover/item:bg-[#059669] group-hover/item:text-white shadow-sm border border-gray-50"><MapPin size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Sede Administrativa</span>
                                    <p className="font-medium text-sm text-[#1f2937] leading-relaxed">
                                        DEP de Engenharia Florestal<br/>
                                        Av. P.H. Rolfs, s/n – Campus da UFV<br/>
                                        Viçosa - MG | CEP: 36570-900
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulário de Mensagem */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[200px] pointer-events-none opacity-50"></div>
                        
                        <div className="mb-12">
                            <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Mensagem</span>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] leading-tight tracking-tight">Atendimento <br/>Técnico</h2>
                        </div>
                        
                        {status === 'success' && (
                            <div className="mb-12 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4 text-[#059669] animate-in zoom-in-95">
                                <CheckCircle size={32} />
                                <div className="flex flex-col">
                                    <span className="font-black text-xs uppercase tracking-widest">Sucesso</span>
                                    <span className="text-sm font-medium">Sua mensagem foi entregue à nossa secretaria técnica.</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} required className="bg-[#f8f9fa] border-gray-100 focus:border-[#059669] rounded-2xl" />
                            <Input label="E-mail" name="email" value={formData.email} onChange={handleChange} type="email" required className="bg-[#f8f9fa] border-gray-100 focus:border-[#059669] rounded-2xl" />
                            <Input label="Telefone" name="phone" value={formData.phone} onChange={handleChange} maxLength={15} required className="bg-[#f8f9fa] border-gray-100 focus:border-[#059669] rounded-2xl" />
                            <Select 
                                label="Assunto" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="bg-[#f8f9fa] border-gray-100 focus:border-[#059669] rounded-2xl"
                                options={[
                                    {label: "Dúvida Institucional", value: "institucional"}, 
                                    {label: "Parcerias de Pesquisa", value: "parceria"}, 
                                    {label: "Trabalhe Conosco", value: "rh"},
                                    {label: "Portal da Transparência", value: "transparencia"}
                                ]} 
                            />
                            <div className="md:col-span-2">
                                <TextArea label="Como podemos ajudar?" name="message" value={formData.message} onChange={handleChange} rows="6" required className="bg-[#f8f9fa] border-gray-100 focus:border-[#059669] rounded-2xl" />
                            </div>
                            <div className="md:col-span-2 mt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full md:w-auto bg-[#1f2937] hover:bg-[#059669] text-white font-black uppercase tracking-[0.2em] text-[10px] py-6 px-16 rounded-2xl transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {loading ? 'Processando envio...' : (
                                        <>
                                            Enviar Mensagem <Send size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}