// src/components/admin/dashboard-admin/StatsCards.tsx
'use client';

import { Users, BookOpen, Ticket, DollarSign, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats?: {
    totalUsuarios: number;
    totalCursos: number;
    totalInscripciones: number;
    ingresosTotales: number;
    cursosActivos: number;
    usuariosNuevosMes: number;
    tasaOcupacion: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const defaultStats = {
    totalUsuarios: 0,
    totalCursos: 0,
    totalInscripciones: 0,
    ingresosTotales: 0,
    cursosActivos: 0,
    usuariosNuevosMes: 0,
    tasaOcupacion: 0
  };

  const s = stats || defaultStats;

  const cards = [
    {
      title: 'Usuarios Totales',
      value: s.totalUsuarios,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      cambio: `+${s.usuariosNuevosMes} nuevos`
    },
    {
      title: 'Cursos Activos',
      value: s.cursosActivos,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-50',
      cambio: `${s.totalCursos} totales`
    },
    {
      title: 'Inscripciones',
      value: s.totalInscripciones,
      icon: Ticket,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      cambio: `${s.tasaOcupacion}% ocupación`
    },
    {
      title: 'Ingresos',
      value: `$${s.ingresosTotales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      cambio: 'totales'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          <p className="text-xs text-gray-400 mt-2">{card.cambio}</p>
        </div>
      ))}
    </div>
  );
}