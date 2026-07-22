"use client";

import Image from "next/image";
import {
  HeartPulse,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ServiciosSearchBar } from "./ServiciosSearchBar";

interface ServiciosHeaderProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

const caracteristicas = [
  {
    texto: "Atención especializada",
    icono: Stethoscope,
  },
  {
    texto: "Servicio profesional",
    icono: ShieldCheck,
  },
  {
    texto: "Cuidado integral",
    icono: HeartPulse,
  },
];

export function ServiciosHeader({
  busqueda,
  setBusqueda,
}: ServiciosHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#082F4D] text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/headerimg.png"
          alt="Servicios médicos del Centro Médico Pichardo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[60%_center]"
        />
      </div>

      {/* Capas de contraste */}
      <div
        className="absolute inset-0 -z-20 bg-[#061C2E]/40"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#061C2E]/95 via-[#0A3D62]/88 to-[#0A3D62]/35"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-t from-[#061C2E]/65 via-transparent to-[#061C2E]/15"
        aria-hidden="true"
      />

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-16 top-4 -z-10 h-36 w-36 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-44 w-44 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative py-7 sm:py-8 lg:py-9">
          <div className="mx-auto max-w-5xl text-center">
            {/* Etiqueta */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-[10px]">
              <Sparkles
                size={12}
                className="text-[#FFC300]"
                aria-hidden="true"
              />

              Atención para toda la familia
            </span>

            {/* Título */}
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Encuentra el servicio que necesitas para cuidar{" "}
              <span className="relative inline-block text-[#FFC300]">
                tu salud
                <span
                  className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-[#FFC300]/60"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Descripción */}
            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Conoce nuestros servicios médicos y encuentra atención
              profesional, personalizada y cercana para cada etapa de tu
              bienestar.
            </p>

            {/* Características */}
            <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-2">
              {caracteristicas.map(({ texto, icono: Icono }) => (
                <div
                  key={texto}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md sm:text-xs"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FFC300] text-[#0A3D62]">
                    <Icono
                      size={13}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  {texto}
                </div>
              ))}
            </div>

            {/* Buscador */}
            <div className="mx-auto mt-5 max-w-4xl">
              <div className="rounded-2xl border border-white/20 bg-white/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
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
                      Busca un servicio
                    </p>

                    <p className="hidden text-[11px] text-gray-500 sm:block">
                      Ingresa el nombre o tipo de atención que necesitas.
                    </p>
                  </div>
                </div>

                <ServiciosSearchBar
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                />
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