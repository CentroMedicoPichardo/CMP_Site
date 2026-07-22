"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
  Activity,
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  Clock3,
  Download,
  GraduationCap,
  LineChart,
  Table2,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  Curso,
  CursoAnalytics,
} from "@/types/cursos";

interface InscripcionesAnalyticsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

type PeriodoVista = "hoy" | "semana" | "todas";
type TipoVista = "grafica" | "tabla";

interface RegistroHistorico {
  fecha: string;
  ocupados: number;
}

interface RegistroInscripcion {
  fecha: string;
  inscripciones: number;
  acumuladas: number;
}

interface ResumenSemanal {
  semana: number;
  inscripciones: number;
  acumuladas: number;
  fechaInicio: string;
  fechaFin: string;
}

interface MetricaResumenProps {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
  descripcion: string;
  variante: "primary" | "success" | "warning" | "neutral";
}

const CONFIGURACION_METRICA = {
  primary: {
    borde: "border-[#0A3D62]/15",
    fondo: "bg-[#F2F7FA]",
    icono: "bg-[#0A3D62] text-[#FFC300]",
    valor: "text-[#0A3D62]",
  },
  success: {
    borde: "border-emerald-200",
    fondo: "bg-emerald-50",
    icono: "bg-emerald-100 text-emerald-700",
    valor: "text-emerald-700",
  },
  warning: {
    borde: "border-amber-200",
    fondo: "bg-amber-50",
    icono: "bg-amber-100 text-amber-700",
    valor: "text-amber-700",
  },
  neutral: {
    borde: "border-gray-200",
    fondo: "bg-gray-50",
    icono: "bg-white text-gray-600",
    valor: "text-gray-800",
  },
} as const;

