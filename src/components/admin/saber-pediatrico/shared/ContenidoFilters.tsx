// src/components/admin/saber-pediatrico/shared/ContenidoFilters.tsx
"use client";

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ContenidoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActivo: boolean | 'todos';
  onFilterChange: (value: boolean | 'todos') => void;
  onRefresh?: () => void;
}

export function ContenidoFilters({ 
  searchTerm, 
  onSearchChange, 
  filterActivo, 
  onFilterChange,
  onRefresh
}: ContenidoFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = searchTerm !== '' || filterActivo !== 'todos';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
            showFilters || hasActiveFilters
              ? 'border-[#FFC300] bg-[#FFF9E6] text-[#0A3D62]'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          <Filter size={18} />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 bg-[#FFC300] text-[#0A3D62] rounded-full text-xs font-bold flex items-center justify-center">
              {Object.values({ searchTerm, filterActivo }).filter(v => v !== '' && v !== 'todos').length}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('todos');
            }}
            className="flex items-center gap-1 px-3 py-2.5 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={16} />
            <span className="text-sm">Limpiar</span>
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-2 rounded-xl border border-[#FFC300]/30">
              <Filter size={18} className="text-[#0A3D62]" />
              <select
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 font-medium cursor-pointer"
                value={filterActivo as string}
                onChange={(e) => onFilterChange(e.target.value === 'todos' ? 'todos' : e.target.value === 'true')}
              >
                <option value="todos">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}