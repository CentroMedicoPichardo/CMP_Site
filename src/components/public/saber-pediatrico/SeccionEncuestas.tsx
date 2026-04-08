// src/components/public/saber-pediatrico/SeccionEncuestas.tsx
"use client";

import { CardEncuesta } from './CardEncuesta';

interface Encuesta {
  id: number;
  titulo: string;
  descripcion: string;
  urlExterno: string;
  fechaFin?: string;
}

interface SeccionEncuestasProps {
  encuestas: Encuesta[];
}

export function SeccionEncuestas({ encuestas }: SeccionEncuestasProps) {
  if (encuestas.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0A3D62]">📊 Encuestas activas</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#FFC300]/30 to-transparent ml-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {encuestas.map((encuesta) => (
          <CardEncuesta key={encuesta.id} {...encuesta} />
        ))}
      </div>
    </section>
  );
}