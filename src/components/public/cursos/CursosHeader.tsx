"use client";

import Image from "next/image";
import {
  BookOpenCheck,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { CursosSearchBar } from "./CursosSearchBar";
import { FiltroCursos } from "./CursosFilters";

interface CursosHeaderProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function CursosHeader({
  busqueda,
  setBusqueda,
}: CursosHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#082F4D] text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/headercursos.png"
          alt="Cursos y talleres del Centro Médico Pichardo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[62%_center]"
        />
      </div>

      {/* Capas de contraste */}
      <div
        className="absolute inset-0 -z-20 bg-[#061C2E]/50"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#061C2E]/95 via-[#0A3D62]/88 to-[#0A3D62]/45"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-t from-[#061C2E]/65 via-transparent to-[#061C2E]/20"
        aria-hidden="true"
      />

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-20 top-6 -z-10 h-40 w-40 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative py-7 sm:py-8 lg:py-9">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
            {/* Información */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-[10px]">
                <Sparkles
                  size={12}
                  className="text-[#FFC300]"
                  aria-hidden="true"
                />

                Formación para las familias
              </span>

              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Aprende, participa y fortalece el cuidado de{" "}
                <span className="relative inline-block text-[#FFC300]">
                  tu familia
                  <span
                    className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-[#FFC300]/60"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base lg:mx-0">
                Explora cursos y talleres impartidos por especialistas,
                diseñados para padres, cuidadores, niños y adolescentes.
              </p>

              {/* Características */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFC300] text-[#0A3D62]">
                    <BookOpenCheck
                      size={13}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  Contenido especializado
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFC300] text-[#0A3D62]">
                    <UsersRound
                      size={13}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  Para diferentes públicos
                </span>
              </div>
            </div>

            {/* Buscador y filtros */}
            <div className="min-w-0">
              {/* Buscador */}
              <div className="rounded-2xl border border-white/20 bg-white/95 p-2 shadow-[0_14px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="mb-1.5 flex items-center gap-2 px-2 text-left">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
                    <Search
                      size={14}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0A3D62]">
                      Busca un curso o taller
                    </p>

                    <p className="hidden text-[11px] text-gray-500 sm:block">
                      Ingresa el nombre, tema o palabra relacionada.
                    </p>
                  </div>
                </div>

                <CursosSearchBar
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                />
              </div>

              {/* Filtros */}
              <div className="mt-3 [&>section]:mb-0">
                <FiltroCursos />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Línea inferior */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}