import {
  CheckCircle2,
  Eye,
  Heart,
  Sparkles,
  Target,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

interface MisionVisionValoresProps {
  mision: string;
  vision: string;
  valores: string[];
}

const valoresPredeterminados = [
  "Compromiso con la excelencia médica",
  "Calidez y empatía en el trato",
  "Honestidad y transparencia",
  "Trabajo en equipo",
];

export function MisionVisionValores({
  mision,
  vision,
  valores,
}: MisionVisionValoresProps) {
  const textoMision =
    mision ||
    "Brindar atención pediátrica integral de excelencia, con calidez humana y profesionalismo, acompañando a las familias en el crecimiento y desarrollo saludable de sus hijos.";

  const textoVision =
    vision ||
    "Ser el centro pediátrico de referencia en la región, reconocido por nuestra calidad médica, innovación y el trato cercano que brindamos a cada familia.";

  const listaValores =
    valores && valores.length > 0
      ? valores
      : valoresPredeterminados;

  return (
    <section className="relative overflow-hidden border-t border-gray-200 bg-white pb-14 pt-9 sm:pb-16 sm:pt-11 lg:pb-20 lg:pt-12">
      {/* División superior */}
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-20 rounded-full bg-[#FFC300]" />
      </div>

      {/* Elementos decorativos */}
      <div
        className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado */}
        <div className="relative mx-auto mb-9 max-w-3xl text-center sm:mb-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A3D62] shadow-sm sm:text-xs">
            <Sparkles
              size={14}
              className="text-[#D69F00]"
              aria-hidden="true"
            />

            Lo que define nuestro trabajo
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#0A3D62] sm:text-4xl lg:text-5xl">
            Nuestra{" "}
            <span className="relative inline-block">
              <span className="relative z-10">filosofía</span>

              <span
                className="absolute bottom-1 left-0 h-3 w-full rounded-full bg-[#FFC300]/35"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            Los principios que orientan nuestras decisiones, la atención
            médica y la relación que construimos con cada familia.
          </p>
        </div>

        {/* Misión y visión */}
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Misión */}
          <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-[#F9FBFD] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-7">
            <div
              className="absolute left-0 top-0 h-full w-1.5 bg-blue-600"
              aria-hidden="true"
            />

            <div
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[22px] border-blue-600/5"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md sm:h-14 sm:w-14">
                  <Target
                    size={28}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <span className="text-4xl font-black leading-none text-blue-600/10 sm:text-5xl">
                  01
                </span>
              </div>

              <div className="mt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-xs">
                  Nuestro propósito diario
                </span>

                <h3 className="mt-1 text-2xl font-extrabold text-[#0A3D62] sm:text-3xl">
                  Misión
                </h3>

                <div className="mt-4 h-1 w-14 rounded-full bg-blue-600" />

                <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                  {textoMision}
                </p>
              </div>
            </div>
          </article>

          {/* Visión */}
          <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-[#FFFCF4] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC300]/60 hover:shadow-xl sm:p-7">
            <div
              className="absolute left-0 top-0 h-full w-1.5 bg-[#FFC300]"
              aria-hidden="true"
            />

            <div
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[22px] border-[#FFC300]/10"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-md sm:h-14 sm:w-14">
                  <Eye
                    size={29}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <span className="text-4xl font-black leading-none text-[#D69F00]/15 sm:text-5xl">
                  02
                </span>
              </div>

              <div className="mt-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B88600] sm:text-xs">
                  Hacia dónde avanzamos
                </span>

                <h3 className="mt-1 text-2xl font-extrabold text-[#0A3D62] sm:text-3xl">
                  Visión
                </h3>

                <div className="mt-4 h-1 w-14 rounded-full bg-[#FFC300]" />

                <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                  {textoVision}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Valores */}
        <article className="relative mt-6 overflow-hidden rounded-3xl bg-[#0A3D62] p-5 text-white shadow-xl sm:p-7 lg:p-8">
          <div
            className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[30px] border-white/5"
            aria-hidden="true"
          />

          <div
            className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#FFC300]/10 blur-2xl"
            aria-hidden="true"
          />

          <div
            className="absolute bottom-0 left-0 h-1.5 w-full bg-[#FFC300]"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-md sm:h-14 sm:w-14">
                  <Heart
                    size={27}
                    fill="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC300] sm:text-xs">
                    La base de nuestra atención
                  </span>

                  <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                    Nuestros valores
                  </h3>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-6 text-white/70 sm:text-right sm:text-base">
                Principios presentes en cada consulta, decisión y relación
                con nuestros pacientes.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {listaValores.map((valor, index) => (
                <div
                  key={`${valor}-${index}`}
                  className="group/valor flex min-h-[92px] items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm transition-colors hover:border-[#FFC300]/40 hover:bg-white/12"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFC300]/15 text-[#FFC300]">
                    <CheckCircle2
                      size={19}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                      Valor {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-1 text-sm font-semibold leading-6 text-white sm:text-base">
                      {valor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}