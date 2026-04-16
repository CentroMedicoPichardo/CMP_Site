// src/components/admin/dashboard-admin/ActividadReciente.tsx
'use client';

import { Activity, UserPlus, BookOpen, CreditCard, Clock } from 'lucide-react';

export function ActividadReciente() {
  const actividades = [
    { id: 1, tipo: 'usuario', accion: 'Nuevo usuario registrado', usuario: 'María González', fecha: 'Hace 10 minutos' },
    { id: 2, tipo: 'inscripcion', accion: 'Nueva inscripción', usuario: 'Carlos López', fecha: 'Hace 1 hora' },
    { id: 3, tipo: 'curso', accion: 'Curso actualizado', usuario: 'Admin', fecha: 'Hace 3 horas' },
    { id: 4, tipo: 'pago', accion: 'Pago recibido', usuario: 'Ana Martínez', fecha: 'Hace 5 horas' },
    { id: 5, tipo: 'usuario', accion: 'Usuario actualizó perfil', usuario: 'Pedro Sánchez', fecha: 'Ayer' },
  ];

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'usuario':
        return <UserPlus size={16} className="text-blue-500" />;
      case 'curso':
        return <BookOpen size={16} className="text-green-500" />;
      case 'inscripcion':
        return <CreditCard size={16} className="text-purple-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-[#FFC300]" />
        <h3 className="text-lg font-semibold text-[#0A3D62]">Actividad Reciente</h3>
      </div>

      <div className="space-y-3">
        {actividades.map((act) => (
          <div key={act.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getIcon(act.tipo)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{act.accion}</p>
              <p className="text-xs text-gray-500">{act.usuario}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {act.fecha}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-center text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors border-t border-gray-100 pt-3">
        Ver todas las actividades
      </button>
    </div>
  );
}