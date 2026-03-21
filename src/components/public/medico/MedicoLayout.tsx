// src/components/public/medico/MedicoLayout.tsx
'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { MedicoCard } from './MedicoCard'; // 👈 Importamos la card existente

// Re-utilizamos la interfaz para asegurar el tipado
interface Medico {
  id: string | number;
  nombre: string;
  especialidad: string;
  hospital?: string;
  direccion?: string;
  imagenSrc: string;
}

interface MedicoLayoutProps {
  medicos: Medico[];
}

export function MedicoLayout({ medicos }: MedicoLayoutProps) {
  // Si no hay médicos después del filtrado, mostramos un mensaje
  if (!medicos.length) {
    return (
      <section className="py-16">
        <Container>
          <div className="text-center py-16 bg-gray-50 rounded-3xl">
            <p className="text-gray-500 text-lg">No se encontraron médicos que coincidan con tu búsqueda.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container>
        {/* Grid responsive: 1 col en móvil, 2 en tablet, 3 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicos.map((medico) => (
            <MedicoCard
              key={medico.id}
              id={medico.id}
              nombre={medico.nombre}
              especialidad={medico.especialidad}
              hospital={medico.hospital || "Centro Médico Pichardo"}
              direccion={medico.direccion || "Huejutla, Hidalgo"}
              imagenSrc={medico.imagenSrc}
              linkVerMas={`/directorio-medico/${medico.id}`} // Asume que tienes una página de detalle
            />
          ))}
        </div>
      </Container>
    </section>
  );
}