// src/components/public/servicios/ServiciosHeader.tsx
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ServiciosSearchBar } from './ServiciosSearchBar';

interface ServiciosHeaderProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export function ServiciosHeader({ busqueda, setBusqueda }: ServiciosHeaderProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/headerimg.png"
          alt="Fondo médico"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/90 to-[#1A4F7A]/80"></div>
      </div>

      {/* Contenido (por encima de la imagen) */}
      <Container>
        <div className="relative z-10">
          {/* Título y descripción */}
          <div className="pt-20 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Nuestros servicios están diseñados para brindar una esmerada atención personalizada, 
              con calidad y calidez en todo momento. Cuidar tu salud es nuestra prioridad y nadie 
              lo hace como nosotros.
            </p>
          </div>

          {/* Buscador integrado */}
          <div className="pb-12">
            <ServiciosSearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
          </div>
        </div>
      </Container>
    </section>
  );
}