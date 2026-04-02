import React, { useState } from 'react';
import { Upload, Send, Search, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Saidas() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [docEntrada, setDocEntrada] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    data_saida: new Date().toISOString().split('T')[0],
    destino: '',
    estado: ''
  });

  const handleSearch = async () => {
    if (!searchTerm) return;
    setSearching(true);
    setError('');
    
    try {
      const { data, error: searchError } = await supabase
        .from('documentos_entrada')
        .select('*')
        .ilike('num_ref', `%${searchTerm}%`)
        .limit(1)
        .single();

      if (searchError) throw searchError;
      
      if (data) {
        setDocEntrada(data);
      } else {
        setError('Documento não encontrado.');
        setDocEntrada(null);
      }
    } catch (err) {
      setError('Documento não encontrado ou erro na busca.');
      setDocEntrada(null);
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organismo_id || !docEntrada) {
      setError('Selecione um documento de entrada válido.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase.from('documentos_saida').insert({
        documento_entrada_id: docEntrada.id,
        data_saida: formData.data_saida,
        assunto: docEntrada.assunto,
        destino: formData.destino,
        num_ref: docEntrada.num_ref,
        estado: formData.estado,
        organismo_id: user.organismo_id,
        created_by: user.id
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ ...formData, destino: '', estado: '' });
      setDocEntrada(null);
      setSearchTerm('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar saída.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Saída de Documentos</h1>
        <p className="text-gray-400">Registre o encaminhamento, despacho ou parecer de documentos existentes.</p>
      </div>
      
      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Send size={20} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Registrar Nova Saída</h2>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md">{error}</div>}
        {success && <div className="mb-6 p-4 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md flex items-center gap-2"><CheckCircle size={20} /> Saída registrada com sucesso!</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-[#0b162c] p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-[#38b275] mb-2">Vincular Documento de Entrada</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nº de Ref..." 
                className="flex-1 bg-[#111e3a] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" 
              />
              <button 
                type="button" 
                onClick={handleSearch}
                disabled={searching}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-md transition-colors flex items-center gap-2"
              >
                {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Buscar
              </button>
            </div>
            {docEntrada && (
              <div className="mt-3 p-3 bg-[#38b275]/10 border border-[#38b275]/30 rounded-md text-sm text-green-400">
                Documento encontrado: <strong>{docEntrada.num_ref}</strong> - {docEntrada.assunto}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nº de Referência</label>
            <input type="text" disabled className="w-full bg-[#0b162c]/50 border border-gray-800 rounded-md px-4 py-2.5 text-gray-500 cursor-not-allowed" value={docEntrada?.num_ref || 'Preenchimento automático'} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data de Saída</label>
            <input required type="date" name="data_saida" value={formData.data_saida} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Assunto</label>
            <input type="text" disabled className="w-full bg-[#0b162c]/50 border border-gray-800 rounded-md px-4 py-2.5 text-gray-500 cursor-not-allowed" value={docEntrada?.assunto || 'Preenchimento automático'} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Destino</label>
            <input required type="text" name="destino" value={formData.destino} onChange={handleChange} placeholder="Para onde o documento foi enviado" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
            <select required name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none">
              <option value="">Selecione o estado...</option>
              <option value="Despachado">Despachado</option>
              <option value="Pronunciamento">Pronunciamento</option>
              <option value="Parecer">Parecer</option>
              <option value="Encaminhado">Encaminhado</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload de Anexo (Opcional)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-[#0b162c] hover:bg-gray-800/50 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-400">Anexar documento despachado/parecer (PDF)</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-gray-800">
            <button type="submit" disabled={loading || !docEntrada} className="bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 text-white px-8 py-2.5 rounded-md font-medium transition-colors shadow-lg shadow-[#38b275]/20 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Registrar Saída
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
