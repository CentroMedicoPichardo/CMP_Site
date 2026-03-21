// src/components/admin/medicos/MedicosGrid.tsx
'use client';

import { useState } from 'react';
import { Loader2, Edit2, Power, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import type { Medico } from '@/types/medicos';

interface MedicosGridProps {
  medicos: Medico[];
  loading: boolean;
  onEdit: (medico: Medico) => void;
  onToggleActivo: (medico: Medico) => void;
}

export function MedicosGrid({ medicos, loading, onEdit, onToggleActivo }: MedicosGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Función para construir nombre completo
  const getNombreCompleto = (medico: Medico): string => {
    return [medico.nombres, medico.apellidoPaterno, medico.apellidoMaterno]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Médico';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (medicos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <p className="text-gray-500 text-lg">No se encontraron médicos</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {medicos.map((medico) => {
        // Asegurar que la key sea única y no '0'
        const uniqueKey = medico.idMedico || `medico-${Math.random()}`;
        
        return (
          <div
            key={uniqueKey}
            className={`
              group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
              ${!medico.activo ? 'opacity-60 hover:opacity-100' : ''}
            `}
          >
            {/* Foto del médico */}
            <div className="relative h-48 overflow-hidden">
              {!imageErrors[medico.idMedico] && medico.imagenSrc ? (
                <Image
                  src={medico.imagenSrc}
                  alt={`Dr. ${getNombreCompleto(medico)}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(medico.idMedico)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] flex items-center justify-center">
                  <span className="text-5xl text-white/50">
                    {medico.nombres?.charAt(0) || '👤'}
                  </span>
                </div>
              )}
              
              {/* Badge de especialidad */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#FFC300] rounded-full text-xs font-bold text-[#0A3D62]">
                {medico.especialidad || 'General'}
              </div>

              {/* Badge de estado */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                medico.activo 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {medico.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-1">
                {getNombreCompleto(medico)}
              </h3>
              
              {/* Hospital */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Hospital</p>
                <p className="text-sm text-gray-700 line-clamp-1">
                  {medico.hospitalClinica || 'No especificado'}
                </p>
              </div>

              {/* Dirección */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Dirección</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {medico.direccion || 'No especificada'}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(medico)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 text-sm"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => onToggleActivo(medico)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    medico.activo
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={medico.activo ? 'Desactivar' : 'Activar'}
                >
                  {medico.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}