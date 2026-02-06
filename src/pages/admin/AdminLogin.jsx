import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'; // Importei Eye e EyeOff
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/FormElements';
import Button from '../../components/ui/Button';
import iconLogo from '../../assets/icone.svg';

// Ajuste para HTTPS quando for para produção
const API_URL = 'http://localhost/chocosul-api/login_admin.php';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // Novo estado
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Mantendo a segurança
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            login(data.user.email, 'admin-token'); 
            navigate('/admin/dashboard');
        } else {
            setError(data.message || "Acesso não autorizado.");
        }
    } catch (err) {
        console.error(err);
        setError("Erro de conexão com o servidor.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="h-2 bg-gradient-to-r from-[#D91A3C] to-[#FFC107]"></div>
            
            <div className="p-10">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                        <img src={iconLogo} alt="Admin" className="w-12 h-12 object-contain" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1f2937] uppercase tracking-wide flex items-center justify-center gap-2">
                        <ShieldCheck size={24} className="text-[#D91A3C]" /> Acesso Restrito
                    </h1>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Painel Corporativo</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-xs font-bold text-red-600">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Usuário Corporativo" 
                        icon={User} 
                        placeholder="admin@chocosul.com" 
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    
                    {/* CAMPO DE SENHA CUSTOMIZADO COM TOGGLE */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Chave de Acesso</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#D91A3C] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#D91A3C] focus:ring-4 focus:ring-red-50 transition-all font-medium text-gray-700 placeholder-gray-400"
                                placeholder="••••••••"
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            {/* Botão do Olhinho */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <Button variant="primary" type="submit" className="w-full mt-4" icon={ArrowRight} isLoading={loading}>
                        {loading ? 'Autenticando...' : 'Entrar'}
                    </Button>
                </form>
            </div>
            
            <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Ambiente Seguro v1.0
                </p>
            </div>
        </div>
    </div>
  );
}