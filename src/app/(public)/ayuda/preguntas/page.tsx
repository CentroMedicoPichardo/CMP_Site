"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleHelp,
  FileQuestion,
  Inbox,
  Loader2,
  MessageCircleQuestion,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import PreguntaForm from "@/components/public/ayuda/PreguntaForm";
import MisPreguntasList from "@/components/public/ayuda/MisPreguntasList";

import type { PreguntaUsuario } from "@/types/help";

type VistaActiva = "preguntas" | "formulario";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

type PreguntasResponse =
  | PreguntaUsuario[]
  | {
      preguntas?: PreguntaUsuario[];
    };

function cn(
  ...clases: Array<string | false | null | undefined>
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

function obtenerPreguntas(
  data: PreguntasResponse,
): PreguntaUsuario[] {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.preguntas)
    ? data.preguntas
    : [];
}

export default function MisPreguntasPage() {
  const router = useRouter();

  const [preguntas, setPreguntas] = useState<
    PreguntaUsuario[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [vistaActiva, setVistaActiva] =
    useState<VistaActiva>("preguntas");

  const totalPendientes = useMemo(
    () =>
      preguntas.filter(
        (pregunta) =>
          String(pregunta.estado)
            .trim()
            .toLocaleLowerCase("es-MX") ===
          "pendiente",
      ).length,
    [preguntas],
  );

  const totalRespondidas = useMemo(
    () =>
      preguntas.filter((pregunta) => {
        const estado = String(
          pregunta.estado,
        )
          .trim()
          .toLocaleLowerCase("es-MX");

        return (
          estado === "respondida" ||
          estado === "cerrada" ||
          estado === "convertida_faq"
        );
      }).length,
    [preguntas],
  );

  const cargarPreguntas =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/soporte/preguntas?mis_preguntas=true",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (response.status === 401) {
          router.replace(
            "/acceder?redirect=/ayuda/preguntas",
          );

          return;
        }

        if (response.status === 403) {
          throw new Error(
            "Tu cuenta no tiene permiso para consultar estas preguntas.",
          );
        }

        if (!response.ok) {
          throw new Error(
            await obtenerMensajeError(response),
          );
        }

        const data =
          (await response.json()) as PreguntasResponse;

        setPreguntas(
          obtenerPreguntas(data),
        );
      } catch (errorCarga: unknown) {
        console.error(
          "Error cargando preguntas:",
          errorCarga,
        );

        setError(
          errorCarga instanceof Error
            ? errorCarga.message
            : "No fue posible cargar tus preguntas.",
        );
      } finally {
        setLoading(false);
      }
    }, [router]);

  useEffect(() => {
    void cargarPreguntas();
  }, [cargarPreguntas]);

  const mostrarFormulario = () => {
    setVistaActiva("formulario");

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const mostrarPreguntas = () => {
    setVistaActiva("preguntas");

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const handleRegistroExitoso =
    async () => {
      setVistaActiva("preguntas");
      await cargarPreguntas();
    };

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A3D62] text-white">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
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

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push("/ayuda")
            }
            className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />

            Volver al centro de ayuda
          </button>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                <MessageCircleQuestion
                  size={27}
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

                  Soporte personalizado
                </span>

                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                  Mis preguntas
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                  Envía consultas y revisa las respuestas
                  proporcionadas por el equipo de soporte.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                vistaActiva === "formulario"
                  ? mostrarPreguntas
                  : mostrarFormulario
              }
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 text-xs font-extrabold text-[#0A3D62] shadow-[0_9px_22px_rgba(0,0,0,0.14)] transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A3D62]"
            >
              {vistaActiva === "formulario" ? (
                <>
                  <Inbox
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  Ver mis preguntas
                </>
              ) : (
                <>
                  <Plus
                    size={17}
                    strokeWidth={2.2}
                    className="transition-transform group-hover:rotate-90"
                    aria-hidden="true"
                  />

                  Nueva pregunta
                </>
              )}
            </button>
          </div>

          {/* Resumen */}
          <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
            <ResumenHero
              Icono={Inbox}
              etiqueta="Preguntas registradas"
              valor={
                loading
                  ? "—"
                  : String(preguntas.length)
              }
            />

            <ResumenHero
              Icono={FileQuestion}
              etiqueta="Pendientes"
              valor={
                loading
                  ? "—"
                  : String(totalPendientes)
              }
            />

            <ResumenHero
              Icono={ShieldCheck}
              etiqueta="Atendidas"
              valor={
                loading
                  ? "—"
                  : String(totalRespondidas)
              }
            />
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* Contenido */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Selector de vista */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-[0_8px_26px_rgba(10,61,98,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div
            className="grid grid-cols-2 gap-1.5"
            role="tablist"
            aria-label="Secciones de preguntas"
          >
            <BotonVista
              activo={
                vistaActiva === "preguntas"
              }
              Icono={Inbox}
              texto="Mis preguntas"
              onClick={mostrarPreguntas}
            />

            <BotonVista
              activo={
                vistaActiva === "formulario"
              }
              Icono={Plus}
              texto="Nueva pregunta"
              onClick={mostrarFormulario}
            />
          </div>

          <div className="hidden items-center gap-2 px-2 text-[10px] font-medium text-gray-500 sm:flex">
            <CircleHelp
              size={14}
              className="text-[#0A3D62]"
              aria-hidden="true"
            />

            Consulta el seguimiento de tus solicitudes
          </div>
        </div>

        {vistaActiva === "formulario" ? (
          <section aria-labelledby="form-title">
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3.5 shadow-[0_5px_18px_rgba(10,61,98,0.04)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                <FileQuestion
                  size={17}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2
                  id="form-title"
                  className="text-sm font-extrabold text-[#0A3D62]"
                >
                  Crear una nueva pregunta
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Incluye suficiente información para que
                  el equipo pueda comprender y atender tu
                  solicitud.
                </p>
              </div>
            </div>

            <PreguntaForm
              onSuccess={() => {
                void handleRegistroExitoso();
              }}
              onCancel={mostrarPreguntas}
            />
          </section>
        ) : (
          <section aria-labelledby="questions-title">
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-[0_5px_18px_rgba(10,61,98,0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                  <Inbox
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#B88600]">
                    Historial de soporte
                  </p>

                  <h2
                    id="questions-title"
                    className="mt-0.5 text-base font-extrabold text-[#0A3D62] sm:text-lg"
                  >
                    Consultas registradas
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Selecciona una pregunta para consultar
                    la conversación y su estado.
                  </p>
                </div>
              </div>

              {!loading && !error && (
                <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62]">
                  {preguntas.length}{" "}
                  {preguntas.length === 1
                    ? "pregunta"
                    : "preguntas"}
                </span>
              )}
            </div>

            {error ? (
              <EstadoError
                mensaje={error}
                onRetry={() =>
                  void cargarPreguntas()
                }
              />
            ) : (
              <MisPreguntasList
                preguntas={preguntas}
                loading={loading}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}

interface ResumenHeroProps {
  Icono: typeof Inbox;
  etiqueta: string;
  valor: string;
}

function ResumenHero({
  Icono,
  etiqueta,
  valor,
}: ResumenHeroProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3.5 py-3 backdrop-blur-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFC300]">
        <Icono
          size={17}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0">
        <p className="text-lg font-black leading-none text-white">
          {valor}
        </p>

        <p className="mt-1 truncate text-[10px] font-semibold text-white/60">
          {etiqueta}
        </p>
      </div>
    </div>
  );
}

interface BotonVistaProps {
  activo: boolean;
  Icono: typeof Inbox;
  texto: string;
  onClick: () => void;
}

function BotonVista({
  activo,
  Icono,
  texto,
  onClick,
}: BotonVistaProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={activo}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]",
        activo
          ? "bg-[#0A3D62] text-white shadow-[0_6px_16px_rgba(10,61,98,0.16)]"
          : "bg-[#F7FAFC] text-gray-500 hover:bg-[#EAF2F8] hover:text-[#0A3D62]",
      )}
    >
      <Icono
        size={15}
        strokeWidth={2}
        className={
          activo
            ? "text-[#FFC300]"
            : ""
        }
        aria-hidden="true"
      />

      {texto}
    </button>
  );
}

interface EstadoErrorProps {
  mensaje: string;
  onRetry: () => void;
}

function EstadoError({
  mensaje,
  onRetry,
}: EstadoErrorProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-red-200 bg-white px-5 py-10 text-center shadow-[0_8px_26px_rgba(10,61,98,0.05)]"
      role="alert"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-100 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <CircleHelp
            size={25}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-4 text-lg font-extrabold text-[#0A3D62]">
          No pudimos cargar tus preguntas
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          {mensaje}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
        >
          <RefreshCw
            size={15}
            aria-hidden="true"
          />

          Reintentar
        </button>
      </div>
    </div>
  );
}