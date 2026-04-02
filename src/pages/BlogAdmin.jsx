import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button'; 
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const API_URL = `${API_BASE_URL}/blog.php`;

const AVAILABLE_TAGS = [
  'Silvicultura', 'Inovação', 'Sustentabilidade', 'Tecnologia', 
  'Mercado', 'Pesquisa', 'Eventos', 'UFV', 'Manejo', 'Celulose'
];

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [view, setView] = useState('list'); 
  const [deleteId, setDeleteId] = useState(null); 

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageFile: null });
  
  const [selectedTags, setSelectedTags] = useState([]);
  const quillRef = React.useRef(null);

  // Cleanup preview URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem não pode exceder 5MB.');
        return;
      }

      const data = new FormData();
      data.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, {
          method: 'POST',
          body: data,
        });

        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }

        const result = await res.json();
        if (result.success) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          
          // FIX: Use getImageUrl to get the full URL
          const fullImageUrl = getImageUrl(result.url);
          console.log('Inserindo imagem no editor:', fullImageUrl);
          
          quill.insertEmbed(range.index, 'image', fullImageUrl);
        } else {
          alert(result.message || 'Erro ao fazer upload da imagem');
        }
      } catch (err) {
        console.error("Erro no upload da imagem do editor:", err);
        alert('Falha ao fazer upload da imagem. Tente novamente.');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'align': [] }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), [imageHandler]);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(API_URL);
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
      setError('Não foi possível carregar as publicações. Verifique sua conexão.');
      setPosts([]);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem não pode exceder 10MB.');
      return;
    }

    // Revoke old preview URL before creating new one
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // FIX: Create blob URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    console.log('Preview URL criada:', objectUrl);
    setPreview(objectUrl); 
    setFormData({ ...formData, imageFile: file }); 
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?id=${deleteId}`, { method: 'DELETE' });
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      const result = await res.json();
      if (result.success) {
        setDeleteId(null);
        await fetchPosts();
      } else {
        alert(result.error || 'Erro ao excluir publicação');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (post) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}?slug=${post.slug}`);
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      const fullPost = await res.json();
      
      if (!fullPost || !fullPost.id) {
        throw new Error('Publicação não encontrada');
      }
      
      setEditingId(fullPost.id);
      setFormData({ 
        title: fullPost.title || '', 
        content: fullPost.content || '', 
        imageFile: null 
      });
      setSelectedTags(fullPost.tags ? fullPost.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
      
      // FIX: Use getImageUrl for preview when editing
      if (fullPost.image_url) {
        const fullImageUrl = getImageUrl(fullPost.image_url);
        console.log('Preview URL ao editar:', fullImageUrl);
        setPreview(fullImageUrl);
      } else {
        setPreview(null);
      }
      
      setView('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Erro ao carregar artigo:', err);
      alert("Erro ao carregar os dados completos do artigo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      alert('O título é obrigatório.');
      return;
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      alert('O conteúdo é obrigatório.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('content', formData.content);
    data.append('tags', selectedTags.join(', '));
    
    if (editingId) data.append('id', editingId);
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      const res = await fetch(API_URL, { method: 'POST', body: data });
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      const result = await res.json();
      if (result.success) {
        resetForm();
        await fetchPosts();
        alert(editingId ? 'Artigo atualizado com sucesso!' : 'Artigo publicado com sucesso!');
      } else {
        alert("Erro: " + (result.error || 'Falha ao salvar publicação'));
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert("Erro ao salvar publicação. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Cleanup preview URL
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    setEditingId(null);
    setPreview(null);
    setFormData({ title: '', content: '', imageFile: null });
    setSelectedTags([]);
    setView('list');
    setError(null);
  };

  return (
    <div className="w-full relative">
        
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
                      <button 
                        onClick={() => setDeleteId(null)} 
                        disabled={loading}
                        className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                          Cancelar
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        disabled={loading}
                        className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                          {loading ? 'Excluindo...' : 'Sim, Excluir'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-semibold">Erro</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

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
                      <div className="p-12 text-center text-gray-400 font-medium">
                        {loading ? 'Carregando publicações...' : 'Nenhuma publicação encontrada. Crie a primeira!'}
                      </div>
                  ) : (
                      posts.map(post => (
                          <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border flex-shrink-0">
                                      {post.image_url ? (
                                          <img 
                                            src={getImageUrl(post.image_url)} 
                                            className="w-full h-full object-cover" 
                                            alt=""
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f3f4f6"/%3E%3C/svg%3E';
                                            }}
                                          />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon/></div>
                                      )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors text-lg line-clamp-2 flex-1">{post.title}</h4>
                              </div>
                              <div className="flex gap-2 ml-4 flex-shrink-0">
                                  <button 
                                    onClick={() => handleEdit(post)} 
                                    disabled={loading} 
                                    className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                    title="Editar"
                                  >
                                    <Edit3 size={20}/>
                                  </button>
                                  <button 
                                    onClick={() => setDeleteId(post.id)} 
                                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                    title="Excluir"
                                  >
                                    <Trash2 size={20}/>
                                  </button>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      )}

      {view === 'form' && (
          <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                  <h2 className="text-3xl font-bold uppercase text-[#1B5E20] tracking-tighter">
                      {editingId ? 'Editar Artigo' : 'Nova Publicação SIF'}
                  </h2>
                  <button 
                    onClick={resetForm} 
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                      <X size={18}/> Cancelar
                  </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <input 
                      className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-2xl outline-none border focus:border-[#2E7D32] transition-colors" 
                      placeholder="Título do Post" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                      maxLength={200}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-400 mt-2 ml-2">{formData.title.length}/200 caracteres</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Imagem de Capa (Hero)</label>
                          <div className="relative h-56 bg-gray-50 rounded-[32px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all">
                              {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="text-gray-300 mx-auto mb-2" size={48} />
                                  <p className="text-sm text-gray-400">Clique para adicionar imagem</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageChange}
                                disabled={loading}
                              />
                          </div>
                          <p className="text-xs text-gray-400 ml-2">Máximo 10MB (JPG, PNG, WebP)</p>
                      </div>
                      
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Tags do Artigo</label>
                          <div className="flex flex-wrap gap-2">
                              {AVAILABLE_TAGS.map(tag => (
                                  <button
                                      key={tag}
                                      type="button"
                                      onClick={() => toggleTag(tag)}
                                      disabled={loading}
                                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border disabled:opacity-50 ${
                                          selectedTags.includes(tag) 
                                          ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md' 
                                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20]'
                                      }`}
                                  >
                                      {tag}
                                  </button>
                              ))}
                          </div>
                          <p className="text-xs text-gray-400 ml-2">{selectedTags.length} tag(s) selecionada(s)</p>
                      </div>
                  </div>

                  <div className="bg-white rounded-[24px] border border-gray-200">
                      <ReactQuill 
                          ref={quillRef}
                          theme="snow" 
                          modules={modules} 
                          value={formData.content} 
                          onChange={(val) => setFormData({...formData, content: val})} 
                          className="h-[600px] rounded-[24px]"
                          readOnly={loading}
                      />
                  </div>

                  <div className="pt-10">
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest rounded-2xl" 
                      variant="primary" 
                      isLoading={loading}
                      disabled={loading}
                    >
                        {editingId ? 'Salvar Alterações' : 'Publicar no Blog'}
                    </Button>
                  </div>
              </form>
          </div>
      )}

    </div>
  );
}