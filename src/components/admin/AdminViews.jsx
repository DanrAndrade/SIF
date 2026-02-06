import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, CheckCircle2, XCircle, Eye, Trash2, Edit, Plus, Send, AlertTriangle, FileText, Download, User, X, Undo2 } from 'lucide-react';
import { Input, TextArea, Select } from '../ui/FormElements';
import Button from '../ui/Button';

// Ajuste a URL conforme seu ambiente (localhost ou produção)
const API_URL = 'http://localhost/chocosul-api'; 

// Modal Responsivo
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
export const LeadsView = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/leads.php`, { credentials: 'include' });
            const data = await res.json();
            if(Array.isArray(data)) setLeads(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchLeads(); }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`${API_URL}/leads.php`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ id, status: newStatus })
            });
            fetchLeads(); 
            if (selectedLead) setSelectedLead(prev => ({ ...prev, status: newStatus }));
        } catch (e) { console.error(e); }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'unread': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200"><div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div> Não Lido</span>;
            case 'read': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 border border-yellow-200">Em Análise</span>;
            case 'contacted': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200"><CheckCircle2 size={10}/> Respondido</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-[#1f2937] uppercase">Gestão de Leads</h2><button onClick={fetchLeads} className="text-xs text-gray-500 underline hover:text-[#D91A3C]">Atualizar Lista</button></div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider"><tr><th className="p-4">Status</th><th className="p-4">Nome / Empresa</th><th className="p-4">Assunto</th><th className="p-4">Data</th><th className="p-4 text-right">Ações</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.map(lead => (
                            <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${lead.status === 'unread' ? 'bg-red-50/10' : ''}`}>
                                <td className="p-4">{getStatusBadge(lead.status)}</td>
                                <td className="p-4"><p className="font-bold text-[#1f2937]">{lead.name}</p><p className="text-xs text-gray-500">{lead.email}</p></td>
                                <td className="p-4"><span className="font-medium text-gray-700">{lead.subject}</span></td>
                                <td className="p-4 text-xs text-gray-500">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 text-right"><Button variant="outline" onClick={() => setSelectedLead(lead)} className="px-3 py-1 text-[10px] h-8">Ver Detalhes</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedLead && (
                <Modal title={`Mensagem de ${selectedLead.name}`} onClose={() => setSelectedLead(null)}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><label className="text-xs font-bold text-gray-400 uppercase">Email</label><p className="break-words">{selectedLead.email}</p></div>
                            <div><label className="text-xs font-bold text-gray-400 uppercase">Telefone</label><p>{selectedLead.phone}</p></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase">Mensagem</label><div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1"><p className="text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p></div></div>
                        </div>
                        <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 flex-wrap">
                            {selectedLead.status !== 'unread' && <button onClick={() => updateStatus(selectedLead.id, 'unread')} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold uppercase hover:bg-red-50 flex items-center gap-2"><Undo2 size={16} /> Não Lido</button>}
                            {selectedLead.status === 'unread' && <Button onClick={() => updateStatus(selectedLead.id, 'read')} variant="outline">Marcar Em Análise</Button>}
                            {selectedLead.status !== 'contacted' && <Button onClick={() => updateStatus(selectedLead.id, 'contacted')} variant="primary" icon={CheckCircle2}>Respondido</Button>}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- VIEW 2: CANDIDATOS (ATUALIZADO) ---
export const CandidatesView = () => {
    const [candidates, setCandidates] = useState([]);
    const [viewCandidate, setViewCandidate] = useState(null);

    const fetchCandidates = () => {
        fetch(`${API_URL}/candidates.php`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if(Array.isArray(data)) setCandidates(data); })
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchCandidates(); }, []);

    const updateCandidateStatus = async (id, newStatus) => {
        try {
            await fetch(`${API_URL}/candidates.php`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ id, status: newStatus })
            });
            fetchCandidates();
            if (viewCandidate) setViewCandidate(prev => ({ ...prev, status: newStatus }));
        } catch (e) { console.error(e); }
    };

    const handleDownload = (filename) => {
        window.open(`${API_URL}/download.php?file=${filename}`, '_blank');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1f2937] uppercase">Candidaturas</h2>
                <button onClick={fetchCandidates} className="text-xs text-gray-500 underline hover:text-[#D91A3C]">Atualizar</button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            {/* COLUNA STATUS MOVIDA PARA O INÍCIO */}
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
                                {/* LÓGICA DE STATUS NO INÍCIO + COR VERDE PARA VISTO */}
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
                                <td className="p-4 text-right"><Button variant="outline" onClick={() => setViewCandidate(c)} className="px-3 py-1 text-[10px]">Ver</Button></td>
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

                            {viewCandidate.cv_filename ? <Button className="w-full md:w-auto" variant="primary" icon={Download} onClick={() => handleDownload(viewCandidate.cv_filename)}>Baixar Currículo</Button> : <p className="text-red-500 text-sm">Sem arquivo</p>}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- VIEW 3: CRUD VAGAS ---
