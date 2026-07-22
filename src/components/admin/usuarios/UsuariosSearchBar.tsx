"use client";

import {
  ChevronDown,
  Filter,
  Search,
  Shield,
  SlidersHorizontal,
  UserCheck,
  X,
} from "lucide-react";

import type { Rol } from "@/types/usuarios";

interface UsuariosSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterActivo: boolean | "todos";
  onFilterChange: (
    value: boolean | "todos",
  ) => void;
  filterRol: number | "todos";
  onFilterRolChange: (
    value: number | "todos",
  ) => void;
  roles: Rol[];
}

type ValorEstado =
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

function textoSeguro(
  valor: unknown,
): string {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

export function UsuariosSearchBar({
  searchTerm,
  onSearchChange,
  filterActivo,
  onFilterChange,
  filterRol,
  onFilterRolChange,
  roles,
}: UsuariosSearchBarProps) {
  const busquedaActiva =
    searchTerm.trim().length > 0;

  const estadoActivo =
    filterActivo !== "todos";

  const rolActivo =
    filterRol !== "todos";

  const hayFiltros =
    busquedaActiva ||
    estadoActivo ||
    rolActivo;

  const cantidadFiltros = [
    busquedaActiva,
    estadoActivo,
    rolActivo,
  ].filter(Boolean).length;

  const valorEstado: ValorEstado =
    filterActivo === "todos"
      ? "todos"
      : filterActivo
        ? "true"
        : "false";

  const rolSeleccionado =
    filterRol === "todos"
      ? null
      : roles.find(
          (rol) =>
            Number(rol.id) ===
            filterRol,
        ) ?? null;

  const nombreRolSeleccionado =
    rolSeleccionado
      ? textoSeguro(
          rolSeleccionado.nombre,
        ) || "Rol seleccionado"
      : "";

  const etiquetaEstado =
    filterActivo === "todos"
      ? ""
      : filterActivo
        ? "Solo activos"
        : "Solo inactivos";

  const cambiarEstado = (
    valor: ValorEstado,
  ) => {
    if (valor === "todos") {
      onFilterChange("todos");
      return;
    }

    onFilterChange(valor === "true");
  };

  const cambiarRol = (
    valor: string,
  ) => {
    if (valor === "todos") {
      onFilterRolChange("todos");
      return;
    }

    const rolId = Number(valor);

    if (Number.isFinite(rolId)) {
      onFilterRolChange(rolId);
    }
  };

  const limpiarBusqueda = () => {
    onSearchChange("");
  };

  const limpiarEstado = () => {
    onFilterChange("todos");
  };

  const limpiarRol = () => {
    onFilterRolChange("todos");
  };

  const limpiarTodo = () => {
    onSearchChange("");
    onFilterChange("todos");
    onFilterRolChange("todos");
  };

  return (
    <section className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <div className="p-4 sm:p-5">
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <SlidersHorizontal
                size={17}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Herramientas de consulta
              </p>

              <h2 className="mt-1 text-sm font-extrabold text-[#0A3D62]">
                Buscar y filtrar usuarios
              </h2>

              <p className="mt-1 whitespace-normal break-words text-xs leading-5 text-gray-500">
                Localiza cuentas por sus datos
                principales y limita los resultados
                por estado o rol.
              </p>
            </div>
          </div>

          {hayFiltros && (
            <span className="inline-flex self-start items-center gap-2 rounded-full border border-[#FFC300]/40 bg-[#FFF9E6] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62]">
              <Filter
                size={12}
                aria-hidden="true"
              />

              {cantidadFiltros}{" "}
              {cantidadFiltros === 1
                ? "filtro activo"
                : "filtros activos"}
            </span>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_220px_240px]">
          <div className="min-w-0">
            <label
              htmlFor="buscar-usuarios"
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
                id="buscar-usuarios"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  onSearchChange(
                    event.target.value,
                  );
                }}
                placeholder="Buscar por nombre, correo o teléfono..."
                className="min-h-11 w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pl-10 pr-11 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#FFC300] focus:bg-white focus:ring-4 focus:ring-[#FFC300]/15"
              />

              {busquedaActiva && (
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
              htmlFor="filtro-estado-usuarios"
              className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
            >
              Estado de la cuenta
            </label>

            <div className="relative">
              <UserCheck
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                aria-hidden="true"
              />

              <select
                id="filtro-estado-usuarios"
                value={valorEstado}
                onChange={(event) => {
                  cambiarEstado(
                    event.target
                      .value as ValorEstado,
                  );
                }}
                className={cn(
                  "min-h-11 w-full cursor-pointer appearance-none rounded-xl border pl-10 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15",
                  estadoActivo
                    ? "border-[#FFC300] bg-[#FFF9E6]"
                    : "border-gray-200 bg-white",
                )}
              >
                <option value="todos">
                  Todos los estados
                </option>

                <option value="true">
                  Usuarios activos
                </option>

                <option value="false">
                  Usuarios inactivos
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filtro-rol-usuarios"
              className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
            >
              Rol asignado
            </label>

            <div className="relative">
              <Shield
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                aria-hidden="true"
              />

              <select
                id="filtro-rol-usuarios"
                value={
                  filterRol === "todos"
                    ? "todos"
                    : String(filterRol)
                }
                onChange={(event) => {
                  cambiarRol(
                    event.target.value,
                  );
                }}
                className={cn(
                  "min-h-11 w-full cursor-pointer appearance-none rounded-xl border pl-10 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15",
                  rolActivo
                    ? "border-[#FFC300] bg-[#FFF9E6]"
                    : "border-gray-200 bg-white",
                )}
              >
                <option value="todos">
                  Todos los roles
                </option>

                {roles.map((rol) => (
                  <option
                    key={rol.id}
                    value={String(rol.id)}
                  >
                    {textoSeguro(
                      rol.nombre,
                    ) || "Rol sin nombre"}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {hayFiltros && (
          <footer className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Filtros aplicados
              </span>

              {busquedaActiva && (
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0A3D62]/15 bg-[#F2F7FA] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
                  <Search
                    size={12}
                    className="shrink-0"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 whitespace-normal break-words">
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

              {estadoActivo && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
                  <UserCheck
                    size={12}
                    aria-hidden="true"
                  />

                  {etiquetaEstado}

                  <button
                    type="button"
                    onClick={limpiarEstado}
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

              {rolActivo && (
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
                  <Shield
                    size={12}
                    className="shrink-0"
                    aria-hidden="true"
                  />

                  <span className="whitespace-normal break-words">
                    {nombreRolSeleccionado}
                  </span>

                  <button
                    type="button"
                    onClick={limpiarRol}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#0A3D62] hover:text-white"
                    aria-label="Eliminar filtro de rol"
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
              className="inline-flex min-h-9 self-start items-center gap-2 rounded-lg px-3 text-xs font-extrabold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:self-auto"
            >
              <X
                size={14}
                aria-hidden="true"
              />

              Limpiar filtros
            </button>
          </footer>
        )}
      </div>
    </section>
  );
}