"use client";

import {
  SearchX,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { MedicoCard } from "@/components/public/medico/MedicoCard";

interface Medico {
  id: string | number;
  nombre: string;
  especialidad: string;
  hospital?: string;
  direccion?: string;
  imagenSrc: string;
}

interface MedicoLayoutProps {
  medicos: Medico[];
}

export function MedicoLayout({
  medicos,
}: MedicoLayoutProps) {
  const listaMedicos = Array.isArray(medicos)
    ? medicos
    : [];

  if (listaMedicos.length === 0) {
    return (
      <section className="relative border-t border-gray-200 bg-[#F7FAFC] py-12 sm:py-14">
        {/* División superior */}
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
              No se encontraron médicos
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              No hay especialistas que coincidan con tu búsqueda.
              Prueba utilizando otro nombre o especialidad.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-12 pt-9 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
      aria-labelledby="directorio-medico-titulo"
    >
      {/* División superior */}
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
      </div>

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-24 top-20 h-52 w-52 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado */}
        <div className="relative mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A3D62] shadow-sm">
              <Sparkles
                size={13}
                className="text-[#D69F00]"
                aria-hidden="true"
              />

              Nuestro equipo médico
            </span>

            <h2
              id="directorio-medico-titulo"
              className="mt-3 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
            >
              Conoce a nuestros{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  especialistas
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Profesionales comprometidos con brindar atención
              médica cercana, humana y de calidad.
            </p>
          </div>

          {/* Contador */}
          <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <UsersRound
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Disponibles
              </p>

              <p className="text-sm font-extrabold text-[#0A3D62]">
                {listaMedicos.length}{" "}
                {listaMedicos.length === 1
                  ? "especialista"
                  : "especialistas"}
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de directorio */}
        <div className="relative mb-5 flex items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-sm sm:mb-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF6D6] text-[#B88600]">
            <Stethoscope
              size={18}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0A3D62]">
              Directorio de especialistas
            </p>

            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              Consulta su especialidad, unidad médica y ubicación.
            </p>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="relative grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {listaMedicos.map((medico) => (
            <MedicoCard
              key={medico.id}
              nombre={
                medico.nombre?.trim() ||
                "Especialista médico"
              }
              especialidad={
                medico.especialidad?.trim() ||
                "Medicina general"
              }
              hospital={
                medico.hospital?.trim() ||
                "Centro Médico Pichardo"
              }
              direccion={
                medico.direccion?.trim() ||
                "Huejutla de Reyes, Hidalgo"
              }
              imagenSrc={
                medico.imagenSrc?.trim() ||
                "/images/default-medico.jpg"
              }
            />
          ))}
        </div>

        {/* Mensaje inferior */}
        <div className="mx-auto mt-7 flex max-w-2xl items-center justify-center gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-2.5 text-center shadow-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <p className="text-xs font-semibold leading-5 text-gray-500">
            Nuestro equipo trabaja para ofrecer atención profesional,
            cercana y enfocada en el bienestar de cada paciente.
          </p>
        </div>
      </Container>
    </section>
  );
}