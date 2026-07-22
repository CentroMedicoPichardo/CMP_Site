import {
  HeartPulse,
  LayoutGrid,
  SearchX,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ServicioCardVertical } from "./ServicioCardVertical";
import { ServicioCardHorizontal } from "./ServicioCardHorizontal";

interface Servicio {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenSrc?: string | null;
}

interface ServiciosLayoutProps {
  servicios: Servicio[];
}

interface GrupoServicios {
  verticales: Servicio[];
  horizontales: Servicio[];
}

const SERVICIOS_POR_GRUPO = 8;
const SERVICIOS_VERTICALES = 4;

function agruparServicios(
  servicios: Servicio[],
): GrupoServicios[] {
  const grupos: GrupoServicios[] = [];

  for (
    let index = 0;
    index < servicios.length;
    index += SERVICIOS_POR_GRUPO
  ) {
    const grupoActual = servicios.slice(
      index,
      index + SERVICIOS_POR_GRUPO,
    );

    grupos.push({
      verticales: grupoActual.slice(
        0,
        SERVICIOS_VERTICALES,
      ),
      horizontales: grupoActual.slice(
        SERVICIOS_VERTICALES,
        SERVICIOS_POR_GRUPO,
      ),
    });
  }

  return grupos;
}

export function ServiciosLayout({
  servicios,
}: ServiciosLayoutProps) {
  const listaServicios = Array.isArray(servicios)
    ? servicios
    : [];

  if (listaServicios.length === 0) {
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
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-5 py-10 text-center shadow-[0_12px_35px_rgba(10,61,98,0.08)] sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
              <SearchX
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
              No se encontraron servicios
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              No hay servicios que coincidan con tu búsqueda.
              Prueba utilizando otro nombre o término.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const grupos = agruparServicios(
    listaServicios,
  );

  return (
    <section
      className="relative border-t border-gray-200 bg-[#F7FAFC] pb-12 pt-9 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
      aria-labelledby="servicios-disponibles-titulo"
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
        className="pointer-events-none absolute -right-24 bottom-12 h-56 w-56 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado compacto */}
        <div className="relative mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A3D62] shadow-sm">
              <Sparkles
                size={13}
                className="text-[#D69F00]"
                aria-hidden="true"
              />

              Atención médica
            </span>

            <h2
              id="servicios-disponibles-titulo"
              className="mt-3 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl"
            >
              Conoce nuestros{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  servicios
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Encuentra atención profesional y especializada
              para cuidar tu salud y la de tu familia.
            </p>
          </div>

          {/* Contador */}
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <LayoutGrid
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
                {listaServicios.length}{" "}
                {listaServicios.length === 1
                  ? "servicio"
                  : "servicios"}
              </p>
            </div>
          </div>
        </div>

        {/* Grupos de servicios */}
        <div className="relative space-y-9 sm:space-y-10 lg:space-y-12">
          {grupos.map(
            (
              grupo,
              grupoIndex,
            ) => (
              <div
                key={`grupo-servicios-${grupoIndex}`}
                className="space-y-5 sm:space-y-6"
              >
                {/* Separador entre grupos */}
                {grupoIndex > 0 && (
                  <div
                    className="flex items-center gap-4 pb-1"
                    aria-hidden="true"
                  >
                    <div className="h-px flex-1 bg-gray-200" />

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                      <HeartPulse
                        size={15}
                        className="text-[#D69F00]"
                        strokeWidth={1.9}
                      />
                    </div>

                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                )}

                {/* Tarjetas verticales */}
                {grupo.verticales.length > 0 && (
                  <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                    {grupo.verticales.map(
                      (servicio) => (
                        <ServicioCardVertical
                          key={`vertical-${servicio.id}`}
                          id={servicio.id}
                          titulo={servicio.titulo}
                          descripcion={
                            servicio.descripcion
                          }
                          imagenSrc={
                            servicio.imagenSrc ||
                            undefined
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                {/* Tarjetas horizontales */}
                {grupo.horizontales.length >
                  0 && (
                  <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-2">
                    {grupo.horizontales.map(
                      (servicio) => (
                        <ServicioCardHorizontal
                          key={`horizontal-${servicio.id}`}
                          id={servicio.id}
                          titulo={servicio.titulo}
                          descripcion={
                            servicio.descripcion
                          }
                          imagenSrc={
                            servicio.imagenSrc ||
                            undefined
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}