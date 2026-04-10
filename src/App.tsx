import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Consulta from './pages/Consulta';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Organismos from './pages/Organismos';
import TiposDocumento from './pages/TiposDocumento';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Rotas Comuns */}
            <Route path="entradas" element={<Entradas />} />
            <Route path="saidas" element={<Saidas />} />
            <Route path="consulta" element={<Consulta />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            
            {/* Rotas de Admin e Perfil */}
            <Route path="perfil" element={<Perfil />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="organismos" element={<Organismos />} />
            <Route path="tipos-documento" element={<TiposDocumento />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
