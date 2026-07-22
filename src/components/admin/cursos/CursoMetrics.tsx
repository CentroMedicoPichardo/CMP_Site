"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  Percent,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  Curso,
  CursoAnalytics,
} from "@/types/cursos";

interface CursoMetricsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

type EstadoMetrica =
  | "good"
  | "warning"
  | "critical"
  | "neutral";

interface MetricaCurso {
  id: string;
  titulo: string;
  valor: string;
  descripcion: string;
  icono: LucideIcon;
  estado: EstadoMetrica;
  progreso?: number;
  progresoTexto?: string;
}

interface ConfiguracionEstado {
  acento: string;
  icono: string;
  valor: string;
  progreso: string;
}

const CONFIGURACION_ESTADO: Record<
  EstadoMetrica,
  ConfiguracionEstado
> = {
  good: {
    acento: "bg-emerald-500",
    icono:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    valor: "text-gray-900",
    progreso: "bg-emerald-500",
  },

  warning: {
    acento: "bg-amber-400",
    icono:
      "border-amber-100 bg-amber-50 text-amber-700",
    valor: "text-gray-900",
    progreso: "bg-amber-500",
  },

  critical: {
    acento: "bg-red-500",
    icono:
      "border-red-100 bg-red-50 text-red-700",
    valor: "text-red-700",
    progreso: "bg-red-500",
  },

  neutral: {
    acento: "bg-[#0A3D62]",
    icono:
      "border-[#0A3D62]/10 bg-[#EAF2F8] text-[#0A3D62]",
    valor: "text-gray-900",
    progreso: "bg-[#0A3D62]",
  },
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function esRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function numeroSeguro(
  valor: unknown,
  respaldo = 0,
): number {
  if (
    typeof valor === "number" &&
    Number.isFinite(valor)
  ) {
    return valor;
  }

  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    const numero = Number(valor);

    if (Number.isFinite(numero)) {
      return numero;
    }
  }

  return respaldo;
}

function obtenerNumeroAnalytics(
  analytics: unknown,
  campo: string,
  respaldo = 0,
): number {
  if (!esRegistro(analytics)) {
    return respaldo;
  }

  return numeroSeguro(
    analytics[campo],
    respaldo,
  );
}

function tieneCampoAnalytics(
  analytics: unknown,
  campo: string,
): boolean {
  if (!esRegistro(analytics)) {
    return false;
  }

  return (
    analytics[campo] !== null &&
    analytics[campo] !== undefined &&
    analytics[campo] !== ""
  );
}

