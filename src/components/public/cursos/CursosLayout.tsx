// src/components/public/cursos/CursosLayout.tsx
'use client';

import React from 'react';
import { CursoCard } from './CursoCard';

interface CursosLayoutProps {
  cursos: any[];
}

export function CursosLayout({ cursos }: CursosLayoutProps) {
  if (!cursos.length) {
    return (
      <div className="bg-gray-50 rounded-3xl p-12 text-center max-w-4xl mx-auto">
        <p className="text-gray-500 text-lg">No se encontraron cursos que coincidan con tu búsqueda.</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros términos de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {cursos.map((curso) => (
        <CursoCard
          key={curso.id}
          id={curso.id}
          titulo={curso.titulo}
          descripcion={curso.descripcion}
          fechaInicio={curso.fechaInicio}
          fechaFin={curso.fechaFin}
          fechaPublicacion={curso.fechaPublicacion}
          inscripcionesAbiertas={curso.inscripcionesAbiertas}
          cupoMaximo={curso.cupoMaximo}
          cupoInscrito={curso.cupoInscrito}
          instructor={curso.instructor}
          horario={curso.horario}
          modalidad={curso.modalidad}
          dirigidoA={curso.dirigidoA}
          estado={curso.estado}
          imagenSrc={curso.imagenSrc}
          costo={curso.costo}
          ubicacion={curso.ubicacion}
          linkDetalle={curso.linkDetalle}
        />
      ))}
    </div>
  );
}