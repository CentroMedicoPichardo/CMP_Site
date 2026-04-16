// src/components/public/servicios/ServicioCardVertical.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ServicioCardVerticalProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenSrc?: string;
  linkVerMas: string;
}

export function ServicioCardVertical({ 
  id,
  titulo, 
  descripcion, 
  imagenSrc,
  linkVerMas 
}: ServicioCardVerticalProps) {
  
  // 👇 AGREGAR CONSOLA PARA DEBUG
  console.log('🎨 Renderizando ServicioCardVertical:', { id, titulo, descripcion, imagenSrc });
  
  const descripcionCorta = descripcion && descripcion.length > 100 
    ? descripcion.substring(0, 100) + '...' 
    : descripcion || "Atención especializada con profesionales de excelencia.";

  // Imagen por defecto (puedes cambiar la ruta según donde tengas tu imagen default)
  const DEFAULT_IMAGE = "/images/default-servicio.jpg"; // 👈 Cambia esta ruta según tu proyecto

  // Usar imagenSrc si existe, sino la imagen por defecto
  const imageToShow = imagenSrc && imagenSrc.trim() !== "" ? imagenSrc : DEFAULT_IMAGE;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
        <Image 
          src={imageToShow}
          alt={titulo || "Servicio"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Si la imagen falla al cargar, mostrar la imagen por defecto
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_IMAGE;
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#0A3D62] mb-3 group-hover:text-[#FFC300] transition-colors">
          {titulo || "Servicio Médico"}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed flex-1">
          {descripcionCorta}
        </p>
        
        {/* Link a detalle */}
        <Link 
          href={linkVerMas}
          className="inline-flex items-center gap-2 text-[#0A3D62] font-semibold hover:text-[#FFC300] transition-colors group/link mt-auto"
        >
          <span>Ver más</span>
          <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}