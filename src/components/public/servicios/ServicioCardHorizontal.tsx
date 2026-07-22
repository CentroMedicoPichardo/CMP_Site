"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  HeartPulse,
  Hospital,
  ShieldCheck,
} from "lucide-react";

interface ServicioCardHorizontalProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenSrc?: string;
  linkVerMas?: string;
}

export function ServicioCardHorizontal({
  id,
  titulo,
  descripcion,
  imagenSrc,
}: ServicioCardHorizontalProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imagenSrc]);

  const tituloMostrado =
    titulo?.trim() || "Servicio médico";

  const descripcionMostrada =
    descripcion?.trim() ||
    "Atención especializada con profesionales comprometidos con tu salud y bienestar.";

  const mostrarImagen =
    Boolean(imagenSrc?.trim()) && !imageError;

  return (
    <article
      aria-labelledby={`servicio-horizontal-${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_28px_rgba(10,61,98,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0A3D62]/20 hover:shadow-[0_18px_40px_rgba(10,61,98,0.14)] sm:flex-row"
    >
      {/* Imagen */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] sm:h-auto sm:min-h-[220px] sm:w-52 lg:w-56">
        {mostrarImagen ? (
          <Image
            src={imagenSrc!}
            alt={`Servicio de ${tituloMostrado}`}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-sm">
              <Hospital
                size={40}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Contraste */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#061C2E]/75 via-[#0A3D62]/10 to-transparent sm:bg-gradient-to-r"
          aria-hidden="true"
        />

        {/* Etiqueta */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0A3D62] shadow-md">
            <HeartPulse
              size={13}
              strokeWidth={2}
              aria-hidden="true"
            />

            Servicio médico
          </span>
        </div>

        {/* Título móvil */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:hidden">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFC300]">
            Atención especializada
          </p>

          <h3
            id={`servicio-horizontal-${id}`}
            className="mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-white"
          >
            {tituloMostrado}
          </h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
        {/* Encabezado en escritorio */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <HeartPulse
              size={16}
              className="shrink-0 text-[#D69F00]"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B88600]">
              Atención especializada
            </span>
          </div>

          <h3
            id={`servicio-horizontal-${id}`}
            className="mt-2 line-clamp-2 text-xl font-extrabold leading-tight text-[#0A3D62] lg:text-2xl"
          >
            {tituloMostrado}
          </h3>
        </div>

        {/* Descripción */}
        <p className="line-clamp-4 text-sm leading-6 text-gray-600 sm:mt-3 lg:text-[15px] lg:leading-7">
          {descripcionMostrada}
        </p>

        {/* Información inferior */}
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#0A3D62]/10 bg-[#F6F9FB] px-3.5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <ShieldCheck
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0A3D62]">
                Atención profesional
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                Servicio personalizado y enfocado en tu bienestar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}