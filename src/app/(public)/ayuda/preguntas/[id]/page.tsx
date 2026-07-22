"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  CircleAlert,
  FileQuestion,
  Loader2,
  MessageCircleQuestion,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import PreguntaDetalle from "@/components/public/ayuda/PreguntaDetalle";

import type { PreguntaUsuario } from "@/types/help";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

type PreguntaResponse =
  | PreguntaUsuario
  | {
      pregunta?: PreguntaUsuario;
    };

function obtenerPregunta(
  data: PreguntaResponse,
): PreguntaUsuario | null {
  if (
    "idPregunta" in data &&
    data.idPregunta
  ) {
    return data;
  }

  if (
    "pregunta" in data &&
    data.pregunta
  ) {
    return data.pregunta;
  }

  return null;
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
      "No fue posible cargar la pregunta."
    );
  } catch {
    return "No fue posible cargar la pregunta.";
  }
}

export default function PreguntaDetallePage() {
  const router = useRouter();

  const params = useParams<{
    id: string;
  }>();

  const id = params?.id;

  const [pregunta, setPregunta] =
    useState<PreguntaUsuario | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [redireccionando, setRedireccionando] =
    useState(false);

  const [error, setError] =
    useState("");

  const cargarPregunta = useCallback(
    async (signal?: AbortSignal) => {
      let debeFinalizarCarga = true;

      if (
        !id ||
        !/^\d+$/.test(id)
      ) {
        setPregunta(null);
        setError(
          "El identificador de la pregunta no es válido.",
        );
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/soporte/preguntas/${id}`,
          {
            credentials: "include",
            cache: "no-store",
            signal,
          },
        );

        if (response.status === 401) {
          debeFinalizarCarga = false;
          setRedireccionando(true);

          router.replace(
            `/acceder?redirect=${encodeURIComponent(
              `/ayuda/preguntas/${id}`,
            )}`,
          );

          return;
        }

        if (response.status === 403) {
          throw new Error(
            "No tienes permiso para consultar esta pregunta.",
          );
        }

        if (response.status === 404) {
          throw new Error(
            "La pregunta que buscas no existe o ya no está disponible.",
          );
        }

        if (!response.ok) {
          throw new Error(
            await obtenerMensajeError(response),
          );
        }

        const data =
          (await response.json()) as PreguntaResponse;

        const preguntaObtenida =
          obtenerPregunta(data);

        if (!preguntaObtenida) {
          throw new Error(
            "La respuesta del servidor no contiene una pregunta válida.",
          );
        }

        if (!signal?.aborted) {
          setPregunta(preguntaObtenida);
        }
      } catch (errorCarga: unknown) {
        if (
          errorCarga instanceof DOMException &&
          errorCarga.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando la pregunta:",
          errorCarga,
        );

        setPregunta(null);

        setError(
          errorCarga instanceof Error
            ? errorCarga.message
            : "No fue posible cargar la pregunta.",
        );
      } finally {
        if (
          !signal?.aborted &&
          debeFinalizarCarga
        ) {
          setLoading(false);
        }
      }
    },
    [id, router],
  );

  useEffect(() => {
    const controller =
      new AbortController();

    void cargarPregunta(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [cargarPregunta]);

  const volverAPreguntas = () => {
    router.push("/ayuda/preguntas");
  };

  if (loading || redireccionando) {
    return (
      <EstadoCarga
        redireccionando={redireccionando}
      />
    );
  }

  if (error || !pregunta) {
    return (
      <EstadoError
        mensaje={
          error ||
          "La pregunta solicitada no está disponible."
        }
        onVolver={volverAPreguntas}
        onRetry={() => {
          void cargarPregunta();
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      {/* Encabezado */}
      <section className="relative overflow-hidden bg-[#0A3D62] text-white">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <button
            type="button"
            onClick={volverAPreguntas}
            className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />

            Volver a mis preguntas
          </button>

          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:h-14 sm:w-14">
              <MessageCircleQuestion
                size={26}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#FFC300]">
                <ShieldCheck
                  size={11}
                  aria-hidden="true"
                />

                Seguimiento de soporte
              </span>

              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Detalle de la pregunta
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/70">
                Consulta el estado, la información registrada
                y la conversación con el equipo de soporte.
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* Contenido */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3.5 shadow-[0_5px_18px_rgba(10,61,98,0.04)]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <FileQuestion
              size={17}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-extrabold text-[#0A3D62]">
              Solicitud #{pregunta.idPregunta}
            </p>

            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              La conversación y los mensajes de esta sección
              solo están disponibles para usuarios autorizados.
            </p>
          </div>
        </div>

        <PreguntaDetalle
          pregunta={pregunta}
        />
      </div>
    </main>
  );
}

interface EstadoCargaProps {
  redireccionando: boolean;
}

function EstadoCarga({
  redireccionando,
}: EstadoCargaProps) {
  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <section className="relative overflow-hidden bg-[#0A3D62]">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="h-9 w-44 animate-pulse rounded-lg bg-white/10" />

          <div className="mt-6 flex animate-pulse items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10" />

            <div>
              <div className="h-4 w-36 rounded-full bg-white/10" />
              <div className="mt-3 h-7 w-64 max-w-full rounded-full bg-white/15" />
              <div className="mt-3 h-3 w-80 max-w-full rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div
          className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={19}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm font-extrabold text-[#0A3D62]">
              {redireccionando
                ? "Redirigiendo al inicio de sesión"
                : "Cargando la pregunta"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {redireccionando
                ? "Debes autenticarte para consultar esta solicitud."
                : "Estamos consultando la información y sus respuestas."}
            </p>
          </div>
        </div>

        <DetalleSkeleton />
      </div>
    </main>
  );
}

function DetalleSkeleton() {
  return (
    <div
      className="space-y-5"
      aria-hidden="true"
    >
      <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200" />

          <div className="flex-1">
            <div className="h-3 w-32 rounded-full bg-gray-200" />
            <div className="mt-3 h-5 w-3/4 rounded-full bg-gray-200" />
          </div>

          <div className="h-7 w-24 rounded-full bg-gray-100" />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <div className="h-3 w-full rounded-full bg-gray-200" />
          <div className="mt-3 h-3 w-5/6 rounded-full bg-gray-200" />
          <div className="mt-3 h-3 w-2/3 rounded-full bg-gray-200" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-14 rounded-xl bg-gray-100"
              />
            ),
          )}
        </div>
      </div>

      <div className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
          <div className="h-4 w-32 rounded-full bg-gray-200" />
        </div>

        <div className="space-y-3 p-5">
          <div className="h-28 rounded-2xl bg-gray-100" />
          <div className="ml-0 h-28 rounded-2xl bg-gray-100 sm:ml-8" />
        </div>
      </div>
    </div>
  );
}

interface EstadoErrorProps {
  mensaje: string;
  onVolver: () => void;
  onRetry: () => void;
}

function EstadoError({
  mensaje,
  onVolver,
  onRetry,
}: EstadoErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FAFC] px-4 py-10">
      <section
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-red-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(10,61,98,0.10)] sm:p-8"
        role="alert"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-100 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <CircleAlert
              size={30}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.13em] text-red-600">
            No disponible
          </p>

          <h1 className="mt-2 text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
            No pudimos mostrar la pregunta
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {mensaje}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onVolver}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-xs font-extrabold text-gray-600 transition-colors hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            >
              <ArrowLeft
                size={15}
                aria-hidden="true"
              />

              Volver a mis preguntas
            </button>

            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 text-xs font-extrabold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            >
              <RefreshCw
                size={15}
                aria-hidden="true"
              />

              Reintentar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}