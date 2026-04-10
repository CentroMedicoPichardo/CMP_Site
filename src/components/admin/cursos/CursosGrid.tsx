// src/components/admin/cursos/CursosGrid.tsx
'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Loader2, Edit2, Eye, EyeOff, Calendar, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import type { Curso } from '@/types/cursos';
import { adminRoutes } from '@/config/routes';

interface CursosGridProps {
  cursos: Curso[];
  loading: boolean;
  onEdit: (curso: Curso) => void;
  onToggleActivo: (curso: Curso) => void;
}

export function CursosGrid({ cursos, loading, onEdit, onToggleActivo }: CursosGridProps) {
  const router = useRouter();
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

  const handleViewDashboard = (cursoId: number) => {
    router.push(adminRoutes.cursosDashboard(cursoId));
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = (curso: Curso) => {
    if (curso.urlImagenPortada) return curso.urlImagenPortada;
    if (curso.imagenSrc) return curso.imagenSrc;
    return null;
  };

  // Función para obtener el nombre de la modalidad
  const getModalidadNombre = (curso: Curso) => {
    return curso.modalidadNombre || 'Presencial';
  };

  // Función para obtener el nombre de la categoría
  const getCategoriaNombre = (curso: Curso) => {
    return curso.categoriaNombre || 'General';
  };

  // Función para obtener el nombre completo del instructor
  const getInstructorNombre = (curso: Curso) => {
    return curso.instructorNombre || 'Instructor no asignado';
  };

  // Función para formatear fecha
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'Fecha por definir';
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cursos.map((curso) => {
        const uniqueKey = curso.idCurso || `curso-${Math.random()}`;
        const cuposOcupados = typeof curso.cuposOcupados === 'number' 
          ? curso.cuposOcupados 
          : Number(curso.cuposOcupados) || 0;
        const cupoMaximo = typeof curso.cupoMaximo === 'number' 
          ? curso.cupoMaximo 
          : Number(curso.cupoMaximo) || 0;
        const lugaresDisponibles = cupoMaximo - cuposOcupados;
        const imageUrl = getImageUrl(curso);
        
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
              {!imageErrors[curso.idCurso] && imageUrl ? (
                <Image
                  src={imageUrl}
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
              
              {/* Badge de categoría */}
              <div className="absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-semibold bg-[#FFC300] text-[#0A3D62]">
                {getCategoriaNombre(curso)}
              </div>

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
              
              {/* Descripción corta */}
              {curso.descripcion && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {curso.descripcion}
                </p>
              )}
              
              {/* Instructor */}
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Instructor:</span> {getInstructorNombre(curso)}
              </p>
              
              {/* Fechas */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <Calendar size={14} className="text-[#FFC300]" />
                <span>{formatFecha(curso.fechaInicio)} - {formatFecha(curso.fechaFin)}</span>
              </div>

              {/* Horario y modalidad */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                <Clock size={14} className="text-[#FFC300]" />
                <span>{curso.horario || 'Horario por definir'} • {getModalidadNombre(curso)}</span>
              </div>

              {/* Cupos */}
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <Users size={14} className="text-[#FFC300]" />
                <span>
                  Cupo: {cuposOcupados}/{cupoMaximo}
                  {lugaresDisponibles > 0 && lugaresDisponibles < 5 && (
                    <span className="ml-1 text-orange-500">(¡Últimos lugares!)</span>
                  )}
                  {lugaresDisponibles === 0 && (
                    <span className="ml-1 text-red-500">(Completo)</span>
                  )}
                </span>
              </div>

              {/* Costo */}
              {curso.costo && Number(curso.costo) > 0 && (
                <p className="text-sm font-semibold text-[#0A3D62] mb-3">
                  Costo: ${Number(curso.costo).toLocaleString('es-MX')} MXN
                </p>
              )}

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
                <button
                  onClick={() => handleViewDashboard(curso.idCurso)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm"
                  title="Ver dashboard"
                >
                  <TrendingUp size={16} />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}