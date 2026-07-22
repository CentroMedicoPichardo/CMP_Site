"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  PlayCircle,
  X,
} from "lucide-react";

interface ModalDetalleProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  contenido?: string;
  urlExterno?: string;
  fecha?: string;
  imagenUrl?: string | null;
  tipo: "articulo" | "video";
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function getYoutubeId(url: string): string | null {
  try {
    const urlProcesada = new URL(url);
    const hostname = urlProcesada.hostname.replace("www.", "");

    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = urlProcesada.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (urlProcesada.pathname === "/watch") {
        videoId = urlProcesada.searchParams.get("v");
      } else {
        const segmentos = urlProcesada.pathname
          .split("/")
          .filter(Boolean);

        if (
          segmentos[0] === "embed" ||
          segmentos[0] === "shorts" ||
          segmentos[0] === "live"
        ) {
          videoId = segmentos[1] ?? null;
        }
      }
    }

    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return videoId;
    }

    return null;
  } catch {
    return null;
  }
}

export function ModalDetalle({
  isOpen,
  onClose,
  titulo,
  contenido,
  urlExterno,
  fecha,
  imagenUrl,
  tipo,
}: ModalDetalleProps) {
  const botonCerrarRef = useRef<HTMLButtonElement>(null);

  const esArticulo = tipo === "articulo";
  const esVideo = tipo === "video";

  const youtubeId =
    esVideo && urlExterno
      ? getYoutubeId(urlExterno)
      : null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", cerrarConEscape);

    const temporizador = window.setTimeout(() => {
      botonCerrarRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", cerrarConEscape);
      window.clearTimeout(temporizador);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-2 sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detalle-titulo"
    >
      {/* Fondo oscuro */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[#02111f]/80 backdrop-blur-sm"
        aria-label="Cerrar ventana"
      />

      {/* Contenedor principal */}
      <div className="relative z-10 flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl sm:rounded-3xl">
        {/* Barra superior */}
        <div
          className={cn(
            "h-1.5 w-full shrink-0",
            esArticulo ? "bg-blue-600" : "bg-red-500",
          )}
        />

        {/* Encabezado */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
                esArticulo
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-600",
              )}
            >
              {esArticulo ? (
                <BookOpen
                  size={24}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              ) : (
                <PlayCircle
                  size={25}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <span
                className={cn(
                  "mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs",
                  esArticulo
                    ? "text-blue-600"
                    : "text-red-500",
                )}
              >
                {esArticulo
                  ? "Artículo educativo"
                  : "Video educativo"}
              </span>

              <h2
                id="modal-detalle-titulo"
                className="text-base font-extrabold uppercase leading-tight text-[#0A3D62] sm:text-xl lg:text-2xl"
              >
                {titulo}
              </h2>

              {fecha && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                  <Calendar
                    size={15}
                    className="shrink-0 text-[#D69F00]"
                    aria-hidden="true"
                  />

                  <span>{fecha}</span>
                </div>
              )}
            </div>
          </div>

          <button
            ref={botonCerrarRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            aria-label="Cerrar detalle"
          >
            <X size={22} />
          </button>
        </header>

        {/* Contenido desplazable */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F9FC]">
          <div
            className={cn(
              esVideo
                ? "p-3 sm:p-4 lg:p-5"
                : "p-4 sm:p-6 lg:p-8",
            )}
          >
            {/* Video de YouTube */}
            {esVideo && youtubeId && (
              <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-black shadow-lg sm:rounded-2xl [@media(max-height:800px)]:max-w-[44rem] [@media(max-height:650px)]:max-w-[36rem]">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                    title={titulo}
                    className="block h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Video externo no compatible con YouTube */}
            {esVideo && urlExterno && !youtubeId && (
              <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white px-5 py-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <PlayCircle
                    size={34}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#0A3D62]">
                  Video externo
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Este video no puede reproducirse directamente dentro de la
                  página.
                </p>

                <a
                  href={urlExterno}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                >
                  <ExternalLink size={18} />
                  Abrir video
                </a>
              </div>
            )}

            {/* Artículo con apariencia de libro o revista */}
            {esArticulo && contenido && (
              <article className="flow-root rounded-2xl border border-gray-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                {imagenUrl && (
                  <figure className="relative mb-5 h-[200px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-md sm:float-left sm:mb-4 sm:mr-7 sm:h-[210px] sm:w-[280px] md:h-[225px] md:w-[310px] lg:mr-8 lg:h-[235px] lg:w-[330px]">
                    <Image
                      src={imagenUrl}
                      alt={titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, 330px"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </figure>
                )}

                <div
                  className="text-[0.95rem] leading-7 text-gray-700 sm:text-base sm:leading-8 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_h1]:mb-4 [&_h1]:mt-7 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0A3D62] [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0A3D62] [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0A3D62] [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:text-justify [&_strong]:font-bold [&_strong]:text-gray-900 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{
                    __html: contenido,
                  }}
                />
              </article>
            )}

            {/* Artículo sin contenido */}
            {esArticulo && !contenido && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <BookOpen
                    size={32}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 font-medium text-gray-600">
                  El contenido de este artículo no está disponible.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <footer className="flex shrink-0 items-center justify-end border-t border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0A3D62] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#082f4d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}