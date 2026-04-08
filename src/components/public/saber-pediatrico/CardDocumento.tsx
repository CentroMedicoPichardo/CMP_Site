// src/components/public/saber-pediatrico/CardDocumento.tsx
"use client";

import { FileText, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface CardDocumentoProps {
  id: number;
  titulo: string;
  descripcion: string;
  archivoUrl: string;
  fechaPublicacion: string;
}

export function CardDocumento({ id, titulo, descripcion, archivoUrl, fechaPublicacion }: CardDocumentoProps) {
    const fecha = new Date(fechaPublicacion).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
    });

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex items-center p-4 gap-4">
        {/* Icono de documento - más pequeño */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={24} className="text-white" />
        </div>

        {/* Contenido - más compacto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={10} />
              <span>{fecha}</span>
            </div>
          </div>
          
          <h3 className="text-base font-bold text-[#0A3D62] mb-1 line-clamp-1 group-hover:text-[#FFC300] transition-colors">
            {titulo}
          </h3>
          
          <p className="text-gray-500 text-xs line-clamp-1 mb-2">
            {descripcion}
          </p>

          <Link
            href={archivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFC300] hover:text-[#0A3D62] transition-colors"
          >
            <Eye size={12} />
            <span>Abrir documento</span>
          </Link>
        </div>
      </div>
    </div>
  );
}