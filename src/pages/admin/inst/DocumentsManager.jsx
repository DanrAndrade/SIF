import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Upload, FileText, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../../../apiConfig';

const API = `${API_BASE_URL}/institucional.php`;

export default function DocumentsManager() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newDoc, setNewDoc] = useState({ title: '', description: '', pdf_url: '', pdf_file: null });
  const [adding, setAdding] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch(API + '?resource=documents&page_key=institucional');
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch { setDocs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (!newDoc.title.trim()) return;
    setAdding(true);
    const fd = new FormData();
    fd.append('page_key', 'institucional');
    fd.append('title', newDoc.title.trim());
    fd.append('description', newDoc.description);
    fd.append('pdf_url', newDoc.pdf_url);
    if (newDoc.pdf_file) fd.append('pdf_file', newDoc.pdf_file);
    await fetch(API + '?resource=documents', { method: 'POST', body: fd });
    setNewDoc({ title: '', description: '', pdf_url: '', pdf_file: null });
    setAdding(false);
    fetch_();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este documento?')) return;
    await fetch(API + `?resource=documents&id=${id}`, { method: 'DELETE' });
    fetch_();
  };

  const handleToggle = async (doc) => {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('id', doc.id);
    fd.append('active', doc.active == 1 ? 0 : 1);
    await fetch(API + '?resource=documents', { method: 'POST', body: fd });
    fetch_();
  };

  const handleSaveEdit = async (doc) => {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('id', doc.id);
    fd.append('title', doc.title);
    fd.append('description', doc.description || '');
    if (doc._newPdf) fd.append('pdf_file', doc._newPdf);
    else fd.append('pdf_url', doc.pdf_url || '');
    await fetch(API + '?resource=documents', { method: 'POST', body: fd });
    setEditingId(null);
    fetch_();
  };

  const pdfFilename = (url) => url ? url.split('/').pop() : '';

  return (
    <div className="space-y-6">
      {/* Adicionar */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">+ Adicionar Documento</p>
        <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="Título do documento *" value={newDoc.title} onChange={e => setNewDoc(p => ({ ...p, title: e.target.value }))} />
        <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="Descrição (opcional)" value={newDoc.description} onChange={e => setNewDoc(p => ({ ...p, description: e.target.value }))} />
        <div className="space-y-2">
          <label className="flex items-center gap-2 p-2.5 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007a3d] text-xs font-bold text-gray-400 transition-colors">
            <Upload size={14} />
            {newDoc.pdf_file ? newDoc.pdf_file.name : 'Upload do PDF'}
            <input type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files[0]) setNewDoc(p => ({ ...p, pdf_file: e.target.files[0], pdf_url: '' })); }} />
          </label>
          <p className="text-[10px] text-gray-400 text-center">— ou cole um link —</p>
          <input className="w-full p-2 bg-white border rounded-xl text-xs outline-none focus:border-[#007a3d]" placeholder="/docs/meu-documento.pdf" value={newDoc.pdf_url} onChange={e => setNewDoc(p => ({ ...p, pdf_url: e.target.value, pdf_file: null }))} />
        </div>
        <button onClick={handleAdd} disabled={adding || !newDoc.title.trim()} className="w-full py-2.5 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {adding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={14} />} Adicionar
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${doc.active == 1 ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
              {editingId === doc.id ? (
                <EditDocForm doc={doc} onSave={handleSaveEdit} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1f2937] truncate">{doc.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{pdfFilename(doc.pdf_url) || 'Sem arquivo'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleToggle(doc)} className={`p-1.5 rounded-xl transition-all ${doc.active == 1 ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {doc.active == 1 ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => setEditingId(doc.id)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-600 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {docs.length === 0 && <p className="text-center text-gray-400 text-sm py-6">Nenhum documento cadastrado.</p>}
        </div>
      )}
    </div>
  );
}

function EditDocForm({ doc: initial, onSave, onCancel }) {
  const [doc, setDoc] = useState({ ...initial, _newPdf: null });
  return (
    <div className="p-4 space-y-3 bg-gray-50">
      <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={doc.title} onChange={e => setDoc(p => ({ ...p, title: e.target.value }))} placeholder="Título" />
      <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={doc.description || ''} onChange={e => setDoc(p => ({ ...p, description: e.target.value }))} placeholder="Descrição" />
      <div className="space-y-2">
        <label className="flex items-center gap-2 p-2 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007a3d] text-xs font-bold text-gray-400 transition-colors">
          <Upload size={14} />
          {doc._newPdf ? doc._newPdf.name : (doc.pdf_url ? 'Trocar PDF: ' + doc.pdf_url.split('/').pop() : 'Upload novo PDF')}
          <input type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files[0]) setDoc(p => ({ ...p, _newPdf: e.target.files[0] })); }} />
        </label>
        {!doc._newPdf && (
          <input className="w-full p-2 bg-white border rounded-xl text-xs outline-none focus:border-[#007a3d]" placeholder="Ou cole o link do PDF" value={doc.pdf_url || ''} onChange={e => setDoc(p => ({ ...p, pdf_url: e.target.value }))} />
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(doc)} className="flex-1 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] flex items-center justify-center gap-2 transition-colors"><Save size={14} />Salvar</button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">Cancelar</button>
      </div>
    </div>
  );
}
