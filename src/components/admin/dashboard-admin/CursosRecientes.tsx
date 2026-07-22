"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  MonitorSmartphone,
  Tag,
  UserRound,
  Users,
} from "lucide-react";

import type { CursoDashboard } from "@/types/dashboard-admin";

interface CursosRecientesProps {
  cursos: CursoDashboard[];
  onCursoActualizado?: () => void;
}

interface RespuestaActualizacion {
  message?: string;
  error?: string;
  curso?: {
    idCurso: number;
    tituloCurso: string;
    activo: boolean;
    updatedAt: string | null;
  };
}

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

function limitarPorcentaje(
  valor: number,
): number {
  return Math.min(
    100,
    Math.max(0, valor),
  );
}

function formatearFecha(
  fecha: string | null,
): string {
  if (!fecha) {
    return "Fecha por definir";
  }

  const fechaNormalizada =
    fecha.length === 10
      ? `${fecha}T00:00:00`
      : fecha;

  const valor = new Date(
    fechaNormalizada,
  );

  if (Number.isNaN(valor.getTime())) {
    return "Fecha no disponible";
  }

  return valor.toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatearMoneda(
  valor: number | null | undefined,
): string {
  return FORMATEADOR_MONEDA.format(
    numeroSeguro(valor),
  );
}

function obtenerClaseEstado(
  estado: string,
): string {
  const valor = estado
    .trim()
    .toLocaleLowerCase("es-MX");

  if (
    valor.includes("curso") ||
    valor.includes("activo") ||
    valor.includes("abierta")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    valor.includes("próximo") ||
    valor.includes("proximo") ||
    valor.includes("publicado")
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (
    valor.includes("completo") ||
    valor.includes("cerrada")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    valor.includes("cancelado") ||
    valor.includes("inactivo")
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (valor.includes("finalizado")) {
    return "border-gray-200 bg-gray-100 text-gray-600";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function obtenerClaseOcupacion(
  porcentaje: number,
): string {
  if (porcentaje >= 100) {
    return "bg-red-500";
  }

  if (porcentaje >= 80) {
    return "bg-amber-500";
  }

  if (porcentaje >= 40) {
    return "bg-blue-500";
  }

  return "bg-emerald-500";
}

async function leerRespuesta(
  response: Response,
): Promise<RespuestaActualizacion> {
  const contenido =
    await response.text();

  if (!contenido.trim()) {
    return {};
  }

  try {
    return JSON.parse(
      contenido,
    ) as RespuestaActualizacion;
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta inválida.",
    );
  }
}

export function CursosRecientes({
  cursos,
  onCursoActualizado,
}: CursosRecientesProps) {
  const router = useRouter();

  const [listaCursos, setListaCursos] =
    useState<CursoDashboard[]>(cursos);

  const [
    cursoActualizando,
    setCursoActualizando,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [
    mensajeExito,
    setMensajeExito,
  ] = useState<string | null>(null);

  useEffect(() => {
    setListaCursos(cursos);
  }, [cursos]);

  useEffect(() => {
    if (!mensajeExito) {
      return;
    }

    const temporizador =
      window.setTimeout(() => {
        setMensajeExito(null);
      }, 3000);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [mensajeExito]);

  const cambiarVisibilidad = async (
    curso: CursoDashboard,
  ) => {
    if (cursoActualizando !== null) {
      return;
    }

    const nuevoEstado =
      !curso.activo;

    try {
      setCursoActualizando(
        curso.idCurso,
      );

      setError(null);
      setMensajeExito(null);

      const response = await fetch(
        "/api/cursos",
        {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            idCurso: curso.idCurso,
            activo: nuevoEstado,
          }),
        },
      );

      const resultado =
        await leerRespuesta(response);

      if (response.status === 401) {
        router.replace(
          `/acceder?redirect=${encodeURIComponent(
            "/admin/dashboard",
          )}`,
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          resultado.error ||
            "No fue posible actualizar el curso.",
        );
      }

      setListaCursos(
        (cursosActuales) =>
          cursosActuales.map(
            (cursoActual) =>
              cursoActual.idCurso ===
              curso.idCurso
                ? {
                    ...cursoActual,
                    activo: nuevoEstado,
                    estadoCurso:
                      nuevoEstado
                        ? "Activo"
                        : "Inactivo",
                  }
                : cursoActual,
          ),
      );

      setMensajeExito(
        resultado.message ??
          (nuevoEstado
            ? "El curso ahora está visible."
            : "El curso ahora está oculto."),
      );

      onCursoActualizado?.();
    } catch (
      errorActualizacion: unknown
    ) {
      console.error(
        "Error actualizando curso:",
        errorActualizacion,
      );

      setError(
        errorActualizacion instanceof Error
          ? errorActualizacion.message
          : "No fue posible actualizar el curso.",
      );
    } finally {
      setCursoActualizando(null);
    }
  };

  const activarScroll =
    listaCursos.length > 4;

  return (
    <section className="flex h-full min-h-[650px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <BookOpen
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Cursos recientes
              </h2>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                {listaCursos.length} mostrados
              </span>
            </div>

            <p className="mt-0.5 text-xs text-gray-500">
              Ocupación y visibilidad
            </p>
          </div>
        </div>

        <Link
          href="/admin/cursos-admin"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-[#0A3D62] transition-colors hover:text-[#D69E00]"
        >
          Ver todos

          <ArrowRight
            size={14}
            aria-hidden="true"
          />
        </Link>
      </header>

      {(error || mensajeExito) && (
        <div
          className="px-5 pt-4"
          aria-live="polite"
        >
          {error && (
            <div
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              role="alert"
            >
              <AlertCircle
                size={15}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="min-w-0 flex-1">
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
                className="font-extrabold underline underline-offset-2"
              >
                Cerrar
              </button>
            </div>
          )}

          {mensajeExito && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2
                size={15}
                className="shrink-0"
                aria-hidden="true"
              />

              {mensajeExito}
            </div>
          )}
        </div>
      )}

      {listaCursos.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <GraduationCap
              size={26}
              className="mx-auto text-gray-300"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-bold text-gray-700">
              No hay cursos registrados
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 space-y-3 p-5",
            activarScroll &&
              "max-h-[860px] overflow-y-auto overscroll-contain pr-3",
          )}
          style={
            activarScroll
              ? {
                  scrollbarGutter:
                    "stable",
                }
              : undefined
          }
          aria-label="Listado de cursos recientes"
        >
          {listaCursos.map((curso) => {
            const actualizando =
              cursoActualizando ===
              curso.idCurso;

            const porcentaje =
              limitarPorcentaje(
                numeroSeguro(
                  curso.porcentajeOcupacion,
                ),
              );

            const estado =
              curso.estadoCurso ||
              (curso.activo
                ? "Activo"
                : "Inactivo");

            return (
              <article
                key={curso.idCurso}
                className={cn(
                  "min-h-[180px] rounded-2xl border p-4 transition-all",
                  curso.activo
                    ? "border-gray-200 bg-white hover:border-[#0A3D62]/25 hover:shadow-sm"
                    : "border-gray-200 bg-gray-50 opacity-80",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-extrabold text-[#0A3D62]">
                        {curso.tituloCurso}
                      </h3>

                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                          obtenerClaseEstado(
                            estado,
                          ),
                        )}
                      >
                        {estado}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          curso.activo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {curso.activo
                          ? "Visible"
                          : "Oculto"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <UserRound
                          size={13}
                          aria-hidden="true"
                        />

                        {curso.instructor ||
                          "Sin instructor"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Tag
                          size={13}
                          aria-hidden="true"
                        />

                        {curso.categoria ||
                          "Sin categoría"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <MonitorSmartphone
                          size={13}
                          aria-hidden="true"
                        />

                        {curso.modalidad ||
                          "Sin modalidad"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void cambiarVisibilidad(
                        curso,
                      );
                    }}
                    disabled={
                      actualizando ||
                      cursoActualizando !== null
                    }
                    aria-pressed={
                      curso.activo
                    }
                    aria-label={
                      curso.activo
                        ? `Ocultar el curso ${curso.tituloCurso}`
                        : `Mostrar el curso ${curso.tituloCurso}`
                    }
                    title={
                      curso.activo
                        ? "Ocultar curso"
                        : "Mostrar curso"
                    }
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-extrabold transition-colors",
                      curso.activo
                        ? "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        : "border-[#0A3D62]/20 bg-white text-[#0A3D62] hover:bg-[#F1F6F9]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {actualizando ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : curso.activo ? (
                      <EyeOff
                        size={15}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={15}
                        aria-hidden="true"
                      />
                    )}

                    <span className="hidden sm:inline">
                      {actualizando
                        ? "Guardando"
                        : curso.activo
                          ? "Ocultar"
                          : "Mostrar"}
                    </span>
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                      <CalendarDays
                        size={12}
                        aria-hidden="true"
                      />

                      Inicio
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-700">
                      {formatearFecha(
                        curso.fechaInicio,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                      <Users
                        size={12}
                        aria-hidden="true"
                      />

                      Cupos
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-700">
                      {numeroSeguro(
                        curso.cuposOcupados,
                      )}{" "}
                      de{" "}
                      {numeroSeguro(
                        curso.cupoMaximo,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                      <GraduationCap
                        size={12}
                        aria-hidden="true"
                      />

                      Inscripciones
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-700">
                      {numeroSeguro(
                        curso.totalInscripciones,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                      <BadgeDollarSign
                        size={12}
                        aria-hidden="true"
                      />

                      Ingresos
                    </p>

                    <p className="mt-1 truncate text-xs font-bold text-gray-700">
                      {formatearMoneda(
                        curso.ingresosAprobados,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      Ocupación
                    </span>

                    <span className="text-xs font-extrabold text-[#0A3D62]">
                      {porcentaje.toLocaleString(
                        "es-MX",
                        {
                          maximumFractionDigits: 1,
                        },
                      )}
                      %
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-gray-100"
                    role="progressbar"
                    aria-label={`Ocupación de ${curso.tituloCurso}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={porcentaje}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        obtenerClaseOcupacion(
                          porcentaje,
                        ),
                      )}
                      style={{
                        width: `${porcentaje}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}