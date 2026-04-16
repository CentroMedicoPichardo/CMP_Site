// src/components/admin/dashboard-admin/InscripcionesRecientes.tsx
'use client';

import { Ticket, Calendar, User, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface Inscripcion {
  id: number;
  curso: string;
  usuario: string;
  fecha: string;
  estado: string;
}

interface InscripcionesRecientesProps {
  inscripciones: Inscripcion[];
}

export function InscripcionesRecientes({ inscripciones }: InscripcionesRecientesProps) {
  if (!inscripciones || inscripciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ticket size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-semibold text-[#0A3D62]">Inscripciones Recientes</h3>
        </div>
        <p className="text-gray-500 text-center py-8">No hay inscripciones recientes</p>
      </div>
    );
  }

  const formatFecha = (fecha: string) => {
    if (!fecha) return '-';
    return fecha.split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Ticket size={20} className="text-[#FFC300]" />
        <h3 className="text-lg font-semibold text-[#0A3D62]">Inscripciones Recientes</h3>
      </div>

      <div className="space-y-3">
        {inscripciones.slice(0, 5).map((inscripcion) => (
          <div key={inscripcion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-[#FFC300]" />
                <span className="font-medium text-gray-800">{inscripcion.curso}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {inscripcion.usuario}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatFecha(inscripcion.fecha)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                inscripcion.estado === 'activo' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {inscripcion.estado === 'activo' ? (
                  <CheckCircle size={10} />
                ) : (
                  <Clock size={10} />
                )}
                {inscripcion.estado === 'activo' ? 'Activa' : 'Pendiente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}