// src/components/admin/monitoreo/auditoria/AuditoriaTable.tsx
"use client";

import { Loader2, Eye, Database, User, Calendar, Tag, ArrowUpRight } from 'lucide-react';

interface AuditoriaRegistro {
  id: number;
  usuario: string;
  ip_address: string;
  accion: string;
  tabla_afectada: string;
  registro_id: number;
  datos_anteriores: any;
  datos_nuevos: any;
  fecha_hora: string;
}

interface AuditoriaTableProps {
  registros: AuditoriaRegistro[];
  loading: boolean;
  onViewDetails: (registro: AuditoriaRegistro) => void;
}

export function AuditoriaTable({ registros, loading, onViewDetails }: AuditoriaTableProps) {
  const getAccionBadge = (accion: string) => {
    const styles: Record<string, string> = {
      INSERT: 'bg-green-100 text-green-700 border-green-200',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
      SELECT: 'bg-gray-100 text-gray-700 border-gray-200',
      LOGIN: 'bg-purple-100 text-purple-700 border-purple-200',
      LOGOUT: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return styles[accion] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (registros.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Database size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No se encontraron registros de auditoría</p>
        <p className="text-xs text-gray-400 mt-1">Intenta con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">Fecha/Hora</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Acción</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tabla</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">IP</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registros.map((registro) => {
              const fecha = new Date(registro.fecha_hora);
              const fechaFormateada = fecha.toLocaleDateString('es-MX');
              const horaFormateada = fecha.toLocaleTimeString('es-MX');
              
              return (
                <tr key={registro.id} className="hover:bg-[#FFF9E6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#FFC300]" />
                      <span className="text-sm text-gray-700">{fechaFormateada}</span>
                      <span className="text-xs text-gray-400">{horaFormateada}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#FFC300]" />
                      <span className="text-sm font-medium text-gray-800">{registro.usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getAccionBadge(registro.accion)}`}>
                      <ArrowUpRight size={10} />
                      {registro.accion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 font-mono">{registro.tabla_afectada}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{registro.ip_address}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewDetails(registro)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-[#0A3D62]">{registros.length}</span> registros
        </p>
      </div>
    </div>
  );
}