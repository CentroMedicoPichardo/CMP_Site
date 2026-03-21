// src/components/admin/medicos/MedicosHeader.tsx
'use client';

import { Users, UserPlus } from 'lucide-react';

interface MedicosHeaderProps {
  totalMedicos: number;
  onCreateClick: () => void;
}

export function MedicosHeader({ totalMedicos, onCreateClick }: MedicosHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
        
        {/* Lado izquierdo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0A3D62] rounded-xl flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Gestión de Médicos</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Total de médicos:</span>
              <span className="text-lg font-bold text-[#FFC300]">{totalMedicos}</span>
            </div>
          </div>
        </div>

        {/* Botón en amarillo */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] px-5 py-2.5 rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Nuevo Médico</span>
        </button>
      </div>
    </div>
  );
}