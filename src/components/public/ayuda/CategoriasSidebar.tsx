// src/components/public/ayuda/CategoriasSidebar.tsx
"use client";

import { CategoriaAyuda } from "@/types/help";

interface CategoriasSidebarProps {
  categorias: CategoriaAyuda[];
  categoriaActiva: number | null;
  onCategoriaClick: (idCategoria: number | null) => void;
}

export default function CategoriasSidebar({
  categorias,
  categoriaActiva,
  onCategoriaClick,
}: CategoriasSidebarProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sticky top-24">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        Categorías
      </h3>
      <div className="space-y-1">
        <button
          onClick={() => onCategoriaClick(null)}
          className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
            categoriaActiva === null
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="mr-2">📋</span>
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.idCategoria}
            onClick={() => onCategoriaClick(cat.idCategoria)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              categoriaActiva === cat.idCategoria
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">{cat.icono || "📌"}</span>
            {cat.nombreCategoria}
          </button>
        ))}
      </div>
    </div>
  );
}