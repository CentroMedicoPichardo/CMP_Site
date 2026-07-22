import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  GraduationCap,
  HeartPulse,
  Sparkles,
} from "lucide-react";

import { publicRoutes } from "@/config/routes";

interface SaberPediatricoCTAProps {
  variant: "academia" | "blog";
}

export function SaberPediatricoCTA({
  variant,
}: SaberPediatricoCTAProps) {
  const esAcademia = variant === "academia";

  const href = esAcademia
    ? `${publicRoutes.saberPediatrico}/academia`
    : `${publicRoutes.saberPediatrico}/blog`;

  const titulo = esAcademia
    ? "Academia Infantil"
    : "Blog de Salud";

  const descripcion = esAcademia
    ? "Cursos y talleres diseñados para acompañar el aprendizaje y desarrollo de niñas y niños."
    : "Artículos, recomendaciones y contenido confiable sobre salud y cuidado infantil.";

  const textoAccion = esAcademia
    ? "Explorar academia"
    : "Leer artículos";

  return (
    <Link
      href={href}
      aria-label={`${textoAccion}: ${titulo}`}
      className="group block h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-4"
    >
      <article
        className={
          esAcademia
            ? "relative isolate flex h-full min-h-[210px] overflow-hidden rounded-3xl border border-white/10 bg-[#0A3D62] text-white shadow-[0_10px_30px_rgba(10,61,98,0.14)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(10,61,98,0.20)]"
            : "relative isolate flex h-full min-h-[210px] overflow-hidden rounded-3xl border border-gray-200 bg-white text-[#0A3D62] shadow-[0_10px_30px_rgba(10,61,98,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#FFC300]/60 group-hover:shadow-[0_18px_40px_rgba(10,61,98,0.14)]"
        }
      >
        {/* Fondo */}
        {esAcademia ? (
          <>
            <div
              className="absolute inset-0 -z-30 bg-gradient-to-br from-[#061C2E] via-[#0A3D62] to-[#1A4F7A]"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -right-14 -top-14 -z-20 h-40 w-40 rounded-full bg-[#FFC300]/20 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-16 -left-12 -z-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 -z-30 bg-gradient-to-br from-white via-white to-[#EAF2F8]"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -right-16 -top-16 -z-20 h-44 w-44 rounded-full bg-[#FFC300]/15 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-16 -left-14 -z-20 h-40 w-40 rounded-full bg-[#0A3D62]/10 blur-3xl"
              aria-hidden="true"
            />
          </>
        )}

        <div className="flex w-full flex-col p-4 sm:p-5 md:flex-row md:items-center md:gap-5">
          {/* Icono */}
          <div
            className={
              esAcademia
                ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-sm sm:h-14 sm:w-14"
                : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm sm:h-14 sm:w-14"
            }
          >
            {esAcademia ? (
              <GraduationCap
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <BookOpenText
                size={26}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Contenido */}
          <div className="mt-4 min-w-0 flex-1 md:mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  esAcademia
                    ? "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-white/85 backdrop-blur-sm"
                    : "inline-flex items-center gap-1.5 rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#0A3D62]"
                }
              >
                {esAcademia ? (
                  <Sparkles
                    size={11}
                    className="text-[#FFC300]"
                    aria-hidden="true"
                  />
                ) : (
                  <HeartPulse
                    size={11}
                    className="text-[#B88600]"
                    aria-hidden="true"
                  />
                )}

                Saber Pediátrico
              </span>
            </div>

            <h3
              className={
                esAcademia
                  ? "mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl"
                  : "mt-2 text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl"
              }
            >
              {titulo}
            </h3>

            <p
              className={
                esAcademia
                  ? "mt-1.5 line-clamp-3 text-sm leading-6 text-white/70"
                  : "mt-1.5 line-clamp-3 text-sm leading-6 text-gray-600"
              }
            >
              {descripcion}
            </p>

            {/* Acción */}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-current/10 pt-3">
              <span
                className={
                  esAcademia
                    ? "text-xs font-extrabold text-[#FFC300] sm:text-sm"
                    : "text-xs font-extrabold text-[#0A3D62] sm:text-sm"
                }
              >
                {textoAccion}
              </span>

              <span
                className={
                  esAcademia
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FFC300] transition-all duration-200 group-hover:bg-[#FFC300] group-hover:text-[#0A3D62]"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62] transition-all duration-200 group-hover:bg-[#0A3D62] group-hover:text-white"
                }
              >
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            esAcademia
              ? "absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
              : "absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#0A3D62] to-transparent"
          }
          aria-hidden="true"
        />
      </article>
    </Link>
  );
}