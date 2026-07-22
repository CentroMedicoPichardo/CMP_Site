"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { DashboardHeader } from "@/components/admin/dashboard-admin/DashboardHeader";
import { StatsCards } from "@/components/admin/dashboard-admin/StatsCards";
import { CursosRecientes } from "@/components/admin/dashboard-admin/CursosRecientes";
import { UsuariosActivos } from "@/components/admin/dashboard-admin/UsuariosActivos";
import { InscripcionesRecientes } from "@/components/admin/dashboard-admin/InscripcionesRecientes";
import { AlertasSistema } from "@/components/admin/dashboard-admin/AlertasSistema";
import { ActividadReciente } from "@/components/admin/dashboard-admin/ActividadReciente";
import { MetricasRapidas } from "@/components/admin/dashboard-admin/MetricasRapidas";

interface DashboardStats {
  totalUsuarios: number;
  totalCursos: number;
  totalInscripciones: number;
  ingresosTotales: number;
  cursosActivos: number;
  usuariosNuevosMes: number;
  tasaOcupacion: number;
}

interface DashboardData {
  stats: DashboardStats;
  cursosRecientes: any[];
  usuariosActivos: any[];
  inscripcionesRecientes: any[];
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

function esObjeto(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

/**
 * Lee el cuerpo de la respuesta una sola vez.
 *
 * No se utiliza response.json() para evitar que el mismo
 * body stream pueda consumirse accidentalmente dos veces.
 */
async function leerRespuestaUnaVez(
  response: Response,
): Promise<unknown> {
  const contenido = await response.text();

  if (!contenido.trim()) {
    return null;
  }

  try {
    return JSON.parse(contenido) as unknown;
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta con formato inválido.",
    );
  }
}

function obtenerMensajeError(
  payload: unknown,
  status: number,
): string {
  if (esObjeto(payload)) {
    if (
      typeof payload.error === "string" &&
      payload.error.trim()
    ) {
      return payload.error.trim();
    }

    if (
      typeof payload.message === "string" &&
      payload.message.trim()
    ) {
      return payload.message.trim();
    }
  }

  switch (status) {
    case 400:
      return "La solicitud del dashboard no es válida.";

    case 401:
      return "Tu sesión ha expirado. Inicia sesión nuevamente.";

    case 403:
      return "No tienes permiso para consultar el dashboard.";

    case 404:
      return "No se encontró el servicio del dashboard.";

    case 500:
      return "Ocurrió un error interno al cargar el dashboard.";

    default:
      return `No fue posible cargar el dashboard. Error ${status}.`;
  }
}

function esNumero(
  valor: unknown,
): valor is number {
  return (
    typeof valor === "number" &&
    Number.isFinite(valor)
  );
}

function esDashboardStats(
  valor: unknown,
): valor is DashboardStats {
  if (!esObjeto(valor)) {
    return false;
  }

  return (
    esNumero(valor.totalUsuarios) &&
    esNumero(valor.totalCursos) &&
    esNumero(valor.totalInscripciones) &&
    esNumero(valor.ingresosTotales) &&
    esNumero(valor.cursosActivos) &&
    esNumero(valor.usuariosNuevosMes) &&
    esNumero(valor.tasaOcupacion)
  );
}

function esDashboardData(
  valor: unknown,
): valor is DashboardData {
  if (!esObjeto(valor)) {
    return false;
  }

  return (
    esDashboardStats(valor.stats) &&
    Array.isArray(valor.cursosRecientes) &&
    Array.isArray(valor.usuariosActivos) &&
    Array.isArray(
      valor.inscripcionesRecientes,
    )
  );
}

/**
 * Admite estas dos posibles respuestas del endpoint:
 *
 * 1. Respuesta directa:
 *    { stats, cursosRecientes, ... }
 *
 * 2. Respuesta envuelta:
 *    { data: { stats, cursosRecientes, ... } }
 */
function extraerDashboardData(
  payload: unknown,
): DashboardData | null {
  if (esDashboardData(payload)) {
    return payload;
  }

  if (
    esObjeto(payload) &&
    esDashboardData(payload.data)
  ) {
    return payload.data;
  }

  return null;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const fetchDashboardData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/dashboard-admin",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
            signal,
          },
        );

        /*
         * El cuerpo de la respuesta se consume aquí
         * una sola vez.
         */
        const payload =
          await leerRespuestaUnaVez(response);

        if (!response.ok) {
          throw new Error(
            obtenerMensajeError(
              payload,
              response.status,
            ),
          );
        }

        const dashboardData =
          extraerDashboardData(payload);

        if (!dashboardData) {
          throw new Error(
            "Los datos recibidos del dashboard no tienen el formato esperado.",
          );
        }

        if (signal?.aborted) {
          return;
        }

        setData(dashboardData);
      } catch (errorCarga: unknown) {
        const solicitudCancelada =
          errorCarga instanceof DOMException &&
          errorCarga.name === "AbortError";

        if (solicitudCancelada) {
          return;
        }

        console.error(
          "Error fetching dashboard:",
          errorCarga,
        );

        if (signal?.aborted) {
          return;
        }

        setError(
          errorCarga instanceof Error
            ? errorCarga.message
            : "No se pudieron cargar los datos del dashboard.",
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller =
      new AbortController();

    void fetchDashboardData(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7FAFC] px-4">
        <div
          className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white px-6 py-8 text-center shadow-[0_18px_45px_rgba(10,61,98,0.08)]"
          role="status"
          aria-live="polite"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-[0_10px_25px_rgba(10,61,98,0.18)]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <h1 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            Cargando dashboard
          </h1>

          <p className="mt-1.5 text-xs leading-5 text-gray-500">
            Estamos consultando la información
            administrativa.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {error && (
          <div
            className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center"
            role="alert"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-amber-800">
                No se pudo actualizar el dashboard
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-amber-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void fetchDashboardData();
              }}
              disabled={loading}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-extrabold text-amber-800 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : undefined
                }
                aria-hidden="true"
              />

              {loading
                ? "Actualizando..."
                : "Reintentar"}
            </button>
          </div>
        )}

        <DashboardHeader />

        <StatsCards stats={data?.stats} />

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CursosRecientes
            cursos={
              data?.cursosRecientes ?? []
            }
          />

          <UsuariosActivos
            usuarios={
              data?.usuariosActivos ?? []
            }
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InscripcionesRecientes
            inscripciones={
              data?.inscripcionesRecientes ??
              []
            }
          />

          <AlertasSistema />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActividadReciente />

          <MetricasRapidas
            stats={data?.stats}
          />
        </div>
      </div>
    </main>
  );
}