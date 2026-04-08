// src/app/(public)/quienes-somos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { QuienesSomosHeader } from '@/components/public/quienes-somos/QuienesSomosHeader';
import { HistoriaSection } from '@/components/public/quienes-somos/HistoriaSection';
import { MisionVisionValores } from '@/components/public/quienes-somos/MisionVisionValores';
import { EmpresaContacto } from '@/components/public/quienes-somos/EmpresaContacto';
import { MapaUbicacion } from '@/components/public/quienes-somos/MapaUbicacion';
import { RedesSociales } from '@/components/ui/RedesSociales';

interface NosotrosData {
  mision: string;
  vision: string;
  valores: string[];
  nuestraHistoria: string;
  compromiso: string;
  urlImagen: string;
}

interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
}

export default function QuienesSomosPage() {
  const [data, setData] = useState<NosotrosData | null>(null);
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nosotrosRes, empresaRes] = await Promise.all([
          fetch('/api/nosotros'),
          fetch('/api/empresa-info'),
        ]);

        if (!nosotrosRes.ok) throw new Error('Error al cargar información institucional');

        const nosotrosData = await nosotrosRes.json();
        setData(nosotrosData);

        if (empresaRes.ok) {
          const empresaData = await empresaRes.json();
          setEmpresaInfo(empresaData);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <p className="text-red-600">
            No se pudo cargar la información. Por favor, intente más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <QuienesSomosHeader />

      <div className="py-16">
        {/* Sección de Historia */}
        <HistoriaSection
          historia={data.nuestraHistoria}
          compromiso={data.compromiso}
          imagenSrc={data.urlImagen || '/pediatric-illustration.png'}
        />

        {/* Sección de Misión, Visión y Valores */}
        <MisionVisionValores
          mision={data.mision}
          vision={data.vision}
          valores={data.valores}
        />

        {/* Sección de Contacto y Mapa (en grid de 2 columnas) */}
        <div id="info-contacto" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
              {/* Información de contacto */}
              <EmpresaContacto empresaInfo={empresaInfo} />

              {/* Mapa de ubicación */}
              <MapaUbicacion direccion={empresaInfo?.direccion} />
            </div>
          </div>
        </div>
        {/* Sección de Redes Sociales - CON DISEÑO MEJORADO */}
      <RedesSociales variant="full" showText={true} />
      </div>
    </main>
  );
}