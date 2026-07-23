"use client";

import {
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type { CursoRecienteDashboardCliente } from "@/types/cliente-dashboard";

interface CursosRecientesCarouselProps {
  cursos: CursoRecienteDashboardCliente[];
}

const formateadorFecha = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function fecha(valor: string): string {
  const parsed = new Date(`${valor}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? valor : formateadorFecha.format(parsed);
}

export default function CursosRecientesCarousel({
  cursos,
}: CursosRecientesCarouselProps) {
  const contenedorRef = useRef<HTMLDivElement | null>(null);

  const mover = (direccion: "anterior" | "siguiente") => {
    const contenedor = contenedorRef.current;

    if (!contenedor) {
      return;
    }

    const distancia = Math.max(contenedor.clientWidth * 0.82, 280);

    contenedor.scrollBy({
      left: direccion === "siguiente" ? distancia : -distancia,
      behavior: "smooth",
    });
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(10,61,98,0.06)] sm:p-5">
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62]">
            <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#B88600]">
              Descubre algo nuevo
            </p>
            <h2 className="mt-0.5 text-sm font-extrabold text-[#0A3D62] sm:text-base">
              Cursos recientes
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-500">
              Nuevos cursos activos que todavía no forman parte de tu cuenta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => mover("anterior")}
            aria-label="Mostrar cursos anteriores"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => mover("siguiente")}
            aria-label="Mostrar más cursos"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A3D62] text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <Link href="/cursos" className="ml-1 text-[10px] font-extrabold text-[#0A3D62] hover:underline">
            Ver catálogo
          </Link>
        </div>
      </header>

      {cursos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-[#F7FAFC] px-4 py-8 text-center">
          <GraduationCap size={30} className="mx-auto text-[#0A3D62]" aria-hidden="true" />
          <p className="mt-2 text-sm font-extrabold text-[#0A3D62]">
            No hay cursos nuevos disponibles
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Vuelve pronto para consultar nuevas ediciones.
          </p>
        </div>
      ) : (
        <div
          ref={contenedorRef}
          className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cursos.map((curso) => (
            <article
              key={curso.idCurso}
              className="group w-[84%] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(10,61,98,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#0A3D62]/20 hover:shadow-[0_14px_30px_rgba(10,61,98,0.09)] sm:w-[47%] lg:w-[31.5%]"
            >
              <div className="relative h-44 overflow-hidden bg-[#EAF2F8]">
                {curso.urlImagenPortada ? (
                  <Image
                    src={curso.urlImagenPortada}
                    alt={curso.tituloCurso}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 47vw, 32vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#0A3D62]">
                    <GraduationCap size={38} aria-hidden="true" />
                  </div>
                )}

                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[9px] font-extrabold text-[#0A3D62] shadow-sm backdrop-blur-sm">
                  <Sparkles size={11} aria-hidden="true" />
                  Nuevo
                </span>

                {curso.cuposDisponibles <= 5 && curso.cuposDisponibles > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-extrabold text-white shadow-sm">
                    Últimos {curso.cuposDisponibles} lugares
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {curso.categoriaNombre && (
                    <span className="rounded-full bg-[#EAF2F8] px-2 py-1 text-[8px] font-bold text-[#0A3D62]">
                      {curso.categoriaNombre}
                    </span>
                  )}
                  {curso.modalidadNombre && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[8px] font-bold text-gray-600">
                      {curso.modalidadNombre}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-gray-800 group-hover:text-[#0A3D62]">
                  {curso.tituloCurso}
                </h3>

                <p className="mt-2 line-clamp-2 min-h-10 text-[11px] leading-5 text-gray-500">
                  {curso.descripcion || "Conoce todos los detalles de esta nueva edición."}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-[#0A3D62]" aria-hidden="true" />
                    {fecha(curso.fechaInicio)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UsersRound size={12} className="text-[#0A3D62]" aria-hidden="true" />
                    {curso.cuposDisponibles} disponibles
                  </span>
                  {curso.horario && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={12} className="text-[#0A3D62]" aria-hidden="true" />
                      {curso.horario}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#0A3D62]" aria-hidden="true" />
                    {curso.modalidadNombre || "Por confirmar"}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">Inversión</p>
                    <p className="mt-0.5 text-lg font-black text-[#0A3D62]">
                      {Number(curso.costo) > 0 ? moneda.format(Number(curso.costo)) : "Gratuito"}
                    </p>
                  </div>

                  <Link
                    href={`/cursos/${curso.idCurso}`}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#0A3D62] px-4 text-[10px] font-extrabold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                  >
                    Ver curso
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
