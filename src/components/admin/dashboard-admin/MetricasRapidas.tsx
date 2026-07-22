"use client";

import {
  BadgeCheck,
  Ban,
  BookOpenCheck,
  CircleDollarSign,
  CircleMinus,
  CircleX,
  Clock3,
  DatabaseBackup,
  Gauge,
  LockKeyhole,
  MessageCircleQuestion,
  ShieldAlert,
  TicketCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  DashboardStats,
  MetricasRapidasDashboard,
  TendenciaDashboard,
  TendenciasDashboard,
} from "@/types/dashboard-admin";

interface MetricasRapidasProps {
  stats?: DashboardStats;
  metricas?: MetricasRapidasDashboard;
  tendencias?: TendenciasDashboard;
}

type TonoMetrica =
  | "azul"
  | "verde"
  | "ambar"
  | "rojo"
  | "violeta"
  | "gris";

interface ResumenPrincipal {
  id: string;
  titulo: string;
  valor: string;
  descripcion: string;
  Icono: LucideIcon;
  tono: TonoMetrica;
  porcentaje?: number;
  tendencia?: TendenciaDashboard;
}

interface IndicadorOperativo {
  id: string;
  titulo: string;
  descripcion: string;
  valor: number;
  Icono: LucideIcon;
  tono: TonoMetrica;
}

interface ResumenFinanciero {
  id: string;
  titulo: string;
  valor: number;
  descripcion: string;
  Icono: LucideIcon;
  tono: TonoMetrica;
}

const FORMATEADOR_NUMERO =
  new Intl.NumberFormat("es-MX");

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

function enteroSeguro(
  valor: number | null | undefined,
): number {
  return Math.max(
    0,
    Math.trunc(numeroSeguro(valor)),
  );
}

function limitarPorcentaje(
  valor: number | null | undefined,
): number {
  return Math.min(
    100,
    Math.max(0, numeroSeguro(valor)),
  );
}

function calcularPorcentaje(
  cantidad: number | undefined,
  total: number | undefined,
): number {
  const cantidadSegura =
    numeroSeguro(cantidad);

  const totalSeguro =
    numeroSeguro(total);

  if (totalSeguro <= 0) {
    return 0;
  }

  return limitarPorcentaje(
    (cantidadSegura / totalSeguro) * 100,
  );
}

function formatearNumero(
  valor: number | null | undefined,
): string {
  return FORMATEADOR_NUMERO.format(
    enteroSeguro(valor),
  );
}

function formatearMoneda(
  valor: number | null | undefined,
): string {
  return FORMATEADOR_MONEDA.format(
    numeroSeguro(valor),
  );
}

function formatearPorcentaje(
  valor: number | null | undefined,
): string {
  return `${limitarPorcentaje(
    valor,
  ).toLocaleString("es-MX", {
    maximumFractionDigits: 1,
  })}%`;
}

function obtenerClasesTono(
  tono: TonoMetrica,
): {
  icono: string;
  barra: string;
  valor: string;
  borde: string;
} {
  if (tono === "verde") {
    return {
      icono:
        "bg-emerald-50 text-emerald-700",
      barra: "bg-emerald-500",
      valor: "text-emerald-700",
      borde: "border-emerald-100",
    };
  }

  if (tono === "ambar") {
    return {
      icono:
        "bg-amber-50 text-amber-700",
      barra: "bg-amber-500",
      valor: "text-amber-700",
      borde: "border-amber-100",
    };
  }

  if (tono === "rojo") {
    return {
      icono: "bg-red-50 text-red-700",
      barra: "bg-red-500",
      valor: "text-red-700",
      borde: "border-red-100",
    };
  }

  if (tono === "violeta") {
    return {
      icono:
        "bg-violet-50 text-violet-700",
      barra: "bg-violet-500",
      valor: "text-violet-700",
      borde: "border-violet-100",
    };
  }

  if (tono === "gris") {
    return {
      icono: "bg-gray-100 text-gray-600",
      barra: "bg-gray-400",
      valor: "text-gray-700",
      borde: "border-gray-200",
    };
  }

  return {
    icono: "bg-blue-50 text-blue-700",
    barra: "bg-blue-500",
    valor: "text-blue-700",
    borde: "border-blue-100",
  };
}

