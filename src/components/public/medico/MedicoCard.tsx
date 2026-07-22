"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  MapPinned,
  Stethoscope,
} from "lucide-react";

interface MedicoCardProps {
  imagenSrc: string;
  nombre: string;
  especialidad: string;
  hospital: string;
  direccion: string;
}

export function MedicoCard({
  imagenSrc,
  nombre,
  especialidad,
  hospital,
  direccion,
}: MedicoCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(10,61,98,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0A3D62]/20 hover:shadow-[0_18px_40px_rgba(10,61,98,0.14)]">
      {/* Fotografía */}
      <div className="relative h-64 shrink-0 overflow-hidden bg-[#DDE8EF] sm:h-72">
        {/* Fondo desenfocado para rellenar el espacio */}
        <Image
          src={imagenSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="scale-110 object-cover object-center opacity-45 blur-xl"
          aria-hidden="true"
        />

        {/* Capa de contraste */}
        <div
          className="absolute inset-0 bg-[#0A3D62]/15"
          aria-hidden="true"
        />

        {/* Imagen principal completa */}
        <div className="absolute inset-2 overflow-hidden rounded-2xl sm:inset-3">
          <Image
            src={imagenSrc}
            alt={`Fotografía de ${nombre}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* Degradado inferior ligero */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#061C2E]/55 to-transparent"
          aria-hidden="true"
        />

        {/* Especialidad */}
        <div className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] sm:left-4 sm:top-4">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/70 bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62] shadow-md sm:text-xs">
            <Stethoscope
              size={13}
              strokeWidth={2}
              className="shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {especialidad}
            </span>
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Nombre */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <BadgeCheck
              size={16}
              className="shrink-0 text-[#D69F00]"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Especialista
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
            {nombre}
          </h3>
        </div>

        <div className="space-y-3">
          {/* Hospital */}
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <Building2
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Unidad médica
              </span>

              <p
                className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-[#0A3D62]"
                title={hospital}
              >
                {hospital}
              </p>
            </div>
          </div>

          {/* Dirección */}
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF6D6] text-[#B88600]">
              <MapPinned
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Ubicación
              </span>

              <p
                className="mt-1 line-clamp-3 text-sm font-medium leading-5 text-gray-600"
                title={direccion}
              >
                {direccion}
              </p>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <p className="text-xs font-semibold text-gray-500">
            Atención profesional y cercana
          </p>
        </div>
      </div>
    </article>
  );
}