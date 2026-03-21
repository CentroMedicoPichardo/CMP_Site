// src/components/public/quienes-somos/QuienesSomosHeader.tsx
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export function QuienesSomosHeader() {
  return (
    <section className="relative bg-gradient-to-b from-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/headerquienesomos.png"
          alt="Fondo Quiénes Somos - Familia y niños"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/90 to-[#1A4F7A]/80"></div>
      </div>

      <Container>
        <div className="relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Centro Médico Pichardo:{' '}
              <span className="text-[#FFC300]">Cuidado Pediátrico con Propósito</span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Somos más que una clínica; somos el aliado de su familia en el viaje más importante: 
              el crecimiento y bienestar de sus hijos.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}