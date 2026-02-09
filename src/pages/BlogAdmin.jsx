import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Send, Image as ImageIcon, Trash2, Edit3, X, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';

const API_URL = 'http://localhost/sif-api/blog.php';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [imageFile, setImageFile] = useState(null);

  const fetchPosts = () => {
    fetch(API_URL).then(res => res.json()).then(data => setPosts(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Atenção: Esta ação excluirá permanentemente o artigo da base de dados da SIF. Deseja continuar?")) {
        try {
            const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                alert("Post excluído com sucesso.");
                fetchPosts();
            } else {
                alert("Erro ao excluir: " + result.error);
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setFormData({ title: post.title, content: post.content, tags: post.tags || '' });
    setPreview(post.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('tags', formData.tags);
    if (editingId) data.append('id', editingId);
    if (imageFile) data.append('image', imageFile);

    try {
        const res = await fetch(API_URL, { method: 'POST', body: data });
        const result = await res.json();
        if (result.success) {
            alert(editingId ? "Artigo atualizado!" : "Artigo publicado!");
            resetForm();
            fetchPosts();
        }
    } catch (err) {
        alert("Erro ao salvar postagem.");
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);
    setImageFile(null);
    setFormData({ title: '', content: '', tags: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar scrolled={true} />
      <div className="container mx-auto px-6 pt-32 max-w-5xl">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold uppercase text-[#1B5E20] tracking-tighter">
                {editingId ? 'Editar Artigo' : 'Nova Publicação SIF'}
            </h2>
            {editingId && (
                <button onClick={resetForm} className="text-xs font-bold text-red-500 uppercase flex items-center gap-1 hover:underline">
                    <X size={14}/> Cancelar
                </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-2xl outline-none border focus:border-[#2E7D32]" placeholder="Título do Post" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Imagem de Capa (Hero)</label>
                <div className="relative h-56 bg-gray-50 rounded-[32px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all">
                  {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {setImageFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))}} />
                </div>
              </div>
              <div className="flex flex-col justify-end gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Tags (Vírgula para separar)</label>
                   <input className="w-full p-5 bg-gray-50 rounded-2xl outline-none border focus:border-[#2E7D32]" placeholder="Ex: Silvicultura, UFV, Inovação" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border overflow-hidden">
              <ReactQuill theme="snow" value={formData.content} onChange={(val) => setFormData({...formData, content: val})} className="h-[400px] mb-12" />
            </div>

            <Button type="submit" className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest" variant="primary" isLoading={loading}>
                {editingId ? 'Salvar Alterações' : 'Publicar no Blog'}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden divide-y divide-gray-50">
            <div className="p-6 bg-gray-50/50 border-b font-bold text-xs uppercase text-gray-400 tracking-widest">Gerenciar Publicações</div>
            {posts.map(post => (
                <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border">
                            <img src={post.image_url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{post.title}</h4>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(post)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(post.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}