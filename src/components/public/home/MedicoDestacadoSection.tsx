import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CircleCheck,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { publicRoutes } from "@/config/routes";

interface MedicoDestacado {
  nombre?: string | null;
  especialidad?: string | null;
  hospital?: string | null;
  direccion?: string | null;
  imagenSrc?: string | null;
}

interface MedicoDestacadoSectionProps {
  medico: MedicoDestacado;
}

export function MedicoDestacadoSection({
  medico,
}: MedicoDestacadoSectionProps) {
  const nombre =
    medico?.nombre?.trim() ||
    "Dr. Francisco Javier Moreno Pichardo";

  const especialidad =
    medico?.especialidad?.trim() || "Pediatría";

  const hospital =
    medico?.hospital?.trim() ||
    "Centro Médico Pichardo";

  const direccion =
    medico?.direccion?.trim() ||
    "Huejutla de Reyes, Hidalgo";

  const imagenSrc =
    medico?.imagenSrc?.trim() || null;

  return (
    <section
      className="relative overflow-hidden border-t border-gray-200 bg-white py-7 sm:py-8 lg:py-9"
      aria-labelledby="liderazgo-medico-titulo"
    >
      {/* Separador superior */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-20 rounded-full bg-[#FFC300]" />
      </div>

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-24 top-8 h-44 w-44 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Contenedor extendido */}
      <div className="relative w-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10">
        {/* Encabezado */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0A3D62]">
              <Award
                size={12}
                className="text-[#B88600]"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Liderazgo médico
            </span>

            <h2
              id="liderazgo-medico-titulo"
              className="mt-2 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
            >
              Experiencia que inspira{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  confianza
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-5 text-gray-500 sm:leading-6">
              Conoce al profesional que dirige nuestro compromiso
              con una atención médica humana, cercana y de calidad.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
            <ShieldCheck
              size={15}
              className="shrink-0 text-emerald-600"
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <p className="text-[11px] font-bold text-emerald-700 sm:text-xs">
              Atención profesional y confiable
            </p>
          </div>
        </div>

        {/* Tarjeta horizontal */}
        <article className="relative overflow-hidden rounded-3xl border border-[#0A3D62]/10 bg-white shadow-[0_12px_35px_rgba(10,61,98,0.10)]">
          <div className="grid sm:min-h-[285px] sm:grid-cols-[210px_minmax(0,1fr)] lg:min-h-[265px] lg:grid-cols-[260px_minmax(0,1fr)] xl:min-h-[250px] xl:grid-cols-[290px_minmax(0,1fr)]">
            {/* Fotografía */}
            <div className="relative h-56 overflow-hidden border-b border-gray-200 bg-[#DDE8EF] sm:h-auto sm:border-b-0 sm:border-r">
              {imagenSrc ? (
                <>
                  {/* Fondo desenfocado */}
                  <Image
                    src={imagenSrc}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 290px"
                    className="scale-110 object-cover object-center opacity-40 blur-xl"
                    aria-hidden="true"
                  />

                  <div
                    className="absolute inset-0 bg-[#0A3D62]/10"
                    aria-hidden="true"
                  />

                  {/* Imagen completa */}
                  <div className="absolute inset-2.5 overflow-hidden rounded-2xl sm:inset-3">
                    <Image
                      src={imagenSrc}
                      alt={`Fotografía de ${nombre}`}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 290px"
                      className="object-contain object-center"
                    />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm">
                    <UserRound
                      size={31}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}

              <div
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#061C2E]/75 to-transparent sm:hidden"
                aria-hidden="true"
              />

              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62] shadow-md">
                <BadgeCheck
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                Médico destacado
              </span>
            </div>

            {/* Información */}
            <div className="flex min-w-0 flex-col p-4 sm:p-4 lg:px-6 lg:py-5 xl:px-7">
              {/* Nombre y descripción */}
              <div className="flex items-start gap-3">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300] md:flex">
                  <HeartPulse
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#B88600] sm:text-[9px]">
                    Dirección médica
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl lg:text-[26px]">
                    {nombre}
                  </h3>

                  <p className="mt-1.5 max-w-5xl text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                    Comprometido con brindar atención médica
                    especializada, cálida y enfocada en las
                    necesidades de cada paciente y su familia.
                  </p>
                </div>
              </div>

              {/* Especialidad, institución y ubicación */}
              <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 lg:gap-3">
                <InfoMedico
                  icono={
                    <Stethoscope
                      size={16}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Especialidad"
                  valor={especialidad}
                />

                <InfoMedico
                  icono={
                    <Building2
                      size={16}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Institución"
                  valor={hospital}
                />

                <InfoMedico
                  icono={
                    <MapPinned
                      size={16}
                      aria-hidden="true"
                    />
                  }
                  etiqueta="Ubicación"
                  valor={direccion}
                />
              </div>

              {/* Pie */}
              <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-gray-100 pt-3 sm:pt-4">
                <div className="flex min-w-0 items-start gap-2">
                  <CircleCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <p className="text-[10px] font-semibold leading-4 text-gray-500 sm:text-xs sm:leading-5">
                    Liderazgo, experiencia y compromiso con el
                    bienestar de las familias.
                  </p>
                </div>

                <Link
                  href={publicRoutes.quienesSomos}
                  className="group inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0A3D62] px-3 py-2 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 sm:min-h-10 sm:px-4 sm:text-xs lg:text-sm"
                >
                  <span className="hidden md:inline">
                    Conocer la institución
                  </span>

                  <span className="md:hidden">
                    Conocer más
                  </span>

                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
            aria-hidden="true"
          />
        </article>
      </div>
    </section>
  );
}

interface InfoMedicoProps {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
}

function InfoMedico({
  icono,
  etiqueta,
  valor,
}: InfoMedicoProps) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-xl border border-gray-200 bg-[#F8FAFC] px-2 py-2.5 sm:px-3">
      <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62] md:flex">
        {icono}
      </span>

      <div className="min-w-0">
        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-gray-400 sm:text-[8px] lg:tracking-[0.12em]">
          {etiqueta}
        </p>

        <p
          className="mt-0.5 break-words text-[9px] font-bold leading-3.5 text-[#0A3D62] sm:text-[10px] sm:leading-4 lg:text-xs lg:leading-5"
          title={valor}
        >
          {valor}
        </p>
      </div>
    </div>
  );
}