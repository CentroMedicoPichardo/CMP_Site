// src/components/public/home/ServiciosSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { publicRoutes } from '@/config/routes';
import { useState } from 'react';

interface ServiciosSectionProps {
  servicios: any[];
}

export function ServiciosSection({ servicios }: ServiciosSectionProps) {
  if (!servicios.length) return null;

  // Componente interno para manejar errores de imagen
  const ServicioImagen = ({ imagenSrc, titulo }: { imagenSrc?: string; titulo: string }) => {
    const [imageError, setImageError] = useState(false);
    const showIcon = !imagenSrc || imagenSrc.trim() === "" || imageError;

    if (showIcon) {
      return (
        <div className="relative w-64 h-64 lg:w-80 lg:h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFC300]/10 to-transparent rounded-3xl"></div>
          <div className="absolute inset-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <Heart size={80} className="text-[#0A3D62] opacity-20" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-64 h-64 lg:w-80 lg:h-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC300]/10 to-transparent rounded-3xl"></div>
        <div className="absolute inset-4 bg-white rounded-2xl shadow-xl overflow-hidden">
          <Image
            src={imagenSrc}
            alt={titulo}
            fill
            className="object-cover rounded-2xl"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A3D62] mb-6 leading-tight">
            Servicios para su Familia
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            En el Centro Médico Pichardo ofrecemos atención integral con 
            calidez humana y los más altos estándares de calidad.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {servicios.map((servicio: any, index: number) => (
            <div 
              key={`servicio-${servicio.id}`}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#FFC300] tracking-wider">
                    SERVICIO {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="h-px w-12 bg-[#FFC300]/30"></div>
                </div>
                
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A3D62] leading-tight">
                  {servicio.titulo}
                </h3>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {servicio.descripcion}
                </p>
                
                <div className="flex items-center justify-between pt-6">
                  {servicio.ubicacion && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={18} className="text-[#FFC300]" />
                      <span className="text-base">{servicio.ubicacion}</span>
                    </div>
                  )}
                  
                  <Link 
                    href={`/servicios/${servicio.id}`}
                    className="inline-flex items-center gap-2 text-base font-medium text-[#0A3D62] hover:text-[#FFC300] transition-colors group/link"
                  >
                    <span>Ver detalles</span>
                    <ChevronRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center">
                <ServicioImagen 
                  imagenSrc={servicio.imagenSrc} 
                  titulo={servicio.titulo}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 pt-8">
          <Link 
            href={publicRoutes.servicios}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A3D62] text-white rounded-xl hover:bg-[#FFC300] hover:text-[#0A3D62] font-medium text-lg transition-all duration-300 group"
          >
            <span>Explorar todos nuestros servicios</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </section>
  );
}