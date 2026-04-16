// src/components/admin/dashboard-admin/MetricasRapidas.tsx
'use client';

import { TrendingUp, TrendingDown, Users, Target, Award, Clock } from 'lucide-react';

interface MetricasRapidasProps {
  stats?: {
    totalUsuarios: number;
    totalCursos: number;
    totalInscripciones: number;
    cursosActivos: number;
    usuariosNuevosMes: number;
    tasaOcupacion: number;
  };
}

export function MetricasRapidas({ stats }: MetricasRapidasProps) {
  const s = stats || {
    totalUsuarios: 0,
    totalCursos: 0,
    totalInscripciones: 0,
    cursosActivos: 0,
    usuariosNuevosMes: 0,
    tasaOcupacion: 0
  };

  const metricas = [
    {
      label: 'Tasa de conversión',
      valor: `${s.tasaOcupacion}%`,
      cambio: '+5%',
      positivo: true,
      icon: Target,
      color: 'text-purple-600'
    },
    {
      label: 'Usuarios activos',
      valor: s.totalUsuarios,
      cambio: `+${s.usuariosNuevosMes}`,
      positivo: true,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Cursos activos',
      valor: s.cursosActivos,
      cambio: `${s.totalCursos} totales`,
      positivo: true,
      icon: Award,
      color: 'text-green-600'
    },
    {
      label: 'Por inscripciones',
      valor: s.totalInscripciones,
      cambio: 'este mes',
      positivo: true,
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-[#0A3D62] mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-[#FFC300]" />
        Métricas Rápidas
      </h3>

      <div className="space-y-4">
        {metricas.map((metrica, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-white rounded-lg ${metrica.color}`}>
                <metrica.icon size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{metrica.label}</p>
                <p className="text-xl font-bold text-gray-800">{metrica.valor}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              metrica.positivo ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrica.positivo ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {metrica.cambio}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-[#0A3D62]/5 to-[#FFC300]/5 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Meta de inscripciones del mes</span>
          <span className="text-sm font-semibold text-[#0A3D62]">65%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#FFC300] rounded-full" style={{ width: '65%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Faltan inscripciones para cumplir la meta</p>
      </div>
    </div>
  );
}