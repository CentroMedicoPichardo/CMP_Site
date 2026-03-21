// src/components/public/home/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Stethoscope, Calendar, Users, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { publicRoutes } from '@/config/routes';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#0A3D62] via-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#FFC300] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#2D6A9F] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FFC300] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <Container>
        <div className="relative py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido izquierdo */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart size={16} className="text-[#FFC300]" />
                <span className="text-sm font-medium">Atención pediátrica de excelencia</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Bienvenido al{' '}
                <span className="text-[#FFC300] block mt-2">Centro Médico Pichardo</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Atención pediátrica de excelencia liderada por el{' '}
                <strong className="text-[#FFC300]">Dr. Francisco Javier Moreno Pichardo</strong>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={publicRoutes.servicios}>
                  <Button className="bg-[#FFC300] hover:bg-[#FFD700] text-[#0A3D62] font-semibold px-8 py-4 text-lg rounded-xl shadow-lg shadow-[#FFC300]/20 hover:shadow-xl transition-all">
                    <Heart size={20} className="mr-2" />
                    Nuestros Servicios
                  </Button>
                </Link>
                <Link href={publicRoutes.directorioMedico}>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">
                    <Stethoscope size={20} className="mr-2" />
                    Directorio Médico
                  </Button>
                </Link>
              </div>

              {/* Stats rápidas con información realista */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-[#FFC300]">15+</div>
                  <div className="text-sm text-white/70">Años de experiencia</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-[#FFC300]">8</div>
                  <div className="text-sm text-white/70">Especialidades</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-[#FFC300]">24/7</div>
                  <div className="text-sm text-white/70">Urgencias</div>
                </div>
              </div>

              {/* Información de contacto rápida */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#FFC300]" />
                  <span>Lun-Vie: 8am-8pm | Sáb: 8am-2pm</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#FFC300]" />
                  <span>Huejutla, Hidalgo</span>
                </div>
              </div>
            </div>

            {/* Imagen derecha */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                <Image
                  src="/hero-doctor.png"
                  alt="Doctor con niños"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Ola decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="relative block w-full h-[60px] text-white" preserveAspectRatio="none">
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="currentColor" fillOpacity="1"></path>
        </svg>
      </div>
    </section>
  );
}