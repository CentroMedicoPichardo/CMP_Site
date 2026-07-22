"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  type LucideIcon,
  AlertCircle,
  AlertTriangle,
  Archive,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleGauge,
  Clock3,
  FileQuestion,
  FolderOpen,
  Loader2,
  LockKeyhole,
  MessageCircleQuestion,
  MessageSquareReply,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import type {
  PreguntaUsuario,
  RespuestaAyuda,
} from "@/types/help";

interface PreguntaDetalleProps {
  pregunta: PreguntaUsuario;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface ConfiguracionBadge {
  label: string;
  clases: string;
  Icono: LucideIcon;
}

type RespuestasResponse =
  | RespuestaAyuda[]
  | {
      respuestas?: RespuestaAyuda[];
    };

const ESTADOS: Record<
  string,
  ConfiguracionBadge
> = {
  pendiente: {
    label: "Pendiente",
    clases:
      "border-amber-200 bg-amber-50 text-amber-700",
    Icono: Clock3,
  },
  respondida: {
    label: "Respondida",
    clases:
      "border-[#0A3D62]/15 bg-[#EAF2F8] text-[#0A3D62]",
    Icono: MessageSquareReply,
  },
  cerrada: {
    label: "Cerrada",
    clases:
      "border-gray-200 bg-gray-100 text-gray-600",
    Icono: Archive,
  },
  convertida_faq: {
    label: "Convertida en FAQ",
    clases:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icono: BadgeCheck,
  },
};

const PRIORIDADES: Record<
  string,
  ConfiguracionBadge
> = {
  baja: {
    label: "Prioridad baja",
    clases:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icono: CircleGauge,
  },
  normal: {
    label: "Prioridad normal",
    clases:
      "border-[#0A3D62]/15 bg-[#F1F6F9] text-[#0A3D62]",
    Icono: FileQuestion,
  },
  alta: {
    label: "Prioridad alta",
    clases:
      "border-orange-200 bg-orange-50 text-orange-700",
    Icono: AlertTriangle,
  },
  urgente: {
    label: "Prioridad urgente",
    clases:
      "border-red-200 bg-red-50 text-red-700",
    Icono: AlertCircle,
  },
};

const FORMATEADOR_FECHA = new Intl.DateTimeFormat(
  "es-MX",
  {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
);

const FORMATEADOR_FECHA_HORA =
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function normalizarValor(
  valor: unknown,
): string {
  return String(valor ?? "")
    .trim()
    .toLocaleLowerCase("es-MX");
}

function formatearEtiqueta(
  valor: unknown,
  respaldo: string,
): string {
  const texto = String(valor ?? "")
    .replace(/_/g, " ")
    .trim();

  if (!texto) {
    return respaldo;
  }

  return texto
    .split(/\s+/)
    .map(
      (palabra) =>
        palabra.charAt(0).toLocaleUpperCase(
          "es-MX",
        ) +
        palabra
          .slice(1)
          .toLocaleLowerCase("es-MX"),
    )
    .join(" ");
}

function convertirFecha(
  valor: unknown,
): Date | null {
  if (!valor) {
    return null;
  }

  const fecha = new Date(
    valor as string | number | Date,
  );

  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  return fecha;
}

function formatearFecha(
  valor: unknown,
): string {
  const fecha = convertirFecha(valor);

  return fecha
    ? FORMATEADOR_FECHA.format(fecha)
    : "Fecha no disponible";
}

function formatearFechaHora(
  valor: unknown,
): string {
  const fecha = convertirFecha(valor);

  return fecha
    ? FORMATEADOR_FECHA_HORA.format(fecha)
    : "Fecha no disponible";
}

function obtenerNombreUsuario(
  usuario:
    | {
        nombre?: string | null;
        apellidoPaterno?: string | null;
      }
    | null
    | undefined,
  respaldo: string,
): string {
  const nombreCompleto = [
    usuario?.nombre?.trim(),
    usuario?.apellidoPaterno?.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return nombreCompleto || respaldo;
}

async function obtenerMensajeError(
  response: Response,
): Promise<string> {
  try {
    const data =
      (await response.json()) as ApiErrorResponse;

    return (
      data.error ||
      data.message ||
      "No fue posible completar la solicitud."
    );
  } catch {
    return "No fue posible completar la solicitud.";
  }
}

function obtenerListaRespuestas(
  data: RespuestasResponse,
): RespuestaAyuda[] {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.respuestas)
    ? data.respuestas
    : [];
}

export default function PreguntaDetalle({
  pregunta,
}: PreguntaDetalleProps) {
  const [respuestas, setRespuestas] = useState<
    RespuestaAyuda[]
  >([]);

  const [
    nuevaRespuesta,
    setNuevaRespuesta,
  ] = useState("");

  const [
    cargandoRespuestas,
    setCargandoRespuestas,
  ] = useState(true);

  const [enviando, setEnviando] =
    useState(false);

  const [errorCarga, setErrorCarga] =
    useState("");

  const [errorEnvio, setErrorEnvio] =
    useState("");

  const estadoNormalizado = normalizarValor(
    pregunta.estado,
  );

  const prioridadNormalizada =
    normalizarValor(pregunta.prioridad);

  const estado = useMemo(() => {
    return (
      ESTADOS[estadoNormalizado] ?? {
        label: formatearEtiqueta(
          pregunta.estado,
          "Sin estado",
        ),
        clases:
          "border-gray-200 bg-gray-100 text-gray-600",
        Icono: FileQuestion,
      }
    );
  }, [estadoNormalizado, pregunta.estado]);

  const prioridad = useMemo(() => {
    return (
      PRIORIDADES[prioridadNormalizada] ?? {
        label: formatearEtiqueta(
          pregunta.prioridad,
          "Sin prioridad",
        ),
        clases:
          "border-gray-200 bg-gray-50 text-gray-600",
        Icono: CircleGauge,
      }
    );
  }, [
    pregunta.prioridad,
    prioridadNormalizada,
  ]);

  const permiteResponder =
    estadoNormalizado !== "cerrada" &&
    estadoNormalizado !== "convertida_faq";

  const cargarRespuestas = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setCargandoRespuestas(true);
        setErrorCarga("");

        const response = await fetch(
          `/api/soporte/preguntas/${pregunta.idPregunta}/respuestas`,
          {
            credentials: "include",
            signal,
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Tu sesión expiró. Inicia sesión nuevamente para consultar las respuestas.",
            );
          }

          if (response.status === 403) {
            throw new Error(
              "No tienes permiso para consultar esta conversación.",
            );
          }

          throw new Error(
            await obtenerMensajeError(response),
          );
        }

        const data =
          (await response.json()) as RespuestasResponse;

        setRespuestas(
          obtenerListaRespuestas(data),
        );
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando respuestas:",
          error,
        );

