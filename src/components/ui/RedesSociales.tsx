"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Facebook,
  HeartHandshake,
  Instagram,
  Sparkles,
} from "lucide-react";

interface EmpresaInfo {
  id: number;
  facebook: string | null;
  instagram: string | null;
}

interface RedesSocialesProps {
  variant?: "horizontal" | "compact" | "full";
  showText?: boolean;
  className?: string;
}

interface RedSocial {
  nombre: string;
  url: string;
  icono: ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  descripcion: string;
  etiqueta: string;
  tarjeta: string;
  iconoContenedor: string;
  boton: string;
  resplandor: string;
  etiquetaColor: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function normalizarUrlRedSocial(
  valor: string,
  tipo: "facebook" | "instagram",
): string {
  const valorLimpio = valor.trim();

  if (/^https?:\/\//i.test(valorLimpio)) {
    return valorLimpio;
  }

  if (
    /^(www\.)?(facebook|instagram)\.com\//i.test(
      valorLimpio,
    )
  ) {
    return `https://${valorLimpio}`;
  }

  const usuario = valorLimpio
    .replace(/^@/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return tipo === "facebook"
    ? `https://www.facebook.com/${usuario}`
    : `https://www.instagram.com/${usuario}`;
}

export function RedesSociales({
  variant = "full",
  showText = true,
  className = "",
}: RedesSocialesProps) {
  const [empresaInfo, setEmpresaInfo] =
    useState<EmpresaInfo | null>(null);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarEmpresaInfo() {
      try {
        const respuesta = await fetch("/api/empresa-info", {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          return;
        }

        const datos: EmpresaInfo = await respuesta.json();
        setEmpresaInfo(datos);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error(
            "Error cargando las redes sociales:",
            error,
          );
        }
      } finally {
        setCargando(false);
      }
    }

    cargarEmpresaInfo();

    return () => {
      controlador.abort();
    };
  }, []);

  if (cargando) {
    if (variant !== "full") {
      return null;
    }

    return (
      <div
        className={cn(
          "border-t border-gray-200 bg-[#F7FAFC] py-8",
          className,
        )}
        aria-hidden="true"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mx-auto h-6 w-36 animate-pulse rounded-full bg-gray-200" />

          <div className="mx-auto mt-3 h-8 w-64 max-w-full animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (
    !empresaInfo ||
    (!empresaInfo.facebook && !empresaInfo.instagram)
  ) {
    return null;
  }

  const redes: RedSocial[] = [];

  if (empresaInfo.facebook) {
    redes.push({
      nombre: "Facebook",
      url: normalizarUrlRedSocial(
        empresaInfo.facebook,
        "facebook",
      ),
      icono: Facebook,
      descripcion:
        "Noticias, avisos y contenido para acompañar el bienestar de tu familia.",
      etiqueta: "Comunidad",
      tarjeta:
        "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white hover:border-blue-400",
      iconoContenedor:
        "bg-[#1877F2] text-white shadow-[0_8px_20px_rgba(24,119,242,0.24)]",
      boton: "bg-[#1877F2] text-white hover:bg-[#1264D5]",
      resplandor: "bg-[#1877F2]/10",
      etiquetaColor:
        "border-blue-200 bg-blue-50 text-blue-700",
    });
  }

  if (empresaInfo.instagram) {
    redes.push({
      nombre: "Instagram",
      url: normalizarUrlRedSocial(
        empresaInfo.instagram,
        "instagram",
      ),
      icono: Instagram,
      descripcion:
        "Contenido visual, recomendaciones y novedades de nuestra comunidad.",
      etiqueta: "Contenido visual",
      tarjeta:
        "border-pink-200 bg-gradient-to-br from-pink-50 via-white to-orange-50/30 hover:border-pink-400",
      iconoContenedor:
        "bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] text-white shadow-[0_8px_20px_rgba(228,64,95,0.22)]",
      boton:
        "bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#F56040] text-white hover:brightness-95",
      resplandor: "bg-[#E4405F]/10",
      etiquetaColor:
        "border-pink-200 bg-pink-50 text-pink-700",
    });
  }

  /* Variante compacta */
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2.5",
          className,
        )}
        aria-label="Redes sociales"
      >
        {redes.map((red) => {
          const Icono = red.icono;

          return (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar ${red.nombre}`}
              className="group relative rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md",
                  red.iconoContenedor,
                )}
              >
                <Icono
                  size={19}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#061C2E] px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {red.nombre}
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  /* Variante horizontal */
  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4",
          className,
        )}
      >
        {showText && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF4C2] text-[#0A3D62]">
              <HeartHandshake
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#0A3D62]">
                Conecta con nosotros
              </p>

              <p className="text-xs leading-5 text-gray-500">
                Noticias, avisos y recomendaciones.
              </p>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2",
            !showText && "justify-center",
          )}
        >
          {redes.map((red) => {
            const Icono = red.icono;

            return (
              <a
                key={red.nombre}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${red.nombre}`}
                className={cn(
                  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                  red.boton,
                )}
              >
                <Icono
                  size={16}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                {showText && <span>{red.nombre}</span>}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  /* Variante completa */
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14",
        className,
      )}
      aria-labelledby="redes-sociales-titulo"
    >
      {/* División superior */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-16 rounded-full bg-[#FFC300]" />
      </div>

      {/* Decoración */}
      <div
        className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        {showText && (
          <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A3D62] shadow-sm sm:text-xs">
              <Sparkles
                size={13}
                className="text-[#D69F00]"
                aria-hidden="true"
              />

              Conecta con nosotros
            </span>

            <h2
              id="redes-sociales-titulo"
              className="mt-3 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl lg:text-4xl"
            >
              Síguenos en nuestras{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  redes sociales
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Encuentra información pediátrica, avisos y contenido para el
              bienestar de tu familia.
            </p>
          </div>
        )}

        {/* Tarjetas */}
        <div
          className={cn(
            "mx-auto grid max-w-4xl gap-4",
            redes.length > 1
              ? "md:grid-cols-2"
              : "max-w-xl",
          )}
        >
          {redes.map((red) => {
            const Icono = red.icono;

            return (
              <a
                key={red.nombre}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Seguir al Centro Médico Pichardo en ${red.nombre}`}
                className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-4"
              >
                <article
                  className={cn(
                    "relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_36px_rgba(10,61,98,0.12)] sm:p-5",
                    red.tarjeta,
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110",
                      red.resplandor,
                    )}
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-1 flex-col">
                    {/* Cabecera de tarjeta */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                          red.iconoContenedor,
                        )}
                      >
                        <Icono
                          size={25}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]",
                          red.etiquetaColor,
                        )}
                      >
                        {red.etiqueta}
                      </span>
                    </div>

                    {/* Información */}
                    <div className="mt-4">
                      <h3 className="text-xl font-extrabold text-[#0A3D62] sm:text-2xl">
                        {red.nombre}
                      </h3>

                      {showText && (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {red.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Acción */}
                    <div className="mt-auto pt-4">
                      <span
                        className={cn(
                          "flex min-h-10 w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-bold shadow-sm transition-all duration-200",
                          red.boton,
                        )}
                      >
                        <span>Seguir en {red.nombre}</span>

                        <ArrowUpRight
                          size={17}
                          strokeWidth={2}
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            );
          })}
        </div>

        {/* Mensaje inferior */}
        {showText && (
          <div className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-2.5 text-center shadow-sm">
            <HeartHandshake
              size={17}
              className="shrink-0 text-[#D69F00]"
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <p className="text-xs font-semibold leading-5 text-gray-500">
              Compartimos información para fortalecer el cuidado y bienestar
              familiar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}