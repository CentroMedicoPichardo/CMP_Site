"use client";

import {
  FileText,
  Youtube,
  FileArchive,
  FileQuestion,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

type TipoContenido =
  | "todos"
  | "articulos"
  | "videos"
  | "documentos"
  | "encuestas";

interface TabCategoria {
  id: TipoContenido;
  label: string;
  count: number;
}

interface FiltrosCategoriaProps {
  activeTab: TipoContenido;
  onTabChange: (tab: TipoContenido) => void;
  tabs: TabCategoria[];
}

const iconos: Record<TipoContenido, LucideIcon> = {
  todos: LayoutGrid,
  articulos: FileText,
  videos: Youtube,
  documentos: FileArchive,
  encuestas: FileQuestion,
};

const estilosActivos: Record<TipoContenido, string> = {
  todos: "border-[#0A3D62] bg-[#0A3D62] text-white",
  articulos: "border-blue-600 bg-blue-600 text-white",
  videos: "border-red-500 bg-red-500 text-white",
  documentos: "border-amber-500 bg-amber-500 text-white",
  encuestas: "border-emerald-600 bg-emerald-600 text-white",
};

const estilosIconos: Record<TipoContenido, string> = {
  todos: "bg-[#0A3D62]/10 text-[#0A3D62]",
  articulos: "bg-blue-100 text-blue-700",
  videos: "bg-red-100 text-red-600",
  documentos: "bg-amber-100 text-amber-700",
  encuestas: "bg-emerald-100 text-emerald-700",
};

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

export function FiltrosCategoria({
  activeTab,
  onTabChange,
  tabs,
}: FiltrosCategoriaProps) {
  return (
    <section
      aria-label="Filtros de contenido pediátrico"
      className="w-full"
    >
      {/* Encabezado */}
      <div className="mb-4 sm:mb-5">
        <h2 className="text-lg font-bold text-[#0A3D62] sm:text-xl">
          Explora nuestro contenido
        </h2>

        <p className="mt-1 text-sm leading-relaxed text-gray-500 sm:text-base">
          Selecciona una categoría para encontrar información de tu interés.
        </p>
      </div>

      {/* Categorías */}
      <div
        className="grid w-full grid-cols-2 gap-2.5 md:grid-cols-5 md:gap-3"
        role="tablist"
        aria-label="Categorías disponibles"
      >
        {tabs.map((tab) => {
          const Icon = iconos[tab.id];
          const isActive = activeTab === tab.id;
          const esTodos = tab.id === "todos";

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-pressed={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "group flex h-14 min-w-0 items-center gap-2 rounded-xl border px-3 text-left shadow-sm transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                "sm:h-16 sm:gap-3 sm:px-4",
                esTodos &&
                  "col-span-2 mx-auto w-full max-w-[230px] md:col-span-1 md:max-w-none",
                isActive
                  ? estilosActivos[tab.id]
                  : "border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-[#0A3D62]/30 hover:bg-[#F8FAFC] hover:text-[#0A3D62] hover:shadow-md",
              )}
            >
              {/* Icono */}
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  "sm:h-9 sm:w-9",
                  isActive
                    ? "bg-white/20 text-white"
                    : estilosIconos[tab.id],
                )}
              >
                <Icon
                  size={17}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              {/* Texto */}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold sm:text-base">
                  {tab.label}
                </span>

                <span
                  className={cn(
                    "hidden truncate text-xs sm:block",
                    isActive
                      ? "text-white/75"
                      : "text-gray-400",
                  )}
                >
                  {tab.count === 0
                    ? "Sin contenido"
                    : `${tab.count} ${
                        tab.count === 1
                          ? "publicación"
                          : "publicaciones"
                      }`}
                </span>
              </span>

              {/* Contador */}
              <span
                className={cn(
                  "flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                  isActive
                    ? "bg-white text-[#0A3D62]"
                    : "bg-gray-100 text-gray-500 group-hover:bg-[#0A3D62] group-hover:text-white",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}