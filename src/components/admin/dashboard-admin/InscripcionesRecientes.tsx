"use client";

import {
  BadgeCheck,
  Ban,
  BookOpen,
  CalendarDays,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Mail,
  Ticket,
  UserRound,
  WalletCards,
} from "lucide-react";

import type { InscripcionDashboard } from "@/types/dashboard-admin";

interface InscripcionesRecientesProps {
  inscripciones: InscripcionDashboard[];
}

interface EstadoVisual {
  etiqueta: string;
  clases: string;
  Icono:
    | typeof BadgeCheck
    | typeof Clock3
    | typeof Ban
    | typeof CircleAlert;
}

const FORMATEADOR_MONEDA =
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function numeroSeguro(
  valor: number | null | undefined,
): number {
  return typeof valor === "number" &&
    Number.isFinite(valor)
    ? valor
    : 0;
}

function textoSeguro(
  valor: string | null | undefined,
  respaldo: string,
): string {
  if (
    typeof valor === "string" &&
    valor.trim()
  ) {
    return valor.trim();
  }

  return respaldo;
}

function formatearMoneda(
  valor: number | null | undefined,
): string {
  return FORMATEADOR_MONEDA.format(
    numeroSeguro(valor),
  );
}

function formatearFecha(
  fecha: string | null | undefined,
): string {
  if (!fecha) {
    return "Fecha no disponible";
  }

  const fechaNormalizada =
    fecha.length === 10
      ? `${fecha}T00:00:00`
      : fecha;

  const valor = new Date(
    fechaNormalizada,
  );

  if (Number.isNaN(valor.getTime())) {
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

function normalizarEstado(
  estado: string,
): string {
  return estado
    .trim()
    .toLocaleLowerCase("es-MX");
}

function obtenerEstadoVisual(
  estado: string,
): EstadoVisual {
  const valor =
    normalizarEstado(estado);

  if (
    [
      "activo",
      "activa",
      "confirmado",
      "confirmada",
      "aprobado",
      "aprobada",
    ].includes(valor)
  ) {
    return {
      etiqueta:
        valor === "confirmado" ||
        valor === "confirmada"
          ? "Confirmada"
          : "Activa",
      clases:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      Icono: BadgeCheck,
    };
  }

  if (
    [
      "cancelado",
      "cancelada",
      "rechazado",
      "rechazada",
    ].includes(valor)
  ) {
    return {
      etiqueta: valor.includes(
        "rechaz",
      )
        ? "Rechazada"
        : "Cancelada",
      clases:
        "border-red-200 bg-red-50 text-red-700",
      Icono: Ban,
    };
  }

  if (
    [
      "finalizado",
      "finalizada",
      "completado",
      "completada",
    ].includes(valor)
  ) {
    return {
      etiqueta: "Finalizada",
      clases:
        "border-blue-200 bg-blue-50 text-blue-700",
      Icono: BadgeCheck,
    };
  }

  if (
    [
      "pendiente",
      "reportado",
      "reportada",
      "en revisión",
      "en revision",
    ].includes(valor)
  ) {
    return {
      etiqueta: "Pendiente",
      clases:
        "border-amber-200 bg-amber-50 text-amber-700",
      Icono: Clock3,
    };
  }

  return {
    etiqueta:
      estado.trim() || "Sin estado",
    clases:
      "border-gray-200 bg-gray-100 text-gray-600",
    Icono: CircleAlert,
  };
}

export function InscripcionesRecientes({
  inscripciones,
}: InscripcionesRecientesProps) {
  const inscripcionesSeguras =
    Array.isArray(inscripciones)
      ? inscripciones
      : [];

  const totalInscripciones =
    inscripcionesSeguras.length;

  const totalConfirmadas =
    inscripcionesSeguras.filter(
      (inscripcion) => {
        const estado =
          normalizarEstado(
            inscripcion.estado,
          );

        return [
          "activo",
          "activa",
          "confirmado",
          "confirmada",
          "aprobado",
          "aprobada",
        ].includes(estado);
      },
    ).length;

  const montoMostrado =
    inscripcionesSeguras.reduce(
      (acumulado, inscripcion) =>
        acumulado +
        numeroSeguro(
          inscripcion.montoPagado,
        ),
      0,
    );

  const activarScroll =
    totalInscripciones > 4;

  return (
    <section className="flex h-full min-h-[540px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[88px] flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Ticket
              size={20}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Inscripciones recientes
              </h2>

              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                {totalInscripciones}{" "}
                {totalInscripciones === 1
                  ? "mostrada"
                  : "mostradas"}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Participantes y estado de sus
              inscripciones
            </p>
          </div>
        </div>

        {totalInscripciones > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck
                size={14}
                className="text-emerald-600"
                aria-hidden="true"
              />

              {totalConfirmadas} confirmadas
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CircleDollarSign
                size={14}
                className="text-[#0A3D62]"
                aria-hidden="true"
              />

              {formatearMoneda(
                montoMostrado,
              )}
            </span>
          </div>
        )}
      </header>

      {totalInscripciones === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <Ticket
                size={24}
                aria-hidden="true"
              />
            </span>

            <p className="mt-3 text-base font-bold text-gray-700">
              No hay inscripciones recientes
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Las nuevas inscripciones
              aparecerán en esta sección.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 space-y-3 p-5",
            activarScroll &&
              "max-h-[720px] overflow-y-auto overscroll-contain pr-3",
          )}
          style={
            activarScroll
              ? {
                  scrollbarGutter:
                    "stable",
                }
              : undefined
          }
          aria-label="Listado de inscripciones recientes"
        >
          {inscripcionesSeguras.map(
            (inscripcion) => {
              const estadoVisual =
                obtenerEstadoVisual(
                  inscripcion.estado,
                );

              const IconoEstado =
                estadoVisual.Icono;

              return (
                <article
                  key={inscripcion.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-[#0A3D62]/20 hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                      <BookOpen
                        size={19}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="truncate text-base font-extrabold text-[#0A3D62]"
                            title={
                              inscripcion.curso
                            }
                          >
                            {textoSeguro(
                              inscripcion.curso,
                              "Curso no disponible",
                            )}
                          </h3>

                          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <UserRound
                                size={14}
                                className="shrink-0"
                                aria-hidden="true"
                              />

                              <span className="truncate font-semibold text-gray-700">
                                {textoSeguro(
                                  inscripcion.usuario,
                                  "Participante",
                                )}
                              </span>
                            </span>

                            {inscripcion.correo && (
                              <span className="inline-flex min-w-0 items-center gap-1.5">
                                <Mail
                                  size={14}
                                  className="shrink-0"
                                  aria-hidden="true"
                                />

                                <span className="truncate">
                                  {
                                    inscripcion.correo
                                  }
                                </span>
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={14}
                                aria-hidden="true"
                              />

                              {formatearFecha(
                                inscripcion.fecha,
                              )}
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
                            estadoVisual.clases,
                          )}
                        >
                          <IconoEstado
                            size={13}
                            aria-hidden="true"
                          />

                          {
                            estadoVisual.etiqueta
                          }
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                            Monto pagado
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-gray-800">
                            <CircleDollarSign
                              size={15}
                              aria-hidden="true"
                            />

                            {formatearMoneda(
                              inscripcion.montoPagado,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                            Método de pago
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-gray-700">
                            <WalletCards
                              size={15}
                              aria-hidden="true"
                            />

                            {textoSeguro(
                              inscripcion.metodoPago,
                              "No especificado",
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                            Origen
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-700">
                            {textoSeguro(
                              inscripcion.origenInscripcion,
                              "No especificado",
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                            Confirmación
                          </p>

                          {inscripcion.fechaConfirmacion ? (
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                              <BadgeCheck
                                size={15}
                                aria-hidden="true"
                              />

                              {formatearFecha(
                                inscripcion.fechaConfirmacion,
                              )}
                            </p>
                          ) : (
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-amber-700">
                              <Clock3
                                size={15}
                                aria-hidden="true"
                              />

                              Pendiente
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}