"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleGauge,
  FileQuestion,
  FolderOpen,
  Loader2,
  LockKeyhole,
  MessageSquareText,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";

import type { CategoriaAyuda } from "@/types/help";

interface PreguntaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

type Prioridad =
  | "baja"
  | "normal"
  | "alta"
  | "urgente";

interface OpcionPrioridad {
  valor: Prioridad;
  titulo: string;
  descripcion: string;
  Icono: typeof CircleGauge;
  claseActiva: string;
  claseIcono: string;
}

const LIMITE_TITULO = 300;

const OPCIONES_PRIORIDAD: OpcionPrioridad[] = [
  {
    valor: "baja",
    titulo: "Baja",
    descripcion: "No requiere atención inmediata",
    Icono: CircleGauge,
    claseActiva:
      "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100",
    claseIcono:
      "bg-emerald-100 text-emerald-700",
  },
  {
    valor: "normal",
    titulo: "Normal",
    descripcion: "Consulta general",
    Icono: MessageSquareText,
    claseActiva:
      "border-[#0A3D62]/30 bg-[#EAF2F8] ring-2 ring-[#0A3D62]/10",
    claseIcono:
      "bg-[#0A3D62] text-[#FFC300]",
  },
  {
    valor: "alta",
    titulo: "Alta",
    descripcion: "Necesito una respuesta pronto",
    Icono: AlertTriangle,
    claseActiva:
      "border-amber-300 bg-amber-50 ring-2 ring-amber-100",
    claseIcono:
      "bg-amber-100 text-amber-700",
  },
  {
    valor: "urgente",
    titulo: "Urgente",
    descripcion: "Requiere atención prioritaria",
    Icono: CircleAlert,
    claseActiva:
      "border-red-300 bg-red-50 ring-2 ring-red-100",
    claseIcono:
      "bg-red-100 text-red-700",
  },
];

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
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

