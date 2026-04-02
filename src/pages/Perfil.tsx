import React, { useState, useEffect } from 'react';
import { User, Loader2, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { user, role, refreshProfile } = useAuth();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.nome);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ nome_completo: nome })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-gray-400">Visualize e atualize suas informações pessoais.</p>
      </div>

      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="bg-[#38b275]/20 p-2 rounded-lg">
            <User size={20} className="text-[#38b275]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Informações da Conta</h2>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md">{error}</div>}
        {success && <div className="mb-6 p-4 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md flex items-center gap-2"><CheckCircle size={20} /> Perfil atualizado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome Completo</label>
              <input 
                required 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">E-mail (Acesso)</label>
              <input 
                type="email" 
                disabled 
                value={user?.email || ''} 
                className="w-full bg-[#0b162c]/50 border border-gray-800 rounded-md px-4 py-2.5 text-gray-500 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Organismo / Gabinete</label>
              <input 
                type="text" 
                disabled 
                value={user?.organismo || ''} 
                className="w-full bg-[#0b162c]/50 border border-gray-800 rounded-md px-4 py-2.5 text-gray-500 cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nível de Acesso</label>
              <div className="flex items-center gap-2 w-full bg-[#0b162c]/50 border border-gray-800 rounded-md px-4 py-2.5 text-gray-500 cursor-not-allowed">
                <Shield size={18} className={role === 'admin' ? 'text-purple-400' : 'text-gray-400'} />
                <span>{role === 'admin' ? 'Administrador' : 'Usuário Normal'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 text-white px-8 py-2.5 rounded-md font-medium transition-colors shadow-lg shadow-[#38b275]/20 flex items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
