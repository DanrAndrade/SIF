import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Target, Users, MapPin, CheckCircle2, ArrowRight, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../apiConfig';

export default function TreinamentosInCompany() {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [formData, setFormData] = React.useState({
      name: '', email: '', company: '', phone: '', message: ''
  });

  const maskPhone = (value) => {
      if (!value) return "";
      let v = value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      
      if (v.length > 10) {
          // Mobile: (73) 98192-8547
          return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (v.length > 6) {
          // Fixed: (73) 3211-1234
          return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (v.length > 2) {
          return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      } else if (v.length > 0) {
          return v.replace(/(\d*)/, "($1");
      }
      return v;
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

      const payload = {
          ...formData,
          subject: 'treinamento-in-company',
          message: `Empresa: ${formData.company}\n\nInteresse em treinamento In-Company.`
      };

      try {
          const response = await fetch(`${API_BASE_URL}/leads.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (result.success) {
              setStatus('success');
              setFormData({ name: '', email: '', company: '', phone: '', message: '' });
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
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />
      
      {/* HERO PADRÃO SIF */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Bespoke Solutions</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
              Treinamentos <br/>
              <span className="text-[#007a3d]">In-Company</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
              Soluções personalizadas em educação corporativa, levadas diretamente ao coração da sua empresa.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        {/* SEÇÃO INTRODUTÓRIA */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] leading-tight tracking-tighter">Sua demanda, <br/><span className="text-[#007a3d]">nossa expertise.</span></h2>
                <p className="text-gray-500 text-xl leading-relaxed font-medium">Os treinamentos In-Company da SIF são desenhados sob medida para atender às necessidades específicas da sua organização, utilizando o conhecimento técnico-científico da UFV.</p>
                
                <div className="space-y-6">
                  {[
                    'Diagnóstico personalizado das necessidades',
                    'Ajuste de carga horária e cronograma',
                    'Foco em estudos de caso da própria empresa',
                    'Redução de custos logísticos para grandes equipes'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <CheckCircle2 size={16} className="text-[#007a3d]" />
                      </div>
                      <span className="text-xs font-black uppercase text-gray-400 tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="rounded-[40px] overflow-hidden shadow-xl aspect-square">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#1f2937] p-8 rounded-[40px] text-white">
                    <span className="text-[40px] font-bold font-heading text-[#007a3d] block mb-2">+10k</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Profissionais Treinados</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-8 rounded-[40px]">
                    <Target size={32} className="text-[#007a3d] mb-4" />
                    <h4 className="text-xs font-black uppercase text-[#1f2937] tracking-widest mb-2">Foco Total</h4>
                    <p className="text-[10px] text-gray-500 font-medium">Conteúdo adaptado ao seu ecossistema.</p>
                  </div>
                  <div className="rounded-[40px] overflow-hidden shadow-xl aspect-[3/4]">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXEMPLOS E CONTATO */}
        <section className="py-24 bg-[#f8f9fa]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-[#1f2937] rounded-[80px] p-12 md:p-24 text-white relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#007a3d] rounded-full blur-[180px] opacity-20 pointer-events-none"></div>
               
               <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                  <div className="lg:w-1/2 space-y-10">
                    <div>
                      <span className="text-[#007a3d] font-black uppercase text-[10px] tracking-[.3em] mb-6 block">Como prosseguir</span>
                      <h2 className="text-5xl md:text-7xl font-bold font-heading uppercase mb-8 leading-[0.9]">Vamos <span className="text-[#007a3d]">Planejar?</span></h2>
                      <p className="text-gray-400 text-base font-medium leading-relaxed">Nossa equipe está pronta para formatar o melhor programa de treinamento para seu time.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-[#007a3d] flex items-center justify-center shadow-lg"><Mail size={24} /></div>
                        <div>
                          <span className="block text-[9px] font-black uppercase text-gray-500 tracking-widest">Analista de Eventos e Treinamentos</span>
                          <span className="text-lg font-bold text-white">eventos@sif.org.br</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#1f2937] shadow-lg"><Phone size={24} /></div>
                        <div>
                          <span className="block text-[9px] font-black uppercase text-gray-500 tracking-widest">Atendimento Comercial</span>
                          <span className="text-lg font-bold text-white">(31) 3899-1185</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/2 bg-white rounded-[60px] p-12 shadow-2xl relative">
                    <h4 className="text-2xl font-bold font-heading uppercase text-[#1f2937] mb-8">Solicitar <span className="text-[#007a3d]">Proposta</span></h4>
                    
                    {status === 'success' && (
                        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-[#007a3d] animate-in zoom-in-95">
                            <CheckCircle size={28} />
                            <div className="flex flex-col">
                                <span className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Sucesso</span>
                                <span className="text-xs font-medium">Sua proposta foi solicitada com sucesso!</span>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 animate-in zoom-in-95">
                            <AlertCircle size={28} />
                            <div className="flex flex-col">
                                <span className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Erro</span>
                                <span className="text-xs font-medium">Ocorreu um erro. Tente novamente mais tarde.</span>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
                        <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-[#007a3d] outline-none transition-all" placeholder="Seu nome..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail Corporativo</label>
                        <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-[#007a3d] outline-none transition-all" placeholder="email@empresa.com.br" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Fone para contato</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" inputMode="numeric" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-[#007a3d] outline-none transition-all" placeholder="(00) 00000-0000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sua Empresa</label>
                        <input name="company" value={formData.company} onChange={handleChange} required type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-[#007a3d] outline-none transition-all" placeholder="Nome da empresa..." />
                      </div>
                      <Button className="w-full" isLoading={loading}>Enviar Solicitação</Button>
                    </form>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
