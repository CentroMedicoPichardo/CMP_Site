// src/components/public/saber-pediatrico/SaberPediatricoHeader.tsx
"use client";

import { GraduationCap, Heart, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function SaberPediatricoHeader() {
  return (
    <section className="relative bg-gradient-to-b from-[#0A3D62] to-[#1A4F7A] text-white overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#FFC300] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#2D6A9F] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FFC300] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <Container>
        <div className="relative py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <GraduationCap size={18} className="text-[#FFC300]" />
            <span className="text-sm font-medium">SABER PEDIÁTRICO</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tu guía confiable en el{' '}
            <span className="text-[#FFC300]">camino de la crianza</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Unificamos la experiencia clínica de nuestro equipo médico con consejos prácticos 
            para el día a día. Desde guías interactivas hasta respuestas a las dudas más 
            frecuentes en el consultorio.
          </p>

          {/* Badges decorativos */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Heart size={14} className="text-[#FFC300]" />
              <span className="text-xs">Para toda la familia</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Sparkles size={14} className="text-[#FFC300]" />
              <span className="text-xs">Contenido educativo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <GraduationCap size={14} className="text-[#FFC300]" />
              <span className="text-xs">Expertos en pediatría</span>
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