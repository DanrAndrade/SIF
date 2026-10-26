import React, { useState } from 'react';
import { ArrowRight, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { API_BASE_URL } from '../../apiConfig';
import LoginStyles from '../../components/admin/login/LoginStyles';
import LoginHero from '../../components/admin/login/LoginHero';
import LoginField from '../../components/admin/login/LoginField';

const API_URL = `${API_BASE_URL}/login_admin.php`;

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0); // reinicia o "shake" a cada erro
  const [loading, setLoading] = useState(false);

  const fail = (msg) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Obriga o navegador a salvar o cookie de sessão do PHP
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      // 429 (muitas tentativas) e demais erros também vêm em JSON com "message"
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('admin_mode', 'true');
        // BASE_URL respeita a subpasta ('/sif-novo-h7k2x9/') em produção e '/' em dev
        window.location.href = import.meta.env.BASE_URL + 'admin/dashboard';
      } else {
        fail(data.message || 'Acesso não autorizado.');
      }
    } catch (err) {
      fail('Erro de conexão. Verifique sua conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const delay = (s) => ({ animationDelay: `${s}s` });

  return (
    <div className="min-h-screen overflow-x-hidden bg-sif-dark font-sans lg:grid lg:grid-cols-[1.25fr_1fr]">
      <LoginStyles />
      <LoginHero />

      <main className="relative z-20 -mt-10 flex min-h-[calc(58vh+2.5rem)] flex-col rounded-t-panel bg-white px-6 pb-8 pt-10 sm:px-10 lg:mt-0 lg:min-h-screen lg:rounded-none lg:px-16 lg:py-12 xl:px-24">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-[400px]">
            <p className="lg-rise mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-sif-green" style={delay(0.25)}>
              Painel SIF
            </p>
            <h1
              className="lg-rise font-heading text-[30px] font-extrabold leading-tight tracking-tight text-sif-ink sm:text-[36px] lg:text-[40px]"
              style={delay(0.35)}
            >
              Bem-vindo de volta
            </h1>
            <p className="lg-rise mt-2 text-[15px] leading-relaxed text-gray-500" style={delay(0.45)}>
              Entre com seus dados de acesso para gerenciar o conteúdo do site.
            </p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-4" noValidate>
              <LoginField
                className="lg-rise"
                style={delay(0.55)}
                label="E-mail ou usuário"
                name="email"
                autoComplete="username"
                value={formData.email}
                invalid={!!error}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <LoginField
                className="lg-rise"
                style={delay(0.65)}
                label="Senha"
                type="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                invalid={!!error}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <div aria-live="assertive">
                {error && (
                  <div
                    key={errorKey}
                    role="alert"
                    className="lg-shake flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3.5 text-[13px] font-medium leading-snug text-red-700"
                  >
                    <AlertCircle size={18} className="mt-px shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="lg-rise pt-2" style={delay(0.75)}>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="lg-motion group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-sif-dark text-[13px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_35px_-18px_rgba(11,51,32,0.9)] transition-all duration-300 hover:bg-sif-deep hover:shadow-[0_22px_40px_-16px_rgba(0,122,61,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sif-leaf/40 active:scale-[0.98] disabled:cursor-wait"
                >
                  {loading && (
                    <span aria-hidden="true" className="absolute inset-0 overflow-hidden">
                      <span className="lg-sweep absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </span>
                  )}
                  <span className="relative flex items-center justify-center gap-3">
                    {/* texto (o -mr compensa o espaçamento extra da última letra) */}
                    <span className="mr-[-0.16em] leading-none">{loading ? 'Entrando...' : 'Entrar'}</span>

                    {/* ícone: seta (desliza no hover/foco e corre em loop) ou ícone girando no carregamento */}
                    <span
                      aria-hidden="true"
                      className={`lg-motion relative flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
                        loading ? '' : 'group-hover:translate-x-[7px] group-focus-visible:translate-x-[7px]'
                      }`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <ArrowRight
                          size={19}
                          strokeWidth={2.5}
                          className={`lg-arrow lg-motion text-sif-lime transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
                            loading ? 'translate-x-4 opacity-0' : 'opacity-100'
                          }`}
                        />
                      </span>
                      <span
                        className={`lg-motion absolute inset-0 flex items-center justify-center text-sif-lime transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
                          loading ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }`}
                      >
                        <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer
          className="lg-rise mx-auto mt-10 flex w-full max-w-[400px] items-center justify-between text-[12px] font-medium text-gray-400"
          style={delay(0.9)}
        >
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-sif-green">
            <ArrowLeft size={14} /> Voltar ao site
          </Link>
          <span>© {new Date().getFullYear()} SIF</span>
        </footer>
      </main>
    </div>
  );
}
