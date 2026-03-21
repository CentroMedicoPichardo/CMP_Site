// src/components/admin/medicos/MedicosSearchBar.tsx
'use client';

import { Search, RefreshCw, Filter } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface MedicosSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActivo: boolean | 'todos';
  onFilterChange: (value: boolean | 'todos') => void;
  onRefresh?: () => void;
}

export function MedicosSearchBar({ 
  searchTerm, 
  onSearchChange, 
  filterActivo, 
  onFilterChange,
  onRefresh
}: MedicosSearchBarProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await mutate('/api/medicos?admin=true', undefined, { revalidate: true });
      if (onRefresh) onRefresh();
      setTimeout(() => setRefreshing(false), 500);
    } catch (error) {
      console.error('Error al refrescar:', error);
      setRefreshing(false);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Fila superior: Buscador + Filtro + Botón refresh */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Buscador - ocupa más espacio */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o hospital..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-base shadow-md"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro */}
        <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-3 rounded-xl border border-[#FFC300]/30 min-w-[200px]">
          <Filter size={18} className="text-[#0A3D62]" />
          <select
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 font-medium cursor-pointer"
            value={filterActivo as string}
            onChange={(e) => onFilterChange(e.target.value === 'todos' ? 'todos' : e.target.value === 'true')}
          >
            <option value="todos">Todos los médicos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Botón de refresh - solo icono */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`
            flex items-center justify-center w-14 h-14
            bg-gradient-to-r from-[#FFC300] to-[#FFD700] 
            text-[#0A3D62] rounded-xl shadow-md
            hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white
            transition-all duration-300 group
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#FFC300] disabled:hover:to-[#FFD700] disabled:hover:text-[#0A3D62]
          `}
          title="Refrescar lista de médicos"
        >
          <RefreshCw 
            size={22} 
            className={`
              text-[#0A3D62] group-hover:text-white
              transition-all duration-300
              ${refreshing ? 'animate-spin' : ''}
            `} 
          />
        </button>
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