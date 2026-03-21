// src/components/public/cards/MedicoCard.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building, ChevronRight, Award } from 'lucide-react';

interface MedicoCardProps {
  id: string | number;
  imagenSrc: string;
  nombre: string;
  especialidad: string;
  hospital: string;
  direccion: string;
  linkVerMas?: string;
}

export function MedicoCard({ 
  id,
  imagenSrc, 
  nombre, 
  especialidad, 
  hospital, 
  direccion, 
  linkVerMas = `/medicos/${id}`
}: MedicoCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Foto del médico */}
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={imagenSrc}
          alt={`Dr. ${nombre}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge de especialidad flotante */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-[#FFC300] rounded-full text-xs font-bold text-[#0A3D62]">
          {especialidad}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#0A3D62] mb-3 group-hover:text-[#FFC300] transition-colors">
          {nombre}
        </h3>
        
        {/* Hospital */}
        <div className="flex items-start gap-3 mb-3">
          <Building size={18} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Hospital</p>
            <p className="font-medium text-gray-800">{hospital}</p>
          </div>
        </div>

        {/* Dirección */}
        <div className="flex items-start gap-3 mb-6">
          <MapPin size={18} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Ubicación</p>
            <p className="text-sm text-gray-600">{direccion}</p>
          </div>
        </div>

        {/* Botón ver más */}
        <Link 
          href={linkVerMas}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0A3D62] text-white rounded-xl hover:bg-[#FFC300] hover:text-[#0A3D62] font-semibold transition-all duration-300 group/btn"
        >
          <span>Ver perfil completo</span>
          <ChevronRight size={18} className="group/btn:hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}