"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  Edit3,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  MapPin,
  MonitorPlay,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { adminRoutes } from "@/config/routes";
import type { Curso } from "@/types/cursos";

interface CursosGridProps {
  cursos: Curso[];
  loading: boolean;
  onEdit: (curso: Curso) => void;
  onToggleActivo: (curso: Curso) => void;
}

const CURSOS_POR_PAGINA = 10;

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
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

function obtenerImagenCurso(
  curso: Curso,
): string | null {
  if (
    typeof curso.urlImagenPortada ===
      "string" &&
    curso.urlImagenPortada.trim()
  ) {
    return curso.urlImagenPortada.trim();
  }

  if (
    typeof curso.imagenSrc === "string" &&
    curso.imagenSrc.trim()
  ) {
    return curso.imagenSrc.trim();
  }

  return null;
}

function obtenerFecha(
  fecha: string | null | undefined,
): Date | null {
  if (!fecha) {
    return null;
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return null;
  }

  return valor;
}

function formatearFecha(
  fecha: string | null | undefined,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Por definir";
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

function formatearCosto(
  costo: unknown,
): string {
  const valor = numeroSeguro(costo);

  if (valor <= 0) {
    return "Sin costo";
  }

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    },
  ).format(valor);
}

function generarPaginasVisibles(
  paginaActual: number,
  totalPaginas: number,
): Array<
  number | "izquierda" | "derecha"
> {
  if (totalPaginas <= 7) {
    return Array.from(
      {
        length: totalPaginas,
      },
      (_, indice) => indice + 1,
    );
  }

  if (paginaActual <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "derecha",
      totalPaginas,
    ];
  }

  if (
    paginaActual >=
    totalPaginas - 3
  ) {
    return [
      1,
      "izquierda",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "izquierda",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "derecha",
    totalPaginas,
  ];
}

