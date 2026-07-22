"use client";

import {
  BookOpenText,
  Loader2,
  SearchX,
} from "lucide-react";

import { ContenidoCard } from "./ContenidoCard";

interface ContenidoItem {
  id: number;
  tipo: "articulo" | "video" | "documento" | "encuesta";
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaPublicacion: string;
  destacado: boolean;
  activo: boolean;
}

interface ContenidoGridProps {
  items: ContenidoItem[];
  loading: boolean;
  onEdit: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
}

export function ContenidoGrid({
  items,
  loading,
  onEdit,
  onToggleActivo,
}: ContenidoGridProps) {
  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando contenido
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando los elementos de Saber Pediátrico.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <SearchX
              size={29}
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            No hay contenido disponible
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            No existen elementos que coincidan con los filtros
            seleccionados o todavía no se ha registrado contenido.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContenidoCard
            key={item.id}
            id={item.id}
            tipo={item.tipo}
            titulo={item.titulo}
            descripcion={item.descripcion}
            imagenUrl={item.imagenUrl}
            fechaPublicacion={item.fechaPublicacion}
            destacado={item.destacado}
            activo={item.activo}
            onEdit={onEdit}
            onToggleActivo={onToggleActivo}
          />
        ))}
      </div>

      <footer className="mt-5 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-gray-500">
          Mostrando{" "}
          <span className="font-extrabold text-[#0A3D62]">
            {items.length.toLocaleString("es-MX")}
          </span>{" "}
          {items.length === 1 ? "elemento" : "elementos"}
        </p>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
          <BookOpenText
            size={13}
            aria-hidden="true"
          />

          Saber Pediátrico
        </div>
      </footer>
    </section>
  );
}