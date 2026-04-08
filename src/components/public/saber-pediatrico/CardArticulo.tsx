// src/components/public/saber-pediatrico/CardArticulo.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Eye, Heart, Share2, FileText } from 'lucide-react'; // 👈 Agregar FileText a los imports
import { ModalDetalle } from './ModalDetalle';

interface CardArticuloProps {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  fechaPublicacion: string;
  duracion?: string;
  contenido?: string;
}

export function CardArticulo({ id, titulo, descripcion, imagenUrl, fechaPublicacion, duracion, contenido }: CardArticuloProps) {
  const [modalOpen, setModalOpen] = useState(false);
    const fecha = new Date(fechaPublicacion).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
    });

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Imagen */}
        <div className="relative h-48 overflow-hidden">
          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={titulo}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] flex items-center justify-center">
              <FileText size={48} className="text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Contenido */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{fecha}</span>
            </div>
            {duracion && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{duracion}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-2 group-hover:text-[#FFC300] transition-colors">
            {titulo}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {descripcion}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-400">
              <button className="hover:text-red-500 transition-colors flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Heart size={16} />
                <span className="text-xs">0</span>
              </button>
              <button className="hover:text-[#FFC300] transition-colors flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Share2 size={16} />
                <span className="text-xs">Compartir</span>
              </button>
            </div>
            <span className="text-sm font-medium text-[#FFC300] group-hover:translate-x-1 transition-transform">
              Leer más →
            </span>
          </div>
        </div>
      </div>

      <ModalDetalle
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo={titulo}
        contenido={contenido || ''}
        fecha={fecha}
        imagenUrl={imagenUrl}
        tipo="articulo"
      />
    </>
  );
}