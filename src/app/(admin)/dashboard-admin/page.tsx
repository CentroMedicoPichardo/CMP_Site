"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

import { DashboardHeader } from "@/components/admin/dashboard-admin/DashboardHeader";
import { StatsCards } from "@/components/admin/dashboard-admin/StatsCards";
import { CursosRecientes } from "@/components/admin/dashboard-admin/CursosRecientes";
import { UsuariosActivos } from "@/components/admin/dashboard-admin/UsuariosActivos";
import { InscripcionesRecientes } from "@/components/admin/dashboard-admin/InscripcionesRecientes";
import { AlertasSistema } from "@/components/admin/dashboard-admin/AlertasSistema";
import { ActividadReciente } from "@/components/admin/dashboard-admin/ActividadReciente";
import { MetricasRapidas } from "@/components/admin/dashboard-admin/MetricasRapidas";

import type {
  DashboardData,
  DashboardPeriodo,
} from "@/types/dashboard-admin";

interface OpcionesCarga {
  silenciosa?: boolean;
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

function esNumero(
  valor: unknown,
): valor is number {
  return (
    typeof valor === "number" &&
    Number.isFinite(valor)
  );
}

function esDashboardData(
  valor: unknown,
): valor is DashboardData {
  if (!esObjeto(valor)) {
    return false;
  }

  if (!esObjeto(valor.stats)) {
    return false;
  }

  if (!esObjeto(valor.periodo)) {
    return false;
  }

  if (!esObjeto(valor.tendencias)) {
    return false;
  }

  if (!esObjeto(valor.metricasRapidas)) {
    return false;
  }

  const stats = valor.stats;

  return (
    typeof valor.generadoEn === "string" &&
    esNumero(stats.totalUsuarios) &&
    esNumero(stats.totalCursos) &&
    esNumero(stats.totalInscripciones) &&
    esNumero(stats.ingresosTotales) &&
    esNumero(stats.cursosActivos) &&
    esNumero(stats.usuariosNuevosMes) &&
    esNumero(stats.tasaOcupacion) &&
    Array.isArray(valor.cursosRecientes) &&
    Array.isArray(valor.usuariosActivos) &&
    Array.isArray(valor.inscripcionesRecientes) &&
    Array.isArray(valor.alertas) &&
    Array.isArray(valor.actividadReciente)
  );
}

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

/**
 * Consume el cuerpo del Response una sola vez.
 *
 * No debe agregarse response.json() después
 * de llamar esta función.
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

    if (
      typeof payload.detalle === "string" &&
      payload.detalle.trim()
    ) {
      return payload.detalle.trim();
    }
  }

  switch (status) {
    case 400:
      return "La solicitud enviada al dashboard no es válida.";

    case 401:
      return "Tu sesión ha expirado.";

    case 403:
      return "No tienes permiso para consultar el dashboard.";

    case 404:
      return "No se encontró el servicio del dashboard.";

    case 500:
      return "Ocurrió un error interno al obtener las estadísticas.";

    default:
      return `No fue posible cargar el dashboard. Error ${status}.`;
  }
}

function esSolicitudCancelada(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const controllerRef =
    useRef<AbortController | null>(null);

  const [periodo, setPeriodo] =
    useState<DashboardPeriodo>("30_dias");

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [
    loadingInicial,
    setLoadingInicial,
  ] = useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [estaEnLinea, setEstaEnLinea] =
    useState(true);

  const fetchDashboardData = useCallback(
    async (
      opciones: OpcionesCarga = {},
    ) => {
      const { silenciosa = false } =
        opciones;

      controllerRef.current?.abort();

      const controller =
        new AbortController();

      controllerRef.current =
        controller;

      try {
        if (!silenciosa) {
          setActualizando(true);
        }

        setError(null);

        const params =
          new URLSearchParams({
            periodo,
          });

        const response = await fetch(
          `/api/dashboard-admin?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        /*
         * Única lectura del body stream.
         */
        const payload =
          await leerRespuestaUnaVez(response);

