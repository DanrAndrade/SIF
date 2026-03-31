import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Upload, CheckCircle2, FileText, ChevronRight, Target, Eye, Heart, ChevronLeft, X, DollarSign, ChevronDown, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/FormElements';
import NoiseOverlay from '../components/ui/NoiseOverlay';

// Importando o icone para o favicon
import iconLogo from '../assets/icone.svg'; 

import { API_BASE_URL } from '../apiConfig';

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const itemsPerPage = 6;

  const categories = ['Todas', 'SIF', 'Programa Germinar'];

  useEffect(() => {
    // 1. Configura Título e Favicon
    document.title = "SIF | Trabalhe Conosco";
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = iconLogo;

    // 2. Busca Vagas
    fetch(`${API_BASE_URL}/jobs.php`)
      .then(res => res.json())
      .then(data => {
          const formattedData = data.map(j => ({
              ...j,
              category: j.title.toLowerCase().includes('germinar') || j.location.toLowerCase().includes('campo') ? 'Programa Germinar' : 'SIF',
              requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : j.requirements
          })).filter(job => job.active == 1 || job.active === true);
          setJobs(formattedData);
          setFilteredJobs(formattedData);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeCategory === 'Todas') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(j => j.category === activeCategory));
    }
    setCurrentPage(1);
  }, [activeCategory, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    const section = document.getElementById('jobs-section');
    if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const scrollToContent = () => {
    const section = document.getElementById('jobs-section');
    if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#059669] selection:text-white flex flex-col">
      <Navbar />
      
      {/* DEFINIÇÃO DE GRADIENTES SIF */}
      <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col w-full">
          {/* HERO PADRÃO SIF COM IMAGEM */}
          <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
              <NoiseOverlay opacity={0.4} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-tr-[80px] z-10"></div>
            <div className="container mx-auto px-6 md:px-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
                  <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Carreiras & Talentos SIF</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
                  Trabalhe <br/>
                  <span className="text-[#059669]">Conosco</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
                  Faça parte de uma instituição que é referência nacional em ciência e tecnologia para o setor florestal.
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

          {/* --- MISSÃO, VISÃO E VALORES --- */}
          <div className="py-24 bg-white">
              <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                <Target size={56} style={{ stroke: "url(#grad-green)" }} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-black font-heading uppercase mb-4 text-[#1f2937] tracking-[0.2em]">Missão</h3>
                            <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                Promover o desenvolvimento florestal gerando inovação com sinergia Universidade & Empresa.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                <Eye size={56} style={{ stroke: "url(#grad-gold)" }} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-black font-heading uppercase mb-4 text-[#1f2937] tracking-[0.2em]">Visão</h3>
                            <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                Ser líder nacional em ciência e imprescindível no desenvolvimento tecnológico florestal.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                                <Heart size={56} style={{ stroke: "url(#grad-green)" }} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-black font-heading uppercase mb-4 text-[#1f2937] tracking-[0.2em]">Valores</h3>
                            <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                Inovação • Proatividade • Sustentabilidade • Integridade • Comprometimento • Profissionalismo
                            </p>
                        </div>
                    </div>
              </div>
          </div>

          {/* LISTA VAGAS */}
          <div id="jobs-section" className="py-24 bg-[#f8f9fa] scroll-mt-32">
             <div className="container mx-auto px-6 max-w-6xl">
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-gray-100 pb-10 gap-8">
                    <div>
                        <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Oportunidades</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tight">Vagas Abertas</h2>
                    </div>
                    
                    <div className="flex p-1 bg-white rounded-2xl w-max shadow-sm border border-gray-100">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeCategory === cat 
                            ? "bg-[#1f2937] text-white shadow-lg" 
                            : "text-gray-400 hover:text-[#1f2937]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 {loading ? (
                     <div className="text-center py-20 text-gray-400 animate-pulse font-black uppercase tracking-[0.3em] text-xs">Aguarde, carregando vagas...</div>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {currentJobs.map((job) => (
                            <div key={job.id} onClick={() => setSelectedJob(job)} className="w-full bg-white rounded-[40px] p-10 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1.5 ${job.category === 'SIF' ? 'bg-[#059669]' : 'bg-orange-500'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
                                
                                <div>
                                    <div className="flex justify-between items-start mb-10">
                                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                                        job.category === 'SIF' 
                                        ? "bg-emerald-50 text-[#059669] group-hover:bg-[#059669] group-hover:text-white" 
                                        : "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                                      }`}>
                                        <Briefcase size={28} />
                                      </div>
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        job.category === 'SIF'
                                        ? "border-emerald-100 text-emerald-600 bg-emerald-50/50"
                                        : "border-orange-100 text-orange-600 bg-orange-50/50"
                                      }`}>
                                        {job.category}
                                      </span>
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading uppercase text-[#1f2937] mb-6 leading-tight group-hover:text-[#059669] transition-colors line-clamp-2">{job.title}</h3>
                                    <div className="flex flex-col gap-4 mb-10">
                                        <span className="flex items-center gap-3 text-[11px] text-gray-400 font-black uppercase tracking-widest"><MapPin size={16} className="text-[#059669]" /> {job.location}</span>
                                        <span className="flex items-center gap-3 text-[11px] text-gray-400 font-black uppercase tracking-widest"><Clock size={16} className="text-[#059669]" /> {job.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-[#059669] transition-colors">Detalhes da Oportunidade</span>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#1f2937] group-hover:text-white transition-all shadow-sm"><ChevronRight size={18} /></div>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}

                 {totalPages > 1 && (
                     <div className="mt-20 flex justify-center items-center gap-4 text-[#1f2937]">
                         <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-[#1f2937] hover:text-white hover:border-[#1f2937] transition-all disabled:opacity-20"><ChevronLeft size={24} /></button>
                         <span className="text-xs font-black px-8 uppercase tracking-[0.3em]">Página {currentPage} de {totalPages}</span>
                         <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-[#1f2937] hover:text-white hover:border-[#1f2937] transition-all disabled:opacity-20"><ChevronRight size={24} /></button>
                     </div>
                 )}
             </div>
          </div>
          
          {/* BANCO DE TALENTOS */}
          <div className="py-24 bg-white">
             <div className="container mx-auto px-6 max-w-6xl">
                 <div className="bg-[#1f2937] border border-gray-800 rounded-[60px] p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-[#059669] rounded-full blur-[120px] opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-125"></div>
                     <div className="relative z-10 text-center md:text-left">
                         <span className="text-[#059669] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Banco de Talentos</span>
                         <h3 className="text-4xl md:text-6xl font-bold font-heading uppercase text-white mb-6 tracking-tight leading-none">Cresça com a SIF</h3>
                         <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">Não encontrou sua vaga ideal? Cadastre seu currículo para futuras oportunidades estratégicas em nossos pilares técnicos.</p>
                     </div>
                     <button 
                        onClick={() => setSelectedJob({ id: 'banco', title: "Banco de Talentos", location: "Geral", type: "Cadastro Reserva", category: "SIF", description: "Seu currículo ficará em nossa base estratégica para futuras oportunidades dentro dos nossos pilares técnicos e científicos.", requirements: [] })} 
                        className="relative z-10 bg-[#059669] hover:bg-[#047857] px-14 py-6 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-4" 
                     >
                        Enviar Currículo <Upload size={20} />
                     </button>
                 </div>
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
            const response = await fetch(`${API_BASE_URL}/candidates.php`, {
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
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-[#1f2937]/95 backdrop-blur-xl" onClick={onClose}></div>
                <div className="bg-white w-full max-w-md rounded-[60px] p-12 relative z-10 text-center shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#059669]"></div>
                    <div className="w-24 h-24 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1f2937] uppercase mb-4 font-heading tracking-tight leading-none">Recebido!</h3>
                    <p className="text-gray-500 mb-12 text-lg font-medium leading-relaxed">Sua candidatura para <strong>{job.title}</strong> foi registrada com sucesso.</p>
                    <button onClick={onClose} className="w-full bg-[#1f2937] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#059669] transition-all">Fechar Janela</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[#1f2937]/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-[60px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white">
                
                {/* HEAD PROGRESS BAR */}
                <div className="w-full h-1.5 bg-gray-100 flex relative z-20">
                    <div className={`h-full bg-[#059669] transition-all duration-700 ease-in-out ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                </div>

                <div className="bg-white p-10 flex justify-between items-start shrink-0 relative">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${job.category === 'SIF' ? 'bg-[#059669] text-white' : 'bg-orange-500 text-white'}`}>
                            {job.category}
                          </span>
                          <span className="text-gray-300 font-black text-[9px] uppercase tracking-[0.3em]">
                              Passo {step} de 2
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading uppercase text-[#1f2937] leading-tight tracking-tighter">{job.title}</h2>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-gray-50 text-[#1f2937] rounded-full flex items-center justify-center hover:bg-[#059669] hover:text-white transition-all"><X size={24} /></button>
                </div>

                <div className="p-10 overflow-y-auto custom-scrollbar bg-white flex-grow">
                    {step === 1 ? (
                        <div className="space-y-10">
                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center gap-3 bg-[#f8f9fa] text-[#1f2937] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-50"><MapPin size={16} className="text-[#059669]"/> {job.location}</span>
                                <span className="flex items-center gap-3 bg-[#f8f9fa] text-[#1f2937] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-50"><Clock size={16} className="text-[#059669]"/> {job.type}</span>
                            </div>
                            
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 text-[#059669]">
                                    <span className="w-10 h-[2px] bg-[#059669]"></span> Descrição da Vaga
                                </h4>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg font-medium">{job.description}</p>
                            </div>

                            {job.salary && <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl border border-gray-100"><DollarSign size={16} className="text-[#2E7D32]"/> {job.salary}</span>}

                            {job.requirements && job.requirements.length > 0 && (
                                <div className="space-y-6 pt-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 text-[#059669]">
                                        <span className="w-10 h-[2px] bg-[#059669]"></span> Requisitos & Diferenciais
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-4">
                                        {job.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-4 text-base text-gray-600 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} className="text-[#059669]" /></div> {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-12 border-t border-gray-50">
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="w-full bg-[#1f2937] hover:bg-[#059669] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-4"
                                >
                                    Ir para Formulário <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-[#1f2937] tracking-widest ml-1">Nome Completo</label>
                                    <input placeholder="Ex: José Silva" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-[#f8f9fa] border-gray-100 p-5 rounded-2xl focus:border-[#059669] focus:ring-0 outline-none text-sm font-medium transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-[#1f2937] tracking-widest ml-1">E-mail Pessoal</label>
                                    <input type="email" placeholder="jose@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full bg-[#f8f9fa] border-gray-100 p-5 rounded-2xl focus:border-[#059669] focus:ring-0 outline-none text-sm font-medium transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-[#1f2937] tracking-widest ml-1">Telefone / WhatsApp</label>
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} required placeholder="(00) 00000-0000" maxLength={15} className="w-full bg-[#f8f9fa] border-gray-100 p-5 rounded-2xl focus:border-[#059669] focus:ring-0 outline-none text-sm font-medium transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-[#1f2937] tracking-widest ml-1">LinkedIn (Opcional)</label>
                                    <input placeholder="linkedin.com/in/perfil" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-[#f8f9fa] border-gray-100 p-5 rounded-2xl focus:border-[#059669] focus:ring-0 outline-none text-sm font-medium transition-all" />
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <label className="text-[10px] font-black uppercase text-[#1f2937] tracking-widest ml-1 block">Anexar Currículo (PDF/DOC)</label>
                                <div className="relative group">
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    <div className={`w-full border-2 border-dashed rounded-[2.5rem] px-8 py-16 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                                      file ? 'border-[#059669] bg-emerald-50' : 'border-gray-100 bg-[#f8f9fa] group-hover:border-[#059669]'
                                    }`}>
                                        <div className={`w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center mb-6 transition-all duration-500 ${
                                          file ? 'bg-[#059669] text-white scale-110' : 'bg-white text-[#059669]'
                                        }`}>
                                            {file ? <CheckCircle2 size={36}/> : <Upload size={36} />}
                                        </div>
                                        {file ? (
                                          <div>
                                            <p className="text-lg font-bold text-[#1f2937]">{file.name}</p>
                                            <p className="text-[10px] text-[#059669] font-black uppercase mt-2">Clique para substituir</p>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Clique ou arraste seu arquivo</p>
                                            <p className="text-xs text-gray-300 mt-3 font-medium">Formatos PDF, DOC ou DOCX (Máximo 5MB)</p>
                                          </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {submitStatus === 'error' && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-widest">Erro ao enviar. Tente novamente mais tarde.</p>}

                            <div className="flex gap-6 pt-10 border-t border-gray-50">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 py-6 bg-gray-50 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-gray-100 transition-all">Voltar</button>
                                <button 
                                    type="submit" 
                                    disabled={submitStatus === 'loading'}
                                    className="flex-[2] bg-[#1f2937] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-[#059669] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {submitStatus === 'loading' ? (
                                      <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Enviando Dados...
                                      </>
                                    ) : 'Concluir Candidatura'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}