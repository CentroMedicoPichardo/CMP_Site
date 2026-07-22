"use client";

import {
  Activity,
  BookOpen,
  Clock3,
  CreditCard,
  DatabaseBackup,
  FileClock,
  ShieldCheck,
  Ticket,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { ActividadDashboard } from "@/types/dashboard-admin";

interface ActividadRecienteProps {
  actividades: ActividadDashboard[];
}

interface ConfiguracionActividad {
  Icono: LucideIcon;
  icono: string;
  etiqueta: string;
  etiquetaClase: string;
  indicador: string;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: string | null | undefined,
  respaldo: string,
): string {
  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    return valor.trim();
  }

  return respaldo;
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return textoSeguro(valor, "")
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerConfiguracion(
  actividad: ActividadDashboard,
): ConfiguracionActividad {
  const contenido = normalizarTexto(
    [
      actividad.modulo,
      actividad.accion,
      actividad.aplicacionOrigen,
    ].join(" "),
  );

  if (
    contenido.includes("usuario") ||
    contenido.includes("cuenta") ||
    contenido.includes("perfil")
  ) {
    return {
      Icono: UserRound,
      icono:
        "border-blue-200 bg-blue-50 text-blue-700",
      etiqueta: "Usuarios",
      etiquetaClase:
        "bg-blue-50 text-blue-700",
      indicador: "bg-blue-500",
    };
  }

  if (
    contenido.includes("curso") ||
    contenido.includes("academia")
  ) {
    return {
      Icono: BookOpen,
      icono:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      etiqueta: "Cursos",
      etiquetaClase:
        "bg-emerald-50 text-emerald-700",
      indicador: "bg-emerald-500",
    };
  }

  if (
    contenido.includes("inscripcion") ||
    contenido.includes("participante")
  ) {
    return {
      Icono: Ticket,
      icono:
        "border-violet-200 bg-violet-50 text-violet-700",
      etiqueta: "Inscripciones",
      etiquetaClase:
        "bg-violet-50 text-violet-700",
      indicador: "bg-violet-500",
    };
  }

  if (
    contenido.includes("pago") ||
    contenido.includes("compra") ||
    contenido.includes("ingreso")
  ) {
    return {
      Icono: CreditCard,
      icono:
        "border-amber-200 bg-amber-50 text-amber-700",
      etiqueta: "Pagos",
      etiquetaClase:
        "bg-amber-50 text-amber-700",
      indicador: "bg-amber-500",
    };
  }

  if (
    contenido.includes("seguridad") ||
    contenido.includes("sesion") ||
    contenido.includes("login") ||
    contenido.includes("acceso") ||
    contenido.includes("autentic")
  ) {
    return {
      Icono: ShieldCheck,
      icono:
        "border-red-200 bg-red-50 text-red-700",
      etiqueta: "Seguridad",
      etiquetaClase:
        "bg-red-50 text-red-700",
      indicador: "bg-red-500",
    };
  }

  if (
    contenido.includes("backup") ||
    contenido.includes("respaldo") ||
    contenido.includes("base de datos")
  ) {
    return {
      Icono: DatabaseBackup,
      icono:
        "border-cyan-200 bg-cyan-50 text-cyan-700",
      etiqueta: "Respaldos",
      etiquetaClase:
        "bg-cyan-50 text-cyan-700",
      indicador: "bg-cyan-500",
    };
  }

  if (
    contenido.includes("auditoria") ||
    contenido.includes("registro")
  ) {
    return {
      Icono: FileClock,
      icono:
        "border-slate-200 bg-slate-50 text-slate-700",
      etiqueta: "Auditoría",
      etiquetaClase:
        "bg-slate-100 text-slate-700",
      indicador: "bg-slate-500",
    };
  }

  return {
    Icono: Activity,
    icono:
      "border-gray-200 bg-gray-50 text-gray-600",
    etiqueta: textoSeguro(
      actividad.modulo,
      "Sistema",
    ),
    etiquetaClase:
      "bg-gray-100 text-gray-600",
    indicador: "bg-gray-400",
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

function formatearFechaRelativa(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Fecha no disponible";
  }

  const diferencia =
    valor.getTime() - Date.now();

  const minutos = Math.round(
    diferencia / 60_000,
  );

  if (Math.abs(minutos) < 1) {
    return "Ahora";
  }

  const formateador =
    new Intl.RelativeTimeFormat(
      "es-MX",
      {
        numeric: "auto",
      },
    );

  if (Math.abs(minutos) < 60) {
    return formateador.format(
      minutos,
      "minute",
    );
  }

  const horas = Math.round(
    minutos / 60,
  );

  if (Math.abs(horas) < 24) {
    return formateador.format(
      horas,
      "hour",
    );
  }

  const dias = Math.round(
    horas / 24,
  );

  if (Math.abs(dias) < 30) {
    return formateador.format(
      dias,
      "day",
    );
  }

  const meses = Math.round(
    dias / 30,
  );

  if (Math.abs(meses) < 12) {
    return formateador.format(
      meses,
      "month",
    );
  }

  const anios = Math.round(
    dias / 365,
  );

  return formateador.format(
    anios,
    "year",
  );
}

function formatearFechaCompleta(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Fecha no disponible";
  }

  return valor.toLocaleString(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatearAccion(
  accion: string,
): string {
  const valor = textoSeguro(
    accion,
    "Acción no especificada",
  );

  return (
    valor.charAt(0).toUpperCase() +
    valor.slice(1)
  );
}

export function ActividadReciente({
  actividades,
}: ActividadRecienteProps) {
  const actividadesSeguras =
    Array.isArray(actividades)
      ? actividades
      : [];

  const activarScroll =
    actividadesSeguras.length > 4;

  const usuariosUnicos =
    new Set(
      actividadesSeguras
        .map((actividad) =>
          textoSeguro(
            actividad.usuario,
            "",
          ).toLocaleLowerCase(
            "es-MX",
          ),
        )
        .filter(Boolean),
    ).size;

  return (
    <section className="flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Activity
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Actividad reciente
              </h2>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                {actividadesSeguras.length}{" "}
                {actividadesSeguras.length === 1
                  ? "registro"
                  : "registros"}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-gray-500">
              Acciones registradas por el sistema
            </p>
          </div>
        </div>

        {usuariosUnicos > 0 && (
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#EAF2F8] px-2.5 py-1 text-[10px] font-extrabold text-[#0A3D62] sm:inline-flex">
            <UserRound
              size={12}
              aria-hidden="true"
            />

            {usuariosUnicos}{" "}
            {usuariosUnicos === 1
              ? "usuario"
              : "usuarios"}
          </span>
        )}
      </header>

      {actividadesSeguras.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <Activity
                size={23}
                aria-hidden="true"
              />
            </span>

            <p className="mt-3 text-sm font-bold text-gray-700">
              No hay actividad registrada
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Las acciones recientes aparecerán en
              esta sección.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex-1 space-y-3 p-5",
              activarScroll &&
                "max-h-[610px] overflow-y-auto overscroll-contain pr-3",
            )}
            style={
              activarScroll
                ? {
                    scrollbarGutter:
                      "stable",
                  }
                : undefined
            }
            aria-label="Listado de actividad reciente"
          >
            {actividadesSeguras.map(
              (actividad) => {
                const configuracion =
                  obtenerConfiguracion(
                    actividad,
                  );

                const Icono =
                  configuracion.Icono;

                return (
                  <article
                    key={actividad.id}
                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 pl-5 transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={cn(
                        "absolute bottom-3 left-0 top-3 w-1 rounded-r-full",
                        configuracion.indicador,
                      )}
                      aria-hidden="true"
                    />

                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                          configuracion.icono,
                        )}
                      >
                        <Icono
                          size={18}
                          strokeWidth={1.9}
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-extrabold text-gray-800">
                              {formatearAccion(
                                actividad.accion,
                              )}
                            </h3>

                            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                              <UserRound
                                size={12}
                                className="shrink-0"
                                aria-hidden="true"
                              />

                              <span className="truncate font-semibold text-gray-700">
                                {textoSeguro(
                                  actividad.usuario,
                                  "Sistema",
                                )}
                              </span>
                            </p>
                          </div>

                          <div
                            className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-gray-400"
                            title={formatearFechaCompleta(
                              actividad.fecha,
                            )}
                          >
                            <Clock3
                              size={11}
                              aria-hidden="true"
                            />

                            {formatearFechaRelativa(
                              actividad.fecha,
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                              configuracion.etiquetaClase,
                            )}
                          >
                            {configuracion.etiqueta}
                          </span>

                          {actividad.registroId !==
                            null && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500">
                              Registro #
                              {actividad.registroId}
                            </span>
                          )}

                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500">
                            {textoSeguro(
                              actividad.aplicacionOrigen,
                              "CMP",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <footer className="flex min-h-[46px] flex-wrap items-center gap-3 border-t border-gray-100 px-5 py-3 text-[10px] font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />

              {actividadesSeguras.length} acciones
              mostradas
            </span>

            {activarScroll && (
              <span className="ml-auto text-gray-400">
                Desplázate para ver más
              </span>
            )}
          </footer>
        </>
      )}
    </section>
  );
}