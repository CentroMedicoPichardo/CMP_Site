// src/components/public/servicios/ServiciosLayout.tsx
import React from 'react';
import { Container } from '@/components/ui/Container';
import { ServicioCardVertical } from './ServicioCardVertical';
import { ServicioCardHorizontal } from './ServicioCardHorizontal';

interface ServiciosLayoutProps {
  servicios: any[];
}

export function ServiciosLayout({ servicios }: ServiciosLayoutProps) {
  if (!servicios.length) {
    return (
      <section className="py-16">
        <Container>
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron servicios</p>
          </div>
        </Container>
      </section>
    );
  }

  // Función para dividir servicios en grupos de 8 (4 verticales + 4 horizontales en 2x2)
  const renderGrupos = () => {
    const grupos = [];
    
    for (let i = 0; i < servicios.length; i += 8) {
      const grupoServicios = servicios.slice(i, i + 8);
      
      // Primeros 4 del grupo: VERTICALES
      const verticales = grupoServicios.slice(0, 4);
      
      // Siguientes 4 del grupo: HORIZONTALES (para 2x2)
      const horizontales = grupoServicios.slice(4, 8);
      
      grupos.push(
        <div key={`grupo-${i}`} className="space-y-16">
          {/* Sección Vertical (4 en línea) */}
          {verticales.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {verticales.map((servicio) => (
                  <ServicioCardVertical
                    key={servicio.id}
                    id={servicio.id}
                    titulo={servicio.titulo}
                    descripcion={servicio.descripcion}
                    imagenSrc={servicio.imagenSrc}
                    linkVerMas={`/servicios/${servicio.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sección Horizontal (2x2) */}
          {horizontales.length > 0 && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {horizontales.map((servicio) => (
                  <ServicioCardHorizontal
                    key={servicio.id}
                    id={servicio.id}
                    titulo={servicio.titulo}
                    descripcion={servicio.descripcion}
                    imagenSrc={servicio.imagenSrc}
                    linkVerMas={`/servicios/${servicio.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return grupos;
  };

  return (
    <section className="py-16">
      <Container>
        <div className="space-y-16">
          {renderGrupos()}
        </div>
      </Container>
    </section>
  );
}