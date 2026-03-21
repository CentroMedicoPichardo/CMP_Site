// src/components/public/home/SaberPediatricoCTA.tsx
import Link from 'next/link';
import { GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import { publicRoutes } from '@/config/routes';

interface SaberPediatricoCTAProps {
  variant: 'academia' | 'blog';
}

export function SaberPediatricoCTA({ variant }: SaberPediatricoCTAProps) {
  if (variant === 'academia') {
    return (
      <Link 
        href={publicRoutes.saberPediatrico + "/academia"}
        className="block group"
      >
        <div className="bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300">
          <GraduationCap size={40} className="text-[#FFC300] mb-4" />
          <h4 className="text-2xl font-bold mb-2 group-hover:text-[#FFC300] transition-colors">
            Academia Infantil
          </h4>
          <p className="text-white/80 mb-4">
            Cursos y talleres para el desarrollo de tus pequeños
          </p>
          <div className="flex items-center text-[#FFC300] font-medium">
            <span>Explorar cursos</span>
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={publicRoutes.saberPediatrico + "/blog"}
      className="block group"
    >
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#FFC300] hover:shadow-lg transition-all duration-300">
        <BookOpen size={40} className="text-[#0A3D62] mb-4" />
        <h4 className="text-2xl font-bold text-[#0A3D62] mb-2 group-hover:text-[#FFC300] transition-colors">
          Blog de Salud
        </h4>
        <p className="text-gray-600 mb-4">
          Consejos y artículos sobre cuidado infantil
        </p>
        <div className="flex items-center text-[#0A3D62] font-medium group-hover:text-[#FFC300]">
          <span>Leer artículos</span>
          <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}