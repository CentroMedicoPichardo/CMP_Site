// src/app/(admin)/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/admin/dashboard-admin/DashboardHeader';
import { StatsCards } from '@/components/admin/dashboard-admin/StatsCards';
import { CursosRecientes } from '@/components/admin/dashboard-admin/CursosRecientes';
import { UsuariosActivos } from '@/components/admin/dashboard-admin/UsuariosActivos';
import { InscripcionesRecientes } from '@/components/admin/dashboard-admin/InscripcionesRecientes';
import { AlertasSistema } from '@/components/admin/dashboard-admin/AlertasSistema';
import { ActividadReciente } from '@/components/admin/dashboard-admin/ActividadReciente';
import { MetricasRapidas } from '@/components/admin/dashboard-admin/MetricasRapidas';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardData {
  stats: {
    totalUsuarios: number;
    totalCursos: number;
    totalInscripciones: number;
    ingresosTotales: number;
    cursosActivos: number;
    usuariosNuevosMes: number;
    tasaOcupacion: number;
  };
  cursosRecientes: any[];
  usuariosActivos: any[];
  inscripcionesRecientes: any[];
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard-admin');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#FFC300] mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="ml-auto text-yellow-700 hover:text-yellow-900"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        )}

        <DashboardHeader />
        <StatsCards stats={data?.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CursosRecientes cursos={data?.cursosRecientes || []} />
          <UsuariosActivos usuarios={data?.usuariosActivos || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InscripcionesRecientes inscripciones={data?.inscripcionesRecientes || []} />
          <AlertasSistema />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActividadReciente />
          <MetricasRapidas stats={data?.stats} />
        </div>
      </div>
    </div>
  );
}