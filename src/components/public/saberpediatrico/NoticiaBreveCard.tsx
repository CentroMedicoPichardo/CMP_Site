// src/components/public/cards/NoticiaBreveCard.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Tag, ChevronRight } from 'lucide-react';

interface NoticiaBreveCardProps {
  id: string | number;
  imagenSrc: string;
  titulo: string;
  bajada: string;
  autor?: string;
  fecha: string;
  linkVerMas: string;
  etiquetas: string[];
}

export function NoticiaBreveCard({ 
  id,
  imagenSrc, 
  titulo, 
  bajada, 
  autor,
  fecha,
  linkVerMas,
  etiquetas
}: NoticiaBreveCardProps) {

  const etiquetasVisibles = etiquetas.slice(0, 2);
  const tieneMasEtiquetas = etiquetas.length > 2;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      
      {/* Imagen */}
      <div className="relative md:w-48 h-48 md:h-auto overflow-hidden">
        <Image 
          src={imagenSrc}
          alt={titulo}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/20 to-transparent"></div>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 p-6">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-500">
          {autor && (
            <div className="flex items-center gap-1">
              <User size={12} className="text-[#FFC300]" />
              <span>{autor}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-[#FFC300]" />
            <span>{fecha}</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-[#0A3D62] mb-2 group-hover:text-[#FFC300] transition-colors">
          {titulo}
        </h3>

        {/* Bajada */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {bajada}
        </p>

        {/* Etiquetas - CORREGIDO: todas tienen key única */}
        {etiquetasVisibles.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-[#FFC300]" />
            <div className="flex flex-wrap gap-2">
              {etiquetasVisibles.map((tag, index) => (
                <span 
                  key={`${tag}-${index}`}  // ✅ Key única combinando tag + índice
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {tieneMasEtiquetas && (
                <span 
                  key="more-tags"  // ✅ Key única para el botón de "más"
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                >
                  +{etiquetas.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <Link 
            href={linkVerMas}
            className="inline-flex items-center gap-2 text-[#0A3D62] font-semibold hover:text-[#FFC300] transition-colors group/link"
          >
            <span>Leer más</span>
            <ChevronRight size={18} className="group/link:hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}