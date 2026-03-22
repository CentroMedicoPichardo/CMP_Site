// src/components/admin/usuarios/UsuariosHeader.tsx
'use client';

import { Users } from 'lucide-react';

interface UsuariosHeaderProps {
  totalUsuarios: number;
}

export function UsuariosHeader({ totalUsuarios }: UsuariosHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0A3D62] rounded-xl flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Gestión de Usuarios</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Total de usuarios registrados:</span>
              <span className="text-lg font-bold text-[#FFC300]">{totalUsuarios}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF9E6] rounded-xl border border-[#FFC300]/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Solo lectura / Cambio de roles</span>
        </div>
      </div>
    </div>
  );
}