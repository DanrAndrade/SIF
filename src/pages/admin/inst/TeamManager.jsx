import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, X, Phone, Mail, DownloadCloud } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../../../apiConfig';
import { validateImageSize } from '../../../utils/toast';

const API = `${API_BASE_URL}/institucional.php`;

const GROUPS = [
  'Diretoria',
  'Coordenadoras',
  'Coord. Fundação SIF & EMBRAPII',
  'Coord. Inovação e Projetos',
  'Coord. de CSC',
  'Coord. de Produtos e Serviços',
  'Coord. de RH & Facilities',
  'Consultores',
];

// Equipe atual da página estática /institucional — usada apenas para o botão
// "Importar equipe atual" quando o banco está vazio. As fotos vivem em
// /public/nossa-gente/ e são servidas pelo próprio Vite.
const parseFile = (file, folder) => {
  const noExt = file.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
  const idx = noExt.indexOf(' - ');
  const name = idx !== -1 ? noExt.substring(0, idx).trim() : noExt.trim();
  const role = idx !== -1 ? noExt.substring(idx + 3).trim() : '';
  return { name, role, photo_url: `/nossa-gente/${folder}/${file}` };
};
const STATIC_TEAM = [
  // Diretoria
  ...['Gilciano - Diretor Geral Fundação SIF.jpg', 'Gleison - Diretor Geral EMBRAPII  e Diretor Cientifico SIF.jpg', 'Gumercindo - Diretor Geral da SIF.png', 'Michele Brandão  - Gerente Executiva.jpg']
    .map(f => ({ ...parseFile(f, 'Diretoria'), group: 'Diretoria' })),
  // Coordenadoras
  ...['Camila - Coord. Produtos e Serviços.png', 'Cintia - Coord da Fudação SIF e EMBRAPII.png', 'Helen  - Coord de Inovação e Projetos.png', 'Larissa  - Coord. de CSC.png', 'Ângela Silva - Coord. de Rh e Faciliities.png']
    .map(f => ({ ...parseFile(f, 'Coordenadoras'), group: 'Coordenadoras' })),
  // Coord. Fundação SIF & EMBRAPII
  ...['Flávia - Estagiária.png', 'Gabriela Camilo - Gestora de Convênios.png', 'Otávio Silveira - Estagiário.png']
    .map(f => ({ ...parseFile(f, 'Coordenações/Coord. Fundação SIF e EMBRAPII'), group: 'Coord. Fundação SIF & EMBRAPII' })),
  // Coord. Inovação e Projetos
  ...['Tamara Braga - Analista de Inovação.png', 'Thamires Carvalho - Analista de Proejtos.png']
    .map(f => ({ ...parseFile(f, 'Coordenações/Coordenação Inovação e Projetos'), group: 'Coord. Inovação e Projetos' })),
  // Coord. de CSC
  ...['Adilson Abranches - Informática.png', 'Joyce Aquino - Contratos Internos.png', 'Kellen Souza - Compras.png', 'Lidiane Heleno - Contas a Pagar.png', 'Mauricio Seiffer - Estagiário.png', 'Rafaela Vilar - Contas a Receber.png', 'Silmara Pena  - Controle Financeiro.png']
    .map(f => ({ ...parseFile(f, 'Coordenações/Coordenação de CSC'), group: 'Coord. de CSC' })),
  // Coord. de Produtos e Serviços
  ...['Angelina Melo - GT Sociedade.png', 'Giovanna Oliveira - GT Colheita e Logística.png', 'Juliana Melo - GT Carvão Vegetal.png', 'Laís Luz - Analista de Eventos.png', 'Lucas Sousa - Assistente de Comunicação e Marketing.png', 'Mateus Costa - Analista de Comunicação e Marketing.png', 'Mirian Valente - GT Restauração.png', 'Nathália Ramos - GT Bambu.png', 'Otávio Fernandes - GT Segurança.png', 'Pedro Almada - Analista Comercial.png', 'Samuel Souza - GT Ferroligas.png', 'Silas Sardinha - GT Manejo.png']
    .map(f => ({ ...parseFile(f, 'Coordenações/Coordenação de Produtos e Serviços'), group: 'Coord. de Produtos e Serviços' })),
  // Coord. de RH & Facilities
  ...['Adão Vitorio - Recepção.png', 'Ana Clarisse - Estagiária.png', 'Maria Auxiliadora - Serviços Gerais.png', 'Monalisa Meireles - Estagiária.png', 'Roberta Finamore - Formação de RH.jpg', 'Samara Soares - Analista de RH.png']
    .map(f => ({ ...parseFile(f, 'Coordenações/Coordenação de RH'), group: 'Coord. de RH & Facilities' })),
  // Consultores
  ...['Andreia - Organizacional.jpg', 'Marinês - Juridico.jpg', 'Rômulo - Contábil.png']
    .map(f => ({ ...parseFile(f, 'Consultores'), group: 'Consultores' })),
];

