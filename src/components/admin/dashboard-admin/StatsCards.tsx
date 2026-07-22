"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Ban,
  BadgeCheck,
  BookOpen,
  CircleMinus,
  CircleX,
  Clock3,
  Ticket,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type {
  DashboardStats,
  TendenciaDashboard,
  TendenciasDashboard,
} from "@/types/dashboard-admin";

interface StatsCardsProps {
  stats?: DashboardStats;
  tendencias?: TendenciasDashboard;
}

interface StatCard {
  id: string;
  titulo: string;
  valor: string;
  descripcion: string;
  icono: LucideIcon;
  estiloIcono: string;
  tendencia?: TendenciaDashboard;
}

const FORMATEADOR_NUMERO =
  new Intl.NumberFormat("es-MX");

const FORMATEADOR_MONEDA =
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function numeroSeguro(
  valor: number | undefined,
): number {
  return typeof valor === "number" &&
    Number.isFinite(valor)
    ? valor
    : 0;
}

function formatearNumero(
  valor: number | undefined,
): string {
  return FORMATEADOR_NUMERO.format(
    numeroSeguro(valor),
  );
}

function formatearMoneda(
  valor: number | undefined,
): string {
  return FORMATEADOR_MONEDA.format(
    numeroSeguro(valor),
  );
}

function obtenerTextoTendencia(
  tendencia: TendenciaDashboard,
): string {
  const porcentaje = Math.abs(
    tendencia.porcentaje,
  ).toLocaleString("es-MX", {
    maximumFractionDigits: 1,
  });

  if (tendencia.direccion === "igual") {
    return "Sin cambios frente al periodo anterior";
  }

  return `${porcentaje}% frente al periodo anterior`;
}

function Tendencia({
  tendencia,
}: {
  tendencia?: TendenciaDashboard;
}) {
  if (!tendencia) {
    return (
      <span className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
        <CircleMinus
          size={14}
          aria-hidden="true"
        />

        Dato acumulado
      </span>
    );
  }

  if (tendencia.direccion === "sube") {
    return (
      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <ArrowUpRight
          size={14}
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
      <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
        <ArrowDownRight
          size={14}
          aria-hidden="true"
        />

        {obtenerTextoTendencia(
          tendencia,
        )}
      </span>
    );
  }

  return (
    <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
      <CircleMinus
        size={14}
        aria-hidden="true"
      />

      {obtenerTextoTendencia(
        tendencia,
      )}
    </span>
  );
}

export function StatsCards({
  stats,
  tendencias,
}: StatsCardsProps) {
  const pagosPendientes =
    numeroSeguro(
      stats?.pagosReportados,
    ) +
    numeroSeguro(
      stats?.pagosEnRevision,
    );

  const cards: StatCard[] = [
    {
      id: "usuarios",
      titulo: "Usuarios totales",
      valor: formatearNumero(
        stats?.totalUsuarios,
      ),
      descripcion: `${formatearNumero(
        stats?.usuariosNuevosPeriodo ??
          stats?.usuariosNuevosMes,
      )} nuevos en el periodo`,
      icono: Users,
      estiloIcono:
        "bg-blue-50 text-blue-700",
      tendencia:
        tendencias?.usuariosNuevos,
    },
    {
      id: "cursos",
      titulo: "Cursos activos",
      valor: formatearNumero(
        stats?.cursosActivos,
      ),
      descripcion: `${formatearNumero(
        stats?.totalCursos,
      )} cursos registrados`,
      icono: BookOpen,
      estiloIcono:
        "bg-emerald-50 text-emerald-700",
    },
    {
      id: "inscripciones",
      titulo: "Inscripciones",
      valor: formatearNumero(
        stats?.totalInscripciones,
      ),
      descripcion: `${formatearNumero(
        stats?.inscripcionesPeriodo,
      )} durante el periodo`,
      icono: Ticket,
      estiloIcono:
        "bg-violet-50 text-violet-700",
      tendencia:
        tendencias?.inscripciones,
    },
    {
      id: "monto-reportado",
      titulo: "Monto reportado",
      valor: formatearMoneda(
        stats?.montoReportado,
      ),
      descripcion:
        "Aprobado, reportado y en revisión",
      icono: Wallet,
      estiloIcono:
        "bg-sky-50 text-sky-700",
    },
    {
      id: "aprobados",
      titulo: "Ingresos aprobados",
      valor: formatearMoneda(
        stats?.ingresosTotales,
      ),
      descripcion: `${formatearNumero(
        stats?.pagosAprobados,
      )} pagos aprobados`,
      icono: BadgeCheck,
      estiloIcono:
        "bg-green-50 text-green-700",
      tendencia: tendencias?.ingresos,
    },
    {
      id: "por-revisar",
      titulo: "Monto por revisar",
      valor: formatearMoneda(
        stats?.montoPorRevisar,
      ),
      descripcion: `${formatearNumero(
        pagosPendientes,
      )} pagos pendientes`,
      icono: Clock3,
      estiloIcono:
        "bg-amber-50 text-amber-700",
    },
    {
      id: "rechazados",
      titulo: "Monto rechazado",
      valor: formatearMoneda(
        stats?.montoRechazado,
      ),
      descripcion: `${formatearNumero(
        stats?.pagosRechazados,
      )} pagos rechazados`,
      icono: CircleX,
      estiloIcono:
        "bg-red-50 text-red-700",
    },
    {
      id: "cancelados",
      titulo: "Monto cancelado",
      valor: formatearMoneda(
        stats?.montoCancelado,
      ),
      descripcion: `${formatearNumero(
        stats?.pagosCancelados,
      )} pagos cancelados`,
      icono: Ban,
      estiloIcono:
        "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <section
      className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Resumen general del dashboard"
    >
      {cards.map((card) => {
        const Icono = card.icono;

        return (
          <article
            key={card.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500">
                  {card.titulo}
                </p>

                <p className="mt-2 truncate text-2xl font-extrabold text-[#0A3D62]">
                  {card.valor}
                </p>
              </div>

              <span
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  card.estiloIcono,
                ].join(" ")}
              >
                <Icono
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {card.descripcion}
            </p>

            <Tendencia
              tendencia={card.tendencia}
            />
          </article>
        );
      })}
    </section>
  );
}