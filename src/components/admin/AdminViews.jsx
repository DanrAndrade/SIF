import React, { useState, useEffect } from 'react';
import { jobCategory } from '../../utils/jobCategories';
import { useConfirm, useDirty, AdminPage, PrimaryButton, SecondaryButton, ItemActions } from './kit';
import { Search, Mail, Phone, Calendar, CheckCircle2, XCircle, Eye, Trash2, Edit, Plus, Send, AlertTriangle, FileText, Download, User, X, Undo2, RefreshCw } from 'lucide-react';
import { Input, TextArea, Select } from '../ui/FormElements';
import Button from './kit/AdminButton'; // botão do painel (sem a seta do site)
import PageHeaderForm from './PageHeaderForm';
import SectionOrderForm from './SectionOrderForm';
import { PAGE_SECTIONS } from '../../utils/sectionOrder';
import PageContentForm from './PageContentForm';

import { API_BASE_URL } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';

const JOBS_HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
  hero_badge: 'Carreiras & Talentos SIF',
  hero_title_line1: 'Trabalhe',
  hero_title_highlight: 'Conosco',
  hero_subtitle: 'Faça parte de uma instituição que é referência nacional em ciência e tecnologia para o setor florestal.',
  hero_scroll_label: '',
};

const JOBS_CONTENT_DEFAULTS = {
  missao_title: 'Missão',
  missao_text: 'Promover o desenvolvimento florestal gerando inovação com sinergia Universidade & Empresa.',
  visao_title: 'Visão',
  visao_text: 'Ser líder nacional em ciência e imprescindível no desenvolvimento tecnológico florestal.',
  valores_title: 'Valores',
  valores_text: 'Inovação • Proatividade • Sustentabilidade • Integridade • Comprometimento • Profissionalismo',
  vagas_tag: 'Oportunidades',
  vagas_title: 'Vagas Abertas',
  vagas_cat_interna: 'Vagas Internas',
  vagas_cat_associadas: 'Vagas nas Associadas',
  vagas_cat_germinar: 'Germinar',
  banco_tag: 'Banco de Talentos',
  banco_title: 'Cresça com a SIF',
  banco_text: 'Não encontrou sua vaga ideal? Cadastre seu currículo para futuras oportunidades estratégicas em nossos pilares técnicos.',
  banco_btn_label: 'Cadastrar Currículo',
};

const JOBS_CONTENT_FIELDS = [
  { key: 'missao_title', label: 'Missão — Título', group: 'Missão' },
  { key: 'missao_text',  label: 'Missão — Texto',  type: 'textarea', rows: 2, group: 'Missão', fullWidth: true },
  { key: 'visao_title',  label: 'Visão — Título',  group: 'Visão' },
  { key: 'visao_text',   label: 'Visão — Texto',   type: 'textarea', rows: 2, group: 'Visão', fullWidth: true },
  { key: 'valores_title',label: 'Valores — Título',group: 'Valores' },
  { key: 'valores_text', label: 'Valores — Texto', type: 'textarea', rows: 2, group: 'Valores', fullWidth: true },
  { key: 'vagas_tag',    label: 'Tag (verde)',     group: 'Cabeçalho lista de vagas' },
  { key: 'vagas_title',  label: 'Título',          group: 'Cabeçalho lista de vagas' },
  { key: 'vagas_cat_interna',    label: 'Nome da categoria Internas',   group: 'Categorias de vaga' },
  { key: 'vagas_cat_associadas', label: 'Nome da categoria Associadas', group: 'Categorias de vaga' },
  { key: 'vagas_cat_germinar',   label: 'Nome da categoria Germinar',   group: 'Categorias de vaga' },
  { key: 'banco_tag',    label: 'Tag (verde)',     group: 'Banco de talentos' },
  { key: 'banco_title',  label: 'Título',          group: 'Banco de talentos' },
  { key: 'banco_text',   label: 'Texto',           type: 'textarea', rows: 2, group: 'Banco de talentos', fullWidth: true },
  { key: 'banco_btn_label', label: 'Texto do botão', group: 'Banco de talentos' },
];

