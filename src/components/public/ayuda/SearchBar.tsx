"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

export default function SearchBar({
  placeholder = "Buscar preguntas frecuentes...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");

  const ejecutarBusqueda = () => {
    onSearch(query.trim());
  };

  const limpiarBusqueda = () => {
    setQuery("");
    onSearch("");

    window.requestAnimationFrame(() => {
      document.getElementById(inputId)?.focus();
    });
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    ejecutarBusqueda();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape" && query) {
      event.preventDefault();
      limpiarBusqueda();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn("w-full", className)}
    >
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        Buscar preguntas frecuentes
      </label>

      <div className="group flex min-h-12 w-full items-center overflow-hidden rounded-xl border border-[#DCE6EE] bg-[#F7FAFC] transition-all duration-200 hover:border-[#0A3D62]/30 focus-within:border-[#0A3D62] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0A3D62]/10">
        <span className="flex h-full shrink-0 items-center justify-center pl-4 text-[#0A3D62]">
          <Search
            size={19}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>

        <input
          id={inputId}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
        />

        {query && (
          <button
            type="button"
            onClick={limpiarBusqueda}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda"
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <X
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        )}

        <button
          type="submit"
          aria-label="Buscar preguntas"
          className="m-1.5 flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FFC300] px-3.5 text-xs font-extrabold text-[#0A3D62] shadow-sm transition-all duration-200 hover:bg-[#0A3D62] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 sm:px-5"
        >
          <Search
            size={15}
            strokeWidth={2.2}
            aria-hidden="true"
          />

          <span className="hidden sm:inline">
            Buscar
          </span>
        </button>
      </div>
    </form>
  );
}