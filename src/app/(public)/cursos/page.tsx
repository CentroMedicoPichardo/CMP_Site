// src/app/(public)/cursos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // ✅ Agregado para detectar cambios en la URL
import { Loader2 } from 'lucide-react';
import { CursosHeader } from '@/components/public/cursos/CursosHeader';
import { CursosLayout } from '@/components/public/cursos/CursosLayout';

// Tipos específicos
type ModalidadValor = 'Online' | 'Presencial' | 'Híbrido';
type DirigidoAValor = 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';

// Interfaz para Curso (basada en la nueva API)
interface Curso {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: ModalidadValor;
  dirigidoA: DirigidoAValor;
  estado: 'Activo' | 'Finalizado' | 'Próximamente';
  imagenSrc?: string;
  costo: number | 'Gratuito';
  ubicacion?: string;
  linkDetalle: string;
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // ✅ Obtenemos los parámetros de búsqueda actuales de la URL
  const searchParams = useSearchParams();

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        
        // ✅ Construimos la URL de la API incluyendo los parámetros de filtro actuales
        const queryParams = searchParams.toString();
        const url = queryParams ? `/api/cursos?${queryParams}` : '/api/cursos';
        
        const res = await fetch(url);
        const data = await res.json();
        
        console.log('📦 Datos de API (cursos):', data);

        // Formatear según la nueva estructura de la API
        const cursosFormateados: Curso[] = (Array.isArray(data) ? data : []).map((c: any) => {
          const costoNumerico = parseFloat(c.costo);
          const esGratuito = costoNumerico <= 0 || c.costo === "0.00";
          
          const inscripcionesAbiertas = c.activo && (c.cuposOcupados < c.cupoMaximo);
          
          let imagenSrc = "/default-curso.jpg";
          if (c.urlImagenPortada && c.urlImagenPortada !== "no_imagen_uwvduy") {
            if (c.urlImagenPortada.startsWith('http')) {
              imagenSrc = c.urlImagenPortada;
            } else if (c.urlImagenPortada.startsWith('/')) {
              imagenSrc = c.urlImagenPortada;
            } else {
              imagenSrc = `/${c.urlImagenPortada}`;
            }
          }

          return {
            id: c.idCurso || `curso-${Math.random()}`,
            titulo: c.tituloCurso || "Curso sin título",
            descripcion: c.descripcion || "Curso de formación",
            fechaInicio: c.fechaInicio || "Próximamente",
            fechaFin: c.fechaFin || "",
            fechaPublicacion: new Date().toLocaleDateString('es-MX'),
            inscripcionesAbiertas: inscripcionesAbiertas,
            cupoMaximo: c.cupoMaximo || 20,
            cupoInscrito: c.cuposOcupados || 0,
            instructor: c.instructorNombre || "Por asignar",
            horario: c.horario || "Por definir",
            // ✅ Usamos los nombres que vienen del JOIN en tu API
            modalidad: (c.modalidadNombre as ModalidadValor) || "Presencial",
            dirigidoA: (c.dirigidoA as DirigidoAValor) || "Padres",
            estado: c.activo ? 'Activo' : 'Finalizado',
            imagenSrc: imagenSrc,
            costo: esGratuito ? 'Gratuito' : costoNumerico,
            ubicacion: c.ubicacionNombre || "Huejutla, Hidalgo",
            linkDetalle: `/cursos/${c.idCurso}`
          };
        });
        
        setCursos(cursosFormateados);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, [searchParams]); // ✅ Se vuelve a ejecutar cuando cambian los filtros en la URL

  // Búsqueda simple por texto (local)
  const cursosFiltrados = cursos.filter(curso => {
    if (!busqueda.trim()) return true;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    return (
      curso.titulo?.toLowerCase().includes(busquedaLower) ||
      curso.descripcion?.toLowerCase().includes(busquedaLower) ||
      curso.instructor?.toLowerCase().includes(busquedaLower)
    );
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" size={48} color="#0A3D62" />
    </div>
  );

  return (
    <main className="bg-white min-h-screen">
      <CursosHeader 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />
      
      <div className="py-12">
        <CursosLayout cursos={cursosFiltrados} />
      </div>
    </main>
  );
}