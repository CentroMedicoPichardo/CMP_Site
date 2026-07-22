import Image from "next/image";
import { HeartPulse, ShieldCheck } from "lucide-react";

interface ServicioCardVerticalProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenSrc?: string;
  linkVerMas?: string;
}

const DEFAULT_IMAGE = "/images/default-servicio.jpg";

export function ServicioCardVertical({
  id,
  titulo,
  descripcion,
  imagenSrc,
}: ServicioCardVerticalProps) {
  const tituloMostrado =
    titulo?.trim() || "Servicio médico";

  const descripcionMostrada =
    descripcion?.trim() ||
    "Atención especializada con profesionales comprometidos con tu salud y bienestar.";

  const imagenMostrada =
    imagenSrc?.trim() || DEFAULT_IMAGE;

  return (
    <article
      aria-labelledby={`servicio-${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_28px_rgba(10,61,98,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0A3D62]/20 hover:shadow-[0_18px_40px_rgba(10,61,98,0.14)]"
    >
      {/* Imagen */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-[#EAF2F8] sm:h-52">
        <Image
          src={imagenMostrada}
          alt={`Servicio de ${tituloMostrado}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#061C2E]/85 via-[#0A3D62]/10 to-transparent"
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

        {/* Indicador visual */}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-[#0A3D62]/80 text-white shadow-md backdrop-blur-md">
          <ShieldCheck
            size={18}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </div>

        {/* Título */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFC300]">
            Atención especializada
          </p>

          <h3
            id={`servicio-${id}`}
            className="mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl"
          >
            {tituloMostrado}
          </h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="line-clamp-4 text-sm leading-6 text-gray-600">
          {descripcionMostrada}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="text-xs font-semibold text-gray-500">
              Atención profesional y personalizada
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}