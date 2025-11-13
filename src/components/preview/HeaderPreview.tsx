'use client';

import { Menu, Languages } from 'lucide-react';

export function HeaderPreview() {
  return (
    <div className="h-16 p-3 flex justify-between items-center bg-white border-b border-gray-200">
      {/* Esquerda: Ícone Menu */}
      <div className="flex items-center justify-center w-10 h-10">
        <Menu className="h-6 w-6 text-gray-600" />
      </div>
      
      {/* Centro: Logo placeholder */}
      <div className="w-[200px] h-[50px] bg-gray-200 flex items-center justify-center rounded border border-gray-300">
        <span className="text-xs text-gray-500 font-medium">LOGO 200x50px</span>
      </div>
      
      {/* Direita: Ícone Idioma */}
      <div className="flex items-center justify-center w-10 h-10">
        <Languages className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}
