// src/components/ui/RedesSociales.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Share2, Heart } from 'lucide-react';

interface EmpresaInfo {
  id: number;
  facebook: string | null;
  instagram: string | null;
}

interface RedesSocialesProps {
  variant?: 'horizontal' | 'compact' | 'full';
  showText?: boolean;
  className?: string;
}

export function RedesSociales({ 
  variant = 'full', 
  showText = true,
  className = '' 
}: RedesSocialesProps) {
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);

  useEffect(() => {
    const cargarEmpresaInfo = async () => {
      try {
        const res = await fetch('/api/empresa-info');
        if (res.ok) {
          const data = await res.json();
          setEmpresaInfo(data);
        }
      } catch (error) {
        console.error('Error cargando información:', error);
      }
    };
    cargarEmpresaInfo();
  }, []);

  if (!empresaInfo) return null;
  if (!empresaInfo.facebook && !empresaInfo.instagram) return null;

  const redes = [
    {
      nombre: 'Facebook',
      url: empresaInfo.facebook,
      icon: Facebook,
      color: '#1877F2',
      bgColor: 'bg-[#1877F2]',
      bgLight: 'bg-[#1877F2]/10',
      textColor: 'text-[#1877F2]',
      description: 'Síguenos en Facebook para más contenido'
    },
    {
      nombre: 'Instagram',
      url: empresaInfo.instagram,
      icon: Instagram,
      color: '#E4405F',
      bgColor: 'bg-gradient-to-r from-[#E4405F] to-[#F56040]',
      bgLight: 'bg-[#E4405F]/10',
      textColor: 'text-[#E4405F]',
      description: 'Síguenos en Instagram para contenido visual'
    }
  ].filter(red => red.url);

  if (variant === 'compact') {
    return (
      <div className={`flex justify-center gap-4 ${className}`}>
        {redes.map((red) => {
          const Icon = red.icon;
          return (
            <a
              key={red.nombre}
              href={red.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label={red.nombre}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${red.bgColor} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {red.nombre}
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // Versión completa con colores visibles
  return (
    <div className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado decorativo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFF9E6] px-4 py-2">
            <Heart size={16} className="text-[#FFC300]" />
            <span className="text-sm font-medium text-[#0A3D62]">CONECTA CON NOSOTROS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A3D62] mt-4 mb-2">
            Síguenos en Redes Sociales
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Mantente al día con nuestras actividades, promociones y contenido educativo
          </p>
        </div>

        {/* Tarjetas de redes sociales con colores visibles */}
        <div className="flex flex-wrap justify-center gap-6">
          {redes.map((red) => {
            const Icon = red.icon;
            return (
              <a
                key={red.nombre}
                href={red.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-64 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 group-hover:shadow-xl ${red.bgLight}`}>
                  {/* Cabecera con color de fondo de la red social */}
                  <div className={`h-24 flex items-center justify-center ${red.bgColor}`}>
                    <Icon size={48} className="text-white drop-shadow-md" />
                  </div>
                  <div className="p-5 text-center bg-white">
                    <h3 className={`text-lg font-bold mb-1 ${red.textColor}`}>{red.nombre}</h3>
                    <p className="text-xs text-gray-500">{red.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#FFC300] group-hover:gap-2 transition-all">
                      <span>Seguir</span>
                      <Share2 size={14} />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Badge de comunidad */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-[#FFC300] flex items-center justify-center text-[10px] font-bold text-[#0A3D62]">1k</div>
              <div className="h-6 w-6 rounded-full bg-[#0A3D62] flex items-center justify-center text-[10px] font-bold text-white">+500</div>
            </div>
            <span className="text-xs text-gray-500">Personas ya nos siguen</span>
          </div>
        </div>
      </div>
    </div>
  );
}