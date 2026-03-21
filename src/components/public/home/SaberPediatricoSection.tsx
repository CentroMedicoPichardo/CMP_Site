// src/components/public/home/SaberPediatricoSection.tsx
import Link from 'next/link';
import { GraduationCap, ChevronRight, ArrowRight, Heart, BookOpen, Video } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { NoticiasCarrusel } from './NoticiasCarrusel';
import { publicRoutes } from '@/config/routes';

interface SaberPediatricoSectionProps {
  noticias: any[];
}

export function SaberPediatricoSection({ noticias }: SaberPediatricoSectionProps) {
  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Encabezado - Jerarquía corregida: Título principal más grande */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#0A3D62] mb-6">
            Saber Pediátrico
          </h2>
          
          <div className="w-24 h-1 bg-[#FFC300] mx-auto mb-8"></div>
          
          <p className="text-2xl md:text-3xl text-gray-700 font-light mb-6 leading-tight">
            Tu guía confiable en el camino de la crianza
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Unificamos la experiencia clínica de nuestro equipo médico con consejos prácticos 
            para el día a día. Desde guías interactivas sobre hitos del desarrollo hasta 
            respuestas a las dudas más frecuentes en el consultorio.
          </p>
        </div>

        {/* Grid de 2 columnas */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Columna izquierda: Artículos */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 h-full border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#FFF9E6] rounded-xl">
                  <BookOpen size={24} className="text-[#FFC300]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A3D62]">Artículos de actualidad pediátrica</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Información actualizada y consejos prácticos para el cuidado de tus pequeños, 
                escritos por nuestro equipo de especialistas.
              </p>
              
              {noticias.length > 0 ? (
                <NoticiasCarrusel noticias={noticias} />
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <p className="text-gray-500">Próximamente contenido educativo</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Recursos multimedia */}
          <div className="space-y-6">
            {/* Videoblog */}
            <div className="bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Video size={24} className="text-[#FFC300]" />
                </div>
                <h3 className="text-2xl font-bold">Videoblog</h3>
              </div>
              <p className="text-white/80 mb-6">
                Respuestas a las dudas más frecuentes en el consultorio, directamente de nuestros especialistas.
              </p>
              <Link 
                href={`${publicRoutes.saberPediatrico}/videos`}
                className="inline-flex items-center gap-2 text-[#FFC300] font-medium hover:text-white transition-colors group"
              >
                <span>Ver videos</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Guías interactivas */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-[#FFC300] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#FFF9E6] rounded-xl">
                  <Heart size={24} className="text-[#FFC300]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A3D62]">Guías de desarrollo</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Hitos del desarrollo, nutrición infantil y guías interactivas para cada etapa de crecimiento.
              </p>
              <Link 
                href={`${publicRoutes.saberPediatrico}/guias`}
                className="inline-flex items-center gap-2 text-[#0A3D62] font-medium hover:text-[#FFC300] transition-colors group"
              >
                <span>Explorar guías</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Cursos especializados */}
            <div className="bg-gradient-to-br from-[#FFC300] to-[#FFD700] rounded-2xl p-6">
              <p className="text-[#0A3D62] font-semibold mb-2">
                ¿Buscas formación más profunda?
              </p>
              <p className="text-[#0A3D62]/80 text-sm mb-4">
                Explora nuestros talleres y cursos especializados para una paternidad informada y segura.
              </p>
              <Link 
                href={publicRoutes.cursos}
                className="inline-flex items-center gap-2 bg-[#0A3D62] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1A4F7A] transition-all group"
              >
                <span>Ver cursos y talleres</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enlace a todo Saber Pediátrico */}
        <div className="text-center mt-16">
          <Link 
            href={publicRoutes.saberPediatrico}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A3D62] text-white rounded-xl hover:bg-[#FFC300] hover:text-[#0A3D62] font-medium text-lg transition-all duration-300 group"
          >
            <span>Explorar todo Saber Pediátrico</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </section>
  );
}