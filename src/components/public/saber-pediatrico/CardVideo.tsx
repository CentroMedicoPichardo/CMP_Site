// src/components/public/saber-pediatrico/CardVideo.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play, Clock, Calendar, Eye } from 'lucide-react';
import { ModalDetalle } from './ModalDetalle';

interface CardVideoProps {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  urlExterno: string;
  duracion?: string;
  fechaPublicacion: string;
}

export function CardVideo({ id, titulo, descripcion, imagenUrl, urlExterno, duracion, fechaPublicacion }: CardVideoProps) {
  const [modalOpen, setModalOpen] = useState(false);
    const fecha = new Date(fechaPublicacion).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
    });

  // Extraer ID de YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(urlExterno);
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : imagenUrl;

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {thumbnailUrl ? (
            <>
              <Image
                src={thumbnailUrl}
                alt={titulo}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#FFC300] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Play size={28} className="text-[#0A3D62] ml-1" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <Play size={48} className="text-white/30" />
            </div>
          )}
          {duracion && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-lg text-xs text-white">
              {duracion}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Calendar size={12} />
            <span>{fecha}</span>
          </div>
          
          <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-2 group-hover:text-[#FFC300] transition-colors">
            {titulo}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {descripcion}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-400">
              <Eye size={14} />
              <span className="text-xs">Ver video →</span>
            </div>
            <span className="text-sm font-medium text-[#FFC300] group-hover:translate-x-1 transition-transform">
              Reproducir
            </span>
          </div>
        </div>
      </div>

      <ModalDetalle
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo={titulo}
        urlExterno={urlExterno}
        tipo="video"
      />
    </>
  );
}