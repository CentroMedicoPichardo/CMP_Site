"use client";

import {
  useId,
  useState,
} from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  LockKeyhole,
  Tag,
  ThumbsDown,
  ThumbsUp,
  UsersRound,
} from "lucide-react";

interface FAQCardProps {
  pregunta: string;
  respuesta: string;
  categoria?: string;
  vecesUtil: number;
  esDestacada?: boolean;
  estaAutenticado: boolean;
  onUtilClick?: (esUtil: boolean) => void;
}

type Valoracion =
  | "util"
  | "no-util"
  | null;

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

export default function FAQCard({
  pregunta,
  respuesta,
  categoria,
  vecesUtil,
  esDestacada = false,
  estaAutenticado,
  onUtilClick,
}: FAQCardProps) {
  const contenidoId = useId();

  const [isOpen, setIsOpen] =
    useState(false);

  const [valoracion, setValoracion] =
    useState<Valoracion>(null);

  const preguntaMostrada =
    pregunta?.trim() ||
    "Pregunta frecuente";

  const respuestaMostrada =
    respuesta?.trim() ||
    "La respuesta a esta pregunta todavía no está disponible.";

  const categoriaMostrada =
    categoria?.trim();

  const totalUtil = Math.max(
    Number(vecesUtil) || 0,
    0,
  );

  const totalUtilMostrado =
    totalUtil +
    (valoracion === "util" ? 1 : 0);

  const handleValoracion = (
    esUtil: boolean,
  ) => {
    if (
      !estaAutenticado ||
      valoracion !== null ||
      !onUtilClick
    ) {
      return;
    }

    const nuevaValoracion: Valoracion =
      esUtil ? "util" : "no-util";

    setValoracion(nuevaValoracion);

    onUtilClick(esUtil);
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white transition-all duration-300",
        isOpen
          ? "border-[#0A3D62]/20 shadow-[0_12px_32px_rgba(10,61,98,0.10)]"
          : "border-gray-200 shadow-[0_5px_18px_rgba(10,61,98,0.05)] hover:border-[#0A3D62]/15 hover:shadow-[0_10px_26px_rgba(10,61,98,0.08)]",
        esDestacada &&
          "border-[#FFC300]/50",
      )}
    >
      {/* Encabezado */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((actual) => !actual)
        }
        aria-expanded={isOpen}
        aria-controls={contenidoId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFC300] sm:px-5 sm:py-4"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
            isOpen
              ? "bg-[#0A3D62] text-[#FFC300]"
              : "bg-[#EAF2F8] text-[#0A3D62] group-hover:bg-[#0A3D62] group-hover:text-[#FFC300]",
          )}
        >
          <CircleHelp
            size={18}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            {esDestacada && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#FFC300]/40 bg-[#FFF8D9] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#8A6500]">
                <BadgeCheck
                  size={11}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                Destacada
              </span>
            )}

            {categoriaMostrada && (
              <span className="hidden items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 sm:inline-flex">
                <Tag
                  size={11}
                  aria-hidden="true"
                />

                {categoriaMostrada}
              </span>
            )}
          </span>

          <span
            className={cn(
              "mt-1 block text-sm font-extrabold leading-5 transition-colors sm:text-base sm:leading-6",
              isOpen
                ? "text-[#0A3D62]"
                : "text-gray-800 group-hover:text-[#0A3D62]",
            )}
          >
            {preguntaMostrada}
          </span>
        </span>

        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
            isOpen
              ? "rotate-180 border-[#0A3D62] bg-[#0A3D62] text-white"
              : "border-gray-200 bg-white text-gray-400 group-hover:border-[#0A3D62]/20 group-hover:bg-[#F7FAFC] group-hover:text-[#0A3D62]",
          )}
        >
          <ChevronDown
            size={17}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Contenido */}
      <div
        id={contenidoId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
            {/* Respuesta */}
            <div className="relative rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-3.5">
              <span
                className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-[#FFC300]"
                aria-hidden="true"
              />

              <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                {respuestaMostrada}
              </p>
            </div>

            {/* Categoría móvil */}
            {categoriaMostrada && (
              <div className="mt-3 flex sm:hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0A3D62]/10 bg-[#EAF2F8] px-2.5 py-1 text-[9px] font-bold text-[#0A3D62]">
                  <Tag
                    size={11}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />

                  {categoriaMostrada}
                </span>
              </div>
            )}

            {/* Utilidad y valoración */}
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
                  <UsersRound
                    size={14}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <span>
                  {totalUtilMostrado === 1
                    ? "1 persona encontró útil esta respuesta"
                    : `${totalUtilMostrado} personas encontraron útil esta respuesta`}
                </span>
              </div>

              {/* Usuario autenticado */}
              {estaAutenticado &&
                onUtilClick && (
                  <div className="flex flex-col gap-2 sm:items-end">
                    {valoracion === null ? (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                          ¿Te resultó útil?
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleValoracion(
                                true,
                              )
                            }
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:border-emerald-600 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            aria-label="Marcar esta respuesta como útil"
                          >
                            <ThumbsUp
                              size={15}
                              strokeWidth={1.9}
                              aria-hidden="true"
                            />

                            Sí, fue útil
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleValoracion(
                                false,
                              )
                            }
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            aria-label="Marcar esta respuesta como no útil"
                          >
                            <ThumbsDown
                              size={15}
                              strokeWidth={1.9}
                              aria-hidden="true"
                            />

                            No
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2",
                          valoracion === "util"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-[#0A3D62]/10 bg-[#F7FAFC] text-[#0A3D62]",
                        )}
                        role="status"
                        aria-live="polite"
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />

                        <p className="text-xs font-bold">
                          Gracias por compartir tu opinión
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {/* Usuario sin sesión */}
              {!estaAutenticado &&
                onUtilClick && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
                      <LockKeyhole
                        size={15}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-500">
                        Inicia sesión para valorar
                      </p>

                      <Link
                        href="/acceder"
                        className="mt-0.5 inline-flex text-xs font-extrabold text-[#0A3D62] transition-colors hover:text-[#B88600] hover:underline"
                      >
                        Acceder a mi cuenta
                      </Link>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}