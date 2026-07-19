// src/components/admin/backups/BackupTable.tsx
"use client";

import {
  Download,
  Trash2,
  Database,
  HardDrive,
  Calendar,
  Clock,
} from "lucide-react";

import type { Backup } from "@/types/backups";

interface BackupTableProps {
  backups: Backup[];
  onDownload: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function BackupTable({
  backups,
  onDownload,
  onDelete,
}: BackupTableProps) {
  const getTipoIcon = (tipo: Backup["tipo"]) => {
    return tipo === "completo" ? (
      <div className="flex items-center gap-1.5">
        <Database size={14} className="text-green-600" />

        <span className="text-xs font-medium text-green-600">
          Completo
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <HardDrive size={14} className="text-yellow-600" />

        <span className="text-xs font-medium text-yellow-600">
          Parcial
        </span>
      </div>
    );
  };

  const getEstadoBadge = (estado: Backup["estado"]) => {
    if (estado === "exitoso" || estado === "completado") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Exitoso
        </span>
      );
    }

    if (estado === "procesando") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
          Procesando
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Fallido
      </span>
    );
  };

  if (backups.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-lg">
        <Database
          size={48}
          className="mx-auto mb-4 text-gray-300"
        />

        <p className="text-lg text-gray-500">
          No hay respaldos disponibles
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Genera tu primer respaldo usando el panel lateral
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#FFC300]/20 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Database size={18} />
          Historial de Respaldo
        </h2>

        <p className="mt-1 text-sm text-white/70">
          Lista de respaldos generados del sistema
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Fecha y Hora
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tipo
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tamaño
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Estado
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {backups.map((backup) => {
              const fecha = new Date(backup.fecha);

              const fechaValida = !Number.isNaN(fecha.getTime());

              const fechaFormateada = fechaValida
                ? fecha.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Fecha inválida";

              const horaFormateada = fechaValida
                ? fecha.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "--:--:--";

              return (
                <tr
                  key={backup.id}
                  className="transition-colors hover:bg-[#FFF9E6]"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500">
                      #{backup.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar
                        size={14}
                        className="text-[#FFC300]"
                      />

                      <span className="text-sm text-gray-700">
                        {fechaFormateada}
                      </span>

                      <Clock
                        size={14}
                        className="ml-2 text-gray-400"
                      />

                      <span className="text-xs text-gray-500">
                        {horaFormateada}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {getTipoIcon(backup.tipo)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <HardDrive
                        size={14}
                        className="text-gray-400"
                      />

                      <span className="text-sm text-gray-600">
                        {backup.tamaño}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      {getEstadoBadge(backup.estado)}

                      {!backup.disponible && (
                        <span className="text-xs text-amber-600">
                          Archivo no disponible
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void onDownload(backup.id);
                        }}
                        disabled={!backup.disponible}
                        className={[
                          "rounded-lg p-2 transition-colors",
                          backup.disponible
                            ? "text-blue-600 hover:bg-blue-50"
                            : "cursor-not-allowed text-gray-300 opacity-50",
                        ].join(" ")}
                        title={
                          backup.disponible
                            ? "Descargar respaldo"
                            : "El archivo de este respaldo no está disponible"
                        }
                        aria-label={
                          backup.disponible
                            ? `Descargar respaldo ${backup.id}`
                            : `Respaldo ${backup.id} no disponible`
                        }
                      >
                        <Download size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          void onDelete(backup.id);
                        }}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Eliminar respaldo"
                        aria-label={`Eliminar respaldo ${backup.id}`}
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

      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <p className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-[#0A3D62]">
            {backups.length}
          </span>{" "}
          respaldos
        </p>
      </div>
    </div>
  );
}