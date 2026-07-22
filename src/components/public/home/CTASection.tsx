import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { publicRoutes } from "@/config/routes";

const beneficios = [
  {
    texto: "Registro rápido",
    icono: BadgeCheck,
  },
  {
    texto: "Información segura",
    icono: ShieldCheck,
  },
  {
    texto: "Atención cercana",
    icono: HeartHandshake,
  },
];

export function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#082F4D] py-10 text-white sm:py-12 lg:py-14">
      {/* Fondos decorativos */}
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-br from-[#061C2E] via-[#0A3D62] to-[#1A4F7A]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-24 top-1/2 -z-20 h-56 w-56 -translate-y-1/2 rounded-full bg-[#FFC300]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-0 -z-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden="true"
      />

      {/* División superior */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-20 rounded-b-full bg-[#FFC300]" />
      </div>

      <Container>
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-10">
          {/* Información */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              <Sparkles
                size={13}
                className="text-[#FFC300]"
                aria-hidden="true"
              />

              Centro Médico Pichardo
            </span>

            <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:mx-0 lg:text-4xl">
              Da el siguiente paso para cuidar{" "}
              <span className="relative inline-block text-[#FFC300]">
                tu bienestar
                <span
                  className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-[#FFC300]/60"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base lg:mx-0">
              Crea tu cuenta para acceder a nuestros cursos,
              servicios médicos y contenido pensado para el
              bienestar de toda tu familia.
            </p>

            {/* Beneficios */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {beneficios.map(({ texto, icono: Icono }) => (
                <div
                  key={texto}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFC300] text-[#0A3D62]">
                    <Icono
                      size={14}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  {texto}
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-sm">
                <HeartHandshake
                  size={22}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white sm:text-lg">
                  Comienza hoy
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                  Elige la opción que mejor se adapte a lo que
                  necesitas.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Link
                href={publicRoutes.registro}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-3 text-sm font-extrabold text-[#0A3D62] shadow-sm transition-all duration-200 hover:bg-[#FFD84D] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A3D62]"
              >
                Crear cuenta gratis

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href={publicRoutes.contacto}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                Contactar ahora
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/10 pt-3 text-center">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

              <p className="text-[11px] font-medium leading-5 text-white/60">
                Registro gratuito y acceso desde cualquier dispositivo.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}