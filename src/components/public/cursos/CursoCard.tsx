// src/components/public/cards/CursoCard.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar, Clock, MapPin, User, Users, 
  Monitor, DollarSign, ChevronRight 
} from 'lucide-react';
import { CursoDetalleModal } from './CursoDetalleModal';

interface CursoProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';
  estado: 'Activo' | 'Finalizado' | 'Próximamente';
  imagenSrc?: string;
  costo: number | 'Gratuito';
  ubicacion?: string;
  linkDetalle?: string;
}

export function CursoCard({
  id,
  titulo,
  descripcion,
  fechaInicio,
  fechaFin,
  inscripcionesAbiertas,
  cupoMaximo,
  cupoInscrito,
  instructor,
  horario,
  modalidad,
  dirigidoA,
  imagenSrc,
  costo,
  ubicacion,
}: CursoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const lugaresDisponibles = cupoMaximo - cupoInscrito;
  const porcentajeLlenado = (cupoInscrito / cupoMaximo) * 100;

  const handleVerMas = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${inscripcionesAbiertas ? 'border-green-100' : 'border-gray-100'}`}>
        
        {/* Header con imagen o gradiente */}
        <div className="relative h-40 bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] overflow-hidden">
          {imagenSrc ? (
            <Image 
              src={imagenSrc} 
              alt={titulo} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                <Monitor size={32} className="text-white/50" />
              </div>
            </div>
          )}
          
          {/* Badge de estado */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
            inscripcionesAbiertas 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {inscripcionesAbiertas ? 'Abierto' : 'Cerrado'}
          </div>

          {/* Badge de modalidad */}
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
            {modalidad === 'Online' ? <Monitor size={12} /> : <MapPin size={12} />}
            {modalidad}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Dirigido a */}
          <div className="inline-block px-3 py-1 bg-[#FFF9E6] rounded-full text-xs font-medium text-[#0A3D62] mb-3">
            {dirigidoA}
          </div>

          <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-2">
            {titulo}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {descripcion}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <User size={14} className="text-[#FFC300]" />
            <span className="font-medium">{instructor}</span>
          </div>

          {/* Fechas */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Calendar size={14} className="text-[#FFC300]" />
            <span>{fechaInicio} - {fechaFin}</span>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Clock size={14} className="text-[#FFC300]" />
            <span>{horario}</span>
          </div>

          {/* Barra de progreso de cupo */}
          {inscripcionesAbiertas && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Cupo disponible</span>
                <span className={`font-semibold ${lugaresDisponibles < 5 ? 'text-red-500' : 'text-green-500'}`}>
                  {lugaresDisponibles} lugares
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFC300] to-[#FFD700] transition-all duration-300"
                  style={{ width: `${100 - porcentajeLlenado}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-500">Costo</span>
              <p className="text-lg font-bold text-[#0A3D62]">
                {costo === 'Gratuito' ? 'Gratis' : `$${costo}`}
              </p>
            </div>
            
            <button
              onClick={handleVerMas}
              className="inline-flex items-center gap-1 px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 text-sm font-medium"
            >
              <span>Ver más</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      <CursoDetalleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        curso={{
          id,
          titulo,
          descripcion,
          fechaInicio,
          fechaFin,
          inscripcionesAbiertas,
          cupoMaximo,
          cupoInscrito,
          instructor,
          horario,
          modalidad,
          dirigidoA,
          imagenSrc,
          costo,
          ubicacion,
          lugaresDisponibles
        }}
      />
    </>
  );
}