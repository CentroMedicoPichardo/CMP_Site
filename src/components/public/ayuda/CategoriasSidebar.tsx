"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  LifeBuoy,
  LockKeyhole,
  MessageCircleQuestion,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { CategoriaAyuda } from "@/types/help";

interface CategoriasSidebarProps {
  categorias: CategoriaAyuda[];
  categoriaActiva: number | null;
  onCategoriaClick: (
    idCategoria: number | null,
  ) => void;
}

interface BotonCategoriaProps {
  activo: boolean;
  nombre: string;
  Icono: LucideIcon;
  onClick: () => void;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-MX");
}

function obtenerIconoCategoria(
  nombreCategoria: string,
): LucideIcon {
  const nombre = normalizarTexto(nombreCategoria);

  if (
    nombre.includes("curso") ||
    nombre.includes("taller") ||
    nombre.includes("capacitacion")
  ) {
    return GraduationCap;
  }

  if (
    nombre.includes("cuenta") ||
    nombre.includes("perfil") ||
    nombre.includes("usuario") ||
    nombre.includes("registro")
  ) {
    return UserRound;
  }

  if (
    nombre.includes("contrasena") ||
    nombre.includes("seguridad") ||
    nombre.includes("acceso") ||
    nombre.includes("sesion")
  ) {
    return LockKeyhole;
  }

  if (
    nombre.includes("pago") ||
    nombre.includes("factura") ||
    nombre.includes("costo") ||
    nombre.includes("compra")
  ) {
    return CreditCard;
  }

  if (
    nombre.includes("cita") ||
    nombre.includes("agenda") ||
    nombre.includes("horario")
  ) {
    return CalendarDays;
  }

  if (
    nombre.includes("medico") ||
    nombre.includes("doctor") ||
    nombre.includes("especialista")
  ) {
    return Stethoscope;
  }

  if (
    nombre.includes("servicio") ||
    nombre.includes("salud") ||
    nombre.includes("consulta")
  ) {
    return HeartPulse;
  }

  if (
    nombre.includes("foro") ||
    nombre.includes("comunidad") ||
    nombre.includes("comentario")
  ) {
    return MessageCircleQuestion;
  }

  if (
    nombre.includes("blog") ||
    nombre.includes("publicacion") ||
    nombre.includes("articulo")
  ) {
    return BookOpenText;
  }

  if (
    nombre.includes("documento") ||
    nombre.includes("archivo") ||
    nombre.includes("termino") ||
    nombre.includes("politica")
  ) {
    return FileText;
  }

  if (
    nombre.includes("configuracion") ||
    nombre.includes("preferencia")
  ) {
    return Settings;
  }

  if (
    nombre.includes("privacidad") ||
    nombre.includes("proteccion")
  ) {
    return ShieldCheck;
  }

  if (
    nombre.includes("pregunta") ||
    nombre.includes("ayuda") ||
    nombre.includes("soporte")
  ) {
    return CircleHelp;
  }

  return FolderOpen;
}

export default function CategoriasSidebar({
  categorias,
  categoriaActiva,
  onCategoriaClick,
}: CategoriasSidebarProps) {
  const listaCategorias = Array.isArray(categorias)
    ? categorias
    : [];

  return (
    <aside
      className="relative lg:sticky lg:top-24"
      aria-label="Categorías de preguntas frecuentes"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(10,61,98,0.07)]">
        {/* Encabezado */}
        <div className="relative overflow-hidden border-b border-white/10 bg-[#0A3D62] px-4 py-4">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FFC300]/15 blur-2xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-10 left-10 h-20 w-20 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-sm">
              <LifeBuoy
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#FFC300]">
                Centro de ayuda
              </p>

              <h2 className="mt-0.5 text-base font-extrabold text-white">
                Categorías
              </h2>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <nav
          className="p-2.5"
          aria-label="Filtrar preguntas por categoría"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            <BotonCategoria
              activo={categoriaActiva === null}
              nombre="Todas las preguntas"
              Icono={LayoutGrid}
              onClick={() => onCategoriaClick(null)}
            />

            {listaCategorias.map((categoria) => (
              <BotonCategoria
                key={categoria.idCategoria}
                activo={
                  categoriaActiva === categoria.idCategoria
                }
                nombre={
                  categoria.nombreCategoria?.trim() ||
                  "Categoría"
                }
                Icono={obtenerIconoCategoria(
                  categoria.nombreCategoria || "",
                )}
                onClick={() =>
                  onCategoriaClick(
                    categoria.idCategoria,
                  )
                }
              />
            ))}
          </div>
        </nav>

        {/* Sin categorías */}
        {listaCategorias.length === 0 && (
          <div className="border-t border-gray-100 px-4 py-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <FolderOpen
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <p className="mt-2 text-xs font-bold text-[#0A3D62]">
              Sin categorías disponibles
            </p>

            <p className="mt-1 text-[10px] leading-4 text-gray-500">
              Las preguntas todavía no han sido clasificadas.
            </p>
          </div>
        )}

        {/* Información */}
        <div className="hidden border-t border-gray-100 bg-[#F7FAFC] px-4 py-3 lg:flex lg:items-start lg:gap-2">
          <CircleHelp
            size={14}
            className="mt-0.5 shrink-0 text-[#0A3D62]"
            aria-hidden="true"
          />

          <p className="text-[10px] leading-4 text-gray-500">
            Selecciona una categoría para consultar las
            preguntas relacionadas.
          </p>
        </div>
      </div>
    </aside>
  );
}

function BotonCategoria({
  activo,
  nombre,
  Icono,
  onClick,
}: BotonCategoriaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "group relative flex min-h-11 min-w-max items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 lg:w-full lg:min-w-0",
        activo
          ? "border-[#0A3D62] bg-[#0A3D62] text-white shadow-[0_7px_18px_rgba(10,61,98,0.16)]"
          : "border-transparent bg-white text-gray-600 hover:border-[#0A3D62]/10 hover:bg-[#F7FAFC] hover:text-[#0A3D62]",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
          activo
            ? "bg-white/10 text-[#FFC300]"
            : "bg-[#EAF2F8] text-[#0A3D62] group-hover:bg-white",
        )}
      >
        <Icono
          size={17}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>

      <span
        className={cn(
          "block min-w-0 flex-1 truncate text-xs font-bold",
          activo
            ? "text-white"
            : "text-gray-700 group-hover:text-[#0A3D62]",
        )}
        title={nombre}
      >
        {nombre}
      </span>

      <ChevronRight
        size={15}
        strokeWidth={2}
        className={cn(
          "hidden shrink-0 transition-all duration-200 lg:block",
          activo
            ? "translate-x-0.5 text-[#FFC300]"
            : "text-gray-300 group-hover:translate-x-0.5 group-hover:text-[#0A3D62]",
        )}
        aria-hidden="true"
      />

      {activo && (
        <span
          className="absolute bottom-2 left-0 top-2 hidden w-1 rounded-r-full bg-[#FFC300] lg:block"
          aria-hidden="true"
        />
      )}
    </button>
  );
}