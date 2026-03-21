// src/components/admin/servicios/ServiciosGrid.tsx
'use client';

import { useState } from 'react';
import { Loader2, Edit2, Eye, EyeOff, MapPin } from 'lucide-react';
import Image from 'next/image';
import type { Servicio } from '@/types/servicios';

interface ServiciosGridProps {
  servicios: Servicio[];
  loading: boolean;
  onEdit: (servicio: Servicio) => void;
  onToggleActivo: (servicio: Servicio) => void;
}

export function ServiciosGrid({ servicios, loading, onEdit, onToggleActivo }: ServiciosGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center">
        <p className="text-gray-500 text-lg">No se encontraron servicios</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servicios.map((servicio) => {
        const uniqueKey = servicio.idServicio || `servicio-${Math.random()}`;
        
        return (
          <div
            key={uniqueKey}
            className={`
              group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
              ${!servicio.activo ? 'opacity-60 hover:opacity-100' : ''}
            `}
          >
            {/* Imagen del servicio */}
            <div className="relative h-48 overflow-hidden">
              {!imageErrors[servicio.idServicio] && servicio.imagenSrc ? (
                <Image
                  src={servicio.imagenSrc}
                  alt={servicio.textoAlt || servicio.tituloServicio}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(servicio.idServicio)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] flex items-center justify-center">
                  <span className="text-5xl text-white/50">🏥</span>
                </div>
              )}
              
              {/* Badge de estado */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                servicio.activo 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {servicio.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-1">
                {servicio.tituloServicio}
              </h3>
              
              {/* Descripción */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {servicio.descripcion || 'Sin descripción'}
                </p>
              </div>

              {/* Ubicación */}
              {servicio.ubicacion && (
                <div className="flex items-center gap-1 mb-4 text-xs text-gray-500">
                  <MapPin size={14} className="text-[#FFC300]" />
                  <span className="line-clamp-1">{servicio.ubicacion}</span>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(servicio)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 text-sm"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => onToggleActivo(servicio)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    servicio.activo
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={servicio.activo ? 'Desactivar' : 'Activar'}
                >
                  {servicio.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}