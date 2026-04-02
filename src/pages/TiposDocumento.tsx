import React, { useState, useEffect } from 'react';
import { FileType, Plus, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function TiposDocumento() {
  const { role } = useAuth();
  const [tipos, setTipos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    const { data } = await supabase.from('tipos_documento').select('*').order('nome');
    if (data) setTipos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('tipos_documento')
        .insert({ nome });

      if (insertError) throw insertError;

      setSuccess(true);
      setNome('');
      fetchTipos();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar tipo de documento.');
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tipos de Documento</h1>
        <p className="text-gray-400">Gerencie as categorias de documentos aceitas no sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-1 bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="bg-[#38b275]/20 p-2 rounded-lg">
              <Plus size={20} className="text-[#38b275]" />
            </div>
            <h2 className="text-lg font-semibold text-white">Novo Tipo</h2>
          </div>

          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md text-sm flex items-center gap-2"><CheckCircle size={16} /> Cadastrado com sucesso!</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome do Tipo</label>
              <input 
                required 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Ex: Ofício, Memorando..." 
                className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !nome.trim()} 
              className="w-full bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 text-white px-4 py-2.5 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Cadastrar
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <FileType size={20} className="text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Tipos Cadastrados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-[#0b162c] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3">Tipo de Documento</th>
                  <th className="px-4 py-3 w-32">Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {tipos.length > 0 ? (
                  tipos.map((tipo) => (
                    <tr key={tipo.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{tipo.nome}</td>
                      <td className="px-4 py-4">{new Date(tipo.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-gray-500">
                      Nenhum tipo de documento cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
