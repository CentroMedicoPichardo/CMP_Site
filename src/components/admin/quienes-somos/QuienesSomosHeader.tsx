"use client";

import {
  Building2,
  Eye,
  Info,
  Sparkles,
} from "lucide-react";

export function QuienesSomosHeader() {
  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
            <Info
              size={23}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Identidad institucional
            </p>

            <h1 className="mt-1 whitespace-normal break-words text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
              Quiénes somos
            </h1>

            <div className="mt-2 flex max-w-2xl items-start gap-2">
              <Sparkles
                size={15}
                className="mt-1 shrink-0 text-[#B88600]"
                aria-hidden="true"
              />

              <p className="whitespace-normal break-words text-sm leading-6 text-gray-500">
                Administra la historia, identidad y datos institucionales
                que se muestran a pacientes, padres y cuidadores.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
              <Building2
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Sección administrativa
              </p>

              <p className="mt-0.5 whitespace-normal break-words text-sm font-extrabold text-[#0A3D62]">
                Información pública
              </p>
            </div>
          </div>

          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
              <Eye
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Vista pública
              </p>

              <p className="mt-0.5 whitespace-normal break-words text-sm font-extrabold text-emerald-800">
                Contenido visible
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}