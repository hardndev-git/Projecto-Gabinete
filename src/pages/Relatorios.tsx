import React, { useState, useEffect } from 'react';
import { BarChart2, Filter, FileText, Send, Loader2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Relatorios() {
  const [loading, setLoading] = useState(false);
  const [entradas, setEntradas] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);
  
  const [filtros, setFiltros] = useState({
    ano: new Date().getFullYear().toString(),
    mes: '',
    assunto: '',
    num_ref: ''
  });

  const anos = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const meses = [
    { valor: '01', nome: 'Janeiro' }, { valor: '02', nome: 'Fevereiro' },
    { valor: '03', nome: 'Março' }, { valor: '04', nome: 'Abril' },
    { valor: '05', nome: 'Maio' }, { valor: '06', nome: 'Junho' },
    { valor: '07', nome: 'Julho' }, { valor: '08', nome: 'Agosto' },
    { valor: '09', nome: 'Setembro' }, { valor: '10', nome: 'Outubro' },
    { valor: '11', nome: 'Novembro' }, { valor: '12', nome: 'Dezembro' }
  ];

  const fetchRelatorios = async () => {
    setLoading(true);
    try {
      // Construir query para Entradas
      let queryEntradas = supabase.from('documentos_entrada').select('*').order('data_entrada', { ascending: false });
      let querySaidas = supabase.from('documentos_saida').select('*').order('data_saida', { ascending: false });

      if (filtros.ano) {
        queryEntradas = queryEntradas.gte('data_entrada', `${filtros.ano}-01-01`).lte('data_entrada', `${filtros.ano}-12-31`);
        querySaidas = querySaidas.gte('data_saida', `${filtros.ano}-01-01`).lte('data_saida', `${filtros.ano}-12-31`);
      }
      
      if (filtros.mes && filtros.ano) {
        const ultimoDia = new Date(parseInt(filtros.ano), parseInt(filtros.mes), 0).getDate();
        queryEntradas = queryEntradas.gte('data_entrada', `${filtros.ano}-${filtros.mes}-01`).lte('data_entrada', `${filtros.ano}-${filtros.mes}-${ultimoDia}`);
        querySaidas = querySaidas.gte('data_saida', `${filtros.ano}-${filtros.mes}-01`).lte('data_saida', `${filtros.ano}-${filtros.mes}-${ultimoDia}`);
      }

      if (filtros.assunto) {
        queryEntradas = queryEntradas.ilike('assunto', `%${filtros.assunto}%`);
        querySaidas = querySaidas.ilike('assunto', `%${filtros.assunto}%`);
      }

      if (filtros.num_ref) {
        queryEntradas = queryEntradas.ilike('num_ref', `%${filtros.num_ref}%`);
        querySaidas = querySaidas.ilike('num_ref', `%${filtros.num_ref}%`);
      }

      const [resEntradas, resSaidas] = await Promise.all([queryEntradas, querySaidas]);

      if (resEntradas.data) setEntradas(resEntradas.data);
      if (resSaidas.data) setSaidas(resSaidas.data);

    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, [filtros.ano, filtros.mes]); // Atualiza automaticamente ao mudar data

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRelatorios();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Operações de Relatório</h1>
        <p className="text-gray-400">Visualize estatísticas e filtre registros de entradas e saídas.</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg flex items-center gap-4">
          <div className="bg-[#38b275]/20 p-4 rounded-lg">
            <FileText size={28} className="text-[#38b275]" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Entradas</p>
            <h3 className="text-3xl font-bold text-white">{entradas.length}</h3>
          </div>
        </div>
        <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg flex items-center gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg">
            <Send size={28} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Saídas</p>
            <h3 className="text-3xl font-bold text-white">{saidas.length}</h3>
          </div>
        </div>
        <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg flex items-center gap-4">
          <div className="bg-purple-500/20 p-4 rounded-lg">
            <BarChart2 size={28} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Volume Total</p>
            <h3 className="text-3xl font-bold text-white">{entradas.length + saidas.length}</h3>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Filter size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Filtros de Relatório</h2>
        </div>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Ano</label>
            <select name="ano" value={filtros.ano} onChange={handleFiltroChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-3 py-2 text-white outline-none focus:border-[#38b275]">
              <option value="">Todos</option>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Mês</label>
            <select name="mes" value={filtros.mes} onChange={handleFiltroChange} className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-3 py-2 text-white outline-none focus:border-[#38b275]">
              <option value="">Todos</option>
              {meses.map(m => <option key={m.valor} value={m.valor}>{m.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Nº Referência</label>
            <input type="text" name="num_ref" value={filtros.num_ref} onChange={handleFiltroChange} placeholder="Ex: 045/GPC" className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-3 py-2 text-white outline-none focus:border-[#38b275]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Assunto</label>
            <div className="flex gap-2">
              <input type="text" name="assunto" value={filtros.assunto} onChange={handleFiltroChange} placeholder="Palavra-chave..." className="w-full bg-[#0b162c] border border-gray-700 rounded-md px-3 py-2 text-white outline-none focus:border-[#38b275]" />
              <button type="submit" className="bg-[#38b275] hover:bg-[#2c8c5c] text-white px-4 rounded-md transition-colors flex items-center justify-center">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Filter size={18} />}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabela Entradas */}
        <div className="bg-[#111e3a] rounded-xl border border-gray-800 shadow-lg overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0b162c]/50">
            <h3 className="font-semibold text-white flex items-center gap-2"><FileText size={18} className="text-[#38b275]"/> Entradas Recentes</h3>
            <button className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Download size={14}/> Exportar</button>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-[#0b162c] sticky top-0">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Nº Ref</th>
                  <th className="px-4 py-3">Assunto</th>
                </tr>
              </thead>
              <tbody>
                {entradas.length > 0 ? entradas.slice(0, 15).map(doc => (
                  <tr key={doc.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(doc.data_entrada).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-medium text-gray-300">{doc.num_ref}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={doc.assunto}>{doc.assunto}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-500">Nenhum registro encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela Saídas */}
        <div className="bg-[#111e3a] rounded-xl border border-gray-800 shadow-lg overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0b162c]/50">
            <h3 className="font-semibold text-white flex items-center gap-2"><Send size={18} className="text-blue-400"/> Saídas Recentes</h3>
            <button className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Download size={14}/> Exportar</button>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-[#0b162c] sticky top-0">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Nº Ref</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {saidas.length > 0 ? saidas.slice(0, 15).map(doc => (
                  <tr key={doc.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(doc.data_saida).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 font-medium text-gray-300">{doc.num_ref}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase ${
                        doc.estado === 'Despachado' ? 'bg-blue-500/20 text-blue-400' :
                        doc.estado === 'Parecer' ? 'bg-purple-500/20 text-purple-400' :
                        doc.estado === 'Encaminhado' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>{doc.estado}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-500">Nenhum registro encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
