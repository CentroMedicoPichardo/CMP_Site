"use client";

import { useState } from "react";

import Image from "next/image";

import {
  Building2,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { Medico } from "@/types/medicos";

interface MedicosGridProps {
  medicos: Medico[];
  loading: boolean;
  onEdit: (medico: Medico) => void;
  onToggleActivo: (medico: Medico) => void;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function obtenerNombreCompleto(
  medico: Medico,
): string {
  const nombre = [
    medico.nombres,
    medico.apellidoPaterno,
    medico.apellidoMaterno,
  ]
    .filter(
      (valor): valor is string =>
        typeof valor === "string" &&
        valor.trim().length > 0,
    )
    .map((valor) => valor.trim())
    .join(" ");

  return nombre || "Médico sin nombre";
}

function obtenerIniciales(
  medico: Medico,
): string {
  const partes = [
    medico.nombres,
    medico.apellidoPaterno,
  ].filter(
    (valor): valor is string =>
      typeof valor === "string" &&
      valor.trim().length > 0,
  );

  const iniciales = partes
    .slice(0, 2)
    .map((parte) =>
      parte.trim().charAt(0).toUpperCase(),
    )
    .join("");

  return iniciales || "M";
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

export function MedicosGrid({
  medicos,
  loading,
  onEdit,
  onToggleActivo,
}: MedicosGridProps) {
  const [imageErrors, setImageErrors] =
    useState<Record<number, boolean>>({});

  const handleImageError = (
    idMedico: number,
  ) => {
    setImageErrors((erroresActuales) => ({
      ...erroresActuales,
      [idMedico]: true,
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
              Cargando médicos
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando la información del
              personal médico.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (medicos.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <UsersRound
              size={29}
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            No se encontraron médicos
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            No hay médicos que coincidan con los
            filtros seleccionados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {medicos.map((medico) => {
          const nombreCompleto =
            obtenerNombreCompleto(medico);

          const iniciales =
            obtenerIniciales(medico);

          const especialidad =
            textoSeguro(
              medico.especialidad,
              "Medicina general",
            );

          const hospital =
            textoSeguro(
              medico.hospitalClinica,
              "Hospital o clínica no especificado",
            );

          const direccion =
            textoSeguro(
              medico.direccion,
              "Dirección no especificada",
            );

          const mostrarImagen =
            Boolean(medico.imagenSrc) &&
            !imageErrors[medico.idMedico];

          return (
            <article
              key={medico.idMedico}
              className={cn(
                "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md",
                medico.activo
                  ? "border-gray-200"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 z-20 h-1",
                  medico.activo
                    ? "bg-emerald-500"
                    : "bg-gray-400",
                )}
                aria-hidden="true"
              />

              <div className="relative h-52 overflow-hidden bg-[#EAF2F8]">
                {mostrarImagen && medico.imagenSrc ? (
                  <Image
                    src={medico.imagenSrc}
                    alt={`Fotografía de ${nombreCompleto}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      !medico.activo &&
                        "grayscale",
                    )}
                    onError={() => {
                      handleImageError(
                        medico.idMedico,
                      );
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#061C2E]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl font-extrabold text-white">
                      {iniciales}
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#061C2E]/80 to-transparent" />

                <span
                  className={cn(
                    "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold shadow-sm backdrop-blur-sm",
                    medico.activo
                      ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                      : "border-gray-200 bg-gray-100/95 text-gray-600",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      medico.activo
                        ? "bg-emerald-500"
                        : "bg-gray-400",
                    )}
                    aria-hidden="true"
                  />

                  {medico.activo
                    ? "Activo"
                    : "Inactivo"}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold text-[#0A3D62] shadow-sm">
                    <Stethoscope
                      size={12}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span className="min-w-0 whitespace-normal break-words">
                      {especialidad}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                    <UserRound
                      size={18}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                      Médico
                    </p>

                    <h2 className="mt-1 whitespace-normal break-words text-base font-extrabold leading-6 text-[#0A3D62]">
                      {nombreCompleto}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                    <Building2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0A3D62]"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Hospital o clínica
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-xs font-semibold leading-5 text-gray-700">
                        {hospital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0A3D62]"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Dirección
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-xs font-semibold leading-5 text-gray-700">
                        {direccion}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex gap-2 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(medico);
                    }}
                    className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
                    aria-label={`Editar a ${nombreCompleto}`}
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
                      onToggleActivo(medico);
                    }}
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                      medico.activo
                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                    )}
                    aria-label={
                      medico.activo
                        ? `Desactivar a ${nombreCompleto}`
                        : `Activar a ${nombreCompleto}`
                    }
                    title={
                      medico.activo
                        ? "Desactivar médico"
                        : "Activar médico"
                    }
                  >
                    {medico.activo ? (
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

      <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-500">
          Mostrando{" "}
          <span className="font-extrabold text-[#0A3D62]">
            {medicos.length}
          </span>{" "}
          {medicos.length === 1
            ? "médico"
            : "médicos"}
        </p>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          Información actualizada
        </div>
      </div>
    </section>
  );
}