"use client";

import { useState } from "react";

import {
  ChevronDown,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

interface CursosSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActivo: boolean | "todos";
  onFilterChange: (
    value: boolean | "todos",
  ) => void;
  onRefresh?: () => void | Promise<void>;
}

type ValorFiltro =
  | "todos"
  | "true"
  | "false";

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

export function CursosSearchBar({
  searchTerm,
  onSearchChange,
  filterActivo,
  onFilterChange,
  onRefresh,
}: CursosSearchBarProps) {
  const [refreshing, setRefreshing] =
    useState(false);

  const valorFiltro: ValorFiltro =
    filterActivo === "todos"
      ? "todos"
      : filterActivo
        ? "true"
        : "false";

  const hayBusqueda =
    searchTerm.trim().length > 0;

  const hayFiltroEstado =
    filterActivo !== "todos";

  const filtroEstadoTexto =
    filterActivo === "todos"
      ? ""
      : filterActivo
        ? "Solo activos"
        : "Solo inactivos";

  const cambiarFiltroEstado = (
    valor: ValorFiltro,
  ) => {
    if (valor === "todos") {
      onFilterChange("todos");
      return;
    }

    onFilterChange(valor === "true");
  };

  const limpiarBusqueda = () => {
    onSearchChange("");
  };

  const limpiarFiltroEstado = () => {
    onFilterChange("todos");
  };

  const limpiarTodo = () => {
    onSearchChange("");
    onFilterChange("todos");
  };

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      await Promise.resolve(
        onRefresh?.(),
      );
    } catch (error: unknown) {
      console.error(
        "Error al actualizar cursos:",
        error,
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="my-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-extrabold text-[#0A3D62]">
            Buscar y filtrar cursos
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Localiza cursos por título,
            descripción, instructor o modalidad.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_240px_auto] lg:items-end">
          <div className="min-w-0">
            <label
              htmlFor="buscar-cursos"
              className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
            >
              Búsqueda
            </label>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />

              <input
                id="buscar-cursos"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  onSearchChange(
                    event.target.value,
                  );
                }}
                placeholder="Título, descripción, instructor o modalidad"
                className="min-h-11 w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pl-10 pr-11 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#FFC300] focus:bg-white focus:ring-4 focus:ring-[#FFC300]/15"
              />

              {hayBusqueda && (
                <button
                  type="button"
                  onClick={limpiarBusqueda}
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                >
                  <X
                    size={15}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="filtro-estado-cursos"
              className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
            >
              Estado
            </label>

            <div className="relative">
              <Filter
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                aria-hidden="true"
              />

              <select
                id="filtro-estado-cursos"
                value={valorFiltro}
                onChange={(event) => {
                  cambiarFiltroEstado(
                    event.target
                      .value as ValorFiltro,
                  );
                }}
                className={cn(
                  "min-h-11 w-full cursor-pointer appearance-none rounded-xl border bg-white pl-10 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15",
                  hayFiltroEstado
                    ? "border-[#FFC300] bg-[#FFF9E6]"
                    : "border-gray-200",
                )}
              >
                <option value="todos">
                  Todos los cursos
                </option>

                <option value="true">
                  Solo activos
                </option>

                <option value="false">
                  Solo inactivos
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={refreshing}
            aria-busy={refreshing}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none lg:w-auto"
          >
            <RefreshCw
              size={16}
              className={cn(
                refreshing &&
                  "animate-spin",
              )}
              aria-hidden="true"
            />

            {refreshing
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>

        {(hayBusqueda ||
          hayFiltroEstado) && (
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Filtros aplicados
              </span>

              {hayBusqueda && (
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0A3D62]/15 bg-[#F2F7FA] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
                  <Search
                    size={12}
                    className="shrink-0"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 break-words">
                    “{searchTerm.trim()}”
                  </span>

                  <button
                    type="button"
                    onClick={limpiarBusqueda}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#0A3D62] hover:text-white"
                    aria-label="Eliminar filtro de búsqueda"
                  >
                    <X
                      size={11}
                      aria-hidden="true"
                    />
                  </button>
                </span>
              )}

              {hayFiltroEstado && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
                  <Filter
                    size={12}
                    aria-hidden="true"
                  />

                  {filtroEstadoTexto}

                  <button
                    type="button"
                    onClick={
                      limpiarFiltroEstado
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-[#0A3D62] hover:text-white"
                    aria-label="Eliminar filtro de estado"
                  >
                    <X
                      size={11}
                      aria-hidden="true"
                    />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={limpiarTodo}
              className="self-start text-xs font-extrabold text-red-600 transition-colors hover:text-red-700 sm:self-auto"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}