"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Monitor,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { CursoDetalleModal } from "@/components/public/cursos/CursoDetalleModal";
import { publicRoutes } from "@/config/routes";

type ModalidadCurso =
  | "Online"
  | "Presencial"
  | "Híbrido";

type PublicoCurso =
  | "Padres"
  | "Niños"
  | "Familia"
  | "Adolescentes";

interface CursoInicio {
  idCurso?: string | number;
  id?: string | number;
  tituloCurso?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  inscripcionesAbiertas?: boolean | null;
  cupoMaximo?: number | string | null;
  cuposOcupados?: number | string | null;
  cupoInscrito?: number | string | null;
  instructorNombre?: string | null;
  instructor?: string | null;
  horario?: string | null;
  modalidad?: string | null;
  dirigidoA?: string | null;
  urlImagenPortada?: string | null;
  imagenSrc?: string | null;
  costo?: number | string | null;
  ubicacion?: string | null;
}

interface CursosSectionProps {
  cursos: CursoInicio[];
}

interface CursoNormalizado {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: ModalidadCurso;
  dirigidoA: PublicoCurso;
  imagenSrc?: string;
  costo: number | "Gratuito";
  ubicacion?: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function obtenerNumero(
  value: number | string | null | undefined,
  fallback = 0,
): number {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const numero = Number(value);

  return Number.isFinite(numero)
    ? Math.max(numero, 0)
    : fallback;
}

function obtenerModalidad(
  value: string | null | undefined,
): ModalidadCurso {
  const modalidad =
    value?.trim().toLowerCase();

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

function obtenerPublico(
  value: string | null | undefined,
): PublicoCurso {
  const publico =
    value?.trim().toLowerCase();

  if (
    publico === "niños" ||
    publico === "ninos"
  ) {
    return "Niños";
  }

  if (publico === "familia") {
    return "Familia";
  }

  if (publico === "adolescentes") {
    return "Adolescentes";
  }

  return "Padres";
}

function obtenerCosto(
  value: number | string | null | undefined,
): number | "Gratuito" {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Gratuito";
  }

  if (
    typeof value === "string" &&
    value.trim().toLowerCase() ===
      "gratuito"
  ) {
    return "Gratuito";
  }

  const costo = Number(value);

  if (!Number.isFinite(costo) || costo <= 0) {
    return "Gratuito";
  }

  return costo;
}

function normalizarCurso(
  curso: CursoInicio,
  index: number,
): CursoNormalizado {
  const cupoMaximo = obtenerNumero(
    curso.cupoMaximo,
    20,
  );

  const cupoInscrito = Math.min(
    obtenerNumero(
      curso.cuposOcupados ??
        curso.cupoInscrito,
      0,
    ),
    cupoMaximo,
  );

  return {
    id:
      curso.idCurso ??
      curso.id ??
      `curso-inicio-${index}`,

    titulo:
      curso.tituloCurso?.trim() ||
      curso.titulo?.trim() ||
      "Curso formativo",

    descripcion:
      curso.descripcion?.trim() ||
      "Actividad diseñada para fortalecer los conocimientos y el bienestar de las familias.",

    fechaInicio:
      curso.fechaInicio?.trim() ||
      "Próximamente",

    fechaFin:
      curso.fechaFin?.trim() || "",

    inscripcionesAbiertas:
      curso.inscripcionesAbiertas ?? true,

    cupoMaximo,
    cupoInscrito,

    instructor:
      curso.instructorNombre?.trim() ||
      curso.instructor?.trim() ||
      "Instructor por asignar",

    horario:
      curso.horario?.trim() ||
      "Horario por confirmar",

    modalidad: obtenerModalidad(
      curso.modalidad,
    ),

    dirigidoA: obtenerPublico(
      curso.dirigidoA,
    ),

    imagenSrc:
      curso.urlImagenPortada?.trim() ||
      curso.imagenSrc?.trim() ||
      undefined,

    costo: obtenerCosto(curso.costo),

    ubicacion:
      curso.ubicacion?.trim() ||
      undefined,
  };
}

function formatearCosto(
  costo: number | "Gratuito",
): string {
  if (costo === "Gratuito") {
    return "Gratis";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(costo);
}

function CursoCardHorizontalInicio({
  curso,
}: {
  curso: CursoNormalizado;
}) {
  const [modalOpen, setModalOpen] =
    useState(false);

  const lugaresDisponibles = Math.max(
    curso.cupoMaximo -
      curso.cupoInscrito,
    0,
  );

  const periodo =
    curso.fechaFin &&
    curso.fechaFin !== curso.fechaInicio
      ? `${curso.fechaInicio} - ${curso.fechaFin}`
      : curso.fechaInicio;

  const costoMostrado =
    formatearCosto(curso.costo);

  const abierto =
    curso.inscripcionesAbiertas &&
    lugaresDisponibles > 0;

  const IconoModalidad =
    curso.modalidad === "Online"
      ? Monitor
      : curso.modalidad === "Híbrido"
        ? GraduationCap
        : MapPin;

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_7px_24px_rgba(10,61,98,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0A3D62]/20 hover:shadow-[0_14px_32px_rgba(10,61,98,0.13)] sm:min-h-[250px] sm:flex-row">
        {/* Imagen */}
        <div className="relative h-40 shrink-0 overflow-hidden bg-[#DCE8EF] sm:h-auto sm:w-[38%]">
          {curso.imagenSrc ? (
            <>
              <Image
                src={curso.imagenSrc}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="scale-110 object-cover opacity-35 blur-xl"
                aria-hidden="true"
              />

              <div
                className="absolute inset-0 bg-[#0A3D62]/10"
                aria-hidden="true"
              />

              <div className="absolute inset-2 overflow-hidden rounded-xl">
                <Image
                  src={curso.imagenSrc}
                  alt={`Curso ${curso.titulo}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white">
                <GraduationCap
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-[#061C2E]/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#061C2E]/15"
            aria-hidden="true"
          />

          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#0A3D62] shadow-sm">
            {curso.dirigidoA}
          </span>

          <span
            className={cn(
              "absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold text-white shadow-sm",
              abierto
                ? "bg-emerald-600"
                : "bg-gray-700",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />

            {abierto ? "Abierto" : "Cerrado"}
          </span>

          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-lg bg-[#0A3D62]/90 px-2 py-1 text-[9px] font-bold text-white shadow-sm backdrop-blur-sm">
            <IconoModalidad
              size={11}
              strokeWidth={1.9}
              aria-hidden="true"
            />

            {curso.modalidad}
          </span>
        </div>

        {/* Contenido */}
        <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
          <div>
            <h3 className="line-clamp-2 text-base font-extrabold leading-5 text-[#0A3D62] sm:text-lg sm:leading-6">
              {curso.titulo}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
              {curso.descripcion}
            </p>
          </div>

          {/* Datos compactos */}
          <div className="mt-2.5 grid gap-1.5">
            <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600">
              <UserRound
                size={13}
                className="shrink-0 text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span className="truncate font-semibold">
                {curso.instructor}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600">
              <CalendarDays
                size={13}
                className="shrink-0 text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span className="truncate">
                {periodo}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600">
              <Clock3
                size={13}
                className="shrink-0 text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span className="truncate">
                {curso.horario}
              </span>
            </div>
          </div>

          {/* Pie */}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-2.5">
            <div className="min-w-0">
              <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
                Costo
              </span>

              <p
                className={cn(
                  "mt-0.5 text-base font-extrabold leading-none",
                  curso.costo === "Gratuito"
                    ? "text-emerald-600"
                    : "text-[#0A3D62]",
                )}
              >
                {costoMostrado}
              </p>

              {curso.inscripcionesAbiertas && (
                <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-gray-500">
                  <UsersRound
                    size={10}
                    aria-hidden="true"
                  />

                  {lugaresDisponibles} disponibles
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setModalOpen(true)
              }
              className="group/boton inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#0A3D62] px-3 text-xs font-bold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
              aria-label={`Ver detalles del curso ${curso.titulo}`}
            >
              Detalles

              <ChevronRight
                size={14}
                className="transition-transform group-hover/boton:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </article>

      <CursoDetalleModal
        isOpen={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        curso={{
          id: curso.id,
          titulo: curso.titulo,
          descripcion: curso.descripcion,
          fechaInicio: curso.fechaInicio,
          fechaFin: curso.fechaFin,
          inscripcionesAbiertas:
            curso.inscripcionesAbiertas,
          cupoMaximo: curso.cupoMaximo,
          cupoInscrito: curso.cupoInscrito,
          instructor: curso.instructor,
          horario: curso.horario,
          modalidad: curso.modalidad,
          dirigidoA: curso.dirigidoA,
          imagenSrc: curso.imagenSrc,
          costo: curso.costo,
          ubicacion: curso.ubicacion,
          lugaresDisponibles,
        }}
      />
    </>
  );
}

export function CursosSection({
  cursos,
}: CursosSectionProps) {
  const cursosMostrados = Array.isArray(cursos)
    ? cursos
        .slice(0, 2)
        .map(normalizarCurso)
    : [];

  if (cursosMostrados.length === 0) {
    return null;
  }

  return (
    <section
      className="relative border-t border-gray-200 bg-[#F7FAFC] py-9 sm:py-10 lg:py-11"
      aria-labelledby="proximos-cursos-titulo"
    >
      {/* Separador */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
      </div>

      <Container>
        {/* Encabezado compacto */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B88600]">
              <GraduationCap
                size={13}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Formación disponible
            </span>

            <h2
              id="proximos-cursos-titulo"
              className="mt-1.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
            >
              Próximos cursos y talleres
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Actividades para fortalecer el aprendizaje y bienestar familiar.
            </p>
          </div>

          <Link
            href={publicRoutes.cursos}
            className="group inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/15 bg-white px-4 text-sm font-bold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#0A3D62] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            Ver todos

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Dos tarjetas */}
        <div className="grid items-stretch gap-4 md:grid-cols-2 lg:gap-5">
          {cursosMostrados.map((curso) => (
            <CursoCardHorizontalInicio
              key={String(curso.id)}
              curso={curso}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}