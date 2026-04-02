import React from 'react';

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-gray-400 max-w-md">
        Esta tela está em construção. A integração completa com o banco de dados será ativada após a confirmação da migração SQL.
      </p>
    </div>
  );
}
