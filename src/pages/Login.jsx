import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'; // ADICIONEI ArrowRight AQUI
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import iconLogo from '../assets/icone.svg'; // Certifique-se que esta imagem existe
import { Input } from '../components/ui/FormElements';
import Button from '../components/ui/Button';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
    navigate('/dashboard'); 
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1f2937] flex flex-col">
      <Navbar scrolled={true} />

      <div className="flex-1 flex items-stretch min-h-screen pt-20">
        {/* LADO ESQUERDO (Imagem/Decorativo) - Some no mobile */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#1f2937] overflow-hidden items-center justify-center p-12">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" alt="CD" className="w-full h-full object-cover opacity-20 mix-blend-overlay"/>
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f2937] via-[#0f172a] to-[#900f24] opacity-90"></div>
            </div>
            <div className="relative z-10 text-center max-w-lg">
                <div className="w-32 h-32 mx-auto mb-8 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                    <img src={iconLogo} alt="Sif Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
                </div>
                <h2 className="text-4xl font-bold uppercase text-white mb-4 tracking-tight">Bem-vindo à <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC107] to-[#fbbf24]">Área do Cliente</span></h2>
                <p className="text-gray-400 text-lg font-medium leading-relaxed">Acompanhe seus pedidos, baixe notas fiscais e gerencie sua conta com a agilidade que seu negócio precisa.</p>
            </div>
        </div>

        {/* LADO DIREITO (Formulário) */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
            <div className="w-full max-w-md">
                <div className="mb-10 text-center lg:text-left">
                    <span className="text-[#D91A3C] font-bold uppercase tracking-widest text-xs mb-2 block">Login Seguro</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-2 font-heading uppercase">Acesse sua Conta</h1>
                    <p className="text-gray-500 text-sm">Entre com suas credenciais para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="E-mail ou CNPJ" 
                        icon={Mail} 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="exemplo@empresa.com.br" 
                        required 
                    />
                    
                    <div className="space-y-2 relative">
                         <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Senha</label>
                            <a href="#" className="text-xs font-bold text-[#D91A3C] hover:underline">Esqueceu a senha?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20} /></div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 text-[#1f2937] font-medium rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#D91A3C] focus:ring-1 focus:ring-[#D91A3C] transition-all placeholder:text-gray-400" 
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1f2937] transition-colors">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button variant="primary" type="submit" className="w-full" icon={ArrowRight}>Entrar no Sistema</Button>

                    <div className="text-center mt-4">
                        <p className="text-gray-500 text-sm font-medium">Ainda não é cliente? <a href="/contato" className="text-[#1f2937] font-bold hover:text-[#D91A3C] transition-colors">Solicite seu cadastro</a></p>
                    </div>
                </form>
            </div>
            <div className="absolute bottom-6 text-center w-full text-xs text-gray-400 font-medium opacity-60">&copy; {new Date().getFullYear()}SIF. Painel Seguro.</div>
        </div>
      </div>
    </div>
  );
}