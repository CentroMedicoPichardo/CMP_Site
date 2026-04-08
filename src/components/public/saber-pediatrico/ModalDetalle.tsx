// src/components/public/saber-pediatrico/ModalDetalle.tsx
"use client";

import { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import Image from 'next/image';

interface ModalDetalleProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  contenido?: string;
  urlExterno?: string;
  fecha?: string;
  imagenUrl?: string | null;
  tipo: 'articulo' | 'video';
}

export function ModalDetalle({ 
  isOpen, 
  onClose, 
  titulo, 
  contenido, 
  urlExterno, 
  fecha, 
  imagenUrl, 
  tipo 
}: ModalDetalleProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-[#0A3D62]">{titulo}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {fecha && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar size={14} className="text-[#FFC300]" />
                <span>{fecha}</span>
              </div>
            )}

            {tipo === 'video' && urlExterno && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(urlExterno)}`}
                  title={titulo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {tipo === 'articulo' && imagenUrl && (
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <Image 
                  src={imagenUrl} 
                  alt={titulo} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}

            {tipo === 'articulo' && contenido && (
              <div 
                className="text-gray-800 text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: contenido }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}