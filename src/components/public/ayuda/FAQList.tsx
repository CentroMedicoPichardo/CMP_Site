"use client";

import {
  CircleHelp,
  SearchX,
} from "lucide-react";

import type { PreguntaFrecuente } from "@/types/help";
import FAQCard from "./FAQCard";

interface FAQListProps {
  faqs: PreguntaFrecuente[];
  loading: boolean;
  estaAutenticado: boolean;
  onValorar: (
    idPregunta: number,
    esUtil: boolean,
  ) => void;
}

export default function FAQList({
  faqs,
  loading,
  estaAutenticado,
  onValorar,
}: FAQListProps) {
  const listaPreguntas = Array.isArray(faqs)
    ? faqs
    : [];

  if (loading) {
    return (
      <div
        className="space-y-3"
        role="status"
        aria-live="polite"
        aria-label="Cargando preguntas frecuentes"
      >
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_5px_18px_rgba(10,61,98,0.05)]"
            >
              <div className="flex animate-pulse items-center gap-3 px-4 py-4 sm:px-5">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-200" />

                <div className="min-w-0 flex-1">
                  <div
                    className={
                      index % 2 === 0
                        ? "h-3.5 w-4/5 rounded-full bg-gray-200"
                        : "h-3.5 w-3/5 rounded-full bg-gray-200"
                    }
                  />

                  <div className="mt-2 h-2.5 w-24 rounded-full bg-gray-100" />
                </div>

                <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-100" />
              </div>
            </div>
          ),
        )}

        <span className="sr-only">
          Cargando preguntas frecuentes...
        </span>
      </div>
    );
  }

  if (listaPreguntas.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center shadow-[0_8px_26px_rgba(10,61,98,0.05)] sm:px-8 sm:py-12">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FFC300]/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <SearchX
              size={26}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-[#0A3D62] sm:text-xl">
            No se encontraron preguntas
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No hay resultados que coincidan con la búsqueda
            o categoría seleccionada.
          </p>

          <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-2">
            <CircleHelp
              size={14}
              className="shrink-0 text-[#0A3D62]"
              aria-hidden="true"
            />

            <p className="text-[11px] font-medium text-gray-500">
              Prueba con otras palabras o selecciona otra
              categoría.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-w-0"
      aria-label="Lista de preguntas frecuentes"
    >
      <div className="space-y-3">
        {listaPreguntas.map((faq) => {
          const idPregunta = Number(
            faq.idPregunta,
          );

          const idValido =
            Number.isInteger(idPregunta) &&
            idPregunta > 0;

          return (
            <FAQCard
              key={faq.idPregunta}
              pregunta={
                faq.pregunta?.trim() ||
                "Pregunta frecuente"
              }
              respuesta={
                faq.respuesta?.trim() ||
                "La respuesta todavía no está disponible."
              }
              categoria={
                faq.categoria?.nombreCategoria
                  ?.trim() || undefined
              }
              vecesUtil={Math.max(
                Number(faq.vecesUtil) || 0,
                0,
              )}
              esDestacada={Boolean(
                faq.esDestacada,
              )}
              estaAutenticado={
                estaAutenticado
              }
              onUtilClick={
                idValido
                  ? (esUtil) =>
                      onValorar(
                        idPregunta,
                        esUtil,
                      )
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-3.5 py-3 shadow-sm">
        <CircleHelp
          size={16}
          className="mt-0.5 shrink-0 text-[#0A3D62]"
          strokeWidth={1.9}
          aria-hidden="true"
        />

        <p className="text-[11px] leading-5 text-gray-500">
          Selecciona una pregunta para consultar su respuesta.
          Las valoraciones están disponibles únicamente para
          usuarios con una sesión activa.
        </p>
      </div>
    </section>
  );
}