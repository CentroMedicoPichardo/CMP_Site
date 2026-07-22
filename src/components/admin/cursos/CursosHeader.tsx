"use client";

import {
  BookOpenCheck,
  GraduationCap,
  Plus,
} from "lucide-react";

interface CursosHeaderProps {
  totalCursos: number;
  onCreateClick: () => void;
}

export function CursosHeader({
  totalCursos,
  onCreateClick,
}: CursosHeaderProps) {
  return (
    <header className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
            <GraduationCap
              size={23}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Formación académica
            </p>

            <h1 className="mt-1 whitespace-normal break-words text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
              Gestión de cursos
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Administra la oferta académica, los
              instructores, las fechas, los cupos y
              la disponibilidad de cada curso.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
              <BookOpenCheck
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Cursos registrados
              </p>

              <p className="mt-0.5 text-lg font-extrabold leading-none text-[#0A3D62]">
                {totalCursos.toLocaleString(
                  "es-MX",
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-3 text-sm font-extrabold text-[#0A3D62] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EAB308] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2"
          >
            <Plus
              size={18}
              className="shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />

            Registrar curso
          </button>
        </div>
      </div>
    </header>
  );
}