        if (response.status === 401) {
          router.replace(
            `/acceder?redirect=${encodeURIComponent(
              "/admin/dashboard",
            )}`,
          );

          return;
        }

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
            "Los datos recibidos no tienen el formato esperado por el dashboard.",
          );
        }

        if (controller.signal.aborted) {
          return;
        }

        setData(dashboardData);
        setEstaEnLinea(true);
      } catch (errorCarga: unknown) {
        if (
          esSolicitudCancelada(errorCarga) ||
          controller.signal.aborted
        ) {
          return;
        }

        console.error(
          "Error cargando dashboard:",
          errorCarga,
        );

        setError(
          errorCarga instanceof Error
            ? errorCarga.message
            : "No fue posible cargar los datos del dashboard.",
        );

        /*
         * No se limpia data.
         *
         * Si una actualización falla, se conserva
         * la última información cargada correctamente.
         */
      } finally {
        if (!controller.signal.aborted) {
          setLoadingInicial(false);
          setActualizando(false);
        }
      }
    },
    [periodo, router],
  );

  /*
   * Carga inicial y recarga cuando cambia el periodo.
   */
  useEffect(() => {
    void fetchDashboardData();

    return () => {
      controllerRef.current?.abort();
    };
  }, [fetchDashboardData]);

  /*
   * Actualización automática cada 60 segundos.
   */
  useEffect(() => {
    const intervalId = window.setInterval(
      () => {
        if (
          document.visibilityState ===
            "visible" &&
          navigator.onLine
        ) {
          void fetchDashboardData({
            silenciosa: true,
          });
        }
      },
      60_000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchDashboardData]);

  /*
   * Actualiza el dashboard cuando el administrador
   * regresa a la pestaña.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
          "visible" &&
        navigator.onLine
      ) {
        void fetchDashboardData({
          silenciosa: true,
        });
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [fetchDashboardData]);

  /*
   * Controla el estado de conexión.
   */
  useEffect(() => {
    setEstaEnLinea(navigator.onLine);

    const handleOnline = () => {
      setEstaEnLinea(true);

      void fetchDashboardData({
        silenciosa: true,
      });
    };

    const handleOffline = () => {
      setEstaEnLinea(false);
    };

    window.addEventListener(
      "online",
      handleOnline,
    );

    window.addEventListener(
      "offline",
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline,
      );

      window.removeEventListener(
        "offline",
        handleOffline,
      );
    };
  }, [fetchDashboardData]);

  const handlePeriodoChange = (
    nuevoPeriodo: DashboardPeriodo,
  ) => {
    if (nuevoPeriodo === periodo) {
      return;
    }

    setPeriodo(nuevoPeriodo);
  };

  const handleRefresh = () => {
    if (!navigator.onLine) {
      setEstaEnLinea(false);

      setError(
        "No hay conexión a internet. Verifica tu red e intenta nuevamente.",
      );

      return;
    }

    void fetchDashboardData();
  };

  if (loadingInicial && !data) {
    return <DashboardLoading />;
  }

  if (!data && error) {
    return (
      <DashboardError
        mensaje={error}
        loading={actualizando}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <DashboardHeader
          periodo={periodo}
          generadoEn={
            data?.generadoEn ?? null
          }
          actualizando={actualizando}
          onPeriodoChange={
            handlePeriodoChange
          }
          onRefresh={handleRefresh}
        />

        {!estaEnLinea && (
          <div
            className="mb-5 flex items-start gap-3 rounded-2xl border border-gray-300 bg-gray-100 px-4 py-3.5"
            role="alert"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600">
              <WifiOff
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs font-extrabold text-gray-800">
                Sin conexión a internet
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-gray-600">
                Se mantienen visibles los últimos datos
                cargados. El dashboard se actualizará
                cuando se restablezca la conexión.
              </p>
            </div>
          </div>
        )}

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
                No se pudo actualizar la información
              </p>

              <p className="mt-0.5 text-[11px] leading-5 text-amber-700">
                {error}
              </p>

              {data && (
                <p className="mt-1 text-[10px] text-amber-700/75">
                  Se mantienen visibles los últimos
                  datos cargados correctamente.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                actualizando ||
                !estaEnLinea
              }
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-extrabold text-amber-800 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  actualizando
                    ? "animate-spin"
                    : undefined
                }
                aria-hidden="true"
              />

              {actualizando
                ? "Actualizando..."
                : "Reintentar"}
            </button>
          </div>
        )}

        {actualizando && data && (
          <div
            className="mb-4 flex items-center gap-2 text-[10px] font-semibold text-[#0A3D62]"
            role="status"
            aria-live="polite"
          >
            <Loader2
              size={13}
              className="animate-spin"
              aria-hidden="true"
            />

            Actualizando información del dashboard...
          </div>
        )}

        <StatsCards
          stats={data?.stats}
          tendencias={data?.tendencias}
        />

        <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
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

        <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <InscripcionesRecientes
            inscripciones={
              data?.inscripcionesRecientes ??
              []
            }
          />

          <AlertasSistema
            alertas={
              data?.alertas ?? []
            }
          />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <ActividadReciente
            actividades={
              data?.actividadReciente ?? []
            }
          />

          <MetricasRapidas
            stats={data?.stats}
            metricas={
              data?.metricasRapidas
            }
            tendencias={
              data?.tendencias
            }
          />
        </div>

        <footer className="mt-6 flex flex-col gap-2 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-3 text-[10px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            {estaEnLinea ? (
              <Wifi
                size={13}
                className="text-emerald-600"
                aria-hidden="true"
              />
            ) : (
              <WifiOff
                size={13}
                className="text-gray-500"
                aria-hidden="true"
              />
            )}

            {estaEnLinea
              ? "Actualización automática cada 60 segundos"
              : "Esperando conexión para actualizar"}
          </span>

          <span>
            Periodo actual:{" "}
            <strong className="font-extrabold text-[#0A3D62]">
              {data?.periodo.etiqueta ??
                "Últimos 30 días"}
            </strong>
          </span>
        </footer>
      </div>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div
          className="flex min-h-[60vh] items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white px-6 py-8 text-center shadow-[0_18px_45px_rgba(10,61,98,0.08)]">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-[0_10px_25px_rgba(10,61,98,0.18)]">
              <Loader2
                size={27}
                className="animate-spin"
                aria-hidden="true"
              />
            </span>

            <h1 className="mt-4 text-base font-extrabold text-[#0A3D62]">
              Preparando dashboard
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-gray-500">
              Consultando usuarios, cursos,
              inscripciones, pagos y actividad del
              sistema.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

interface DashboardErrorProps {
  mensaje: string;
  loading: boolean;
  onRetry: () => void;
}

function DashboardError({
  mensaje,
  loading,
  onRetry,
}: DashboardErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FAFC] px-4 py-10">
      <section
        className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(10,61,98,0.10)] sm:p-8"
        role="alert"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle
            size={30}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <h1 className="mt-4 text-xl font-extrabold text-[#0A3D62]">
          No pudimos cargar el dashboard
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          {mensaje}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={loading}
          className="mx-auto mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 text-xs font-extrabold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
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
            ? "Cargando..."
            : "Intentar nuevamente"}
        </button>
      </section>
    </main>
  );
}