export function CursosGrid({
  cursos,
  loading,
  onEdit,
  onToggleActivo,
}: CursosGridProps) {
  const router = useRouter();

  const seccionRef =
    useRef<HTMLElement>(null);

  const [
    imageErrors,
    setImageErrors,
  ] = useState<Record<number, boolean>>(
    {},
  );

  const [
    paginaActual,
    setPaginaActual,
  ] = useState(1);

  const firmaCursos = useMemo(
    () =>
      cursos
        .map((curso) => curso.idCurso)
        .join("|"),
    [cursos],
  );

  const totalCursos = cursos.length;

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      totalCursos / CURSOS_POR_PAGINA,
    ),
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [firmaCursos]);

  useEffect(() => {
    if (
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }
  }, [
    paginaActual,
    totalPaginas,
  ]);

  const cursosPagina = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      CURSOS_POR_PAGINA;

    return cursos.slice(
      inicio,
      inicio + CURSOS_POR_PAGINA,
    );
  }, [cursos, paginaActual]);

  const paginasVisibles = useMemo(
    () =>
      generarPaginasVisibles(
        paginaActual,
        totalPaginas,
      ),
    [
      paginaActual,
      totalPaginas,
    ],
  );

  const primerCurso =
    totalCursos === 0
      ? 0
      : (paginaActual - 1) *
          CURSOS_POR_PAGINA +
        1;

  const ultimoCurso = Math.min(
    paginaActual * CURSOS_POR_PAGINA,
    totalCursos,
  );

  const handleImageError = (
    idCurso: number,
  ) => {
    setImageErrors(
      (erroresActuales) => ({
        ...erroresActuales,
        [idCurso]: true,
      }),
    );
  };

  const handleViewDashboard = (
    cursoId: number,
  ) => {
    router.push(
      adminRoutes.cursosDashboard(
        cursoId,
      ),
    );
  };

  const cambiarPagina = (
    nuevaPagina: number,
  ) => {
    const paginaSegura = Math.min(
      Math.max(nuevaPagina, 1),
      totalPaginas,
    );

    if (
      paginaSegura === paginaActual
    ) {
      return;
    }

    setPaginaActual(paginaSegura);

    window.requestAnimationFrame(() => {
      seccionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando cursos
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando la información
              académica disponible.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (cursos.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <GraduationCap
              size={30}
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            No se encontraron cursos
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            No hay cursos que coincidan
            con los filtros seleccionados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={seccionRef}
      className="scroll-mt-28"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cursosPagina.map((curso) => {
          const imagen =
            obtenerImagenCurso(curso);

          const mostrarImagen =
            Boolean(imagen) &&
            !imageErrors[
              curso.idCurso
            ];

          const titulo = textoSeguro(
            curso.tituloCurso,
            "Curso sin título",
          );

          const descripcion =
            textoSeguro(
              curso.descripcion,
              "No se ha agregado una descripción para este curso.",
            );

          const categoria =
            textoSeguro(
              curso.categoriaNombre,
              "Categoría general",
            );

          const modalidad =
            textoSeguro(
              curso.modalidadNombre,
              "Presencial",
            );

          const instructor =
            textoSeguro(
              curso.instructorNombre,
              "Instructor no asignado",
            );

          const horario =
            textoSeguro(
              curso.horario,
              "Horario por definir",
            );

          const cuposOcupados = Math.max(
            0,
            numeroSeguro(
              curso.cuposOcupados,
            ),
          );

          const cupoMaximo = Math.max(
            0,
            numeroSeguro(
              curso.cupoMaximo,
            ),
          );

          const lugaresDisponibles =
            Math.max(
              0,
              cupoMaximo -
                cuposOcupados,
            );

          const porcentajeOcupacion =
            cupoMaximo > 0
              ? Math.min(
                  100,
                  Math.round(
                    (cuposOcupados /
                      cupoMaximo) *
                      100,
                  ),
                )
              : 0;

          const cursoCompleto =
            cupoMaximo > 0 &&
            lugaresDisponibles === 0;

          const ultimosLugares =
            lugaresDisponibles > 0 &&
            lugaresDisponibles < 5;

          return (
            <article
              key={curso.idCurso}
              className={cn(
                "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md",
                curso.activo
                  ? "border-gray-200"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 z-20 h-1",
                  curso.activo
                    ? "bg-emerald-500"
                    : "bg-gray-400",
                )}
                aria-hidden="true"
              />

              <div className="relative h-52 overflow-hidden bg-[#EAF2F8]">
                {mostrarImagen &&
                imagen ? (
                  <Image
                    src={imagen}
                    alt={`Portada del curso ${titulo}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      !curso.activo &&
                        "grayscale",
                    )}
                    onError={() => {
                      handleImageError(
                        curso.idCurso,
                      );
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#061C2E]">
                    <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                      <GraduationCap
                        size={40}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#061C2E]/90 to-transparent" />

                <span
                  className={cn(
                    "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold shadow-sm backdrop-blur-sm",
                    curso.activo
                      ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                      : "border-gray-200 bg-gray-100/95 text-gray-600",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      curso.activo
                        ? "bg-emerald-500"
                        : "bg-gray-400",
                    )}
                    aria-hidden="true"
                  />

                  {curso.activo
                    ? "Activo"
                    : "Inactivo"}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62] shadow-sm">
                    <GraduationCap
                      size={12}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span className="min-w-0 whitespace-normal break-words">
                      {categoria}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                    <GraduationCap
                      size={19}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                      Curso
                    </p>

                    <h2 className="mt-1 whitespace-normal break-words text-base font-extrabold leading-6 text-[#0A3D62]">
                      {titulo}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 whitespace-normal break-words text-xs leading-5 text-gray-600">
                  {descripcion}
                </p>

                <div className="mt-5 space-y-3">
                  <InformacionCurso
                    icono={
                      <UserRound
                        size={15}
                        aria-hidden="true"
                      />
                    }
                    titulo="Instructor"
                    contenido={instructor}
                  />

                  <InformacionCurso
                    icono={
                      <CalendarDays
                        size={15}
                        aria-hidden="true"
                      />
                    }
                    titulo="Periodo"
                    contenido={`${formatearFecha(
                      curso.fechaInicio,
                    )} — ${formatearFecha(
                      curso.fechaFin,
                    )}`}
                  />

                  <InformacionCurso
                    icono={
                      <Clock3
                        size={15}
                        aria-hidden="true"
                      />
                    }
                    titulo="Horario y modalidad"
                    contenido={`${horario} · ${modalidad}`}
                  />
                </div>

                <div className="mt-4 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <UsersRound
                        size={16}
                        className="mt-0.5 shrink-0 text-[#0A3D62]"
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Cupo
                        </p>

                        <p className="mt-1 text-xs font-extrabold text-gray-700">
                          {cuposOcupados} de{" "}
                          {cupoMaximo > 0
                            ? cupoMaximo
                            : "sin límite definido"}
                        </p>
                      </div>
                    </div>

                    {cursoCompleto && (
                      <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[10px] font-extrabold text-red-700">
                        Completo
                      </span>
                    )}

                    {ultimosLugares &&
                      !cursoCompleto && (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                          Últimos lugares
                        </span>
                      )}
                  </div>

                  {cupoMaximo > 0 && (
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width]",
                          cursoCompleto
                            ? "bg-red-500"
                            : ultimosLugares
                              ? "bg-amber-500"
                              : "bg-emerald-500",
                        )}
                        style={{
                          width: `${porcentajeOcupacion}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                    <MonitorPlay
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0A3D62]"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Modalidad
                      </p>

                      <p className="mt-1 break-words text-xs font-extrabold text-gray-700">
                        {modalidad}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#FFF9E6] p-3">
                    <WalletCards
                      size={16}
                      className="mt-0.5 shrink-0 text-[#8A6800]"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6800]/70">
                        Costo
                      </p>

                      <p className="mt-1 break-words text-xs font-extrabold text-[#0A3D62]">
                        {formatearCosto(
                          curso.costo,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(curso);
                      }}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
                      aria-label={`Editar ${titulo}`}
                    >
                      <Edit3
                        size={16}
                        className="shrink-0"
                        aria-hidden="true"
                      />

                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onToggleActivo(curso);
                      }}
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                        curso.activo
                          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                      )}
                      aria-label={
                        curso.activo
                          ? `Ocultar ${titulo}`
                          : `Mostrar ${titulo}`
                      }
                      title={
                        curso.activo
                          ? "Ocultar curso"
                          : "Mostrar curso"
                      }
                    >
                      {curso.activo ? (
                        <EyeOff
                          size={17}
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          size={17}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleViewDashboard(
                        curso.idCurso,
                      );
                    }}
                    className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/20 bg-[#F2F7FA] px-4 py-2 text-xs font-extrabold text-[#0A3D62] transition-colors hover:border-[#0A3D62] hover:bg-[#EAF2F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
                    aria-label={`Ver analítica de ${titulo}`}
                  >
                    <BarChart3
                      size={16}
                      aria-hidden="true"
                    />

                    Ver analítica
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-5 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600">
              Mostrando{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {primerCurso}
              </span>{" "}
              a{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {ultimoCurso}
              </span>{" "}
              de{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {totalCursos}
              </span>{" "}
              cursos
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              10 cursos por página
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-1.5"
            aria-label="Paginación de cursos"
          >
            <BotonPaginacion
              onClick={() => {
                cambiarPagina(1);
              }}
              disabled={
                paginaActual === 1
              }
              label="Primera página"
            >
              <ChevronsLeft
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  paginaActual - 1,
                );
              }}
              disabled={
                paginaActual === 1
              }
              label="Página anterior"
            >
              <ChevronLeft
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <div className="flex items-center gap-1">
              {paginasVisibles.map(
                (pagina, indice) => {
                  if (
                    pagina ===
                      "izquierda" ||
                    pagina === "derecha"
                  ) {
                    return (
                      <span
                        key={`${pagina}-${indice}`}
                        className="flex h-9 min-w-8 items-center justify-center px-1 text-xs font-bold text-gray-400"
                      >
                        …
                      </span>
                    );
                  }

                  const paginaActiva =
                    pagina ===
                    paginaActual;

                  return (
                    <button
                      key={pagina}
                      type="button"
                      onClick={() => {
                        cambiarPagina(
                          pagina,
                        );
                      }}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-extrabold transition-colors",
                        paginaActiva
                          ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62]",
                      )}
                      aria-current={
                        paginaActiva
                          ? "page"
                          : undefined
                      }
                      aria-label={`Ir a la página ${pagina}`}
                    >
                      {pagina}
                    </button>
                  );
                },
              )}
            </div>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  paginaActual + 1,
                );
              }}
              disabled={
                paginaActual ===
                totalPaginas
              }
              label="Página siguiente"
            >
              <ChevronRight
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>

            <BotonPaginacion
              onClick={() => {
                cambiarPagina(
                  totalPaginas,
                );
              }}
              disabled={
                paginaActual ===
                totalPaginas
              }
              label="Última página"
            >
              <ChevronsRight
                size={16}
                aria-hidden="true"
              />
            </BotonPaginacion>
          </nav>
        </div>
      </footer>
    </section>
  );
}

function InformacionCurso({
  icono,
  titulo,
  contenido,
}: {
  icono: ReactNode;
  titulo: string;
  contenido: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
      <span className="mt-0.5 shrink-0 text-[#0A3D62]">
        {icono}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          {titulo}
        </p>

        <p className="mt-1 whitespace-normal break-words text-xs font-semibold leading-5 text-gray-700">
          {contenido}
        </p>
      </div>
    </div>
  );
}

function BotonPaginacion({
  children,
  onClick,
  disabled,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}