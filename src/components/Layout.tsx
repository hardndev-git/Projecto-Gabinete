import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { FileText, Send, Search, BarChart2, Settings, User, Users, Building, FileType, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    ...(role === 'admin' ? [
      { icon: User, label: 'Gerenciar perfil', path: '/perfil' },
      { icon: Users, label: 'Gerenciar Usuários', path: '/usuarios' },
      { icon: Building, label: 'Gerenciar Organismo', path: '/organismos' },
      { icon: FileType, label: 'Tipo de documento', path: '/tipos-documento' },
    ] : []),
    { icon: Home, label: 'Página Inicial', path: '/dashboard' },
    { icon: FileText, label: 'Entrada de documentos', path: '/entradas' },
    { icon: Send, label: 'Saída de documentos', path: '/saidas' },
    { icon: Search, label: 'Consultar documento', path: '/consulta' },
    { icon: BarChart2, label: 'Operações de relatório', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b162c] text-white font-sans">
      {/* Barra Superior */}
      <header className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl tracking-tight text-[#0b162c]">
            {user.organismo || 'Nome do Organismo ou Gabinete'}
          </div>
        </div>
        <div className="font-semibold text-lg text-gray-600 hidden md:block">
          Governo Provincial do Cunene
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Menu Lateral */}
        <aside className="w-72 bg-[#111e3a] border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Menu Principal</h2>
            <p className="text-xs text-[#38b275] font-medium">Logado como: {role === 'admin' ? 'Administrador' : 'Usuário'}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-[#38b275] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full">
              <LogOut size={20} />
              <span className="font-medium">Sair do Sistema</span>
            </button>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Rodapé */}
      <footer className="bg-[#0b162c] border-t border-gray-800 p-4 px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
        <div>ENG.º DE FLORES HAWALA [Ndafaohamba]</div>
        <div className="font-semibold text-gray-400">Sistema de Gestão Documental</div>
        <div>Governo Provincial do Cunene</div>
      </footer>
    </div>
  );
}
