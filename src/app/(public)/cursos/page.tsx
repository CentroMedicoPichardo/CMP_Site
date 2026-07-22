"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { CursosHeader } from "@/components/public/cursos/CursosHeader";
import { CursosLayout } from "@/components/public/cursos/CursosLayout";

type ModalidadValor =
  | "Online"
  | "Presencial"
  | "Híbrido";

type DirigidoAValor =
  | "Padres"
  | "Niños"
  | "Familia"
  | "Adolescentes";

type EstadoCurso =
  | "Activo"
  | "Finalizado"
  | "Próximamente";

interface Curso {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: ModalidadValor;
  dirigidoA: DirigidoAValor;
  estado: EstadoCurso;
  imagenSrc?: string;
  costo: number | "Gratuito";
  ubicacion?: string;
  linkDetalle: string;
}

interface CursoApi {
  idCurso?: string | number | null;
  tituloCurso?: string | null;
  descripcion?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  fechaPublicacion?: string | null;
  inscripcionesAbiertas?: boolean | null;
  cupoMaximo?: number | string | null;
  cuposOcupados?: number | string | null;
  instructorNombre?: string | null;
  horario?: string | null;
  modalidadNombre?: string | null;
  dirigidoA?: string | null;
  activo?: boolean | null;
  estado?: string | null;
  urlImagenPortada?: string | null;
  costo?: number | string | null;
  ubicacionNombre?: string | null;
}

type ElementoPaginacion =
  | number
  | "separador-inicial"
  | "separador-final";

const CURSOS_POR_PAGINA = 9;

function obtenerNumero(
  valor: number | string | null | undefined,
  fallback = 0,
): number {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return fallback;
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return fallback;
  }

  return Math.max(numero, 0);
}

function obtenerModalidad(
  valor: string | null | undefined,
): ModalidadValor {
  const modalidad = valor
    ?.trim()
    .toLocaleLowerCase("es-MX");

  if (modalidad === "online") {
    return "Online";
  }

  if (
    modalidad === "híbrido" ||
    modalidad === "hibrido"
  ) {
    return "Híbrido";
  }

  return "Presencial";
}

function obtenerDirigidoA(
  valor: string | null | undefined,
): DirigidoAValor {
  const dirigidoA = valor
    ?.trim()
    .toLocaleLowerCase("es-MX");

  if (
    dirigidoA === "niños" ||
    dirigidoA === "ninos"
  ) {
    return "Niños";
  }

  if (dirigidoA === "familia") {
    return "Familia";
  }

  if (dirigidoA === "adolescentes") {
    return "Adolescentes";
  }

  return "Padres";
}

function obtenerEstado(
  curso: CursoApi,
): EstadoCurso {
  const estado = curso.estado
    ?.trim()
    .toLocaleLowerCase("es-MX");

  if (estado === "finalizado") {
    return "Finalizado";
  }

  if (
    estado === "próximamente" ||
    estado === "proximamente"
  ) {
    return "Próximamente";
  }

  if (estado === "activo") {
    return "Activo";
  }

  return curso.activo === false
    ? "Finalizado"
    : "Activo";
}

function obtenerCosto(
  valor: number | string | null | undefined,
): number | "Gratuito" {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "Gratuito";
  }

  if (
    typeof valor === "string" &&
    valor.trim().toLocaleLowerCase("es-MX") ===
      "gratuito"
  ) {
    return "Gratuito";
  }

  const costo = Number(valor);

  if (!Number.isFinite(costo) || costo <= 0) {
    return "Gratuito";
  }

  return costo;
}

function obtenerImagen(
  valor: string | null | undefined,
): string | undefined {
  const imagen = valor?.trim();

  if (
    !imagen ||
    imagen === "no_imagen_uwvduy"
  ) {
    return undefined;
  }

  if (
    imagen.startsWith("http://") ||
    imagen.startsWith("https://") ||
    imagen.startsWith("/")
  ) {
    return imagen;
  }

  return `/${imagen}`;
}

