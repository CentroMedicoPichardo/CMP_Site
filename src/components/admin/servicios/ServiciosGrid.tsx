"use client";

import { useState } from "react";

import Image from "next/image";

import {
  Edit3,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";

import type { Servicio } from "@/types/servicios";

interface ServiciosGridProps {
  servicios: Servicio[];
  loading: boolean;
  onEdit: (servicio: Servicio) => void;
  onToggleActivo: (
    servicio: Servicio,
  ) => void;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: string | null | undefined,
  respaldo: string,
): string {
  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    return valor.trim();
  }

  return respaldo;
}

export function ServiciosGrid({
  servicios,
  loading,
  onEdit,
  onToggleActivo,
}: ServiciosGridProps) {
  const [imageErrors, setImageErrors] =
    useState<Record<number, boolean>>({});

  const handleImageError = (
    idServicio: number,
  ) => {
    setImageErrors((erroresActuales) => ({
      ...erroresActuales,
      [idServicio]: true,
    }));
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando servicios
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando los servicios registrados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (servicios.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Sparkles
              size={29}
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            No se encontraron servicios
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            No hay servicios que coincidan con los filtros seleccionados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {servicios.map((servicio) => {
          const titulo = textoSeguro(
            servicio.tituloServicio,
            "Servicio sin título",
          );

          const descripcion = textoSeguro(
            servicio.descripcion,
            "No se ha agregado una descripción para este servicio.",
          );

          const ubicacion = textoSeguro(
            servicio.ubicacion,
            "Ubicación no especificada",
          );

          const imagenSrc =
            servicio.imagenSrc ?? "";

          const mostrarImagen =
            Boolean(imagenSrc) &&
            !imageErrors[
              servicio.idServicio
            ];

          return (
            <article
              key={servicio.idServicio}
              className={cn(
                "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md",
                servicio.activo
                  ? "border-gray-200"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 z-20 h-1",
                  servicio.activo
                    ? "bg-emerald-500"
                    : "bg-gray-400",
                )}
                aria-hidden="true"
              />

              <div className="relative h-52 overflow-hidden bg-[#EAF2F8]">
                {mostrarImagen ? (
                  <Image
                    src={imagenSrc}
                    alt={
                      servicio.textoAlt ||
                      titulo
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      !servicio.activo &&
                        "grayscale",
                    )}
                    onError={() => {
                      handleImageError(
                        servicio.idServicio,
                      );
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#061C2E]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                      <ImageIcon
                        size={38}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#061C2E]/85 to-transparent" />

                <span
                  className={cn(
                    "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold shadow-sm backdrop-blur-sm",
                    servicio.activo
                      ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                      : "border-gray-200 bg-gray-100/95 text-gray-600",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      servicio.activo
                        ? "bg-emerald-500"
                        : "bg-gray-400",
                    )}
                    aria-hidden="true"
                  />

                  {servicio.activo
                    ? "Activo"
                    : "Inactivo"}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62] shadow-sm">
                    <Sparkles
                      size={12}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    Servicio médico
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                    <Sparkles
                      size={18}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                      Servicio
                    </p>

                    <h2 className="mt-1 whitespace-normal break-words text-base font-extrabold leading-6 text-[#0A3D62]">
                      {titulo}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 flex-1 space-y-3">
                  <div className="rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Descripción
                    </p>

                    <p className="mt-1 whitespace-normal break-words text-xs font-medium leading-5 text-gray-600">
                      {descripcion}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0A3D62]"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Ubicación
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-xs font-semibold leading-5 text-gray-700">
                        {ubicacion}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(servicio);
                    }}
                    className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
                    aria-label={`Editar ${titulo}`}
                  >
                    <Edit3
                      size={16}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleActivo(
                        servicio,
                      );
                    }}
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                      servicio.activo
                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                    )}
                    aria-label={
                      servicio.activo
                        ? `Desactivar ${titulo}`
                        : `Activar ${titulo}`
                    }
                    title={
                      servicio.activo
                        ? "Desactivar servicio"
                        : "Activar servicio"
                    }
                  >
                    {servicio.activo ? (
                      <EyeOff
                        size={17}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={17}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-gray-500">
          Mostrando{" "}
          <span className="font-extrabold text-[#0A3D62]">
            {servicios.length}
          </span>{" "}
          {servicios.length === 1
            ? "servicio"
            : "servicios"}
        </p>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden="true"
          />

          Información actualizada
        </div>
      </div>
    </section>
  );
}