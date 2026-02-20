import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
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
    document.title = "SIF | Fale Conosco";
    
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
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
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
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
            {/* Imagem de Fundo Florestal */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2682&auto=format&fit=crop')] bg-cover bg-center bg-fixed"></div>
            
            {/* OVERLAY FUMÊ MAIS ESCURO */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-black/20"></div>
            
            <NoiseOverlay opacity={0.45} />
         </div>
         
         {/* Recorte Curvo SIF */}
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 rounded-tr-[80px] z-10"></div>

         <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-8 lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-[#FFC107] animate-pulse"></span>
                    <span className="text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">Contato SIF</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                    Fale com <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">
                        Nossa Equipe
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed font-light mb-10 border-l-2 border-[#2E7D32] pl-6">
                    A SIF valoriza a transparência e a proximidade. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas sobre nossas atividades.
                </p>

                <button onClick={scrollToContent} className="group flex items-center gap-3 text-white font-medium hover:text-[#FFC107] transition-colors">
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFC107] transition-all">
                        <ChevronDown className="animate-bounce" size={24} />
                    </div>
                    <span className="uppercase text-xs tracking-widest font-bold">Enviar Mensagem</span>
                </button>
            </div>
         </div>
      </div>

      <main className="flex-grow pt-10 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                
                {/* Lateral: Informações */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
                        <h3 className="text-xl font-bold uppercase mb-8 tracking-widest text-[#1f2937] flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-[#2E7D32]"></span> Canais Diretos
                        </h3>
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#2E7D32]/10 text-[#2E7D32] rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#2E7D32] group-hover:text-white"><Phone size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Telefone</span>
                                    <p className="font-bold text-lg text-[#1f2937]">+55 (31) 3612-3950</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFC107]/10 text-[#b45309] rounded-2xl flex items-center justify-center shrink-0"><Mail size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</span>
                                    <p className="font-bold text-lg text-[#1f2937] break-all">contato@sif.org.br</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center shrink-0"><MapPin size={24} /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Localização</span>
                                    <p className="font-bold text-sm text-[#1f2937] leading-relaxed">
                                        Departamento de Engenharia Florestal<br/>
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
                    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/5 rounded-bl-[100px] pointer-events-none"></div>
                        
                        <SectionHeader 
                            align="left"
                            tag="Fale Conosco"
                            title="Mande sua Mensagem"
                            subtitle="Dúvidas ou interesse em parcerias? Nossa equipe técnica retornará seu contato."
                        />
                        
                        {status === 'success' && (
                            <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800 animate-in fade-in">
                                <CheckCircle size={24} />
                                <span className="font-bold text-sm">Mensagem enviada com sucesso!</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} required />
                            <Input label="E-mail" name="email" value={formData.email} onChange={handleChange} type="email" required />
                            <Input label="Telefone" name="phone" value={formData.phone} onChange={handleChange} maxLength={15} required />
                            <Select 
                                label="Assunto" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                options={[
                                    {label: "Dúvida Institucional", value: "institucional"}, 
                                    {label: "Parcerias de Pesquisa", value: "parceria"}, 
                                    {label: "Trabalhe Conosco", value: "rh"},
                                    {label: "Portal da Transparência", value: "transparencia"}
                                ]} 
                            />
                            <div className="md:col-span-2">
                                <TextArea label="Como podemos ajudar?" name="message" value={formData.message} onChange={handleChange} rows="5" required />
                            </div>
                            <div className="md:col-span-2 mt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full md:w-auto bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:brightness-110 text-white font-bold py-4 px-12 rounded-full border-0 shadow-lg transition-transform hover:scale-105"
                                    isLoading={loading}
                                >
                                    {loading ? 'Enviando...' : 'Enviar Agora'}
                                </Button>
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