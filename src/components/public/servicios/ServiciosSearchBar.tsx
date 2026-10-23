"use client";

import { Mic, MicOff, Search } from "lucide-react";
import { useId } from "react";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

interface ServiciosSearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function ServiciosSearchBar({ busqueda, setBusqueda }: ServiciosSearchBarProps) {
  const statusId = useId();
  const { supported, listening, message, toggleListening } = useVoiceSearch(setBusqueda);
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <label htmlFor="busqueda-servicios" className="sr-only">Buscar servicios médicos</label>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0A3D62]" aria-hidden="true" />
          <input
            id="busqueda-servicios"
            type="search"
            placeholder="Buscar servicio"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            aria-describedby={statusId}
            className="w-full rounded-full border-2 border-[#E5E7EB] bg-white py-3.5 pl-12 pr-14 text-base text-gray-700 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-[#F59E0B] focus:outline-none focus:ring-4 focus:ring-[#F59E0B]/20"
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={supported !== true}
            aria-label={listening ? "Detener escucha" : "Buscar por voz"}
            aria-pressed={listening}
            aria-describedby={statusId}
            title={supported === false ? "La búsqueda por voz no está disponible en este navegador" : undefined}
            className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F59E0B] text-white shadow-md transition-colors hover:bg-[#D97706] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {listening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          </button>
        </div>
        <p id={statusId} role="status" aria-live="polite" className="mt-2 min-h-4 px-2 text-xs text-[#0A3D62]">
          {supported === false ? "La búsqueda por voz no está disponible en este navegador. Puedes escribir tu búsqueda." : message}
        </p>
      </div>
    </div>
  );
}
