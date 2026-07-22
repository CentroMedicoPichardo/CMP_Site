"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  Eye,
  Globe2,
  Hash,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Server,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";

interface AuditoriaRegistro {
  id: number;
  usuario: string | null;
  ip_address: string | null;
  accion: string | null;
  tabla_afectada: string | null;
  registro_id: number | null;
  datos_anteriores: unknown;
  datos_nuevos: unknown;
  fecha_hora: string | null;
  aplicacion_origen?: string | null;
  session_id?: string | null;
}

interface AuditoriaTableProps {
  registros: AuditoriaRegistro[];
  loading: boolean;
  onViewDetails: (
    registro: AuditoriaRegistro,
  ) => void;
}

interface ConfiguracionAccion {
  etiqueta: string;
  Icono: LucideIcon;
  clases: string;
}

const REGISTROS_POR_PAGINA = 20;

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
  respaldo = "No disponible",
): string {
  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    return valor.trim();
  }

  if (
    typeof valor === "number" &&
    Number.isFinite(valor)
  ) {
    return String(valor);
  }

  return respaldo;
}

function normalizarAccion(
  accion: string | null,
): string {
  return textoSeguro(accion, "")
    .toUpperCase()
    .trim();
}

function obtenerConfiguracionAccion(
  accion: string | null,
): ConfiguracionAccion {
  const valor =
    normalizarAccion(accion);

  if (valor === "INSERT") {
    return {
      etiqueta: "INSERT",
      Icono: Plus,
      clases:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (valor === "UPDATE") {
    return {
      etiqueta: "UPDATE",
      Icono: Pencil,
      clases:
        "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (valor === "DELETE") {
    return {
      etiqueta: "DELETE",
      Icono: Trash2,
      clases:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    etiqueta:
      textoSeguro(
        accion,
        "DESCONOCIDA",
      ),
    Icono: Activity,
    clases:
      "border-gray-200 bg-gray-100 text-gray-600",
  };
}

function obtenerFecha(
  fecha: string | null,
): Date | null {
  if (!fecha) {
    return null;
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return null;
  }

  return valor;
}

function formatearFecha(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Fecha no disponible";
  }

  return valor.toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatearHora(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Hora no disponible";
  }

  return valor.toLocaleTimeString(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );
}

function generarPaginasVisibles(
  paginaActual: number,
  totalPaginas: number,
): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (totalPaginas <= 7) {
    return Array.from(
      {
        length: totalPaginas,
      },
      (_, indice) => indice + 1,
    );
  }

  if (paginaActual <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-right",
      totalPaginas,
    ];
  }

  if (
    paginaActual >=
    totalPaginas - 3
  ) {
    return [
      1,
      "ellipsis-left",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "ellipsis-left",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "ellipsis-right",
    totalPaginas,
  ];
}

export function AuditoriaTable({
  registros,
  loading,
  onViewDetails,
}: AuditoriaTableProps) {
  const [
    paginaActual,
    setPaginaActual,
  ] = useState(1);

  const totalRegistros =
    registros.length;

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      totalRegistros /
        REGISTROS_POR_PAGINA,
    ),
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [registros]);

  useEffect(() => {
    if (
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas,
  ]);

  const registrosPagina =
    useMemo(() => {
      const inicio =
        (paginaActual - 1) *
        REGISTROS_POR_PAGINA;

      return registros.slice(
        inicio,
        inicio +
          REGISTROS_POR_PAGINA,
      );
    }, [
      registros,
      paginaActual,
    ]);

  const paginasVisibles =
    useMemo(
      () =>
        generarPaginasVisibles(
          paginaActual,
          totalPaginas,
        ),
      [
        paginaActual,
        totalPaginas,
      ],
    );

  const primerRegistro =
    totalRegistros === 0
      ? 0
      : (paginaActual - 1) *
          REGISTROS_POR_PAGINA +
        1;

  const ultimoRegistro = Math.min(
    paginaActual *
      REGISTROS_POR_PAGINA,
    totalRegistros,
  );

  const cambiarPagina = (
    nuevaPagina: number,
  ) => {
    const paginaSegura = Math.min(
      Math.max(nuevaPagina, 1),
      totalPaginas,
    );

    setPaginaActual(paginaSegura);
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F7FA] text-[#0A3D62]">
            <Loader2
              size={26}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando auditoría
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Consultando los registros
              disponibles.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (registros.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Database
              size={29}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-base font-extrabold text-[#0A3D62]">
              No hay registros
            </p>

            <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
              No se encontraron registros de
              auditoría con los filtros
              seleccionados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-1 w-full bg-[#FFC300]" />

      <header className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Database
              size={19}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-[#0A3D62]">
              Historial de auditoría
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consulta las acciones
              registradas dentro del sistema.
            </p>
          </div>
        </div>

        <div className="self-start rounded-xl border border-gray-200 bg-[#F8FAFC] px-3 py-2 sm:self-auto">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            Total de registros
          </p>

          <p className="mt-0.5 text-sm font-extrabold text-[#0A3D62]">
            {totalRegistros.toLocaleString(
              "es-MX",
            )}
          </p>
        </div>
      </header>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr className="border-b border-[#0A3D62]/10 bg-[#0A3D62] text-white">
              <th className="px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide">
                Fecha y hora
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide">
                Usuario
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide">
                Acción
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide">
                Tabla afectada
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide">
                Dirección IP
              </th>

              <th className="px-5 py-3.5 text-center text-[11px] font-extrabold uppercase tracking-wide">
                Detalles
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {registrosPagina.map(
              (registro) => {
                const accion =
                  obtenerConfiguracionAccion(
                    registro.accion,
                  );

                const IconoAccion =
                  accion.Icono;

                return (
                  <tr
                    key={registro.id}
                    className="group bg-white transition-colors hover:bg-[#FFFDF5]"
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF9E6] text-[#9A7300]">
                          <CalendarClock
                            size={15}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="whitespace-nowrap text-xs font-bold capitalize text-gray-800">
                            {formatearFecha(
                              registro.fecha_hora,
                            )}
                          </p>

                          <p className="mt-1 whitespace-nowrap font-mono text-[11px] text-gray-500">
                            {formatearHora(
                              registro.fecha_hora,
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
                          <UserRound
                            size={15}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="max-w-[220px] break-words text-sm font-bold leading-5 text-gray-800">
                            {textoSeguro(
                              registro.usuario,
                              "Usuario no identificado",
                            )}
                          </p>

                          {registro.aplicacion_origen && (
                            <p className="mt-1 flex max-w-[220px] items-center gap-1 break-words text-[11px] leading-4 text-gray-400">
                              <Globe2
                                size={11}
                                className="shrink-0"
                                aria-hidden="true"
                              />

                              {
                                registro.aplicacion_origen
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold",
                          accion.clases,
                        )}
                      >
                        <IconoAccion
                          size={12}
                          aria-hidden="true"
                        />

                        {accion.etiqueta}
                      </span>

                      {registro.registro_id !==
                        null && (
                        <p className="mt-2 flex items-center gap-1 font-mono text-[10px] text-gray-400">
                          <Hash
                            size={11}
                            aria-hidden="true"
                          />

                          Registro{" "}
                          {
                            registro.registro_id
                          }
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <Server
                          size={14}
                          className="mt-0.5 shrink-0 text-gray-400"
                          aria-hidden="true"
                        />

                        <code className="max-w-[260px] whitespace-normal break-all rounded-lg bg-gray-100 px-2 py-1 font-mono text-[11px] leading-5 text-gray-600">
                          {textoSeguro(
                            registro.tabla_afectada,
                          )}
                        </code>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="mt-1 shrink-0 text-gray-400"
                          aria-hidden="true"
                        />

                        <code className="max-w-[190px] break-all rounded-lg border border-gray-200 bg-[#F8FAFC] px-2 py-1 font-mono text-[11px] leading-5 text-gray-600">
                          {textoSeguro(
                            registro.ip_address,
                          )}
                        </code>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center align-top">
                      <button
                        type="button"
                        onClick={() => {
                          onViewDetails(
                            registro,
                          );
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#0A3D62]/15 bg-white text-[#0A3D62] transition-colors hover:border-[#0A3D62] hover:bg-[#0A3D62] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                        aria-label={`Ver detalles del registro ${registro.id}`}
                        title="Ver detalles"
                      >
                        <Eye
                          size={17}
                          aria-hidden="true"
                        />
                      </button>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600">
              Mostrando{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {primerRegistro}
              </span>{" "}
              a{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {ultimoRegistro}
              </span>{" "}
              de{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {totalRegistros}
              </span>{" "}
              registros
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              20 registros por página
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-1.5"
            aria-label="Paginación de auditoría"
          >
            <BotonPaginacion
              onClick={() => {
                cambiarPagina(1);
              }}
              disabled={
                paginaActual === 1
              }
              label="Primera página"
            >
              <ChevronsLeft
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  paginaActual - 1,
                );
              }}
              disabled={
                paginaActual === 1
              }
              label="Página anterior"
            >
              <ChevronLeft
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <div className="flex items-center gap-1">
              {paginasVisibles.map(
                (pagina, indice) => {
                  if (
                    pagina ===
                      "ellipsis-left" ||
                    pagina ===
                      "ellipsis-right"
                  ) {
                    return (
                      <span
                        key={`${pagina}-${indice}`}
                        className="flex h-9 min-w-8 items-center justify-center px-1 text-xs font-bold text-gray-400"
                      >
                        …
                      </span>
                    );
                  }

                  const activa =
                    pagina ===
                    paginaActual;

                  return (
                    <button
                      key={pagina}
                      type="button"
                      onClick={() => {
                        cambiarPagina(
                          pagina,
                        );
                      }}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-extrabold transition-colors",
                        activa
                          ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62]",
                      )}
                      aria-current={
                        activa
                          ? "page"
                          : undefined
                      }
                      aria-label={`Ir a la página ${pagina}`}
                    >
                      {pagina}
                    </button>
                  );
                },
              )}
            </div>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  paginaActual + 1,
                );
              }}
              disabled={
                paginaActual ===
                totalPaginas
              }
              label="Página siguiente"
            >
              <ChevronRight
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  totalPaginas,
                );
              }}
              disabled={
                paginaActual ===
                totalPaginas
              }
              label="Última página"
            >
              <ChevronsRight
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>
          </nav>
        </div>
      </footer>
    </section>
  );
}

function BotonPaginacion({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}