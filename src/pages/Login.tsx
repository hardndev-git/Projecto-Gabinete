import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;

        if (data?.user && data?.user?.identities && data.user.identities.length === 0) {
          throw new Error('Este e-mail já está cadastrado no sistema.');
        }

        if (data?.user && !data?.session) {
          setError('Cadastro concluído com sucesso! Verifique o seu e-mail para confirmar a conta antes de tentar entrar.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      }
      
      await refreshProfile();

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = 'Ocorreu um erro ao tentar processar a solicitação.';
      
      if (err.message === 'Invalid login credentials') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (err.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.message.toLowerCase().includes('already registered')) {
        errorMessage = 'Este e-mail já está cadastrado no sistema.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b162c] text-white font-sans">
      <header className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl tracking-tight text-[#0b162c]">Gabinete da Governadora Provincial</div>
        <div className="font-semibold text-lg text-gray-600 hidden md:block">Governo Provincial do Cunene</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-green-500 opacity-20"></div>

        <div className="text-center mb-10 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Gabinete da Governadora Provincial</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Sistema de Gestão Documental.
          </p>
        </div>

        <div className="bg-[#111e3a] p-8 rounded-xl border border-gray-800 w-full max-w-md shadow-2xl z-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-green-500"></div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-[#38b275]/20 p-3 rounded-full">
              <ShieldCheck size={32} className="text-[#38b275]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Criar Nova Conta' : 'Acesso ao Sistema'}</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                required
                placeholder="exemplo@cunene.gov.ao"
                className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#38b275] focus:ring-1 focus:ring-[#38b275] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#38b275] focus:ring-1 focus:ring-[#38b275] transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#38b275] focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isSignUp && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 rounded border-[#38b275] bg-[#0b162c] text-[#38b275] focus:ring-1 focus:ring-[#38b275] focus:ring-offset-[#111e3a]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                  Lembrar-me
                </label>
              </div>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md font-medium text-lg transition-colors mt-6 shadow-lg shadow-[#38b275]/20 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (isSignUp ? 'Cadastrar-se' : 'Entrar no Sistema')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }} 
              className="text-[#38b275] text-sm hover:underline hover:text-[#2c8c5c] transition-colors"
            >
              {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastrar-se'}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-[#0b162c] border-t border-gray-800 p-4 px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
        <div>ENG.º DE FLORES HAWALA [Ndafaohamba]</div>
        <div className="font-semibold text-gray-400">Sistema de Gestão Documental</div>
        <div>Governo Provincial do Cunene</div>
      </footer>
    </div>
  );
}
