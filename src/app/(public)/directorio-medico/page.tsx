// src/app/(public)/directorio-medico/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MedicoHeader } from '@/components/public/medico/MedicoHeader';
import { MedicoLayout } from '@/components/public/medico/MedicoLayout';

// Interfaz para los datos del médico (basada en la nueva API)
interface Medico {
  id: string | number;
  nombre: string; // Nombre completo combinado
  especialidad: string;
  hospital?: string;
  direccion?: string;
  imagenSrc: string;
}

export default function DirectorioMedicoPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
  const cargarMedicos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/medicos');
      const data = await res.json();

      console.log('📦 Datos CRUDOS de API:', data);

      const medicosFormateados = (Array.isArray(data) ? data : []).map((m: any) => {
        // Construir nombre completo
        const nombres = m.nombres || '';
        const apellidoPaterno = m.apellidoPaterno || '';
        const apellidoMaterno = m.apellidoMaterno || '';
        
        const nombreCompleto = [nombres, apellidoPaterno, apellidoMaterno]
          .filter(Boolean)
          .join(' ')
          .trim();

        // 👇 CORREGIR LA URL DE LA IMAGEN
        let imagenSrc = "/default-doctor.jpg"; // Valor por defecto
        
        // Si existe urlFoto y no es "no_imagen_uwvduy", usarla
        if (m.urlFoto && m.urlFoto !== "no_imagen_uwvduy") {
          // Si la URL no comienza con http o /, agregar / para que sea relativa
          if (m.urlFoto.startsWith('http')) {
            imagenSrc = m.urlFoto; // URL absoluta
          } else if (m.urlFoto.startsWith('/')) {
            imagenSrc = m.urlFoto; // Ya tiene slash
          } else {
            imagenSrc = `/${m.urlFoto}`; // Agregar slash al inicio
          }
        }

        return {
          id: m.idMedico || `medico-${Math.random()}`,
          nombre: nombreCompleto || "Médico",
          especialidad: m.especialidad || "Especialidad no especificada",
          hospital: m.hospitalClinica || "Centro Médico Pichardo",
          direccion: m.direccion || "Huejutla, Hidalgo",
          imagenSrc: imagenSrc, // 👈 Usar la URL corregida
        };
      });

      console.log('✅ Médicos formateados:', medicosFormateados);
      setMedicos(medicosFormateados);

    } catch (error) {
      console.error("Error al cargar médicos:", error);
    } finally {
      setLoading(false);
    }
  };

  cargarMedicos();
}, []);

  // --- Lógica de Filtrado ---
  const medicosFiltrados = medicos.filter(medico => {
    if (!busqueda.trim()) return true;

    const busquedaLower = busqueda.toLowerCase().trim();
    const nombreCoincide = medico.nombre?.toLowerCase().includes(busquedaLower);
    const especialidadCoincide = medico.especialidad?.toLowerCase().includes(busquedaLower);

    return nombreCoincide || especialidadCoincide;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <MedicoHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />
      <div className="py-12">
        <MedicoLayout medicos={medicosFiltrados} />
      </div>
    </main>
  );
}