// src/components/admin/backups/BackupTable.tsx
'use client';

import { Download, Trash2, Database, HardDrive, Calendar, Clock, Shield } from 'lucide-react';
import type { Backup } from '@/types/backups';

interface BackupTableProps {
  backups: Backup[];
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BackupTable({ backups, onDownload, onDelete }: BackupTableProps) {
  const getTipoIcon = (tipo: string) => {
    return tipo === 'completo' ? (
      <div className="flex items-center gap-1.5">
        <Database size={14} className="text-green-600" />
        <span className="text-xs font-medium text-green-600">Completo</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <HardDrive size={14} className="text-yellow-600" />
        <span className="text-xs font-medium text-yellow-600">Parcial</span>
      </div>
    );
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'exitoso' ? (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        Exitoso
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        Fallido
      </span>
    );
  };

  if (backups.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <Database size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No hay respaldos disponibles</p>
        <p className="text-gray-400 text-sm mt-2">Genera tu primer respaldo usando el panel lateral</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFC300]/20">
      <div className="px-6 py-4 bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A]">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Database size={18} />
          Historial de Respaldo
        </h2>
        <p className="text-white/70 text-sm mt-1">Lista de respaldos generados del sistema</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tamaño</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {backups.map((backup) => {
              const fecha = new Date(backup.fecha);
              const fechaFormateada = fecha.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              const horaFormateada = fecha.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <tr key={backup.id} className="hover:bg-[#FFF9E6] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500">#{backup.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#FFC300]" />
                      <span className="text-sm text-gray-700">{fechaFormateada}</span>
                      <Clock size={14} className="text-gray-400 ml-2" />
                      <span className="text-xs text-gray-500">{horaFormateada}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTipoIcon(backup.tipo)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <HardDrive size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{backup.tamaño}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getEstadoBadge(backup.estado)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onDownload(backup.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Descargar respaldo"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(backup.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar respaldo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Total: <span className="font-semibold text-[#0A3D62]">{backups.length}</span> respaldos
        </p>
      </div>
    </div>
  );
}