"use client";

import Link from "next/link";
import {
  Calendar,
  Eye,
  FileText,
  ExternalLink,
} from "lucide-react";

interface CardDocumentoProps {
  id: number;
  titulo: string;
  descripcion: string;
  archivoUrl: string;
  fechaPublicacion: string;
}

function formatearFecha(fechaPublicacion: string): string {
  const fecha = new Date(fechaPublicacion);

  if (Number.isNaN(fecha.getTime())) {
    return fechaPublicacion;
  }

  return fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function CardDocumento({
  titulo,
  descripcion,
  archivoUrl,
  fechaPublicacion,
}: CardDocumentoProps) {
  const fecha = formatearFecha(fechaPublicacion);

  return (
    <Link
      href={archivoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir documento: ${titulo}`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      <article className="relative flex h-full min-h-[145px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-300 group-hover:shadow-lg">
        {/* Línea lateral */}
        <div className="w-1.5 shrink-0 bg-emerald-600 transition-all duration-300 group-hover:w-2" />

        <div className="flex min-w-0 flex-1 items-center gap-4 p-4 sm:p-5">
          {/* Icono */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <FileText
              size={25}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          {/* Información */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-gray-400 sm:text-xs">
              <Calendar
                size={13}
                className="shrink-0 text-emerald-600"
                aria-hidden="true"
              />

              <span className="truncate">{fecha}</span>
            </div>

            <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-[#0A3D62] transition-colors duration-200 group-hover:text-emerald-700 sm:text-lg">
              {titulo}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
              {descripcion}
            </p>

            {/* Indicador visual */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-colors group-hover:text-emerald-700 sm:text-sm">
                <Eye
                  size={15}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                Abrir documento
              </span>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white">
                <ExternalLink
                  size={15}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Brillo al pasar el cursor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-x-100" />
      </article>
    </Link>
  );
}