// src/components/admin/saber-pediatrico/shared/ContenidoGrid.tsx
"use client";

import { Loader2 } from 'lucide-react';
import { ContenidoCard } from './ContenidoCard';

interface ContenidoItem {
  id: number;
  tipo: 'articulo' | 'video' | 'documento' | 'encuesta';
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

export function ContenidoGrid({ items, loading, onEdit, onToggleActivo }: ContenidoGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No hay elementos disponibles</p>
        <p className="text-gray-400 text-sm mt-2">Comienza creando uno nuevo</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}