export const JobsManagerView = () => {
    const [jobs, setJobs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJob, setCurrentJob] = useState({ title: '', location: '', type: '', salary: '', description: '', requirements: [] });
    const [tempReq, setTempReq] = useState("");

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_URL}/jobs.php`);
            const data = await res.json();
            const parsed = data.map(j => ({ ...j, requirements: typeof j.requirements === 'string' ? JSON.parse(j.requirements) : j.requirements }));
            setJobs(parsed);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/jobs.php`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(currentJob)
            });
            fetchJobs(); setIsEditing(false);
        } catch (e) { alert("Erro ao salvar"); }
    };

    const handleDelete = async (id) => {
        if(!confirm("Tem certeza?")) return;
        await fetch(`${API_URL}/jobs.php?id=${id}`, { method: 'DELETE', credentials: 'include' });
        fetchJobs();
    };

    const addRequirement = () => { if(tempReq.trim()) { setCurrentJob({...currentJob, requirements: [...(currentJob.requirements||[]), tempReq]}); setTempReq(""); } };
    const removeRequirement = (idx) => { const n = [...currentJob.requirements]; n.splice(idx, 1); setCurrentJob({...currentJob, requirements: n}); };

    if (isEditing) {
        return (
            <div className="max-w-3xl bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold uppercase">{currentJob.id?'Editar':'Nova'} Vaga</h3><button onClick={()=>setIsEditing(false)}><XCircle className="text-gray-400 hover:text-red-500"/></button></div>
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <Input label="Título" value={currentJob.title} onChange={e=>setCurrentJob({...currentJob, title:e.target.value})} required/>
                        <Input label="Salário" value={currentJob.salary} onChange={e=>setCurrentJob({...currentJob, salary:e.target.value})}/>
                        <Input label="Local" value={currentJob.location} onChange={e=>setCurrentJob({...currentJob, location:e.target.value})}/>
                        <Input label="Tipo" value={currentJob.type} onChange={e=>setCurrentJob({...currentJob, type:e.target.value})}/>
                    </div>
                    <TextArea label="Descrição" value={currentJob.description} onChange={e=>setCurrentJob({...currentJob, description:e.target.value})} rows={4}/>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Requisitos</label>
                        <div className="flex gap-2 mb-3"><input className="flex-1 border p-2 rounded" value={tempReq} onChange={e=>setTempReq(e.target.value)} /><button type="button" onClick={addRequirement} className="bg-black text-white px-4 rounded">Add</button></div>
                        <ul className="space-y-2">{currentJob.requirements?.map((r,i)=>(<li key={i} className="flex justify-between bg-white p-2 border rounded"><span>{r}</span><button type="button" onClick={()=>removeRequirement(i)} className="text-red-500"><Trash2 size={14}/></button></li>))}</ul>
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button variant="outline" type="button" onClick={()=>setIsEditing(false)}>Cancelar</Button><Button variant="primary" type="submit">Salvar</Button></div>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-[#1f2937] uppercase">Gerenciar Vagas</h2><Button variant="primary" icon={Plus} onClick={()=>{setCurrentJob({title:'', location:'', type:'', salary:'', description:'', requirements:[]}); setIsEditing(true);}}>Nova Vaga</Button></div>
            <div className="grid gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
                        <div><h3 className="font-bold text-[#1f2937] text-lg">{job.title}</h3><p className="text-xs text-gray-500 font-bold uppercase mt-1">{job.location} • {job.type}</p></div>
                        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>{setCurrentJob(job); setIsEditing(true);}} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={18}/></button>
                            <button onClick={()=>handleDelete(job.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const NotificationsManagerView = () => (<div className="text-center py-20 text-gray-400">Em desenvolvimento...</div>);