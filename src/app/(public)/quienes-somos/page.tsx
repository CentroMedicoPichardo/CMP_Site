// src/app/(public)/quienes-somos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { QuienesSomosHeader } from '@/components/public/quienes-somos/QuienesSomosHeader';
import { HistoriaSection } from '@/components/public/quienes-somos/HistoriaSection';
import { MisionVisionValores } from '@/components/public/quienes-somos/MisionVisionValores';

// Interfaz basada en la API
interface NosotrosData {
  mision: string;
  vision: string;
  valores: string[];
  nuestraHistoria: string;
  compromiso: string;
  urlImagen: string;
}

export default function QuienesSomosPage() {
  const [data, setData] = useState<NosotrosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNosotros = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/nosotros');
        if (!res.ok) throw new Error('Error al cargar la información');
        
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNosotros();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <p className="text-red-600">No se pudo cargar la información. Por favor, intente más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <QuienesSomosHeader />
      
      <div className="py-16">
        {/* SECCIÓN 1: HISTORIA */}
        <HistoriaSection 
          historia={data.nuestraHistoria}
          compromiso={data.compromiso}
          imagenSrc={data.urlImagen || "/pediatric-illustration.png"}
        />
        
        {/* SECCIÓN 2: MISIÓN, VISIÓN Y VALORES */}
        <MisionVisionValores 
          mision={data.mision}
          vision={data.vision}
          valores={data.valores}
        />
      </div>
    </main>
  );
}