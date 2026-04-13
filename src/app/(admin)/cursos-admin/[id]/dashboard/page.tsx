// src/app/(admin)/cursos-admin/[id]/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Users, Clock, AlertTriangle, Mail, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { CursoMetrics } from '@/components/admin/cursos/CursoMetrics';
import { CursoAlerts } from '@/components/admin/cursos/CursoAlerts';
import { GrowthModel } from '@/components/admin/cursos/GrowthModel';
import { MarketingActions } from '@/components/admin/cursos/MarketingActions';
import { InscripcionesAnalytics } from '@/components/admin/cursos/InscripcionesAnalytics';
import type { Curso, CursoAnalytics } from '@/types/cursos';
import { adminRoutes } from '@/config/routes';

export default function CursoDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [analytics, setAnalytics] = useState<CursoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cursoId = params.id;
        
        // Fetch curso
        const cursoRes = await fetch(`/api/cursos/${cursoId}`);
        if (!cursoRes.ok) {
          throw new Error(`Error al cargar curso: ${cursoRes.status}`);
        }
        const cursoData = await cursoRes.json();
        setCurso(cursoData);
        
        // Fetch analytics
        const analyticsRes = await fetch(`/api/cursos/${cursoId}/analytics`);
        if (!analyticsRes.ok) {
          throw new Error(`Error al cargar analytics: ${analyticsRes.status}`);
        }
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC300] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(adminRoutes.cursosadm)}
            className="px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#1A4F7A] transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Curso no encontrado</p>
          <button
            onClick={() => router.push(adminRoutes.cursosadm)}
            className="mt-4 px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#1A4F7A] transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  const cuposOcupados = typeof curso.cuposOcupados === 'number' 
    ? curso.cuposOcupados 
    : Number(curso.cuposOcupados) || 0;
  const cupoMaximo = typeof curso.cupoMaximo === 'number' 
    ? curso.cupoMaximo 
    : Number(curso.cupoMaximo) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(adminRoutes.cursosadm)}
            className="flex items-center gap-2 text-[#0A3D62] hover:text-[#FFC300] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a Cursos</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-[#FFC300]">
            <h1 className="text-2xl font-bold text-[#0A3D62]">{curso.tituloCurso}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {curso.fechaInicio && (
                <span className="flex items-center gap-1"><Calendar size={14} /> Inicio: {curso.fechaInicio}</span>
              )}
              <span className="flex items-center gap-1"><Users size={14} /> Cupo: {cuposOcupados}/{cupoMaximo}</span>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <CursoMetrics curso={curso} analytics={analytics} />

        {/* Alertas inteligentes */}
        <CursoAlerts curso={curso} analytics={analytics} />

        {/* Modelo de crecimiento */}
        <GrowthModel curso={curso} analytics={analytics} />

        {/* NUEVO: Análisis detallado de inscripciones */}
        <InscripcionesAnalytics curso={curso} analytics={analytics} />
        {/* Acciones de marketing */}
        <MarketingActions curso={curso} analytics={analytics} />
      </div>
    </div>
  );
}