function MemberCard({ member, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...member });

  const handleSave = async () => {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('id', member.id);
    fd.append('name', form.name);
    fd.append('role', form.role || '');
    fd.append('group_name', form.group_name);
    fd.append('link_email', form.link_email || '');
    fd.append('link_whatsapp', form.link_whatsapp || '');
    if (form._newPhoto) fd.append('photo', form._newPhoto);
    try {
      const res = await fetch(API + '?resource=team', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        window.showToast?.('Membro atualizado com sucesso.');
      } else {
        window.showToast?.(data.error || 'Erro ao salvar o membro.', 'error');
      }
    } catch {
      window.showToast?.('Erro de conexão ao salvar o membro.', 'error');
    }
    setEditing(false);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        {/* Foto */}
        <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-gray-200">
          {(form._preview || member.photo_url) ? (
            <img src={form._preview || getImageUrl(member.photo_url)} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon size={20} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#1f2937] truncate">{member.name}</p>
          <p className="text-xs text-[#007a3d] truncate">{member.role}</p>
          <p className="text-[10px] text-gray-400">{member.group_name}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-600 transition-colors">Editar</button>
          <button onClick={() => { if (window.confirm('Remover?')) onDelete(member.id); }} className="p-1.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {editing && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          {/* Upload de foto */}
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Foto</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {(form._preview || member.photo_url) && (
                  <img src={form._preview || getImageUrl(member.photo_url)} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="flex-1 flex items-center gap-2 p-2 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007a3d] transition-colors text-xs font-bold text-gray-400">
                <ImageIcon size={16} /> Trocar foto
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files[0];
                  if (!f) return;
                  if (!validateImageSize(f)) { e.target.value = ''; return; }
                  setForm(p => ({ ...p, _newPhoto: f, _preview: URL.createObjectURL(f) }));
                }} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Nome</label>
              <input className="w-full p-2 bg-white border rounded-lg text-sm outline-none focus:border-[#007a3d]" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Cargo</label>
              <input className="w-full p-2 bg-white border rounded-lg text-sm outline-none focus:border-[#007a3d]" value={form.role || ''} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Grupo</label>
            <select className="w-full p-2 bg-white border rounded-lg text-sm outline-none focus:border-[#007a3d]" value={form.group_name} onChange={e => setForm(p => ({ ...p, group_name: e.target.value }))}>
              {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1 flex items-center gap-1"><Mail size={10} /> E-mail</label>
              <input className="w-full p-2 bg-white border rounded-lg text-sm outline-none focus:border-[#007a3d]" value={form.link_email || ''} onChange={e => setForm(p => ({ ...p, link_email: e.target.value }))} placeholder="nome@sif.org.br" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1 flex items-center gap-1"><Phone size={10} /> WhatsApp</label>
              <input className="w-full p-2 bg-white border rounded-lg text-sm outline-none focus:border-[#007a3d]" value={form.link_whatsapp || ''} onChange={e => setForm(p => ({ ...p, link_whatsapp: e.target.value }))} placeholder="31999999999" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors flex items-center justify-center gap-2"><Save size={14} />Salvar</button>
            <button onClick={() => { setForm({ ...member }); setEditing(false); }} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', role: '', link_email: '', link_whatsapp: '', photo: null, preview: null });

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch(API + '?resource=team');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      // Auto-seed: se banco vazio, importa silenciosamente a equipe da página estática
      if (list.length === 0) {
        for (const m of STATIC_TEAM) {
          const fd = new FormData();
          fd.append('name', m.name);
          fd.append('role', m.role);
          fd.append('group_name', m.group);
          fd.append('photo_url', m.photo_url);
          await fetch(API + '?resource=team', { method: 'POST', body: fd });
        }
        const res2 = await fetch(API + '?resource=team');
        const data2 = await res2.json();
        setMembers(Array.isArray(data2) ? data2 : []);
      } else {
        setMembers(list);
      }
    } catch { setMembers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleDelete = async (id) => {
    await fetch(API + `?resource=team&id=${id}`, { method: 'DELETE' });
    fetch_();
  };

  const handleAdd = async () => {
    if (!newForm.name.trim()) return;
    setAdding(true);
    const fd = new FormData();
    fd.append('name', newForm.name.trim());
    fd.append('role', newForm.role);
    fd.append('group_name', activeGroup);
    fd.append('link_email', newForm.link_email);
    fd.append('link_whatsapp', newForm.link_whatsapp);
    if (newForm.photo) fd.append('photo', newForm.photo);
    try {
      const res = await fetch(API + '?resource=team', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        window.showToast?.('Membro adicionado com sucesso.');
        setNewForm({ name: '', role: '', link_email: '', link_whatsapp: '', photo: null, preview: null });
      } else {
        window.showToast?.(data.error || 'Erro ao adicionar o membro.', 'error');
      }
    } catch {
      window.showToast?.('Erro de conexão ao adicionar o membro.', 'error');
    }
    setAdding(false);
    fetch_();
  };

  const groupMembers = members.filter(m => m.group_name === activeGroup);

  return (
    <div className="space-y-6">
      {/* Abas de grupo */}
      <div className="flex flex-wrap gap-2">
        {GROUPS.map(g => {
          const count = members.filter(m => m.group_name === g).length;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeGroup === g ? 'bg-[#007a3d] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {g} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Formulário de adição */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-[#007a3d]">+ Adicionar em "{activeGroup}"</p>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#007a3d] transition-colors"
            onClick={() => document.getElementById('new-member-photo').click()}>
            {newForm.preview ? <img src={newForm.preview} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
            <input id="new-member-photo" type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files[0];
              if (!f) return;
              if (!validateImageSize(f)) { e.target.value = ''; return; }
              setNewForm(p => ({ ...p, photo: f, preview: URL.createObjectURL(f) }));
            }} />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="Nome completo *" value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} />
            <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="Cargo" value={newForm.role} onChange={e => setNewForm(p => ({ ...p, role: e.target.value }))} />
            <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="E-mail (opcional)" value={newForm.link_email} onChange={e => setNewForm(p => ({ ...p, link_email: e.target.value }))} />
            <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="WhatsApp (apenas números)" value={newForm.link_whatsapp} onChange={e => setNewForm(p => ({ ...p, link_whatsapp: e.target.value }))} />
          </div>
        </div>
        <button onClick={handleAdd} disabled={adding || !newForm.name.trim()} className="w-full py-2.5 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {adding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={14} />} Adicionar Membro
        </button>
      </div>

      {/* Lista de membros do grupo */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" /></div>
      ) : groupMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">Nenhum membro neste grupo ainda.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupMembers.map(m => <MemberCard key={m.id} member={m} onDelete={handleDelete} onUpdate={fetch_} />)}
        </div>
      )}
    </div>
  );
}
