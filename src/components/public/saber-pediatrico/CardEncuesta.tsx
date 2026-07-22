"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  FileQuestion,
  Users,
} from "lucide-react";

interface CardEncuestaProps {
  id: number;
  titulo: string;
  descripcion: string;
  urlExterno: string;
  fechaFin?: string;
}

function formatearFecha(fechaFin: string): string {
  const fecha = new Date(fechaFin);

  if (Number.isNaN(fecha.getTime())) {
    return fechaFin;
  }

  return fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function CardEncuesta({
  titulo,
  descripcion,
  urlExterno,
  fechaFin,
}: CardEncuestaProps) {
  const fechaFormateada = fechaFin
    ? formatearFecha(fechaFin)
    : null;

  return (
    <Link
      href={urlExterno}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Participar en la encuesta: ${titulo}`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
    >
      <article className="relative flex h-full min-h-[245px] flex-col overflow-hidden rounded-2xl border border-[#FFC300]/35 bg-gradient-to-br from-[#FFF9E6] via-white to-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#FFC300] group-hover:shadow-xl">
        {/* Barra superior */}
        <div className="h-1.5 w-full shrink-0 bg-[#FFC300]" />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Icono y estado */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
              <FileQuestion
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <span className="inline-flex items-center rounded-full border border-[#FFC300]/40 bg-[#FFF9E6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8A6500]">
              Disponible
            </span>
          </div>

          {/* Información */}
          <div className="mt-4 flex flex-1 flex-col">
            <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-[#0A3D62] transition-colors duration-200 group-hover:text-[#B88600] sm:text-xl">
              {titulo}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 sm:text-base">
              {descripcion}
            </p>

            {/* Fecha límite */}
            {fechaFormateada && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#FFC300]/20 bg-[#FFF9E6]/70 px-3 py-2.5 text-xs text-gray-600 sm:text-sm">
                <Calendar
                  size={15}
                  className="shrink-0 text-[#D69F00]"
                  aria-hidden="true"
                />

                <span>
                  Finaliza:{" "}
                  <strong className="font-semibold text-[#0A3D62]">
                    {fechaFormateada}
                  </strong>
                </span>
              </div>
            )}

            {/* Parte inferior */}
            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="inline-flex min-w-0 items-center gap-2 text-xs text-gray-500 sm:text-sm">
                <Users
                  size={16}
                  className="shrink-0 text-[#D69F00]"
                  aria-hidden="true"
                />

                <span className="truncate">
                  Tu opinión importa
                </span>
              </span>

              <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFC300] px-4 py-2.5 text-sm font-bold text-[#0A3D62] shadow-sm transition-all duration-200 group-hover:bg-[#0A3D62] group-hover:text-white">
                Participar

                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Línea animada inferior */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#FFC300] transition-transform duration-300 group-hover:scale-x-100" />
      </article>
    </Link>
  );
}