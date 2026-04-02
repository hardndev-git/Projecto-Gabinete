import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Consulta() {
  const [activeTab, setActiveTab] = useState<'entradas' | 'saidas'>('entradas');
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocumentos();
  }, [activeTab]);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'entradas') {
        const { data, error } = await supabase
          .from('documentos_entrada')
          .select('*, tipos_documento(nome)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDocumentos(data || []);
      } else {
        const { data, error } = await supabase
          .from('documentos_saida')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setDocumentos(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documentos.filter(doc => 
    doc.num_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.origem && doc.origem.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (doc.destino && doc.destino.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Consulta de Documentos</h1>
        <p className="text-gray-400">Pesquise e visualize o histórico de documentos do seu gabinete.</p>
      </div>

      <div className="bg-[#111e3a] rounded-xl border border-gray-800 shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('entradas')}
            className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === 'entradas' ? 'bg-[#38b275]/10 text-[#38b275] border-b-2 border-[#38b275]' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Documentos de Entrada
          </button>
          <button 
            onClick={() => setActiveTab('saidas')}
            className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === 'saidas' ? 'bg-[#38b275]/10 text-[#38b275] border-b-2 border-[#38b275]' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Documentos de Saída
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por assunto, número de referência ou origem/destino..." 
                className="w-full bg-[#0b162c] border border-gray-700 rounded-md pl-10 pr-4 py-2.5 text-white focus:border-[#38b275] outline-none"
              />
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-md flex items-center gap-2 transition-colors">
              <Filter size={18} /> Filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={32} className="text-[#38b275] animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-[#0b162c] border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3">Nº Ref.</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Assunto</th>
                    <th className="px-4 py-3">{activeTab === 'entradas' ? 'Origem' : 'Destino'}</th>
                    {activeTab === 'saidas' && <th className="px-4 py-3">Estado</th>}
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">{doc.num_ref}</td>
                        <td className="px-4 py-4">{new Date(activeTab === 'entradas' ? doc.data_entrada : doc.data_saida).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-4 truncate max-w-[200px]" title={doc.assunto}>{doc.assunto}</td>
                        <td className="px-4 py-4">{activeTab === 'entradas' ? doc.origem : doc.destino}</td>
                        {activeTab === 'saidas' && (
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.estado === 'Despachado' ? 'bg-blue-500/20 text-blue-400' :
                              doc.estado === 'Parecer' ? 'bg-purple-500/20 text-purple-400' :
                              doc.estado === 'Encaminhado' ? 'bg-green-500/20 text-green-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {doc.estado}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-4 flex justify-end gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Visualizar">
                            <Eye size={16} />
                          </button>
                          {doc.upload_url && (
                            <button className="p-1.5 text-gray-400 hover:text-[#38b275] bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Baixar Anexo">
                              <Download size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum documento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
