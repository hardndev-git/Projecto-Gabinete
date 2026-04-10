import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Send, Search, BarChart2, Settings, Users, Building, FileType } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, role } = useAuth();

  const options = [
    { icon: FileText, label: 'Entrada de documentos', path: '/entradas', desc: 'Registe novos documentos no sistema', color: 'bg-blue-500' },
    { icon: Send, label: 'Saída de documentos', path: '/saidas', desc: 'Faça a tramitação de documentos para outras áreas', color: 'bg-green-500' },
    { icon: Search, label: 'Consultar documento', path: '/consulta', desc: 'Pesquise por documentos registados no sistema', color: 'bg-purple-500' },
    { icon: BarChart2, label: 'Operações de relatório', path: '/relatorios', desc: 'Extraia estatísticas e relatórios globais', color: 'bg-orange-500' },
  ];

  const adminOptions = [
    { icon: Users, label: 'Gerenciar Usuários', path: '/usuarios', desc: 'Crie e edite as contas do sistema', color: 'bg-red-500' },
    { icon: Building, label: 'Gerenciar Organismos', path: '/organismos', desc: 'Gira a configuração de departamentos', color: 'bg-indigo-500' },
    { icon: FileType, label: 'Tipos de Documento', path: '/tipos-documento', desc: 'Configuração de classificadores', color: 'bg-teal-500' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes', desc: 'Parametrização global da plataforma', color: 'bg-gray-600' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo(a), {user?.nome || 'Utilizador'}!</h1>
        <p className="text-gray-400">Página Inicial do Sistema - Escolha uma das funcionalidades abaixo para começar.</p>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[#38b275] flex items-center gap-2">Módulos Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {options.map((opt, idx) => (
          <Link key={idx} to={opt.path} className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 hover:border-[#38b275] transition-all transform hover:-translate-y-1 group shadow-lg shadow-black/20">
            <div className={`w-14 h-14 ${opt.color} rounded-lg flex items-center justify-center mb-5 text-white shadow-md`}>
              <opt.icon size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#38b275] transition-colors">{opt.label}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{opt.desc}</p>
          </Link>
        ))}
      </div>

      {role === 'admin' && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">Administração do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminOptions.map((opt, idx) => (
              <Link key={idx} to={opt.path} className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 hover:border-red-400/50 transition-all transform hover:-translate-y-1 group shadow-lg shadow-black/20">
                <div className={`w-14 h-14 ${opt.color} rounded-lg flex items-center justify-center mb-5 text-white shadow-md`}>
                  <opt.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{opt.label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{opt.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
