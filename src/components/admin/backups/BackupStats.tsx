"use client";

import {
  CalendarClock,
  Database,
  DatabaseBackup,
  HardDrive,
  Layers3,
  PieChart,
  type LucideIcon,
} from "lucide-react";

import type { BackupStats as BackupStatsType } from "@/types/backups";

interface BackupStatsProps {
  stats: BackupStatsType;
}

type TonoEstadistica =
  | "azul"
  | "verde"
  | "ambar"
  | "violeta"
  | "naranja"
  | "indigo";

interface EstadisticaRespaldo {
  id: string;
  titulo: string;
  valor: string;
  descripcion: string;
  Icono: LucideIcon;
  tono: TonoEstadistica;
  porcentaje?: number;
}

interface ClasesTono {
  icono: string;
  valor: string;
  barra: string;
  borde: string;
  fondo: string;
}

const FORMATEADOR_NUMERO = new Intl.NumberFormat(
  "es-MX",
);

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function numeroSeguro(
  valor: number | string | null | undefined,
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function enteroSeguro(
  valor: number | string | null | undefined,
): number {
  return Math.max(
    0,
    Math.trunc(numeroSeguro(valor)),
  );
}

function formatearNumero(
  valor: number | string | null | undefined,
): string {
  return FORMATEADOR_NUMERO.format(
    enteroSeguro(valor),
  );
}

function formatearValor(
  valor: unknown,
  respaldo: string,
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

function calcularPorcentaje(
  cantidad: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (cantidad / total) * 100,
    ),
  );
}

function formatearPorcentaje(
  valor: number,
): string {
  return valor.toLocaleString(
    "es-MX",
    {
      maximumFractionDigits: 1,
    },
  );
}

