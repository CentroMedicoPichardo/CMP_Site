"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Award,
  BookOpenText,
  Building2,
  Eye,
  HeartHandshake,
  ImageOff,
  Sparkles,
  Target,
} from "lucide-react";

import type { QuienesSomosData } from "@/types/quienes-somos";

interface QuienesSomosPreviewProps {
  data: QuienesSomosData;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
): string {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function normalizarValores(
  valores: unknown,
): string[] {
  if (!Array.isArray(valores)) {
    return [];
  }

  return valores
    .filter(
      (valor): valor is string =>
        typeof valor === "string",
    )
    .map((valor) => valor.trim())
    .filter(Boolean);
}

function obtenerUrlImagen(
  valor: unknown,
): string | null {
  const url = textoSeguro(valor);

  if (
    !url ||
    url === "no_imagen_uwvduy"
  ) {
    return null;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  }

  return `/${url}`;
}

function SeccionVistaPrevia({
  icono,
  titulo,
  children,
  destacada = false,
}: {
  icono: ReactNode;
  titulo: string;
  children: ReactNode;
  destacada?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-4",
        destacada
          ? "border-[#FFC300]/40 bg-[#FFF9E6]"
          : "border-gray-200 bg-white",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            destacada
              ? "bg-[#FFC300] text-[#0A3D62]"
              : "bg-[#EAF2F8] text-[#0A3D62]",
          )}
        >
          {icono}
        </span>

        <h3 className="whitespace-normal break-words text-sm font-extrabold text-[#0A3D62]">
          {titulo}
        </h3>
      </div>

      {children}
    </section>
  );
}

export function QuienesSomosPreview({
  data,
}: QuienesSomosPreviewProps) {
  const urlImagen =
    obtenerUrlImagen(data.urlImagen);

  const [imagenConError, setImagenConError] =
    useState(false);

  useEffect(() => {
    setImagenConError(false);
  }, [urlImagen]);

  const nuestraHistoria =
    textoSeguro(data.nuestraHistoria);

  const compromiso =
    textoSeguro(data.compromiso);

  const mision =
    textoSeguro(data.mision);

  const vision =
    textoSeguro(data.vision);

  const valores =
    normalizarValores(data.valores);

  const mostrarImagen =
    Boolean(urlImagen) &&
    !imagenConError;

  return (
    <aside className="self-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-28">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <Eye
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Presentación pública
              </p>

              <h2 className="mt-1 whitespace-normal break-words text-lg font-extrabold text-[#0A3D62]">
                Vista previa
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Representación aproximada de la
                sección visible para los usuarios.
              </p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-700">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />

            Vista activa
          </span>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F8FAFC]">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#EAF2F8]">
            {mostrarImagen ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlImagen as string}
                  alt="Imagen de la sección Quiénes Somos"
                  className="h-full w-full object-cover"
                  onError={() => {
                    setImagenConError(true);
                  }}
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061C2E]/65 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A3D62] shadow-sm">
                  {imagenConError ? (
                    <ImageOff
                      size={26}
                      aria-hidden="true"
                    />
                  ) : (
                    <Building2
                      size={27}
                      aria-hidden="true"
                    />
                  )}
                </span>

                <p className="mt-3 text-xs font-extrabold text-[#0A3D62]">
                  {imagenConError
                    ? "Imagen no disponible"
                    : "Imagen institucional"}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400">
                  Carga una imagen para completar
                  la cabecera de la sección.
                </p>
              </div>
            )}

            {mostrarImagen && (
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC300] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#0A3D62] shadow-sm">
                  <Sparkles
                    size={12}
                    aria-hidden="true"
                  />

                  Centro Médico Pichardo
                </span>
              </div>
            )}
          </div>
        </section>

        <SeccionVistaPrevia
          icono={
            <BookOpenText
              size={17}
              aria-hidden="true"
            />
          }
          titulo="Nuestra historia"
        >
          <p
            className={cn(
              "whitespace-pre-wrap break-words text-sm leading-6",
              nuestraHistoria
                ? "text-gray-600"
                : "italic text-gray-400",
            )}
          >
            {nuestraHistoria ||
              "Agrega la historia del centro médico para mostrarla en esta sección."}
          </p>
        </SeccionVistaPrevia>

        <SeccionVistaPrevia
          icono={
            <Award
              size={17}
              aria-hidden="true"
            />
          }
          titulo="Nuestro compromiso"
          destacada
        >
          <p
            className={cn(
              "whitespace-pre-wrap break-words text-sm leading-6",
              compromiso
                ? "text-gray-700"
                : "italic text-gray-400",
            )}
          >
            {compromiso ||
              "Describe el compromiso institucional con los pacientes y sus familias."}
          </p>
        </SeccionVistaPrevia>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SeccionVistaPrevia
            icono={
              <Target
                size={17}
                aria-hidden="true"
              />
            }
            titulo="Misión"
          >
            <p
              className={cn(
                "whitespace-pre-wrap break-words text-xs leading-5",
                mision
                  ? "text-gray-600"
                  : "italic text-gray-400",
              )}
            >
              {mision ||
                "Agrega la misión institucional."}
            </p>
          </SeccionVistaPrevia>

          <SeccionVistaPrevia
            icono={
              <Eye
                size={17}
                aria-hidden="true"
              />
            }
            titulo="Visión"
          >
            <p
              className={cn(
                "whitespace-pre-wrap break-words text-xs leading-5",
                vision
                  ? "text-gray-600"
                  : "italic text-gray-400",
              )}
            >
              {vision ||
                "Agrega la visión institucional."}
            </p>
          </SeccionVistaPrevia>
        </div>

        <SeccionVistaPrevia
          icono={
            <HeartHandshake
              size={17}
              aria-hidden="true"
            />
          }
          titulo="Valores"
        >
          {valores.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {valores.map(
                (valor, indice) => (
                  <span
                    key={`${valor}-${indice}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-1.5 text-[11px] font-bold text-[#0A3D62]"
                  >
                    <HeartHandshake
                      size={12}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span className="whitespace-normal break-words">
                      {valor}
                    </span>
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="text-xs italic leading-5 text-gray-400">
              Agrega los valores que representan al
              centro médico.
            </p>
          )}
        </SeccionVistaPrevia>

        <footer className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
            <Eye
              size={15}
              aria-hidden="true"
            />

            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-extrabold text-emerald-800">
              Vista previa disponible
            </p>

            <p className="mt-1 whitespace-normal break-words text-[10px] leading-4 text-emerald-700">
              El contenido público se actualizará
              después de guardar los cambios.
            </p>
          </div>
        </footer>
      </div>
    </aside>
  );
}