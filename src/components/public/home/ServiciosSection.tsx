"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { publicRoutes } from "@/config/routes";

interface ServicioInicio {
  id: string | number;
  titulo?: string | null;
  descripcion?: string | null;
  ubicacion?: string | null;
  imagenSrc?: string | null;
}

interface ServiciosSectionProps {
  servicios: ServicioInicio[];
}

interface ServicioNormalizado {
  id: string | number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  imagenSrc?: string;
}

function normalizarServicio(
  servicio: ServicioInicio,
): ServicioNormalizado {
  return {
    id: servicio.id,
    titulo:
      servicio.titulo?.trim() ||
      "Servicio médico",
    descripcion:
      servicio.descripcion?.trim() ||
      "Atención médica profesional, cercana y enfocada en el bienestar de cada paciente.",
    ubicacion:
      servicio.ubicacion?.trim() ||
      "Centro Médico Pichardo",
    imagenSrc:
      servicio.imagenSrc?.trim() ||
      undefined,
  };
}

export function ServiciosSection({
  servicios,
}: ServiciosSectionProps) {
  const serviciosDestacados = Array.isArray(
    servicios,
  )
    ? servicios
        .slice(0, 4)
        .map(normalizarServicio)
    : [];

  if (serviciosDestacados.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden border-t border-gray-200 bg-white py-9 sm:py-10 lg:py-12"
      aria-labelledby="servicios-familia-titulo"
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
        className="pointer-events-none absolute -left-24 top-16 h-52 w-52 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado */}
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0A3D62]">
              <Sparkles
                size={12}
                className="text-[#B88600]"
                aria-hidden="true"
              />

              Atención para toda la familia
            </span>

            <h2
              id="servicios-familia-titulo"
              className="mt-2.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl lg:text-4xl"
            >
              Servicios médicos con{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  atención humana
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Atención profesional y especializada para
              cuidar la salud de cada integrante de tu
              familia.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <Stethoscope
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-gray-400">
                Destacados
              </p>

              <p className="text-sm font-extrabold text-[#0A3D62]">
                {serviciosDestacados.length}{" "}
                {serviciosDestacados.length === 1
                  ? "servicio"
                  : "servicios"}
              </p>
            </div>
          </div>
        </div>

        {/* Servicios destacados */}
        <div className="relative grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
          {serviciosDestacados.map(
            (servicio, index) => (
              <ServicioCard
                key={String(servicio.id)}
                servicio={servicio}
                numero={index + 1}
              />
            ),
          )}
        </div>

        {/* Franja inferior */}
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#0A3D62]/10 bg-[#F7FAFC]">
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
              <Beneficio
                icono={
                  <BadgeCheck
                    size={18}
                    aria-hidden="true"
                  />
                }
                titulo="Atención profesional"
                descripcion="Personal preparado y comprometido."
              />

              <Beneficio
                icono={
                  <HeartPulse
                    size={18}
                    aria-hidden="true"
                  />
                }
                titulo="Trato humano"
                descripcion="Cuidado cercano para cada familia."
              />

              <Beneficio
                icono={
                  <ShieldCheck
                    size={18}
                    aria-hidden="true"
                  />
                }
                titulo="Servicio confiable"
                descripcion="Calidad y seguridad en la atención."
              />
            </div>

            <div className="border-t border-gray-200 bg-[#0A3D62] p-4 md:border-l md:border-t-0 md:px-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFC300]">
                Conoce nuestra atención
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-white/70">
                Consulta el catálogo completo y encuentra
                el servicio que necesitas.
              </p>

              <Link
                href={publicRoutes.servicios}
                className="group mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-4 py-2.5 text-sm font-extrabold text-[#0A3D62] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explorar servicios

                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

interface ServicioCardProps {
  servicio: ServicioNormalizado;
  numero: number;
}

function ServicioCard({
  servicio,
  numero,
}: ServicioCardProps) {
  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    setImageError(false);
  }, [servicio.imagenSrc]);

  const mostrarImagen =
    Boolean(servicio.imagenSrc) &&
    !imageError;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_9px_28px_rgba(10,61,98,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0A3D62]/20 hover:shadow-[0_16px_36px_rgba(10,61,98,0.12)] sm:min-h-[220px] sm:flex-row">
      {/* Imagen */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-[#DDE8EF] sm:h-auto sm:w-[38%] lg:w-[40%]">
        {mostrarImagen ? (
          <>
            <Image
              src={servicio.imagenSrc!}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="scale-110 object-cover object-center opacity-40 blur-xl"
              aria-hidden="true"
            />

            <div
              className="absolute inset-0 bg-[#0A3D62]/10"
              aria-hidden="true"
            />

            <div className="absolute inset-2 overflow-hidden rounded-2xl">
              <Image
                src={servicio.imagenSrc!}
                alt={`Servicio de ${servicio.titulo}`}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                onError={() => setImageError(true)}
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#FFC300] backdrop-blur-sm">
              <HeartPulse
                size={31}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#061C2E]/70 to-transparent sm:hidden"
          aria-hidden="true"
        />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62] shadow-md">
          Servicio {String(numero).padStart(2, "0")}
        </span>
      </div>

      {/* Información */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <Stethoscope
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#B88600]">
              Atención especializada
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-6 text-[#0A3D62] sm:text-xl">
              {servicio.titulo}
            </h3>
          </div>
        </div>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {servicio.descripcion}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF6D6] text-[#9A7300]">
            <MapPinned
              size={15}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Disponible en
            </p>

            <p
              className="truncate text-xs font-bold text-[#0A3D62]"
              title={servicio.ubicacion}
            >
              {servicio.ubicacion}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

interface BeneficioProps {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
}

function Beneficio({
  icono,
  titulo,
  descripcion,
}: BeneficioProps) {
  return (
    <div className="flex items-start gap-3 bg-white px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
        {icono}
      </span>

      <div>
        <h3 className="text-xs font-extrabold text-[#0A3D62]">
          {titulo}
        </h3>

        <p className="mt-0.5 text-[11px] leading-5 text-gray-500">
          {descripcion}
        </p>
      </div>
    </div>
  );
}