function formatearUltimoRespaldo(
  fecha: string | Date | null | undefined,
): string {
  if (!fecha) {
    return "Sin respaldos";
  }

  const fechaNormalizada =
    fecha instanceof Date
      ? fecha
      : new Date(fecha);

  if (
    Number.isNaN(
      fechaNormalizada.getTime(),
    )
  ) {
    return "Fecha no disponible";
  }

  return fechaNormalizada.toLocaleString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function obtenerClasesTono(
  tono: TonoEstadistica,
): ClasesTono {
  if (tono === "verde") {
    return {
      icono:
        "bg-emerald-50 text-emerald-700",
      valor: "text-emerald-700",
      barra: "bg-emerald-500",
      borde: "border-emerald-100",
      fondo: "bg-emerald-50/50",
    };
  }

  if (tono === "ambar") {
    return {
      icono:
        "bg-amber-50 text-amber-700",
      valor: "text-amber-700",
      barra: "bg-amber-500",
      borde: "border-amber-100",
      fondo: "bg-amber-50/50",
    };
  }

  if (tono === "violeta") {
    return {
      icono:
        "bg-violet-50 text-violet-700",
      valor: "text-violet-700",
      barra: "bg-violet-500",
      borde: "border-violet-100",
      fondo: "bg-violet-50/50",
    };
  }

  if (tono === "naranja") {
    return {
      icono:
        "bg-orange-50 text-orange-700",
      valor: "text-orange-700",
      barra: "bg-orange-500",
      borde: "border-orange-100",
      fondo: "bg-orange-50/50",
    };
  }

  if (tono === "indigo") {
    return {
      icono:
        "bg-indigo-50 text-indigo-700",
      valor: "text-indigo-700",
      barra: "bg-indigo-500",
      borde: "border-indigo-100",
      fondo: "bg-indigo-50/50",
    };
  }

  return {
    icono: "bg-blue-50 text-blue-700",
    valor: "text-blue-700",
    barra: "bg-blue-500",
    borde: "border-blue-100",
    fondo: "bg-blue-50/50",
  };
}

export function BackupStats({
  stats,
}: BackupStatsProps) {
  const total = enteroSeguro(
    stats.total,
  );

  const completos = enteroSeguro(
    stats.completos,
  );

  const parciales = enteroSeguro(
    stats.parciales,
  );

  const porcentajeCompletos =
    calcularPorcentaje(
      completos,
      total,
    );

  const porcentajeParciales =
    calcularPorcentaje(
      parciales,
      total,
    );

  const estadisticas: EstadisticaRespaldo[] =
    [
      {
        id: "total",
        titulo: "Total de respaldos",
        valor: formatearNumero(total),
        descripcion:
          total === 1
            ? "Archivo registrado en el historial de respaldos."
            : "Archivos registrados en el historial de respaldos.",
        Icono: DatabaseBackup,
        tono: "azul",
      },
      {
        id: "completos",
        titulo: "Respaldos completos",
        valor:
          formatearNumero(completos),
        descripcion:
          total > 0
            ? `${formatearPorcentaje(
                porcentajeCompletos,
              )}% del total registrado.`
            : "Todavía no existen respaldos completos.",
        Icono: Database,
        tono: "verde",
        porcentaje:
          porcentajeCompletos,
      },
      {
        id: "parciales",
        titulo: "Respaldos parciales",
        valor:
          formatearNumero(parciales),
        descripcion:
          total > 0
            ? `${formatearPorcentaje(
                porcentajeParciales,
              )}% del total registrado.`
            : "Todavía no existen respaldos parciales.",
        Icono: Layers3,
        tono: "ambar",
        porcentaje:
          porcentajeParciales,
      },
      {
        id: "espacio",
        titulo:
          "Espacio total utilizado",
        valor: formatearValor(
          stats.espacioTotal,
          "0 B",
        ),
        descripcion:
          "Almacenamiento ocupado por todos los archivos de respaldo.",
        Icono: HardDrive,
        tono: "violeta",
      },
      {
        id: "ultimo",
        titulo: "Último respaldo",
        valor:
          formatearUltimoRespaldo(
            stats.ultimoBackup,
          ),
        descripcion:
          stats.ultimoBackup
            ? "Fecha y hora de la copia de seguridad más reciente."
            : "Todavía no se ha generado ningún respaldo.",
        Icono: CalendarClock,
        tono: "naranja",
      },
      {
        id: "promedio",
        titulo: "Tamaño promedio",
        valor: formatearValor(
          stats.promedioTamaño,
          "0 B",
        ),
        descripcion:
          "Promedio de almacenamiento utilizado por cada respaldo.",
        Icono: PieChart,
        tono: "indigo",
      },
    ];

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <DatabaseBackup
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Resumen de respaldos
              </h2>

              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                {formatearNumero(total)}{" "}
                {total === 1
                  ? "archivo"
                  : "archivos"}
              </span>
            </div>

            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              Estado general del almacenamiento
              y las copias registradas
            </p>
          </div>
        </div>

        <span className="self-start rounded-full bg-[#FFF9E6] px-3 py-1 text-[10px] font-extrabold text-[#8A6900] sm:self-auto">
          Información actual
        </span>
      </header>

      <div
        className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Estadísticas de respaldos"
      >
        {estadisticas.map(
          (estadistica) => {
            const clases =
              obtenerClasesTono(
                estadistica.tono,
              );

            const Icono =
              estadistica.Icono;

            return (
              <article
                key={estadistica.id}
                className={cn(
                  "flex min-h-[190px] flex-col rounded-2xl border bg-white p-5 transition-all",
                  "hover:border-[#0A3D62]/20 hover:shadow-sm",
                  clases.borde,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-5 text-gray-600">
                      {estadistica.titulo}
                    </p>

                    <p
                      className={cn(
                        "mt-3 whitespace-normal break-words text-2xl font-extrabold leading-tight",
                        clases.valor,
                        estadistica.id ===
                          "ultimo" &&
                          "text-lg leading-7",
                      )}
                    >
                      {estadistica.valor}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      clases.icono,
                    )}
                  >
                    <Icono
                      size={20}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  {
                    estadistica.descripcion
                  }
                </p>

                {typeof estadistica.porcentaje ===
                "number" ? (
                  <div className="mt-auto pt-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Distribución
                      </span>

                      <span
                        className={cn(
                          "text-xs font-extrabold",
                          clases.valor,
                        )}
                      >
                        {formatearPorcentaje(
                          estadistica.porcentaje,
                        )}
                        %
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-gray-100"
                      role="progressbar"
                      aria-label={`Distribución de ${estadistica.titulo}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={
                        estadistica.porcentaje
                      }
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          clases.barra,
                        )}
                        style={{
                          width: `${estadistica.porcentaje}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto pt-5">
                    <div
                      className={cn(
                        "h-2 w-full rounded-full",
                        clases.fondo,
                      )}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}