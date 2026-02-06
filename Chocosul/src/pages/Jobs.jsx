import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, X, Upload, CheckCircle2, FileText, ChevronRight, Target, Eye, Heart, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// MOCK DE DADOS
const allJobs = [
  { id: 1, title: "Representante Comercial", location: "Eunápolis e Região", type: "PJ / Autônomo", salary: "Comissão + Bônus", description: "Prospecção de clientes e gestão de carteira na região do extremo sul.", requirements: ["Ensino Médio Completo", "Veículo Próprio", "Experiência em Vendas"] },
  { id: 2, title: "Motorista Cat D", location: "Eunápolis - BA", type: "CLT - Efetivo", salary: "Compatível", description: "Entregas roteirizadas, conferência de carga e descarga e zelo pelo veículo.", requirements: ["CNH D", "MOPP", "Experiência Comprovada"] },
  { id: 3, title: "Auxiliar de Logística", location: "CD Eunápolis", type: "CLT - Efetivo", salary: "Salário + Benefícios", description: "Atuar na separação de mercadorias (picking), organização de estoque e conferência.", requirements: ["Ensino Médio", "Atenção Concentrada"] },
  { id: 4, title: "Assistente Administrativo", location: "Eunápolis - BA", type: "CLT - Efetivo", salary: "A combinar", description: "Rotinas de escritório, faturamento e atendimento telefônico.", requirements: ["Excel Intermediário", "Boa Comunicação"] },
  { id: 5, title: "Jovem Aprendiz", location: "Eunápolis - BA", type: "Aprendizado", salary: "Bolsa Auxílio", description: "Suporte operacional e administrativo, primeiro emprego.", requirements: ["Cursando Ensino Médio", "Vontade de Aprender"] },
  { id: 6, title: "Gerente de Contas", location: "Teixeira de Freitas", type: "PJ", salary: "Alta Comissão", description: "Gestão de grandes contas (Key Account) e negociação estratégica.", requirements: ["Experiência Prévia", "Superior Completo"] },
  { id: 7, title: "Conferente", location: "CD Eunápolis", type: "CLT", salary: "Salário Base", description: "Conferência de entrada e saída de mercadorias via coletor WMS.", requirements: ["Experiência com WMS", "Disponibilidade de Horário"] },
  { id: 8, title: "Promotor de Vendas", location: "Porto Seguro", type: "CLT", salary: "Salário + Variável", description: "Abastecimento, precificação e layoutização em PDVs.", requirements: ["Moto própria", "CNH A"] },
];

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  
  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = allJobs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll suave para o topo da lista de vagas
    const section = document.getElementById('jobs-section');
    if (section) {
        // Offset de 120px para não esconder o título atrás do menu fixo
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] overflow-x-hidden selection:bg-[#D91A3C] selection:text-white flex flex-col">
      <Navbar scrolled={true} mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

      {/* GRADIENTES SVG */}
      <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D91A3C" />
                <stop offset="100%" stopColor="#FF4D6D" />
            </linearGradient>
            <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
        </defs>
      </svg>

      {/* CONTAINER GERAL */}
      <div className="flex flex-col gap-24 w-full">

          {/* 1. HERO SECTION */}
          <div className="pt-40 pb-24 px-4 text-center bg-[#1f2937] rounded-b-[60px] relative overflow-hidden shadow-xl w-full">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#D91A3C] rounded-full blur-[120px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC107] rounded-full blur-[120px] opacity-10 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

             <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-[#FFC107] font-bold uppercase tracking-[0.3em] text-xs mb-4 block animate-pulse">Carreira</span>
                <h1 className="text-4xl md:text-6xl font-bold font-heading uppercase text-white mb-6">
                    Trabalhe <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D91A3C] to-[#ff4d6d]">Conosco</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Faça parte de uma das maiores distribuidoras do sul da Bahia.
                </p>
             </div>
          </div>

          {/* 2. SEÇÃO MISSÃO, VISÃO E VALORES */}
          <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
                    {/* ITEM 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Target size={48} style={{ stroke: "url(#grad-red)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-3 text-[#1f2937]">Missão</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                            Distribuir produtos de qualidade com agilidade, fortalecendo o varejo local e gerando valor.
                        </p>
                    </div>

                    {/* ITEM 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Eye size={48} style={{ stroke: "url(#grad-gold)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-3 text-[#1f2937]">Visão</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                            Ser a referência absoluta em logística e distribuição no sul da Bahia até 2030.
                        </p>
                    </div>

                    {/* ITEM 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                            <Heart size={48} style={{ stroke: "url(#grad-blue)" }} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold font-heading uppercase mb-3 text-[#1f2937]">Valores</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                            Ética, compromisso, inovação e, acima de tudo, respeito pelas pessoas.
                        </p>
                    </div>
                </div>
          </div>

          {/* 3. SEÇÃO LISTA DE VAGAS */}
          <div id="jobs-section" className="container mx-auto px-4 max-w-6xl">
             
             <div className="flex items-center justify-between mb-12 px-2">
                <div>
                    <span className="text-[#D91A3C] font-bold uppercase tracking-widest text-xs block mb-2">Oportunidades</span>
                    <h2 className="text-3xl md:text-4xl font-bold uppercase text-[#1f2937] section-heading">Vagas Disponíveis</h2>
                </div>
                <span className="hidden md:inline-block px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">
                    {allJobs.length} Posições Abertas
                </span>
             </div>

             {/* GRID RESPONSIVO ATUALIZADO:
                - Mobile: grid-cols-1 (Um embaixo do outro, sem carrossel)
                - Desktop: grid-cols-2 ou 3
             */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {currentJobs.map((job) => (
                    <div 
                        key={job.id} 
                        onClick={() => setSelectedJob(job)}
                        className="
                            w-full
                            bg-white rounded-[32px] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 
                            transition-all duration-300 cursor-pointer group border border-gray-100 
                            flex flex-col justify-between h-full relative overflow-hidden
                        "
                    >
                        {/* Linha colorida no topo */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D91A3C] to-[#ff4d6d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] flex items-center justify-center text-[#D91A3C] mb-6 group-hover:bg-[#D91A3C] group-hover:text-white transition-colors shadow-sm">
                                <Briefcase size={22} />
                            </div>
                            <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-3 leading-tight group-hover:text-[#D91A3C] transition-colors line-clamp-2">
                                {job.title}
                            </h3>
                            <div className="flex flex-col gap-2.5 mb-6">
                                <span className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide">
                                    <MapPin size={14} className="text-[#FFC107]" /> {job.location}
                                </span>
                                <span className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide">
                                    <Clock size={14} className="text-[#FFC107]" /> {job.type}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#D91A3C] transition-colors">Detalhes</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1f2937] group-hover:text-white transition-all shadow-sm">
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}
             </div>

             {/* PAGINAÇÃO NUMÉRICA */}
             {totalPages > 1 && (
                 <div className="mt-16 flex justify-center items-center gap-2">
                     <button 
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1f2937] disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
                     >
                         <ChevronLeft size={20} />
                     </button>

                     {Array.from({ length: totalPages }).map((_, index) => {
                         const pageNumber = index + 1;
                         return (
                            <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border ${
                                    currentPage === pageNumber
                                    ? 'bg-[#D91A3C] border-[#D91A3C] text-white shadow-lg shadow-red-500/30 transform scale-105'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#D91A3C] hover:text-[#D91A3C]'
                                }`}
                            >
                                {pageNumber}
                            </button>
                         );
                     })}

                     <button 
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1f2937] disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                     >
                         <ChevronRight size={20} />
                     </button>
                 </div>
             )}
          </div>

          {/* 4. SEÇÃO "NÃO ENCONTROU SUA VAGA?" */}
          <div className="container mx-auto px-4 max-w-6xl pb-20">
             <div className="mt-12 mb-40 bg-[#fff] border border-gray-200 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 transition-transform duration-700 group-hover:scale-125"></div>

                 <div className="relative z-10 text-center md:text-left">
                     <h3 className="text-2xl font-bold uppercase text-[#1f2937] mb-2 font-heading">Não encontrou sua vaga?</h3>
                     <p className="text-gray-500 font-medium">Cadastre seu currículo em nosso Banco de Talentos Geral e seja avisado.</p>
                 </div>
                 <button 
                    onClick={() => setSelectedJob({ title: "Banco de Talentos", location: "Geral", type: "Cadastro Reserva", description: "Seu currículo ficará em nossa base para futuras oportunidades.", requirements: [] })}
                    className="relative z-10 px-8 py-4 bg-[#1f2937] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#D91A3C] transition-colors shadow-lg whitespace-nowrap flex items-center gap-3"
                 >
                     <Upload size={16} />
                     Enviar Currículo
                 </button>
             </div>
          </div>
      
      </div>

      <Footer />

      {/* MODAL */}
      {selectedJob && (
          <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

    </div>
  );
}

// MODAL (Mantido igual)
function ApplicationModal({ job, onClose }) {
    const [step, setStep] = useState(1);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Simulação: Dados enviados para o Backend!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1f2937]/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-[#1f2937] p-6 text-white flex justify-between items-start shrink-0">
                    <div>
                        <span className="text-[#FFC107] font-bold text-xs uppercase tracking-widest mb-2 block">
                            {step === 1 ? "Detalhes da Vaga" : "Ficha de Inscrição"}
                        </span>
                        <h2 className="text-2xl font-bold font-heading uppercase leading-none">
                            {job.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-[#D91A3C] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                                <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"><MapPin size={14} className="text-[#D91A3C]"/> {job.location}</span>
                                <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"><Clock size={14} className="text-[#D91A3C]"/> {job.type}</span>
                                {job.salary && <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"><DollarSign size={14} className="text-[#D91A3C]"/> {job.salary}</span>}
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-[#1f2937] uppercase tracking-wider">Descrição</h4>
                                <p className="text-gray-600 leading-relaxed">{job.description}</p>
                            </div>
                            {job.requirements && job.requirements.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-bold text-[#1f2937] uppercase tracking-wider">Requisitos</h4>
                                    <ul className="space-y-2">
                                        {job.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                                <CheckCircle2 size={16} className="text-[#D91A3C] shrink-0 mt-0.5" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="pt-6 border-t border-gray-100">
                                <button onClick={() => setStep(2)} className="w-full py-4 bg-[#D91A3C] text-white font-bold rounded-xl uppercase tracking-wider hover:bg-[#b01530] transition-all shadow-lg">Quero me candidatar</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                             {/* Form Fields... */}
                             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-center mb-6">
                                <Briefcase className="text-blue-600 shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Candidatando para:</p>
                                    <p className="text-sm font-bold text-blue-900">{job.title}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Nome Completo</label>
                                    <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D91A3C] focus:ring-1 focus:ring-[#D91A3C]" placeholder="Seu nome" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
                                    <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D91A3C] focus:ring-1 focus:ring-[#D91A3C]" placeholder="seu@email.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Telefone</label>
                                    <input type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D91A3C] focus:ring-1 focus:ring-[#D91A3C]" placeholder="(00) 00000-0000" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">LinkedIn</label>
                                    <input type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D91A3C] focus:ring-1 focus:ring-[#D91A3C]" placeholder="Link do perfil" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Currículo</label>
                                <div className="relative group">
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 flex flex-col items-center justify-center text-center group-hover:border-[#D91A3C] group-hover:bg-red-50/30 transition-all">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-3 text-[#D91A3C]">
                                            {fileName ? <FileText size={24}/> : <Upload size={24} />}
                                        </div>
                                        {fileName ? <p className="text-sm font-bold text-[#1f2937]">{fileName}</p> : <><p className="text-sm font-bold text-gray-600">Clique para selecionar</p><p className="text-xs text-gray-400">PDF/DOCX (Max 5MB)</p></>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl uppercase tracking-wider hover:bg-gray-200 transition-all">Voltar</button>
                                <button type="submit" className="flex-[2] py-4 bg-[#D91A3C] text-white font-bold rounded-xl uppercase tracking-wider hover:bg-[#b01530] transition-all shadow-lg">Enviar Inscrição</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}