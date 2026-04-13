// src/components/public/cursos/CursosHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { CursosSearchBar } from './CursosSearchBar';
import { FiltroCursos } from './CursosFilters';

interface CursosHeaderProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function CursosHeader({ busqueda, setBusqueda }: CursosHeaderProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/headercursos.png"
          alt="Fondo cursos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/90 to-[#1A4F7A]/80"></div>
      </div>

      <Container>
        <div className="relative z-10">
          {/* Título y descripción */}
          <div className="pt-20 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cursos y Talleres</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Formación especializada para padres y cuidadores. Aprende de la mano de expertos 
              y brinda el mejor cuidado a tus pequeños.
            </p>
          </div>

          {/* Buscador y Filtros integrados */}
          <div className="pb-12 max-w-6xl mx-auto">
            <CursosSearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
            <div className="mt-4">
              <FiltroCursos />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}