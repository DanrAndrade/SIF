import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, ToggleLeft, ToggleRight, Save, UploadCloud, Edit, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Button from '../ui/Button';
import { Input } from '../ui/FormElements';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  
  // Estados do formulário
  const [editingId, setEditingId] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Estados de controle e feedback
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // --- NOVO: Estado para o Modal de Exclusão ---
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // URL da API (Já atualizada para SIF)
  const API_URL = 'http://localhost/sif-api/banners.php'; 

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      if (Array.isArray(response.data)) {
        setBanners(response.data);
      } else {
        setBanners([]); 
      }
    } catch (err) {
      console.error("Erro ao buscar banners:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { 
        setError('Imagem muito pesada! Máximo 2MB.');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        setError('Apenas arquivos de imagem são permitidos.');
        return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
    setError('');
  };

  const handleEditClick = (banner) => {
    setEditingId(banner.id);
    setLinkUrl(banner.link_url || '');
    setIsActive(banner.active == 1);
    setPreviewUrl(banner.image_url);
    setSelectedFile(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBanner = async () => {
    if (!editingId && banners.length >= 5) {
        setError('Limite máximo de 5 banners atingido.');
        return;
    }
    if (!editingId && !selectedFile) {
        setError('Selecione uma imagem para criar um banner.');
        return;
    }

    setUploading(true);
    const formData = new FormData();
    
    if (editingId) formData.append('id', editingId);
    if (selectedFile) formData.append('image', selectedFile); 
    
    formData.append('link_url', linkUrl);
    formData.append('active', isActive ? '1' : '0');

    try {
        await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true 
        });
        
        resetForm();
        fetchBanners(); 
    } catch (err) {
        console.error(err);
        const msgReal = err.response?.data?.error || err.message || 'Erro desconhecido.';
        setError(`Erro: ${msgReal}`);
    } finally {
        setUploading(false);
    }
  };

  // --- FUNÇÃO 1: Abre o Modal ---
  const requestDelete = (banner) => {
    setBannerToDelete(banner);
  };

  // --- FUNÇÃO 2: Executa a Exclusão Real ---
  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
        await axios.delete(`${API_URL}?id=${bannerToDelete.id}`, { withCredentials: true });
        setBanners(banners.filter(b => b.id !== bannerToDelete.id));
        if (editingId === bannerToDelete.id) resetForm();
        setBannerToDelete(null); // Fecha o modal
    } catch (err) {
        alert('Erro ao excluir banner.');
    }
  };

  const toggleActive = async (banner) => {
    const newState = !banner.active; 
    const previousBanners = [...banners];
    setBanners(banners.map(b => b.id === banner.id ? { ...b, active: newState } : b));

    try {
        await axios.put(`${API_URL}?id=${banner.id}`, 
            { active: newState }, 
            { withCredentials: true }
        );
    } catch (err) {
        setBanners(previousBanners); 
        alert("Erro ao atualizar status.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setLinkUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setIsActive(true);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
      
      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
                
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-600" size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">Excluir Banner?</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Esta ação não pode ser desfeita. O banner será removido permanentemente do site.
                </p>

                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => setBannerToDelete(null)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-md transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gerenciar Banners</h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${banners.length >= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {banners.length} / 5 Utilizados
        </span>
      </div>

      {/* FORMULÁRIO */}
      <div className={`p-6 rounded-xl mb-8 border transition-colors ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-bold uppercase flex items-center gap-2 ${editingId ? 'text-blue-600' : 'text-gray-500'}`}>
                {editingId ? <Edit size={16} /> : <Plus size={16} />} 
                {editingId ? 'Editando Banner' : 'Adicionar Novo'}
            </h3>
            {editingId && (
                <button onClick={resetForm} className="text-xs font-bold text-gray-500 hover:text-red-500 flex items-center gap-1">
                    <X size={14} /> Cancelar
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">
                    {editingId ? 'Alterar Imagem (Opcional)' : 'Imagem do Banner'}
                </label>
                
                <div className={`relative w-full h-40 bg-white border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group
                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#3c7a43]'}`}>
                    
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <UploadCloud className="mx-auto h-8 w-8 text-gray-400 group-hover:text-[#3c7a43]" />
                            <p className="mt-2 text-xs text-gray-500 font-medium">Clique para upload</p>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                </div>
                
                <div className="mt-2 text-[11px] text-gray-500 bg-white p-2 rounded border border-gray-100">
                    <span className="font-bold text-gray-700 block mb-1">ℹ️ Resolução Recomendada:</span>
                    <strong>1440 x 550 px</strong>. A imagem será adaptada automaticamente.
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <Input 
                    label="Link de Destino (Opcional)"
                    placeholder="Ex: https://instagram.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                />
                
                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                    >
                        {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        {isActive ? 'Visível' : 'Oculto'}
                    </button>
                </div>

                <div className="mt-auto">
                    {error && <p className="text-xs text-red-500 font-bold mb-2 text-center">{error}</p>}
                    
                    <Button 
                        onClick={handleSaveBanner} 
                        disabled={uploading || (!editingId && banners.length >= 5)} 
                        className="w-full"
                        isLoading={uploading}
                        variant={'primary'}
                    >
                        <Save size={16} /> {uploading ? 'Salvando...' : (editingId ? 'Atualizar Banner' : 'Salvar Banner')}
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="space-y-3">
        {banners.map((banner) => (
            <div key={banner.id} className={`group flex items-center gap-4 p-3 border rounded-lg bg-white transition-all ${editingId === banner.id ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-100 hover:border-gray-300'}`}>
                <div className="w-32 h-14 rounded bg-gray-100 overflow-hidden relative border border-gray-200">
                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                    {(banner.active == 0 || banner.active === false) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-[1px]">
                            Inativo
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Link:</p>
                    <p className="text-sm text-gray-700 truncate font-medium">
                        {banner.link_url ? banner.link_url : <span className="text-gray-400 italic">Sem link</span>}
                    </p>
                </div>

                <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                    <button 
                        onClick={() => toggleActive(banner)}
                        title={banner.active ? "Ocultar" : "Mostrar"}
                        className={`p-2 rounded-full transition-colors ${banner.active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {banner.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    
                    <button 
                        onClick={() => handleEditClick(banner)}
                        className="p-2 rounded-full text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>

                    {/* Botão que chama o novo Modal */}
                    <button 
                        onClick={() => requestDelete(banner)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
        
        {banners.length === 0 && !uploading && (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Nenhum banner cadastrado.</p>
            </div>
        )}
      </div>
    </div>
  );
}