        setErrorCarga(
          error instanceof Error
            ? error.message
            : "No fue posible cargar las respuestas.",
        );
      } finally {
        if (!signal?.aborted) {
          setCargandoRespuestas(false);
        }
      }
    },
    [pregunta.idPregunta],
  );

  useEffect(() => {
    const controller = new AbortController();

    void cargarRespuestas(controller.signal);

    return () => controller.abort();
  }, [cargarRespuestas]);

  const handleEnviarRespuesta = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const contenido =
      nuevaRespuesta.trim();

    if (
      !contenido ||
      enviando ||
      !permiteResponder
    ) {
      return;
    }

    if (contenido.length < 3) {
      setErrorEnvio(
        "El mensaje debe contener al menos 3 caracteres.",
      );
      return;
    }

    try {
      setEnviando(true);
      setErrorEnvio("");

      const response = await fetch(
        `/api/soporte/preguntas/${pregunta.idPregunta}/respuestas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            contenido,
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Debes iniciar sesión para enviar un mensaje.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            "No tienes permiso para responder esta pregunta.",
          );
        }

        throw new Error(
          await obtenerMensajeError(response),
        );
      }

      setNuevaRespuesta("");
      await cargarRespuestas();
    } catch (error: unknown) {
      console.error(
        "Error enviando respuesta:",
        error,
      );

      setErrorEnvio(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el mensaje.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const titulo =
    pregunta.titulo?.trim() ||
    "Pregunta sin título";

  const descripcion =
    pregunta.descripcion?.trim() ||
    "Esta pregunta no contiene una descripción.";

  const categoria =
    pregunta.categoria?.nombreCategoria?.trim() ||
    "Sin categoría";

  const autorPregunta = obtenerNombreUsuario(
    pregunta.usuario,
    "Usuario",
  );

  const EstadoIcono = estado.Icono;
  const PrioridadIcono = prioridad.Icono;

  return (
    <div className="space-y-5">
      {/* Pregunta principal */}
      <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_14px_40px_rgba(10,61,98,0.08)]">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A3D62] via-[#FFC300] to-[#0A3D62]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-4 sm:p-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
                <MessageCircleQuestion
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B88600]">
                  Solicitud de soporte
                </p>

                <h1 className="mt-1 text-lg font-extrabold leading-7 text-[#0A3D62] sm:text-xl">
                  {titulo}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Badge
                configuracion={estado}
                Icono={EstadoIcono}
              />

              <Badge
                configuracion={prioridad}
                Icono={PrioridadIcono}
              />

              {pregunta.esPrivada && (
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-[#0A3D62]/15 bg-[#F1F6F9] px-2.5 py-1 text-[10px] font-extrabold text-[#0A3D62]">
                  <LockKeyhole
                    size={12}
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  Privada
                </span>
              )}
            </div>
          </header>

          <div className="mt-5 rounded-2xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-4 sm:px-5">
            <span
              className="absolute left-0 hidden"
              aria-hidden="true"
            />

            <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
              {descripcion}
            </p>
          </div>

          <footer className="mt-4 grid gap-2.5 border-t border-gray-100 pt-4 sm:grid-cols-3">
            <DetalleInformativo
              Icono={CalendarDays}
              etiqueta="Fecha"
              valor={formatearFecha(
                pregunta.createdAt,
              )}
            />

            <DetalleInformativo
              Icono={UserRound}
              etiqueta="Solicitante"
              valor={autorPregunta}
            />

            <DetalleInformativo
              Icono={FolderOpen}
              etiqueta="Categoría"
              valor={categoria}
            />
          </footer>
        </div>
      </article>

      {/* Conversación */}
      <section
        className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_32px_rgba(10,61,98,0.06)]"
        aria-labelledby="respuestas-heading"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-[#F7FAFC] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <MessageSquareText
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <h2
                id="respuestas-heading"
                className="text-sm font-extrabold text-[#0A3D62] sm:text-base"
              >
                Conversación
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-500">
                Seguimiento de tu solicitud
              </p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center rounded-full border border-[#0A3D62]/10 bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#0A3D62]">
            {respuestas.length}{" "}
            {respuestas.length === 1
              ? "respuesta"
              : "respuestas"}
          </span>
        </header>

        <div className="p-4 sm:p-5">
          {cargandoRespuestas ? (
            <RespuestasSkeleton />
          ) : errorCarga ? (
            <EstadoErrorCarga
              mensaje={errorCarga}
              onRetry={() =>
                void cargarRespuestas()
              }
            />
          ) : respuestas.length === 0 ? (
            <EstadoSinRespuestas
              pendiente={
                estadoNormalizado ===
                "pendiente"
              }
            />
          ) : (
            <div className="space-y-3">
              {respuestas.map(
                (respuesta) => (
                  <RespuestaCard
                    key={
                      respuesta.idRespuesta
                    }
                    respuesta={respuesta}
                  />
                ),
              )}
            </div>
          )}

          {permiteResponder ? (
            <form
              onSubmit={handleEnviarRespuesta}
              className="mt-5 border-t border-gray-100 pt-5"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="nueva-respuesta"
                  className="text-xs font-extrabold text-[#0A3D62]"
                >
                  Agregar información
                </label>

                <span className="text-[10px] tabular-nums text-gray-400">
                  {nuevaRespuesta.length} caracteres
                </span>
              </div>

              {errorEnvio && (
                <div
                  className="mb-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-red-700"
                  role="alert"
                >
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  <p className="min-w-0 flex-1 text-[11px] leading-5">
                    {errorEnvio}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setErrorEnvio("")
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label="Cerrar mensaje de error"
                  >
                    <X
                      size={14}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}

              <div className="group relative rounded-xl border border-gray-200 bg-[#F7FAFC] transition-all hover:border-[#0A3D62]/25 focus-within:border-[#0A3D62] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0A3D62]/10">
                <MessageSquareText
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-3.5 text-gray-400 transition-colors group-focus-within:text-[#0A3D62]"
                  aria-hidden="true"
                />

                <textarea
                  id="nueva-respuesta"
                  value={nuevaRespuesta}
                  onChange={(event) => {
                    setNuevaRespuesta(
                      event.target.value,
                    );

                    if (errorEnvio) {
                      setErrorEnvio("");
                    }
                  }}
                  rows={4}
                  placeholder="Escribe información adicional o una aclaración..."
                  disabled={enviando}
                  className="min-h-28 w-full resize-y rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />

                  <p className="max-w-md text-[10px] leading-4 text-gray-500">
                    Tu mensaje formará parte del
                    seguimiento de esta solicitud.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    enviando ||
                    !nuevaRespuesta.trim()
                  }
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(10,61,98,0.18)] transition-all hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0A3D62] disabled:hover:text-white"
                >
                  {enviando ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />

                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send
                        size={15}
                        strokeWidth={2}
                        className="transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />

                      Enviar mensaje
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <EstadoConversacionCerrada
              convertidaFaq={
                estadoNormalizado ===
                "convertida_faq"
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}

interface BadgeProps {
  configuracion: ConfiguracionBadge;
  Icono: LucideIcon;
}

function Badge({
  configuracion,
  Icono,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold",
        configuracion.clases,
      )}
    >
      <Icono
        size={12}
        strokeWidth={2}
        aria-hidden="true"
      />

      {configuracion.label}
    </span>
  );
}

interface DetalleInformativoProps {
  Icono: LucideIcon;
  etiqueta: string;
  valor: string;
}

function DetalleInformativo({
  Icono,
  etiqueta,
  valor,
}: DetalleInformativoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
        <Icono
          size={15}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400">
          {etiqueta}
        </p>

        <p
          className="mt-0.5 truncate text-[11px] font-bold text-gray-600"
          title={valor}
        >
          {valor}
        </p>
      </div>
    </div>
  );
}

interface RespuestaCardProps {
  respuesta: RespuestaAyuda;
}

function RespuestaCard({
  respuesta,
}: RespuestaCardProps) {
  const esAdmin = Boolean(
    respuesta.esRespuestaAdmin,
  );

  const esSolucion = Boolean(
    respuesta.esSolucion,
  );

  const nombreAutor =
    obtenerNombreUsuario(
      respuesta.usuario,
      esAdmin
        ? "Equipo médico"
        : "Usuario",
    );

  const contenido =
    respuesta.contenido?.trim() ||
    "Mensaje sin contenido.";

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        esAdmin
          ? "border-[#0A3D62]/15 bg-[#F1F6F9]"
          : "border-gray-200 bg-white sm:ml-8",
        esSolucion &&
          "border-emerald-200 bg-emerald-50/50",
      )}
    >
      {esAdmin && (
        <span
          className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-[#0A3D62]"
          aria-hidden="true"
        />
      )}

      {esSolucion && (
        <span
          className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500"
          aria-hidden="true"
        />
      )}

      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              esAdmin
                ? "bg-[#0A3D62] text-[#FFC300]"
                : "bg-[#EAF2F8] text-[#0A3D62]",
            )}
          >
            {esAdmin ? (
              <Stethoscope
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            ) : (
              <UserRound
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            )}
          </span>

          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-[#0A3D62]">
              {nombreAutor}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {esAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#0A3D62]/15 bg-white px-2 py-0.5 text-[9px] font-bold text-[#0A3D62]">
                  <ShieldCheck
                    size={10}
                    aria-hidden="true"
                  />

                  Equipo médico
                </span>
              )}

              {esSolucion && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  <CheckCircle2
                    size={10}
                    aria-hidden="true"
                  />

                  Solución
                </span>
              )}
            </div>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-gray-400">
          <CalendarDays
            size={12}
            aria-hidden="true"
          />

          {formatearFechaHora(
            respuesta.createdAt,
          )}
        </span>
      </header>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
        {contenido}
      </p>
    </article>
  );
}

function RespuestasSkeleton() {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-live="polite"
      aria-label="Cargando respuestas"
    >
      {Array.from({ length: 2 }).map(
        (_, index) => (
          <div
            key={index}
            className={cn(
              "animate-pulse rounded-2xl border border-gray-200 p-4",
              index === 1 && "sm:ml-8",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gray-200" />

              <div>
                <div className="h-3 w-28 rounded-full bg-gray-200" />
                <div className="mt-2 h-2 w-20 rounded-full bg-gray-100" />
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-gray-100" />
            <div className="mt-2 h-2.5 w-4/5 rounded-full bg-gray-100" />
          </div>
        ),
      )}

      <span className="sr-only">
        Cargando respuestas...
      </span>
    </div>
  );
}

interface EstadoErrorCargaProps {
  mensaje: string;
  onRetry: () => void;
}

function EstadoErrorCarga({
  mensaje,
  onRetry,
}: EstadoErrorCargaProps) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-center"
      role="alert"
    >
      <AlertCircle
        size={25}
        className="mx-auto text-red-600"
        aria-hidden="true"
      />

      <p className="mt-2 text-xs font-extrabold text-red-700">
        No se pudieron cargar las respuestas
      </p>

      <p className="mx-auto mt-1 max-w-md text-[11px] leading-5 text-red-600">
        {mensaje}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <RefreshCw
          size={14}
          aria-hidden="true"
        />

        Reintentar
      </button>
    </div>
  );
}

interface EstadoSinRespuestasProps {
  pendiente: boolean;
}

function EstadoSinRespuestas({
  pendiente,
}: EstadoSinRespuestasProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-5 text-center",
        pendiente
          ? "border-amber-200 bg-amber-50"
          : "border-[#0A3D62]/10 bg-[#F7FAFC]",
      )}
    >
      <span
        className={cn(
          "mx-auto flex h-11 w-11 items-center justify-center rounded-xl",
          pendiente
            ? "bg-amber-100 text-amber-700"
            : "bg-[#EAF2F8] text-[#0A3D62]",
        )}
      >
        {pendiente ? (
          <Clock3
            size={21}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        ) : (
          <MessageSquareText
            size={21}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        )}
      </span>

      <p
        className={cn(
          "mt-3 text-sm font-extrabold",
          pendiente
            ? "text-amber-800"
            : "text-[#0A3D62]",
        )}
      >
        {pendiente
          ? "Tu pregunta está en revisión"
          : "Todavía no hay respuestas"}
      </p>

      <p className="mx-auto mt-1 max-w-md text-[11px] leading-5 text-gray-500">
        {pendiente
          ? "El equipo revisará tu solicitud y recibirás una notificación cuando haya una respuesta."
          : "La conversación comenzará cuando se registre el primer mensaje."}
      </p>
    </div>
  );
}

interface EstadoConversacionCerradaProps {
  convertidaFaq: boolean;
}

function EstadoConversacionCerrada({
  convertidaFaq,
}: EstadoConversacionCerradaProps) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-[#F7FAFC] px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-600">
        {convertidaFaq ? (
          <BadgeCheck
            size={17}
            aria-hidden="true"
          />
        ) : (
          <Archive
            size={17}
            aria-hidden="true"
          />
        )}
      </span>

      <div>
        <p className="text-xs font-extrabold text-[#0A3D62]">
          {convertidaFaq
            ? "Pregunta publicada como FAQ"
            : "Conversación cerrada"}
        </p>

        <p className="mt-0.5 text-[10px] leading-5 text-gray-500">
          {convertidaFaq
            ? "Esta consulta fue resuelta y convertida en una pregunta frecuente."
            : "Esta solicitud ya no admite mensajes adicionales."}
        </p>
      </div>
    </div>
  );
}