// src/components/admin/saber-pediatrico/shared/ContenidoHeader.tsx
"use client";

import { Plus } from 'lucide-react';

interface ContenidoHeaderProps {
  title: string;
  description: string;
  totalItems: number;
  onCreateClick: () => void;
  buttonText?: string;
}

export function ContenidoHeader({ 
  title, 
  description, 
  totalItems, 
  onCreateClick,
  buttonText = "Nuevo"
}: ContenidoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#0A3D62]">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalItems} {totalItems === 1 ? 'elemento' : 'elementos'} encontrados
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] px-5 py-2.5 rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
      >
        <Plus size={18} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium">{buttonText}</span>
      </button>
    </div>
  );
}