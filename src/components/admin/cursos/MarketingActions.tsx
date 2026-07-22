"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  Mail,
  Megaphone,
  Send,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";

import type { Curso, CursoAnalytics } from "@/types/cursos";
import { getApiErrorMessage } from "@/types/api";

interface MarketingActionsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

type EstadoEnvio = "idle" | "success" | "error";

interface DiagnosticoMarketing {
  titulo: string;
  descripcion: string;
  estado: "good" | "warning" | "critical" | "neutral";
}

const ESTILOS_DIAGNOSTICO = {
  good: {
    contenedor: "border-emerald-200 bg-emerald-50",
    icono: "bg-emerald-100 text-emerald-700",
    titulo: "text-emerald-800",
    descripcion: "text-emerald-700",
  },
  warning: {
    contenedor: "border-amber-200 bg-amber-50",
    icono: "bg-amber-100 text-amber-700",
    titulo: "text-amber-800",
    descripcion: "text-amber-700",
  },
  critical: {
    contenedor: "border-red-200 bg-red-50",
    icono: "bg-red-100 text-red-700",
    titulo: "text-red-800",
    descripcion: "text-red-700",
  },
  neutral: {
    contenedor: "border-gray-200 bg-gray-50",
    icono: "bg-white text-gray-600",
    titulo: "text-gray-800",
    descripcion: "text-gray-600",
  },
} as const;

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function numeroSeguro(valor: unknown, respaldo = 0): number {
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length > 0) {
    const numero = Number(valor);

    if (Number.isFinite(numero)) {
      return numero;
    }
  }

  return respaldo;
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

function obtenerMetricaAnalytics(
  analytics: CursoAnalytics | null,
  campo: string,
): number | null {
  const datos: unknown = analytics;

  if (!esRegistro(datos)) {
    return null;
  }

  const valor = datos[campo];

  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const numero = numeroSeguro(valor, Number.NaN);

  return Number.isFinite(numero) ? numero : null;
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

async function leerRespuesta(
  response: Response,
): Promise<unknown> {
  const texto = await response.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto) as unknown;
  } catch {
    return {
      message: texto,
    };
  }
}

function obtenerDiagnostico(
  activo: boolean,
  cupoMaximo: number,
  disponibles: number,
  ocupacion: number,
  tasaConversion: number | null,
): DiagnosticoMarketing {
  if (!activo) {
    return {
      titulo: "Curso inactivo",
      descripcion:
        "Activa el curso antes de enviar una campaña de difusión.",
      estado: "neutral",
    };
  }

  if (cupoMaximo <= 0) {
    return {
      titulo: "Capacidad no configurada",
      descripcion:
        "Define el cupo máximo antes de anunciar el curso.",
      estado: "warning",
    };
  }

  if (disponibles <= 0) {
    return {
      titulo: "Curso completo",
      descripcion:
        "No se recomienda enviar una campaña porque ya no existen lugares disponibles.",
      estado: "critical",
    };
  }

  if (ocupacion < 25) {
    return {
      titulo: "Difusión recomendada",
      descripcion:
        "La ocupación todavía es baja. Una campaña puede ayudar a aumentar el alcance del curso.",
      estado: "warning",
    };
  }

  if (
    tasaConversion !== null &&
    tasaConversion < 5
  ) {
    return {
      titulo: "Conversión por mejorar",
      descripcion:
        "El curso recibe interés, pero pocas visitas terminan en inscripción. Conviene reforzar el mensaje de la campaña.",
      estado: "warning",
    };
  }

  if (ocupacion >= 80) {
    return {
      titulo: "Últimos lugares",
      descripcion:
        "La campaña puede utilizar un mensaje de disponibilidad limitada para impulsar las inscripciones restantes.",
      estado: "good",
    };
  }

  return {
    titulo: "Campaña disponible",
    descripcion:
      "El curso cuenta con lugares disponibles y puede anunciarse a los usuarios elegibles.",
    estado: "good",
  };
}

