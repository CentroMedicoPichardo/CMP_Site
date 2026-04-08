// src/components/public/saber-pediatrico/SeccionArticulos.tsx
"use client";

import { CardArticulo } from './CardArticulo';

interface Articulo {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  fechaPublicacion: string;
  duracion?: string;
  contenido?: string;
}

interface SeccionArticulosProps {
  articulos: Articulo[];
}

export function SeccionArticulos({ articulos }: SeccionArticulosProps) {
  if (articulos.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0A3D62]">📖 Artículos educativos</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#FFC300]/30 to-transparent ml-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articulos.map((articulo) => (
          <CardArticulo key={articulo.id} {...articulo} />
        ))}
      </div>
    </section>
  );
}