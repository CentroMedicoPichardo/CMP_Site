// src/components/public/filtros/FiltroCursos.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";

export function FiltroCursos() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Función genérica para actualizar cualquier select al instante
  const actualizarFiltro = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/cursos?${params.toString()}`);
  };

  // Limpia todos los filtros de la URL
  const limpiarFiltros = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modalidadId");
    params.delete("dirigidoA");
    router.push(`/cursos?${params.toString()}`);
  };

  // Verificamos si hay algún filtro activo
  const hasActiveFilters = searchParams.get("modalidadId") || searchParams.get("dirigidoA");

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-5 items-center mb-8">
      
      {/* Etiqueta Visual */}
      <div className="flex items-center gap-2 text-gray-700 font-semibold w-full md:w-auto">
        <SlidersHorizontal size={20} className="text-[#0A3D62]" />
        <span>Filtros:</span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full flex-1 md:justify-start items-center">
        
        {/* 1. Selector de Modalidad */}
        <div className="w-full md:w-64">
          <select 
            value={searchParams.get("modalidadId") || ""}
            onChange={(e) => actualizarFiltro("modalidadId", e.target.value)}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A3D62] outline-none cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
          >
            <option value="">Cualquier modalidad</option>
            <option value="1">Presencial</option>
            <option value="2">Online</option>
            <option value="3">Híbrido</option>
          </select>
        </div>

        {/* 2. Selector Dirigido A */}
        <div className="w-full md:w-64">
          <select 
            value={searchParams.get("dirigidoA") || ""}
            onChange={(e) => actualizarFiltro("dirigidoA", e.target.value)}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A3D62] outline-none cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
          >
            <option value="">Cualquier público</option>
            <option value="Padres">Padres</option>
            <option value="Niños">Niños</option>
            <option value="Familia">Familia</option>
            <option value="Adolescentes">Adolescentes</option>
          </select>
        </div>

        {/* 3. Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <div className="w-full md:w-auto ml-auto">
            <button 
              onClick={limpiarFiltros}
              className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-semibold border border-red-100"
            >
              <X size={16} />
              Limpiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}