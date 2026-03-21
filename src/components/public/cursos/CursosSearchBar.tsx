// src/components/public/cursos/CursosSearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import React from 'react';

interface CursosSearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function CursosSearchBar({ busqueda, setBusqueda }: CursosSearchBarProps) {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar curso, taller o instructor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-5 pr-12 py-3.5 bg-white/95 backdrop-blur-sm border-2 border-[#FFC300]/30 rounded-full focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base shadow-xl"
        />
        <button
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#FFC300] to-[#FFD700] rounded-full flex items-center justify-center hover:from-[#0A3D62] hover:to-[#1A4F7A] transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg"
          type="button"
        >
          <Search size={18} className="text-[#0A3D62] group-hover:text-white group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}