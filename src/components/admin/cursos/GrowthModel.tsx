"use client";

import { useId, useMemo, type ReactNode } from "react";

import {
  Activity,
  AlertCircle,
  CalendarDays,
  Calculator,
  Clock3,
  Info,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Curso, CursoAnalytics } from "@/types/cursos";

interface GrowthModelProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

interface PuntoPrediccion {
  dia: number;
  ocupados: number;
  disponibles: number;
}

type EstadoRitmo =
  | "sin-datos"
  | "lento"
  | "normal"
  | "rapido"
  | "completo";

interface ResultadoModelo {
  cupoTotal: number;
  ocupadosActuales: number;
  disponiblesActuales: number;
  porcentajeOcupacion: number;
  diasTranscurridos: number;
  k: number;
  diaMitad: number | null;
  diaLleno: number | null;
  predicciones: PuntoPrediccion[];
  tieneDatosSuficientes: boolean;
  estado: EstadoRitmo;
  accionSugerida: string;
}

interface ConfiguracionEstado {
  titulo: string;
  descripcion: string;
  contenedor: string;
  texto: string;
  indicador: string;
}

const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
const MAXIMO_DIAS_GRAFICA = 180;

const CONFIGURACION_ESTADO: Record<
  EstadoRitmo,
  ConfiguracionEstado
> = {
  "sin-datos": {
    titulo: "Sin datos suficientes",
    descripcion: "La estimación comenzará cuando existan inscripciones.",
    contenedor: "border-gray-200 bg-gray-50",
    texto: "text-gray-600",
    indicador: "bg-gray-400",
  },
  lento: {
    titulo: "Ritmo lento",
    descripcion: "La ocupación está creciendo por debajo del ritmo esperado.",
    contenedor: "border-red-200 bg-red-50",
    texto: "text-red-700",
    indicador: "bg-red-500",
  },
  normal: {
    titulo: "Ritmo normal",
    descripcion: "El crecimiento se mantiene dentro de un rango estable.",
    contenedor: "border-amber-200 bg-amber-50",
    texto: "text-amber-700",
    indicador: "bg-amber-500",
  },
  rapido: {
    titulo: "Ritmo rápido",
    descripcion: "Las inscripciones presentan un crecimiento acelerado.",
    contenedor: "border-emerald-200 bg-emerald-50",
    texto: "text-emerald-700",
    indicador: "bg-emerald-500",
  },
  completo: {
    titulo: "Cupo completo",
    descripcion: "El curso alcanzó su capacidad máxima registrada.",
    contenedor: "border-emerald-200 bg-emerald-50",
    texto: "text-emerald-700",
    indicador: "bg-emerald-500",
  },
};

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

