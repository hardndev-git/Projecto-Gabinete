import React, { useState, useEffect } from 'react';
import { Upload, Plus, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Entradas() {
  const { user } = useAuth();
  const [tiposDoc, setTiposDoc] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    tipo_doc_id: '',
    num_ref: '',
    data_emissao: '',
    data_entrada: new Date().toISOString().split('T')[0],
    origem: '',
    assunto: ''
  });

  useEffect(() => {
    const fetchTipos = async () => {
      const { data } = await supabase.from('tipos_documento').select('*').order('nome');
      if (data) setTiposDoc(data);
    };
    fetchTipos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organismo_id) {
      setError('Usuário não está vinculado a um organismo.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase.from('documentos_entrada').insert({
        ...formData,
        organismo_id: user.organismo_id,
        created_by: user.id
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        ...formData,
        num_ref: '',
        origem: '',
        assunto: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Entrada de Documentos</h1>
        <p className="text-gray-400">Gerencie e registre todos os documentos recebidos pelo seu gabinete.</p>
      </div>
      
      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="bg-[#38b275]/20 p-2 rounded-lg">
            <Plus size={20} className="text-[#38b275]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Registrar Nova Entrada</h2>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md">{error}</div>}
        {success && <div className="mb-6 p-4 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md flex items-center gap-2"><CheckCircle size={20} /> Documento registrado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Documento</label>
            <select required name="tipo_doc_id" value={formData.tipo_doc_id} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none">
              <option value="">Selecione o tipo...</option>
              {tiposDoc.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nº de Referência</label>
            <input required type="text" name="num_ref" value={formData.num_ref} onChange={handleChange} placeholder="Ex: 045/GPC/2023" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data de Emissão</label>
            <input required type="date" name="data_emissao" value={formData.data_emissao} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data de Entrada</label>
            <input required type="date" name="data_entrada" value={formData.data_entrada} onChange={handleChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Origem / Proveniência</label>
            <input required type="text" name="origem" value={formData.origem} onChange={handleChange} placeholder="Nome da instituição ou pessoa de origem" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Assunto</label>
            <textarea required rows={3} name="assunto" value={formData.assunto} onChange={handleChange} placeholder="Descreva o assunto do documento" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:border-[#38b275] outline-none resize-none"></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload de Anexo (Opcional)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-[#0b162c] hover:bg-gray-800/50 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-400">Clique para selecionar ou arraste o arquivo PDF aqui</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-gray-800">
            <button type="button" onClick={() => setFormData({...formData, num_ref: '', origem: '', assunto: ''})} className="bg-transparent text-gray-400 hover:text-white px-6 py-2.5 rounded-md font-medium transition-colors mr-4">
              Limpar
            </button>
            <button type="submit" disabled={loading} className="bg-[#38b275] hover:bg-[#2c8c5c] disabled:opacity-50 text-white px-8 py-2.5 rounded-md font-medium transition-colors shadow-lg shadow-[#38b275]/20 flex items-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
