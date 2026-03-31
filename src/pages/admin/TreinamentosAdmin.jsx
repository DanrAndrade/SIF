import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Image as ImageIcon, Trash2, Edit3, X, Plus, Clock, Award, Layers, Play, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/treinamentos.php`;

export default function TreinamentosAdmin() {
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('list'); 
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [segments, setSegments] = useState(['Silvicultura', 'Gestão', 'Tecnologia', 'Sustentabilidade']);
  const [newSegment, setNewSegment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    presentation: '',
    audience: '',
    modules_content: '',
    segment: 'Silvicultura',
    date: '',
    hours: '',
    location: '',
    video_url: '',
    pdf_url: '',
    image_url: '',
    imageFile: null
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTrainings(Array.isArray(data) ? data : []);
      
      // Extrair segmentos únicos dos treinamentos carregados para o seletor
      if (Array.isArray(data)) {
        const uniqueSegments = [...new Set([...segments, ...data.map(t => t.segment).filter(Boolean)])];
        setSegments(uniqueSegments);
      }
    } catch (err) {
      console.error("Erro ao carregar treinamentos:", err);
    }
  };

  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleEdit = (training) => {
    let parsedDesc = { presentation: '', audience: '', modules_content: '' };
    try {
        const parsed = JSON.parse(training.description);
        parsedDesc = { ...parsedDesc, ...parsed };
    } catch {
        parsedDesc.presentation = training.description || '';
    }

    setEditingId(training.id);
    setFormData({
      title: training.title,
      presentation: parsedDesc.presentation,
      audience: parsedDesc.audience,
      modules_content: parsedDesc.modules_content,
      segment: training.segment,
      date: training.date,
      hours: training.hours,
      location: training.location,
      video_url: training.video_url || '',
      pdf_url: training.pdf_url || '',
      image_url: training.image_url,
      imageFile: null
    });
    setPreview(training.image_url);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este treinamento permanentemente?")) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchTrainings();
    } catch (err) {
      alert("Erro ao excluir treinamento.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = generateSlug(formData.title);
    const puzzleDescription = JSON.stringify({
        presentation: formData.presentation,
        audience: formData.audience,
        modules_content: formData.modules_content
    });

    const dataToSend = new FormData();
    dataToSend.append('slug', slug);
    dataToSend.append('title', formData.title);
    dataToSend.append('description', puzzleDescription);
    dataToSend.append('segment', formData.segment);
    dataToSend.append('hours', formData.hours);
    dataToSend.append('location', formData.location);
    dataToSend.append('video_url', formData.video_url);
    dataToSend.append('pdf_url', formData.pdf_url);
    
    if (editingId) {
        dataToSend.append('id', editingId);
    }
    if (formData.imageFile) {
        dataToSend.append('image', formData.imageFile);
    } else if (formData.image_url) {
        dataToSend.append('image_url', formData.image_url);
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: dataToSend
      });
      
      const result = await res.json();
      if (result.status === 'success') {
        resetForm();
        fetchTrainings();
      } else {
        alert("Erro: " + result.message);
      }
    } catch (err) {
      alert("Erro ao salvar treinamento.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPreview(null);
    setFormData({
      title: '',
      presentation: '',
      audience: '',
      modules_content: '',
      segment: segments[0] || 'Silvicultura',
      date: '',
      hours: '',
      location: '',
      video_url: '',
      pdf_url: '',
      image_url: '',
      imageFile: null
    });
    setView('list');
  };

  const addSegment = () => {
    if (newSegment && !segments.includes(newSegment)) {
      setSegments([...segments, newSegment]);
      setNewSegment('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
        setFormData({ ...formData, image_url: reader.result, imageFile: file }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          const quillRefs = document.querySelectorAll('.quill'); // Como tem 3 editores, pegamos o ativo ou o ref específico
          // Para simplificar no Puzzle, vamos usar o selection geral do editor que disparou se possível
          // Mas como temos refs diferentes, ideal é passar o ref no handler.
          // Por agora, vamos usar o prompt de URL se prefirir, mas o usuário quer o botão.
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', getImageUrl(data.url));
        }
      } catch (err) {
        console.error("Erro upload:", err);
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{'header': [1, 2, 3, false]}],
        ['bold', 'italic', 'underline'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const quillRef = React.useRef(null);
  const quillRef2 = React.useRef(null);
  const quillRef3 = React.useRef(null);

  return (
    <div className="w-full relative">
      {/* TELA 1: LISTA */}
      {view === 'list' && (
        <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 mb-12">
          <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold uppercase text-[#059669] tracking-tighter">Treinamentos SIF</h2>
              <p className="text-gray-500 text-sm mt-1">Gerencie os cursos e capacitações técnicas</p>
            </div>
            <Button onClick={() => setView('form')} variant="primary" className="flex items-center gap-2 py-4 px-6 rounded-2xl font-bold">
              <Plus size={20}/> Novo Treinamento
            </Button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {trainings.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium italic">Nenhum treinamento cadastrado no sistema.</div>
            ) : (
              trainings.map(training => (
                <div key={training.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 border overflow-hidden flex items-center justify-center text-gray-300">
                      {training.image_url ? <img src={getImageUrl(training.image_url)} className="w-full h-full object-cover" /> : <ImageIcon />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#059669] transition-colors text-lg uppercase tracking-tight">{training.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                        <Layers size={12} className="text-[#059669]"/> {training.segment}
                        <Clock size={12} className="text-[#059669]"/> {training.hours}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(training)} className="p-4 bg-emerald-50 text-[#059669] rounded-2xl hover:bg-[#059669] hover:text-white transition-all shadow-sm"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(training.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO */}
      {view === 'form' && (
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-8 pb-6 border-b">
            <h2 className="text-3xl font-bold uppercase text-[#059669] tracking-tighter">
              {editingId ? 'Editar Treinamento' : 'Novo Treinamento Técnico'}
            </h2>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <X size={18}/> Cancelar
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título do Treinamento</label>
                  <input className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border focus:border-[#059669]" placeholder="Nome do curso..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Segmento</label>
                    <select className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#059669]" value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})}>
                      {segments.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Carga Horária</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm outline-none border focus:border-[#059669]" placeholder="Ex: 24h" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2"><Play size={10} /> Link do Vídeo</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-xs outline-none border focus:border-[#059669]" placeholder="YouTube URL..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2"><FileText size={10} /> Link do PDF (Ementa)</label>
                    <input className="w-full p-4 bg-gray-50 rounded-xl font-medium text-xs outline-none border focus:border-[#059669]" placeholder="PDF URL..." value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} />
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50">
                  <label className="text-[10px] font-black uppercase text-[#059669] tracking-widest block mb-4">Gerenciar Segmentos</label>
                  <div className="flex gap-2">
                    <input className="flex-1 p-3 bg-white rounded-xl text-xs font-bold outline-none border focus:border-[#059669]" placeholder="Novo segmento..." value={newSegment} onChange={e => setNewSegment(e.target.value)} />
                    <button type="button" onClick={addSegment} className="p-3 bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-all"><Plus size={20}/></button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Imagem Ilustrativa</label>
                <div className="relative h-full min-h-[300px] bg-gray-50 rounded-[40px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all font-sans">
                  {preview ? <img src={getImageUrl(preview)} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-4"><ImageIcon className="text-gray-300" size={48} /><span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Clique para Upload</span></div>}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            <div className="space-y-12 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="border-b pb-4">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter text-[#1f2937]">Quebra-Cabeça da <span className="text-[#059669]">Página</span></h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">Preencha os blocos que deseja exibir na página específica deste treinamento. Blocos vazios não serão renderizados.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#059669] tracking-widest ml-1 flex items-center gap-2"><Layers size={14}/> 1. Apresentação / Sobre o Curso</label>
                <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden mb-12">
                  <ReactQuill theme="snow" modules={modules} value={formData.presentation} onChange={(val) => setFormData({...formData, presentation: val})} className="h-48" />
                </div>
              </div>

              <div className="space-y-2 pt-8">
                <label className="text-[10px] font-black uppercase text-[#059669] tracking-widest ml-1 flex items-center gap-2"><Layers size={14}/> 2. Público-Alvo e Objetivos</label>
                <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden mb-12">
                  <ReactQuill theme="snow" modules={modules} value={formData.audience} onChange={(val) => setFormData({...formData, audience: val})} className="h-32" />
                </div>
              </div>

              <div className="space-y-2 pt-8">
                <label className="text-[10px] font-black uppercase text-[#059669] tracking-widest ml-1 flex items-center gap-2"><Layers size={14}/> 3. Módulos & Conteúdo Programático</label>
                <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden mb-12">
                  <ReactQuill theme="snow" modules={modules} value={formData.modules_content} onChange={(val) => setFormData({...formData, modules_content: val})} className="h-64" />
                </div>
              </div>
            </div>

            <div className="pt-12">
              <Button type="submit" className="w-full py-6 text-white text-lg font-bold uppercase tracking-widest rounded-2xl" variant="primary" isLoading={loading}>
                {editingId ? 'Salvar Alterações' : 'Publicar Treinamento'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
