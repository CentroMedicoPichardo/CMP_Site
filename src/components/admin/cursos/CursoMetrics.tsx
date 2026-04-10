// src/components/admin/cursos/CursoMetrics.tsx
'use client';

import { TrendingUp, Users, Clock, Target, Activity, Percent } from 'lucide-react';
import type { Curso, CursoAnalytics } from '@/types/cursos';

interface CursoMetricsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

export function CursoMetrics({ curso, analytics }: CursoMetricsProps) {
  // Normalizar valores numéricos (convertir string a number si es necesario)
  const cuposOcupados = typeof curso.cuposOcupados === 'number' 
    ? curso.cuposOcupados 
    : Number(curso.cuposOcupados) || 0;
    
  const cupoMaximo = typeof curso.cupoMaximo === 'number' 
    ? curso.cupoMaximo 
    : Number(curso.cupoMaximo) || 1;
    
  const ocupacion = cupoMaximo > 0 ? (cuposOcupados / cupoMaximo) * 100 : 0;
  const disponibilidad = cupoMaximo - cuposOcupados;
  
  // Normalizar velocidad de inscripción
  const velocidadInscripcion = typeof analytics?.velocidadInscripcion === 'number'
    ? analytics.velocidadInscripcion
    : Number(analytics?.velocidadInscripcion) || 0;
    
  const tasaConversion = typeof analytics?.tasaConversion === 'number'
    ? analytics.tasaConversion
    : Number(analytics?.tasaConversion) || 0;
  
  const metrics = [
    {
      title: 'Ocupación Actual',
      value: `${ocupacion.toFixed(1)}%`,
      icon: Percent,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      sub: `${cuposOcupados} de ${cupoMaximo} lugares`
    },
    {
      title: 'Lugares Disponibles',
      value: disponibilidad,
      icon: Users,
      color: disponibilidad < 5 ? 'text-red-600' : 'text-green-600',
      bg: disponibilidad < 5 ? 'bg-red-100' : 'bg-green-100',
      sub: disponibilidad < 5 ? '¡Últimos lugares!' : 'lugares disponibles'
    },
    {
      title: 'Velocidad de Inscripción',
      value: velocidadInscripcion.toFixed(1),
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      sub: 'inscripciones/día',
      suffix: '/día'
    },
    {
      title: 'Tasa de Conversión',
      value: tasaConversion.toFixed(1),
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      sub: 'de visitas a inscripciones',
      suffix: '%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${metric.bg}`}>
              <metric.icon className={metric.color} size={24} />
            </div>
            {analytics?.tendencia && (
              <span className={`text-sm font-medium ${Number(metric.value) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(metric.value) > 0 ? '↑' : '↓'} {Math.abs(analytics.tendencia)}%
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {metric.value}{metric.suffix || ''}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
          <p className="text-xs text-gray-400 mt-2">{metric.sub}</p>
        </div>
      ))}
    </div>
  );
}