function normalizarFecha(valor: unknown): Date {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    const fecha = new Date(valor);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }

  if (typeof valor !== "string" || !valor.trim()) {
    return hoy;
  }

  const texto = valor.trim();
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);

  if (coincidencia) {
    const año = Number(coincidencia[1]);
    const mes = Number(coincidencia[2]);
    const dia = Number(coincidencia[3]);
    const fechaLocal = new Date(año, mes - 1, dia);

    if (!Number.isNaN(fechaLocal.getTime())) {
      fechaLocal.setHours(0, 0, 0, 0);
      return fechaLocal;
    }
  }

  const fecha = new Date(texto);

  if (Number.isNaN(fecha.getTime())) {
    return hoy;
  }

  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatearNumero(valor: number, decimales = 0): string {
  return valor.toLocaleString("es-MX", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

function calcularDiasTranscurridos(
  fechaInicio: Date,
  fechaFinal: Date,
): number {
  const diferencia = Math.floor(
    (fechaFinal.getTime() - fechaInicio.getTime()) /
      MILISEGUNDOS_POR_DIA,
  );

  return Math.max(1, diferencia);
}

function obtenerEstado(
  tieneDatos: boolean,
  ocupados: number,
  cupoTotal: number,
  k: number,
): EstadoRitmo {
  if (!tieneDatos) {
    return "sin-datos";
  }

  if (cupoTotal > 0 && ocupados >= cupoTotal) {
    return "completo";
  }

  if (k > -0.01) {
    return "lento";
  }

  if (k > -0.05) {
    return "normal";
  }

  return "rapido";
}

function obtenerAccionSugerida(
  estado: EstadoRitmo,
  diasTranscurridos: number,
  diaLleno: number | null,
): string {
  if (estado === "sin-datos") {
    return "Esperar más información antes de tomar una decisión.";
  }

  if (estado === "completo") {
    return "Cerrar inscripciones o habilitar una lista de espera.";
  }

  if (estado === "lento") {
    return "Reforzar la difusión y revisar la comunicación del curso.";
  }

  if (
    diaLleno !== null &&
    diaLleno - diasTranscurridos <= 7
  ) {
    return "Preparar el cierre de inscripciones por proximidad al cupo máximo.";
  }

  if (estado === "rapido") {
    return "Mantener el seguimiento y evaluar la apertura de un nuevo grupo.";
  }

  return "Mantener el monitoreo regular de las inscripciones.";
}

function calcularModelo(
  curso: Curso,
  fechaApertura: Date,
  fechaHoy: Date,
): ResultadoModelo {
  const cupoTotal = Math.max(
    0,
    numeroSeguro(curso.cupoMaximo),
  );

  const ocupadosActuales = Math.min(
    cupoTotal,
    Math.max(0, numeroSeguro(curso.cuposOcupados)),
  );

  const disponiblesActuales = Math.max(
    0,
    cupoTotal - ocupadosActuales,
  );

  const porcentajeOcupacion =
    cupoTotal > 0
      ? (ocupadosActuales / cupoTotal) * 100
      : 0;

  const diasTranscurridos = calcularDiasTranscurridos(
    fechaApertura,
    fechaHoy,
  );

  const tieneDatosSuficientes =
    cupoTotal > 0 && ocupadosActuales > 0;

  if (!tieneDatosSuficientes) {
    return {
      cupoTotal,
      ocupadosActuales,
      disponiblesActuales,
      porcentajeOcupacion,
      diasTranscurridos,
      k: 0,
      diaMitad: null,
      diaLleno: null,
      predicciones: [],
      tieneDatosSuficientes: false,
      estado: "sin-datos",
      accionSugerida:
        "Esperar más información antes de tomar una decisión.",
    };
  }

  /*
   * El modelo estima la reducción exponencial de lugares disponibles:
   *
   * D(t) = D0 · e^(k·t)
   *
   * Para cursos completos se utiliza medio lugar como umbral matemático
   * para evitar calcular el logaritmo de cero.
   */
  const umbralMinimo = 0.5 / cupoTotal;

  const fraccionDisponible = Math.max(
    umbralMinimo,
    disponiblesActuales / cupoTotal,
  );

  const k =
    Math.log(fraccionDisponible) /
    diasTranscurridos;

  const diaMitad =
    k < 0
      ? Math.max(1, Math.ceil(Math.log(0.5) / k))
      : null;

  const diaLlenoCalculado =
    k < 0
      ? Math.max(
          1,
          Math.ceil(Math.log(umbralMinimo) / k),
        )
      : null;

  const diaLleno =
    ocupadosActuales >= cupoTotal
      ? diasTranscurridos
      : diaLlenoCalculado;

  const diaFinal = Math.min(
    MAXIMO_DIAS_GRAFICA,
    Math.max(
      diasTranscurridos + 30,
      (diaLleno ?? diasTranscurridos + 30) + 10,
    ),
  );

  const predicciones: PuntoPrediccion[] = [];

  for (let dia = 0; dia <= diaFinal; dia += 1) {
    let disponiblesEstimados =
      cupoTotal * Math.exp(k * dia);

    if (diaLleno !== null && dia >= diaLleno) {
      disponiblesEstimados = 0;
    }

    const disponibles = Math.max(
      0,
      Math.min(cupoTotal, Math.round(disponiblesEstimados)),
    );

    predicciones.push({
      dia,
      ocupados: Math.max(
        0,
        Math.min(cupoTotal, cupoTotal - disponibles),
      ),
      disponibles,
    });
  }

  const estado = obtenerEstado(
    true,
    ocupadosActuales,
    cupoTotal,
    k,
  );

  return {
    cupoTotal,
    ocupadosActuales,
    disponiblesActuales,
    porcentajeOcupacion,
    diasTranscurridos,
    k,
    diaMitad,
    diaLleno,
    predicciones,
    tieneDatosSuficientes: true,
    estado,
    accionSugerida: obtenerAccionSugerida(
      estado,
      diasTranscurridos,
      diaLleno,
    ),
  };
}

export function GrowthModel({
  curso,
  analytics,
}: GrowthModelProps) {
  const identificadorGradiente = useId().replace(/:/g, "");

  const fechaApertura = useMemo(
    () => normalizarFecha(curso.createdAt),
    [curso.createdAt],
  );

  const fechaHoy = useMemo(() => {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }, []);

  const resultado = useMemo(
    () => calcularModelo(curso, fechaApertura, fechaHoy),
    [curso, fechaApertura, fechaHoy],
  );

  const configuracionEstado =
    CONFIGURACION_ESTADO[resultado.estado];

  const fuenteInformacion =
    analytics !== null
      ? "Curso y analítica disponible"
      : "Ocupación actual del curso";

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300]">
              <Calculator
                size={23}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Analítica académica
                </p>

                <span className="rounded-full border border-[#0A3D62]/10 bg-[#EAF2F8] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0A3D62]">
                  Modelo exponencial
                </span>
              </div>

              <h2 className="mt-2 break-words text-xl font-extrabold leading-tight text-[#0A3D62]">
                Proyección de ocupación
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Estima la evolución de los lugares ocupados y
                disponibles a partir del cupo actual y del tiempo
                transcurrido desde la apertura.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <DatoCabecera
                  icono={
                    <CalendarDays
                      size={15}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Apertura"
                  valor={formatearFecha(fechaApertura)}
                />

                <DatoCabecera
                  icono={
                    <Clock3
                      size={15}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Día actual"
                  valor={`Día ${resultado.diasTranscurridos}`}
                />

                <DatoCabecera
                  icono={
                    <UsersRound
                      size={15}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Fuente"
                  valor={fuenteInformacion}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "w-full shrink-0 rounded-2xl border p-4 lg:w-64",
              configuracionEstado.contenedor,
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  configuracionEstado.indicador,
                )}
                aria-hidden="true"
              />

              <p
                className={cn(
                  "text-[10px] font-extrabold uppercase tracking-[0.12em]",
                  configuracionEstado.texto,
                )}
              >
                Diagnóstico de ocupación
              </p>
            </div>

            <p
              className={cn(
                "mt-3 text-lg font-extrabold",
                configuracionEstado.texto,
              )}
            >
              {configuracionEstado.titulo}
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              {configuracionEstado.descripcion}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/5 pt-3">
              <span className="text-[10px] font-semibold text-gray-500">
                Tasa de cambio
              </span>

              <code className="rounded-lg bg-white/80 px-2 py-1 text-xs font-extrabold text-[#0A3D62]">
                k = {resultado.k.toFixed(4)}
              </code>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricaActual
            icono={
              <UsersRound
                size={19}
                aria-hidden="true"
              />
            }
            titulo="Ocupación actual"
            valor={`${formatearNumero(
              resultado.porcentajeOcupacion,
              1,
            )}%`}
            descripcion={`${formatearNumero(
              resultado.ocupadosActuales,
            )} de ${formatearNumero(
              resultado.cupoTotal,
            )} lugares ocupados`}
          />

          <MetricaActual
            icono={
              <Activity
                size={19}
                aria-hidden="true"
              />
            }
            titulo="Disponibilidad"
            valor={formatearNumero(
              resultado.disponiblesActuales,
            )}
            descripcion="Lugares disponibles actualmente"
          />

          <MetricaActual
            icono={
              <Target
                size={19}
                aria-hidden="true"
              />
            }
            titulo="50% de capacidad"
            valor={
              resultado.diaMitad !== null
                ? `Día ${resultado.diaMitad}`
                : "—"
            }
            descripcion="Momento estimado para alcanzar la mitad del cupo"
          />

          <MetricaActual
            icono={
              <TrendingUp
                size={19}
                aria-hidden="true"
              />
            }
            titulo="Cupo completo"
            valor={
              resultado.diaLleno !== null
                ? `Día ${resultado.diaLleno}`
                : "—"
            }
            descripcion="Día estimado para alcanzar la capacidad máxima"
          />
        </div>

        {resultado.tieneDatosSuficientes ? (
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <header className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                  <TrendingUp
                    size={17}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#0A3D62]">
                    Evolución estimada del cupo
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    La línea vertical identifica el día actual del
                    curso.
                  </p>
                </div>
              </div>
            </header>

            <div className="overflow-x-auto p-3 sm:p-5">
              <div className="h-[410px] min-w-[720px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={resultado.predicciones}
                    margin={{
                      top: 32,
                      right: 28,
                      left: 0,
                      bottom: 15,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id={identificadorGradiente}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0A3D62"
                          stopOpacity={0.3}
                        />

                        <stop
                          offset="95%"
                          stopColor="#0A3D62"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#E5E7EB"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="dia"
                      tick={{
                        fontSize: 11,
                        fill: "#6B7280",
                        fontWeight: 600,
                      }}
                      tickLine={false}
                      axisLine={{
                        stroke: "#D1D5DB",
                      }}
                      minTickGap={24}
                      label={{
                        value: "Días desde la apertura",
                        position: "insideBottom",
                        offset: -8,
                        fill: "#6B7280",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      domain={[0, resultado.cupoTotal]}
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#6B7280",
                        fontWeight: 600,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      labelFormatter={(valor: unknown) => {
                        const dia = numeroSeguro(valor);

                        return dia ===
                          resultado.diasTranscurridos
                          ? `Día ${dia} — hoy`
                          : `Día ${dia}`;
                      }}
                      formatter={(
                        valor: unknown,
                        nombre: unknown,
                      ) => [
                        `${formatearNumero(
                          numeroSeguro(valor),
                        )} cupos`,
                        String(nombre),
                      ]}
                      contentStyle={{
                        backgroundColor: "#061C2E",
                        border: "1px solid #0A3D62",
                        borderRadius: "12px",
                        color: "#FFFFFF",
                        boxShadow:
                          "0 12px 30px rgba(6, 28, 46, 0.2)",
                      }}
                      labelStyle={{
                        color: "#FFC300",
                        fontWeight: 800,
                      }}
                      itemStyle={{
                        color: "#FFFFFF",
                      }}
                      cursor={{
                        stroke: "#94A3B8",
                        strokeWidth: 1.5,
                        strokeDasharray: "4 4",
                      }}
                    />

                    <Legend
                      verticalAlign="top"
                      height={42}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="ocupados"
                      fill={`url(#${identificadorGradiente})`}
                      stroke="none"
                      legendType="none"
                    />

                    <Line
                      type="monotone"
                      dataKey="ocupados"
                      name="Cupos ocupados"
                      stroke="#0A3D62"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: "#0A3D62",
                        stroke: "#FFFFFF",
                        strokeWidth: 3,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="disponibles"
                      name="Lugares disponibles"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      strokeDasharray="8 6"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#DC2626",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />

                    <ReferenceLine
                      x={resultado.diasTranscurridos}
                      stroke="#FFC300"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{
                        value: "DÍA ACTUAL",
                        position: "top",
                        fill: "#0A3D62",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#F8FAFC] px-5 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <Activity
                size={30}
                aria-hidden="true"
              />
            </span>

            <h3 className="mt-4 text-sm font-extrabold text-[#0A3D62]">
              Datos insuficientes para la proyección
            </h3>

            <p className="mt-1 max-w-md text-xs leading-5 text-gray-500">
              El modelo se habilitará cuando el curso tenga un cupo
              máximo válido y al menos una inscripción registrada.
            </p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]">
          <div className="rounded-2xl border border-[#0A3D62]/15 bg-[#F2F7FA] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                <AlertCircle
                  size={18}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-500">
                  Acción sugerida
                </p>

                <p className="mt-2 break-words text-sm font-extrabold leading-6 text-[#0A3D62]">
                  {resultado.accionSugerida}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Recomendación generada a partir del ritmo estimado
                  de ocupación.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Info
                size={17}
                className="mt-0.5 shrink-0 text-amber-700"
                aria-hidden="true"
              />

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-amber-800">
                  Estimación orientativa
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  El resultado extrapola el comportamiento actual. No
                  contempla campañas, cambios de precio, estacionalidad
                  ni cancelaciones futuras.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function DatoCabecera({
  icono,
  etiqueta,
  valor,
}: {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-[#F8FAFC] px-3 py-2">
      <span className="shrink-0 text-[#0A3D62]">
        {icono}
      </span>

      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          {etiqueta}
        </span>

        <p className="break-words text-xs font-extrabold text-gray-700">
          {valor}
        </p>
      </div>
    </div>
  );
}

function MetricaActual({
  icono,
  titulo,
  valor,
  descripcion,
}: {
  icono: ReactNode;
  titulo: string;
  valor: string;
  descripcion: string;
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-400">
            {titulo}
          </p>

          <p className="mt-2 break-words text-2xl font-extrabold leading-none text-[#0A3D62]">
            {valor}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62] transition-transform group-hover:scale-105">
          {icono}
        </span>
      </div>

      <p className="mt-3 break-words text-xs leading-5 text-gray-500">
        {descripcion}
      </p>
    </article>
  );
}