export function MarketingActions({
  curso,
  analytics,
}: MarketingActionsProps) {
  const [sending, setSending] =
    useState(false);

  const [status, setStatus] =
    useState<EstadoEnvio>("idle");

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const cuposOcupados = Math.max(
    0,
    numeroSeguro(curso.cuposOcupados),
  );

  const cupoMaximo = Math.max(
    0,
    numeroSeguro(curso.cupoMaximo),
  );

  const disponibles = Math.max(
    0,
    cupoMaximo - cuposOcupados,
  );

  const ocupacion =
    cupoMaximo > 0
      ? (cuposOcupados / cupoMaximo) * 100
      : 0;

  const ocupacionVisual = Math.min(
    100,
    Math.max(0, ocupacion),
  );

  const cursoActivo = curso.activo ?? true;

  const tasaConversion =
    obtenerMetricaAnalytics(
      analytics,
      "tasaConversion",
    );

  const velocidadInscripcion =
    obtenerMetricaAnalytics(
      analytics,
      "velocidadInscripcion",
    );

  const diagnostico = useMemo(
    () =>
      obtenerDiagnostico(
        cursoActivo,
        cupoMaximo,
        disponibles,
        ocupacion,
        tasaConversion,
      ),
    [
      cursoActivo,
      cupoMaximo,
      disponibles,
      ocupacion,
      tasaConversion,
    ],
  );

  const estilosDiagnostico =
    ESTILOS_DIAGNOSTICO[
      diagnostico.estado
    ];

  const motivoDeshabilitado = useMemo(() => {
    if (!cursoActivo) {
      return "El curso debe estar activo para enviar la campaña.";
    }

    if (cupoMaximo <= 0) {
      return "Configura el cupo máximo antes de enviar la campaña.";
    }

    if (disponibles <= 0) {
      return "El curso ya no tiene lugares disponibles.";
    }

    return null;
  }, [
    cursoActivo,
    cupoMaximo,
    disponibles,
  ]);

  const puedeEnviar =
    motivoDeshabilitado === null &&
    !sending;

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const temporizador =
      window.setTimeout(() => {
        setStatus("idle");
        setMensaje(null);
      }, 4500);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [status]);

  const enviarNuevoCurso = async () => {
    if (!puedeEnviar) {
      return;
    }

    setSending(true);
    setStatus("idle");
    setMensaje(null);

    try {
      const response = await fetch(
        "/api/cursos/nuevo",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            cursoId: curso.idCurso,
          }),
        },
      );

      const payload =
        await leerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "No fue posible enviar la campaña.",
          ),
        );
      }

      setStatus("success");
      setMensaje(
        "La campaña del curso se envió correctamente.",
      );
    } catch (error: unknown) {
      console.error(
        "Error enviando campaña del curso:",
        error,
      );

      setStatus("error");
      setMensaje(
        error instanceof Error
          ? error.message
          : "No fue posible enviar la campaña del curso.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <Mail
                size={21}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Difusión académica
              </p>

              <h2 className="mt-1 break-words text-lg font-extrabold text-[#0A3D62]">
                Marketing del curso
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                Envía una campaña informativa
                para promover el curso y
                aumentar sus inscripciones.
              </p>
            </div>
          </div>

          {status === "success" && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2
                size={19}
                aria-hidden="true"
              />
            </span>
          )}
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DatoCurso
            icono={
              <UsersRound
                size={17}
                aria-hidden="true"
              />
            }
            titulo="Capacidad"
            valor={
              cupoMaximo > 0
                ? formatearNumero(
                    cupoMaximo,
                  )
                : "Sin definir"
            }
          />

          <DatoCurso
            icono={
              <UserCheck
                size={17}
                aria-hidden="true"
              />
            }
            titulo="Ocupados"
            valor={formatearNumero(
              cuposOcupados,
            )}
          />

          <DatoCurso
            icono={
              <Megaphone
                size={17}
                aria-hidden="true"
              />
            }
            titulo="Disponibles"
            valor={formatearNumero(
              disponibles,
            )}
            destacado={
              disponibles > 0
            }
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">
                Ocupación actual
              </p>

              <p className="mt-1 text-sm font-extrabold text-[#0A3D62]">
                {formatearNumero(
                  ocupacion,
                  1,
                )}
                %
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-500">
              {formatearNumero(
                cuposOcupados,
              )}{" "}
              de{" "}
              {cupoMaximo > 0
                ? formatearNumero(
                    cupoMaximo,
                  )
                : "—"}{" "}
              lugares
            </p>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              ocupacionVisual,
            )}
            aria-label="Ocupación del curso"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                ocupacion >= 100
                  ? "bg-red-500"
                  : ocupacion >= 80
                    ? "bg-amber-500"
                    : "bg-[#0A3D62]",
              )}
              style={{
                width: `${ocupacionVisual}%`,
              }}
            />
          </div>

          {(tasaConversion !== null ||
            velocidadInscripcion !== null) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
              {tasaConversion !== null && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600">
                  <TrendingUp
                    size={13}
                    className="text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  Conversión:{" "}
                  {formatearNumero(
                    tasaConversion,
                    1,
                  )}
                  %
                </span>
              )}

              {velocidadInscripcion !==
                null && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600">
                  <UserCheck
                    size={13}
                    className="text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  {formatearNumero(
                    velocidadInscripcion,
                    1,
                  )}{" "}
                  inscripciones/día
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4",
            estilosDiagnostico.contenedor,
          )}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                estilosDiagnostico.icono,
              )}
            >
              <Megaphone
                size={18}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-extrabold",
                  estilosDiagnostico.titulo,
                )}
              >
                {diagnostico.titulo}
              </p>

              <p
                className={cn(
                  "mt-1 break-words text-xs leading-5",
                  estilosDiagnostico.descripcion,
                )}
              >
                {diagnostico.descripcion}
              </p>
            </div>
          </div>
        </div>

        {mensaje && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3",
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700",
            )}
          >
            {status === "success" ? (
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <CircleAlert
                size={17}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
            )}

            <p className="min-w-0 flex-1 break-words text-xs font-semibold leading-5">
              {mensaje}
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => {
              void enviarNuevoCurso();
            }}
            disabled={!puedeEnviar}
            aria-busy={sending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          >
            {sending ? (
              <Loader2
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Send
                size={17}
                aria-hidden="true"
              />
            )}

            {sending
              ? "Enviando campaña..."
              : "Anunciar curso"}
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
            {motivoDeshabilitado ??
              "La campaña será enviada a los usuarios elegibles configurados por el sistema."}
          </p>
        </div>
      </div>
    </section>
  );
}

function DatoCurso({
  icono,
  titulo,
  valor,
  destacado = false,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border p-3",
        destacado
          ? "border-[#FFC300]/40 bg-[#FFF9E6]"
          : "border-gray-200 bg-[#F8FAFC]",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          destacado
            ? "bg-[#FFC300] text-[#0A3D62]"
            : "bg-white text-[#0A3D62] shadow-sm",
        )}
      >
        {icono}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          {titulo}
        </p>

        <p
          className={cn(
            "mt-1 break-words text-base font-extrabold",
            destacado
              ? "text-[#0A3D62]"
              : "text-gray-800",
          )}
        >
          {valor}
        </p>
      </div>
    </article>
  );
}