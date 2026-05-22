import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../../../apiConfig';

const API = `${API_BASE_URL}/institucional.php`;

export default function TimelineManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ year: '', title: '', content: '', image_url: '', layout: 'image-left', _newImage: null, _preview: null });
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch(API + '?resource=timeline');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (!form.year || !form.title) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('year', form.year);
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('image_url', form.image_url);
    fd.append('layout', form.layout);
    if (form._newImage) fd.append('image', form._newImage);
    await fetch(API + '?resource=timeline', { method: 'POST', body: fd });
    setForm({ year: '', title: '', content: '', image_url: '', layout: 'image-left', _newImage: null, _preview: null });
    setSaving(false);
    fetch_();
  };

  const handleUpdate = async (item) => {
    setSaving(true);
    const fd = new FormData();
    fd.append('_method', 'PUT');
    fd.append('id', item.id);
    fd.append('year', item.year);
    fd.append('title', item.title);
    fd.append('content', item.content || '');
    fd.append('image_url', item.image_url || '');
    fd.append('layout', item.layout || 'image-left');
    if (item._newImage) fd.append('image', item._newImage);
    await fetch(API + '?resource=timeline', { method: 'POST', body: fd });
    setSaving(false);
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este marco?')) return;
    await fetch(API + `?resource=timeline&id=${id}`, { method: 'DELETE' });
    fetch_();
  };

  const handleMove = async (index, dir) => {
    const newItems = [...items];
    const swapIdx = index + dir;
    if (swapIdx < 0 || swapIdx >= newItems.length) return;
    [newItems[index], newItems[swapIdx]] = [newItems[swapIdx], newItems[index]];
    // Atualiza sort_order dos dois
    for (let i = 0; i < newItems.length; i++) {
      const fd = new FormData();
      fd.append('_method', 'PUT');
      fd.append('id', newItems[i].id);
      fd.append('sort_order', i + 1);
      await fetch(API + '?resource=timeline', { method: 'POST', body: fd });
    }
    fetch_();
  };

  return (
    <div className="space-y-6">
      {/* Adicionar novo marco */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">+ Novo Marco Histórico</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Ano *</label>
            <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder="Ex: 1974" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Layout</label>
            <select className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={form.layout} onChange={e => setForm(p => ({ ...p, layout: e.target.value }))}>
              <option value="image-left">Imagem à Esquerda</option>
              <option value="image-right">Imagem à Direita</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título *</label>
          <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" placeholder='Ex: Primeira Década' value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <p className="text-[10px] text-gray-400 mt-1">Para destacar parte do texto em verde, envolva com: &lt;span class="text-[#007a3d]"&gt;palavra&lt;/span&gt;</p>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Texto</label>
          <textarea className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={3} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Imagem</label>
          <div className="flex gap-3 items-start">
            {form._preview && <img src={form._preview} alt="" className="w-20 h-16 object-cover rounded-xl shrink-0" />}
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-2 p-2 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007a3d] text-xs font-bold text-gray-400 transition-colors">
                <ImageIcon size={14} /> Upload de imagem
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files[0];
                  if (f) setForm(p => ({ ...p, _newImage: f, _preview: URL.createObjectURL(f), image_url: '' }));
                }} />
              </label>
              <p className="text-[10px] text-gray-400 text-center">— ou —</p>
              <input className="w-full p-2 bg-white border rounded-xl text-xs outline-none focus:border-[#007a3d]" placeholder="URL externa (Unsplash, etc.)" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value, _newImage: null, _preview: null }))} />
            </div>
          </div>
        </div>
        <button onClick={handleAdd} disabled={saving || !form.year || !form.title} className="w-full py-2.5 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={14} />} Adicionar Marco
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {editingId === item.id ? (
                <EditForm item={item} onSave={handleUpdate} onCancel={() => setEditingId(null)} saving={saving} />
              ) : (
                <div className="flex items-center gap-4 p-4">
                  {(item.image_url) && (
                    <img src={item.image_url.startsWith('http') ? item.image_url : getImageUrl(item.image_url)} alt="" className="w-16 h-12 object-cover rounded-xl shrink-0" onError={e => e.target.style.display='none'} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1f2937] text-sm">{item.year} — <span dangerouslySetInnerHTML={{ __html: item.title }} /></p>
                    <p className="text-xs text-gray-400 truncate">{item.content}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{item.layout === 'image-left' ? 'Img ← Texto' : 'Texto → Img'}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowUp size={14} /></button>
                    <button onClick={() => handleMove(idx, 1)} disabled={idx === items.length - 1} className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowDown size={14} /></button>
                    <button onClick={() => setEditingId(item.id)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-600 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditForm({ item: initial, onSave, onCancel, saving }) {
  const [item, setItem] = useState({ ...initial, _newImage: null, _preview: null });
  return (
    <div className="p-4 space-y-3 bg-gray-50">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Ano</label>
          <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={item.year} onChange={e => setItem(p => ({ ...p, year: e.target.value }))} />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Layout</label>
          <select className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={item.layout} onChange={e => setItem(p => ({ ...p, layout: e.target.value }))}>
            <option value="image-left">Imagem à Esquerda</option>
            <option value="image-right">Imagem à Direita</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Título</label>
        <input className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d]" value={item.title} onChange={e => setItem(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Texto</label>
        <textarea className="w-full p-2 bg-white border rounded-xl text-sm outline-none focus:border-[#007a3d] resize-none" rows={3} value={item.content || ''} onChange={e => setItem(p => ({ ...p, content: e.target.value }))} />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Imagem</label>
        <div className="flex gap-3 items-center">
          {(item._preview || item.image_url) && (
            <img src={item._preview || (item.image_url.startsWith('http') ? item.image_url : `${API_BASE_URL}/${item.image_url}`)} alt="" className="w-16 h-12 object-cover rounded-xl shrink-0" onError={e => e.target.style.display='none'} />
          )}
          <label className="flex items-center gap-2 p-2 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007a3d] text-xs font-bold text-gray-400 flex-1 transition-colors">
            <ImageIcon size={14} /> Nova imagem (upload)
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files[0];
              if (f) setItem(p => ({ ...p, _newImage: f, _preview: URL.createObjectURL(f), image_url: '' }));
            }} />
          </label>
        </div>
        <input className="w-full p-2 bg-white border rounded-xl text-xs outline-none focus:border-[#007a3d] mt-2" placeholder="URL externa" value={item._newImage ? '' : (item.image_url || '')} onChange={e => setItem(p => ({ ...p, image_url: e.target.value, _newImage: null, _preview: null }))} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(item)} disabled={saving} className="flex-1 py-2 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#047857] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />} Salvar
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">Cancelar</button>
      </div>
    </div>
  );
}
