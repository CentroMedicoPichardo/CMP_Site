// src/components/admin/usuarios/UsuariosSearchBar.tsx
'use client';

import { Search, Filter } from 'lucide-react';
import type { Rol } from '@/types/usuarios';

interface UsuariosSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActivo: boolean | 'todos';
  onFilterChange: (value: boolean | 'todos') => void;
  filterRol: number | 'todos';
  onFilterRolChange: (value: number | 'todos') => void;
  roles: Rol[];
}

export function UsuariosSearchBar({ 
  searchTerm, 
  onSearchChange, 
  filterActivo, 
  onFilterChange,
  filterRol,
  onFilterRolChange,
  roles
}: UsuariosSearchBarProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Fila superior: Buscador + Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-base shadow-md"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-3 rounded-xl border border-[#FFC300]/30 min-w-[150px]">
          <Filter size={18} className="text-[#0A3D62]" />
          <select
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 font-medium cursor-pointer"
            value={filterActivo as string}
            onChange={(e) => onFilterChange(e.target.value === 'todos' ? 'todos' : e.target.value === 'true')}
          >
            <option value="todos">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Filtro por rol */}
        <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-3 rounded-xl border border-[#FFC300]/30 min-w-[180px]">
          <Filter size={18} className="text-[#0A3D62]" />
          <select
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 font-medium cursor-pointer"
            value={filterRol === 'todos' ? 'todos' : filterRol}
            onChange={(e) => onFilterRolChange(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
          >
            <option value="todos">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchTerm && (
        <div className="text-sm text-gray-500 bg-[#FFF9E6] px-4 py-2 rounded-lg border border-[#FFC300]/30">
          Mostrando resultados para: <span className="font-semibold text-[#0A3D62]">"{searchTerm}"</span>
        </div>
      )}
    </div>
  );
}