// src/components/admin/monitoreo/auditoria/AuditoriaDetailsModal.tsx
"use client";

import { X, Database, User, Calendar, MapPin, Tag, ArrowUpRight } from 'lucide-react';

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

interface AuditoriaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registro: AuditoriaRegistro | null;
}

export function AuditoriaDetailsModal({ isOpen, onClose, registro }: AuditoriaDetailsModalProps) {
  if (!isOpen || !registro) return null;

  const fecha = new Date(registro.fecha_hora);
  const fechaFormateada = fecha.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formatJSON = (data: any) => {
    if (!data) return 'Sin datos';
    return JSON.stringify(data, null, 2);
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'INSERT': return 'text-green-600 bg-green-50 border-green-200';
      case 'UPDATE': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'DELETE': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A3D62] rounded-xl flex items-center justify-center">
                <Database size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A3D62]">Detalles de Auditoría</h2>
                <p className="text-sm text-gray-500">ID: #{registro.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors"
            >
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-500">Usuario</p>
                  <p className="font-medium text-gray-800">{registro.usuario}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-500">Dirección IP</p>
                  <code className="text-sm text-gray-800">{registro.ip_address}</code>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Tag size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-500">Tabla afectada</p>
                  <p className="font-medium text-gray-800 font-mono">{registro.tabla_afectada}</p>
                  <p className="text-xs text-gray-400">Registro ID: {registro.registro_id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-500">Fecha y hora</p>
                  <p className="font-medium text-gray-800">{fechaFormateada}</p>
                </div>
              </div>
            </div>

            {/* Acción */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Acción realizada</p>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getAccionColor(registro.accion)}`}>
                <ArrowUpRight size={16} />
                {registro.accion}
              </span>
            </div>

            {/* Cambios - JSON */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0A3D62] mb-2">Datos Anteriores</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono">
                  {formatJSON(registro.datos_anteriores)}
                </pre>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-[#0A3D62] mb-2">Datos Nuevos</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono">
                  {formatJSON(registro.datos_nuevos)}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}