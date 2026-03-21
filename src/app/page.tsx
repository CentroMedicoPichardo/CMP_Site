// src/app/(public)/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { HeroSection } from '@/components/public/home/HeroSection';
import { SaberPediatricoSection } from '@/components/public/home/SaberPediatricoSection';
import { ServiciosSection } from '@/components/public/home/ServiciosSection';
import { MedicoDestacadoSection } from '@/components/public/home/MedicoDestacadoSection';
import { CursosSection } from '@/components/public/home/CursosSection';
import { Container } from '@/components/ui/Container';

export default function HomePublico() {
  const [data, setData] = useState<any>({
    servicios: [],
    cursos: [],
    medicoDestacado: null,
    todasLasNoticias: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHome = async () => {
      try {
        setLoading(true);
        const [resServicios, resCursos, resMedicos, resBlog] = await Promise.all([
          fetch('/api/servicios'),
          fetch('/api/cursos'),
          fetch('/api/medicos'),
          fetch('/api/publicaciones')
        ]);

        const [servs, curs, meds, blogResponse] = await Promise.all([
          resServicios.json(), 
          resCursos.json(), 
          resMedicos.json(), 
          resBlog.json()
        ]);

        setData({
          servicios: (Array.isArray(servs) ? servs : []).filter((s: any) => s.activo).slice(0, 3).map((s: any) => ({
            ...s,
            id: s.id || `servicio-${Math.random()}`,
            titulo: s.tituloServicio || s.titulo,
            descripcion: s.descripcion || "Atención médica especializada",
            ubicacion: s.ubicacion || "Huejutla, Hidalgo"
          })),
          cursos: (Array.isArray(curs) ? curs : []).filter((c: any) => c.activo).slice(0, 2),
          medicoDestacado: (() => {
            const listaMeds = Array.isArray(meds) ? meds : [];
            const pichardo = listaMeds.find((m: any) => m.nombre?.toUpperCase().includes("PICHARDO")) || listaMeds[0];
            if (!pichardo) return null;
            return {
              ...pichardo,
              id: pichardo.id || `medico-${Math.random()}`,
              imagenSrc: pichardo.imagen || "/Pichardo.jpg",
              nombre: pichardo.nombre || "Dr. Francisco Javier Moreno Pichardo",
              especialidad: pichardo.especialidad || "Pediatría",
              hospital: pichardo.hospital || "Centro Médico Pichardo",
              direccion: pichardo.direccion || "Huejutla, Hidalgo"
            };
          })(),
          todasLasNoticias: blogResponse.data || []
        });
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarHome();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={48} color="#0A3D62" />
        <p className="text-gray-600 font-medium">Cargando información...</p>
      </div>
    </div>
  );

  return (
    <main className="bg-white">
      <HeroSection />
      <SaberPediatricoSection noticias={data.todasLasNoticias} />
      <ServiciosSection servicios={data.servicios} />
      
      {data.medicoDestacado && (
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="max-w-4xl mx-auto">
              <MedicoDestacadoSection medico={data.medicoDestacado} />
            </div>
          </Container>
        </section>
      )}
      
      {data.cursos.length > 0 && (
        <CursosSection cursos={data.cursos} />
      )}
    </main>
  );
}