export default function PreguntaForm({
  onSuccess,
  onCancel,
}: PreguntaFormProps) {
  const successTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const [categorias, setCategorias] = useState<
    CategoriaAyuda[]
  >([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] =
    useState("");

  const [idCategoria, setIdCategoria] =
    useState<number | undefined>(undefined);

  const [prioridad, setPrioridad] =
    useState<Prioridad>("normal");

  const [esPrivada, setEsPrivada] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    cargandoCategorias,
    setCargandoCategorias,
  ] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cargarCategorias = async () => {
      try {
        setCargandoCategorias(true);

        const response = await fetch(
          "/api/soporte/categorias",
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            await obtenerMensajeError(response),
          );
        }

        const data =
          (await response.json()) as CategoriaAyuda[];

        setCategorias(
          Array.isArray(data) ? data : [],
        );
      } catch (errorCarga: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Error cargando categorías:",
          errorCarga,
        );

        setCategorias([]);
      } finally {
        if (!controller.signal.aborted) {
          setCargandoCategorias(false);
        }
      }
    };

    void cargarCategorias();

    return () => {
      controller.abort();

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setIdCategoria(undefined);
    setPrioridad("normal");
    setEsPrivada(false);
    setError("");
  };

  const handleTituloChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTitulo(event.target.value);
    setError("");
  };

  const handleDescripcionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescripcion(event.target.value);
    setError("");
  };

  const handleCategoriaChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const valor = event.target.value;

    setIdCategoria(
      valor ? Number(valor) : undefined,
    );
  };

  const validarFormulario = (): string | null => {
    const tituloLimpio = titulo.trim();
    const descripcionLimpia =
      descripcion.trim();

    if (!tituloLimpio) {
      return "Ingresa el título de tu pregunta.";
    }

    if (tituloLimpio.length < 5) {
      return "El título debe contener al menos 5 caracteres.";
    }

    if (!descripcionLimpia) {
      return "Describe tu pregunta para que podamos ayudarte.";
    }

    if (descripcionLimpia.length < 10) {
      return "La descripción debe contener al menos 10 caracteres.";
    }

    return null;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const errorValidacion =
      validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/soporte/preguntas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            idCategoria,
            prioridad,
            esPrivada,
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Debes iniciar sesión para enviar una pregunta.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Tu sesión no tiene permiso para enviar preguntas.",
          );
        }

        throw new Error(
          await obtenerMensajeError(response),
        );
      }

      limpiarFormulario();
      setSuccess(true);

      successTimerRef.current = setTimeout(
        () => {
          setSuccess(false);
          onSuccess?.();
        },
        1800,
      );
    } catch (errorEnvio: unknown) {
      console.error(
        "Error al enviar la pregunta:",
        errorEnvio,
      );

      setError(
        errorEnvio instanceof Error
          ? errorEnvio.message
          : "No fue posible enviar la pregunta.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-[0_18px_45px_rgba(10,61,98,0.10)] sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_12px_28px_rgba(5,150,105,0.22)]">
            <CheckCircle2
              size={32}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            <ShieldCheck
              size={12}
              aria-hidden="true"
            />

            Solicitud registrada
          </span>

          <h2 className="mt-3 text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
            Pregunta enviada correctamente
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Nuestro equipo revisará tu consulta y te
            notificará cuando haya una respuesta.
          </p>

          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-2.5">
            <Loader2
              size={14}
              className="animate-spin text-[#0A3D62]"
              aria-hidden="true"
            />

            <span className="text-[11px] font-semibold text-gray-500">
              Actualizando tus solicitudes
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_14px_40px_rgba(10,61,98,0.08)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A3D62] via-[#FFC300] to-[#0A3D62]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative p-4 sm:p-6">
        {/* Encabezado */}
        <header className="flex items-start gap-3 border-b border-gray-100 pb-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
            <FileQuestion
              size={21}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B88600]">
              Soporte personalizado
            </p>

            <h2 className="mt-0.5 text-lg font-extrabold text-[#0A3D62] sm:text-xl">
              Haz una pregunta
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Describe tu consulta con suficiente detalle
              para que podamos ayudarte mejor.
            </p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-red-700"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold">
                Revisa la información
              </p>

              <p className="mt-0.5 text-[11px] leading-5">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Cerrar mensaje de error"
            >
              <X
                size={15}
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        <fieldset
          disabled={loading}
          className="mt-5 space-y-5 disabled:opacity-70"
        >
          {/* Título */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="titulo"
                className="text-xs font-bold text-[#0A3D62]"
              >
                Título de la pregunta
                <span
                  className="ml-1 text-red-500"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <span
                className={cn(
                  "text-[10px] font-semibold tabular-nums",
                  titulo.length >=
                    LIMITE_TITULO * 0.9
                    ? "text-amber-600"
                    : "text-gray-400",
                )}
              >
                {titulo.length}/{LIMITE_TITULO}
              </span>
            </div>

            <div className="group relative rounded-xl border border-gray-200 bg-[#F7FAFC] transition-all hover:border-[#0A3D62]/25 focus-within:border-[#0A3D62] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0A3D62]/10">
              <MessageSquareText
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#0A3D62]"
                aria-hidden="true"
              />

              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={handleTituloChange}
                maxLength={LIMITE_TITULO}
                autoComplete="off"
                placeholder="Ej. ¿Cómo agendo una cita con un especialista?"
                aria-required="true"
                className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-sm font-medium text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Categoría y privacidad */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="categoria"
                className="mb-1.5 block text-xs font-bold text-[#0A3D62]"
              >
                Categoría
              </label>

              <div className="group relative rounded-xl border border-gray-200 bg-[#F7FAFC] transition-all hover:border-[#0A3D62]/25 focus-within:border-[#0A3D62] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0A3D62]/10">
                <FolderOpen
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A3D62]"
                  aria-hidden="true"
                />

                <select
                  id="categoria"
                  value={idCategoria ?? ""}
                  onChange={handleCategoriaChange}
                  disabled={
                    loading || cargandoCategorias
                  }
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-11 pr-10 text-sm font-medium text-gray-700 outline-none disabled:cursor-wait"
                >
                  <option value="">
                    {cargandoCategorias
                      ? "Cargando categorías..."
                      : "Selecciona una categoría"}
                  </option>

                  {categorias.map(
                    (categoria) => (
                      <option
                        key={
                          categoria.idCategoria
                        }
                        value={
                          categoria.idCategoria
                        }
                      >
                        {
                          categoria.nombreCategoria
                        }
                      </option>
                    ),
                  )}
                </select>

                {cargandoCategorias ? (
                  <Loader2
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-bold text-[#0A3D62]">
                Visibilidad
              </span>

              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-[#F7FAFC] px-3.5 transition-all hover:border-[#0A3D62]/25">
                <input
                  type="checkbox"
                  checked={esPrivada}
                  onChange={(event) =>
                    setEsPrivada(
                      event.target.checked,
                    )
                  }
                  className="peer sr-only"
                />

                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    esPrivada
                      ? "bg-[#0A3D62] text-[#FFC300]"
                      : "bg-[#EAF2F8] text-[#0A3D62]",
                  )}
                >
                  <LockKeyhole
                    size={16}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-gray-700">
                    Pregunta privada
                  </span>

                  <span className="block truncate text-[9px] text-gray-500">
                    Solo tú y el equipo autorizado
                  </span>
                </span>

                <span className="relative h-6 w-10 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#0A3D62] peer-focus-visible:ring-2 peer-focus-visible:ring-[#FFC300] peer-focus-visible:ring-offset-2">
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                </span>
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="mb-1.5 block text-xs font-bold text-[#0A3D62]"
            >
              Descripción detallada
              <span
                className="ml-1 text-red-500"
                aria-hidden="true"
              >
                *
              </span>
            </label>

            <div className="group relative rounded-xl border border-gray-200 bg-[#F7FAFC] transition-all hover:border-[#0A3D62]/25 focus-within:border-[#0A3D62] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0A3D62]/10">
              <MessageSquareText
                size={17}
                className="pointer-events-none absolute left-3.5 top-3.5 text-gray-400 transition-colors group-focus-within:text-[#0A3D62]"
                aria-hidden="true"
              />

              <textarea
                id="descripcion"
                value={descripcion}
                onChange={handleDescripcionChange}
                rows={5}
                placeholder="Incluye los detalles necesarios para comprender tu pregunta..."
                aria-required="true"
                className="min-h-32 w-full resize-y rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            <p className="mt-1.5 text-[10px] leading-4 text-gray-400">
              Evita compartir contraseñas, datos bancarios o
              información sensible innecesaria.
            </p>
          </div>

          {/* Prioridad */}
          <div>
            <div className="mb-2">
              <p className="text-xs font-bold text-[#0A3D62]">
                Prioridad
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500">
                Selecciona el nivel que mejor describa tu
                consulta.
              </p>
            </div>

            <div
              className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
              role="radiogroup"
              aria-label="Prioridad de la pregunta"
            >
              {OPCIONES_PRIORIDAD.map(
                ({
                  valor,
                  titulo: tituloPrioridad,
                  descripcion:
                    descripcionPrioridad,
                  Icono,
                  claseActiva,
                  claseIcono,
                }) => {
                  const seleccionada =
                    prioridad === valor;

                  return (
                    <label
                      key={valor}
                      className={cn(
                        "relative cursor-pointer rounded-xl border p-3 transition-all",
                        seleccionada
                          ? claseActiva
                          : "border-gray-200 bg-white hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC]",
                      )}
                    >
                      <input
                        type="radio"
                        name="prioridad"
                        value={valor}
                        checked={seleccionada}
                        onChange={() =>
                          setPrioridad(valor)
                        }
                        className="peer sr-only"
                      />

                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            seleccionada
                              ? claseIcono
                              : "bg-gray-100 text-gray-500",
                          )}
                        >
                          <Icono
                            size={16}
                            strokeWidth={1.9}
                            aria-hidden="true"
                          />
                        </span>

                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-xs font-extrabold",
                              seleccionada
                                ? "text-[#0A3D62]"
                                : "text-gray-700",
                            )}
                          >
                            {tituloPrioridad}
                          </span>

                          <span className="mt-0.5 block text-[9px] leading-4 text-gray-500">
                            {descripcionPrioridad}
                          </span>
                        </span>
                      </div>
                    </label>
                  );
                },
              )}
            </div>
          </div>
        </fieldset>

        {/* Acciones */}
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-extrabold text-gray-600 transition-colors hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={16}
                aria-hidden="true"
              />

              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-6 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(10,61,98,0.18)] transition-all hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-[#0A3D62] disabled:hover:text-white"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />

                Enviando pregunta...
              </>
            ) : (
              <>
                <Send
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />

                Enviar pregunta
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-3">
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-emerald-600"
            aria-hidden="true"
          />

          <p className="text-[10px] leading-5 text-gray-500">
            Debes tener una sesión activa para enviar una
            pregunta. La información será revisada por el
            equipo de soporte.
          </p>
        </div>
      </div>
    </form>
  );
}