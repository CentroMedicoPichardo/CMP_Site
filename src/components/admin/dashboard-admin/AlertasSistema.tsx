// src/components/admin/dashboard-admin/AlertasSistema.tsx
'use client';

import { AlertTriangle, Bell, Info, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export function AlertasSistema() {
  const alertas = [
    {
      id: 1,
      tipo: 'warning',
      mensaje: 'Curso con baja ocupación',
      fecha: 'Hace 2 horas',
      link: '/admin/cursos-admin'
    },
    {
      id: 2,
      tipo: 'info',
      mensaje: 'Nuevos usuarios registrados',
      fecha: 'Hace 5 horas',
      link: '/admin/usuarios'
    },
    {
      id: 3,
      tipo: 'success',
      mensaje: 'Curso alcanzó buena ocupación',
      fecha: 'Ayer',
      link: '/admin/cursos-admin'
    }
  ];

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={18} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={20} className="text-[#FFC300]" />
        <h3 className="text-lg font-semibold text-[#0A3D62]">Alertas del Sistema</h3>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta) => (
          <Link
            key={alerta.id}
            href={alerta.link}
            className={`block p-3 rounded-lg border ${getBgColor(alerta.tipo)} hover:opacity-80 transition-opacity`}
          >
            <div className="flex items-start gap-3">
              {getIcon(alerta.tipo)}
              <div className="flex-1">
                <p className="text-sm text-gray-800">{alerta.mensaje}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Calendar size={10} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{alerta.fecha}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}