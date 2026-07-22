"use client";

import {
  DatabaseBackup,
  HardDriveDownload,
  ShieldCheck,
} from "lucide-react";

export function BackupsHeader() {
  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-1 w-full bg-[#FFC300]" />

      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <DatabaseBackup
              size={23}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
              Administración
            </p>

            <h1 className="mt-1 text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
              Respaldos de base de datos
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Genera, consulta y descarga copias de
              seguridad para proteger la información
              almacenada en el sistema.
            </p>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[360px]">
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
              <ShieldCheck
                size={17}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-blue-900">
                Acceso protegido
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-blue-700">
                Disponible para administradores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm">
              <HardDriveDownload
                size={17}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-amber-900">
                Copias descargables
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
                Respaldos completos o parciales
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}