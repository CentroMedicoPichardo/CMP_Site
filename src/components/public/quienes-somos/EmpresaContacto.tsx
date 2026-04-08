// src/components/public/quienes-somos/EmpresaContacto.tsx
"use client";

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
}

interface EmpresaContactoProps {
  empresaInfo: EmpresaInfo | null;
}

export function EmpresaContacto({ empresaInfo }: EmpresaContactoProps) {
  if (!empresaInfo) return null;

  const contactItems = [
    { icon: MapPin, title: "Dirección", value: empresaInfo.direccion },
    { icon: Phone, title: "Teléfono", value: empresaInfo.telefono },
    { icon: Mail, title: "Correo Electrónico", value: empresaInfo.correo },
    { icon: Clock, title: "Horario de Atención", value: empresaInfo.horario, isSchedule: true }
  ];

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] px-5 py-4 text-white">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 h-20 w-20 rounded-full bg-[#FFC300]/20"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-20 w-20 rounded-full bg-[#FFC300]/10"></div>
        
        <h3 className="relative text-lg font-bold">Información de Contacto</h3>
        <p className="relative mt-1 text-sm text-white/80">
          Estamos aquí para atenderte
        </p>
      </div>

      {/* Tarjetas de contacto - verticales y compactas */}
      <div className="space-y-3">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFF9E6] transition-all duration-200 group-hover:bg-[#FFC300]">
                <Icon size={18} className="text-[#0A3D62] transition-colors group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {item.title}
                </p>
                {item.isSchedule ? (
                  <div className="mt-0.5 text-sm font-medium text-gray-800 whitespace-pre-line">
                    {item.value}
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm font-medium text-gray-800 break-all">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge de respuesta rápida - compacto */}
      <div className="flex items-center justify-center gap-2 rounded-full bg-[#FFF9E6] px-3 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-xs text-gray-600">Respuesta rápida</span>
      </div>
    </div>
  );
}