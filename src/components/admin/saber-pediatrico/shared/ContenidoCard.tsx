"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  BookOpenText,
  CalendarDays,
  ClipboardList,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  ImageOff,
  Star,
  Video,
} from "lucide-react";

type ContenidoTipo =
  | "articulo"
  | "video"
  | "documento"
  | "encuesta";

interface ContenidoCardProps {
  id: number;
  tipo: ContenidoTipo;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaPublicacion: string;
  destacado: boolean;
  activo: boolean;
  onEdit: (id: number) => void;
  onToggleActivo: (
    id: number,
    activo: boolean,
  ) => void;
}

const CONFIGURACION_TIPO: Record<
  ContenidoTipo,
  {
    label: string;
    fondo: string;
    texto: string;
    placeholder: string;
  }
> = {
  articulo: {
    label: "Artículo",
    fondo: "bg-blue-50",
    texto: "text-blue-700",
    placeholder:
      "from-blue-50 to-blue-100",
  },
  video: {
    label: "Video",
    fondo: "bg-red-50",
    texto: "text-red-700",
    placeholder:
      "from-red-50 to-red-100",
  },
  documento: {
    label: "Documento",
    fondo: "bg-emerald-50",
    texto: "text-emerald-700",
    placeholder:
      "from-emerald-50 to-emerald-100",
  },
  encuesta: {
    label: "Encuesta",
    fondo: "bg-purple-50",
    texto: "text-purple-700",
    placeholder:
      "from-purple-50 to-purple-100",
  },
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function IconoContenido({
  tipo,
  size = 20,
  className,
}: {
  tipo: ContenidoTipo;
  size?: number;
  className?: string;
}) {
  if (tipo === "video") {
    return (
      <Video
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "documento") {
    return (
      <FileText
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "encuesta") {
    return (
      <ClipboardList
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <BookOpenText
      size={size}
      className={className}
      aria-hidden="true"
    />
  );
}

function convertirFecha(
  valor: string,
): Date | null {
  const coincidencia =
    /^(\d{4})-(\d{2})-(\d{2})/.exec(
      valor,
    );

  if (coincidencia) {
    const año = Number(
      coincidencia[1],
    );
    const mes = Number(
      coincidencia[2],
    );
    const dia = Number(
      coincidencia[3],
    );

    const fecha = new Date(
      año,
      mes - 1,
      dia,
    );

    if (!Number.isNaN(fecha.getTime())) {
      return fecha;
    }
  }

  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? null
    : fecha;
}

function formatearFecha(
  valor: string,
): string {
  const fecha = convertirFecha(valor);

  if (!fecha) {
    return "Fecha no disponible";
  }

  return fecha.toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export function ContenidoCard({
  id,
  tipo,
  titulo,
  descripcion,
  imagenUrl,
  fechaPublicacion,
  destacado,
  activo,
  onEdit,
  onToggleActivo,
}: ContenidoCardProps) {
  const [imagenConError, setImagenConError] =
    useState(false);

  const configuracion =
    CONFIGURACION_TIPO[tipo];

  const mostrarImagen =
    Boolean(imagenUrl) &&
    !imagenConError;

  useEffect(() => {
    setImagenConError(false);
  }, [imagenUrl]);

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        destacado
          ? "border-[#FFC300] shadow-[#FFC300]/10"
          : "border-gray-200 hover:border-gray-300",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {mostrarImagen ? (
          <Image
            src={imagenUrl as string}
            alt={titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              !activo &&
                "grayscale-[35%]",
            )}
            onError={() => {
              setImagenConError(true);
            }}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br",
              configuracion.placeholder,
            )}
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm",
                configuracion.texto,
              )}
            >
              {imagenUrl &&
              imagenConError ? (
                <ImageOff
                  size={30}
                  aria-hidden="true"
                />
              ) : (
                <IconoContenido
                  tipo={tipo}
                  size={31}
                />
              )}
            </span>

            <p
              className={cn(
                "mt-3 text-xs font-extrabold",
                configuracion.texto,
              )}
            >
              {imagenUrl &&
              imagenConError
                ? "Imagen no disponible"
                : configuracion.label}
            </p>
          </div>
        )}

        {mostrarImagen && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061C2E]/45 via-transparent to-transparent"
            aria-hidden="true"
          />
        )}

        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-white/60 px-2.5 py-1.5 text-[10px] font-extrabold shadow-sm backdrop-blur-sm",
              configuracion.fondo,
              configuracion.texto,
            )}
          >
            <IconoContenido
              tipo={tipo}
              size={13}
            />

            {configuracion.label}
          </span>
        </div>

        {destacado && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFC300] px-2.5 py-1.5 text-[10px] font-extrabold text-[#0A3D62] shadow-sm">
              <Star
                size={12}
                fill="currentColor"
                aria-hidden="true"
              />

              Destacado
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-sm",
              activo
                ? "bg-emerald-600"
                : "bg-gray-600",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-white",
                activo &&
                  "animate-pulse",
              )}
              aria-hidden="true"
            />

            {activo
              ? "Publicado"
              : "Oculto"}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="min-w-0 flex-1">
          <h3 className="whitespace-normal break-words text-lg font-extrabold leading-6 text-[#0A3D62] transition-colors group-hover:text-[#061C2E]">
            {titulo}
          </h3>

          {descripcion ? (
            <p className="mt-3 whitespace-normal break-words text-sm leading-6 text-gray-600">
              {descripcion}
            </p>
          ) : (
            <p className="mt-3 text-sm italic leading-6 text-gray-400">
              Este contenido no tiene una descripción registrada.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
          <CalendarDays
            size={14}
            className="shrink-0 text-[#0A3D62]"
            aria-hidden="true"
          />

          <span className="break-words">
            Publicación:{" "}
            {formatearFecha(
              fechaPublicacion,
            )}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              onEdit(id);
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
          >
            <Edit3
              size={15}
              aria-hidden="true"
            />

            Editar contenido
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleActivo(id, activo);
            }}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
              activo
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
            )}
            aria-label={
              activo
                ? `Ocultar ${titulo}`
                : `Publicar ${titulo}`
            }
          >
            {activo ? (
              <EyeOff
                size={15}
                aria-hidden="true"
              />
            ) : (
              <Eye
                size={15}
                aria-hidden="true"
              />
            )}

            {activo
              ? "Ocultar"
              : "Publicar"}
          </button>
        </div>
      </div>
    </article>
  );
}