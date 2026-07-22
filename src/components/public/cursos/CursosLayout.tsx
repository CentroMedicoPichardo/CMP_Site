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
      <section className="relative border-t border-gray-200 bg-[#F7FAFC] py-8 sm:py-9 lg:py-10">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
        </div>

        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-5 py-9 text-center shadow-[0_12px_35px_rgba(10,61,98,0.08)] sm:px-8">
            <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
              <SearchX
                size={25}
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
      className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-8 pt-7 sm:pb-9 sm:pt-8 lg:pb-10 lg:pt-9"
      aria-labelledby="cursos-disponibles-titulo"
    >
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
      </div>

      <div
        className="pointer-events-none absolute -left-24 top-20 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-8 h-52 w-52 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado compacto */}
        <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0A3D62]/10 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#0A3D62] shadow-sm">
              <BookOpenCheck
                size={12}
                className="text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Formación disponible
            </span>

            <h2
              id="cursos-disponibles-titulo"
              className="mt-2 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
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

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
              Consulta fechas, modalidad, disponibilidad y
              detalles de cada actividad formativa.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-3 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <GraduationCap
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-gray-400">
                Resultados
              </p>

              <p className="text-xs font-extrabold text-[#0A3D62] sm:text-sm">
                {listaCursos.length}{" "}
                {listaCursos.length === 1
                  ? "curso"
                  : "cursos"}
              </p>
            </div>
          </div>
        </div>

        {/* Nueve cursos: tres filas de tres */}
        <div className="relative grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listaCursos.map((curso) => (
            <CursoCard
              key={String(curso.id)}
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
              inscripcionesAbiertas={Boolean(
                curso.inscripcionesAbiertas,
              )}
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

        {/* Aviso inferior compacto */}
        <div className="mx-auto mt-5 flex max-w-2xl items-start justify-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-2.5 text-center shadow-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <p className="text-[11px] font-semibold leading-5 text-gray-500 sm:text-xs">
            Selecciona “Detalles” para consultar toda la
            información y la disponibilidad del curso.
          </p>
        </div>
      </Container>
    </section>
  );
}