function obtenerTextoTendencia(
  tendencia: TendenciaDashboard,
): string {
  const porcentaje = Math.abs(
    numeroSeguro(tendencia.porcentaje),
  ).toLocaleString("es-MX", {
    maximumFractionDigits: 1,
  });

  if (tendencia.direccion === "igual") {
    return "Sin cambios";
  }

  return `${porcentaje}% frente al periodo anterior`;
}

function IndicadorTendencia({
  tendencia,
}: {
  tendencia?: TendenciaDashboard;
}) {
  if (!tendencia) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400">
        <CircleMinus
          size={11}
          aria-hidden="true"
        />

        Sin comparación
      </span>
    );
  }

  if (tendencia.direccion === "sube") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
        <TrendingUp
          size={11}
          aria-hidden="true"
        />

        {obtenerTextoTendencia(
          tendencia,
        )}
      </span>
    );
  }

  if (tendencia.direccion === "baja") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
        <TrendingDown
          size={11}
          aria-hidden="true"
        />

        {obtenerTextoTendencia(
          tendencia,
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500">
      <CircleMinus
        size={11}
        aria-hidden="true"
      />

      {obtenerTextoTendencia(
        tendencia,
      )}
    </span>
  );
}

function obtenerEstadoIndicador(
  indicador: IndicadorOperativo,
): {
  contenedor: string;
  icono: string;
  valor: string;
} {
  const clases =
    obtenerClasesTono(indicador.tono);

  if (indicador.valor === 0) {
    return {
      contenedor:
        "border-gray-200 bg-gray-50",
      icono:
        "bg-white text-emerald-600",
      valor: "text-emerald-700",
    };
  }

  return {
    contenedor: cn(
      "bg-white",
      clases.borde,
    ),
    icono: clases.icono,
    valor: clases.valor,
  };
}

