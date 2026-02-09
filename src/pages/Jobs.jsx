import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Upload, CheckCircle2, FileText, ChevronRight, Target, Eye, Heart, ChevronLeft, X, DollarSign, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/FormElements';
import NoiseOverlay from '../components/ui/NoiseOverlay';

// Importando o icone para o favicon
import iconLogo from '../assets/icone.svg'; 

// Em produção, troque pelo seu domínio real
const API_URL = 'http://localhost/sif-api';

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // 1. Configura Título e Favicon
    document.title = "SIF | Trabalhe Conosco";
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = iconLogo;

    // 2. Busca Vagas
    fetch(`${API_URL}/jobs.php`)
      .then(res => res.json())
      .then(data => {
          const formattedData = data.map(j => ({
              ...j,
              requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : j.requirements
          }));
          setJobs(formattedData);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    const section = document.getElementById('jobs-section');
    if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#2E7D32] selection:text-white flex flex-col">
      <Navbar />
      
      {/* DEFINIÇÃO DE GRADIENTES SIF */}
      <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B5E20" />
                <stop offset="100%" stopColor="#2E7D32" />
            </linearGradient>
            <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col gap-24 w-full">
          {/* --- HERO SECTION PADRONIZADO --- */}
          <div className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center bg-fixed"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-black/20"></div>
                <NoiseOverlay opacity={0.45} />
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 rounded-tr-[80px] z-10"></div>

             <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-8 lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-[#FFC107] animate-pulse"></span>
                        <span className="text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">Carreiras SIF</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight uppercase">
                        Trabalhe <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">
                            Conosco
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed font-light mb-10 border-l-2 border-[#2E7D32] pl-6">
                        Faça parte de uma instituição que é referência nacional em inovação e tecnologia para o setor florestal.
                    </p>

                    <button onClick={scrollToContent} className="group flex items-center gap-3 text-white font-medium hover:text-[#FFC107] transition-colors">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFC107] transition-all">
                            <ChevronDown className="animate-bounce" />
                        </div>
                        <span className="uppercase text-xs tracking-widest font-bold">Ver Oportunidades</span>
                    </button>
                </div>
             </div>
          </div>

          {/* --- MISSÃO, VISÃO E VALORES (ATUALIZADO) --- */}
          <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Target size={56} style={{ stroke: "url(#grad-green)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-4 text-[#1f2937] tracking-wider">Missão</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Promover o desenvolvimento do setor florestal gerando inovação com sinergia Universidade & Empresa.
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Eye size={56} style={{ stroke: "url(#grad-gold)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-4 text-[#1f2937] tracking-wider">Visão</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Ser líder nacional em inovação e imprescindível no desenvolvimento tecnológico florestal.
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Heart size={56} style={{ stroke: "url(#grad-green)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-4 text-[#1f2937] tracking-wider">Valores</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Inovação • Proatividade • Sustentabilidade • Integridade • Comprometimento • Profissionalismo
                        </p>
                    </div>
                </div>
          </div>

          {/* LISTA VAGAS */}
          <div id="jobs-section" className="container mx-auto px-6 max-w-6xl scroll-mt-32">
             <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
                <div>
                    <span className="text-[#2E7D32] font-bold uppercase tracking-[0.2em] text-xs block mb-2">Oportunidades</span>
                    <h2 className="text-3xl md:text-4xl font-bold uppercase text-[#1f2937] section-heading tracking-tight">Vagas Disponíveis</h2>
                </div>
                <span className="hidden md:inline-block px-5 py-2 bg-[#2E7D32]/10 rounded-full text-xs font-bold text-[#2E7D32] uppercase tracking-wider border border-[#2E7D32]/20">
                    {jobs.length} Posições
                </span>
             </div>
             
             {loading ? (
                 <div className="text-center py-20 text-gray-400 animate-pulse font-bold uppercase tracking-widest">Carregando vagas...</div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentJobs.map((job) => (
                        <div key={job.id} onClick={() => setSelectedJob(job)} className="w-full bg-white rounded-[32px] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#2E7D32] mb-8 group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-300 shadow-sm"><Briefcase size={26} /></div>
                                <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-4 leading-tight group-hover:text-[#2E7D32] transition-colors line-clamp-2">{job.title}</h3>
                                <div className="flex flex-col gap-3 mb-8">
                                    <span className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide"><MapPin size={16} className="text-[#FFC107]" /> {job.location}</span>
                                    <span className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide"><Clock size={16} className="text-[#FFC107]" /> {job.type}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#2E7D32] transition-colors">Detalhes da Vaga</span>
                                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1f2937] group-hover:text-white transition-all shadow-sm"><ChevronRight size={16} /></div>
                            </div>
                        </div>
                    ))}
                 </div>
             )}

             {totalPages > 1 && (
                 <div className="mt-16 flex justify-center items-center gap-3">
                     <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#2E7D32] hover:border-[#2E7D32] transition-all disabled:opacity-30"><ChevronLeft size={24} /></button>
                     <span className="text-sm font-bold text-gray-400 px-6 uppercase tracking-widest">Página {currentPage} de {totalPages}</span>
                     <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#2E7D32] hover:border-[#2E7D32] transition-all disabled:opacity-30"><ChevronRight size={24} /></button>
                 </div>
             )}
          </div>
          
          {/* BANCO DE TALENTOS */}
          <div className="container mx-auto px-6 max-w-6xl pb-24">
             <div className="mt-12 bg-white border border-gray-100 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 transition-transform duration-1000 group-hover:scale-110"></div>
                 <div className="relative z-10 text-center md:text-left">
                     <h3 className="text-3xl font-bold uppercase text-[#1f2937] mb-3 font-heading tracking-tight">Não encontrou sua vaga?</h3>
                     <p className="text-gray-500 font-medium text-lg">Cadastre seu currículo em nosso Banco de Talentos Geral.</p>
                 </div>
                 <Button 
                    onClick={() => setSelectedJob({ id: 'banco', title: "Banco de Talentos", location: "Geral", type: "Cadastro Reserva", description: "Seu currículo ficará em nossa base para futuras oportunidades dentro dos nossos pilares técnicos e científicos.", requirements: [] })} 
                    className="relative z-10 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:scale-105 transition-transform px-12 py-5 text-white font-bold rounded-full shadow-lg border-0" 
                    icon={Upload}
                 >
                    Enviar Currículo
                 </Button>
             </div>
          </div>
      </div>
      <Footer />
      {selectedJob && <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}

// --- MODAL DE APLICAÇÃO ---
function ApplicationModal({ job, onClose }) {
    const [step, setStep] = useState(1);
    const [submitStatus, setSubmitStatus] = useState('idle'); 
    
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', linkedin: '' });
    const [file, setFile] = useState(null);

    const maskPhone = (value) => {
      return value
        .replace(/\D/g, "") 
        .replace(/^(\d{2})(\d)/g, "($1) $2") 
        .replace(/(\d)(\d{4})$/, "$1-$2") 
        .slice(0, 15); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('loading');

        const data = new FormData();
        data.append('job_id', job.id);
        data.append('job_title', job.title);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('linkedin', formData.linkedin);
        if (file) data.append('cv', file);

        try {
            const response = await fetch(`${API_URL}/candidates.php`, {
                method: 'POST',
                body: data 
            });
            const result = await response.json();
            
            if (result.success) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[#1f2937]/90 backdrop-blur-md" onClick={onClose}></div>
                <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
                    <div className="w-24 h-24 bg-green-50 text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1f2937] uppercase mb-3 font-heading tracking-tight">Sucesso!</h3>
                    <p className="text-gray-500 mb-10 text-lg">Sua candidatura para <strong>{job.title}</strong> foi enviada. Boa sorte!</p>
                    <Button onClick={onClose} className="w-full bg-[#1f2937] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2E7D32] transition-colors">Fechar Janela</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1f2937]/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-6 duration-500">
                
                <div className="bg-[#1f2937] p-8 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <span className="text-[#FFC107] font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
                            {step === 1 ? "Informações da Posição" : "Formulário de Inscrição"}
                        </span>
                        <h2 className="text-3xl font-bold font-heading uppercase leading-tight tracking-tight">{job.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-[#2E7D32] transition-all relative z-10"><X size={24} /></button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
                    {step === 1 ? (
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl border border-gray-100"><MapPin size={16} className="text-[#2E7D32]"/> {job.location}</span>
                                <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl border border-gray-100"><Clock size={16} className="text-[#2E7D32]"/> {job.type}</span>
                                {job.salary && <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl border border-gray-100"><DollarSign size={16} className="text-[#2E7D32]"/> {job.salary}</span>}
                            </div>
                            
                            <div className="space-y-5">
                                <h4 className="font-black text-[#1f2937] uppercase tracking-[0.15em] text-sm flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-[#2E7D32]"></span> Descrição da Vaga
                                </h4>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base font-medium">{job.description}</p>
                            </div>

                            {job.requirements && job.requirements.length > 0 && (
                                <div className="space-y-5">
                                    <h4 className="font-black text-[#1f2937] uppercase tracking-[0.15em] text-sm flex items-center gap-3">
                                        <span className="w-8 h-[2px] bg-[#2E7D32]"></span> Requisitos
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {job.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-base text-gray-600 font-medium">
                                                <CheckCircle2 size={18} className="text-[#2E7D32] mt-1 shrink-0" /> {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-100">
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                                >
                                    Quero me candidatar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                <Input 
                                    label="Telefone / WhatsApp" 
                                    type="tel" 
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} 
                                    required 
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                                <Input label="Perfil do LinkedIn (Opcional)" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="linkedin.com/in/perfil" />
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Currículo Atualizado (PDF/DOC)</label>
                                <div className="relative group">
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] px-6 py-12 flex flex-col items-center justify-center text-center group-hover:border-[#2E7D32] group-hover:bg-[#2E7D32]/5 transition-all duration-300">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 text-[#2E7D32] group-hover:scale-110 transition-transform">
                                            {file ? <FileText size={32}/> : <Upload size={32} />}
                                        </div>
                                        {file ? <p className="text-base font-bold text-[#1f2937]">{file.name}</p> : <><p className="text-base font-bold text-gray-600 uppercase tracking-widest">Clique para selecionar</p><p className="text-xs text-gray-400 mt-2">Formatos PDF, DOC ou DOCX (Máximo 5MB)</p></>}
                                    </div>
                                </div>
                            </div>

                            {submitStatus === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-widest">Erro ao enviar. Tente novamente mais tarde.</p>}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-50 text-gray-400 font-bold rounded-2xl uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">Voltar</button>
                                <button 
                                    type="submit" 
                                    disabled={submitStatus === 'loading'}
                                    className="flex-[2] bg-[#1f2937] text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#2E7D32] transition-all disabled:opacity-50"
                                >
                                    {submitStatus === 'loading' ? 'Processando...' : 'Enviar Inscrição'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}