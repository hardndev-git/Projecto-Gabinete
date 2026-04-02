import React, { useState } from 'react';
import { Settings, Palette, Info, Phone, CheckCircle } from 'lucide-react';

export default function Configuracoes() {
  const [activeTheme, setActiveTheme] = useState('escuro');
  const [saved, setSaved] = useState(false);

  const temas = [
    { id: 'escuro', nome: 'Escuro (Padrão)', color: 'bg-[#0b162c]', border: 'border-gray-600' },
    { id: 'branco', nome: 'Claro', color: 'bg-gray-100', border: 'border-gray-300' },
    { id: 'roxo', nome: 'Roxo Escuro', color: 'bg-[#1e112a]', border: 'border-purple-800' },
    { id: 'azul', nome: 'Azul Claro', color: 'bg-[#f0f4f8]', border: 'border-blue-200' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
        <p className="text-gray-400">Personalize a aparência do sistema e consulte informações de suporte.</p>
      </div>

      {saved && (
        <div className="p-4 bg-[#38b275]/10 border border-[#38b275]/50 text-[#38b275] rounded-md flex items-center gap-2">
          <CheckCircle size={20} /> Configurações salvas com sucesso!
        </div>
      )}

      {/* Aparência */}
      <div className="bg-[#111e3a] p-6 md:p-8 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <Palette size={20} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Aparência e Temas</h2>
        </div>

        <p className="text-sm text-gray-400 mb-4">Escolha o tema visual de sua preferência para o sistema:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {temas.map(tema => (
            <button
              key={tema.id}
              onClick={() => setActiveTheme(tema.id)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                activeTheme === tema.id ? 'border-[#38b275] bg-[#38b275]/10' : 'border-gray-800 hover:border-gray-600 bg-[#0b162c]'
              }`}
            >
              <div className={`w-12 h-12 rounded-full mb-3 border ${tema.border} ${tema.color} shadow-inner`}></div>
              <span className={`text-sm font-medium ${activeTheme === tema.id ? 'text-[#38b275]' : 'text-gray-400'}`}>
                {tema.nome}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-[#38b275] hover:bg-[#2c8c5c] text-white px-6 py-2.5 rounded-md font-medium transition-colors">
            Aplicar Tema
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sobre Nós */}
        <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Sobre o Sistema</h2>
          </div>
          <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
            <p><strong>Sistema de Gestão Documental</strong></p>
            <p>Desenvolvido para o Governo Provincial do Cunene, com o objetivo de modernizar, rastrear e organizar o fluxo de documentos entre os gabinetes e organismos.</p>
            <p>Versão: 1.0.0</p>
            <p>Licença: Uso Exclusivo - Governo Provincial do Cunene</p>
          </div>
        </div>

        {/* Contactos */}
        <div className="bg-[#111e3a] p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Phone size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Suporte Técnico</h2>
          </div>
          <div className="text-sm text-gray-400 space-y-4">
            <p>Em caso de dúvidas, falhas no sistema ou necessidade de novos acessos, contacte a equipe de TI:</p>
            <div className="bg-[#0b162c] p-4 rounded-lg border border-gray-800">
              <p className="text-white font-medium mb-1">ENG.º DE FLORES HAWALA [Ndafaohamba]</p>
              <p className="text-gray-500 text-xs mb-2">Diretor de Tecnologia e Inovação</p>
              <p className="flex items-center gap-2"><span className="text-[#38b275]">✉</span> suporte.ti@cunene.gov.ao</p>
              <p className="flex items-center gap-2 mt-1"><span className="text-[#38b275]">☏</span> +244 900 000 000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
