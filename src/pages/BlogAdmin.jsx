import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Edit3, X, Plus } from 'lucide-react';
import Button from '../components/ui/Button'; // Import Navbar removido!

const API_URL = 'http://localhost/sif-api/blog.php';

const AVAILABLE_TAGS = [
  'Silvicultura', 'Inovação', 'Sustentabilidade', 'Tecnologia', 
  'Mercado', 'Pesquisa', 'Eventos', 'UFV', 'Manejo', 'Celulose'
];

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [view, setView] = useState('list'); 
  const [deleteId, setDeleteId] = useState(null); 

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image_url_base64: '' });
  
  const [selectedTags, setSelectedTags] = useState([]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const fetchPosts = () => {
    fetch(API_URL).then(res => res.json()).then(data => setPosts(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
        setFormData({ ...formData, image_url_base64: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
        const res = await fetch(`${API_URL}?id=${deleteId}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            setDeleteId(null);
            fetchPosts();
        }
    } catch (err) {
        alert("Erro de conexão com o servidor.");
    }
  };

  // --- CORREÇÃO: Busca o texto completo do artigo ao clicar em Editar ---
  const handleEdit = async (post) => {
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}?slug=${post.slug}`);
        const fullPost = await res.json();
        
        setEditingId(fullPost.id);
        setFormData({ title: fullPost.title, content: fullPost.content || '', image_url_base64: '' });
        setSelectedTags(fullPost.tags ? fullPost.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
        setPreview(fullPost.image_url);
        setView('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        alert("Erro ao carregar os dados completos do artigo.");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('tags', selectedTags.join(', '));
    
    if (editingId) data.append('id', editingId);
    if (formData.image_url_base64) data.append('image_url_base64', formData.image_url_base64);

    try {
        const res = await fetch(API_URL, { method: 'POST', body: data });
        const result = await res.json();
        if (result.success) {
            resetForm();
            fetchPosts();
        } else {
            alert("Erro: " + result.error);
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
    setFormData({ title: '', content: '', image_url_base64: '' });
    setSelectedTags([]);
    setView('list');
  };

  return (
    <div className="w-full relative">
        
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deleteId && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm px-4">
              <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Trash2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Excluir Artigo?</h3>
                  <p className="text-center text-gray-500 mb-8">
                      Esta ação é irreversível. O artigo será removido permanentemente do blog.
                  </p>
                  <div className="flex gap-4">
                      <button onClick={() => setDeleteId(null)} className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                          Cancelar
                      </button>
                      <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">
                          Sim, Excluir
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* TELA 1: LISTA DE POSTAGENS */}
      {view === 'list' && (
          <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
              <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                      <h2 className="text-3xl font-bold uppercase text-[#1B5E20] tracking-tighter">Blog SIF</h2>
                      <p className="text-gray-500 text-sm mt-1">Gerencie as publicações do site</p>
                  </div>
                  <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl">
                      <Plus size={20}/> Nova Publicação
                  </Button>
              </div>
              
              <div className="divide-y divide-gray-50">
                  {posts.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 font-medium">Nenhuma publicação encontrada. Crie a primeira!</div>
                  ) : (
                      posts.map(post => (
                          <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                              <div className="flex items-center gap-4">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border flex-shrink-0">
                                      {post.image_url ? (
                                          <img src={post.image_url} className="w-full h-full object-cover" alt="" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon/></div>
                                      )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors text-lg line-clamp-2">{post.title}</h4>
                              </div>
                              <div className="flex gap-2 ml-4">
                                  <button onClick={() => handleEdit(post)} disabled={loading} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"><Edit3 size={20}/></button>
                                  <button onClick={() => setDeleteId(post.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      )}

      {/* TELA 2: FORMULÁRIO DE CRIAÇÃO/EDIÇÃO */}
      {view === 'form' && (
          <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                  <h2 className="text-3xl font-bold uppercase text-[#1B5E20] tracking-tighter">
                      {editingId ? 'Editar Artigo' : 'Nova Publicação SIF'}
                  </h2>
                  <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
                      <X size={18}/> Cancelar
                  </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-2xl outline-none border focus:border-[#2E7D32]" placeholder="Título do Post" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Imagem de Capa (Hero)</label>
                          <div className="relative h-56 bg-gray-50 rounded-[32px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all">
                              {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Tags do Artigo</label>
                          <div className="flex flex-wrap gap-2">
                              {AVAILABLE_TAGS.map(tag => (
                                  <button
                                      key={tag}
                                      type="button"
                                      onClick={() => toggleTag(tag)}
                                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                                          selectedTags.includes(tag) 
                                          ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md' 
                                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20]'
                                      }`}
                                  >
                                      {tag}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* CORREÇÃO: Altura aumentada (h-[600px]) e remoção do overflow-hidden para as tooltips não cortarem */}
                  <div className="bg-white rounded-[24px] border border-gray-200">
                      <ReactQuill 
                          theme="snow" 
                          modules={modules} 
                          value={formData.content} 
                          onChange={(val) => setFormData({...formData, content: val})} 
                          className="h-[600px] rounded-[24px]" 
                      />
                  </div>

                  {/* Margem top extra para garantir respiro abaixo do editor caso a tooltip estique */}
                  <div className="pt-10">
                    <Button type="submit" className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading}>
                        {editingId ? 'Salvar Alterações' : 'Publicar no Blog'}
                    </Button>
                  </div>
              </form>
          </div>
      )}

    </div>
  );
}