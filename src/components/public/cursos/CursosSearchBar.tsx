"use client";

import { Search, X } from "lucide-react";

interface CursosSearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function CursosSearchBar({
  busqueda,
  setBusqueda,
}: CursosSearchBarProps) {
  const tieneBusqueda = busqueda.trim().length > 0;

  return (
    <div className="relative w-full">
      <label
        htmlFor="busqueda-cursos"
        className="sr-only"
      >
        Buscar cursos, talleres o instructores
      </label>

      <Search
        size={17}
        strokeWidth={1.9}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
        aria-hidden="true"
      />

      <input
        id="busqueda-cursos"
        type="search"
        value={busqueda}
        onChange={(event) =>
          setBusqueda(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setBusqueda("");
          }
        }}
        placeholder="Buscar curso, taller o instructor..."
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-gray-200 bg-[#F8FAFC] py-2 pl-10 pr-11 text-sm font-medium text-gray-800 outline-none transition-all placeholder:font-normal placeholder:text-gray-400 hover:border-[#0A3D62]/30 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10"
      />

      {tieneBusqueda && (
        <button
          type="button"
          onClick={() => setBusqueda("")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          aria-label="Limpiar búsqueda"
        >
          <X
            size={15}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}