function formatearNumero(
  valor: number,
  decimales = 0,
): string {
  return valor.toLocaleString("es-MX", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

function obtenerEstadoOcupacion(
  ocupacion: number,
): EstadoMetrica {
  if (ocupacion >= 100) {
    return "critical";
  }

  if (ocupacion >= 80) {
    return "warning";
  }

  return "good";
}

function obtenerEstadoDisponibilidad(
  lugaresDisponibles: number,
  cupoMaximo: number,
): EstadoMetrica {
  if (cupoMaximo <= 0) {
    return "neutral";
  }

  if (lugaresDisponibles <= 0) {
    return "critical";
  }

  if (lugaresDisponibles < 5) {
    return "warning";
  }

  return "good";
}

function obtenerEstadoConversion(
  tasaConversion: number,
): EstadoMetrica {
  if (tasaConversion >= 10) {
    return "good";
  }

  if (tasaConversion >= 5) {
    return "warning";
  }

  return "critical";
}

export function CursoMetrics({
  curso,
  analytics,
}: CursoMetricsProps) {
  const cuposOcupados = Math.max(
    0,
    numeroSeguro(curso.cuposOcupados),
  );

  const cupoMaximo = Math.max(
    0,
    numeroSeguro(curso.cupoMaximo),
  );

  const ocupacion =
    cupoMaximo > 0
      ? (cuposOcupados / cupoMaximo) *
        100
      : 0;

  const ocupacionVisual = Math.min(
    100,
    Math.max(0, ocupacion),
  );

  const disponibilidad = Math.max(
    0,
    cupoMaximo - cuposOcupados,
  );

  const tieneAnalytics =
    analytics !== null;

  const velocidadInscripcion =
    obtenerNumeroAnalytics(
      analytics,
      "velocidadInscripcion",
    );

  const tasaConversion =
    obtenerNumeroAnalytics(
      analytics,
      "tasaConversion",
    );

  const tendencia =
    obtenerNumeroAnalytics(
      analytics,
      "tendencia",
    );

  const tieneTendencia =
    tieneCampoAnalytics(
      analytics,
      "tendencia",
    );

  const metricas: MetricaCurso[] = [
    {
      id: "ocupacion",
      titulo: "Ocupación actual",
      valor: `${formatearNumero(
        ocupacion,
        1,
      )}%`,
      descripcion:
        cupoMaximo > 0
          ? `${formatearNumero(
              cuposOcupados,
            )} de ${formatearNumero(
              cupoMaximo,
            )} lugares ocupados`
          : "El curso no tiene un cupo máximo definido.",
      icono: Percent,
      estado:
        obtenerEstadoOcupacion(
          ocupacion,
        ),
      progreso: ocupacionVisual,
      progresoTexto:
        cupoMaximo > 0
          ? `${formatearNumero(
              disponibilidad,
            )} lugares restantes`
          : "Sin cupo configurado",
    },

    {
      id: "disponibilidad",
      titulo: "Lugares disponibles",
      valor: formatearNumero(
        disponibilidad,
      ),
      descripcion:
        cupoMaximo <= 0
          ? "Cupo máximo no configurado."
          : disponibilidad === 0
            ? "El curso se encuentra completo."
            : disponibilidad < 5
              ? "Quedan pocos lugares disponibles."
              : "Lugares disponibles para inscripción.",
      icono: Users,
      estado:
        obtenerEstadoDisponibilidad(
          disponibilidad,
          cupoMaximo,
        ),
    },

    {
      id: "velocidad",
      titulo: "Velocidad de inscripción",
      valor: tieneAnalytics
        ? `${formatearNumero(
            velocidadInscripcion,
            1,
          )}/día`
        : "—",
      descripcion: tieneAnalytics
        ? "Promedio de inscripciones registradas por día."
        : "Todavía no hay datos analíticos suficientes.",
      icono: Activity,
      estado: "neutral",
    },

    {
      id: "conversion",
      titulo: "Tasa de conversión",
      valor: tieneAnalytics
        ? `${formatearNumero(
            tasaConversion,
            1,
          )}%`
        : "—",
      descripcion: tieneAnalytics
        ? "Porcentaje de visitas que terminaron en una inscripción."
        : "Todavía no hay datos analíticos suficientes.",
      icono: TrendingUp,
      estado: tieneAnalytics
        ? obtenerEstadoConversion(
            tasaConversion,
          )
        : "neutral",
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Rendimiento académico
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-[#0A3D62]">
            Resumen del curso
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Consulta la ocupación,
            disponibilidad y comportamiento de
            las inscripciones.
          </p>
        </div>

        {tieneAnalytics &&
          tieneTendencia && (
            <div
              className={cn(
                "inline-flex self-start items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold sm:self-auto",
                tendencia > 0
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : tendencia < 0
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 bg-gray-50 text-gray-600",
              )}
            >
              {tendencia > 0 ? (
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                />
              ) : tendencia < 0 ? (
                <ArrowDownRight
                  size={15}
                  aria-hidden="true"
                />
              ) : (
                <TrendingUp
                  size={15}
                  aria-hidden="true"
                />
              )}

              <span>
                {tendencia > 0 ? "+" : ""}
                {formatearNumero(
                  tendencia,
                  1,
                )}
                %
              </span>

              <span className="font-semibold opacity-70">
                tendencia general
              </span>
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((metrica) => (
          <TarjetaMetrica
            key={metrica.id}
            metrica={metrica}
          />
        ))}
      </div>

      {!tieneAnalytics && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <CircleAlert
            size={17}
            className="mt-0.5 shrink-0 text-amber-700"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="text-xs font-extrabold text-amber-800">
              Analítica pendiente
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              La velocidad de inscripción y la
              tasa de conversión aparecerán
              cuando existan suficientes visitas
              e inscripciones registradas.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function TarjetaMetrica({
  metrica,
}: {
  metrica: MetricaCurso;
}) {
  const configuracion =
    CONFIGURACION_ESTADO[
      metrica.estado
    ];

  const Icono = metrica.icono;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          configuracion.acento,
        )}
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="break-words text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-400">
              {metrica.titulo}
            </p>

            <p
              className={cn(
                "mt-3 break-words text-3xl font-extrabold leading-none tracking-tight",
                configuracion.valor,
              )}
            >
              {metrica.valor}
            </p>
          </div>

          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
              configuracion.icono,
            )}
          >
            <Icono
              size={20}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>
        </div>

        <p className="mt-3 min-h-10 break-words text-xs leading-5 text-gray-500">
          {metrica.descripcion}
        </p>

        {typeof metrica.progreso ===
          "number" && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Progreso
              </span>

              <span className="text-right text-[10px] font-extrabold text-[#0A3D62]">
                {metrica.progresoTexto}
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-gray-200"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(
                metrica.progreso,
              )}
              aria-label={
                metrica.titulo
              }
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  configuracion.progreso,
                )}
                style={{
                  width: `${metrica.progreso}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}