function formatearCurso(
  curso: CursoApi,
  index: number,
): Curso {
  const cupoMaximo = obtenerNumero(
    curso.cupoMaximo,
    20,
  );

  const cupoInscrito = Math.min(
    obtenerNumero(
      curso.cuposOcupados,
      0,
    ),
    cupoMaximo,
  );

  const activo = curso.activo !== false;

  const tieneCupo =
    cupoMaximo <= 0 ||
    cupoInscrito < cupoMaximo;

  const inscripcionesAbiertas =
    typeof curso.inscripcionesAbiertas ===
    "boolean"
      ? curso.inscripcionesAbiertas &&
        activo &&
        tieneCupo
      : activo && tieneCupo;

  const id =
    curso.idCurso ??
    `curso-${index + 1}`;

  return {
    id,

    titulo:
      curso.tituloCurso?.trim() ||
      "Curso sin título",

    descripcion:
      curso.descripcion?.trim() ||
      "Curso de formación para el bienestar de las familias.",

    fechaInicio:
      curso.fechaInicio?.trim() ||
      "Próximamente",

    fechaFin:
      curso.fechaFin?.trim() || "",

    fechaPublicacion:
      curso.fechaPublicacion?.trim() ||
      "",

    inscripcionesAbiertas,
    cupoMaximo,
    cupoInscrito,

    instructor:
      curso.instructorNombre?.trim() ||
      "Instructor por asignar",

    horario:
      curso.horario?.trim() ||
      "Horario por confirmar",

    modalidad: obtenerModalidad(
      curso.modalidadNombre,
    ),

    dirigidoA: obtenerDirigidoA(
      curso.dirigidoA,
    ),

    estado: obtenerEstado(curso),

    imagenSrc: obtenerImagen(
      curso.urlImagenPortada,
    ),

    costo: obtenerCosto(curso.costo),

    ubicacion:
      curso.ubicacionNombre?.trim() ||
      "Huejutla de Reyes, Hidalgo",

    linkDetalle: `/cursos/${id}`,
  };
}

function crearElementosPaginacion(
  paginaActual: number,
  totalPaginas: number,
): ElementoPaginacion[] {
  if (totalPaginas <= 7) {
    return Array.from(
      { length: totalPaginas },
      (_, index) => index + 1,
    );
  }

  if (paginaActual <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "separador-final",
      totalPaginas,
    ];
  }

  if (paginaActual >= totalPaginas - 3) {
    return [
      1,
      "separador-inicial",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "separador-inicial",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "separador-final",
    totalPaginas,
  ];
}

