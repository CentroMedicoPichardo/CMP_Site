"use client";

import {
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Loader2,
  LogOut,
  RefreshCw,
} from "lucide-react";

import type { DashboardPeriodo } from "@/types/dashboard-admin";

interface DashboardHeaderProps {
  periodo: DashboardPeriodo;
  generadoEn: string | null;
  actualizando: boolean;
  onPeriodoChange: (
    periodo: DashboardPeriodo,
  ) => void;
  onRefresh: () => void;
}

interface PeriodoOption {
  value: DashboardPeriodo;
  label: string;
}

const PERIODOS: PeriodoOption[] = [
  {
    value: "7_dias",
    label: "Últimos 7 días",
  },
  {
    value: "30_dias",
    label: "Últimos 30 días",
  },
  {
    value: "90_dias",
    label: "Últimos 90 días",
  },
  {
    value: "este_anio",
    label: "Este año",
  },
];

const FORMATEADOR_FECHA =
  new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const FORMATEADOR_FECHA_HORA =
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function esDashboardPeriodo(
  valor: string,
): valor is DashboardPeriodo {
  return PERIODOS.some(
    (periodo) =>
      periodo.value === valor,
  );
}

function formatearFechaActual(): string {
  const fechaFormateada =
    FORMATEADOR_FECHA.format(new Date());

  return (
    fechaFormateada.charAt(0).toUpperCase() +
    fechaFormateada.slice(1)
  );
}

function formatearUltimaActualizacion(
  valor: string | null,
): string {
  if (!valor) {
    return "Aún no disponible";
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "Fecha no disponible";
  }

  return FORMATEADOR_FECHA_HORA.format(
    fecha,
  );
}

async function obtenerMensajeError(
  response: Response,
): Promise<string> {
  const contenido =
    await response.text();

  if (!contenido.trim()) {
    return "No fue posible cerrar la sesión.";
  }

  try {
    const data = JSON.parse(contenido) as {
      error?: unknown;
      message?: unknown;
    };

    if (
      typeof data.error === "string" &&
      data.error.trim()
    ) {
      return data.error;
    }

    if (
      typeof data.message === "string" &&
      data.message.trim()
    ) {
      return data.message;
    }
  } catch {
    return "El servidor devolvió una respuesta inválida.";
  }

  return "No fue posible cerrar la sesión.";
}

export function DashboardHeader({
  periodo,
  generadoEn,
  actualizando,
  onPeriodoChange,
  onRefresh,
}: DashboardHeaderProps) {
  const router = useRouter();

  const [cerrandoSesion, setCerrandoSesion] =
    useState(false);

  const [errorLogout, setErrorLogout] =
    useState<string | null>(null);

  const handlePeriodoChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const nuevoPeriodo =
      event.target.value;

    if (
      esDashboardPeriodo(nuevoPeriodo)
    ) {
      onPeriodoChange(nuevoPeriodo);
    }
  };

  const handleLogout = async () => {
    if (cerrandoSesion) {
      return;
    }

    try {
      setCerrandoSesion(true);
      setErrorLogout(null);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          await obtenerMensajeError(response),
        );
      }

      router.replace("/acceder");
      router.refresh();
    } catch (error: unknown) {
      console.error(
        "Error cerrando sesión:",
        error,
      );

      setErrorLogout(
        error instanceof Error
          ? error.message
          : "No fue posible cerrar la sesión.",
      );
    } finally {
      setCerrandoSesion(false);
    }
  };

  return (
    <header className="mb-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <LayoutDashboard
                size={21}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
                Panel de administración
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays
                    size={13}
                    aria-hidden="true"
                  />

                  {formatearFechaActual()}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3
                    size={13}
                    aria-hidden="true"
                  />

                  Última actualización:{" "}
                  {formatearUltimaActualizacion(
                    generadoEn,
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 sm:w-48">
              <label
                htmlFor="dashboard-periodo"
                className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-500"
              >
                Periodo
              </label>

              <select
                id="dashboard-periodo"
                value={periodo}
                onChange={
                  handlePeriodoChange
                }
                disabled={actualizando}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-[#0A3D62] outline-none transition-colors focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {PERIODOS.map(
                  (opcion) => (
                    <option
                      key={opcion.value}
                      value={opcion.value}
                    >
                      {opcion.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={actualizando}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/15 bg-white px-4 text-xs font-extrabold text-[#0A3D62] transition-colors hover:bg-[#F1F6F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actualizando ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <RefreshCw
                  size={15}
                  aria-hidden="true"
                />
              )}

              {actualizando
                ? "Actualizando..."
                : "Actualizar"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}