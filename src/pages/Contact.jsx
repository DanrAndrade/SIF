import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Input, Select, TextArea } from '../components/ui/FormElements';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

// Em produção, troque localhost pelo seu domínio real (ex: https://api.chocosul.com.br/leads.php)
const API_URL = 'http://localhost/chocosul-api/leads.php';

export default function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [formData, setFormData] = useState({
      name: '', email: '', phone: '', subject: 'fornecedor', message: ''
  });

  // --- MÁSCARA DE TELEFONE ---
  const maskPhone = (value) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca parênteses
      .replace(/(\d)(\d{4})$/, "$1-$2") // Coloca o hífen
      .slice(0, 15); // Limita tamanho
  };

  const handleChange = (e) => {
      let { name, value } = e.target;
      
      // Aplica máscara apenas no telefone
      if (name === 'phone') {
          value = maskPhone(value);
      }

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
              setFormData({ name: '', email: '', phone: '', subject: 'fornecedor', message: '' }); 
          } else {
              setStatus('error');
          }
      } catch (error) {
          console.error("Erro no envio:", error);
          setStatus('error');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="font-sans text-gray-900 bg-[#f8f9fa] min-h-screen flex flex-col">
      <Navbar scrolled={true} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex-grow pt-32 pb-16 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
            <div className="text-center flex flex-col items-center">
                <SectionHeader 
                    align="center"
                    tag="Fale Conosco"
                    title="Vamos Iniciar uma<br/><span class='text-[#D91A3C]'>Parceria?</span>"
                    subtitle="Preencha o formulário abaixo e nossa equipe comercial entrará em contato em até 24 horas úteis."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                {/* Lateral: Informações */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <h3 className="text-xl font-bold uppercase mb-8 section-heading">Canais Diretos</h3>
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#D91A3C]/10 text-[#D91A3C] rounded-2xl flex items-center justify-center shrink-0"><Phone size={24} /></div>
                                <div className="flex-1 min-w-0"><span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Telefone</span><p className="font-bold text-lg text-[#1f2937] break-words">+55 (73) 3511-1050</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFC107]/10 text-[#b45309] rounded-2xl flex items-center justify-center shrink-0"><Mail size={24} /></div>
                                <div className="flex-1 min-w-0"><span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</span><p className="font-bold text-lg text-[#1f2937] break-all">comercial@chocosul.com.br</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center shrink-0"><MapPin size={24} /></div>
                                <div className="flex-1 min-w-0"><span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Sede</span><p className="font-bold text-sm text-[#1f2937] leading-relaxed break-words">Rod. BR 101 – Km 717,5 – nº 2251<br/>Eunápolis - BA<br/>CEP: 45825-970</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D91A3C]/5 rounded-bl-[100px] pointer-events-none"></div>
                        <h3 className="text-2xl font-bold uppercase mb-8 section-heading">Envie sua Mensagem</h3>
                        
                        {status === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800">
                                <CheckCircle size={20} />
                                <span className="font-bold text-sm">Mensagem enviada com sucesso! Em breve retornaremos.</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
                                <AlertCircle size={20} />
                                <span className="font-bold text-sm">Erro ao enviar. Verifique sua conexão ou tente mais tarde.</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome ou da empresa" required />
                            <Input label="E-mail Corporativo" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="email@empresa.com" required />
                            
                            {/* Input com Máscara e MaxLength */}
                            <Input 
                                label="Telefone / WhatsApp" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                type="tel" 
                                placeholder="(73) 99999-9999" 
                                required
                                maxLength={15} 
                            />

                            <Select 
                                label="Assunto" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                options={[
                                    {label: "Quero ser Fornecedor", value: "fornecedor"}, 
                                    {label: "Quero Revender", value: "revenda"}, 
                                    {label: "Trabalhe Conosco", value: "rh"}
                                ]} 
                            />
                            <div className="md:col-span-2">
                                <TextArea label="Mensagem" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Como podemos ajudar sua empresa?" required />
                            </div>
                            <div className="md:col-span-2 mt-4">
                                <Button type="submit" variant="primary" icon={Send} className="w-full md:w-auto" isLoading={loading}>
                                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                                </Button>
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