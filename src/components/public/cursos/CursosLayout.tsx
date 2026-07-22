"use client";

import {
  BookOpenCheck,
  GraduationCap,
  SearchX,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { CursoCard } from "./CursoCard";

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
  modalidad: "Online" | "Presencial" | "Híbrido";
  dirigidoA:
    | "Padres"
    | "Niños"
    | "Familia"
    | "Adolescentes";
  estado:
    | "Activo"
    | "Finalizado"
    | "Próximamente";
  imagenSrc?: string | null;
  costo: number | "Gratuito";
  ubicacion?: string | null;
  linkDetalle?: string;
}

interface CursosLayoutProps {
  cursos: Curso[];
}

export function CursosLayout({
  cursos,
}: CursosLayoutProps) {
  const listaCursos = Array.isArray(cursos)
    ? cursos
    : [];

  if (listaCursos.length === 0) {
    return (
      <section className="relative border-t border-gray-200 bg-[#F7FAFC] py-10 sm:py-12 lg:py-14">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
        </div>

        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-5 py-10 text-center shadow-[0_12px_35px_rgba(10,61,98,0.08)] sm:px-8 sm:py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
              <SearchX
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
              No se encontraron cursos
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              No hay cursos o talleres que coincidan con los
              términos y filtros seleccionados.
            </p>

            <p className="mt-1 text-xs font-medium text-gray-400">
              Prueba con otra búsqueda, modalidad o público.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-12 pt-9 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
      aria-labelledby="cursos-disponibles-titulo"
    >
      {/* Separador con el encabezado */}
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
      </div>

      {/* Decoraciones de fondo */}
      <div
        className="pointer-events-none absolute -left-24 top-24 h-52 w-52 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado de resultados */}
        <div className="relative mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0A3D62] shadow-sm">
              <BookOpenCheck
                size={13}
                className="text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Formación disponible
            </span>

            <h2
              id="cursos-disponibles-titulo"
              className="mt-3 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
            >
              Cursos y talleres para{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  aprender
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Consulta fechas, modalidad, disponibilidad y
              detalles de cada actividad formativa.
            </p>
          </div>

          {/* Contador */}
          <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <GraduationCap
                size={20}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Resultados
              </p>

              <p className="text-sm font-extrabold text-[#0A3D62]">
                {listaCursos.length}{" "}
                {listaCursos.length === 1
                  ? "curso disponible"
                  : "cursos disponibles"}
              </p>
            </div>
          </div>
        </div>

        {/* Cuadrícula de cursos */}
        <div className="relative grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
          {listaCursos.map((curso) => (
            <CursoCard
              key={curso.id}
              id={curso.id}
              titulo={
                curso.titulo?.trim() ||
                "Curso formativo"
              }
              descripcion={
                curso.descripcion?.trim() ||
                "Contenido diseñado para fortalecer el conocimiento y el bienestar de las familias."
              }
              fechaInicio={curso.fechaInicio}
              fechaFin={curso.fechaFin}
              fechaPublicacion={
                curso.fechaPublicacion
              }
              inscripcionesAbiertas={
                Boolean(
                  curso.inscripcionesAbiertas,
                )
              }
              cupoMaximo={Math.max(
                Number(curso.cupoMaximo) || 0,
                0,
              )}
              cupoInscrito={Math.max(
                Number(curso.cupoInscrito) || 0,
                0,
              )}
              instructor={
                curso.instructor?.trim() ||
                "Centro Médico Pichardo"
              }
              horario={
                curso.horario?.trim() ||
                "Horario por confirmar"
              }
              modalidad={curso.modalidad}
              dirigidoA={curso.dirigidoA}
              estado={curso.estado}
              imagenSrc={
                curso.imagenSrc?.trim() ||
                undefined
              }
              costo={curso.costo}
              ubicacion={
                curso.ubicacion?.trim() ||
                undefined
              }
              linkDetalle={curso.linkDetalle}
            />
          ))}
        </div>

        {/* Mensaje inferior */}
        <div className="mx-auto mt-7 flex max-w-2xl items-start justify-center gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-3 text-center shadow-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <p className="text-xs font-semibold leading-5 text-gray-500">
            Selecciona “Detalles” en cualquier curso para
            consultar la información completa y disponibilidad
            de lugares.
          </p>
        </div>
      </Container>
    </section>
  );
}