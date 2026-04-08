// src/components/public/saber-pediatrico/CardEncuesta.tsx
"use client";

import { FileQuestion, Calendar, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CardEncuestaProps {
  id: number;
  titulo: string;
  descripcion: string;
  urlExterno: string;
  fechaFin?: string;
}

export function CardEncuesta({ id, titulo, descripcion, urlExterno, fechaFin }: CardEncuestaProps) {
  return (
    <div className="group bg-gradient-to-br from-[#FFF9E6] to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#FFC300]/30">
      <div className="p-6">
        <div className="w-14 h-14 bg-[#FFC300] rounded-xl flex items-center justify-center mb-4">
          <FileQuestion size={28} className="text-[#0A3D62]" />
        </div>
        
        <h3 className="text-xl font-bold text-[#0A3D62] mb-2 group-hover:text-[#FFC300] transition-colors">
          {titulo}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {descripcion}
        </p>

        {fechaFin && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar size={14} className="text-[#FFC300]" />
            <span>Finaliza: {new Date(fechaFin).toLocaleDateString('es-MX')}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users size={14} />
            <span>Tu opinión importa</span>
          </div>
          <Link
            href={urlExterno}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FFC300] hover:text-[#0A3D62] transition-colors group-hover:gap-3"
          >
            <span>Participar</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}