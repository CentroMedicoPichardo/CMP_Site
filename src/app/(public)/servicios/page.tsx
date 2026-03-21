// src/app/(public)/servicios/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ServiciosHeader } from '@/components/public/servicios/ServiciosHeader';
import { ServiciosLayout } from '@/components/public/servicios/ServiciosLayout';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/servicios');
        const data = await res.json();
        
        const serviciosFormateados = (Array.isArray(data) ? data : []).map((s: any) => ({
          id: s.id_servicio || `servicio-${Math.random()}`,
          titulo: s.tituloServicio || "Servicio",
          descripcion: s.descripcion || "Atención especializada con profesionales de excelencia.",
          imagenSrc: s.imagen || "/pediatric-illustration.png"
        }));
        
        setServicios(serviciosFormateados);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  // ✅ FILTRADO SEGURO - Con validación
  const serviciosFiltrados = servicios.filter(s => {
    // Si no hay búsqueda, mostrar todos
    if (!busqueda.trim()) return true;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    
    // Validar que titulo y descripcion existan antes de usar toLowerCase
    const tituloCoincide = s.titulo && s.titulo.toLowerCase().includes(busquedaLower);
    const descripcionCoincide = s.descripcion && s.descripcion.toLowerCase().includes(busquedaLower);
    
    return tituloCoincide || descripcionCoincide;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" size={48} color="#0A3D62" />
    </div>
  );

  return (
    <main className="bg-white min-h-screen">
      <ServiciosHeader 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />
      <div className="py-12">
        <ServiciosLayout servicios={serviciosFiltrados} />
      </div>
    </main>
  );
}