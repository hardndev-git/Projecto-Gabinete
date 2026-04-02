import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';

export default function Usuarios() {
  const { user, role } = useAuth();
  const [organismos, setOrganismos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    senha: '',
    organismo_id: '',
    role: 'user'
  });

  useEffect(() => {
    fetchOrganismos();
    fetchUsuarios();
  }, []);

  const fetchOrganismos = async () => {
    const { data } = await supabase.from('organismos').select('*').order('nome');
    if (data) setOrganismos(data);
  };

  const fetchUsuarios = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, organismos(nome)')
      .order('created_at', { ascending: false });
    if (data) setUsuarios(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Criamos um cliente temporário para não deslogar o Admin atual ao criar a nova conta
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false } }
      );

      // 1. Criar o usuário na tabela auth.users
      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Inserir os dados adicionais na tabela profiles usando o cliente principal (Admin)
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          nome_completo: formData.nome_completo,
          organismo_id: formData.organismo_id,
          role: formData.role
        });

        if (profileError) throw profileError;

        setSuccess(true);
        setFormData({
          nome_completo: '',
          email: '',
          senha: '',
          organismo_id: '',
          role: 'user'
        });
        fetchUsuarios(); // Atualiza a lista
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400 text-lg">Acesso negado. Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
        <p className="text-gray-400">Cadastre novos usuários e defina seus níveis de acesso e organismos.</p>
      </div>
      
      {/* Formulário de Cadastro */}
      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="bg-[#38b275]/20 p-2 rounded-lg">
            <UserPlus size={20} className="text-[#38b275]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Cadastrar Novo Usuário</h2>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md">{error}</div>}
        {success && <div className="mb-6 p-4 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md flex items-center gap-2"><CheckCircle size={20} /> Usuário cadastrado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nome Completo</label>
            <input required type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Ex: João da Silva" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemplo@cunene.gov.ao" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
            <input required type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" minLength={6} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Organismo ou Gabinete</label>
            <select required name="organismo_id" value={formData.organismo_id} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none">
              <option value="">Selecione o organismo...</option>
              {organismos.map(org => (
                <option key={org.id} value={org.id}>{org.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nível de Acesso</label>
            <select required name="role" value={formData.role} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none">
              <option value="user">Usuário Normal</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-gray-800">
            <button type="submit" disabled={loading} className="bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 text-white px-8 py-2.5 rounded-md font-medium transition-colors shadow-lg shadow-[#38b275]/20 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Users size={20} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Usuários Cadastrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-[#0b162c] border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">Nome Completo</th>
                <th className="px-4 py-3">Organismo</th>
                <th className="px-4 py-3">Nível de Acesso</th>
                <th className="px-4 py-3">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-white">{u.nome_completo}</td>
                    <td className="px-4 py-4">{u.organismos?.nome || 'Não definido'}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-4 py-4">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
