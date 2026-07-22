import Image from "next/image";
import {
  Heart,
  Quote,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

interface HistoriaSectionProps {
  historia: string;
  compromiso: string;
  imagenSrc: string;
}

export function HistoriaSection({
  historia,
  compromiso,
  imagenSrc,
}: HistoriaSectionProps) {
  const textoHistoria =
    historia ||
    "Desde nuestros inicios, nos hemos dedicado a brindar atención médica de excelencia a las familias de Huejutla. Lo que comenzó como un pequeño consultorio, hoy es un centro médico de referencia en la región, siempre manteniendo la calidez humana que nos caracteriza.";

  const textoCompromiso =
    compromiso ||
    "Trabajamos cada día para ofrecer un servicio de salud cercano, humano y de calidad. Nos esforzamos por crear un ambiente de confianza donde cada familia se sienta escuchada y atendida con la dedicación que sus hijos merecen.";

  return (
    <section className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
      {/* Detalle superior */}
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-20 rounded-full bg-[#FFC300]" />
      </div>

      {/* Fondos decorativos */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado */}
        <div className="mb-8 text-center sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A3D62] shadow-sm sm:text-xs">
            <Sparkles
              size={14}
              className="text-[#D69F00]"
              aria-hidden="true"
            />
            Conoce nuestro camino
          </span>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-[#0A3D62] sm:text-4xl lg:text-5xl">
            Una historia construida alrededor de las{" "}
            <span className="relative inline-block">
              <span className="relative z-10">familias</span>
              <span
                className="absolute bottom-1 left-0 h-3 w-full rounded-full bg-[#FFC300]/35"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            Nuestro crecimiento ha sido guiado por la confianza de quienes nos
            permiten acompañarlos en el cuidado de su salud.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Imagen mejorada */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-xl">
              {/* Marco exterior */}
              <div
                className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-[2rem] border-2 border-[#FFC300]/70 lg:block"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(10,61,98,0.12)]">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F7FAFC] to-[#EAF2F8]" />

                <div
                  className="pointer-events-none absolute left-1/2 top-[38%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC300]/15 blur-3xl"
                  aria-hidden="true"
                />

                <div
                  className="pointer-events-none absolute left-1/2 top-[38%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A3D62]/10 blur-2xl"
                  aria-hidden="true"
                />

                {/* Imagen */}
                <div className="relative min-h-[420px] sm:min-h-[480px]">
                  <Image
                    src={imagenSrc}
                    alt="Historia del Centro Médico Pichardo"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                {/* Overlay inferior */}
                <div
                  className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A3D62]/88 via-[#0A3D62]/35 to-transparent"
                  aria-hidden="true"
                />

                {/* Texto inferior */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-xs">
                    <Heart
                      size={13}
                      className="text-[#FFC300]"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                    Nuestra vocación
                  </span>

                  <p className="mt-3 max-w-sm text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                    Cuidar la salud de cada familia con cercanía y
                    profesionalismo.
                  </p>
                </div>
              </div>

              {/* Tarjeta flotante */}
              <div className="absolute left-4 top-4 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:left-6 sm:top-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3D62] text-white">
                    <BadgeCheck
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Atención
                    </p>
                    <p className="text-sm font-extrabold text-[#0A3D62]">
                      Humana y cercana
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="lg:col-span-7">
            <div className="space-y-5">
              {/* Historia */}
              <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div
                  className="absolute left-0 top-0 h-full w-1.5 bg-[#0A3D62]"
                  aria-hidden="true"
                />

                {/* Comillas visibles */}
                <Quote
                  size={70}
                  className="absolute right-6 top-5 text-[#0A3D62]/18"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                      <Quote
                        size={22}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A3D62] sm:text-xs">
                        Nuestro origen
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
                        Nuestra historia
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                    {textoHistoria}
                  </p>
                </div>
              </article>

              {/* Compromiso */}
              <article className="relative overflow-hidden rounded-3xl bg-[#0A3D62] p-6 text-white shadow-xl sm:p-8">
                <div
                  className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[22px] border-white/5"
                  aria-hidden="true"
                />

                <div
                  className="absolute bottom-0 left-0 h-1.5 w-full bg-[#FFC300]"
                  aria-hidden="true"
                />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-md">
                    <ShieldCheck
                      size={25}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC300] sm:text-xs">
                      Lo que nos guía
                    </span>

                    <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">
                      Nuestro compromiso
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                      {textoCompromiso}
                    </p>

                    <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Heart
                          size={15}
                          className="text-[#FFC300]"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </div>

                      <p className="text-sm font-bold text-[#FFC300] sm:text-base">
                        Su tranquilidad es nuestro motor.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Frase final */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-sm sm:px-5">
                <div className="h-px w-8 shrink-0 bg-[#FFC300]" />
                <p className="text-xs font-semibold leading-6 text-gray-500 sm:text-sm">
                  Cada etapa de nuestro crecimiento conserva el mismo propósito:
                  ofrecer atención médica de calidad con un trato cercano,
                  respetuoso y profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}