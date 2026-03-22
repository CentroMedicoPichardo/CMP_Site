// src/components/admin/quienes-somos/QuienesSomosPreview.tsx
'use client';

import Image from 'next/image';
import { Target, Eye, Heart, BookOpen, Award } from 'lucide-react';
import type { QuienesSomosData } from '@/types/quienes-somos';

interface QuienesSomosPreviewProps {
  data: QuienesSomosData;
}

export function QuienesSomosPreview({ data }: QuienesSomosPreviewProps) {
  const getValidImageUrl = (url: string) => {
    if (!url || url === 'no_imagen_uwvduy') return '/pediatric-illustration.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 border border-[#FFC300]/20">
      {/* Header de vista previa */}
      <div className="bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] px-6 py-4">
        <h2 className="text-white font-bold text-lg">Vista Previa</h2>
        <p className="text-white/70 text-sm">Cómo se verá en la página pública</p>
      </div>

      {/* Contenido de vista previa */}
      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Imagen */}
        {data.urlImagen && (
          <div className="relative h-48 rounded-xl overflow-hidden">
            <Image
              src={getValidImageUrl(data.urlImagen)}
              alt="Vista previa"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Historia */}
        <div>
          <h3 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-[#FFC300]" />
            Nuestra Historia
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {data.nuestraHistoria || 'Agrega la historia del centro médico...'}
          </p>
        </div>

        {/* Compromiso */}
        <div className="bg-[#FFF9E6] rounded-xl p-4 border-l-4 border-[#FFC300]">
          <h3 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
            <Award size={18} className="text-[#FFC300]" />
            Nuestro Compromiso
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {data.compromiso || 'Describe el compromiso...'}
          </p>
          <p className="text-[#0A3D62] font-semibold mt-2 text-sm">
            ¡Su tranquilidad es nuestro motor!
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
              <Target size={16} className="text-[#FFC300]" />
              Misión
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {data.mision || 'Nuestra misión...'}
            </p>
          </div>
          <div>
            <h3 className="text-md font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
              <Eye size={16} className="text-[#FFC300]" />
              Visión
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {data.vision || 'Nuestra visión...'}
            </p>
          </div>
        </div>

        {/* Valores */}
        <div>
          <h3 className="text-md font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
            <Heart size={16} className="text-[#FFC300]" />
            Valores
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.valores && data.valores.length > 0 ? (
              data.valores.map((valor, index) => (
                <span key={index} className="px-2 py-1 bg-[#FFF9E6] rounded-full text-xs text-gray-700 border border-[#FFC300]/30">
                  {valor}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Agrega valores...</span>
            )}
          </div>
        </div>

        {/* Mensaje de actualización en vivo */}
        <div className="text-center pt-4 border-t border-gray-100">
          <span className="text-xs text-green-600 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Actualización en tiempo real
          </span>
        </div>
      </div>
    </div>
  );
}