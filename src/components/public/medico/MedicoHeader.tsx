// src/components/public/medico/MedicoHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { MedicoSearchBar } from './MedicoSearchBar';

interface MedicoHeaderProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function MedicoHeader({ busqueda, setBusqueda }: MedicoHeaderProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/headermedico.png"
          alt="Fondo médico"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/90 to-[#1A4F7A]/80"></div>
      </div>

      <Container>
        <div className="relative z-10">
          {/* Título y descripción */}
          <div className="pt-20 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Directorio Médico</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Conoce a nuestro equipo de especialistas. Médicos con amplia experiencia y vocación de servicio, 
              listos para brindar la mejor atención a tus pequeños.
            </p>
          </div>

          {/* Buscador integrado con colores dorados */}
          <div className="pb-12">
            <MedicoSearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
          </div>
        </div>
      </Container>
    </section>
  );
}