function cn(
  ...clases: Array<string | false | null | undefined>
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

function fechaLocalIso(): string {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

function convertirFecha(fecha: string): Date | null {
  const partes = fecha.split("-").map(Number);

  if (
    partes.length === 3 &&
    partes.every(Number.isFinite)
  ) {
    const [año, mes, dia] = partes;
    const resultado = new Date(año, mes - 1, dia);

    if (!Number.isNaN(resultado.getTime())) {
      return resultado;
    }
  }

  const resultado = new Date(fecha);

  return Number.isNaN(resultado.getTime())
    ? null
    : resultado;
}

function formatearFecha(fecha: string): string {
  const fechaValida = convertirFecha(fecha);

  if (!fechaValida) {
    return fecha || "Fecha no disponible";
  }

  return fechaValida.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatearFechaCorta(fecha: string): string {
  const fechaValida = convertirFecha(fecha);

  if (!fechaValida) {
    return fecha;
  }

  return fechaValida.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
  });
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

function obtenerHistorial(
  analytics: CursoAnalytics | null,
): RegistroHistorico[] {
  const analyticsDesconocido: unknown = analytics;

  if (!esRegistro(analyticsDesconocido)) {
    return [];
  }

  const historial =
    analyticsDesconocido["inscripcionesHistoricas"];

  if (!Array.isArray(historial)) {
    return [];
  }

  const registrosPorFecha = new Map<string, number>();

  historial.forEach((item) => {
    if (!esRegistro(item)) {
      return;
    }

    const fecha =
      typeof item["fecha"] === "string"
        ? item["fecha"].trim()
        : "";

    if (!fecha) {
      return;
    }

    const ocupados = Math.max(
      0,
      numeroSeguro(item["ocupados"]),
    );

    registrosPorFecha.set(fecha, ocupados);
  });

  return Array.from(registrosPorFecha.entries())
    .map(([fecha, ocupados]) => ({
      fecha,
      ocupados,
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function transformarHistorial(
  historial: RegistroHistorico[],
): RegistroInscripcion[] {
  return historial.map((item, indice) => {
    const ocupadosAnteriores =
      indice === 0
        ? 0
        : historial[indice - 1].ocupados;

    return {
      fecha: item.fecha,
      inscripciones: Math.max(
        0,
        item.ocupados - ocupadosAnteriores,
      ),
      acumuladas: item.ocupados,
    };
  });
}

function agruparPorSemana(
  data: RegistroInscripcion[],
): ResumenSemanal[] {
  const semanas: ResumenSemanal[] = [];

  for (
    let indice = 0;
    indice < data.length;
    indice += 7
  ) {
    const registrosSemana = data.slice(indice, indice + 7);

    if (registrosSemana.length === 0) {
      continue;
    }

    semanas.push({
      semana: semanas.length + 1,
      inscripciones: registrosSemana.reduce(
        (total, registro) =>
          total + registro.inscripciones,
        0,
      ),
      acumuladas:
        registrosSemana[registrosSemana.length - 1]
          .acumuladas,
      fechaInicio: registrosSemana[0].fecha,
      fechaFin:
        registrosSemana[registrosSemana.length - 1]
          .fecha,
    });
  }

  return semanas;
}

function escaparCsv(valor: string | number): string {
  const texto = String(valor);

  if (
    texto.includes(",") ||
    texto.includes('"') ||
    texto.includes("\n")
  ) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

function nombreArchivoSeguro(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

export function InscripcionesAnalytics({
  curso,
  analytics,
}: InscripcionesAnalyticsProps) {
  const [periodo, setPeriodo] =
    useState<PeriodoVista>("todas");

  const [tipoVista, setTipoVista] =
    useState<TipoVista>("grafica");

  const historial = useMemo(
    () => obtenerHistorial(analytics),
    [analytics],
  );

  const data = useMemo(
    () => transformarHistorial(historial),
    [historial],
  );

  const datosFiltrados = useMemo(() => {
    if (periodo === "hoy") {
      const hoy = fechaLocalIso();

      return data.filter(
        (registro) => registro.fecha === hoy,
      );
    }

    if (periodo === "semana") {
      return data.slice(-7);
    }

    return data;
  }, [data, periodo]);

  const datosPorSemana = useMemo(
    () => agruparPorSemana(data),
    [data],
  );

  const resumen = useMemo(() => {
    const totalInscripciones = datosFiltrados.reduce(
      (total, registro) =>
        total + registro.inscripciones,
      0,
    );

    const promedioDiario =
      datosFiltrados.length > 0
        ? totalInscripciones / datosFiltrados.length
        : 0;

    const maximoInscripciones =
      datosFiltrados.length > 0
        ? Math.max(
            ...datosFiltrados.map(
              (registro) => registro.inscripciones,
            ),
          )
        : 0;

    const mejorDia =
      datosFiltrados.length > 0
        ? datosFiltrados.reduce((mejor, registro) =>
            registro.inscripciones >
            mejor.inscripciones
              ? registro
              : mejor,
          )
        : null;

    return {
      totalInscripciones,
      promedioDiario,
      maximoInscripciones,
      mejorDia,
    };
  }, [datosFiltrados]);

  const cuposOcupados = Math.max(
    0,
    numeroSeguro(curso.cuposOcupados),
  );

  const cupoMaximo = Math.max(
    0,
    numeroSeguro(curso.cupoMaximo),
  );

  const porcentajeOcupacion =
    cupoMaximo > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (cuposOcupados / cupoMaximo) * 100,
          ),
        )
      : 0;

  const tituloPeriodo =
    periodo === "hoy"
      ? "Inscripciones de hoy"
      : periodo === "semana"
        ? "Inscripciones de los últimos 7 días"
        : "Historial completo de inscripciones";

  const rangoFechas =
    data.length > 0
      ? `${formatearFecha(data[0].fecha)} al ${formatearFecha(
          data[data.length - 1].fecha,
        )}`
      : "Sin periodo disponible";

  const exportarDatos = () => {
    if (datosFiltrados.length === 0) {
      return;
    }

    const filas: Array<Array<string | number>> = [
      [
        "Fecha",
        "Inscripciones del día",
        "Inscripciones acumuladas",
      ],
      ...datosFiltrados.map((registro) => [
        registro.fecha,
        registro.inscripciones,
        registro.acumuladas,
      ]),
    ];

    const contenidoCsv = filas
      .map((fila) =>
        fila.map(escaparCsv).join(","),
      )
      .join("\n");

    const blob = new Blob(
      [`\uFEFF${contenidoCsv}`],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    const fechaExportacion = fechaLocalIso();

    const nombreCurso = nombreArchivoSeguro(
      curso.tituloCurso || `curso_${curso.idCurso}`,
    );

    enlace.href = url;
    enlace.download =
      `inscripciones_${nombreCurso}_${fechaExportacion}.csv`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  };

  if (data.length === 0) {
    return (
      <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <BarChart3
                size={21}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Analítica de inscripciones
              </p>

              <h2 className="mt-1 text-lg font-extrabold text-[#0A3D62]">
                Evolución de inscripciones
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Consulta el comportamiento histórico de las
                inscripciones del curso.
              </p>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-6">
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#F8FAFC] px-5 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <Users
                size={30}
                aria-hidden="true"
              />
            </span>

            <h3 className="mt-4 text-sm font-extrabold text-[#0A3D62]">
              Sin historial de inscripciones
            </h3>

            <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
              Aún no existen registros históricos suficientes
              para mostrar la evolución del curso.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                Ocupados: {formatearNumero(cuposOcupados)}
              </span>

              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                Cupo:{" "}
                {cupoMaximo > 0
                  ? formatearNumero(cupoMaximo)
                  : "No definido"}
              </span>

              <span className="rounded-full border border-[#0A3D62]/15 bg-[#EAF2F8] px-3 py-1.5 text-xs font-extrabold text-[#0A3D62]">
                Ocupación:{" "}
                {formatearNumero(porcentajeOcupacion, 1)}%
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <BarChart3
                size={21}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Analítica de inscripciones
              </p>

              <h2 className="mt-1 break-words text-lg font-extrabold text-[#0A3D62]">
                Evolución de inscripciones
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Periodo registrado: {rangoFechas}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportarDatos}
            disabled={datosFiltrados.length === 0}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            <Download
              size={16}
              aria-hidden="true"
            />

            Exportar CSV
          </button>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricaResumen
            icono={
              <Users
                size={19}
                aria-hidden="true"
              />
            }
            etiqueta="Inscripciones"
            valor={formatearNumero(
              resumen.totalInscripciones,
            )}
            descripcion="Registradas en el periodo seleccionado"
            variante="primary"
          />

          <MetricaResumen
            icono={
              <Clock3
                size={19}
                aria-hidden="true"
              />
            }
            etiqueta="Promedio diario"
            valor={formatearNumero(
              resumen.promedioDiario,
              1,
            )}
            descripcion="Inscripciones promedio por día"
            variante="neutral"
          />

          <MetricaResumen
            icono={
              <TrendingUp
                size={19}
                aria-hidden="true"
              />
            }
            etiqueta="Máximo diario"
            valor={formatearNumero(
              resumen.maximoInscripciones,
            )}
            descripcion="Mayor número registrado en un día"
            variante={
              resumen.maximoInscripciones > 0
                ? "success"
                : "neutral"
            }
          />

          <MetricaResumen
            icono={
              <CalendarDays
                size={19}
                aria-hidden="true"
              />
            }
            etiqueta="Mejor día"
            valor={
              resumen.mejorDia
                ? formatearFechaCorta(
                    resumen.mejorDia.fecha,
                  )
                : "—"
            }
            descripcion={
              resumen.mejorDia
                ? `${formatearNumero(
                    resumen.mejorDia.inscripciones,
                  )} inscripciones registradas`
                : "Sin actividad en el periodo"
            }
            variante={
              resumen.mejorDia &&
              resumen.mejorDia.inscripciones > 0
                ? "success"
                : "neutral"
            }
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Periodo de consulta
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <BotonPeriodo
                activo={periodo === "hoy"}
                onClick={() => setPeriodo("hoy")}
                icono={
                  <Activity
                    size={14}
                    aria-hidden="true"
                  />
                }
              >
                Hoy
              </BotonPeriodo>

              <BotonPeriodo
                activo={periodo === "semana"}
                onClick={() => setPeriodo("semana")}
                icono={
                  <CalendarDays
                    size={14}
                    aria-hidden="true"
                  />
                }
              >
                Últimos 7 días
              </BotonPeriodo>

              <BotonPeriodo
                activo={periodo === "todas"}
                onClick={() => setPeriodo("todas")}
                icono={
                  <LineChart
                    size={14}
                    aria-hidden="true"
                  />
                }
              >
                Historial completo
              </BotonPeriodo>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 lg:text-right">
              Presentación
            </p>

            <div className="mt-2 inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setTipoVista("grafica")}
                aria-pressed={tipoVista === "grafica"}
                className={cn(
                  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors",
                  tipoVista === "grafica"
                    ? "bg-[#0A3D62] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#0A3D62]",
                )}
              >
                <ChartNoAxesCombined
                  size={15}
                  aria-hidden="true"
                />

                Gráfica
              </button>

              <button
                type="button"
                onClick={() => setTipoVista("tabla")}
                aria-pressed={tipoVista === "tabla"}
                className={cn(
                  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors",
                  tipoVista === "tabla"
                    ? "bg-[#0A3D62] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#0A3D62]",
                )}
              >
                <Table2
                  size={15}
                  aria-hidden="true"
                />

                Tabla
              </button>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <header className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                {tipoVista === "grafica" ? (
                  <BarChart3
                    size={17}
                    aria-hidden="true"
                  />
                ) : (
                  <Table2
                    size={17}
                    aria-hidden="true"
                  />
                )}
              </span>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-[#0A3D62]">
                  {tituloPeriodo}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {datosFiltrados.length > 0
                    ? `${formatearNumero(
                        datosFiltrados.length,
                      )} días con información disponible`
                    : "No existen registros para este periodo"}
                </p>
              </div>
            </div>
          </header>

          {datosFiltrados.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <CalendarDays
                  size={25}
                  aria-hidden="true"
                />
              </span>

              <h4 className="mt-4 text-sm font-extrabold text-[#0A3D62]">
                Sin actividad en este periodo
              </h4>

              <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
                Selecciona otro periodo para consultar el
                historial de inscripciones disponible.
              </p>
            </div>
          ) : tipoVista === "grafica" ? (
            <div className="overflow-x-auto p-3 sm:p-5">
              <div className="h-[390px] min-w-[680px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  {periodo === "todas" ? (
                    <ComposedChart
                      data={datosFiltrados}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#E5E7EB"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="fecha"
                        tickFormatter={formatearFechaCorta}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 11,
                        }}
                        tickLine={false}
                        axisLine={{
                          stroke: "#D1D5DB",
                        }}
                        minTickGap={25}
                      />

                      <YAxis
                        yAxisId="inscripciones"
                        allowDecimals={false}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 11,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        yAxisId="acumuladas"
                        orientation="right"
                        allowDecimals={false}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 11,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        labelFormatter={(fecha) =>
                          formatearFecha(String(fecha))
                        }
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 25px rgba(6, 28, 46, 0.12)",
                        }}
                      />

                      <Legend
                        verticalAlign="top"
                        height={42}
                        wrapperStyle={{
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        yAxisId="inscripciones"
                        dataKey="inscripciones"
                        name="Inscripciones del día"
                        fill="#FFC300"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={34}
                      />

                      <Line
                        yAxisId="acumuladas"
                        type="monotone"
                        dataKey="acumuladas"
                        name="Inscripciones acumuladas"
                        stroke="#0A3D62"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: "#0A3D62",
                        }}
                      />
                    </ComposedChart>
                  ) : (
                    <BarChart
                      data={datosFiltrados}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#E5E7EB"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="fecha"
                        tickFormatter={formatearFechaCorta}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 11,
                        }}
                        tickLine={false}
                        axisLine={{
                          stroke: "#D1D5DB",
                        }}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 11,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        labelFormatter={(fecha) =>
                          formatearFecha(String(fecha))
                        }
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 25px rgba(6, 28, 46, 0.12)",
                        }}
                      />

                      <Legend
                        verticalAlign="top"
                        height={42}
                        wrapperStyle={{
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        dataKey="inscripciones"
                        name="Inscripciones"
                        fill="#FFC300"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="border-b border-gray-200 px-5 py-3 text-[10px] font-extrabold uppercase tracking-wide text-gray-500">
                      Fecha
                    </th>

                    <th className="border-b border-gray-200 px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wide text-gray-500">
                      Inscripciones del día
                    </th>

                    <th className="border-b border-gray-200 px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-wide text-gray-500">
                      Acumuladas
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {datosFiltrados.map((registro) => (
                    <tr
                      key={registro.fecha}
                      className="transition-colors hover:bg-[#F8FAFC]"
                    >
                      <td className="px-5 py-3 text-xs font-semibold text-gray-700">
                        {formatearFecha(registro.fecha)}
                      </td>

                      <td className="px-5 py-3 text-right text-sm font-extrabold text-gray-800">
                        {formatearNumero(
                          registro.inscripciones,
                        )}
                      </td>

                      <td className="px-5 py-3 text-right text-sm font-extrabold text-[#0A3D62]">
                        {formatearNumero(
                          registro.acumuladas,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {periodo === "todas" &&
          datosPorSemana.length > 0 && (
            <section>
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Comparativo temporal
                </p>

                <h3 className="mt-1 text-sm font-extrabold text-[#0A3D62]">
                  Resumen por semana
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Distribución de inscripciones durante las
                  semanas con actividad registrada.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {datosPorSemana.map((semana) => (
                  <article
                    key={semana.semana}
                    className="rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4 transition-colors hover:border-[#FFC300]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                        <GraduationCap
                          size={17}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-extrabold text-gray-500">
                        Semana {semana.semana}
                      </span>
                    </div>

                    <p className="mt-4 text-2xl font-extrabold leading-none text-[#0A3D62]">
                      {formatearNumero(
                        semana.inscripciones,
                      )}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-gray-500">
                      inscripciones registradas
                    </p>

                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <p className="text-[10px] leading-5 text-gray-400">
                        {formatearFechaCorta(
                          semana.fechaInicio,
                        )}{" "}
                        al{" "}
                        {formatearFechaCorta(
                          semana.fechaFin,
                        )}
                      </p>

                      <p className="mt-1 text-xs font-extrabold text-gray-700">
                        {formatearNumero(
                          semana.acumuladas,
                        )}{" "}
                        acumuladas
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
      </div>
    </section>
  );
}

function MetricaResumen({
  icono,
  etiqueta,
  valor,
  descripcion,
  variante,
}: MetricaResumenProps) {
  const configuracion =
    CONFIGURACION_METRICA[variante];

  return (
    <article
      className={cn(
        "min-w-0 rounded-2xl border p-4",
        configuracion.borde,
        configuracion.fondo,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-500">
            {etiqueta}
          </p>

          <p
            className={cn(
              "mt-2 break-words text-2xl font-extrabold leading-none",
              configuracion.valor,
            )}
          >
            {valor}
          </p>
        </div>

        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            configuracion.icono,
          )}
        >
          {icono}
        </span>
      </div>

      <p className="mt-3 break-words text-xs leading-5 text-gray-500">
        {descripcion}
      </p>
    </article>
  );
}

function BotonPeriodo({
  activo,
  onClick,
  icono,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  icono: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
        activo
          ? "border-[#FFC300] bg-[#FFC300] text-[#0A3D62]"
          : "border-gray-200 bg-white text-gray-600 hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62]",
      )}
    >
      {icono}
      {children}
    </button>
  );
}