export function MetricasRapidas({
  stats,
  metricas,
  tendencias,
}: MetricasRapidasProps) {
  const tasaOcupacion =
    limitarPorcentaje(
      stats?.tasaOcupacion,
    );

  const porcentajeCuentasActivas =
    calcularPorcentaje(
      stats?.cuentasActivas,
      stats?.totalUsuarios,
    );

  const porcentajeInscripcionesActivas =
    calcularPorcentaje(
      stats?.inscripcionesActivas,
      stats?.totalInscripciones,
    );

  const pagosPorValidar =
    enteroSeguro(
      metricas?.pagosPorValidar ??
        stats?.pagosPendientes,
    );

  const resumenPrincipal: ResumenPrincipal[] =
    [
      {
        id: "ocupacion",
        titulo: "Ocupación general",
        valor:
          formatearPorcentaje(
            tasaOcupacion,
          ),
        descripcion:
          "Cupos ocupados en cursos activos",
        Icono: Gauge,
        tono:
          tasaOcupacion >= 80
            ? "ambar"
            : tasaOcupacion >= 40
              ? "azul"
              : "verde",
        porcentaje: tasaOcupacion,
      },
      {
        id: "cuentas-activas",
        titulo: "Cuentas activas",
        valor: formatearNumero(
          stats?.cuentasActivas,
        ),
        descripcion: `${formatearNumero(
          stats?.totalUsuarios,
        )} usuarios registrados`,
        Icono: UserCheck,
        tono: "azul",
        porcentaje:
          porcentajeCuentasActivas,
        tendencia:
          tendencias?.usuariosNuevos,
      },
      {
        id: "inscripciones-activas",
        titulo: "Inscripciones activas",
        valor: formatearNumero(
          stats?.inscripcionesActivas,
        ),
        descripcion: `${formatearNumero(
          stats?.totalInscripciones,
        )} inscripciones totales`,
        Icono: TicketCheck,
        tono: "violeta",
        porcentaje:
          porcentajeInscripcionesActivas,
        tendencia:
          tendencias?.inscripciones,
      },
      {
        id: "ingresos-periodo",
        titulo: "Ingresos del periodo",
        valor: formatearMoneda(
          stats?.ingresosPeriodo,
        ),
        descripcion:
          "Pagos aprobados en el periodo",
        Icono: CircleDollarSign,
        tono: "verde",
        tendencia:
          tendencias?.ingresos,
      },
    ];

  const indicadoresOperativos: IndicadorOperativo[] =
    [
      {
        id: "pagos-validar",
        titulo: "Pagos por validar",
        descripcion:
          "Reportados o en revisión",
        valor: pagosPorValidar,
        Icono: Clock3,
        tono: "ambar",
      },
      {
        id: "preguntas-pendientes",
        titulo: "Preguntas pendientes",
        descripcion:
          "Consultas sin atender",
        valor: enteroSeguro(
          metricas?.preguntasPendientes ??
            stats?.preguntasPendientes,
        ),
        Icono: MessageCircleQuestion,
        tono: "azul",
      },
      {
        id: "preguntas-urgentes",
        titulo: "Preguntas urgentes",
        descripcion:
          "Requieren atención inmediata",
        valor: enteroSeguro(
          metricas?.preguntasUrgentes,
        ),
        Icono: ShieldAlert,
        tono: "rojo",
      },
      {
        id: "baja-ocupacion",
        titulo: "Baja ocupación",
        descripcion:
          "Cursos próximos bajo el 40%",
        valor: enteroSeguro(
          metricas?.cursosBajaOcupacion,
        ),
        Icono: BookOpenCheck,
        tono: "ambar",
      },
      {
        id: "cupo-completo",
        titulo: "Cupo completo",
        descripcion:
          "Cursos sin lugares disponibles",
        valor: enteroSeguro(
          metricas?.cursosCupoCompleto,
        ),
        Icono: Users,
        tono: "violeta",
      },
      {
        id: "cuentas-bloqueadas",
        titulo: "Cuentas bloqueadas",
        descripcion:
          "Bloqueos temporales vigentes",
        valor: enteroSeguro(
          metricas?.cuentasBloqueadas,
        ),
        Icono: LockKeyhole,
        tono: "rojo",
      },
      {
        id: "respaldos-fallidos",
        titulo: "Respaldos fallidos",
        descripcion:
          "Errores en los últimos 7 días",
        valor: enteroSeguro(
          metricas?.respaldosFallidos,
        ),
        Icono: DatabaseBackup,
        tono: "rojo",
      },
    ];

  const resumenFinanciero: ResumenFinanciero[] =
    [
      {
        id: "reportado",
        titulo: "Monto reportado",
        valor:
          stats?.montoReportado ??
          metricas?.montoReportado ??
          0,
        descripcion:
          "Aprobado y pendiente de revisión",
        Icono: CircleDollarSign,
        tono: "azul",
      },
      {
        id: "aprobado",
        titulo: "Monto aprobado",
        valor:
          stats?.ingresosTotales ?? 0,
        descripcion: `${formatearNumero(
          stats?.pagosAprobados,
        )} pagos aprobados`,
        Icono: BadgeCheck,
        tono: "verde",
      },
      {
        id: "por-revisar",
        titulo: "Monto por revisar",
        valor:
          stats?.montoPorRevisar ??
          metricas?.montoPorRevisar ??
          0,
        descripcion: `${formatearNumero(
          pagosPorValidar,
        )} pagos pendientes`,
        Icono: Clock3,
        tono: "ambar",
      },
      {
        id: "rechazado",
        titulo: "Monto rechazado",
        valor:
          stats?.montoRechazado ??
          metricas?.montoRechazado ??
          0,
        descripcion: `${formatearNumero(
          stats?.pagosRechazados,
        )} pagos rechazados`,
        Icono: CircleX,
        tono: "rojo",
      },
      {
        id: "cancelado",
        titulo: "Monto cancelado",
        valor:
          stats?.montoCancelado ??
          metricas?.montoCancelado ??
          0,
        descripcion: `${formatearNumero(
          stats?.pagosCancelados,
        )} pagos cancelados`,
        Icono: Ban,
        tono: "gris",
      },
    ];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Gauge
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-[#0A3D62]">
              Métricas rápidas
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Resumen operativo y financiero
            </p>
          </div>
        </div>

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
          Datos actuales
        </span>
      </header>

      <div className="space-y-6 p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {resumenPrincipal.map(
            (resumen) => {
              const clases =
                obtenerClasesTono(
                  resumen.tono,
                );

              const Icono =
                resumen.Icono;

              return (
                <article
                  key={resumen.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-[#0A3D62]/20 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-500">
                        {resumen.titulo}
                      </p>

                      <p
                        className={cn(
                          "mt-1 truncate text-xl font-extrabold",
                          clases.valor,
                        )}
                        title={resumen.valor}
                      >
                        {resumen.valor}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        clases.icono,
                      )}
                    >
                      <Icono
                        size={17}
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-500">
                    {resumen.descripcion}
                  </p>

                  {typeof resumen.porcentaje ===
                    "number" && (
                    <div className="mt-3">
                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-gray-100"
                        role="progressbar"
                        aria-label={
                          resumen.titulo
                        }
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={
                          resumen.porcentaje
                        }
                      >
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            clases.barra,
                          )}
                          style={{
                            width: `${limitarPorcentaje(
                              resumen.porcentaje,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {resumen.tendencia && (
                    <div className="mt-3">
                      <IndicadorTendencia
                        tendencia={
                          resumen.tendencia
                        }
                      />
                    </div>
                  )}
                </article>
              );
            },
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0A3D62]">
                Indicadores operativos
              </h3>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Pendientes y situaciones que
                requieren seguimiento
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {indicadoresOperativos.map(
              (indicador) => {
                const estado =
                  obtenerEstadoIndicador(
                    indicador,
                  );

                const Icono =
                  indicador.Icono;

                return (
                  <article
                    key={indicador.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-3",
                      estado.contenedor,
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        estado.icono,
                      )}
                    >
                      <Icono
                        size={16}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-xs font-bold text-gray-700">
                          {indicador.titulo}
                        </p>

                        <span
                          className={cn(
                            "shrink-0 text-base font-extrabold",
                            estado.valor,
                          )}
                        >
                          {formatearNumero(
                            indicador.valor,
                          )}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-gray-500">
                        {indicador.valor === 0
                          ? "Sin pendientes"
                          : indicador.descripcion}
                      </p>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-extrabold text-[#0A3D62]">
              Resumen financiero
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Distribución de montos por estado de
              pago
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {resumenFinanciero.map(
              (financiero) => {
                const clases =
                  obtenerClasesTono(
                    financiero.tono,
                  );

                const Icono =
                  financiero.Icono;

                return (
                  <article
                    key={financiero.id}
                    className={cn(
                      "rounded-xl border bg-white p-3",
                      clases.borde,
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          clases.icono,
                        )}
                      >
                        <Icono
                          size={15}
                          aria-hidden="true"
                        />
                      </span>

                      <p className="text-[11px] font-bold text-gray-500">
                        {financiero.titulo}
                      </p>
                    </div>

                    <p
                      className={cn(
                        "mt-3 truncate text-lg font-extrabold",
                        clases.valor,
                      )}
                      title={formatearMoneda(
                        financiero.valor,
                      )}
                    >
                      {formatearMoneda(
                        financiero.valor,
                      )}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-gray-500">
                      {financiero.descripcion}
                    </p>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}