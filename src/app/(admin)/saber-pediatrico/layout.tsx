// src/app/(admin)/saber-pediatrico/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { FileText, Youtube, FileArchive, FileQuestion } from 'lucide-react';

const tabs = [
  {
    label: "Artículos",
    href: "/saber-pediatrico/articulos",
    icon: FileText,
    description: "Gestionar artículos educativos"
  },
  {
    label: "Videos",
    href: "/saber-pediatrico/videos",
    icon: Youtube,
    description: "Gestionar videos de YouTube"
  },
  {
    label: "Documentos",
    href: "/saber-pediatrico/documentos",
    icon: FileArchive,
    description: "Gestionar documentos descargables"
  },
  {
    label: "Encuestas",
    href: "/saber-pediatrico/encuestas",
    icon: FileQuestion,
    description: "Gestionar encuestas"
  }
];

export default function SaberPediatricoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Saber Pediátrico</h1>
            <p className="text-gray-600 mt-1">Gestión de contenido educativo para padres y cuidadores</p>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
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
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenido de la página */}
      {children}
    </div>
  );
}