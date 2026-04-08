// src/components/public/saber-pediatrico/FiltrosCategoria.tsx
"use client";

import { FileText, Youtube, FileArchive, FileQuestion, LayoutGrid } from 'lucide-react';

type TipoContenido = 'todos' | 'articulos' | 'videos' | 'documentos' | 'encuestas';

interface FiltrosCategoriaProps {
  activeTab: TipoContenido;
  onTabChange: (tab: TipoContenido) => void;
  tabs: { id: TipoContenido; label: string; count: number }[];
}

const iconos = {
  todos: LayoutGrid,
  articulos: FileText,
  videos: Youtube,
  documentos: FileArchive,
  encuestas: FileQuestion
};

export function FiltrosCategoria({ activeTab, onTabChange, tabs }: FiltrosCategoriaProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = iconos[tab.id];
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all duration-200
                ${isActive 
                  ? 'bg-white text-[#0A3D62] border-t-2 border-l-2 border-r-2 border-gray-200 border-b-white -mb-px' 
                  : 'text-gray-500 hover:text-[#0A3D62] hover:bg-gray-50'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-[#FFC300]' : ''} />
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs ${isActive ? 'text-[#FFC300]' : 'text-gray-400'}`}>
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}