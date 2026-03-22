// src/components/admin/cursos/CursosGrid.tsx
'use client';
// Necesitamos importar GraduationCap
import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Loader2, Edit2, Eye, EyeOff, Calendar, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import type { Curso } from '@/types/cursos';

interface CursosGridProps {
  cursos: Curso[];
  loading: boolean;
  onEdit: (curso: Curso) => void;
  onToggleActivo: (curso: Curso) => void;
}

export function CursosGrid({ cursos, loading, onEdit, onToggleActivo }: CursosGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (cursos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No se encontraron cursos</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursos.map((curso) => {
        const uniqueKey = curso.idCurso || `curso-${Math.random()}`;
        const lugaresDisponibles = (curso.cupoMaximo || 0) - (curso.cuposOcupados || 0);
        
        return (
          <div
            key={uniqueKey}
            className={`
              group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
              ${!curso.activo ? 'opacity-60 hover:opacity-100' : ''}
            `}
          >
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden">
              {!imageErrors[curso.idCurso] && curso.imagenSrc ? (
                <Image
                  src={curso.imagenSrc}
                  alt={curso.tituloCurso}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(curso.idCurso)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] flex items-center justify-center">
                  <GraduationCap size={48} className="text-white/50" />
                </div>
              )}
              
              {/* Badge de estado */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                curso.activo 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {curso.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-1">
                {curso.tituloCurso}
              </h3>
              
              {/* Instructor */}
              {curso.instructorNombre && (
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Instructor:</span> {curso.instructorNombre}
                </p>
              )}
              
              {/* Fechas */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <Calendar size={14} className="text-[#FFC300]" />
                <span>{curso.fechaInicio || 'Fecha por definir'} - {curso.fechaFin || ''}</span>
              </div>

              {/* Horario y modalidad */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                <Clock size={14} className="text-[#FFC300]" />
                <span>{curso.horario || 'Horario por definir'} • {curso.modalidad || 'Presencial'}</span>
              </div>

              {/* Cupos */}
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <Users size={14} className="text-[#FFC300]" />
                <span>
                  Cupo: {curso.cuposOcupados || 0}/{curso.cupoMaximo || 0}
                  {lugaresDisponibles < 5 && lugaresDisponibles > 0 && (
                    <span className="ml-1 text-orange-500">(¡Últimos lugares!)</span>
                  )}
                </span>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(curso)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 text-sm"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => onToggleActivo(curso)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    curso.activo
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={curso.activo ? 'Ocultar curso' : 'Mostrar curso'}
                >
                  {curso.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

