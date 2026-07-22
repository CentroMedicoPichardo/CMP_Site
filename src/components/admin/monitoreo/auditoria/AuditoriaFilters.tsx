"use client";

import { useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  Table2,
  X,
} from "lucide-react";

interface AuditoriaFiltros {
  usuario: string;
  tabla: string;
  accion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface AuditoriaFiltersProps {
  filters: AuditoriaFiltros;
  onFiltersChange: (
    filters: AuditoriaFiltros,
  ) => void;
}

const ACCIONES = [
  "INSERT",
  "UPDATE",
];

const TABLAS = [
  {
    value: "clinica.medicos",
    label: "Médicos",
  },
  {
    value: "clinica.nosotros",
    label: "Nosotros",
  },
  {
    value: "clinica.servicios",
    label: "Servicios",
  },
  {
    value: "seguridad.usuarios",
    label: "Usuarios",
  },
  {
    value: "academia.cursos",
    label: "Cursos",
  },
];

const FILTROS_VACIOS: AuditoriaFiltros = {
  usuario: "",
  tabla: "",
  accion: "",
  fechaInicio: "",
  fechaFin: "",
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

export function AuditoriaFilters({
  filters,
  onFiltersChange,
}: AuditoriaFiltersProps) {
  const [
    mostrarFiltros,
    setMostrarFiltros,
  ] = useState(false);

  const cantidadFiltrosActivos =
    useMemo(
      () =>
        Object.values(filters).filter(
          (valor) =>
            valor.trim().length > 0,
        ).length,
      [filters],
    );

  const hayFiltrosActivos =
    cantidadFiltrosActivos > 0;

  const rangoInvalido =
    Boolean(
      filters.fechaInicio &&
        filters.fechaFin &&
        filters.fechaInicio >
          filters.fechaFin,
    );

  const cambiarFiltro = (
    campo: keyof AuditoriaFiltros,
    valor: string,
  ) => {
    onFiltersChange({
      ...filters,
      [campo]: valor,
    });
  };

  const limpiarFiltros = () => {
    onFiltersChange(
      FILTROS_VACIOS,
    );
  };

  const limpiarFiltro = (
    campo: keyof AuditoriaFiltros,
  ) => {
    cambiarFiltro(campo, "");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-1 w-full bg-[#FFC300]" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Search
                size={16}
                className="text-[#0A3D62]"
                aria-hidden="true"
              />

              <label
                htmlFor="auditoria-usuario"
                className="text-xs font-extrabold text-[#0A3D62]"
              >
                Buscar por usuario
              </label>
            </div>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />

              <input
                id="auditoria-usuario"
                type="search"
                value={filters.usuario}
                onChange={(event) => {
                  cambiarFiltro(
                    "usuario",
                    event.target.value,
                  );
                }}
                placeholder="Nombre o correo del usuario"
                className="min-h-11 w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pl-10 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:bg-white focus:ring-4 focus:ring-[#FFC300]/15"
              />

              {filters.usuario && (
                <button
                  type="button"
                  onClick={() => {
                    limpiarFiltro("usuario");
                  }}
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Limpiar búsqueda"
                >
                  <X
                    size={15}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:self-end">
            <button
              type="button"
              onClick={() => {
                setMostrarFiltros(
                  (estadoActual) =>
                    !estadoActual,
                );
              }}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-extrabold transition-colors",
                mostrarFiltros ||
                  hayFiltrosActivos
                  ? "border-[#FFC300] bg-[#FFF9E6] text-[#0A3D62]"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
              )}
              aria-expanded={
                mostrarFiltros
              }
              aria-controls="filtros-avanzados-auditoria"
            >
              <Filter
                size={16}
                aria-hidden="true"
              />

              Filtros avanzados

              {hayFiltrosActivos && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFC300] px-1.5 text-[10px] font-extrabold text-[#0A3D62]">
                  {
                    cantidadFiltrosActivos
                  }
                </span>
              )}

              <ChevronDown
                size={15}
                className={cn(
                  "transition-transform",
                  mostrarFiltros &&
                    "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-extrabold text-red-600 transition-colors hover:border-red-200 hover:bg-red-100"
              >
                <RotateCcw
                  size={15}
                  aria-hidden="true"
                />

                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {hayFiltrosActivos && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.usuario && (
              <FiltroActivo
                etiqueta={`Usuario: ${filters.usuario}`}
                onRemove={() => {
                  limpiarFiltro("usuario");
                }}
              />
            )}

            {filters.tabla && (
              <FiltroActivo
                etiqueta={`Tabla: ${
                  TABLAS.find(
                    (tabla) =>
                      tabla.value ===
                      filters.tabla,
                  )?.label ??
                  filters.tabla
                }`}
                onRemove={() => {
                  limpiarFiltro("tabla");
                }}
              />
            )}

            {filters.accion && (
              <FiltroActivo
                etiqueta={`Acción: ${filters.accion}`}
                onRemove={() => {
                  limpiarFiltro("accion");
                }}
              />
            )}

            {filters.fechaInicio && (
              <FiltroActivo
                etiqueta={`Desde: ${filters.fechaInicio}`}
                onRemove={() => {
                  limpiarFiltro(
                    "fechaInicio",
                  );
                }}
              />
            )}

            {filters.fechaFin && (
              <FiltroActivo
                etiqueta={`Hasta: ${filters.fechaFin}`}
                onRemove={() => {
                  limpiarFiltro(
                    "fechaFin",
                  );
                }}
              />
            )}
          </div>
        )}

        {mostrarFiltros && (
          <div
            id="filtros-avanzados-auditoria"
            className="mt-5 border-t border-gray-100 pt-5"
          >
            <div className="mb-4">
              <h2 className="text-sm font-extrabold text-[#0A3D62]">
                Filtros avanzados
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Combina uno o varios criterios
                para reducir los resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="auditoria-tabla"
                  className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#0A3D62]"
                >
                  <Table2
                    size={15}
                    aria-hidden="true"
                  />

                  Tabla afectada
                </label>

                <select
                  id="auditoria-tabla"
                  value={filters.tabla}
                  onChange={(event) => {
                    cambiarFiltro(
                      "tabla",
                      event.target.value,
                    );
                  }}
                  className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15"
                >
                  <option value="">
                    Todas las tablas
                  </option>

                  {TABLAS.map((tabla) => (
                    <option
                      key={tabla.value}
                      value={tabla.value}
                    >
                      {tabla.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="auditoria-accion"
                  className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#0A3D62]"
                >
                  <Filter
                    size={15}
                    aria-hidden="true"
                  />

                  Acción
                </label>

                <select
                  id="auditoria-accion"
                  value={filters.accion}
                  onChange={(event) => {
                    cambiarFiltro(
                      "accion",
                      event.target.value,
                    );
                  }}
                  className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15"
                >
                  <option value="">
                    Todas las acciones
                  </option>

                  {ACCIONES.map(
                    (accion) => (
                      <option
                        key={accion}
                        value={accion}
                      >
                        {accion}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="auditoria-fecha-inicio"
                  className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#0A3D62]"
                >
                  <CalendarDays
                    size={15}
                    aria-hidden="true"
                  />

                  Fecha de inicio
                </label>

                <input
                  id="auditoria-fecha-inicio"
                  type="date"
                  value={
                    filters.fechaInicio
                  }
                  onChange={(event) => {
                    cambiarFiltro(
                      "fechaInicio",
                      event.target.value,
                    );
                  }}
                  max={
                    filters.fechaFin ||
                    undefined
                  }
                  className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="auditoria-fecha-fin"
                  className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#0A3D62]"
                >
                  <CalendarDays
                    size={15}
                    aria-hidden="true"
                  />

                  Fecha final
                </label>

                <input
                  id="auditoria-fecha-fin"
                  type="date"
                  value={filters.fechaFin}
                  onChange={(event) => {
                    cambiarFiltro(
                      "fechaFin",
                      event.target.value,
                    );
                  }}
                  min={
                    filters.fechaInicio ||
                    undefined
                  }
                  className={cn(
                    "min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:ring-4",
                    rangoInvalido
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/15",
                  )}
                />
              </div>
            </div>

            {rangoInvalido && (
              <p className="mt-3 text-xs font-semibold text-red-600">
                La fecha de inicio no puede
                ser posterior a la fecha
                final.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FiltroActivo({
  etiqueta,
  onRemove,
}: {
  etiqueta: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0A3D62]/15 bg-[#F2F7FA] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]">
      <span className="min-w-0 break-words">
        {etiqueta}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#0A3D62] hover:text-white"
        aria-label={`Eliminar filtro ${etiqueta}`}
      >
        <X
          size={12}
          aria-hidden="true"
        />
      </button>
    </span>
  );
}