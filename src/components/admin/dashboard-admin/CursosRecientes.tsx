// src/components/admin/dashboard-admin/CursosRecientes.tsx
'use client';

import { BookOpen, Calendar, Users, Eye } from 'lucide-react';
import Link from 'next/link';

interface Curso {
  idCurso: number;
  tituloCurso: string;
  cuposOcupados: number;
  cupoMaximo: number;
  fechaInicio: string;
  activo: boolean;
}

interface CursosRecientesProps {
  cursos: Curso[];
}

export function CursosRecientes({ cursos }: CursosRecientesProps) {
  if (!cursos || cursos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0A3D62] flex items-center gap-2">
            <BookOpen size={20} className="text-[#FFC300]" />
            Cursos Recientes
          </h3>
          <Link
            href="/admin/cursos-admin"
            className="text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <p className="text-gray-500 text-center py-8">No hay cursos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0A3D62] flex items-center gap-2">
          <BookOpen size={20} className="text-[#FFC300]" />
          Cursos Recientes
        </h3>
        <Link
          href="/admin/cursos-admin"
          className="text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          Ver todos
        </Link>
      </div>

      <div className="space-y-3">
        {cursos.slice(0, 5).map((curso) => (
          <div key={curso.idCurso} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800">{curso.tituloCurso}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  curso.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {curso.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {curso.fechaInicio || 'Fecha por definir'}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {curso.cuposOcupados || 0}/{curso.cupoMaximo || 0}
                </span>
              </div>
            </div>
            <Link
              href={`/admin/cursos-admin/${curso.idCurso}/dashboard`}
              className="p-2 text-gray-400 hover:text-[#FFC300] transition-colors"
            >
              <Eye size={18} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}