// Modal Responsivo (Restaurado)
const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#1f2937] p-4 flex justify-between items-center shrink-0">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
        </div>
    </div>
);

// --- VIEW 1: LEADS ---
// source: 'site' (formulário do Contato) ou 'embrapii' (formulário da página EMBRAPII)
export const LeadsView = ({ source = 'site' }) => {
    const isEmb = source === 'embrapii';
    const listUrl = `${API_BASE_URL}/leads.php${isEmb ? '?source=embrapii' : ''}`;
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);

    const fetchLeads = async () => {
        try {
            const res = await fetch(listUrl, { credentials: 'include' });
            const data = await res.json();
            if(Array.isArray(data)) setLeads(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchLeads(); }, [source]);

    const updateStatus = async (id, newStatus) => {
        try {
            await apiRequest(`${API_BASE_URL}/leads.php`, {
                method: 'POST',
                body: JSON.stringify({ id, status: newStatus })
            });
            window.showToast?.('Status da mensagem atualizado.');
            fetchLeads(); 
            if (selectedLead) setSelectedLead(prev => ({ ...prev, status: newStatus }));
        } catch (err) { toastError(err); }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'unread': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200"><div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div> Não Lido</span>;
            case 'read': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">Em Análise</span>;
            case 'contacted': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200"><CheckCircle2 size={10}/> Respondido</span>;
            default: return null;
        }
    };

    return (
        <AdminPage title={isEmb ? 'Mensagens da EMBRAPII' : 'Leads / Contato'} subtitle={isEmb ? 'Mensagens enviadas pelo formulário da página Projetos SIF e EMBRAPII.' : 'Mensagens enviadas pelo formulário de contato do site.'} actions={<SecondaryButton icon={RefreshCw} onClick={fetchLeads}>Atualizar</SecondaryButton>}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider"><tr><th className="p-4">Status</th><th className="p-4">Nome / Empresa</th><th className="p-4">{isEmb ? 'Empresa / Cargo' : 'Assunto'}</th><th className="p-4">Data</th><th className="p-4 text-right">Ações</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.map(lead => (
                            <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${lead.status === 'unread' ? 'bg-red-50/10' : ''}`}>
                                <td className="p-4">{getStatusBadge(lead.status)}</td>
                                <td className="p-4"><p className="font-bold text-[#1f2937]">{lead.name}</p><p className="text-xs text-gray-500">{lead.email}</p></td>
                                <td className="p-4">{isEmb ? <><p className="font-medium text-gray-700">{lead.empresa}</p><p className="text-xs text-gray-500">{lead.cargo}</p></> : <span className="font-medium text-gray-700">{lead.subject}</span>}</td>
                                <td className="p-4 text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 text-right"><Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>Ver Detalhes</Button></td>
                            </tr>
                        ))}
                        {leads.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-gray-400">Nenhuma mensagem por enquanto.</td></tr>}
                    </tbody>
                </table>
            </div>
            {selectedLead && (
                <Modal title={`Mensagem de ${selectedLead.name}`} onClose={() => setSelectedLead(null)}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><label className="text-xs font-bold text-gray-400 uppercase">Email</label><p className="break-words">{selectedLead.email}</p></div>
                            {isEmb ? (<>
                                <div><label className="text-xs font-bold text-gray-400 uppercase">Empresa</label><p className="break-words">{selectedLead.empresa}</p></div>
                                <div><label className="text-xs font-bold text-gray-400 uppercase">Cargo</label><p className="break-words">{selectedLead.cargo}</p></div>
                            </>) : <div><label className="text-xs font-bold text-gray-400 uppercase">Telefone</label><p>{selectedLead.phone}</p></div>}
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Mensagem</label><div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1"><p className="text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p></div></div>
                        </div>
                        <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 flex-wrap">
                            {selectedLead.status !== 'unread' && <button onClick={() => updateStatus(selectedLead.id, 'unread')} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold uppercase hover:bg-red-50 flex items-center gap-2"><Undo2 size={16} /> Não Lido</button>}
                            {selectedLead.status === 'unread' && <Button size="sm" onClick={() => updateStatus(selectedLead.id, 'read')} variant="outline">Marcar Em Análise</Button>}
                            {selectedLead.status !== 'contacted' && <Button size="sm" onClick={() => updateStatus(selectedLead.id, 'contacted')} variant="primary" icon={CheckCircle2}>Respondido</Button>}
                        </div>
                    </div>
                </Modal>
            )}
        </AdminPage>
    );
};

// --- VIEW 2: CANDIDATOS ---
export const CandidatesView = () => {
    const [candidates, setCandidates] = useState([]);
    const [viewCandidate, setViewCandidate] = useState(null);

    const fetchCandidates = () => {
        fetch(`${API_BASE_URL}/candidates.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if(Array.isArray(data)) setCandidates(data); })
            .catch(err => console.error('Erro ao buscar candidatos:', err));
    };

    useEffect(() => { fetchCandidates(); }, []);

    const updateCandidateStatus = async (id, newStatus) => {
        try {
            await apiRequest(`${API_BASE_URL}/candidates.php`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ id, status: newStatus })
            });
            window.showToast?.('Status da candidatura atualizado.');
            fetchCandidates();
            if (viewCandidate) setViewCandidate(prev => ({ ...prev, status: newStatus }));
        } catch (err) { toastError(err); }
    };

    const handleDownload = (filename) => {
        window.open(`${API_BASE_URL}/download.php?file=${filename}`, '_blank');
    };

    return (
        <AdminPage title="Candidatos" subtitle="Candidaturas enviadas pela página Trabalhe Conosco." actions={<SecondaryButton icon={RefreshCw} onClick={fetchCandidates}>Atualizar</SecondaryButton>}>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="p-4 w-24">Status</th>
                            <th className="p-4">Candidato</th>
                            <th className="p-4">Vaga</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {candidates.map(c => (
                            <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${c.status === 'unread' ? 'bg-red-50/10' : ''}`}>
                                <td className="p-4">
                                    {c.status === 'unread' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-100 text-[10px] font-bold text-red-700 uppercase border border-red-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div> Novo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-100 text-[10px] font-bold text-green-700 uppercase border border-green-200">
                                            <CheckCircle2 size={10} /> Visto
                                        </span>
                                    )}
                                </td>
                                <td className="p-4"><p className="font-bold text-[#1f2937]">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p></td>
                                <td className="p-4"><span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 whitespace-nowrap">{c.job_title || "Geral"}</span></td>
                                <td className="p-4 text-xs font-bold text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right"><Button size="sm" variant="outline" onClick={() => setViewCandidate(c)}>Ver</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {viewCandidate && (
                <Modal title="Candidato" onClose={() => setViewCandidate(null)}>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shrink-0"><User size={32}/></div>
                            <div>
                                <h3 className="text-xl font-bold">{viewCandidate.name}</h3>
                                <p className="text-sm text-gray-500">Vaga: {viewCandidate.job_title}</p>
                                <div className="mt-2">
                                    {viewCandidate.status === 'unread' ? 
                                        <span className="text-xs font-bold text-red-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Não Lido</span> :
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Visualizado</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase">Email</label><p className="break-all">{viewCandidate.email}</p></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase">Tel</label><p>{viewCandidate.phone}</p></div>
                            <div className="md:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">LinkedIn</label><p className="text-blue-600 break-all">{viewCandidate.linkedin || "-"}</p></div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex gap-2 w-full md:w-auto">
                                {viewCandidate.status === 'unread' ? (
                                    <Button className="w-full md:w-auto" variant="outline" onClick={() => updateCandidateStatus(viewCandidate.id, 'viewed')} icon={CheckCircle2}>Marcar como Visto</Button>
                                ) : (
                                    <button onClick={() => updateCandidateStatus(viewCandidate.id, 'unread')} className="w-full md:w-auto py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Marcar como Não Lido</button>
                                )}
                            </div>
                            {viewCandidate.cv_filename ? <Button size="sm" className="w-full md:w-auto" variant="primary" icon={Download} onClick={() => handleDownload(viewCandidate.cv_filename)}>Baixar Currículo</Button> : <p className="text-red-500 text-sm">Sem arquivo</p>}
                        </div>
                    </div>
                </Modal>
            )}
        </AdminPage>
    );
};

// --- VIEW 3: CRUD VAGAS ---
export const JobsManagerView = () => {
  const confirm = useConfirm();
    const [jobs, setJobs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJob, setCurrentJob] = useState({ title: '', location: '', type: '', salary: '', description: '', active: 1, tipo_vaga: 'Interna', requirements: [] });
    const [tempReq, setTempReq] = useState("");

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/jobs.php?admin=1`);
            const data = await res.json();
            if (!Array.isArray(data)) return;
            const parsed = data.map(j => ({ ...j, requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements || '[]') : (j.requirements || []) }));
            setJobs(parsed);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const [savingJob, setSavingJob] = useState(false);
    // Aviso de alterações não salvas (selo + modal ao fechar ou sair da tela)
    const { dirty: jobDirty, markClean: markJobClean } = useDirty(currentJob, { ready: isEditing, extra: !!tempReq.trim() });
    const closeEditor = async () => {
        if (jobDirty && !(await confirm({ title: 'Descartar alterações?', message: 'As alterações não salvas desta vaga serão perdidas.', confirmLabel: 'Descartar', danger: true }))) return;
        setTempReq('');
        setIsEditing(false);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (savingJob) return; // clique duplo não cria duas vagas
        setSavingJob(true);
        try {
            await apiRequest(`${API_BASE_URL}/jobs.php`, {
                method: 'POST',
                body: JSON.stringify(currentJob)
            });
            markJobClean(currentJob); setTempReq('');
            fetchJobs(); setIsEditing(false);
            window.showToast?.('Vaga salva com sucesso.');
        } catch (err) { toastError(err); } // em erro o formulário continua aberto
        finally { setSavingJob(false); }
    };

    const handleDelete = async (id) => {
        if (!(await confirm({ title: 'Excluir esta vaga?', message: 'Ela sai do site imediatamente.' }))) return;
        try {
            await apiRequest(`${API_BASE_URL}/jobs.php?id=${id}`, { method: 'DELETE' });
            window.showToast?.('Vaga excluída.');
        } catch (err) { toastError(err); } // ex.: sem permissão
        fetchJobs();
    };

    const addRequirement = () => { if(tempReq.trim()) { setCurrentJob({...currentJob, requirements: [...(currentJob.requirements||[]), tempReq]}); setTempReq(""); } };
    const removeRequirement = (idx) => { const n = [...currentJob.requirements]; n.splice(idx, 1); setCurrentJob({...currentJob, requirements: n}); };

    if (isEditing) {
        return (
            <div className="max-w-3xl bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><h3 className="text-xl font-bold uppercase">{currentJob.id?'Editar':'Nova'} Vaga</h3>{jobDirty && <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">Alterações não salvas</span>}</div><button type="button" aria-label="Fechar" onClick={closeEditor}><XCircle className="text-gray-400 hover:text-red-500"/></button></div>
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Input label="Título" value={currentJob.title} onChange={e=>setCurrentJob({...currentJob, title:e.target.value})} required/>
                        <Input label="Salário" value={currentJob.salary} onChange={e=>setCurrentJob({...currentJob, salary:e.target.value})}/>
                        <Input label="Local" value={currentJob.location} onChange={e=>setCurrentJob({...currentJob, location:e.target.value})}/>
                        <Input label="Tipo" value={currentJob.type} onChange={e=>setCurrentJob({...currentJob, type:e.target.value})}/>
                        <div className="flex items-center gap-2 pt-2">
                             <input type="checkbox" id="job-active" checked={currentJob.active == 1} onChange={e=>setCurrentJob({...currentJob, active: e.target.checked ? 1 : 0})} className="w-4 h-4 text-[#007a3d] rounded border-gray-300 focus:ring-[#007a3d]" />
                             <label htmlFor="job-active" className="text-xs font-bold uppercase text-gray-700">Vaga Ativa (Visível no site)</label>
                        </div>
                        <div className="space-y-1 pt-1">
                          <label className="text-xs font-bold uppercase text-gray-500 ml-1 block">Tipo de Vaga</label>
                          <select
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold bg-gray-50 focus:border-[#007a3d] outline-none"
                            value={jobCategory(currentJob)}
                            onChange={e => setCurrentJob({...currentJob, tipo_vaga: e.target.value})}
                          >
                            <option value="Interna">Interna (SIF)</option>
                            <option value="Associadas">Associadas (vaga em empresa associada)</option>
                            <option value="Germinar">Germinar</option>
                          </select>
                        </div>
                    </div>
                    <TextArea label="Descrição" value={currentJob.description} onChange={e=>setCurrentJob({...currentJob, description:e.target.value})} rows={4}/>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Requisitos</label>
                        <div className="flex gap-2 mb-3"><input className="flex-1 border p-2 rounded" value={tempReq} onChange={e=>setTempReq(e.target.value)} /><button type="button" onClick={addRequirement} className="bg-black text-white px-4 rounded">Add</button></div>
                        <ul className="space-y-2">{currentJob.requirements?.map((r,i)=>(<li key={i} className="flex justify-between bg-white p-2 border rounded"><span>{r}</span><button type="button" onClick={()=>removeRequirement(i)} className="text-red-500"><Trash2 size={14}/></button></li>))}</ul>
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button size="sm" variant="outline" type="button" onClick={closeEditor}>Cancelar</Button><Button size="sm" variant="primary" type="submit" disabled={savingJob} isLoading={savingJob}>Salvar</Button></div>
                </form>
            </div>
        )
    }

    return (
        <AdminPage title="Trabalhe Conosco" subtitle="Cabeçalho, textos da página e vagas abertas. Cada bloco tem o próprio botão de salvar."
            actions={<PrimaryButton icon={Plus} onClick={()=>{setCurrentJob({title:'', location:'', type:'', salary:'', description:'', active: 1, tipo_vaga: 'Interna', requirements:[]}); setIsEditing(true);}}>Nova vaga</PrimaryButton>}>
            <PageHeaderForm pageKey="jobs" defaults={JOBS_HERO_DEFAULTS} title="Cabeçalho da página /trabalhe-conosco" />
            <PageContentForm pageKey="jobs" defaults={JOBS_CONTENT_DEFAULTS} fields={JOBS_CONTENT_FIELDS} title="Textos da página /trabalhe-conosco" />
            <SectionOrderForm pageKey="jobs" sections={PAGE_SECTIONS.jobs} title="Ordem das seções da página /trabalhe-conosco" />
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest pt-2">Vagas cadastradas</h3>
            <div className="grid gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-[#1f2937] text-lg">{job.title}</h3>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              jobCategory(job) === 'Interna' ? 'bg-emerald-50 text-emerald-700' : 'bg-lime-50 text-lime-700'
                            }`}>{jobCategory(job)}</span>
                            {job.active != 1 && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Oculta</span>}
                          </div>
                          <p className="text-xs text-gray-500 font-bold uppercase mt-1">{job.location} • {job.type}</p>
                        </div>
                        <div className="flex gap-2">
                            <ItemActions onEdit={()=>{setCurrentJob({ ...job, tipo_vaga: jobCategory(job) }); setIsEditing(true);}} onDelete={()=>handleDelete(job.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </AdminPage>
    );
};

