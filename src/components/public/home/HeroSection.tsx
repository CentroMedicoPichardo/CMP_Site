import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { publicRoutes } from "@/config/routes";

const indicadores = [
  {
    valor: "15+",
    texto: "Años de experiencia",
  },
  {
    valor: "8",
    texto: "Especialidades",
  },
  {
    valor: "24/7",
    texto: "Atención de urgencias",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#061C2E] text-white">
      {/* Imagen principal */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/herodoctorniños.png"
          alt="Médico brindando atención pediátrica"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-[68%_center] lg:object-center"
        />
      </div>

      {/* Capas de contraste */}
      <div
        className="absolute inset-0 -z-20 bg-[#061C2E]/35"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#061C2E]/98 via-[#0A3D62]/90 to-[#0A3D62]/20"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-t from-[#061C2E]/75 via-transparent to-[#061C2E]/25"
        aria-hidden="true"
      />

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-20 top-10 -z-10 h-52 w-52 rounded-full bg-[#FFC300]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:34px_34px]"
        aria-hidden="true"
      />

      <Container>
        <div className="relative py-11 sm:py-14 lg:py-16">
          <div className="max-w-3xl text-center sm:text-left">
            {/* Etiqueta */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
              <HeartPulse
                size={13}
                className="text-[#FFC300]"
                strokeWidth={2}
                aria-hidden="true"
              />

              Atención pediátrica de excelencia
            </span>

            {/* Título */}
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Cuidamos la salud de quienes más{" "}
              <span className="relative inline-block text-[#FFC300]">
                amas
                <span
                  className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#FFC300]/60"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Descripción */}
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:mx-0 sm:text-base lg:text-lg lg:leading-7">
              Bienvenido al Centro Médico Pichardo. Atención
              pediátrica cercana, profesional y humana, liderada por
              el Dr. Francisco Javier Moreno Pichardo.
            </p>

            {/* Acciones */}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
              <Link
                href={publicRoutes.servicios}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-3 text-sm font-extrabold text-[#0A3D62] shadow-[0_10px_25px_rgba(255,195,0,0.2)] transition-all hover:bg-[#FFD84D] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A3D62]"
              >
                <HeartPulse
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                Nuestros servicios

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href={publicRoutes.directorioMedico}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
              >
                <Stethoscope
                  size={17}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                Directorio médico
              </Link>
            </div>

            {/* Indicadores */}
            <div className="mt-7 grid grid-cols-3 gap-2.5 sm:max-w-2xl sm:gap-3">
              {indicadores.map((indicador) => (
                <div
                  key={indicador.texto}
                  className="rounded-xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-md sm:px-3 sm:text-left"
                >
                  <p className="text-xl font-extrabold leading-none text-[#FFC300] sm:text-2xl">
                    {indicador.valor}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold leading-4 text-white/65 sm:text-[11px]">
                    {indicador.texto}
                  </p>
                </div>
              ))}
            </div>

            {/* Información rápida */}
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/15 bg-[#061C2E]/45 p-3 backdrop-blur-md sm:max-w-2xl sm:flex-row sm:items-center sm:gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC300] text-[#0A3D62]">
                  <Clock3
                    size={15}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/50">
                    Horario
                  </p>

                  <p className="truncate text-xs font-semibold text-white/90">
                    Lun–Vie 8:00–20:00 · Sáb 8:00–14:00
                  </p>
                </div>
              </div>

              <div
                className="hidden h-8 w-px bg-white/15 sm:block"
                aria-hidden="true"
              />

              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFC300]">
                  <MapPinned
                    size={15}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/50">
                    Ubicación
                  </p>

                  <p className="truncate text-xs font-semibold text-white/90">
                    Huejutla de Reyes, Hidalgo
                  </p>
                </div>
              </div>

              <ShieldCheck
                size={18}
                className="hidden shrink-0 text-emerald-400 sm:block"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Acabado inferior */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
        aria-hidden="true"
      />

      <div
        className="absolute bottom-0 right-5 hidden items-center gap-2 rounded-t-xl border-x border-t border-white/10 bg-[#061C2E]/70 px-4 py-2 text-[10px] font-semibold text-white/65 backdrop-blur-md lg:flex"
        aria-hidden="true"
      >
        <UsersRound
          size={14}
          className="text-[#FFC300]"
        />

        Atención cercana para toda la familia
      </div>
    </section>
  );
}