// src/components/admin/saber-pediatrico/shared/ContenidoCard.tsx
"use client";

import { Edit2, Eye, EyeOff, Calendar, ExternalLink, FileText, Youtube, FileArchive, FileQuestion } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ContenidoCardProps {
  id: number;
  tipo: 'articulo' | 'video' | 'documento' | 'encuesta';
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaPublicacion: string;
  destacado: boolean;
  activo: boolean;
  onEdit: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
}

const tipoConfig = {
  articulo: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Artículo' },
  video: { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', label: 'Video' },
  documento: { icon: FileArchive, color: 'text-green-600', bg: 'bg-green-50', label: 'Documento' },
  encuesta: { icon: FileQuestion, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Encuesta' },
};

export function ContenidoCard({ 
  id, 
  tipo, 
  titulo, 
  descripcion, 
  imagenUrl, 
  fechaPublicacion, 
  destacado, 
  activo, 
  onEdit, 
  onToggleActivo 
}: ContenidoCardProps) {
  const config = tipoConfig[tipo];
  const Icon = config.icon;
  const fecha = new Date(fechaPublicacion).toLocaleDateString('es-MX');

  return (
    <div className={`
      group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
      ${!activo ? 'opacity-60 hover:opacity-100' : ''}
      ${destacado ? 'ring-2 ring-[#FFC300]' : ''}
    `}>
      {/* Imagen o placeholder */}
      <div className="relative h-40 overflow-hidden">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full ${config.bg} flex items-center justify-center`}>
            <Icon size={48} className={config.color} />
          </div>
        )}
        
        {/* Badge de tipo */}
        <div className={`absolute top-4 left-4 px-2 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.color} flex items-center gap-1`}>
          <Icon size={12} />
          {config.label}
        </div>

        {/* Badge de destacado */}
        {destacado && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-semibold bg-[#FFC300] text-[#0A3D62]">
            Destacado
          </div>
        )}

        {/* Badge de estado */}
        <div className={`absolute bottom-4 right-4 px-2 py-1 rounded-lg text-xs font-semibold ${
          activo 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {activo ? 'Activo' : 'Inactivo'}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0A3D62] mb-2 line-clamp-2 group-hover:text-[#FFC300] transition-colors">
          {titulo}
        </h3>
        
        {descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {descripcion}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Calendar size={12} />
          <span>{fecha}</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 text-sm"
          >
            <Edit2 size={16} />
            Editar
          </button>
          <button
            onClick={() => onToggleActivo(id, activo)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
              activo
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            title={activo ? 'Ocultar' : 'Mostrar'}
          >
            {activo ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}