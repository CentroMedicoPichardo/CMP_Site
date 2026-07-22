import Image from "next/image";
import {
  HeartHandshake,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

const valores = [
  {
    texto: "Atención pediátrica",
    icono: Stethoscope,
  },
  {
    texto: "Trato humano",
    icono: HeartHandshake,
  },
  {
    texto: "Confianza familiar",
    icono: ShieldCheck,
  },
];

export function QuienesSomosHeader() {
  return (
    <section className="relative isolate overflow-hidden bg-[#082F4D] text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/headerquienesomos.png"
          alt="Familia recibiendo atención cercana en Centro Médico Pichardo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[65%_center]"
        />
      </div>

      {/* Capas de contraste */}
      <div
        className="absolute inset-0 -z-20 bg-[#061C2E]/45"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#061C2E] via-[#0A3D62]/90 to-[#0A3D62]/30"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-20 bg-gradient-to-t from-[#061C2E]/65 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Luces decorativas */}
      <div
        className="pointer-events-none absolute -left-20 top-8 -z-10 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative py-10 sm:py-12 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Contenido principal */}
            <div className="max-w-3xl lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-xs">
                <Sparkles
                  size={14}
                  className="text-[#FFC300]"
                  aria-hidden="true"
                />

                Quiénes somos
              </div>

              <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Cuidado pediátrico con{" "}
                <span className="relative inline-block text-[#FFC300]">
                  propósito
                  <span
                    className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFC300]/55"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-lg">
                En Centro Médico Pichardo acompañamos a cada familia con
                atención cercana, profesional y humana durante el crecimiento
                y bienestar de sus hijos.
              </p>

              {/* Valores */}
              <div className="mt-5 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3">
                {valores.map(({ texto, icono: Icono }) => (
                  <div
                    key={texto}
                    className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-md transition-colors hover:bg-white/15"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC300] text-[#0A3D62] shadow-sm">
                      <Icono
                        size={17}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <span className="text-xs font-bold leading-snug text-white sm:text-sm">
                      {texto}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta institucional */}
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl lg:ml-auto">
                <div
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/5"
                  aria-hidden="true"
                />

                <div
                  className="absolute bottom-0 left-0 h-1 w-full bg-[#FFC300]"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-md">
                    <HeartPulse
                      size={24}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC300]">
                    Más que atención médica
                  </span>

                  <h2 className="mt-1.5 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    Un aliado para cada etapa de su familia
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/75">
                    Creamos un espacio donde cada paciente es escuchado,
                    atendido y acompañado con sensibilidad y dedicación.
                  </p>

                  <div className="mt-4 flex items-start gap-2.5 border-t border-white/15 pt-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#FFC300]">
                      <HeartHandshake
                        size={16}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="text-xs font-semibold leading-5 text-white/90 sm:text-sm">
                      La salud de sus hijos es el centro de nuestro trabajo.
                    </p>
                  </div>
                </div>
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