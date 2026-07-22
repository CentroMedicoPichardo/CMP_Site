"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPinned,
  Monitor,
  UserRound,
  UsersRound,
} from "lucide-react";

import { CursoDetalleModal } from "./CursoDetalleModal";

interface CursoProps {
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
  modalidad: "Online" | "Presencial" | "Híbrido";
  dirigidoA: "Padres" | "Niños" | "Familia" | "Adolescentes";
  estado: "Activo" | "Finalizado" | "Próximamente";
  imagenSrc?: string;
  costo: number | "Gratuito";
  ubicacion?: string;
  linkDetalle?: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function obtenerEstadoCurso(
  estado: CursoProps["estado"],
  inscripcionesAbiertas: boolean,
) {
  if (estado === "Finalizado") {
    return {
      texto: "Finalizado",
      clases: "bg-gray-700 text-white",
      punto: "bg-gray-300",
    };
  }

  if (estado === "Próximamente") {
    return {
      texto: "Próximamente",
      clases: "bg-blue-600 text-white",
      punto: "bg-blue-200",
    };
  }

  if (inscripcionesAbiertas) {
    return {
      texto: "Inscripciones abiertas",
      clases: "bg-emerald-600 text-white",
      punto: "bg-emerald-200",
    };
  }

  return {
    texto: "Inscripciones cerradas",
    clases: "bg-gray-700 text-white",
    punto: "bg-gray-300",
  };
}

function obtenerModalidad(
  modalidad: CursoProps["modalidad"],
) {
  if (modalidad === "Online") {
    return {
      icono: Monitor,
      clases: "bg-blue-600 text-white",
    };
  }

  if (modalidad === "Híbrido") {
    return {
      icono: GraduationCap,
      clases: "bg-violet-600 text-white",
    };
  }

  return {
    icono: MapPinned,
    clases: "bg-[#FFC300] text-[#0A3D62]",
  };
}

export function CursoCard({
  id,
  titulo,
  descripcion,
  fechaInicio,
  fechaFin,
  inscripcionesAbiertas,
  cupoMaximo,
  cupoInscrito,
  instructor,
  horario,
  modalidad,
  dirigidoA,
  estado,
  imagenSrc,
  costo,
  ubicacion,
}: CursoProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const tituloMostrado =
    titulo?.trim() || "Curso formativo";

  const descripcionMostrada =
    descripcion?.trim() ||
    "Curso diseñado para fortalecer los conocimientos y el bienestar de las familias.";

  const instructorMostrado =
    instructor?.trim() || "Centro Médico Pichardo";

  const horarioMostrado =
    horario?.trim() || "Horario por confirmar";

  const cupoTotal = Math.max(Number(cupoMaximo) || 0, 0);
  const inscritos = Math.max(Number(cupoInscrito) || 0, 0);

  const lugaresDisponibles =
    cupoTotal > 0
      ? Math.max(cupoTotal - inscritos, 0)
      : 0;

  const porcentajeOcupado =
    cupoTotal > 0
      ? Math.min(
          Math.max((inscritos / cupoTotal) * 100, 0),
          100,
        )
      : 0;

  const sinCupo =
    cupoTotal > 0 && lugaresDisponibles === 0;

  const pocoCupo =
    lugaresDisponibles > 0 &&
    lugaresDisponibles <= 5;

  const estadoCurso = obtenerEstadoCurso(
    estado,
    inscripcionesAbiertas,
  );

  const modalidadCurso =
    obtenerModalidad(modalidad);

  const IconoModalidad = modalidadCurso.icono;

  const costoMostrado =
    costo === "Gratuito"
      ? "Gratis"
      : new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          maximumFractionDigits: 0,
        }).format(costo);

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_26px_rgba(10,61,98,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0A3D62]/20 hover:shadow-[0_16px_36px_rgba(10,61,98,0.13)]">
        {/* Imagen compacta */}
        <div className="relative h-44 shrink-0 overflow-hidden bg-[#DDE8EF] sm:h-48">
          {imagenSrc?.trim() ? (
            <>
              {/* Fondo desenfocado */}
              <Image
                src={imagenSrc}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="scale-110 object-cover object-center opacity-45 blur-xl"
                aria-hidden="true"
              />

              <div
                className="absolute inset-0 bg-[#0A3D62]/10"
                aria-hidden="true"
              />

              {/* Imagen completa */}
              <div className="absolute inset-2 overflow-hidden rounded-xl">
                <Image
                  src={imagenSrc}
                  alt={`Curso ${tituloMostrado}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/80 backdrop-blur-sm">
                <GraduationCap
                  size={32}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#061C2E]/65 to-transparent"
            aria-hidden="true"
          />

          {/* Público */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62] shadow-md">
              <UsersRound
                size={12}
                strokeWidth={2}
                aria-hidden="true"
              />

              {dirigidoA}
            </span>
          </div>

          {/* Estado */}
          <div className="absolute right-3 top-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] shadow-md",
                estadoCurso.clases,
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  estadoCurso.punto,
                )}
              />

              {estadoCurso.texto}
            </span>
          </div>

          {/* Modalidad */}
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold shadow-md",
                modalidadCurso.clases,
              )}
            >
              <IconoModalidad
                size={13}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              {modalidad}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-4">
          {/* Título y descripción */}
          <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-[#0A3D62] sm:text-xl">
            {tituloMostrado}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-gray-600">
            {descripcionMostrada}
          </p>

          {/* Instructor */}
          <div className="mt-3 flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F6F9FB] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
              <UserRound
                size={15}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <span className="block text-[9px] font-bold uppercase tracking-[0.13em] text-gray-400">
                Instructor
              </span>

              <p
                className="truncate text-xs font-bold text-[#0A3D62] sm:text-sm"
                title={instructorMostrado}
              >
                {instructorMostrado}
              </p>
            </div>
          </div>

          {/* Fecha y horario compactos */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="flex min-w-0 items-start gap-2 rounded-xl border border-gray-100 px-2.5 py-2">
              <CalendarDays
                size={15}
                className="mt-0.5 shrink-0 text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <div className="min-w-0">
                <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Fecha
                </span>

                <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-4 text-gray-700 sm:text-[11px]">
                  {fechaInicio}

                  {fechaFin &&
                    fechaFin !== fechaInicio &&
                    ` - ${fechaFin}`}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-2 rounded-xl border border-gray-100 px-2.5 py-2">
              <Clock3
                size={15}
                className="mt-0.5 shrink-0 text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <div className="min-w-0">
                <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Horario
                </span>

                <p
                  className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-4 text-gray-700 sm:text-[11px]"
                  title={horarioMostrado}
                >
                  {horarioMostrado}
                </p>
              </div>
            </div>
          </div>

          {/* Cupo compacto */}
          {inscripcionesAbiertas && cupoTotal > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between gap-3 text-[10px]">
                <span className="font-semibold text-gray-500">
                  Cupo
                </span>

                <span
                  className={cn(
                    "font-extrabold",
                    sinCupo && "text-red-600",
                    pocoCupo &&
                      !sinCupo &&
                      "text-amber-600",
                    !pocoCupo &&
                      !sinCupo &&
                      "text-emerald-600",
                  )}
                >
                  {sinCupo
                    ? "Completo"
                    : `${lugaresDisponibles} disponibles`}
                </span>
              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    sinCupo
                      ? "bg-red-500"
                      : pocoCupo
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{
                    width: `${porcentajeOcupado}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Costo y acción */}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
            <div className="min-w-0">
              <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
                Costo
              </span>

              <p
                className={cn(
                  "mt-0.5 text-lg font-extrabold leading-none",
                  costo === "Gratuito"
                    ? "text-emerald-600"
                    : "text-[#0A3D62]",
                )}
              >
                {costoMostrado}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group/boton inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#0A3D62] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
              aria-label={`Ver detalles del curso ${tituloMostrado}`}
            >
              Detalles

              <ChevronRight
                size={15}
                strokeWidth={2}
                className="transition-transform group-hover/boton:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </article>

      <CursoDetalleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        curso={{
          id,
          titulo: tituloMostrado,
          descripcion: descripcionMostrada,
          fechaInicio,
          fechaFin,
          inscripcionesAbiertas,
          cupoMaximo: cupoTotal,
          cupoInscrito: inscritos,
          instructor: instructorMostrado,
          horario: horarioMostrado,
          modalidad,
          dirigidoA,
          imagenSrc,
          costo,
          ubicacion,
          lugaresDisponibles,
        }}
      />
    </>
  );
}