export default function CursosPage() {
  const searchParams = useSearchParams();
  const queryFiltros = searchParams.toString();

  const resultadosRef =
    useRef<HTMLDivElement | null>(null);

  const [cursos, setCursos] =
    useState<Curso[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [paginaActual, setPaginaActual] =
    useState(1);

  const [intentoCarga, setIntentoCarga] =
    useState(0);

  useEffect(() => {
    const controller =
      new AbortController();

    const cargarCursos = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = queryFiltros
          ? `/api/cursos?${queryFiltros}`
          : "/api/cursos";

        const respuesta = await fetch(url, {
          signal: controller.signal,
          credentials: "include",
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error(
            "No fue posible obtener los cursos.",
          );
        }

        const datos: unknown =
          await respuesta.json();

        const cursosApi = Array.isArray(datos)
          ? (datos as CursoApi[])
          : [];

        setCursos(
          cursosApi.map(formatearCurso),
        );
      } catch (errorCarga: unknown) {
        if (
          errorCarga instanceof DOMException &&
          errorCarga.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error al cargar cursos:",
          errorCarga,
        );

        setCursos([]);

        setError(
          errorCarga instanceof Error
            ? errorCarga.message
            : "No fue posible cargar los cursos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void cargarCursos();

    return () => {
      controller.abort();
    };
  }, [queryFiltros, intentoCarga]);

  const cursosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLocaleLowerCase("es-MX");

    if (!texto) {
      return cursos;
    }

    return cursos.filter((curso) => {
      const titulo =
        curso.titulo.toLocaleLowerCase(
          "es-MX",
        );

      const descripcion =
        curso.descripcion.toLocaleLowerCase(
          "es-MX",
        );

      const instructor =
        curso.instructor.toLocaleLowerCase(
          "es-MX",
        );

      return (
        titulo.includes(texto) ||
        descripcion.includes(texto) ||
        instructor.includes(texto)
      );
    });
  }, [busqueda, cursos]);

  const totalPaginas = Math.ceil(
    cursosFiltrados.length /
      CURSOS_POR_PAGINA,
  );

  const indiceInicial =
    (paginaActual - 1) *
    CURSOS_POR_PAGINA;

  const cursosPaginados = useMemo(() => {
    return cursosFiltrados.slice(
      indiceInicial,
      indiceInicial +
        CURSOS_POR_PAGINA,
    );
  }, [
    cursosFiltrados,
    indiceInicial,
  ]);

  const elementosPaginacion = useMemo(
    () =>
      crearElementosPaginacion(
        paginaActual,
        totalPaginas,
      ),
    [paginaActual, totalPaginas],
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, queryFiltros]);

  useEffect(() => {
    if (
      totalPaginas > 0 &&
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const cambiarPagina = (
    nuevaPagina: number,
  ) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas ||
      nuevaPagina === paginaActual
    ) {
      return;
    }

    setPaginaActual(nuevaPagina);

    window.requestAnimationFrame(() => {
      resultadosRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const primerCursoMostrado =
    cursosFiltrados.length > 0
      ? indiceInicial + 1
      : 0;

  const ultimoCursoMostrado = Math.min(
    indiceInicial + cursosPaginados.length,
    cursosFiltrados.length,
  );

  return (
    <main className="min-h-screen bg-white">
      <CursosHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      <div
        ref={resultadosRef}
        className="scroll-mt-20"
      >
        {loading ? (
          <section className="border-t border-gray-200 bg-[#F7FAFC] py-20">
            <Container>
              <div
                className="flex flex-col items-center justify-center text-center"
                role="status"
                aria-live="polite"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0A3D62]/10 bg-white shadow-sm">
                  <Loader2
                    size={30}
                    className="animate-spin text-[#0A3D62]"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-sm font-bold text-[#0A3D62]">
                  Cargando cursos
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Consultando las actividades disponibles.
                </p>
              </div>
            </Container>
          </section>
        ) : error ? (
          <section className="border-t border-gray-200 bg-[#F7FAFC] py-16">
            <Container>
              <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-white p-7 text-center shadow-sm">
                <h2 className="text-xl font-extrabold text-[#0A3D62]">
                  No fue posible cargar los cursos
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setIntentoCarga(
                      (actual) => actual + 1,
                    )
                  }
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62]"
                >
                  <RefreshCw
                    size={16}
                    aria-hidden="true"
                  />

                  Intentar nuevamente
                </button>
              </div>
            </Container>
          </section>
        ) : (
          <>
            <CursosLayout
              cursos={cursosPaginados}
            />

            {totalPaginas > 1 && (
              <section className="border-t border-gray-200 bg-[#F7FAFC] pb-12 pt-6 sm:pb-14 sm:pt-7">
                <Container>
                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_8px_25px_rgba(10,61,98,0.07)] sm:p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div
                        className="text-center lg:text-left"
                        aria-live="polite"
                      >
                        <p className="text-sm font-extrabold text-[#0A3D62]">
                          Mostrando{" "}
                          {primerCursoMostrado}–
                          {ultimoCursoMostrado} de{" "}
                          {cursosFiltrados.length}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Página {paginaActual} de{" "}
                          {totalPaginas}
                        </p>
                      </div>

                      <div className="w-full overflow-x-auto pb-1 [scrollbar-width:none] lg:w-auto [&::-webkit-scrollbar]:hidden">
                        <nav
                          className="mx-auto flex min-w-max items-center justify-center gap-1.5"
                          aria-label="Paginación de cursos"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              cambiarPagina(
                                paginaActual - 1,
                              )
                            }
                            disabled={
                              paginaActual === 1
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#0A3D62] transition-colors hover:border-[#0A3D62]/20 hover:bg-[#EAF2F8] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Página anterior"
                          >
                            <ChevronLeft
                              size={18}
                              aria-hidden="true"
                            />
                          </button>

                          {elementosPaginacion.map(
                            (elemento) => {
                              if (
                                typeof elemento !==
                                "number"
                              ) {
                                return (
                                  <span
                                    key={elemento}
                                    className="flex h-10 w-7 shrink-0 items-center justify-center text-sm font-bold text-gray-400"
                                    aria-hidden="true"
                                  >
                                    …
                                  </span>
                                );
                              }

                              const paginaActiva =
                                elemento ===
                                paginaActual;

                              return (
                                <button
                                  key={elemento}
                                  type="button"
                                  onClick={() =>
                                    cambiarPagina(
                                      elemento,
                                    )
                                  }
                                  aria-label={`Ir a la página ${elemento}`}
                                  aria-current={
                                    paginaActiva
                                      ? "page"
                                      : undefined
                                  }
                                  className={
                                    paginaActiva
                                      ? "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] px-3 text-sm font-extrabold text-white shadow-sm"
                                      : "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-600 transition-colors hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] hover:text-[#0A3D62]"
                                  }
                                >
                                  {elemento}
                                </button>
                              );
                            },
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              cambiarPagina(
                                paginaActual + 1,
                              )
                            }
                            disabled={
                              paginaActual ===
                              totalPaginas
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#0A3D62] transition-colors hover:border-[#0A3D62]/20 hover:bg-[#EAF2F8] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Página siguiente"
                          >
                            <ChevronRight
                              size={18}
                              aria-hidden="true"
                            />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </Container>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}