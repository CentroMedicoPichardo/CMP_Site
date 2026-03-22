// src/components/admin/quienes-somos/QuienesSomosHeader.tsx
'use client';

import { Info, Sparkles } from 'lucide-react';

export function QuienesSomosHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
        
        {/* Lado izquierdo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0A3D62] rounded-xl flex items-center justify-center">
            <Info size={24} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Quiénes Somos</h1>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles size={14} className="text-[#FFC300]" />
              <span className="text-sm text-gray-500">Edita la información institucional</span>
            </div>
          </div>
        </div>

        {/* Indicador de vista previa */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF9E6] rounded-xl border border-[#FFC300]/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Vista previa en vivo</span>
        </div>
      </div>
    </div>
  );
}