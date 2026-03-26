// src/components/admin/monitoreo/auditoria/AuditoriaFilters.tsx
"use client";

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface AuditoriaFiltersProps {
  filters: {
    usuario: string;
    tabla: string;
    accion: string;
    fechaInicio: string;
    fechaFin: string;
  };
  onFiltersChange: (filters: any) => void;
}

// Acciones permitidas (sin DELETE)
const acciones = ['INSERT', 'UPDATE'];

// Tablas según el trigger (nombres completos schema.tabla)
const tablas = [
  { value: 'clinica.medicos', label: 'Médicos' },
  { value: 'clinica.nosotros', label: 'Nosotros' },
  { value: 'clinica.servicios', label: 'Servicios' },
  { value: 'seguridad.usuarios', label: 'Usuarios' },
  { value: 'academia.cursos', label: 'Cursos' },
];

export function AuditoriaFilters({ filters, onFiltersChange }: AuditoriaFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      usuario: '',
      tabla: '',
      accion: '',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      {/* Fila de búsqueda rápida */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario..."
            value={filters.usuario}
            onChange={(e) => handleChange('usuario', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-medium ${
            showFilters || hasActiveFilters
              ? 'border-[#FFC300] bg-[#FFF9E6] text-[#0A3D62] shadow-sm'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 bg-[#FFC300] text-[#0A3D62] rounded-full text-xs font-bold flex items-center justify-center">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2.5 text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            <X size={16} />
            <span className="text-sm">Limpiar</span>
          </button>
        )}
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0A3D62] mb-2">Tabla</label>
              <select
                value={filters.tabla}
                onChange={(e) => handleChange('tabla', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 font-medium bg-white cursor-pointer"
              >
                <option value="">Todas las tablas</option>
                {tablas.map(tabla => (
                  <option key={tabla.value} value={tabla.value}>{tabla.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#0A3D62] mb-2">Acción</label>
              <select
                value={filters.accion}
                onChange={(e) => handleChange('accion', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 font-medium bg-white cursor-pointer"
              >
                <option value="">Todas las acciones</option>
                {acciones.map(accion => (
                  <option key={accion} value={accion}>{accion}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-2">Fecha inicio</label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => handleChange('fechaInicio', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-2">Fecha fin</label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => handleChange('fechaFin', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}