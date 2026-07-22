"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  FileQuestion,
  Filter,
  LifeBuoy,
  Loader2,
  LockKeyhole,
  LogIn,
  MessageCircleQuestion,
  RefreshCw,
  SearchX,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import HelpHero from "@/components/public/ayuda/HelpHero";
import CategoriasSidebar from "@/components/public/ayuda/CategoriasSidebar";
import FAQList from "@/components/public/ayuda/FAQList";

import type {
  CategoriaAyuda,
  PreguntaFrecuente,
} from "@/types/help";

type EstadoSesion =
  | "verificando"
  | "autenticado"
  | "invitado";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

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

export default function AyudaPage() {
  const router = useRouter();

  const faqControllerRef =
    useRef<AbortController | null>(null);

  const [categorias, setCategorias] = useState<
    CategoriaAyuda[]
  >([]);

  const [faqs, setFaqs] = useState<
    PreguntaFrecuente[]
  >([]);

  const [
    categoriaActiva,
    setCategoriaActiva,
  ] = useState<number | null>(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    cargandoCategorias,
    setCargandoCategorias,
  ] = useState(true);

  const [errorFaqs, setErrorFaqs] =
    useState("");

  const [estadoSesion, setEstadoSesion] =
    useState<EstadoSesion>("verificando");

  const estaAutenticado =
    estadoSesion === "autenticado";

  const categoriaSeleccionada = useMemo(() => {
    if (categoriaActiva === null) {
      return null;
    }

    return (
      categorias.find(
        (categoria) =>
          categoria.idCategoria ===
          categoriaActiva,
      ) ?? null
    );
  }, [categoriaActiva, categorias]);

  const hayFiltrosActivos =
    categoriaActiva !== null ||
    Boolean(busqueda.trim());

  const verificarSesion =
    useCallback(async () => {
      try {
        const response = await fetch(
          "/api/soporte/preguntas?mis_preguntas=true",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (response.ok) {
          setEstadoSesion("autenticado");
          return;
        }

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          setEstadoSesion("invitado");
          return;
        }

        setEstadoSesion("invitado");
      } catch (error: unknown) {
        console.error(
          "Error verificando sesión:",
          error,
        );

        setEstadoSesion("invitado");
      }
    }, []);

  const cargarCategorias =
    useCallback(async () => {
      const controller =
        new AbortController();

      try {
        setCargandoCategorias(true);

        const response = await fetch(
          "/api/soporte/categorias",
          {
            signal: controller.signal,
            cache: "no-store",
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
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando categorías:",
          error,
        );

        setCategorias([]);
      } finally {
        if (!controller.signal.aborted) {
          setCargandoCategorias(false);
        }
      }

      return controller;
    }, []);

  const cargarFAQs = useCallback(
    async (
      categoria: number | null,
      query: string,
      mostrarCarga = true,
    ) => {
      faqControllerRef.current?.abort();

      const controller =
        new AbortController();

      faqControllerRef.current =
        controller;

      if (mostrarCarga) {
        setLoading(true);
      }

      setErrorFaqs("");

      try {
        const params =
          new URLSearchParams();

        if (categoria !== null) {
          params.set(
            "categoria",
            String(categoria),
          );
        }

        const busquedaLimpia =
          query.trim();

        if (busquedaLimpia) {
          params.set(
            "busqueda",
            busquedaLimpia,
          );
        }

        const queryString =
          params.toString();

        const endpoint = queryString
          ? `/api/soporte/faq?${queryString}`
          : "/api/soporte/faq";

        const response = await fetch(
          endpoint,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            await obtenerMensajeError(response),
          );
        }

        const data =
          (await response.json()) as PreguntaFrecuente[];

        if (!controller.signal.aborted) {
          setFaqs(
            Array.isArray(data) ? data : [],
          );
        }
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando preguntas frecuentes:",
          error,
        );

        setFaqs([]);

        setErrorFaqs(
          error instanceof Error
            ? error.message
            : "No fue posible cargar las preguntas frecuentes.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void verificarSesion();
    void cargarCategorias();
    void cargarFAQs(null, "");

    return () => {
      faqControllerRef.current?.abort();
    };
  }, [
    cargarCategorias,
    cargarFAQs,
    verificarSesion,
  ]);

  const handleSearch = (
    query: string,
  ) => {
    const busquedaLimpia =
      query.trim();

    setBusqueda(busquedaLimpia);

    void cargarFAQs(
      categoriaActiva,
      busquedaLimpia,
    );
  };

  const handleCategoriaClick = (
    idCategoria: number | null,
  ) => {
    setCategoriaActiva(idCategoria);

    void cargarFAQs(
      idCategoria,
      busqueda,
    );
  };

  const limpiarFiltros = () => {
    setCategoriaActiva(null);
    setBusqueda("");

    void cargarFAQs(null, "");
  };

  const handleValorarFAQ = async (
    idPregunta: number,
    esUtil: boolean,
  ) => {
    if (!estaAutenticado) {
      toast.info(
        "Inicia sesión para valorar esta respuesta.",
      );

      return;
    }

    try {
      const response = await fetch(
        `/api/soporte/faq/${idPregunta}/valorar`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            esUtil,
          }),
        },
      );

      if (!response.ok) {
        const mensaje =
          await obtenerMensajeError(response);

        if (response.status === 401) {
          setEstadoSesion("invitado");

          toast.info(
            "Tu sesión expiró. Inicia sesión para valorar.",
          );

          return;
        }

        if (
          mensaje
            .toLocaleLowerCase("es-MX")
            .includes("ya has valorado")
        ) {
          toast.info(
            "Ya habías valorado esta pregunta.",
          );

          return;
        }

        throw new Error(mensaje);
      }

      toast.success(
        "Gracias por compartir tu opinión.",
      );

      await cargarFAQs(
        categoriaActiva,
        busqueda,
        false,
      );
    } catch (error: unknown) {
      console.error(
        "Error al valorar la FAQ:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible registrar tu valoración.",
      );

      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <HelpHero onSearch={handleSearch} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Acciones según sesión */}
        <SessionBanner
          estadoSesion={estadoSesion}
          onPreguntaClick={() =>
            router.push("/ayuda/preguntas")
          }
          onLoginClick={() =>
            router.push(
              "/acceder?redirect=/ayuda/preguntas",
            )
          }
        />

        {/* Filtros activos */}
        {hayFiltrosActivos && (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-[0_5px_18px_rgba(10,61,98,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
                <Filter
                  size={15}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Filtros aplicados
                </p>

                <div className="mt-1 flex flex-wrap gap-1.5">
                  {categoriaSeleccionada && (
                    <span className="inline-flex items-center rounded-full border border-[#0A3D62]/10 bg-[#F1F6F9] px-2.5 py-1 text-[10px] font-bold text-[#0A3D62]">
                      {
                        categoriaSeleccionada.nombreCategoria
                      }
                    </span>
                  )}

                  {busqueda && (
                    <span className="inline-flex max-w-full items-center rounded-full border border-[#FFC300]/40 bg-[#FFF8D9] px-2.5 py-1 text-[10px] font-bold text-[#795B00]">
                      <span className="max-w-64 truncate">
                        “{busqueda}”
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition-colors hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            >
              <X
                size={14}
                aria-hidden="true"
              />

              Limpiar filtros
            </button>
          </div>
        )}

        {/* Sidebar y preguntas */}
        <div className="mt-6 grid items-start gap-6 overflow-visible lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          <CategoriasSidebar
            categorias={categorias}
            categoriaActiva={
              categoriaActiva
            }
            onCategoriaClick={
              handleCategoriaClick
            }
          />

          <section
            className="min-w-0"
            aria-labelledby="faq-title"
          >
            <header className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-[0_5px_18px_rgba(10,61,98,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                  <CircleHelp
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B88600]">
                    Respuestas rápidas
                  </p>

                  <h1
                    id="faq-title"
                    className="mt-0.5 text-lg font-extrabold text-[#0A3D62] sm:text-xl"
                  >
                    Preguntas frecuentes
                  </h1>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Selecciona una pregunta para consultar
                    su respuesta.
                  </p>
                </div>
              </div>

              {!loading && !errorFaqs && (
                <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62]">
                  {faqs.length}{" "}
                  {faqs.length === 1
                    ? "resultado"
                    : "resultados"}
                </span>
              )}
            </header>

            {errorFaqs ? (
              <EstadoError
                mensaje={errorFaqs}
                onRetry={() =>
                  void cargarFAQs(
                    categoriaActiva,
                    busqueda,
                  )
                }
              />
            ) : (
              <FAQList
                faqs={faqs}
                loading={loading}
                estaAutenticado={
                  estaAutenticado
                }
                onValorar={
                  handleValorarFAQ
                }
              />
            )}
          </section>
        </div>

        {cargandoCategorias && (
          <p
            className="sr-only"
            role="status"
          >
            Cargando categorías...
          </p>
        )}
      </div>
    </main>
  );
}

interface SessionBannerProps {
  estadoSesion: EstadoSesion;
  onPreguntaClick: () => void;
  onLoginClick: () => void;
}

function SessionBanner({
  estadoSesion,
  onPreguntaClick,
  onLoginClick,
}: SessionBannerProps) {
  if (estadoSesion === "verificando") {
    return (
      <section
        className="flex min-h-24 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-[0_7px_22px_rgba(10,61,98,0.05)] sm:px-5"
        aria-live="polite"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
          <Loader2
            size={19}
            className="animate-spin"
            aria-hidden="true"
          />
        </span>

        <div>
          <p className="text-sm font-extrabold text-[#0A3D62]">
            Verificando tu sesión
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Estamos preparando las opciones disponibles
            para tu cuenta.
          </p>
        </div>
      </section>
    );
  }

  if (estadoSesion === "autenticado") {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-[#0A3D62]/15 bg-white px-4 py-4 shadow-[0_8px_26px_rgba(10,61,98,0.06)] sm:px-5">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FFC300]/12 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <MessageCircleQuestion
                size={20}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-extrabold text-[#0A3D62]">
                ¿No encuentras lo que buscas?
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Envía una consulta directamente al equipo
                y revisa el seguimiento desde tu cuenta.
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                <ShieldCheck
                  size={13}
                  aria-hidden="true"
                />

                Sesión activa
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPreguntaClick}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(10,61,98,0.18)] transition-all hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
          >
            <FileQuestion
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />

            Hacer una pregunta
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 shadow-[0_8px_26px_rgba(10,61,98,0.05)] sm:px-5">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FFC300]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
            <LockKeyhole
              size={20}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Accede para recibir soporte personalizado
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800/80">
              Inicia sesión para enviar preguntas, consultar
              respuestas y valorar las preguntas frecuentes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLoginClick}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 text-xs font-extrabold text-[#0A3D62] shadow-sm transition-all hover:bg-[#0A3D62] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2"
        >
          <LogIn
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />

          Iniciar sesión
        </button>
      </div>
    </section>
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <SearchX
          size={25}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-4 text-lg font-extrabold text-[#0A3D62]">
        No pudimos cargar las preguntas
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
  );
}